import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { z } from 'zod';
import { zodResponseFormat } from 'openai/helpers/zod';
import { assertSafeTopic } from './validateTestData.js';
import {
  saveTestDraft,
  publishTestDraft,
  deleteTestDraft,
  listExistingTests,
} from './developerAgent.js';

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const pendingTestDraftsPath = path.join(scriptDir, '.pending-test-drafts.json');

function loadPendingDrafts() {
  try {
    if (fs.existsSync(pendingTestDraftsPath)) {
      return JSON.parse(fs.readFileSync(pendingTestDraftsPath, 'utf8'));
    }
  } catch (e) {
    console.warn('Failed loading pending test drafts:', e.message);
  }
  return {};
}

function savePendingDrafts(store) {
  try {
    fs.writeFileSync(pendingTestDraftsPath, JSON.stringify(store, null, 2), 'utf8');
  } catch (e) {
    console.warn('Failed saving pending test drafts:', e.message);
  }
}

const pendingTestDrafts = loadPendingDrafts();

const TestSchema = z.object({
  testId: z.string().describe('기존 테스트 ID와 절대 겹치지 않는 camelCase 영문 고유 ID (예: cafeStudyHabitTest)'),
  category: z.enum(['HOT', 'LOVE', 'PERSONALITY', 'FUN', 'CAREER']),
  title: z.string().describe('클릭을 부르되 과장·자극적이지 않고 신뢰감 있는 한국어 테스트 제목 (26자 이내)'),
  subtitle: z.string().describe('호기심을 자극하는 부제목 (40자 이내)'),
  description: z.string().describe('테스트 랜딩 페이지 및 검색 설명에 바로 쓰일 110~170자 분량의 명확한 소개글 (자연스러운 한국어 존댓말)'),
  emoji: z.string().describe('대표 이모지 1개'),
  promotionalCopy: z.string().describe('스레드·인스타 공유용 2~3줄 후킹 멘트 (링크 자리 없이 문구만)'),
  results: z
    .array(
      z.object({
        typeCode: z.string().describe('영문 대문자 스네이크 케이스 (예: CAFE_STRATEGIST)'),
        title: z.string().describe('유형 이름 (예: 완벽주의 루틴 설계자)'),
        emoji: z.string(),
        subtitle: z.string().describe('핵심 한줄 요약 (28자 이내)'),
        description: z
          .string()
          .describe('이 유형의 강점, 일상 패턴, 보완 포인트를 구체적으로 담은 210~320자 분량의 상세 설명 (임상·의학적 단정 금지)'),
        characteristics: z
          .array(z.string())
          .length(4)
          .describe('이 유형의 핵심 특징 4가지 (각 12~30자, 구체적이고 공감 가는 표현)'),
        coupangKeyword: z
          .string()
          .describe("실제 쿠팡에서 검색 가능한 구체적 실물 상품명 (예: '노이즈캔슬링 헤드폰', '아로마 디퓨저'. 성향 이름 금지)"),
      })
    )
    .length(4)
    .describe('서로 뚜렷하게 구분되는 정확히 4개의 고유한 결과 유형'),
  questions: z
    .array(
      z.object({
        question: z.string().describe('구체적인 일상 상황이 담긴 질문 (모호한 "이런 경우" 금지)'),
        options: z
          .array(
            z.object({
              text: z.string().describe('자연스러운 한국어 구어체 선택지 (12~45자)'),
              typeCode: z.string().describe('매핑될 결과 유형의 typeCode (4개 유형이 각 문항에 정확히 1번씩 1:1 매핑되어야 함)'),
            })
          )
          .length(4)
          .describe('반드시 4지선다 (각 문항마다 4개 결과 유형이 정확히 1개씩 1:1 매핑)'),
      })
    )
    .min(8)
    .max(12)
    .describe('주제에 가장 잘 맞는 8~12개의 문항 (권장 10문항)'),
});

