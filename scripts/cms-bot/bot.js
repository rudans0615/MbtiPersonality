import TelegramBot from 'node-telegram-bot-api';
import { Octokit } from '@octokit/rest';
import OpenAI from 'openai';
import { z } from 'zod';
import { zodResponseFormat } from 'openai/helpers/zod';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const scriptDir = path.dirname(fileURLToPath(import.meta.url));

// 환경변수 체크
const requiredEnvs = ['TELEGRAM_BOT_TOKEN', 'GITHUB_TOKEN', 'GITHUB_OWNER', 'GITHUB_REPO', 'OPENAI_API_KEY'];
for (const env of requiredEnvs) {
  if (!process.env[env]) {
    console.error(`🚨 Error: Missing required environment variable: ${env}`);
    process.exit(1);
  }
}

// 라이브러리 초기화
const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN, { polling: true });
const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const owner = process.env.GITHUB_OWNER;
const repo = process.env.GITHUB_REPO;

console.log('🤖 Antigravity CMS Bot is running...');

// 텔레그램 명령어 자동완성(/) 메뉴 등록
bot.setMyCommands([
  { command: 'suggest', description: '요즘 유행하는 바이럴 테스트 추천받기' },
  { command: 'newtest', description: '신규 테스트 자동 생성 및 배포 (예: /newtest 탕후루 취향)' },
  { command: 'batch', description: '한번에 여러 테스트 자동 생성 (예: /batch 3)' },
  { command: 'newblog', description: 'SEO 블로그 칼럼 자동 작성 및 배포 (예: /newblog INFP 연애)' },
  { command: 'market', description: '마케팅 에이전시 파이프라인 가동 (예: /market hogu)' },
]);

bot.sendMessage(process.env.ADMIN_CHAT_ID || '', `🤖 콘텐츠 자동화 봇이 가동되었습니다.
- 💡 /추천 : 요즘 유행하는 바이럴 테스트 기획안 스캔
- 🚀 /newtest [주제] : 테스트 1개 기획/디자인/배포
- 📦 /batch [숫자] : 여러 개의 테스트를 한 번에 묶음 자동 배포
- ✍️ /newblog [주제] : 구글 SEO 타겟 심리학 칼럼 발행
- 📈 /market [testId] : SNS 바이럴 마케팅 회사 (분석/카피/비주얼/수익화) 가동`);

// DEBUG: Log all incoming messages for diagnosis
bot.on('message', (msg) => {
  console.log('--- INCOMING MESSAGE ---');
  console.log(JSON.stringify(msg, null, 2));
});

