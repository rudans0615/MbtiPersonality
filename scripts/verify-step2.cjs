// node --env-file=.env scripts/verify-step2.cjs
// Requires local production server and Playwright (or NODE_PATH to bundled packages).
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const ts = require('typescript');
const { chromium } = require('playwright');
const { getFixture, expectedResult, db } = require('./generic-test-data.cjs');
const base = process.env.TEST_BASE_URL || 'http://localhost:3100';
const out = 'artifacts/step2';
const pass = text => console.log('PASS '+text);
const exportsObject = {};
vm.runInNewContext(ts.transpileModule(fs.readFileSync('src/lib/customTests/resolveGenericResult.ts','utf8'), {
  compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2020}
}).outputText, {exports:exportsObject});
const { getGenericScoring, resolveGenericResult } = exportsObject;
const resolve = (query, results, scoring) => resolveGenericResult(new URLSearchParams(query),results,scoring);
function unitTests() {
  const questions = Array.from({length:3},()=>({options:[{score:0,type_code:null},{score:2,type_code:null}]}));
  const scoring = getGenericScoring(questions);
  const results = {low:{min_score:0,max_score:2},high:{min_score:3,max_score:6}};
  for(const [score,key] of [[0,'low'],[2,'low'],[3,'high'],[6,'high']]) assert.equal(resolve('score='+score,results,scoring).key,key);
  for(const query of ['score=', 'score=1.5','score=1oops','score=-1','score=7','score=Infinity','score=9007199254740992','score=1&score=2','score=2&types=A','score=%25']) assert.equal(resolve(query,results,scoring).error,'invalid',query);
  assert.equal(resolve('',results,scoring).error,'missing');
  assert.equal(resolve('score=2',{low:{}},scoring).error,'unavailable');
  assert.equal(resolve('score=3',{low:results.low},scoring).error,'unavailable');
  assert.equal(resolve('score=0',{},scoring).error,'unavailable');
  assert.equal(resolve('score=0',results,getGenericScoring([])).error,'unavailable');
  for(const count of [1,3,4]) {
    const s=getGenericScoring(Array.from({length:count},()=>({options:[{type_code:'A',score:null},{type_code:'B',score:null},{type_code:'100%',score:null}]})));
    const r={A:{},B:{},'100%':{}};
    assert.equal(resolve('types='+encodeURIComponent(Array(count).fill('100%').join(',')),r,s).key,'100%');
    assert.equal(resolve('types='+Array(count).fill('A').join(','),r,s).key,'A');
    for(const query of ['types=UNKNOWN','types=constructor','types=__proto__','types=%','types=A&types=B','score=1','types=A&score=1']) assert.equal(resolve(query,r,s).error,'invalid');
    if(count===4) assert.equal(resolve('types=B,A,A,B',r,s).key,'B');
    if(count===3) assert.equal(resolve('types=B,A,A',r,s).key,'A');
  }
  const restricted=getGenericScoring([{options:[{type_code:'A',score:null}]},{options:[{type_code:'B',score:null}]}]);
  assert.equal(resolve('types=B,A',{A:{},B:{}},restricted).error,'invalid');
  for(const p of ['src/app/[testId]/TestClient.tsx','src/app/[testId]/results/ResultsClient.tsx']) {
    assert.doesNotMatch(fs.readFileSync(p,'utf8'),/5566778899|3344556677|3000|showInterstitial|isAnalyzing|decodeURIComponent/);
  }
  pass('Resolver score boundaries, malformed/duplicate/missing inputs, missing ranges, type frequency/ties, single decoding, 1/odd/even question counts');
}
async function auditData() {
  const {data:tests,error}=await db().from('tests').select('id,is_available');if(error)throw error;
  const audit=[];
  for(const t of tests.filter(t=>t.is_available&&!['mbti','teto-egen','drunk'].includes(t.id))) {
    const f=await getFixture(t.id), scoring=getGenericScoring(f.questions), issues=[];
    if(!f.questions.length)issues.push('no questions');
    if(!f.results.length)issues.push('no results');
    if(scoring.mode==='score'&&f.questions.length) {
      let totals=new Set([0]);
      for(const q of f.questions)totals=new Set([...totals].flatMap(total=>q.options.map(o=>total+(o.score??1))));
      const gaps=[...totals].sort((a,b)=>a-b).filter(score=>!f.results.some(r=>r.min_score!=null&&r.max_score!=null&&score>=r.min_score&&score<=r.max_score));
      if(gaps.length)issues.push('unmapped attainable scores: '+gaps.join(','));
    }
    audit.push({id:t.id,questionCount:f.questions.length,mode:scoring.mode,issues});
  }
  fs.writeFileSync(out+'/data-audit.json',JSON.stringify(audit,null,2));
  pass('Read-only audit of '+audit.length+' available generic tests; '+audit.filter(t=>t.issues.length).length+' require data follow-up');
}
(async()=>{
  fs.mkdirSync(out,{recursive:true});unitTests();await auditData();
  const browser=await chromium.launch({headless:true,channel:process.env.TEST_BROWSER_CHANNEL||'msedge'});
  const context=await browser.newContext();
  await context.route('**/*',route=>{
    const u=new URL(route.request().url());
    return u.origin!==new URL(base).origin||u.pathname.startsWith('/api/affiliates')?route.abort():route.continue();
  });
  await context.addInitScript(()=>{
    window.testEvents=[];window.observedSlots=[];window.adRequests=[];
    window.gtag=(...args)=>window.testEvents.push(args);
    window.adsbygoogle={push:()=>window.adRequests.push([...document.querySelectorAll('[data-ad-slot]')].map(el=>el.getAttribute('data-ad-slot')))};
    const capture=node=>{if(node.nodeType!==1)return;if(node.matches('[data-ad-slot]'))window.observedSlots.push(node.getAttribute('data-ad-slot'));node.querySelectorAll('[data-ad-slot]').forEach(el=>window.observedSlots.push(el.getAttribute('data-ad-slot')))};
    new MutationObserver(records=>records.forEach(record=>record.addedNodes.forEach(capture))).observe(document,{childList:true,subtree:true});
  });
  const page=await context.newPage(), errors=[];page.on('pageerror',e=>errors.push(e.message));
  const visible=text=>page.getByText(text,{exact:true}).first().waitFor();
  const heading=text=>page.getByRole('heading',{name:text,exact:true}).first().waitFor();
  const checkAds=async()=>{
    const seen=await page.evaluate(()=>[...window.observedSlots,...window.adRequests.flat()]);
    assert.ok(!seen.includes('5566778899')&&!seen.includes('3344556677'));
  };
  const completed=()=>page.evaluate(()=>window.testEvents.filter(e=>e[1]==='test_completed'));
  const noResultAds=async()=>{assert.equal(await page.locator('[data-ad-slot]').count(),0);assert.equal((await completed()).length,0);await checkAds()};
  try {
    for(const id of ['dopamine','hogu']) {
      const f=await getFixture(id), choices=f.questions.map(()=>0);
      await page.goto(base+'/'+id);await page.getByRole('button',{name:'지금 바로 알아보기 👉'}).click();
      await visible('1 / '+choices.length);
      await page.locator('button.w-full').first().evaluate(el=>{el.click();el.parentElement.querySelectorAll('button')[1].click()});
      await visible('2 / '+choices.length);await page.waitForTimeout(300);await visible('2 / '+choices.length);
      await page.getByRole('button',{name:'선택 다시하기'}).click();await visible('1 / '+choices.length);
      choices[0]=1;
      for(let i=0;i<choices.length;i++) {
        await visible((i+1)+' / '+choices.length);
        await page.locator('button.w-full').nth(choices[i]).click();
        if(i<choices.length-1)await visible((i+2)+' / '+choices.length);
      }
      const expected=expectedResult(f,choices);assert.ok(expected.result);
      await page.waitForURL('**/'+id+'/results?**');await heading(expected.result.title);
      assert.equal(new URL(page.url()).searchParams.toString(),new URLSearchParams(expected.query).toString());
      await page.waitForFunction(()=>window.testEvents.some(e=>e[1]==='test_completed'));
      assert.equal((await completed()).length,1);await checkAds();
      assert.equal(await page.locator('[data-ad-slot]').count(),3);
      await page.screenshot({path:out+'/'+id+'-desktop.png',fullPage:true,animations:'disabled'});
      // Native history changes exercise the same mounted useSearchParams consumer.
      const alternative=expectedResult(f,f.questions.map(q=>q.options.length-1));assert.ok(alternative.result);
      await page.evaluate(query=>history.pushState(null,'','?'+query),alternative.query);
      await heading(alternative.result.title);
      await page.waitForFunction(()=>window.testEvents.filter(e=>e[1]==='test_completed').length===2);
      await page.evaluate(query=>history.replaceState(null,'','?'+query),alternative.query);
      await page.waitForTimeout(150);assert.equal((await completed()).length,2);
      await page.evaluate(()=>history.pushState(null,'','?score=invalid'));
      await heading('검사 결과를 확인할 수 없습니다');assert.equal(await page.locator('[data-ad-slot]').count(),0);assert.equal((await completed()).length,2);
      await page.evaluate(query=>history.pushState(null,'','?'+query),alternative.query);await heading(alternative.result.title);assert.equal((await completed()).length,2);
      await page.setViewportSize({width:390,height:844});
      assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
      await page.screenshot({path:out+'/'+id+'-mobile.png',fullPage:true,animations:'disabled'});
      await page.getByRole('link',{name:'테스트 다시하기',exact:true}).click();await page.waitForURL('**/'+id);
      await page.screenshot({path:out+'/'+id+'-intro-mobile.png',fullPage:true,animations:'disabled'});
      await page.setViewportSize({width:1280,height:800});
      pass(id+': complete answers, back/re-answer, double click, exact URL/result, live URL updates, completion events, 3 retained ads, restart, desktop/mobile');
    }
    for(const path of ['/dopamine/results','/dopamine/results?types=FOCUS','/dopamine/results?types=%25','/hogu/results?score=2&score=3','/hogu/results?score=999999','/hogu/results?score=2.5']) {
      const response=await page.goto(base+path);assert.equal(response.status(),200);await heading('검사 결과를 확인할 수 없습니다');await noResultAds();
    }
    const missing=await getFixture('stalkerReactionTest'), expected=expectedResult(missing,missing.questions.map(()=>0));assert.equal(expected.result,undefined);
    await page.goto(base+'/stalkerReactionTest/results?'+expected.query);await heading('결과를 제공할 수 없습니다');await noResultAds();
    await page.setViewportSize({width:390,height:844});await page.screenshot({path:out+'/unavailable-mobile.png',fullPage:true,animations:'disabled'});
    assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
    pass('Missing/malformed URLs and incomplete DB ranges show ad-free guidance without completion events');
    assert.deepEqual(errors,[]);pass('No browser JavaScript exceptions; live ads and affiliate requests blocked');
  } finally {await browser.close()}
})().catch(e=>{console.error(e);process.exitCode=1});