function toDeveloperPayload(parsedData) {
  const formattedResults = {};
  for (const r of parsedData.results) {
    formattedResults[r.typeCode] = {
      title: r.title,
      emoji: r.emoji,
      subtitle: r.subtitle,
      description: r.description,
      characteristics: r.characteristics,
      coupangKeyword: r.coupangKeyword,
    };
  }
  const formattedQuestions = parsedData.questions.map((q) => ({
    question: q.question,
    options: q.options.map((o) => ({
      text: o.text,
      type: o.typeCode,
    })),
  }));

  return {
    scoringMode: 'types',
    testId: parsedData.testId,
    category: parsedData.category,
    title: parsedData.title,
    subtitle: parsedData.subtitle,
    description: parsedData.description,
    emoji: parsedData.emoji,
    promotionalCopy: parsedData.promotionalCopy,
    questions: formattedQuestions,
    results: formattedResults,
  };
}

async function generateAndCritiqueDraft(openai, { topic, targetAudience, tone, existingTests, retryFeedback = '' }) {
  const existingSummary = existingTests
    .map((t) => `- [${t.id}] (${t.category}${t.is_available ? '' : ', 비활성'}) ${t.title}`)
    .join('\n');

  const completion = await openai.beta.chat.completions.parse({
    model: 'gpt-4o',
    temperature: 0.85,
    messages: [
      {
        role: 'system',
        content: `너는 한국 10~30대 독자가 공감하고 지인에게 공유하고 싶어지는 고품질 심리테스트 전문 '디렉터 + 메인작가'야.

[애드센스 & 품질 절대 규칙]
1. 스토킹, 폭력, 자해, 음주운전, 의학적/임상적 진단, 혐오·비하 표현은 절대 금지한다.
2. 결과 유형(results)은 반드시 서로 성격이 뚜렷하게 다른 **정확히 4개**로 설계한다.
3. 문항(questions)은 **10문항(8~12문항 허용)**으로 구성하며, **매 문항의 4개 선택지는 4개의 typeCode에 정확히 1:1로 1번씩 매핑**되어야 한다. (특정 유형이 한 문항에 2번 들어가거나 빠지면 안 된다!)
4. 테스트 소개(description)는 랜딩 페이지와 검색 메타 설명에 바로 노출되므로 110~170자의 자연스러운 존댓말 설명으로 작성한다.
5. 각 결과의 description은 최소 210~320자로 작성하며, 강점·일상 행동 패턴·관계/생활 팁을 구체적으로 담는다.
6. 아래 [기존 테스트 목록]과 testId, 제목, 주제가 중복되지 않는 완전히 새로운 기획이어야 한다.

[톤앤매너]
- 타겟: ${targetAudience}
- 수위/분위기: ${tone}
- 질문과 선택지: 모호한 지시어("이런 경우") 금지. 구체적 한국 일상 시나리오와 자연스러운 구어체 사용.

[기존 테스트 목록 (중복 금지)]
${existingSummary || '(없음)'}`,
      },
      {
        role: 'user',
        content: `테스트 주제: "${topic}"\n위 조건을 모두 만족하는 신규 심리테스트 JSON을 작성해줘.${
          retryFeedback ? `\n\n[이전 초안 검증 실패 사유 — 반드시 해결할 것]\n${retryFeedback}` : ''
        }`,
      },
    ],
    response_format: zodResponseFormat(TestSchema, 'test_schema'),
  });

  const draft = completion.choices[0].message.parsed;

  // 2차 Critic Agent 검수 (문맥 정합성, 선택지-유형 일치도, 한국어 자연스러움, 쿠팡 키워드 실물성)
  const qaCompletion = await openai.beta.chat.completions.parse({
    model: 'gpt-4o',
    temperature: 0.25,
    messages: [
      {
        role: 'system',
        content: `너는 한국어 심리테스트의 심리측정 정합성과 문장을 검수하는 '수석 Critic Agent'야.
주어진 JSON을 검토하고 아래 기준으로 엄격히 교정해 동일한 스키마로 반환해.

[검수 체크리스트]
1. 선택지-유형 정합성: 모든 문항의 각 선택지가 매핑된 typeCode의 성격과 100% 논리적으로 일치하는지 확인하고, 어긋나거나 반대되는 보기를 정확히 수정하라.
2. 1:1 매핑 유지: 모든 문항의 4개 선택지가 반드시 4개 결과 typeCode를 중복 없이 1개씩 가리키도록 유지하라.
3. 문장 품질: AI 번역투·외계어·오타·어색한 비문을 자연스러운 한국어로 교정하고, 각 결과 description이 200자 이상 풍부한지 확인하라.
4. 안전/정책 준수: 과도한 인신공격, 혐오, 의학적 단정, 위험 행동 조장 문구를 제거하라.
5. 쿠팡 키워드: 추상적 성향명이 아니라 실제 쿠팡에서 검색되는 구체적 실물 상품명으로 교정하라.`,
      },
      {
        role: 'user',
        content: JSON.stringify(draft),
      },
    ],
    response_format: zodResponseFormat(TestSchema, 'test_schema'),
  });

  return qaCompletion.choices[0].message.parsed;
}