// /추천 명령어 핸들러 (트렌드 디스커버리 에이전트)
bot.onText(/\/(suggest|추천|idea)/, async (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, `💡 [Trend Discovery Engine 가동 중] 현재 가장 핫한 트렌드와 클릭을 유발하는 고단가 주제를 분석하여 제안합니다...\n(gpt-4o 구조화 출력, 약 10초 소요)`);

  try {
    const SuggestionSchema = z.object({
      suggestions: z.array(z.object({
        emoji: z.string(),
        title: z.string().describe("SNS 클릭율을 극대화하는 후킹된 테스트 제목"),
        targetAudience: z.string().describe("타겟 연령대 및 특징 (예: 2030 직장인 여성)"),
        description: z.string().describe("테스트 한줄 설명 (MZ 구어체)"),
        viralScore: z.string().describe("바이럴 폭발력 (예: ⭐️4.5/5.0)"),
        estimatedCpc: z.string().describe("예상 전환 단가(CPC) 및 이유 (예: 💰높음 - 영양제/뷰티 고관여 타겟)"),
        instagramHook: z.string().describe("인스타 스토리에 올릴 어그로성 훅 카피")
      })).length(3)
    });

    const completion = await openai.beta.chat.completions.parse({
      model: "gpt-4o",
      temperature: 1.0,
      messages: [
        {
          role: "system",
          content: `너는 인스타/틱톡에서 100만뷰 이상 터뜨린 경험이 있는 데이터 기반 콘텐츠 기획자이자 마케터야.
평범한 소재를 비틀어서 "이거 완전 나잖아ㅋㅋ" 라는 반응을 이끌어내는 심리테스트를 기획해.

[디스커버리 룰]
1. 오늘날 10~30대 여성이 가장 공감할 만한 최신 밈, 스트레스 요인, 소비 습관, 인간관계를 파고들어라.
2. 각 기획안마다 '바이럴 폭발력'과 '예상 CPC(광고단가)'를 객관적으로 평가해.
3. 무조건 클릭하게 만드는 인스타그램 스토리용 '어그로 훅(Hook) 카피'를 포함해.
4. 절대 뻔한 제목(예: 나의 연애 성향 테스트)을 쓰지 말고, 구체적인 상황을 제목에 넣어라 (예: 전남친 프사 변경에 대처하는 나의 자세).`
        },
        {
          role: "user",
          content: "요즘 SNS에서 가장 빵 터질 만한 기발한 심리테스트 기획안 3개를 뽑아줘."
        }
      ],
      response_format: zodResponseFormat(SuggestionSchema, "suggestion_response")
    });

    const result = completion.choices[0].message.parsed;
    
    let replyMessage = `🔥 **[Antigravity Trend Discovery 3선]** 🔥\n\n`;
    result.suggestions.forEach((item, index) => {
      replyMessage += `${item.emoji} **${item.title}**\n`;
      replyMessage += `👤 타겟: ${item.targetAudience}\n`;
      replyMessage += `📝 설명: ${item.description}\n`;
      replyMessage += `📈 바이럴: ${item.viralScore} | ${item.estimatedCpc}\n`;
      replyMessage += `🎣 훅 카피: "${item.instagramHook}"\n\n`;
    });
    
    replyMessage += `👉 마음에 드는 주제가 있다면 \`/newtest [주제]\` 명령어로 즉각 개발을 지시하세요!`;

    bot.sendMessage(chatId, replyMessage, { parse_mode: 'Markdown' });
  } catch (e) {
    bot.sendMessage(chatId, `❌ 추천 실패: ${e.message}`);
  }
});


// --- 대화형 빌더 상태 저장소 ---
const testBuilderState = {}; // { [chatId]: { topic, targetAudience, tone } }

// /newtest 명령어 핸들러 (대화형 빌더 진입점)
bot.onText(/\/(newtest|newtes)(?:\s+(.+))?/, async (msg, match) => {
  const chatId = msg.chat.id;
  const topic = match[2];

  if (!topic) {
    return bot.sendMessage(chatId, `❌ 기획할 주제를 입력해주세요.\n예시: \`/newtest 탕후루 알바생\``, { parse_mode: 'Markdown' });
  }

  // 상태 초기화
  testBuilderState[chatId] = { topic };

  // 1단계: 타겟 연령대 선택
  const options = {
    reply_markup: {
      inline_keyboard: [
        [{ text: "👶 10대 (젠지/잘자요 아가씨 톤)", callback_data: "target_10" }],
        [{ text: "👩‍💼 2030 직장인 (피로/현생 공감 톤)", callback_data: "target_2030" }],
        [{ text: "👥 연령 무관 (보편적 공감)", callback_data: "target_all" }]
      ]
    }
  };

  bot.sendMessage(chatId, `📝 **[${topic}]** 주제 기획을 시작합니다.\n\n먼저, 타겟 연령대를 선택해주세요:`, { parse_mode: 'Markdown', ...options });
});

