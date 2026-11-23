import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { fileURLToPath } from 'url';
import { createClient } from '@supabase/supabase-js';
import { injectBlogPost } from './blogAgent.js';
import {
  pickBestTopicByGA4,
  getRemainingBridgeTopics,
  validateBlogDraft,
  isDuplicateAgainstExisting,
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

async function fetchAllExistingPosts() {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from('blog_posts')
    .select('id, title, category, date')
    .order('id', { ascending: false });
  if (error) throw error;
  return data || [];
}

function extractH2Headings(html) {
  return [...(html || '').matchAll(/<h2\b[^>]*>([\s\S]*?)<\/h2>/gi)]
    .map((m) => m[1].replace(/<[^>]*>/g, '').trim())
    .filter(Boolean);
}

async function callGptForBridgeColumn(openai, topicItem, existingPosts, expandFeedback = '') {
  const existingTitlesList = existingPosts
    .slice(0, 40)
    .map((p) => `- [${p.id}] ${p.title}`)
    .join('\n');

  const bridgeLinksText = (topicItem.bridgeLinks || [])
    .map((l) => `- <a href="${l.href}" class="text-pink-600 font-bold hover:underline">${l.label}</a>`)
    .join('\n');

  const completion = await openai.chat.completions.create({
    model: 'gpt-4o',
    temperature: 0.75,
    response_format: { type: 'json_object' },
    messages: [
      {
        role: 'system',
        content: `너는 한국어 성격심리·MBTI·관계·커리어 분야의 수석 에디터이자 Google 애드센스 고품질 콘텐츠 전략가야.
독자가 끝까지 읽고 저장·공유하고 싶어지는 깊이 있는 '브릿지 칼럼'을 HTML 형식으로 작성해야 한다.

[절대 품질 규칙 — Google 애드센스 정책 준수]
1. 순수 텍스트 분량 최소 2,000~2,800자 이상으로 풍부하고 구체적으로 작성할 것.
2. "안녕하세요", "이 글에서는 ~을 알아보겠습니다" 같은 AI 상투적 서론 절대 금지. 독자가 바로 공감하는 구체적 상황이나 질문으로 시작할 것.
3. <h2> 소제목 3~4개와 <h3> 소제목, 비교표(<table><thead>...<tbody>...), 실천 체크리스트(<ul> 또는 <ol>), 구체적인 한국 일상/카톡/직장 대화 예시를 반드시 포함할 것.
4. 아래 [필수 브릿지 링크] 중 최소 2개를 본문 맥락에 자연스럽게 녹여 삽입할 것 (억지 광고 톤 금지, 독자의 자기이해를 돕는 흐름으로 연결).
5. 아래 [기존 발행 글 목록]과 제목이나 핵심 내용이 중복되지 않도록 완전히 새로운 각도로 작성할 것.
6. 의학적·임상적 단정 표현 금지 ("~하는 경향이 있습니다", "참고 기준" 등 균형 잡힌 어조 사용).

[필수 브릿지 링크]
${bridgeLinksText || '- <a href="/test" class="text-pink-600 font-bold hover:underline">무료 60문항 MBTI 검사</a>\n- <a href="/compatibility" class="text-pink-600 font-bold hover:underline">MBTI 16×16 궁합표</a>'}

[기존 발행 글 목록 (중복 금지)]
${existingTitlesList}

[JSON 출력 형식]
{
  "title": "검색 클릭을 부르는 명확하고 구체적인 제목 (48자 이내)",
  "excerpt": "검색결과 요약용 핵심 설명 (95~120자)",
  "category": "${topicItem.category || '심층분석'}",
  "tags": ["키워드1", "키워드2", "키워드3", "키워드4"],
  "content": "<h2>...</h2><p>...</p><table>...</table>... (HTML 본문, 백틱 금지)"
}`,
      },
      {
        role: 'user',
        content: `다음 주제로 깊이 있는 한국어 브릿지 칼럼을 작성해줘.\n주제: ${topicItem.keyword}${
          expandFeedback ? `\n\n[이전 초안 보완 요청]\n${expandFeedback}` : ''
        }`,
      },
    ],
  });

  return JSON.parse(completion.choices[0].message.content);
}

async function generateThreadsPromo(openai, postTitle, postExcerpt, postId) {
  const url = `https://mbtifinder.com/blog/${postId}`;
  const res = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    temperature: 0.85,
    messages: [
      {
        role: 'system',
        content: `너는 스레드(Threads)에서 조회수 터지는 심리·MBTI 계정 운영자야.
광고 느낌 0%, 친구에게 말 거는 듯한 짧은 공감/팩폭 훅으로 스레드 본문(180자 이내)과 첫 댓글용 링크 안내(1줄)를 작성해.
출력 형식:
[스레드 본문]
(본문)

[첫 댓글 복붙용]
(링크 포함 1줄)`,
      },
      {
        role: 'user',
        content: `글 제목: ${postTitle}\n요약: ${postExcerpt}\nURL: ${url}`,
      },
    ],
  });
  return res.choices[0].message.content;
}

/**
 * 브릿지 칼럼 초안 생성 → 텔레그램 승인 카드 발송 (DB 자동 발행 금지!)
 */
