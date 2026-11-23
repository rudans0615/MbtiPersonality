import TelegramBot from 'node-telegram-bot-api';
import OpenAI from 'openai';
import { z } from 'zod';
import { zodResponseFormat } from 'openai/helpers/zod';
import dotenv from 'dotenv';
import {
  generateBridgeBlogDraft,
  handleBridgeBlogCallback,
  sendBlogQueueStatus,
  scheduleTwiceWeeklyBridgeBlog,
} from './bridgeBlogWorkflow.js';
import {
  sendGA4Report,
  scheduleWeeklyGA4Report,
  handleGA4Callback,
  sendThreadsPromoForPath,
  scheduleThreadsPromo,
} from './ga4Reporter.js';
import {
  generateViralTest,
  handleTestDraftCallback,
  sendPendingTestDrafts,
} from './testGeneratorAgent.js';
import { listExistingTests } from './developerAgent.js';

dotenv.config();

// 필수 환경변수 체크 (미사용 GITHUB_TOKEN 의존성 제거)
const requiredEnvs = ['TELEGRAM_BOT_TOKEN', 'OPENAI_API_KEY'];
for (const env of requiredEnvs) {
  if (!process.env[env]) {
    console.error(`🚨 Error: Missing required environment variable: ${env}`);
    process.exit(1);
  }
}

const ADMIN_CHAT_ID = (process.env.ADMIN_CHAT_ID || '').trim();
if (!ADMIN_CHAT_ID) {
  console.warn('⚠️ Warning: ADMIN_CHAT_ID is not set. Commands will not be restricted by chat ID.');
}

function isAuthorized(chatId) {
  if (!ADMIN_CHAT_ID) return true;
  return String(chatId) === ADMIN_CHAT_ID;
}

const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN, { polling: true });
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

console.log('🤖 Antigravity CMS Bot v2 is running...');

// 텔레그램 명령어 자동완성(/) 메뉴 등록
bot.setMyCommands([
  { command: 'suggest', description: '기존 테스트와 겹치지 않는 신규 테스트 주제 추천' },
  { command: 'newtest', description: '신규 테스트 초안 생성 → 통계검증 → 승인 발행 (예: /newtest 카페 공부 스타일)' },
  { command: 'drafts', description: '승인 대기 중인 신규 테스트 초안 목록 확인' },
  { command: 'newblog', description: '고품질 브릿지 칼럼 초안 작성 (승인 후 발행)' },
  { command: 'blogqueue', description: '남은 브릿지 칼럼 주제 큐 및 스케줄 확인' },
  { command: 'ga4', description: 'GA4 방문자·인기페이지·완료율 리포트 조회 (예: /ga4 또는 /ga4 30)' },
  { command: 'promo', description: 'GA4 인기 페이지 기반 스레드·릴스 홍보글 생성 (예: /promo 또는 /promo /teto-egen)' },
  { command: 'market', description: '마케팅 에이전시 파이프라인 가동 (예: /market hogu)' },
]);

if (process.env.BOT_NOTIFY_STARTUP === 'true' && ADMIN_CHAT_ID) {
  bot.sendMessage(
    ADMIN_CHAT_ID,
    `🤖 콘텐츠 자동화 봇 v2가 가동되었습니다.
- 💡 /suggest : 중복 없는 신규 테스트 주제 3선 추천
- 🧪 /newtest [주제] : 초안 생성 → 자동 품질·시뮬레이션 검증 → 승인 후 발행
- 🗂️ /drafts : 승인 대기 중인 테스트 초안 확인
- ✍️ /newblog [주제] : 승인형 SEO 브릿지 칼럼 작성
- 📊 /ga4 : 방문자·인기 페이지 성과 조회
- 🧵 /promo : 스레드·릴스 홍보글 패키지 생성`
  );
}