function formatApprovalPreview(draftId, saved, aiData) {
  const { payload, auditReport } = saved;
  const resultsList = payload.results
    .map((r) => `  • ${r.emoji} ${r.title} (${r.code}) — ${r.subtitle}`)
    .join('\n');

  const sampleQs = payload.questions
    .slice(0, 2)
    .map(
      (q) =>
        `Q${q.question_number}. ${q.text}\n` +
        q.options.map((o, idx) => `   ${idx + 1}) ${o.text} [${o.type_code}]`).join('\n')
    )
    .join('\n\n');

  const mcText = Object.entries(auditReport.monteCarloPct)
    .map(([k, v]) => `${k}:${v}`)
    .join(' / ');

  return (
    `🧪 [신규 테스트 초안 검수 요청]\n` +
    `━━━━━━━━━━━━━━━\n` +
    `${payload.test.emoji} 제목: ${payload.test.title}\n` +
    `🔖 ID: ${payload.test.id} | 카테고리: ${payload.test.category} | ${payload.questions.length}문항\n` +
    `📝 소개: ${payload.test.description}\n\n` +
    `🧭 결과 유형 (${payload.results.length}종):\n${resultsList}\n\n` +
    `📋 대표 문항 미리보기 (보기 자동 순환 적용):\n${sampleQs}\n\n` +
    `✅ 자동 품질 게이트 통과\n` +
    `• 채점 모드: 유형제 (score=NULL 확인)\n` +
    `• 페르소나 도달률: ${auditReport.personaReachable}/${payload.results.length} (100%)\n` +
    `• Monte Carlo(4,000회): ${mcText}\n` +
    `• 정책·외계어 필터: 이상 없음 | 초안 DB 저장 완료(비공개)\n` +
    `━━━━━━━━━━━━━━━\n` +
    `아래 버튼으로 라이브 발행 여부를 결정하세요. (초안 ID: ${draftId})`
  );
}

async function generateThreadsPromoForNewTest(openai, testInfo, results) {
  const url = `https://mbtifinder.com/${testInfo.id}`;
  try {
    const res = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      temperature: 0.85,
      response_format: { type: 'json_object' },
      messages: [
        {
          role: 'system',
          content: `너는 한국 스레드(Threads)·인스타 릴스 바이럴 에디터야.
신규 심리테스트 런칭 홍보 패키지를 JSON으로 작성해.
규칙:
- threadsPost: 220~350자, 1~2줄 훅 + 공감 질문 + 테스트 링크(${url}) 포함, 해시태그 3~4개
- reelsHook: 3초 안에 시선을 잡는 짧은 릴스/스토리 첫 문장 (25자 이내)
JSON만 출력: { "threadsPost": "...", "reelsHook": "..." }`,
        },
        {
          role: 'user',
          content: `테스트 제목: ${testInfo.title}\n설명: ${testInfo.description}\n유형: ${results.map((r) => r.title).join(', ')}`,
        },
      ],
    });
    return JSON.parse(res.choices[0].message.content);
  } catch {
    return {
      threadsPost: `${testInfo.emoji || '✨'} ${testInfo.title}\n\n친구랑 결과 비교해보면 은근 소름 돋는 테스트!\n👉 ${url}\n\n#심리테스트 #성향테스트 #MBTI`,
      reelsHook: `${testInfo.title}, 너는 어떤 유형?`,
    };
  }
}