export async function generateBridgeBlogDraft(bot, openai, chatId, manualTopic = null, forcedTopicItem = null) {
  try {
    const existingPosts = await fetchAllExistingPosts();

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
        topicItem = {
          slug: null,
          keyword: manualTopic,
          category: '심층분석',
          bridgeLinks: [
            { href: '/test', label: '무료 60문항 MBTI 검사' },
            { href: '/compatibility', label: 'MBTI 16×16 궁합표' },
            { href: '/type', label: 'MBTI 16유형 백과' },
          ],
        };
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
      `✍️ **[브릿지 칼럼 초안 작성 중]** (gpt-4o · 승인 전까지 DB에 발행되지 않습니다)\n\n🎯 선정 주제: ${topicItem.keyword}${
        ga4MatchedPage ? `\n📈 선정 근거: 최근 14일 GA4 인기 페이지(${ga4MatchedPage}) 기반 우선 선정` : ''
      }\n🔗 연결 대상: ${(topicItem.bridgeLinks || []).map((l) => l.href).join(', ')}`,
      { parse_mode: 'Markdown' }
    );

    let aiData = await callGptForBridgeColumn(openai, topicItem, existingPosts);
    let check = validateBlogDraft(aiData, existingPosts);

    // 품질 기준 미달 시 1회 자동 보강 재시도
    if (!check.ok) {
      const feedback = `아래 미달 항목을 반드시 해결해 본문을 더 구체적으로 확장해줘:\n- ${check.issues.join('\n- ')}`;
      aiData = await callGptForBridgeColumn(openai, topicItem, existingPosts, feedback);
      check = validateBlogDraft(aiData, existingPosts);
    }

    const draftId = crypto.randomBytes(4).toString('hex');
    pendingDrafts[draftId] = {
      draftId,
      createdAt: new Date().toISOString(),
      topicItem,
      aiData,
      check,
      status: 'pending',
    };
    saveJson(pendingDraftsPath, pendingDrafts);

    const h2List = extractH2Headings(aiData.content)
      .map((h, i) => `  ${i + 1}. ${h}`)
      .join('\n');

    const qualitySummary = check.ok
      ? `✅ 품질 검수 통과 (${check.charCount.toLocaleString()}자 · H2 ${check.h2Count}개 · 표 ${check.hasTable ? '포함' : '리스트'} · 내부링크 포함)`
      : `⚠️ 보완 참고: ${check.issues.join(' / ')} (${check.charCount.toLocaleString()}자)`;

    const cardText = [
      `📝 [브릿지 칼럼 발행 승인 대기]`,
      ``,
      `📌 제목: ${aiData.title}`,
      `📂 카테고리: ${aiData.category || '심층분석'}`,
      `🏷️ 태그: ${(aiData.tags || []).map((t) => `#${t}`).join(' ')}`,
      `📊 검수: ${qualitySummary}`,
      ``,
      `💡 요약:`,
      `${aiData.excerpt || ''}`,
      ``,
      `📑 소제목 목차:`,
      h2List || '  (목차 없음)',
      ``,
      `아래 버튼을 눌러야 실제 사이트(Supabase)에 발행됩니다.`,
    ].join('\n');

    await bot.sendMessage(chatId, cardText, {
      reply_markup: {
        inline_keyboard: [
          [{ text: '✅ 블로그 발행 + 스레드 홍보글 생성', callback_data: `blog_approve_${draftId}` }],
          [
            { text: '📄 본문 미리보기', callback_data: `blog_preview_${draftId}` },
            { text: '🔄 다시 작성', callback_data: `blog_regen_${draftId}` },
          ],
          [{ text: '❌ 폐기 (발행 안 함)', callback_data: `blog_reject_${draftId}` }],
        ],
      },
    });
  } catch (error) {
    console.error('generateBridgeBlogDraft error:', error);
    await bot.sendMessage(chatId, `❌ 브릿지 칼럼 초안 생성 실패: ${error.message}`);
  }
}

/**
 * 텔레그램 인라인 버튼 콜백 처리 (blog_approve_ / blog_preview_ / blog_regen_ / blog_reject_)
 * 처리한 경우 true 반환
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
    if (draft.status === 'published') {
      await bot.sendMessage(chatId, 'ℹ️ 이미 발행 완료된 초안입니다.');
      return true;
    }

    try {
      const existingPosts = await fetchAllExistingPosts();
      const dup = isDuplicateAgainstExisting(draft.aiData.title, existingPosts);
      if (dup.isDup) {
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
        `🎉 [브릿지 칼럼 발행 완료!]\n\n📌 제목: ${draft.aiData.title}\n🔗 링크: https://mbtifinder.com/blog/${newId}\n\n이어서 스레드(Threads) 홍보 카피를 생성합니다...`
      );

      const promo = await generateThreadsPromo(openai, draft.aiData.title, draft.aiData.excerpt, newId);
      await bot.sendMessage(chatId, `🧵 [방금 발행한 칼럼 스레드 홍보 복붙용]\n\n${promo}`);
    } catch (err) {
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
    const existingPosts = await fetchAllExistingPosts();
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
 * - 서버 타임존(UTC 등)과 무관하게 KST 기준으로 정확히 동작
 * - 절대 DB에 무인 발행하지 않고 텔레그램 승인 카드만 전송
 */
export function scheduleTwiceWeeklyBridgeBlog(bot, openai) {
  const TARGET_DAYS = new Set([2, 4]); // 0=일, 1=월, 2=화, 3=수, 4=목, 5=금, 6=토
  const TARGET_HOUR_KST = 10;
  let lastTriggeredDateKey = null;

  function getKstNow() {
    const utcMs = Date.now();
    const kst = new Date(utcMs + 9 * 60 * 60 * 1000);
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