// /suggest 명령어 핸들러 (기존 테스트 중복 회피형 트렌드 디스커버리)
bot.onText(/\/(suggest|추천|idea)/, async (msg) => {
  const chatId = msg.chat.id;
  if (!isAuthorized(chatId)) return;

  bot.sendMessage(
    chatId,
    `💡 [Trend Discovery v2] 기존 활성 테스트와 겹치지 않는 고효율 신규 주제를 분석 중입니다... (약 10초 소요)`
  );

  try {
    const existing = await listExistingTests().catch(() => []);
    const existingList = existing.map((t) => `- ${t.title} (${t.category})`).join('\n');

    const SuggestionSchema = z.object({
      suggestions: z
        .array(
          z.object({
            emoji: z.string(),
            title: z.string().describe('클릭을 유도하되 애드센스 정책에 안전한 테스트 제목'),
            targetAudience: z.string().describe('타겟 연령대 및 특징'),
            description: z.string().describe('테스트 한줄 설명'),
            viralScore: z.string().describe('바이럴 잠재력 (예: ⭐️4.5/5.0)'),
            estimatedCpc: z.string().describe('예상 CPC 및 이유'),
            threadsHook: z.string().describe('스레드/릴스에 올릴 짧은 훅 카피'),
          })
        )
        .length(3),
    });

    const completion = await openai.beta.chat.completions.parse({
      model: 'gpt-4o',
      temperature: 0.9,
      messages: [
        {
          role: 'system',
          content: `너는 한국 10~30대 독자에게 사랑받는 데이터 기반 심리테스트 기획자야.
[규칙]
1. 아래 [기존 테스트]와 소재·제목이 절대 겹치지 않는 완전히 새로운 주제 3개를 제안하라.
2. 스토킹·폭력·자해·음주운전·의학적 진단 등 애드센스 정책 위반 소재는 절대 제안하지 마라.
3. 4개의 명확한 유형으로 깔끔하게 갈리는 일상·관계·직장·소비·자기이해 주제를 골라라.

[기존 테스트 목록]
${existingList || '(없음)'}`,
        },
        {
          role: 'user',
          content: '지금 SNS 공유와 검색 유입이 모두 잘 나올 신규 심리테스트 기획안 3개를 추천해줘.',
        },
      ],
      response_format: zodResponseFormat(SuggestionSchema, 'suggestion_response'),
    });

    const result = completion.choices[0].message.parsed;
    let replyMessage = `🔥 [신규 테스트 추천 3선 — 중복 회피]\n\n`;
    result.suggestions.forEach((item) => {
      replyMessage += `${item.emoji} ${item.title}\n`;
      replyMessage += `👤 타겟: ${item.targetAudience}\n`;
      replyMessage += `📝 설명: ${item.description}\n`;
      replyMessage += `📈 바이럴: ${item.viralScore} | ${item.estimatedCpc}\n`;
      replyMessage += `🧵 훅: "${item.threadsHook}"\n\n`;
    });
    replyMessage += `👉 마음에 드는 주제로 /newtest [주제] 를 입력하면 초안 생성 + 자동 품질 검증 후 승인 버튼이 도착합니다.`;

    bot.sendMessage(chatId, replyMessage);
  } catch (e) {
    bot.sendMessage(chatId, `❌ 추천 실패: ${e.message}`);
  }
});

// --- 대화형 신규 테스트 초안 빌더 상태 ---
const testBuilderState = {};

// /newtest 명령어 핸들러 (승인형 초안 빌더 진입점)
bot.onText(/\/(newtest|newtes)(?:\s+(.+))?/, async (msg, match) => {
  const chatId = msg.chat.id;
  if (!isAuthorized(chatId)) return;

  const topic = match[2] ? match[2].trim() : '';
  if (!topic) {
    return bot.sendMessage(
      chatId,
      `❌ 기획할 주제를 입력해주세요.\n예시: /newtest 카페 공부 스타일`
    );
  }

  testBuilderState[chatId] = { topic };

  bot.sendMessage(chatId, `📝 [${topic}] 신규 테스트 초안 기획을 시작합니다.\n\n먼저 타겟 연령대를 선택해주세요:`, {
    reply_markup: {
      inline_keyboard: [
        [{ text: '🎓 1020 세대 (트렌드/공감 톤)', callback_data: 'target_10' }],
        [{ text: '💼 2030 직장인·대학생 (현생 공감 톤)', callback_data: 'target_2030' }],
        [{ text: '👥 전 연령대 (보편적 자기이해 톤)', callback_data: 'target_all' }],
      ],
    },
  });
});

