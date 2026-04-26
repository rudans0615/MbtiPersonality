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
    const targetOptions = Math.random() < 0.5 ? 2 : 4;
    const targetQuestions = Math.random() < 0.5 ? 8 : 12;

    // 1. OpenAI를 통한 테스트 로직 및 데이터 생성 (초안)
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
5. 각 질문은 10~30대 여성이 일상에서 겪는 구체적인 시나리오여야 함
6. 테스트 문항(questions)은 반드시 정확히 ${targetQuestions}개 작성할 것.
7. 각 문항의 선택지(options)는 반드시 정확히 ${targetOptions}개로 작성할 것 (A/B 구조 또는 4지선다).

[JSON 출력 형식 - 반드시 준수]
{
  "testId": "camelCase 영문 ID (예: coffeeAddict)",
  "category": "HOT | LOVE | PERSONALITY | FUN | CAREER 중 택1",
  "title": "SNS에서 클릭하고 싶은 바이럴 제목",
  "subtitle": "부제목 (호기심 유발)",
  "description": "테스트 소개 문구",
  "emoji": "대표 이모지 1개",
  "seoArticle": "이 테스트의 심리학적 배경, 추천 대상, 분석 원리를 다루는 500자 이상의 구체적이고 전문적인 칼럼 텍스트 (반드시 문단 나누기 \n\n 포함)",
  "promotionalCopy": "인스타 피드나 틱톡에 테스트를 홍보할 때 쓸 10~30대 타겟의 짧고 찰진 복붙용 멘트 (예: 뼈때림 주의 💥 내 번아웃 지수는 몇 프로일까? 친구 소환!)",
  "questions": [
    {
      "question": "구체적 상황이 담긴 질문 (반드시 ${targetQuestions}개 작성)",
      "options": [
        { "text": "자연스러운 구어체 선택지 (반드시 ${targetOptions}개)", "score": 1 }
      ]
    }
  ],
  "results": {
    "유형키1": {
      "title": "유형 이름 (밈/유행어 활용)",
      "emoji": "이모지",
      "subtitle": "한줄 요약",
      "description": "해당 유형의 성격, 장단점, 연애스타일, 어울리는 사람 등을 다루는 300자 이상의 매우 상세하고 구체적인 설명",
      "characteristics": ["특징1", "특징2", "특징3", "특징4"],
      "coupangKeyword": "고관여/고단가 제품 위주의 구체적인 구매 검색어 (예: 센트룸 멀티비타민, 오쏘몰 이뮨, 무선 마사지건, 고급 디퓨저 등). 단순 책/문구류 절대 금지.",
      "coupangHook": "쿠팡 추천 영역 상단에 띄울 20자 내외의 구매 자극 후킹 멘트 (예: 스트레스 폭발 직전인 당신, 오늘 밤엔 딥슬립 꿀잠템 어때요?)"
    }
  }
}

[최종 검수 체크리스트 - 출력 전 반드시 확인]
- [ ] 모든 question에 구체적 상황이 있는가? ("이런 경우" 류 없는가?)
- [ ] 문법 오류가 없는가? ("어떤를", "것인가요" 등)
- [ ] 10~30대 여성이 "ㅋㅋㅋ 이거 나" 할 만한 공감 포인트가 있는가?
- [ ] results의 각 유형에 emoji, characteristics 배열, coupangKeyword, coupangHook이 있는가?
- [ ] 선택지가 자연스러운 구어체인가?

