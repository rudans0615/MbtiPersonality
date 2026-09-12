// Isolated browser checks with real components and a mocked Next router.
// No application route or database fixture is added to the deployed service.
const { build } = require('esbuild');
const { chromium } = require('playwright');
const assert = require('node:assert/strict');
(async()=>{
  const bundle=await build({bundle:true,write:false,platform:'browser',jsx:'automatic',define:{'process.env.NODE_ENV':'"production"'},
    stdin:{resolveDir:process.cwd(),loader:'jsx',contents:`
      import React from 'react';
      import {createRoot} from 'react-dom/client';
      import TestClient from './src/app/[testId]/TestClient';
      import ResultsClient from './src/app/[testId]/results/ResultsClient';
      window.routes=[];window.testEvents=[];window.slots=[];window.adRequests=0;
      window.gtag=(...args)=>window.testEvents.push(args);
      window.adsbygoogle={push:()=>window.adRequests++};
      new MutationObserver(records=>records.forEach(r=>r.addedNodes.forEach(n=>{
        if(n.nodeType!==1)return;
        if(n.matches('[data-ad-slot]'))window.slots.push(n.getAttribute('data-ad-slot'));
        n.querySelectorAll('[data-ad-slot]').forEach(el=>window.slots.push(el.getAttribute('data-ad-slot')));
      }))).observe(document,{subtree:true,childList:true});
      const root=createRoot(document.getElementById('root'));let key=0;
      window.showTest=(count,mode)=>{
        window.routes=[];
        root.render(<TestClient key={++key} testId="fixture" testInfo={{title:'검증용 검사'}} seoArticle="" questions={Array.from({length:count},(_,i)=>({question:'문항 '+(i+1),options:mode==='types'?[{text:'선택 A',type:'A'},{text:'선택 B',type:'B'}]:[{text:'선택 A',score:0},{text:'선택 B',score:2}]}))}/>);
      };
      window.showLoading=()=>{
        window.blocked=true;window.waiting=new Promise(resolve=>window.release=()=>{window.blocked=false;resolve()});
        root.render(<ResultsClient key={++key} testId="fixture" testInfo={{title:'검증용 검사'}} allKeys={['A']} resultsData={{A:{title:'정상 결과',min_score:0,max_score:2}}} qLen={1} scoring={{mode:'score',questionCount:1,allowedTypes:[[]],minScore:0,maxScore:2}} availableTests={[]}/>);
      };
    `},plugins:[{name:'next-test-adapters',setup(b){
      b.onResolve({filter:/^next\/(navigation|link)$/},args=>({path:args.path,namespace:'test'}));
      b.onLoad({filter:/.*/,namespace:'test'},args=>({loader:'jsx',contents:args.path==='next/navigation'
        ? `export const useRouter=()=>({push:url=>window.routes.push(url)});export const useSearchParams=()=>{if(window.blocked)throw window.waiting;return new URLSearchParams('score=2')};`
        : `import React from 'react';export default function Link({children,...props}){return <a {...props}>{children}</a>}` ,resolveDir:process.cwd()}));
      b.onResolve({filter:/^@\/components\/(CoupangRecommend|ShareButtons|ResultImageCard|RelatedTests)$/},args=>({path:args.path,namespace:'display'}));
      b.onLoad({filter:/.*/,namespace:'display'},()=>({contents:'export const CoupangRecommend=()=>null;export const ShareButtons=()=>null;export const ResultImageCard=()=>null;export default ()=>null;'}));
    }}]});
  const browser=await chromium.launch({headless:true,channel:process.env.TEST_BROWSER_CHANNEL||'msedge'});
  try {
    const page=await browser.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));
    await page.setContent('<div id="root"></div>');await page.addScriptTag({content:bundle.outputFiles[0].text});
    for(const mode of ['score','types'])for(const count of [1,3,4]) {
      await page.evaluate(({count,mode})=>window.showTest(count,mode),{count,mode});
      await page.getByRole('button',{name:'지금 바로 알아보기 👉'}).click();
      for(let i=1;i<=count;i++) {
        await page.getByText(i+' / '+count,{exact:true}).waitFor();
        await page.getByRole('button',{name:'선택 B',exact:true}).evaluate(el=>{el.click();el.parentElement.querySelector('button').click()});
      }
      await page.waitForFunction(()=>window.routes.length===1);
      // Router intentionally never unmounts the screen: final-answer lock must persist.
      await page.waitForTimeout(250);
      assert.equal(await page.getByRole('button',{name:'선택 B',exact:true}).isDisabled(),true);
      await page.getByRole('button',{name:'선택 B',exact:true}).evaluate(el=>el.click());
      const routes=await page.evaluate(()=>window.routes);assert.equal(routes.length,1);
      const url=new URL(routes[0],'http://test');
      assert.equal(url.searchParams.get(mode==='score'?'score':'types'),mode==='score'?String(count*2):Array(count).fill('B').join(','));
      console.log('PASS component '+mode+' '+count+' questions: no middle pause, final answer included, duplicate clicks locked during delayed navigation');
    }
    await page.evaluate(()=>window.showLoading());
    await page.getByRole('status').getByText('결과를 불러오는 중입니다.').waitFor();
    assert.equal(await page.locator('[data-ad-slot]').count(),0);
    const before=await page.evaluate(()=>window.adRequests);
    await page.waitForTimeout(100);assert.equal(await page.evaluate(()=>window.adRequests),before);
    assert.equal(await page.evaluate(()=>window.testEvents.filter(e=>e[1]==='test_completed').length),0);
    await page.evaluate(()=>window.release());await page.getByRole('heading',{name:'정상 결과',exact:true}).waitFor();
    await page.waitForFunction(()=>window.testEvents.some(e=>e[1]==='test_completed'));
    assert.equal(await page.locator('[data-ad-slot]').count(),3);
    assert.equal(await page.evaluate(()=>window.testEvents.filter(e=>e[1]==='test_completed').length),1);
    assert.ok((await page.evaluate(()=>window.slots)).every(s=>!['5566778899','3344556677'].includes(s)));
    assert.deepEqual(errors,[]);
    console.log('PASS suspended result: ad-free real loading, no premature completion event, valid result resumes with retained ads; no JS errors');
  } finally {await browser.close()}
})().catch(e=>{console.error(e);process.exitCode=1});