// /drafts 명령어 핸들러 (승인 대기 중인 테스트 초안 목록)
bot.onText(/\/(drafts|초안)/, async (msg) => {
  if (!isAuthorized(msg.chat.id)) return;
  await sendPendingTestDrafts(bot, msg.chat.id);
});

// /batch 은퇴 안내 (애드센스 저품질 방지)
bot.onText(/\/batch(?:\s+.*)?/, async (msg) => {
  if (!isAuthorized(msg.chat.id)) return;
  await bot.sendMessage(
    msg.chat.id,
    `🛡️ 애드센스 품질 보호를 위해 무검수 대량 발행(/batch) 기능은 종료되었습니다.\n` +
      `대신 /newtest [주제] 를 사용하시면 gpt-4o 설계 → Critic 검수 → 4,000회 통계 시뮬레이션 → 1클릭 승인 발행을 안전하게 진행할 수 있습니다.`
  );
});

// Inline Keyboard 콜백 통합 핸들러
bot.on('callback_query', async (query) => {
  const chatId = query.message?.chat?.id;
  if (!chatId || !isAuthorized(chatId)) {
    await bot.answerCallbackQuery(query.id, { text: '권한이 없습니다.' }).catch(() => {});
    return;
  }

  const data = query.data || '';
  if (await handleTestDraftCallback(bot, openai, query, generateBridgeBlogDraft)) return;
  if (await handleBridgeBlogCallback(bot, openai, query)) return;
  if (await handleGA4Callback(bot, openai, query, generateBridgeBlogDraft)) return;

  const state = testBuilderState[chatId];
  if (!state) return;

  await bot.answerCallbackQuery(query.id).catch(() => {});

  if (data.startsWith('target_')) {
    if (data === 'target_10') state.targetAudience = '10~20대 학생·Z세대';
    if (data === 'target_2030') state.targetAudience = '20~30대 직장인·대학생';
    if (data === 'target_all') state.targetAudience = '모든 연령대 보편적 타겟';

    bot.editMessageText(`✅ 타겟: ${state.targetAudience}\n\n다음으로 테스트 분위기를 선택해주세요:`, {
      chat_id: chatId,
      message_id: query.message.message_id,
      reply_markup: {
        inline_keyboard: [
          [{ text: '😊 따뜻한 공감·힐링 톤', callback_data: 'tone_mild' }],
          [{ text: '⚡ 유쾌한 팩폭·현실 공감 톤', callback_data: 'tone_spicy' }],
          [{ text: '🧭 차분한 자기이해·분석 톤', callback_data: 'tone_insight' }],
        ],
      },
    });
    return;
  }

  if (data.startsWith('tone_')) {
    if (data === 'tone_mild') state.tone = '따뜻한 공감과 힐링 중심 톤';
    if (data === 'tone_spicy') state.tone = '유쾌하고 솔직한 현실 팩폭 톤 (비하·혐오 금지)';
    if (data === 'tone_insight') state.tone = '차분하고 설득력 있는 자기이해 분석 톤';

    bot.editMessageText(
      `✅ 타겟: ${state.targetAudience}\n✅ 분위기: ${state.tone}\n\n🧪 초안 생성 및 자동 품질 게이트 검증을 시작합니다... (승인 전까지 라이브에 노출되지 않습니다)`,
      {
        chat_id: chatId,
        message_id: query.message.message_id,
      }
    );

    const finalConfig = { ...state };
    delete testBuilderState[chatId];

    try {
      await generateViralTest(openai, bot, chatId, finalConfig);
    } catch (err) {
      console.error(err);
      bot.sendMessage(chatId, `❌ 에이전트 실행 실패: ${err.message}`);
    }
  }
});

