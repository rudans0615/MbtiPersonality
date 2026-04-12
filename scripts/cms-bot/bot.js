import TelegramBot from 'node-telegram-bot-api';
import { Octokit } from '@octokit/rest';
import OpenAI from 'openai';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));

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
]);

bot.sendMessage(process.env.ADMIN_CHAT_ID || '', '🤖 콘텐츠 자동화 봇이 가동되었습니다.\n- 💡 /추천 : 요즘 유행하는 바이럴 테스트 기획안 받기\n- 🚀 /newtest [주제] : 기획안으로 테스트 자동배포 시작');

// DEBUG: Log all incoming messages for diagnosis
bot.on('message', (msg) => {
  console.log('--- INCOMING MESSAGE ---');
  console.log(JSON.stringify(msg, null, 2));
});

// /추천 명령어 핸들러 (아이디어 스캐너)
bot.onText(/\/(suggest|추천|idea)/, async (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, `💡 [애널리틱스 연동] 요즘 틱톡/인스타에서 광고 단가(CPC)가 높고 바이럴이 잘 터지는 심리테스트 주제를 스캔 중입니다...\n(약 10초 소요)`);

  try {
    // 매번 다른 각도의 추천을 위한 랜덤 시드
    const angles = [
      '연애/썸/소개팅/이별 감정',
      '직장생활/야근/퇴사/상사 유형',
      '소비습관/쇼핑/재테크/짠테크',
      '음식/카페/야식/배달앱 취향',
      'SNS/릴스/유튜브/넷플릭스 습관',
      '여행/휴식/힐링/번아웃 관리',
      '우정/친구관계/MBTI궁합/인간관계',
      '뷰티/패션/자기관리/다이어트',
      '집꾸미기/자취/룸메/독립생활',
      '계절감성/날씨/감정/멘탈관리'
    ];
    const pickedAngle = angles[Math.floor(Math.random() * angles.length)];
    const pickedAngle2 = angles[Math.floor(Math.random() * angles.length)];

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      temperature: 1.1,
      messages: [
        {
          role: "system",
          content: `너는 인스타/틱톡에서 100만뷰 이상 터뜨린 경험이 있는 10~30대 한국 여성 타겟 바이럴 콘텐츠 크리에이터야.

[페르소나]
- 너의 별명은 "밈 공장장"
- 평범한 일상 소재를 기발한 각도로 비틀어서 "ㅋㅋㅋㅋ 미쳤어 이거 나야" 반응을 뽑아내는 게 특기
- 이미 있는 주제도 남들이 생각 못 한 신선한 각도로 재해석하면 더 터진다는 걸 알고 있음

[임무]
10~30대 여성들이 "이거 해봤어??" 하면서 단톡방에 뿌릴 심리테스트 주제 3개를 기획해.

[이번 추천 시드 - 이 키워드에서 영감을 받되, 거기서 기발하게 비틀 것]
- 시드 A: "${pickedAngle}"
- 시드 B: "${pickedAngle2}"
- 시드 C: 완전 예상 밖의 신선한 소재 (반려동물, 전생, 혈액형, 별자리, 집 인테리어, ASMR 취향, 이모지 선택 등 뭐든 OK)

[크리에이티브 원칙]
1. "또 그거야?" 소리 들으면 실패. 같은 연애 주제라도 "전 남친 인스타 스토리 반응으로 보는 ~" 처럼 예상 못 한 각도로 비틀어야 함
2. 제목만 봐도 손가락이 멈추는 후킹 카피 필수 (예: "장바구니 속 야식으로 보는 너의 전생", "카톡 프사 바꾸는 주기로 보는 감정 유형")
3. 결과를 공유했을 때 "ㅋㅋㅋㅋ 인정", "아 이거 팩폭인데?" 같은 리액션이 나와야 성공
4. 뻔한 자기계발 톤(숨은 재능, 뇌 유형 등) 절대 NO. 현실 공감 + 약간의 자조적 유머가 핵심

[출력 규칙]
1. 반드시 한국어로만 작성
2. 각 주제마다: 이모지 + 테스트 제목 + 한줄 설명(MZ톤) + 왜 바이럴 될지 이유 한줄
3. 제목은 "~로 보는 나의 ~유형", "~테스트" 형태로 SNS 클릭율 극대화
4. 설명은 ~임/~인 듯/~ㅋㅋ 같은 자연스러운 MZ 말투로`
        }
      ]
    });
    
    const replyMessage = `🔥 **[최신 바이럴 테스트 추천 3선]** 🔥\n\n${completion.choices[0].message.content}\n\n👉 마음에 드는 주제가 있다면 \`/newtest [주제]\` 명령어로 즉각 개발을 지시하세요!`;
    bot.sendMessage(chatId, replyMessage, { parse_mode: 'Markdown' });
  } catch(e) {
    bot.sendMessage(chatId, `❌ 추천 실패: ${e.message}`);
  }
});

