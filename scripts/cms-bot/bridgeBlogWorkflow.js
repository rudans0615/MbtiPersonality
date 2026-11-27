import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { createClient } from '@supabase/supabase-js';
import { injectBlogPost } from './blogAgent.js';
import { generateJson, generateText } from './llmClient.js';
import {
  pickBestTopicByGA4,
  getRemainingBridgeTopics,
  validateBlogDraft,
  isDuplicateAgainstExisting,
  sanitizeBlogHtml,
} from './bridgeBlogTopics.js';
import { fetchGA4Summary } from './ga4Reporter.js';

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const pendingDraftsPath = path.join(scriptDir, '.pending-blog-drafts.json');
const usedTopicsPath = path.join(scriptDir, '.used-bridge-topics.json');

function loadJson(filePath, fallback) {
  try {
    if (fs.existsSync(filePath)) return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch (e) {
    console.warn(`Failed to read ${filePath}:`, e.message);
  }
  return fallback;
}

function saveJson(filePath, data) {
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
  } catch (e) {
    console.warn(`Failed to write ${filePath}:`, e.message);
  }
}

const pendingDrafts = loadJson(pendingDraftsPath, {});
const usedSlugs = loadJson(usedTopicsPath, []);

function getSupabase() {
  const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) throw new Error('Supabase URL/Key가 설정되어 있지 않습니다.');
  return createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
}

async function fetchSiteContext() {
  const supabase = getSupabase();
  const [{ data: posts, error: pErr }, { data: tests, error: tErr }] = await Promise.all([
    supabase.from('blog_posts').select('id, title, category, date').order('id', { ascending: false }),
    supabase.from('tests').select('id, title, href, is_available').eq('is_available', true),
  ]);
  if (pErr) throw pErr;
  if (tErr) throw tErr;

  const existingPosts = posts || [];
  const activeTests = tests || [];

  const validPaths = new Set(['/', '/test', '/type', '/compatibility', '/blog', '/teto-egen', '/drunk', '/about', '/contact']);
  for (const t of activeTests) {
    if (t.href) validPaths.add(t.href.toLowerCase());
    if (t.id) validPaths.add(`/${t.id}`.toLowerCase());
  }
  for (const p of existingPosts) {
    validPaths.add(`/blog/${p.id}`);
  }

  return { existingPosts, activeTests, validPaths };
}

function extractH2Headings(html) {
  return [...(html || '').matchAll(/<h2\b[^>]*>([\s\S]*?)<\/h2>/gi)]
    .map((m) => m[1].replace(/<[^>]*>/g, '').trim())
    .filter(Boolean);
}

/**
 * 1단계 Writer Agent: 브런치·매거진 에디터 수준의 고품질 브릿지 칼럼 작성
 */