// /market 명령어 핸들러 (마케팅 에이전시 파이프라인)
bot.onText(/\/(market)\s+(.+)/, async (msg, match) => {
  const chatId = msg.chat.id;
  if (!isAuthorized(chatId)) return;

  const testId = match[2].trim();
  bot.sendMessage(chatId, `🏢 [Antigravity Marketing Agency] 가동 중...\n[${testId}] 테스트의 바이럴 캠페인을 기획합니다.`);

  try {
    const { createClient } = await import('@supabase/supabase-js');
    const supabase = createClient(
      process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );

    const [{ data: dbTests, error: fetchError }, { data: dbResults }] = await Promise.all([
      supabase.from('tests').select('id, title, description, category').eq('id', testId).single(),
      supabase.from('result_types').select('title, emoji').eq('test_id', testId),
    ]);

    let testData = { id: testId, title: testId, description: '알 수 없는 테스트', category: '기타', results: [] };
    if (dbTests && !fetchError) {
      testData = { ...dbTests, results: dbResults || [] };
    } else {
      bot.sendMessage(chatId, `⚠️ DB에서 '${testId}'를 찾지 못해 기본 데이터로 진행합니다.`);
    }

    const { generateMarketingCampaign } = await import('./marketingAgent.js');
    const report = await generateMarketingCampaign(testData, openai, (progressMsg) => {
      bot.sendMessage(chatId, progressMsg);
    });

    const finalMessage = `
🎉 [Antigravity Agency] 바이럴 마케팅 애셋 완성!
📌 타겟 테스트: ${report.testTitle}

━━━━━━━━━━━━━━━━━━━
📱 [인스타그램 피드 복붙용]
${report.copywriter.instagramFeed}

📸 [인스타그램 스토리 복붙용]
${report.copywriter.instagramStory}

🧵 [스레드 복붙용]
${report.copywriter.threadsCopy}

🎵 [틱톡 / 릴스 복붙용]
${report.copywriter.tiktokHook}

🛍️ [쿠팡 파트너스 추천 문구]
${report.performance.coupangText}

━━━━━━━━━━━━━━━━━━━
(내부 기획 요약)
• 타겟: ${report.analyst.targetAudience}
• 컬러/비주얼: ${report.visual.colorPalette}
• 썸네일 카피: "${report.visual.thumbnailText}"
• 핵심 메시지: ${report.analyst.coreMessage}
${report.visual.storyboard.map((s) => `  [${s.page}장] ${s.text} (${s.visualIdea})`).join('\n')}
`;

    if (report.imageUrl) {
      await bot.sendPhoto(chatId, report.imageUrl, {
        caption: finalMessage.length > 1024 ? '🎉 [Antigravity Agency] 바이럴 마케팅 애셋 완성! (상세 카피는 아래 메시지 참조)' : finalMessage,
      });
      if (finalMessage.length > 1024) {
        await bot.sendMessage(chatId, finalMessage);
      }
    } else {
      await bot.sendMessage(chatId, finalMessage);
    }
  } catch (error) {
    console.error(error);
    bot.sendMessage(chatId, `❌ 마케팅 에이전시 실행 중 에러 발생: ${error.message}`);
  }
});

// /newblog 명령어 핸들러 (승인형 브릿지 칼럼 초안 생성)
bot.onText(/\/(newblog)(?:\s+(.+))?/, async (msg, match) => {
  if (!isAuthorized(msg.chat.id)) return;
  const topic = match[2] ? match[2].trim() : null;
  await generateBridgeBlogDraft(bot, openai, msg.chat.id, topic);
});

// /blogqueue 명령어 핸들러 (남은 브릿지 주제 큐 확인)
bot.onText(/\/(blogqueue)/, async (msg) => {
  if (!isAuthorized(msg.chat.id)) return;
  await sendBlogQueueStatus(bot, msg.chat.id);
});

// /ga4 명령어 핸들러 (최근 N일 GA4 성과 즉시 조회)
bot.onText(/\/(ga4)(?:\s+(\d+))?/, async (msg, match) => {
  if (!isAuthorized(msg.chat.id)) return;
  const days = Math.min(90, Math.max(1, Number.parseInt(match[2] || '7', 10) || 7));
  await sendGA4Report(bot, openai, msg.chat.id, days);
});

// /promo 명령어 핸들러 (스레드·릴스 홍보 패키지 즉시 생성)
bot.onText(/\/(promo)(?:\s+(.+))?/, async (msg, match) => {
  if (!isAuthorized(msg.chat.id)) return;
  const targetPath = match[2] ? match[2].trim() : null;
  await sendThreadsPromoForPath(bot, openai, msg.chat.id, targetPath);
});

scheduleTwiceWeeklyBridgeBlog(bot, openai);
scheduleWeeklyGA4Report(bot, openai);
scheduleThreadsPromo(bot, openai);