export async function generateViralTest(openai, bot, chatId, { topic, targetAudience, tone }) {
  try {
    const safeTopic = assertSafeTopic(topic);
    await bot.sendMessage(
      chatId,
      `🚀 [Director Agent v2] 신규 테스트 초안 기획 시작...\n` +
        `• 주제: ${safeTopic}\n` +
        `• 타겟: ${targetAudience}\n` +
        `• 분위기: ${tone}\n` +
        `(기존 테스트 중복 확인 → gpt-4o 설계 → Critic 검수 → 4,000회 통계 검증 순으로 진행, 약 40초 소요)`
    );

    const existingTests = await listExistingTests();

    let saved = null;
    let finalAiData = null;
    let lastError = null;

    // 자동 품질 게이트 통과까지 최대 2회 시도
    for (let attempt = 1; attempt <= 2; attempt++) {
      try {
        const parsedData = await generateAndCritiqueDraft(openai, {
          topic: safeTopic,
          targetAudience,
          tone,
          existingTests,
          retryFeedback: lastError ? lastError.message : '',
        });

        finalAiData = toDeveloperPayload(parsedData);
        saved = await saveTestDraft(finalAiData, { allowOverwrite: false, strictQuality: true });
        lastError = null;
        break;
      } catch (err) {
        lastError = err;
        console.warn(`[TestGenerator] Attempt ${attempt} failed validation:`, err.message);
        if (attempt < 2) {
          await bot.sendMessage(
            chatId,
            `⚠️ [품질 게이트 보완] 1차 초안 검증 이슈 감지 (${err.message})\n자동으로 보완 재설계 중...`
          );
        }
      }
    }

    if (!saved || lastError) {
      throw new Error(`품질 게이트를 통과한 초안 생성에 실패했습니다: ${lastError?.message}`);
    }

    const draftId = crypto.randomBytes(4).toString('hex');
    pendingTestDrafts[draftId] = {
      draftId,
      testId: saved.testId,
      title: saved.payload.test.title,
      description: saved.payload.test.description,
      emoji: saved.payload.test.emoji,
      category: saved.payload.test.category,
      results: saved.payload.results.map((r) => ({ code: r.code, title: r.title, emoji: r.emoji })),
      promotionalCopy: finalAiData.promotionalCopy || '',
      topic: safeTopic,
      targetAudience,
      tone,
      createdAt: new Date().toISOString(),
    };
    savePendingDrafts(pendingTestDrafts);

    const previewText = formatApprovalPreview(draftId, saved, finalAiData);
    await bot.sendMessage(chatId, previewText, {
      reply_markup: {
        inline_keyboard: [
          [
            { text: '✅ 라이브 발행 승인', callback_data: `test_approve_${draftId}` },
            { text: '🗑️ 초안 삭제', callback_data: `test_discard_${draftId}` },
          ],
          [{ text: '🔄 같은 주제로 다시 기획하기', callback_data: `test_regen_${draftId}` }],
        ],
      },
    });
  } catch (error) {
    console.error('[generateViralTest error]', error);
    await bot.sendMessage(chatId, `❌ 테스트 초안 생성 중단: ${error.message}`);
  }
}

export async function sendPendingTestDrafts(bot, chatId) {
  const drafts = Object.values(pendingTestDrafts);
  if (!drafts.length) {
    return bot.sendMessage(chatId, '📭 현재 승인 대기 중인 신규 테스트 초안이 없습니다.\n`/newtest [주제]`로 새 초안을 만들어보세요.');
  }

  const lines = drafts.map(
    (d, idx) => `${idx + 1}. ${d.emoji || '✨'} ${d.title} (${d.testId}) — ID: ${d.draftId}`
  );
  const buttons = drafts.slice(0, 5).map((d) => [
    { text: `✅ 발행: ${d.title.slice(0, 14)}`, callback_data: `test_approve_${d.draftId}` },
    { text: `🗑️ 삭제`, callback_data: `test_discard_${d.draftId}` },
  ]);

  return bot.sendMessage(
    chatId,
    `🗂️ 승인 대기 중인 테스트 초안 (${drafts.length}건)\n\n${lines.join('\n')}`,
    { reply_markup: { inline_keyboard: buttons } }
  );
}