async function runWriterAgent(openai, topicItem, existingPosts, expandFeedback = '') {
  const existingTitlesList = existingPosts
    .slice(0, 40)
    .map((p) => `- [${p.id}] ${p.title}`)
    .join('\n');

  const bridgeLinksText = (topicItem.bridgeLinks || [])
    .map((l) => `- <a href="${l.href}" class="text-pink-600 font-bold hover:underline">${l.label}</a>`)
    .join('\n');

  const system = `너는 한국 2030 독자들에게 저장·공유 폭발을 일으키는 심리·MBTI 매거진의 수석 칼럼니스트야.
AI가 쓴 티가 1%도 나지 않는, 실제 잡지·브런치 인기 에디터가 쓴 것처럼 생생하고 통찰력 있는 HTML 칼럼을 작성해.

[글쓰기 퀄리티 절대 규칙]
1. 문체: 딱딱한 "~한다" 보고서체나 번역투 절대 금지. 따뜻하고 지적인 매거진 칼럼 톤("~해요 / ~합니다")을 일관되게 사용하라.
2. 오프닝: "안녕하세요", "이 글에서는", "오늘은" 금지! 독자가 읽자마자 "내 얘기잖아!" 하고 멈추는 구체적인 현실 장면(예: 밤 11시 카톡 숫자 1이 3시간째 안 사라지는 순간)으로 첫 문단을 열어라.
3. 심리적 깊이: "내향적이라서 그래요" 같은 얕은 설명 금지. MBTI 인지기능(예: 주기능 Si·부기능 Te·열등기능 Ne 등)이나 심리 메커니즘(애착, 인지부하, 매몰비용 등)을 쉽게 풀어 "아, 그래서 그랬구나!"라는 무릎 탁 치는 통찰을 줘라.
4. 생생한 한국 현실 대화: "한 여성은~", "고마워. 네 말 듣고 힘이 나네." 같은 도덕 교과서·로봇 대사 절대 금지! 실제 한국 2030이 카톡/직장에서 쓰는 리얼한 말투로 "❌ 갈등을 키우는 말 vs ⭕ 바로 먹히는 말"을 대비해 보여줘라.
5. AI 클리셰 금지: "~하는 것이 중요합니다", "~하는 데 큰 도움이 됩니다", "결론적으로", "마지막으로" 같은 뻔한 AI 마감 문구 반복 금지.
6. HTML 구조 및 분량 필수 (순수 텍스트 **최소 2,200~2,900자**, 절대 1,800자 미만 금지!):
   - <h2> 소제목 4개 (호기심을 끄는 구체적 소제목, **각 <h2> 섹션마다 450~650자 이상**으로 구체적 사례와 심리 해설을 충분히 전개할 것!)
   - 필요 시 <h3> 소제목, <p> 문단 (한 문단은 3~4문장 이내로 호흡 짧게, 섹션당 2~3문단 이상!)
   - 한눈에 비교되는 <table><thead>...<tbody>...</table> 1개 이상
   - 바로 써먹을 수 있는 <ul> 또는 <ol> 실천 리스트 1개 이상
   - 핵심 인사이트 1줄을 담은 <blockquote> 1개
   - 본문에 <h1>, <script>, <iframe> 절대 금지!
7. 내부 브릿지 링크: 아래 [필수 브릿지 링크] 중 최소 2개를 글 흐름 속에 자연스럽게 녹여라. 목록에 없는 /blog/999 같은 가짜 URL 생성 절대 금지.
8. 정확성 & 정책: MBTI 검사는 반드시 "64문항 MBTI 검사"로 표기("60문항" 금지). 의학적·임상적 단정("확진", "치료", "처방", "우울증 진단") 금지.

[필수 브릿지 링크 — 이 경로들만 사용]
${bridgeLinksText || '- <a href="/test" class="text-pink-600 font-bold hover:underline">무료 64문항 MBTI 검사</a>\n- <a href="/compatibility" class="text-pink-600 font-bold hover:underline">MBTI 16×16 궁합표</a>'}

[기존 발행 글 목록 (중복 금지)]
${existingTitlesList}

[JSON 출력 형식]
{
  "title": "클릭을 부르는 구체적이고 세련된 제목 (45자 이내)",
  "excerpt": "검색결과에서 바로 눌러보고 싶은 핵심 요약 (95~130자, ~해요/~합니다체)",
  "category": "${topicItem.category || '심층분석'}",
  "tags": ["키워드1", "키워드2", "키워드3", "키워드4"],
  "content": "<p>...</p><h2>...</h2><p>...</p><table><thead>...</thead><tbody>...</tbody></table><ul><li>...</li></ul><blockquote>...</blockquote>"
}`;

  const user = `다음 주제로 독자가 저장하고 친구에게 공유하고 싶어지는 고품질 브릿지 칼럼을 HTML 형식으로 작성해줘.\n주제: ${topicItem.keyword}${
    expandFeedback ? `\n\n[이전 초안 검증 미달 — 반드시 해결할 것]\n${expandFeedback}` : ''
  }`;

  return generateJson(openai, { system, user, role: 'writer', temperature: 0.78 });
}

/**
 * 2단계 Critic Editor Agent: HTML 구조 100% 보존하면서 AI체·로봇 대화·표현력 정밀 교정
 */
