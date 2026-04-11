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
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "You are a trend analyzer and viral marketer. Suggest 3 highly viral and engaging personality/psychology test topics (in Korean) that would perform extremely well for AdSense revenue. Format as a neat list with emojis, short descriptions, and expected virality."
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
          content: "You are a top-tier viral marketer and psychological test creator. Generate a JSON output containing 'testId' (english alphabetic string, e.g., 'mbtiMatchTest'), 'category' (string EXACTLY ONE OF: 'HOT', 'LOVE', 'PERSONALITY', 'FUN', 'CAREER'), 'title', 'subtitle', 'description', 'questions' (strictly an array of 12 objects, each containing a 'question' string and an 'options' array of exactly 4 objects containing 'text' and 'score'), and 'results' (object with 4 personality types with 'title', 'description'). MUST BE STRICTLY IN KOREAN (except testId and category). The title, subtitle, and descriptions MUST use highly engaging, click-inducing viral marketing copywriting. Respond STRICTLY in JSON format."
        },
        {
          role: "user",
          content: `다음 주제로 바이럴 심리 테스트를 기획해줘: ${topic}`
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
