import assert from 'node:assert/strict';
import OpenAI from './cms-bot/node_modules/openai/index.mjs';
import { sanitizeBlogHtml, validateBlogDraft, BRIDGE_TOPIC_QUEUE } from './cms-bot/bridgeBlogTopics.js';
import { generateJson } from './cms-bot/llmClient.js';

function makeValidBlogHtml() {
  const para =
    '일상에서 서로 다른 의사결정 방식을 가진 두 사람이 대화를 나눌 때는 말투보다 먼저 문제 해결의 기준이 다르다는 점을 알아차리는 것이 중요합니다. ' +
    '예를 들어 카톡으로 고민을 털어놓았을 때 한쪽은 감정의 온도를 먼저 맞추길 바라고, 다른 한쪽은 곧장 현실적인 해결책을 정리해주려는 경향이 나타납니다. ' +
    '이 차이를 성격의 우열이 아니라 에너지 사용 방향과 정보 처리 습관의 차이로 이해하면 불필요한 오해를 크게 줄일 수 있습니다. ';
  return (
    `<h2>대화 방식이 엇갈리는 진짜 이유</h2>` +
    `<p>${para.repeat(5)}</p>` +
    `<h2>상황별 대화 비교표</h2>` +
    `<table><thead><tr><th>상황</th><th>사고형(T)</th><th>감정형(F)</th></tr></thead><tbody><tr><td>고민 상담</td><td>해결책 제시</td><td>감정 공감 우선</td></tr></tbody></table>` +
    `<h2>지금 바로 적용할 3가지 대화 습관</h2>` +
    `<ul><li>상대가 원하는 것이 공감인지 해결책인지 먼저 물어보기</li><li>단정적인 평가 대신 내가 느낀 점을 주어 중심으로 말하기</li><li>감정이 과열되면 15분 휴식 후 다시 이야기하기</li></ul>` +
    `<p>${para.repeat(2)} 더 정확한 나의 성향은 <a href="/test">무료 64문항 MBTI 검사</a>와 <a href="/compatibility/ENFP-INTJ">ENFP·INTJ 궁합 분석</a>에서 확인해볼 수 있습니다.</p>`
  );
}

async function main() {
  console.log('=== 1. HTML Sanitization Tests ===');
  const dirty = `<h1>중복H1</h1><script>alert(1)</script><iframe src="x"></iframe><p onclick="evil()">안전 문단</p><a href="javascript:alert(1)">bad</a><table><tr><td>1</td></tr></table>`;
  const clean = sanitizeBlogHtml(dirty);
  assert.ok(!clean.includes('<script'), 'script must be stripped');
  assert.ok(!clean.includes('<iframe'), 'iframe must be stripped');
  assert.ok(!clean.includes('onclick'), 'event handler must be stripped');
  assert.ok(!clean.includes('javascript:'), 'javascript: href must be stripped');
  assert.ok(!clean.includes('<h1>'), 'h1 must be demoted to h2');
  assert.ok(clean.includes('<h2>중복H1</h2>'), 'h1 demoted cleanly');
  assert.ok(clean.includes('overflow-x-auto'), 'table wrapped for mobile scroll');
  console.log('[PASS] sanitizeBlogHtml strips XSS, demotes H1, wraps tables');

  console.log('\n=== 2. Blog Draft Quality Gate Tests ===');
  const validPaths = new Set(['/', '/test', '/type', '/compatibility', '/blog', '/blog/225', '/teto-egen', '/hogu']);
  const existing = [{ id: 225, title: '갈등 상황에서 드러나는 4가지 기질별 스트레스 반응과 회복법' }];

  // Check zero "60문항" leftovers in BRIDGE_TOPIC_QUEUE
  const stale60 = BRIDGE_TOPIC_QUEUE.filter((q) => JSON.stringify(q).includes('60문항'));
  assert.equal(stale60.length, 0, 'BRIDGE_TOPIC_QUEUE must have zero 60문항 references');
  console.log('[PASS] BRIDGE_TOPIC_QUEUE has zero outdated "60문항" references');

  const validDraft = {
    title: '감정형과 사고형이 연애 대화에서 오해를 줄이는 현실 공식 3가지',
    excerpt: '같은 상황에서 전혀 다르게 반응하는 T형과 F형의 대화 차이를 구체적 카톡 예시와 비교표로 정리했습니다.',
    category: '관계심리',
    tags: ['MBTI', '대화법', '연애심리'],
    content: makeValidBlogHtml(),
  };
  const okCheck = validateBlogDraft(validDraft, existing, validPaths);
  assert.equal(okCheck.ok, true, `Expected valid draft to pass, got: ${okCheck.issues.join(', ')}`);
  console.log(`[PASS] Valid blog draft passed (${okCheck.charCount} chars, H2:${okCheck.h2Count}, links:${okCheck.internalLinks.join(', ')})`);

  // Dead internal link rejected
  const deadLinkDraft = { ...validDraft, content: validDraft.content + '<a href="/blog/99999">없는 글</a>' };
  const deadCheck = validateBlogDraft(deadLinkDraft, existing, validPaths);
  assert.equal(deadCheck.ok, false);
  assert.ok(deadCheck.issues.some((i) => i.includes('존재하지 않는 내부 링크')));
  console.log('[PASS] Hallucinated dead internal link (/blog/99999) rejected');

  // Outdated 60문항 rejected
  const staleDraft = { ...validDraft, content: validDraft.content.replace('64문항', '60문항') };
  const staleCheck = validateBlogDraft(staleDraft, existing, validPaths);
  assert.equal(staleCheck.ok, false);
  assert.ok(staleCheck.issues.some((i) => i.includes('60문항')));
  console.log('[PASS] Outdated "60문항" text rejected');

  // Medical claim / alien script rejected
  const medDraft = { ...validDraft, content: validDraft.content + '<p>이 증상은 우울증 확진 기준입니다.</p>' };
  assert.equal(validateBlogDraft(medDraft, existing, validPaths).ok, false);
  const alienDraft = { ...validDraft, content: validDraft.content + '<p>이상한 외계어 സാം 포함</p>' };
  assert.equal(validateBlogDraft(alienDraft, existing, validPaths).ok, false);
  console.log('[PASS] Medical diagnosis claims & AI alien scripts rejected');

  console.log('\n=== 3. Live Hybrid LLM Router (Gemini -> OpenAI gpt-4.1-mini Fallback) ===');
  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  const res = await generateJson(openai, {
    role: 'writer',
    temperature: 0.2,
    system: 'Return JSON object with keys {"status":"ok","lang":"ko"} only.',
    user: 'ping',
  });
  assert.equal(res.data.status, 'ok');
  console.log(`[PASS] Hybrid router live call succeeded via provider=${res.provider}, model=${res.model}`);

  console.log('\nALL BLOG & WRITING AGENT CHECKS PASSED (0 failures)!');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