// Inline Keyboard 콜백 핸들러
bot.on('callback_query', async (query) => {
  const chatId = query.message.chat.id;
  const data = query.data;
  const state = testBuilderState[chatId];

  if (!state) return;

  // 타겟 연령대 처리
  if (data.startsWith('target_')) {
    if (data === 'target_10') state.targetAudience = '10대 젠지 세대';
    if (data === 'target_2030') state.targetAudience = '20~30대 직장인/대학생';
    if (data === 'target_all') state.targetAudience = '모든 연령대 보편적 타겟';

    // 2단계: 팩폭 수위 선택으로 넘어감
    const options = {
      reply_markup: {
        inline_keyboard: [
          [{ text: "😊 순한맛 (힐링/칭찬 위주)", callback_data: "tone_mild" }],
          [{ text: "💥 매운맛 팩폭 (뼈때리는 현실 직시)", callback_data: "tone_spicy" }],
          [{ text: "🔥 마라맛 저격 (인성 논란급 도파민)", callback_data: "tone_extreme" }]
        ]
      }
    };

    bot.editMessageText(`✅ 타겟: ${state.targetAudience}\n\n다음으로, **결과 팩폭 수위**를 선택해주세요:`, {
      chat_id: chatId,
      message_id: query.message.message_id,
      parse_mode: 'Markdown',
      ...options
    });
  }

  // 팩폭 수위 처리
  if (data.startsWith('tone_')) {
    if (data === 'tone_mild') state.tone = '순한맛 힐링톤';
    if (data === 'tone_spicy') state.tone = '매운맛 뼈때리는 팩폭';
    if (data === 'tone_extreme') state.tone = '마라맛 극딜 저격 (도파민 터지는)';

    bot.editMessageText(`✅ 타겟: ${state.targetAudience}\n✅ 팩폭 수위: ${state.tone}\n\n🚀 모든 설정이 완료되었습니다! 주제에 최적화된 유연한 매트릭스(4~8결과, 8~12문항) 생성을 시작합니다...`, {
      chat_id: chatId,
      message_id: query.message.message_id,
      parse_mode: 'Markdown'
    });

    // 상태를 가져온 뒤 삭제하여 꼬임 방지
    const finalConfig = { ...state };
    delete testBuilderState[chatId];

    // testGeneratorAgent 실행
    try {
      const { generateViralTest } = await import('./testGeneratorAgent.js');
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
  const testId = match[2];

  bot.sendMessage(chatId, `🏢 **Antigravity Marketing Agency** 가동 준비...\n[${testId}] 테스트의 바이럴 캠페인 기획을 시작합니다.`);

  try {
    // 1. 기존 테스트 데이터 로드 (DB에서 가져오기)
    const { createClient } = await import('@supabase/supabase-js');
    const supabase = createClient(process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
    
    const { data: dbTests, error: fetchError } = await supabase
      .from('tests')
      .select('id, title, description, category')
      .eq('id', testId)
      .single();

    let testData = { id: testId, title: testId, description: "알 수 없는 테스트", category: "기타" };
    if (dbTests && !fetchError) {
      testData = dbTests;
    } else {
      bot.sendMessage(chatId, `⚠️ DB에서 '${testId}'를 찾지 못해 기본 데이터로 진행합니다.`);
    }

    // 2. 마케팅 에이전시 실행
    const { generateMarketingCampaign } = await import('./marketingAgent.js');

    const report = await generateMarketingCampaign(testData, openai, (progressMsg) => {
      bot.sendMessage(chatId, progressMsg);
    });

    // 3. 최종 결과 포매팅 및 전송
    const finalMessage = `
🎉 **[Antigravity Agency] 바이럴 마케팅 애셋 완성!**
📌 타겟 테스트: **${report.testTitle}**

━━━━━━━━━━━━━━━━━━━
📱 **[인스타그램 피드 복붙용]**
${report.copywriter.instagramFeed}

📸 **[인스타그램 스토리 복붙용]**
${report.copywriter.instagramStory}

🧵 **[스레드 / 트위터 복붙용]**
${report.copywriter.threadsCopy}

🎵 **[틱톡 / 릴스 복붙용 (3초 훅 포함)]**
${report.copywriter.tiktokHook}

🛍️ **[수익화: 쿠팡 파트너스 복붙용 문구]**
${report.performance.coupangText}

━━━━━━━━━━━━━━━━━━━
*(내부 기획용 요약)*
- 🎯 타겟: ${report.analyst.targetAudience}
- 🎨 컬러/비주얼: ${report.visual.colorPalette}
- 💥 썸네일 카피: "${report.visual.thumbnailText}"
- 💡 핵심 메시지: ${report.analyst.coreMessage}
- 📖 스토리보드 요약:
${report.visual.storyboard.map(s => `  [${s.page}장] ${s.text} (${s.visualIdea})`).join('\n')}
`;

    if (report.imageUrl) {
      await bot.sendPhoto(chatId, report.imageUrl, {
        caption: finalMessage.length > 1024 ? "🎉 **[Antigravity Agency] 바이럴 마케팅 애셋 완성!** (내용이 길어 다음 메시지에 첨부합니다.)" : finalMessage,
        parse_mode: 'Markdown'
      });
      if (finalMessage.length > 1024) {
        await bot.sendMessage(chatId, finalMessage, { parse_mode: 'Markdown' });
      }
    } else {
      await bot.sendMessage(chatId, finalMessage, { parse_mode: 'Markdown' });
    }

  } catch (error) {
    console.error(error);
    bot.sendMessage(chatId, `❌ 마케팅 에이전시 실행 중 에러 발생: ${error.message}`);
  }
});

// /batch 명령어 핸들러 (한번에 여러 테스트 자동 생성)
bot.onText(/\/batch\s*(\d*)/, async (msg, match) => {
  const chatId = msg.chat.id;
  const count = Math.min(parseInt(match[1] || '3', 10), 5); // 최대 5개

    bot.sendMessage(chatId, `📦 [배치 모드] ${count}개의 신규 테스트를 자동 기획 및 배포합니다...\n(테스트당 약 1분 소요, 총 ${count}분 예상)`);

  const angles = [
    '연애/썸/소개팅/이별 감정',
    '직장생활/야근/퇴사/상사 유형',
    '소비습관/쇼핑/재테크/짠테크',
    '음식/카페/야식/배달앱 취향',
    'SNS/릴스/유튀브/넷플릭스 습관',
    '여행/휴식/힐링/번아웃 관리',
    '우정/친구관계/MBTI궁합/인간관계',
    '뷰티/패션/자기관리/다이어트',
    '집꾸미기/자취/룸메/독립생활',
    '계절감성/날씨/감정/멘탈관리'
  ];

  const successList = [];
  const failList = [];

  for (let i = 0; i < count; i++) {
    const angle = angles[Math.floor(Math.random() * angles.length)];
    const targetOptions = Math.random() < 0.5 ? 2 : 4;
    const targetQuestions = Math.random() < 0.5 ? 8 : 12;
    bot.sendMessage(chatId, `\n�\udd04 [${i + 1}/${count}] "주제: ${angle}" 방향으로 테스트 생성 중...`);

    try {
      const draftCompletion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        temperature: 0.9,
        response_format: { type: "json_object" },
        messages: [
          {
            role: "system",
            content: `너는 10~30대 한국 여성을 타겟으로 하는 최고의 바이럴 심리테스트 기획자야.

[페르소나]
- 인스타/틱톡에서 매일 밈을 소비하는 25세 여성 마케터
- "ㅋㅋㅋ 이거 완전 나잖아" 라는 반응을 끌어내는 게 목표
- 말투: ~인 사람?, ~하는 편이야?, 솔직히 말해봐 등 반말+존댓말 믹스

[질문 작성 절대 규칙]
1. "이런 경우" 같은 모호한 지시어 절대 금지. 반드시 구체적 상황 묘사
2. "~것인가요?" 같은 딱딱한 존칭 금지. 자연스러운 구어체
3. 문법 오류 절대 불가. 생성 후 스스로 문법 검수
4. 선택지도 자연스러운 구어체
5. 10~30대 여성 일상 시나리오 기반
6. 테스트 문항(questions)은 반드시 정확히 ${targetQuestions}개 작성할 것.
7. 각 문항의 선택지(options)는 반드시 정확히 ${targetOptions}개로 작성할 것 (A/B 구조 또는 4지선다).

[JSON 출력 형식]
{
  "testId": "camelCase 영문 ID (반드시 매번 겹치지 않는 고유하고 랜덤한 영문 ID 생성)",
  "category": "HOT | LOVE | PERSONALITY | FUN | CAREER 중 택1",
  "title": "바이럴 제목",
  "subtitle": "부제목",
  "description": "소개",
  "emoji": "이모지 1개",
  "seoArticle": "이 테스트의 심리학적 배경과 분석 원리를 다루는 500자 이상의 전문 칼럼 (문단 포함)",
  "questions": [{ "question": "구체적 상황 질문 (반드시 ${targetQuestions}개 작성)", "options": [{ "text": "구어체 선택지 (반드시 ${targetOptions}개)", "score": 1 }] }],
  "results": { "유형키": { "title": "유형명", "emoji": "이모지", "subtitle": "한줄요약", "description": "해당 유형의 장단점 및 특징을 다루는 300자 이상의 상세 설명", "characteristics": ["특징1","특징2","특징3","특징4"], "coupangKeyword": "상품 키워드" } }
}
JSON만 출력. 다른 텍스트 금지.`
          },
          {
            role: "user",
            content: `"${angle}" 방향으로 10~30대 여성이 SNS에 공유하고 싶어지는 바이럴 심리 테스트를 기획해줘. 이전에 나온 주제와 절대 겹치지 않는 창의적인 주제로.`
          }
        ]
      });

      const rawDraft = draftCompletion.choices[0].message.content;

      // 2. 검수 에이전트 (Validation)
      const validationCompletion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        temperature: 0.1,
        response_format: { type: "json_object" },
        messages: [
          {
            role: "system",
            content: `너는 한국어 심리테스트 검수 전문 AI 에디터야. 
다음 제출되는 JSON 데이터의 스키마 명세("testId", "questions", "results" 등 구조)는 단 1%도 건드리지 마.
대신, 텍스트(질문, 선택지, 결과 설명)에 포함된 아래 오류만 완벽하게 고쳐.
1. "의원릅려고 해", "엎friend도", "സാം", "스뚜둥" 같은 무의미한 외계어 및 AI 환각 완전 제거.
2. 부자연스럽거나 번역기 돌린 것 같은 딱딱한 문장을 친근한 10~30대 구어체로 교정.
3. 오타 및 맞춤법 교정.`
          },
          { role: "user", content: rawDraft }
        ]
      });

      const aiData = JSON.parse(validationCompletion.choices[0].message.content);
      bot.sendMessage(chatId, `✅ [${i + 1}/${count}] "${aiData.title}" 생성 및 검수 완료! 코드 작성 중...`);

      const { injectCode } = await import('./developerAgent.js');
      await injectCode(aiData);
      successList.push({
        title: aiData.title,
        testId: aiData.testId,
        promo: aiData.promotionalCopy || aiData.description
      });

    } catch (err) {
      console.error(`Batch item ${i + 1} failed:`, err);
      failList.push(`#${i + 1}: ${err.message}`);
    }
  }

  // 모든 테스트 생성 후 한번에 Git push + PR
  if (successList.length > 0) {
    bot.sendMessage(chatId, `\n�\ude80 ${successList.length}개 테스트 코드 작성 완료! GitHub PR 생성 중...`);
    bot.sendMessage(chatId, `
✅ **[Batch Complete!]** ${successList.length}개의 테스트가 데이터베이스에 성공적으로 삽입되었습니다!

${successList.map((t, i) => `
🔥 ${i + 1}. **${t.title}**
🔗 바로가기: https://mbtifinder.com/${t.testId}
👇 인스타 업로드 멘트:
"${t.promo}"
📸 이미지:
- [스토리용](https://mbtifinder.com/api/og?testId=${t.testId}&type=story) | [피드용](https://mbtifinder.com/api/og?testId=${t.testId}&type=feed) | [카톡용](https://mbtifinder.com/api/og?testId=${t.testId}&type=share)
`).join('\n')}

${failList.length > 0 ? `\n❌ Failed: ${failList.length}건\n${failList.join('\n')}` : ''}
`);
  } else {
    bot.sendMessage(chatId, `❌ 모든 테스트 생성에 실패했습니다.`);
  }
});