export async function handleTestDraftCallback(bot, openai, query, generateBridgeBlogDraft) {
  const data = query.data || '';
  if (
    !data.startsWith('test_approve_') &&
    !data.startsWith('test_discard_') &&
    !data.startsWith('test_regen_') &&
    !data.startsWith('test_blog_')
  ) {
    return false;
  }

  const chatId = query.message.chat.id;
  await bot.answerCallbackQuery(query.id).catch(() => {});

  // 1. 연계 브릿지 칼럼 초안 바로 쓰기
  if (data.startsWith('test_blog_')) {
    const testId = data.replace('test_blog_', '');
    if (typeof generateBridgeBlogDraft === 'function') {
      const existing = await listExistingTests().catch(() => []);
      const found = existing.find((t) => t.id === testId);
      const bridgeTopic = found
        ? `${found.title} 결과 유형별 특징과 일상 활용 가이드 (/${found.id} 테스트 연계)`
        : `${testId} 성향 테스트 결과 해석 및 자기이해 가이드`;
      await generateBridgeBlogDraft(bot, openai, chatId, bridgeTopic);
    }
    return true;
  }

  const draftId = data.replace(/^test_(approve|discard|regen)_/, '');
  const draft = pendingTestDrafts[draftId];
  if (!draft) {
    await bot.sendMessage(chatId, `⚠️ 해당 초안(${draftId})은 이미 처리되었거나 만료되었습니다.`);
    return true;
  }

  // 2. 승인 → 라이브 발행 + 홍보 패키지 생성
  if (data.startsWith('test_approve_')) {
    try {
      const pub = await publishTestDraft(draft.testId);
      delete pendingTestDrafts[draftId];
      savePendingDrafts(pendingTestDrafts);

      const promo = await generateThreadsPromoForNewTest(openai, draft, draft.results || []);

      await bot.sendMessage(
        chatId,
        `🎉 [신규 테스트 라이브 발행 완료]\n` +
          `━━━━━━━━━━━━━━━\n` +
          `📌 제목: ${pub.title}\n` +
          `🔗 라이브 URL: https://mbtifinder.com/${pub.testId}\n` +
          `(홈페이지 최대 60초, 사이트맵 최대 1시간 내 자동 반영)\n\n` +
          `🧵 [스레드 복붙 홍보글]\n${promo.threadsPost}\n\n` +
          `🎬 [릴스/스토리 3초 훅]\n"${promo.reelsHook}"\n\n` +
          `📸 [OG 홍보 이미지]\n` +
          `• 스토리(9:16): https://mbtifinder.com/api/og?testId=${pub.testId}&type=story\n` +
          `• 피드(1:1): https://mbtifinder.com/api/og?testId=${pub.testId}&type=feed\n` +
          `• 공유(16:9): https://mbtifinder.com/api/og?testId=${pub.testId}&type=share`,
        {
          reply_markup: {
            inline_keyboard: [
              [
                {
                  text: '✍️ 이 테스트 연계 브릿지 칼럼 초안 쓰기',
                  callback_data: `test_blog_${pub.testId}`,
                },
              ],
            ],
          },
        }
      );
    } catch (err) {
      console.error('[test_approve error]', err);
      await bot.sendMessage(chatId, `❌ 라이브 발행 실패: ${err.message}`);
    }
    return true;
  }

  // 3. 초안 삭제
  if (data.startsWith('test_discard_')) {
    try {
      await deleteTestDraft(draft.testId);
      delete pendingTestDrafts[draftId];
      savePendingDrafts(pendingTestDrafts);
      await bot.sendMessage(chatId, `🗑️ 초안 "${draft.title}" (${draft.testId})을 DB에서 깔끔하게 삭제했습니다.`);
    } catch (err) {
      await bot.sendMessage(chatId, `❌ 초안 삭제 실패: ${err.message}`);
    }
    return true;
  }

  // 4. 재생성
  if (data.startsWith('test_regen_')) {
    try {
      await deleteTestDraft(draft.testId).catch(() => {});
      delete pendingTestDrafts[draftId];
      savePendingDrafts(pendingTestDrafts);
      await generateViralTest(openai, bot, chatId, {
        topic: draft.topic,
        targetAudience: draft.targetAudience,
        tone: draft.tone,
      });
    } catch (err) {
      await bot.sendMessage(chatId, `❌ 재생성 실패: ${err.message}`);
    }
    return true;
  }

  return false;
}