async function runCriticAgent(openai, draftData, topicItem) {
  const allowedLinks = (topicItem.bridgeLinks || []).map((l) => `${l.href} (${l.label})`).join(', ');
  const system = `너는 한국어 심리 매거진의 수석 교정 에디터(Critic Agent)야.
제출된 JSON의 HTML 구조를 **절대 훼손하지 않으면서** 문장의 생동감과 설득력만 한 단계 끌어올려 동일한 JSON 스키마로 반환해.

[절대 준수 규칙]
1. **HTML 태그 100% 보존 (최우선!):** content 안의 <h2>, <h3>, <p>, <table>, <thead>, <tbody>, <tr>, <th>, <td>, <ul>, <ol>, <li>, <blockquote>, <strong>, <a href="..."> 태그를 절대 삭제하거나 평문(\n\n)으로 풀지 마라! 오히려 HTML 구조가 빠진 부분이 있으면 채워 넣어라.
2. **AI체·로봇 대화 박멸:** "한 여성은~", "~하는 것이 중요합니다", "~에 큰 도움이 됩니다", 어색한 교과서 대화를 실제 한국 2030의 자연스러운 말투와 매거진 문체("~해요/~합니다")로 교정하라.
3. **분량 유지:** 순수 텍스트 2,100자 이상 유지 (절대 요약하거나 줄이지 말 것).
4. **링크 & 정책 검증:** <h1>/<script>/<iframe> 금지, 내부 링크는 허용 경로(${allowedLinks || '/test, /compatibility, /type'})만 유지, "60문항"은 "64문항"으로 수정, 의학적 단정·외계어 제거.
5. JSON 키("title", "excerpt", "category", "tags", "content") 그대로 유지.`;

  return generateJson(openai, {
    system,
    user: JSON.stringify(draftData),
    role: 'critic',
    temperature: 0.3,
  });
}