// 블로그 생성 및 배포 공통 함수
async function generateAndPublishBlog(chatId, topic) {
  let promptTopic = topic;

  if (!topic) {
    // 자동 모드: 주제가 없으면 알아서 트렌디한 롱테일 키워드 생성
    const angles = [
      'MBTI 연애 궁합 팩폭', '직장생활 인간관계 스트레스', '2030 여성 자존감 및 멘탈케어',
      '회피형/불안형 애착유형 연애', '소개팅/썸 카톡 심리', '테토-에겐 호르몬 심리',
      '번아웃 증후군 극복', '무기력증과 도파민 중독'
    ];
    const angle = angles[Math.floor(Math.random() * angles.length)];
    promptTopic = `"${angle}"와 관련된, 구글 검색량이 많을 것 같은 세부적인 롱테일 키워드(예: INFP가 읽씹하는 진짜 이유, 회피형 남친과 잘 지내는 법 등) 중 하나를 임의로 선정하여`;
    bot.sendMessage(chatId, `🤖 [Auto-Pilot] 오늘의 자동 블로그 포스팅을 시작합니다.\n선정된 테마: ${angle}\n(약 1~2분 소요)`);
  } else {
    bot.sendMessage(chatId, `✍️ [${topic}] 주제로 SEO 최적화 블로그 칼럼 작성을 시작합니다...\n(약 1~2분 소요)`);
  }

  try {
    let existingPostsContext = "기존에 작성된 블로그 포스트가 없습니다.";
    const { createClient } = await import('@supabase/supabase-js');
    const supabase = createClient(process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
    
    const { data: recentPosts } = await supabase
      .from('blog_posts')
      .select('id, title')
      .order('id', { ascending: false })
      .limit(15);
      
    if (recentPosts && recentPosts.length > 0) {
      existingPostsContext = recentPosts.map(p => `- 제목: "${p.title}" (링크 URL: /blog/${p.id})`).join('\n');
    }

    const blogCompletion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      temperature: 0.85,
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content: `너는 심리학, MBTI, 연애 심리 분야의 전문 칼럼니스트이자 완벽한 구글 SEO 최적화 전문가야.
독자들이 흥미롭게 읽으면서도 구글 검색 상위 노출 기준을 완벽하게 만족하는 장문(1,500자 이상)의 블로그 포스트를 작성해야 해.

[SEO 블로그 작성 절대 규칙]
1. H2(<h2>)와 H3(<h3>) 태그를 명확한 계층 구조로 사용하여 문단을 나누어 가독성을 높일 것.
2. 각 H2, H3 제목 아래에는 충분히 길고 깊이 있는 내용의 문단(<p>)을 작성할 것.
3. 리스트(<ul>, <li>), 강조(<strong>) 등을 적절히 사용하여 글의 가독성을 높일 것.
4. "이 글에서는~", "안녕하세요~" 같은 뻔한 서론 금지. 즉시 호기심을 유발하는 본론으로 들어갈 것.
5. 전문적인 심리학 지식과 대중적인 공감 포인트(예시, 비유)를 적절히 믹스할 것.
6. 글의 전체 분량은 최소 1,500자 이상이 되도록 매우 상세하게 작성할 것.
7. [매우 중요: 내부 링크] 아래 <기존 블로그 목록>을 참고하여, 현재 작성 중인 본문 내용과 문맥이 자연스럽게 이어지는 글이 있다면 1~2개 이상을 반드시 본문 내에 하이퍼링크로 삽입할 것. 
   - 사용 예시: <a href="/blog/18" class="text-pink-500 font-bold hover:underline">INFP가 읽씹하는 진짜 이유</a>를 참고해보세요.

<기존 블로그 목록>
${existingPostsContext}
</기존 블로그 목록>

[JSON 출력 형식 - 반드시 준수]
{
  "title": "검색엔진에서 클릭을 유도하는 후킹하고 명확한 제목 (50자 이내)",
  "excerpt": "검색결과에 노출될 매력적인 메타 디스크립션 요약 (100자 내외)",
  "category": "심층분석 | 관계심리 | 커리어 | 호르몬 성격학 중 가장 어울리는 것 1택",
  "tags": ["키워드1", "키워드2", "키워드3", "키워드4"],
  "content": "HTML 형태의 본문 코드 (반드시 <h2>, <h3>, <p>, <ul>, <strong> 등을 사용하여 구조화할 것. 백틱(\`) 사용 금지, 쌍따옴표 이스케이프 철저히 할 것.)"
}

JSON 형식 외에 어떤 말도 출력하지 마.`
        },
        {
          role: "user",
          content: `다음 주제로 검색엔진 상위 노출을 노리는 깊이 있는 심리학 칼럼을 작성해줘: ${promptTopic}`
        }
      ]
    });

    const aiData = JSON.parse(blogCompletion.choices[0].message.content);

    bot.sendMessage(chatId, `✅ 칼럼 작성 완료! [${aiData.title}]\n로컬 코드에 주입을 시작합니다...`);

    const { injectBlogPost } = await import('./blogAgent.js');
    const newId = await injectBlogPost(aiData);

    bot.sendMessage(chatId, `
🎉 **[블로그 즉시 배포 완료]**

📌 제목: ${aiData.title}
🔗 링크: https://mbtifinder.com/blog/${newId}

새로운 블로그 포스트가 데이터베이스에 성공적으로 삽입되어 라이브에 즉시 반영되었습니다!`);

  } catch (error) {
    console.error(error);
    bot.sendMessage(chatId, `❌ 에러 발생: ${error.message}`);
  }
}

