// Run against a local production server. Requires playwright (or NODE_PATH to its installation).
const { chromium } = require('playwright');
const assert = require('node:assert/strict');
const base = process.env.TEST_BASE_URL || 'http://localhost:3100';
(async () => {
 const browser = await chromium.launch({headless:true, channel:process.env.TEST_BROWSER_CHANNEL || 'msedge'});
 const context = await browser.newContext();
 // Avoid requesting live ads or affiliate services during functional tests.
 await context.route('**/*', route => {
   const u = new URL(route.request().url());
   if (u.origin !== new URL(base).origin || u.pathname.startsWith('/api/affiliates')) return route.abort();
   return route.continue();
 });
 const page = await context.newPage(); const errors=[];
 page.on('pageerror', e => errors.push(e.message));
 const go = p => page.goto(base+p);
 const visible = async (text) => { await page.getByText(text,{exact:true}).first().waitFor(); };
 const pass = label => console.log('PASS '+label);
 try {
  const response=await go('/results'); assert.equal(response.status(),200);
  await visible('저장된 검사 결과가 없습니다'); pass('MBTI direct access is 200 with start prompt');
  for(const code of ['INVALID','constructor','__proto__']) {
   await page.evaluate(c=>sessionStorage.setItem('mbtiResult',c),code);await page.reload();await visible('저장된 검사 결과가 없습니다');
  } pass('invalid MBTI codes rejected');
  const answer = async (i,value=3) => {
   await visible((i+1)+' / 60');
   await page.getByRole('button',{name:['매우 그렇다','그렇다','보통이다','그렇지 않다','전혀 그렇지 않다'][value-1],exact:true}).click();
   if(i<59)await visible((i+2)+' / 60');
  };
  for(const [last,expected] of [[1,'INFJ'],[5,'INFP']]) {
   await go('/test'); await visible('1 / 60');
   if(last===1) {
    await page.getByRole('button',{name:'보통이다',exact:true}).evaluate(el=>{el.click();el.parentElement.querySelectorAll('button')[0].click();});
    await visible('2 / 60');await page.waitForTimeout(300);await visible('2 / 60');
    await page.getByRole('button',{name:'이전 문항으로'}).click();await visible('1 / 60');
   }
   for(let i=0;i<59;i++)await answer(i,3);
   if(last===5) {
    await page.evaluate(()=>{window.savedSetItem=Storage.prototype.setItem;Storage.prototype.setItem=()=>{throw Error('denied')}});
    await answer(59,last);await visible('결과를 저장하지 못했습니다. 브라우저의 저장소 사용을 허용한 뒤 마지막 답변을 다시 선택해주세요.');assert.equal(new URL(page.url()).pathname,'/test');
    await page.evaluate(()=>{Storage.prototype.setItem=window.savedSetItem});
   }
   await answer(59,last);
   await page.waitForURL('**/results');await visible('MBTI 검사 결과');
   assert.equal(await page.evaluate(()=>sessionStorage.getItem('mbtiResult')),expected);
   await page.reload();await visible(expected);
   if(last===5) {
    await page.evaluate(()=>{window.savedRemoveItem=Storage.prototype.removeItem;Storage.prototype.removeItem=()=>{throw Error('denied')}});
    await page.getByRole('button',{name:'심리테스트 다시하기'}).click();await visible('저장 결과를 지우지 못했습니다. 브라우저의 저장소 사용을 허용한 뒤 다시 시도해주세요.');
    assert.equal(new URL(page.url()).pathname,'/results');
    await page.evaluate(()=>{Storage.prototype.removeItem=window.savedRemoveItem});
   }
   await page.getByRole('button',{name:'심리테스트 다시하기'}).click();await page.waitForURL('**/test');
   assert.equal(await page.evaluate(()=>sessionStorage.getItem('mbtiResult')),null);
  } pass('60-answer MBTI boundary cases, back, double click, reload and restart');
  await go('/teto-egen/results');await visible('저장된 검사 결과가 없습니다');
  for(const raw of ['{',JSON.stringify({type:'constructor',balance:{teto:50,egen:50}}),JSON.stringify({type:'TETO_M',balance:{teto:200,egen:-100}}),JSON.stringify({type:'TETO_M',balance:{teto:50,egen:40}})]) {
   await page.evaluate(r=>sessionStorage.setItem('tetoEgenResult',r),raw);await page.reload();await visible('저장된 검사 결과가 없습니다');
  } pass('Teto missing, corrupt, invalid type and invalid balance handled');
  const legacy=await context.request.get(base+'/teto-egen-test',{maxRedirects:0});assert.equal(legacy.status(),308);assert.equal(legacy.headers().location,'/teto-egen');
  await go('/teto-egen-test');assert.equal(new URL(page.url()).pathname,'/teto-egen');
  const options=()=>page.locator('button.w-full');
  await options().first().waitFor();
  await options().first().evaluate(el=>{el.click();el.parentElement.querySelectorAll('button')[1].click();});
  await visible('2 / 21 문항');
  await page.getByRole('button',{name:'이전 문항으로'}).click();
  await options().nth(1).click();await visible('2 / 21 문항');
  for(let i=2;i<=21;i++){
    await visible(i+' / 21 문항');
    if(i===21) {
     await page.evaluate(()=>{window.savedSetItem=Storage.prototype.setItem;Storage.prototype.setItem=()=>{throw Error('denied')}});
     await options().first().click();await visible('결과를 저장하지 못했습니다. 브라우저의 저장소 사용을 허용한 뒤 마지막 답변을 다시 선택해주세요.');assert.equal(new URL(page.url()).pathname,'/teto-egen');
     await page.evaluate(()=>{Storage.prototype.setItem=window.savedSetItem});
    }
    await options().first().click();
  }
  await page.waitForURL('**/teto-egen/results');await visible('테스트 완료!');
  const result=await page.evaluate(()=>JSON.parse(sessionStorage.getItem('tetoEgenResult')));
  assert.equal(result.answers.length,21);assert.equal(result.answers[0].value,'F');assert.ok(result.type.endsWith('_F'));
  assert.equal(result.balance.teto+result.balance.egen,100);
  await page.reload();await visible('테스트 완료!');
  await context.grantPermissions(['clipboard-read','clipboard-write']);
  await page.getByRole('button',{name:'링크 복사',exact:true}).click();
  assert.ok((await page.evaluate(()=>navigator.clipboard.readText())).endsWith('https://mbtifinder.com/teto-egen'));
  await page.evaluate(()=>{window.savedRemoveItem=Storage.prototype.removeItem;Storage.prototype.removeItem=()=>{throw Error('denied')}});
  await page.getByRole('button',{name:'다시 테스트하기',exact:true}).click();await visible('저장 결과를 지우지 못했습니다. 브라우저의 저장소 사용을 허용한 뒤 다시 시도해주세요.');
  await page.evaluate(()=>{Storage.prototype.removeItem=window.savedRemoveItem});
  await page.getByRole('button',{name:'다시 테스트하기',exact:true}).click();await page.waitForURL('**/teto-egen');
  assert.equal(await page.evaluate(()=>sessionStorage.getItem('tetoEgenResult')),null);
  pass('Teto legacy redirect, changed gender, all answers, share, reload and restart');
  await go('/contact');assert.match(await page.getByRole('link',{name:'이메일 앱 열기'}).getAttribute('href'),/^mailto:jkm3151@gmail.com/);
  assert.equal(await page.locator('form').count(),0);
  await page.getByRole('button',{name:'이메일 주소 복사'}).click();await visible('이메일 주소를 복사했습니다.');
  assert.equal(await page.evaluate(()=>navigator.clipboard.readText()),'jkm3151@gmail.com');
  await page.evaluate(()=>{navigator.clipboard.writeText=async()=>{throw Error('denied')}});
  await page.getByRole('button',{name:'이메일 주소 복사'}).click();await visible('복사하지 못했습니다. 아래 이메일 주소를 선택해 직접 복사해주세요.');
  pass('Contact mailto, clipboard success/failure, no fake form');
  const broken=await browser.newContext();await broken.route('**/*',r=>new URL(r.request().url()).origin===new URL(base).origin?r.continue():r.abort());await broken.addInitScript(()=>{Storage.prototype.getItem=()=>{throw Error('denied')}});
  const bp=await broken.newPage();
  for(const p of ['/results','/teto-egen/results']) {await bp.goto(base+p);await bp.getByText('저장된 검사 결과가 없습니다',{exact:true}).waitFor();}
  await broken.close();pass('Storage read denied handled');
  await go('/dopamine');await page.getByRole('button',{name:'지금 바로 알아보기 👉'}).click();
  assert.ok(await page.locator('button.w-full').count()>0);
  const generic=await go('/dopamine/results?types=FOCUS');assert.equal(generic.status(),200);
  await page.getByText('당신의 답변을 분석 중입니다...', {exact:true}).waitFor({state:'hidden'});
  pass('Existing dynamic test and results route still render');
  assert.deepEqual(errors,[]);pass('No page JavaScript exceptions, including storage write/delete failure and retry');
  await page.setViewportSize({width:390,height:844});
  await go('/contact');
  assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
  require('fs').mkdirSync('artifacts/step1',{recursive:true});
  await page.screenshot({path:'artifacts/step1/contact-mobile.png',fullPage:true,animations:"disabled"});
  await page.evaluate(()=>sessionStorage.setItem('mbtiResult','INFJ'));await go('/results');await visible('INFJ');
  assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
  await page.screenshot({path:'artifacts/step1/mbti-results-mobile.png',fullPage:true,animations:"disabled"});
  pass('Mobile contact and MBTI result: no horizontal overflow');
 } finally {await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1});