JSON만 출력해. 다른 텍스트 절대 금지.`
        },
        {
          role: "user",
          content: `다음 주제로 10~30대 여성이 SNS에 공유하고 싶어지는 바이럴 심리 테스트를 기획해줘: ${topic}`
        }
      ]
    });

    const rawDraft = draftCompletion.choices[0].message.content;
    
    bot.sendMessage(chatId, `🔍 초안 생성 완료! AI 검수 에이전트가 오타 및 문맥을 교정 중입니다...`);

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
    
    bot.sendMessage(chatId, `✅ 검수 및 기획 완료! GitHub PR 생성을 준비합니다.\n- 테스트명: ${aiData.title}`);

    // 2. 개발자 에이전트 파일 생셩 및 주입 (Full-stack AST Code Injection)
    bot.sendMessage(chatId, `🚀 기획안 승인 완료! 풀스택 에이전트가 로컬 React 코드를 자동 작성 중입니다...`);
    
    const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
    const { exec } = await import('child_process');
    const util = await import('util');
    const execPromise = util.promisify(exec);
    
    try {
      await execPromise('git stash && git checkout main && git pull origin main', { cwd: repoRoot });
    } catch (e) {
      console.error('Git update error:', e);
    }

    const { injectCode } = await import('./developerAgent.js');
    await injectCode(aiData);

    bot.sendMessage(chatId, `⚙️ 코드 작성 완료! GitHub PR(결재 요청)을 생성합니다...`);

    const branchName = `feat/ai-${aiData.testId}-${Date.now()}`;
    
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
✅ **[신규 테스트 배포 완료]** ${aiData.title}

👇 **즉시 복붙 가능한 인스타 업로드용 멘트:**
"${aiData.promotionalCopy || aiData.description}"

📸 **홍보용 이미지 다운로드 링크:**
- [인스타 스토리용 (9:16)](https://mbtifinder.com/api/og?testId=${aiData.testId}&type=story)
- [인스타 피드용 (1:1)](https://mbtifinder.com/api/og?testId=${aiData.testId}&type=feed)
- [카톡 공유용 (16:9)](https://mbtifinder.com/api/og?testId=${aiData.testId}&type=share)
*(※ 주의: 위 이미지 링크들은 아래 PR을 승인(Merge)하고 Vercel 배포가 끝나야만 정상적으로 보입니다!)*

🔗 **결재 링크:** ${pr.data.html_url}
👆 위 링크에서 내용 확인 후 **Merge pull request** 클릭 시 자동 배포됩니다.`);
      } catch (prError) {
        bot.sendMessage(chatId, `⚠️ PR 생성 실패: ${prError.message}\n(브랜치 ${branchName}은 정상 푸시됨)`);
      }
    });

  } catch (error) {
    console.error(error);
    bot.sendMessage(chatId, `❌ 에러 발생: ${error.message}`);
  }
});