// /newtest 명령어 핸들러 (오타 방어: /newtes 포함, 연속 띄어쓰기 방어)
bot.onText(/\/(newtest|newtes)\s+(.+)/, async (msg, match) => {
  const chatId = msg.chat.id;
  const topic = match[2];

  bot.sendMessage(chatId, `📝 [${topic}] 주제로 신규 콘텐츠 AI 기획을 시작합니다...\n(약 1~2분 소요)`);

  try {
    // 1. OpenAI를 통한 테스트 로직 및 데이터 생성
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
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
1. "이런 경우", "이런 상황" 같은 모호한 지시어 절대 금지. 반드시 구체적인 상황을 묘사해야 함
   - ❌ "이런 경우 당신은 어떻게 행동할 것인가요?"
   - ✅ "금요일 밤 11시, 침대에서 넷플릭스 틀었는데 친구가 갑자기 '홍대 갈래?' 하면?"
2. "~것인가요?", "~합니까?" 같은 딱딱한 존칭 금지. 자연스러운 구어체 사용
   - ❌ "다른 사람들과의 관계는 어떻게 생각하나요?"
   - ✅ "친구가 약속 30분 전에 '오늘 컨디션 안 좋아서 못 갈 듯ㅠ' 하면 솔직히 어때?"
3. "어떤를" 같은 문법 오류 절대 불가. 생성 후 반드시 스스로 문법 검수할 것
4. 선택지도 반드시 자연스러운 한국어 구어체로 작성
   - ❌ "누군가의 조언을 듣는다."
   - ✅ "일단 친한 언니한테 카톡으로 sos 보냄"
5. 각 질문은 10~30대 여성이 일상에서 겪는 구체적인 시나리오여야 함 (카페, SNS, 친구관계, 연애, 쇼핑, 야근 등)

[JSON 출력 형식 - 반드시 준수]
{
  "testId": "camelCase 영문 ID (예: coffeeAddict)",
  "category": "HOT | LOVE | PERSONALITY | FUN | CAREER 중 택1",
  "title": "SNS에서 클릭하고 싶은 바이럴 제목",
  "subtitle": "부제목 (호기심 유발)",
  "description": "테스트 소개 문구",
  "emoji": "대표 이모지 1개",
  "questions": [
    {
      "question": "구체적 상황이 담긴 질문 (12개)",
      "options": [
        { "text": "자연스러운 구어체 선택지", "score": 1~4 숫자 }
      ]
    }
  ],
  "results": {
    "유형키1": {
      "title": "유형 이름 (밈/유행어 활용)",
      "emoji": "이모지",
      "subtitle": "한줄 요약",
      "description": "3~4문장의 뼈때리는 유형 설명",
      "characteristics": ["특징1", "특징2", "특징3", "특징4"],
      "coupangKeyword": "쿠팡에서 실제 검색 가능한 상품 키워드"
    }
  }
}

[최종 검수 체크리스트 - 출력 전 반드시 확인]
- [ ] 모든 question에 구체적 상황이 있는가? ("이런 경우" 류 없는가?)
- [ ] 문법 오류가 없는가? ("어떤를", "것인가요" 등)
- [ ] 10~30대 여성이 "ㅋㅋㅋ 이거 나" 할 만한 공감 포인트가 있는가?
- [ ] results의 각 유형에 emoji, characteristics 배열, coupangKeyword가 있는가?
- [ ] 선택지가 자연스러운 구어체인가?

JSON만 출력해. 다른 텍스트 절대 금지.`
        },
        {
          role: "user",
          content: `다음 주제로 10~30대 여성이 SNS에 공유하고 싶어지는 바이럴 심리 테스트를 기획해줘: ${topic}`
        }
      ]
    });

    const aiData = JSON.parse(completion.choices[0].message.content);
    
    bot.sendMessage(chatId, `✅ AI 콘텐츠 생성 완료! GitHub PR 생성을 준비합니다.\n- 테스트명: ${aiData.title}`);

    // 2. 개발자 에이전트 파일 생셩 및 주입 (Full-stack AST Code Injection)
    bot.sendMessage(chatId, `🚀 기획안 승인 완료! 풀스택 에이전트가 로컬 React 코드를 자동 작성 중입니다...`);
    const { injectCode } = await import('./developerAgent.js');
    await injectCode(aiData);

    const { exec } = await import('child_process');
    bot.sendMessage(chatId, `⚙️ 코드 작성 완료! GitHub PR(결재 요청)을 생성합니다...`);

    const branchName = `feat/ai-${aiData.testId}-${Date.now()}`;
    const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
    
    exec(`git checkout -b ${branchName} && git add -A && git commit -m "feat(ai-content): add new test ${aiData.title}" && git push origin ${branchName}`, { cwd: repoRoot }, async (error, stdout, stderr) => {
      // 작업 후 항상 main 브랜치로 복귀
      exec(`git checkout main`, { cwd: repoRoot });
      
      if (error) {
         console.error("GIT STDOUT:", stdout);
         console.error("GIT STDERR:", stderr);
         bot.sendMessage(chatId, `⚠️ GitHub 전송 실패.\nSTDERR: ${stderr || '(없음)'}\nERROR: ${error.code}`);
         return;
      }
      
      try {
        // GitHub PR 생성
        const pr = await octokit.pulls.create({
          owner,
          repo,
          title: `🆕 [AI 신규 테스트] ${aiData.title}`,
          head: branchName,
          base: 'main',
          body: `## 📋 AI 자동 생성 테스트 결재 요청\n\n- **테스트명**: ${aiData.title}\n- **부제**: ${aiData.subtitle || ''}\n- **카테고리**: ${aiData.category || 'HOT'}\n- **문항 수**: ${aiData.questions?.length || 12}문항\n\n---\n> ✅ **대표님 승인(Merge) 후 자동 배포됩니다.**\n> ❌ 거절 시 Close 버튼을 눌러주세요.`
        });
        
        bot.sendMessage(chatId, `
📋 **[결재 요청] 신규 테스트 PR이 생성되었습니다!**

📌 테스트명: ${aiData.title}
🔗 결재 링크: ${pr.data.html_url}

👆 위 링크에서 내용 확인 후:
  ✅ 승인 → **Merge pull request** 클릭 → 자동 배포
  ❌ 거절 → **Close pull request** 클릭`);
      } catch (prError) {
        bot.sendMessage(chatId, `⚠️ PR 생성 실패: ${prError.message}\n(브랜치 ${branchName}은 정상 푸시됨)`);
      }
    });

  } catch (error) {
    console.error(error);
    bot.sendMessage(chatId, `❌ 에러 발생: ${error.message}`);
  }
});