export async function generateThreadsPromo(openai, postTitle, postExcerpt, postId, postContent = '') {
  const url = `https://mbtifinder.com/blog/${postId}`;
  const h2s = extractH2Headings(postContent).join(' / ');
  const linkedTests = [...String(postContent || '').matchAll(/href=["'](\/[a-zA-Z0-9-]+)["']/g)]
    .map((m) => m[1])
    .filter((h) => !['/blog', '/about', '/contact'].includes(h));
  const relatedTestUrl = linkedTests[0] ? `https://mbtifinder.com${linkedTests[0]}` : '';

  const { text } = await generateText(openai, {
    role: 'promo',
    temperature: 0.92,
    system: `너는 한국 스레드(Threads)에서 댓글 200개+, 링크 클릭률 5%+ 뽑는 상위 1% 바이럴 그로스 마케터야.
AI가 남의 글 요약하듯 쓰는 정보 계정이 아니라, 실제 한국 2030 사람이 툭 던져서 논쟁·공감·클릭을 폭발시키는 문구 3종을 작성해.

[상위 1% 스레드 4대 법칙 — 위반 시 실패]
1. **본문에서 결론을 다 풀지 마라 (Open Loop):** 본문에 정답을 다 쓰면 좋아요만 누르고 링크 안 누른다. 해결책·말투·진단 결과는 첫 댓글로 남겨라.
2. **뻔한 "손 들어봐" 금지:** "너네는 1번임 2번임?", "나만 이럼?", "반박 받음"처럼 댓글을 참을 수 없게 만들어라.
3. **금지어 전면 차단:** "~한 적 있지?", "~를 알아보자!", "~는 필수야", "궁금하지?", "'이것' 때문에", "지금 바로 확인해봐!", "#해시태그 도배", 이모지 남발(버전당 0~1개), 상담소 교과서 대사 절대 금지!
4. **연계 테스트 퍼널 활용:** 연계 테스트 링크가 있으면 포맷 1이나 2에서 테스트를 미끼로 쓰고 2차 댓글에 칼럼 링크를 붙이는 실전 퍼널도 제시하라.

[출력 형식 — 그대로 복붙 가능하게]
🔥 [포맷 1 — A vs B 밸런스 논쟁형 (댓글 폭발 1위)]
(글 주제와 맞닿은 현실 상황 1개를 1) vs 2) 선택지로 던지고 "너네는 1번임 2번임?"으로 끝내는 4~5줄)
↳ 첫 댓글: (본인 선택 + 클릭할 이유 1줄) ${relatedTestUrl || url}${
      relatedTestUrl ? `\n↳ 2번째 댓글(대댓글): (칼럼의 구체적 해결책 예고 1줄) ${url}` : ''
    }

🔥 [포맷 2 — 약한 도발·불편한 진실형 (반박+공감 동시 폭발)]
(흔한 착각을 정면으로 깨는 묵직한 3~4줄, 해결책은 숨길 것)
↳ 첫 댓글: (구체적 해결/정리 포인트 예고 1줄) ${url}

🔥 [포맷 3 — 1인칭 찔림·경험담형 (클릭률 최강)]
("방금 이 글 읽다가 3번에서 멈춤..." / "내 얘기 누가 써놨냐..." 식의 1인칭 실화 톤 3~4줄)
↳ 첫 댓글: (누를 이유 1줄) ${url}`,
    user: `글 제목: ${postTitle}\n핵심 요약: ${postExcerpt}${h2s ? `\n소제목: ${h2s}` : ''}${
      relatedTestUrl ? `\n연계 테스트 URL: ${relatedTestUrl}` : ''
    }\n칼럼 URL: ${url}`,
  });
  return text;
}

function buildManualTopicItem(manualTopic, activeTests) {
  const bridgeLinks = [];
  // 수동 주제에 /testId 가 포함되어 있거나 활성 테스트 제목/ID와 매칭되면 1순위 브릿지 링크로 자동 추가
  const pathMatch = manualTopic.match(/\/([a-zA-Z0-9-]{2,60})/);
  if (pathMatch) {
    const matchedTest = activeTests.find(
      (t) => t.id.toLowerCase() === pathMatch[1].toLowerCase() || (t.href || '').toLowerCase() === `/${pathMatch[1].toLowerCase()}`
    );
    if (matchedTest) {
      bridgeLinks.push({ href: matchedTest.href || `/${matchedTest.id}`, label: matchedTest.title });
    }
  }
  bridgeLinks.push(
    { href: '/test', label: '무료 64문항 MBTI 검사' },
    { href: '/compatibility', label: 'MBTI 16×16 궁합표' },
    { href: '/type', label: 'MBTI 16유형 백과' }
  );

  // 중복 href 제거
  const uniqueLinks = [];
  const seen = new Set();
  for (const l of bridgeLinks) {
    if (!seen.has(l.href)) {
      seen.add(l.href);
      uniqueLinks.push(l);
    }
  }

  return {
    slug: null,
    keyword: manualTopic,
    category: '심층분석',
    bridgeLinks: uniqueLinks,
  };
}

/**
 * 브릿지 칼럼 초안 생성 (Writer → Critic → 하드 품질 게이트) → 텔레그램 승인 카드 발송
 */
export async function generateBridgeBlogDraft(bot, openai, chatId, manualTopic = null, forcedTopicItem = null) {
  try {
    const { existingPosts, activeTests, validPaths } = await fetchSiteContext();

    let topicItem = forcedTopicItem;
    let ga4MatchedPage = null;
    if (!topicItem) {
      if (manualTopic) {
        const dup = isDuplicateAgainstExisting(manualTopic, existingPosts);
        if (dup.isDup) {
          await bot.sendMessage(
            chatId,
            `⚠️ 입력하신 주제가 기존 글과 너무 유사합니다(${Math.round(dup.ratio * 100)}%).\n기존 글: "${dup.matchedTitle}"\n\n다른 구체적 키워드로 다시 요청해 주세요.`
          );
          return;
        }
        topicItem = buildManualTopicItem(manualTopic, activeTests);
      } else {
        const ga4Data = await fetchGA4Summary(14).catch(() => null);
        const picked = pickBestTopicByGA4(existingPosts, usedSlugs, ga4Data?.topPages || []);
        topicItem = picked.topic;
        ga4MatchedPage = picked.matchedPage;
        if (!topicItem) {
          await bot.sendMessage(
            chatId,
            `✅ 준비된 36개 브릿지 칼럼 큐가 모두 발행되었습니다! /newblog [새 주제]로 직접 요청하거나 큐를 추가해 주세요.`
          );
          return;
        }
      }
    }

    await bot.sendMessage(
      chatId,
      `✍️ [브릿지 칼럼 v2 작성 중] (Writer → Critic 2단계 검수 · 승인 전 비공개)\n\n` +
        `🎯 선정 주제: ${topicItem.keyword}${
          ga4MatchedPage ? `\n📈 선정 근거: 최근 14일 GA4 인기 페이지(${ga4MatchedPage}) 기반 우선 선정` : ''
        }\n🔗 연결 대상: ${(topicItem.bridgeLinks || []).map((l) => l.href).join(', ')}`
    );

    // 1차 Writer → 2차 Critic (Critic이 HTML 태그를 실수로 손상시킨 경우 Writer 원본 보호)
    const runPass = async (feedback = '') => {
      const wRes = await runWriterAgent(openai, topicItem, existingPosts, feedback);
      const cRes = await runCriticAgent(openai, wRes.data, topicItem).catch(() => wRes);
      const wHtml = sanitizeBlogHtml(wRes.data?.content || '');
      const cHtml = sanitizeBlogHtml(cRes.data?.content || '');
      const cCheck = validateBlogDraft({ ...cRes.data, content: cHtml }, existingPosts, validPaths);
      const wCheck = validateBlogDraft({ ...wRes.data, content: wHtml }, existingPosts, validPaths);
      if (!cCheck.ok && wCheck.ok) {
        return { writerRes: wRes, criticRes: wRes, aiData: { ...wRes.data, content: wHtml }, check: wCheck };
      }
      return { writerRes: wRes, criticRes: cRes, aiData: { ...cRes.data, content: cHtml }, check: cCheck };
    };

    let { writerRes, criticRes, aiData, check } = await runPass();

    // 품질 기준 미달 시 정확한 피드백으로 1회 자동 보강 재작성
    if (!check.ok) {
      const feedback = `아래 검증 실패 항목을 반드시 모두 해결해 다시 작성해줘:\n- ${check.issues.join('\n- ')}`;
      ({ writerRes, criticRes, aiData, check } = await runPass(feedback));
    }

    const draftId = crypto.randomBytes(4).toString('hex');
    pendingDrafts[draftId] = {
      draftId,
      createdAt: new Date().toISOString(),
      topicItem,
      aiData,
      check,
      modelUsed: `${writerRes.model} + ${criticRes.model}`,
      status: 'pending',
    };
    saveJson(pendingDraftsPath, pendingDrafts);

    const h2List = extractH2Headings(aiData.content)
      .map((h, i) => `  ${i + 1}. ${h}`)
      .join('\n');

    const qualitySummary = check.ok
      ? `✅ 품질 게이트 통과 (${check.charCount.toLocaleString()}자 · H2 ${check.h2Count}개 · ${
          check.hasTable ? '비교표 포함' : '리스트 포함'
        } · 유효 내부링크 ${check.internalLinks.length}개)`
      : `⛔ 품질 게이트 미달 — 발행 차단됨:\n  • ${check.issues.join('\n  • ')}`;

    const cardText = [
      `📝 [브릿지 칼럼 발행 승인 대기]`,
      ``,
      `📌 제목: ${aiData.title}`,
      `📂 카테고리: ${aiData.category || '심층분석'} | 🤖 모델: ${writerRes.model}`,
      `🏷️ 태그: ${(aiData.tags || []).map((t) => `#${t}`).join(' ')}`,
      `📊 검수: ${qualitySummary}`,
      ``,
      `💡 요약:`,
      `${aiData.excerpt || ''}`,
      ``,
      `📑 소제목 목차:`,
      h2List || '  (목차 없음)',
      ``,
      check.ok
        ? `아래 버튼을 눌러야 실제 사이트(Supabase)에 발행됩니다.`
        : `품질 기준 미달로 발행 버튼이 잠겼습니다. [🔄 다시 작성] 또는 [❌ 폐기]를 선택해 주세요.`,
    ].join('\n');

    const keyboard = check.ok
      ? [
          [{ text: '✅ 블로그 발행 + 스레드 홍보글 생성', callback_data: `blog_approve_${draftId}` }],
          [
            { text: '📄 본문 미리보기', callback_data: `blog_preview_${draftId}` },
            { text: '🔄 다시 작성', callback_data: `blog_regen_${draftId}` },
          ],
          [{ text: '❌ 폐기 (발행 안 함)', callback_data: `blog_reject_${draftId}` }],
        ]
      : [
          [
            { text: '📄 본문 미리보기', callback_data: `blog_preview_${draftId}` },
            { text: '🔄 다시 작성', callback_data: `blog_regen_${draftId}` },
          ],
          [{ text: '❌ 폐기 (발행 안 함)', callback_data: `blog_reject_${draftId}` }],
        ];

    await bot.sendMessage(chatId, cardText, {
      reply_markup: { inline_keyboard: keyboard },
    });
  } catch (error) {
    console.error('generateBridgeBlogDraft error:', error);
    await bot.sendMessage(chatId, `❌ 브릿지 칼럼 초안 생성 실패: ${error.message}`);
  }
}

/**
 * 텔레그램 인라인 버튼 콜백 처리 (blog_approve_ / blog_preview_ / blog_regen_ / blog_reject_)
 */
export async function handleBridgeBlogCallback(bot, openai, query) {
  const data = query.data || '';
  if (!data.startsWith('blog_')) return false;

  const chatId = query.message.chat.id;
  const msgId = query.message.message_id;
  const parts = data.split('_');
  const action = parts[1];
  const draftId = parts[2];
  const draft = pendingDrafts[draftId];

  await bot.answerCallbackQuery(query.id).catch(() => {});

  if (!draft) {
    await bot.sendMessage(chatId, '⚠️ 해당 초안이 만료되었거나 이미 처리되었습니다.');
    return true;
  }

  if (action === 'preview') {
    const plain = (draft.aiData.content || '')
      .replace(/<\/(h2|h3|p|li|tr)>/gi, '\n')
      .replace(/<[^>]*>/g, '')
      .replace(/\n{3,}/g, '\n\n')
      .trim();
    const chunk = plain.slice(0, 3500);
    await bot.sendMessage(
      chatId,
      `📄 [본문 미리보기 — ${draft.aiData.title}]\n\n${chunk}${plain.length > 3500 ? '\n...(이하 생략)' : ''}`
    );
    return true;
  }

  if (action === 'reject') {
    if (draft.topicItem?.slug && !usedSlugs.includes(draft.topicItem.slug)) {
      usedSlugs.push(draft.topicItem.slug);
      saveJson(usedTopicsPath, usedSlugs);
    }
    delete pendingDrafts[draftId];
    saveJson(pendingDraftsPath, pendingDrafts);
    await bot.editMessageReplyMarkup({ inline_keyboard: [] }, { chat_id: chatId, message_id: msgId }).catch(() => {});
    await bot.sendMessage(chatId, `🗑️ 초안 "${draft.aiData.title}"을(를) 폐기했습니다. (DB에 발행되지 않음)`);
    return true;
  }

  if (action === 'regen') {
    const prevTopic = draft.topicItem;
    delete pendingDrafts[draftId];
    saveJson(pendingDraftsPath, pendingDrafts);
    await bot.editMessageReplyMarkup({ inline_keyboard: [] }, { chat_id: chatId, message_id: msgId }).catch(() => {});
    await generateBridgeBlogDraft(bot, openai, chatId, null, prevTopic);
    return true;
  }

  if (action === 'approve') {
    if (draft.status === 'publishing' || draft.status === 'published') {
      await bot.sendMessage(chatId, 'ℹ️ 이미 발행 처리 중이거나 완료된 초안입니다.');
      return true;
    }

    if (!draft.check?.ok) {
      await bot.sendMessage(chatId, '⛔ 품질 게이트 미달 초안은 발행할 수 없습니다. 다시 작성해 주세요.');
      return true;
    }

    // 중복 클릭 레이스 컨디션 차단 락
    draft.status = 'publishing';
    saveJson(pendingDraftsPath, pendingDrafts);

    try {
      const { existingPosts } = await fetchSiteContext();
      const dup = isDuplicateAgainstExisting(draft.aiData.title, existingPosts);
      if (dup.isDup) {
        draft.status = 'pending';
        saveJson(pendingDraftsPath, pendingDrafts);
        await bot.sendMessage(
          chatId,
          `⚠️ 발행 중단: 기존 글 "${dup.matchedTitle}"과 중복됩니다. 재생성 또는 폐기해 주세요.`
        );
        return true;
      }

      const newId = await injectBlogPost(draft.aiData);
      draft.status = 'published';
      if (draft.topicItem?.slug && !usedSlugs.includes(draft.topicItem.slug)) {
        usedSlugs.push(draft.topicItem.slug);
        saveJson(usedTopicsPath, usedSlugs);
      }
      delete pendingDrafts[draftId];
      saveJson(pendingDraftsPath, pendingDrafts);

      await bot.editMessageReplyMarkup({ inline_keyboard: [] }, { chat_id: chatId, message_id: msgId }).catch(() => {});
      await bot.sendMessage(
        chatId,
        `🎉 [브릿지 칼럼 발행 완료!]\n\n📌 제목: ${draft.aiData.title}\n🔗 링크: https://mbtifinder.com/blog/${newId}\n(목록 최대 5분, 사이트맵 최대 1시간 내 자동 반영)\n\n이어서 스레드(Threads) 홍보 카피를 생성합니다...`
      );

      const promo = await generateThreadsPromo(openai, draft.aiData.title, draft.aiData.excerpt, newId, draft.aiData.content);
      await bot.sendMessage(chatId, `🧵 [방금 발행한 칼럼 스레드 홍보 복붙용]\n\n${promo}`);
    } catch (err) {
      draft.status = 'pending';
      saveJson(pendingDraftsPath, pendingDrafts);
      console.error('Approve publish error:', err);
      await bot.sendMessage(chatId, `❌ 발행 중 오류 발생: ${err.message}`);
    }
    return true;
  }

  return false;
}

/**
 * /blogqueue 현황 조회
 */
export async function sendBlogQueueStatus(bot, chatId) {
  try {
    const { existingPosts } = await fetchSiteContext();
    const remaining = getRemainingBridgeTopics(existingPosts, usedSlugs);
    const preview = remaining
      .slice(0, 6)
      .map((t, i) => `${i + 1}. [${t.category}] ${t.keyword}`)
      .join('\n');

    await bot.sendMessage(
      chatId,
      `📚 [브릿지 칼럼 대기 큐 현황]\n\n• 현재 발행된 글: ${existingPosts.length}편\n• 남은 고유 주제 큐: ${remaining.length}개\n• 자동 초안 스케줄: 매주 화·목 오전 10:00 (KST)\n\n다음 예정 주제 TOP 6:\n${preview || '(남은 주제 없음)'}\n\n지금 바로 다음 주제 초안을 받아보려면 /newblog 를 입력하세요.`
    );
  } catch (err) {
    await bot.sendMessage(chatId, `❌ 큐 조회 실패: ${err.message}`);
  }
}

/**
 * 매주 화요일(2) · 목요일(4) 오전 10:00 KST (UTC+9)에 승인용 초안 자동 배달
 */
export function scheduleTwiceWeeklyBridgeBlog(bot, openai) {
  const TARGET_DAYS = new Set([2, 4]);
  const TARGET_HOUR_KST = 10;
  let lastTriggeredDateKey = null;

  function getKstNow() {
    const kst = new Date(Date.now() + 9 * 60 * 60 * 1000);
    return {
      day: kst.getUTCDay(),
      hour: kst.getUTCHours(),
      minute: kst.getUTCMinutes(),
      dateKey: `${kst.getUTCFullYear()}-${String(kst.getUTCMonth() + 1).padStart(2, '0')}-${String(
        kst.getUTCDate()
      ).padStart(2, '0')}`,
    };
  }

  console.log('📅 브릿지 칼럼 승인형 스케줄러 가동 완료 (매주 화·목 오전 10:00 KST — 텔레그램 승인 후 발행)');

  setInterval(() => {
    const adminChatId = process.env.ADMIN_CHAT_ID;
    if (!adminChatId) return;

    const now = getKstNow();
    if (
      TARGET_DAYS.has(now.day) &&
      now.hour === TARGET_HOUR_KST &&
      now.minute === 0 &&
      lastTriggeredDateKey !== now.dateKey
    ) {
      lastTriggeredDateKey = now.dateKey;
      console.log(`⏰ [KST ${now.dateKey} 10:00] 주 2회 브릿지 칼럼 초안 자동 배달 시작`);
      generateBridgeBlogDraft(bot, openai, adminChatId, null);
    }
  }, 30 * 1000);
}