// /newblog 명령어 핸들러 (수동 트리거 및 자동 모드 지원)
bot.onText(/\/(newblog)(?:\s+(.+))?/, async (msg, match) => {
  const chatId = msg.chat.id;
  const topic = match[2] || null;
  await generateAndPublishBlog(chatId, topic);
});

// 매일 정해진 시간(예: 오전 10시)에 자동으로 블로그를 발행하는 스케줄러
function scheduleDailyBlog() {
  const now = new Date();
  const targetHour = 10; // 오전 10시
  const targetMinute = 0;

  const nextRun = new Date(now.getFullYear(), now.getMonth(), now.getDate(), targetHour, targetMinute, 0, 0);

  // 이미 오늘 10시가 지났다면 내일 10시로 설정
  if (now.getTime() >= nextRun.getTime()) {
    nextRun.setDate(nextRun.getDate() + 1);
  }

  const delay = nextRun.getTime() - now.getTime();

  console.log(`🤖 Auto-Pilot 스케줄러 세팅 완료: 다음 포스팅까지 ${Math.floor(delay / 1000 / 60)}분 남았습니다.`);

  setTimeout(() => {
    const adminChatId = process.env.ADMIN_CHAT_ID;
    if (adminChatId) {
      generateAndPublishBlog(adminChatId, null);
    }

    // 이후에는 24시간마다 반복
    setInterval(() => {
      if (adminChatId) {
        generateAndPublishBlog(adminChatId, null);
      }
    }, 24 * 60 * 60 * 1000);

  }, delay);
}

// 스케줄러 시작
scheduleDailyBlog();