// /batch 명령어 핸들러 (한번에 여러 테스트 자동 생성)
bot.onText(/\/batch\s*(\d*)/, async (msg, match) => {
  const chatId = msg.chat.id;
  const count = Math.min(parseInt(match[1] || '3', 10), 5); // 최대 5개

  bot.sendMessage(chatId, `📦 [배치 모드] ${count}개의 신규 테스트를 자동 기획합니다...\n(테스트당 약 1분 소요, 총 ${count}분 예상)`);

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
    bot.sendMessage(chatId, `\n�\udd04 [${i + 1}/${count}] "주제: ${angle}" 방향으로 테스트 생성 중...`);

    try {
      const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        temperature: 1.2,
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

[JSON 출력 형식]
{
  "testId": "camelCase 영문 ID",
  "category": "HOT | LOVE | PERSONALITY | FUN | CAREER 중 택1",
  "title": "바이럴 제목",
  "subtitle": "부제목",
  "description": "소개",
  "emoji": "이모지 1개",
  "questions": [{ "question": "구체적 상황 질문", "options": [{ "text": "구어체 선택지", "score": 1 }] }],
  "results": { "유형키": { "title": "유형명", "emoji": "이모지", "subtitle": "한줄요약", "description": "설명", "characteristics": ["특징1","특징2","특징3","특징4"], "coupangKeyword": "상품 키워드" } }
}
JSON만 출력. 다른 텍스트 금지.`
          },
          {
            role: "user",
            content: `"${angle}" 방향으로 10~30대 여성이 SNS에 공유하고 싶어지는 바이럴 심리 테스트를 기획해줘. 이전에 나온 주제와 절대 겹치지 않는 창의적인 주제로.`
          }
        ]
      });

      const aiData = JSON.parse(completion.choices[0].message.content);
      bot.sendMessage(chatId, `✅ [${i + 1}/${count}] "${aiData.title}" 생성 완료! 코드 작성 중...`);

      const { injectCode } = await import('./developerAgent.js');
      await injectCode(aiData);
      successList.push(aiData.title);

    } catch (err) {
      console.error(`Batch item ${i + 1} failed:`, err);
      failList.push(`#${i + 1}: ${err.message}`);
    }
  }

  // 모든 테스트 생성 후 한번에 Git push + PR
  if (successList.length > 0) {
    bot.sendMessage(chatId, `\n�\ude80 ${successList.length}개 테스트 코드 작성 완료! GitHub PR 생성 중...`);
    const { exec } = await import('child_process');
    const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
    const branchName = `feat/ai-batch-${Date.now()}`;

    exec(`git checkout -b ${branchName} && git add -A && git commit -m "feat(ai-batch): add ${successList.length} new tests" && git push origin ${branchName}`, { cwd: repoRoot }, async (error, stdout, stderr) => {
      exec(`git checkout main`, { cwd: repoRoot });

      if (error) {
        bot.sendMessage(chatId, `⚠️ GitHub 전송 실패: ${stderr || error.message}`);
        return;
      }

      try {
        const pr = await octokit.pulls.create({
          owner, repo,
          title: `[AI Batch] ${successList.length} new tests`,
          head: branchName,
          base: 'main',
          body: `## AI Batch Results\n\n### Success (${successList.length})\n${successList.map((t, i) => `${i + 1}. ${t}`).join('\n')}\n\n${failList.length > 0 ? `### Failed (${failList.length})\n${failList.join('\n')}` : ''}`
        });
        bot.sendMessage(chatId, `\n[Batch Complete!]\n\nSuccess: ${successList.length}\n${successList.map((t, i) => `  ${i + 1}. ${t}`).join('\n')}\n${failList.length > 0 ? `\nFailed: ${failList.length}` : ''}\n\nPR: ${pr.data.html_url}\n\nMerge to deploy!`);
      } catch (prErr) {
        const errMsg = prErr?.response?.data?.message || prErr?.message || JSON.stringify(prErr);
        bot.sendMessage(chatId, `⚠️ PR 생성 실패: ${errMsg}\n\n(브랜치 ${branchName}은 정상 푸시됨. GitHub에서 수동 PR 가능)`);
      }
    });
  } else {
    bot.sendMessage(chatId, `❌ 모든 테스트 생성에 실패했습니다.`);
  }
});