// /market 명령어 핸들러 (마케팅 에이전시 파이프라인)
bot.onText(/\/(market)\s+(.+)/, async (msg, match) => {
  const chatId = msg.chat.id;
  const testId = match[2];

  bot.sendMessage(chatId, `🏢 **Antigravity Marketing Agency** 가동 준비...\n[${testId}] 테스트의 바이럴 캠페인 기획을 시작합니다.`);

  try {
    // 1. 기존 테스트 데이터 로드 (정적 파일 또는 동적 임포트)
    const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
    const testTypesPath = path.join(repoRoot, 'src/data/testTypes.ts');
    const fs = await import('fs');
    
    // 단순 파싱을 위해 정규식 사용 (실제 모듈 임포트는 어려우므로)
    const fileContent = fs.readFileSync(testTypesPath, 'utf-8');
    
    // 객체 배열 추출 로직 (매우 단순화된 파싱)
    // 좀 더 안전하게 정규식으로 testId에 해당하는 타이틀/설명을 찾음
    const idRegex = new RegExp(`id:\\s*["']${testId}["']\\s*,[\\s\\S]*?title:\\s*["']([^"']+)["']\\s*,[\\s\\S]*?description:\\s*["']([^"']+)["']`);
    const matchData = idRegex.exec(fileContent);
    
    let testData = { id: testId, title: testId, description: "알 수 없는 테스트", category: "기타" };
    if (matchData) {
      testData.title = matchData[1];
      testData.description = matchData[2];
    } else {
      // testTypes에서 못 찾으면 그냥 입력값으로 진행
      bot.sendMessage(chatId, `⚠️ testTypes.ts에서 '${testId}'를 찾지 못해 기본 데이터로 진행합니다.`);
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
      bot.sendPhoto(chatId, report.imageUrl, {
        caption: finalMessage.length > 1024 ? "🎉 **[Antigravity Agency] 바이럴 마케팅 애셋 완성!** (내용이 길어 다음 메시지에 첨부합니다.)" : finalMessage,
        parse_mode: 'Markdown'
      });
      if (finalMessage.length > 1024) {
        bot.sendMessage(chatId, finalMessage, { parse_mode: 'Markdown' });
      }
    } else {
      bot.sendMessage(chatId, finalMessage, { parse_mode: 'Markdown' });
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

  bot.sendMessage(chatId, `📦 [배치 모드] ${count}개의 신규 테스트를 자동 기획합니다...\n(테스트당 약 1분 소요, 총 ${count}분 예상)`);

  const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
  const { exec } = await import('child_process');
  const util = await import('util');
  const execPromise = util.promisify(exec);

  try {
    await execPromise('git stash && git checkout main && git pull origin main', { cwd: repoRoot });
  } catch (e) {
    console.error('Git update error:', e);
  }

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
          body: `## AI Batch Results\n\n### Success (${successList.length})\n${successList.map((t, i) => `${i + 1}. ${t.title}`).join('\n')}\n\n${failList.length > 0 ? `### Failed (${failList.length})\n${failList.join('\n')}` : ''}`
        });
        bot.sendMessage(chatId, `
✅ **[Batch Complete!]** ${successList.length}개의 테스트가 배포 대기 중입니다.

${successList.map((t, i) => `
🔥 ${i + 1}. **${t.title}**
👇 인스타 업로드 멘트:
"${t.promo}"
📸 이미지:
- [스토리용](https://mbtifinder.com/api/og?testId=${t.testId}&type=story) | [피드용](https://mbtifinder.com/api/og?testId=${t.testId}&type=feed) | [카톡용](https://mbtifinder.com/api/og?testId=${t.testId}&type=share)
`).join('\n')}
*(※ 주의: 위 이미지 링크들은 아래 PR을 승인(Merge)해야만 정상적으로 열립니다!)*

${failList.length > 0 ? `\n❌ Failed: ${failList.length}건\n${failList.join('\n')}` : ''}

🔗 **PR 결재 링크:** ${pr.data.html_url}
👆 위 링크에서 승인(Merge) 시 자동 배포됩니다.`);
      } catch (prErr) {
        const errMsg = prErr?.response?.data?.message || prErr?.message || JSON.stringify(prErr);
        bot.sendMessage(chatId, `⚠️ PR 생성 실패: ${errMsg}\n\n(브랜치 ${branchName}은 정상 푸시됨. GitHub에서 수동 PR 가능)`);
      }
    });
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

    const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
    const { exec } = await import('child_process');
    const util = await import('util');
    const execPromise = util.promisify(exec);
    
    try {
      await execPromise('git stash && git checkout main && git pull origin main', { cwd: repoRoot });
    } catch (e) {
      console.error('Git update error:', e);
    }

    const { injectBlogPost } = await import('./blogAgent.js');
    const newId = await injectBlogPost(aiData);

    bot.sendMessage(chatId, `⚙️ 코드 주입 완료! GitHub PR(결재 요청)을 생성합니다...`);

    const branchName = `feat/blog-${newId}-${Date.now()}`;
    
    exec(`git checkout -b ${branchName} && git add -A && git commit -m "docs(blog): add post ${newId} - ${aiData.title}" && git push origin ${branchName}`, { cwd: repoRoot }, async (error, stdout, stderr) => {
      exec(`git checkout main`, { cwd: repoRoot });
      
      if (error) {
         bot.sendMessage(chatId, `⚠️ GitHub 전송 실패.\nSTDERR: ${stderr}\nERROR: ${error.code}`);
         return;
      }
      
      try {
        const pr = await octokit.pulls.create({
          owner,
          repo,
          title: `📝 [신규 블로그] ${aiData.title}`,
          head: branchName,
          base: 'main',
          body: `## 📋 SEO 블로그 칼럼 결재 요청\n\n- **제목**: ${aiData.title}\n- **요약**: ${aiData.excerpt}\n- **카테고리**: ${aiData.category}\n- **태그**: ${aiData.tags.join(', ')}\n\n---\n> ✅ **승인(Merge) 시 자동으로 사이트에 배포되며, 구글 검색엔진에 노출됩니다.**`
        });
        
        bot.sendMessage(chatId, `
📝 **[블로그 결재 요청] 새 칼럼 PR이 생성되었습니다!**

📌 제목: ${aiData.title}
🔗 결재 링크: ${pr.data.html_url}

👆 위 링크에서 내용 확인 후 Merge 버튼을 눌러 배포하세요!`);
      } catch (prError) {
        bot.sendMessage(chatId, `⚠️ PR 생성 실패: ${prError.message}`);
      }
    });

  } catch (error) {
    console.error(error);
    bot.sendMessage(chatId, `❌ 에러 발생: ${error.message}`);
  }
}

// /newblog 명령어 핸들러 (수동 트리거)
bot.onText(/\/(newblog)\s+(.+)/, async (msg, match) => {
  const chatId = msg.chat.id;
  const topic = match[2];
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

