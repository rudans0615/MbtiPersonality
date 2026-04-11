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
    bot.sendMessage(chatId, `⚙️ 코드 작성 완료! GitHub 및 Vercel로 배포 데이터 전송을 시작합니다...`);

    exec(`git add . && (git diff-index --quiet HEAD || git commit -m "feat(ai-content): add new test ${aiData.title}") && git push https://${process.env.GITHUB_TOKEN}@github.com/${process.env.GITHUB_OWNER}/${process.env.GITHUB_REPO}.git main`, (error, stdout, stderr) => {
      if (error) {
         console.error("GIT ERROR:", stderr);
         bot.sendMessage(chatId, `⚠️ 로컬 파일은 생성되었으나 GitHub 전송에 실패했습니다.\n상세 에러: ${stderr || error.message}`);
         return;
      }
      
      // 3. 완료 결과 보고
      bot.sendMessage(chatId, `
🎉 **완벽 코딩 자동화 및 서버 연동 완료!**
    
📌 내용: [${aiData.title}]
✅ Vercel 연동 내역:
- \`src/data/${aiData.testId}\` 데이터, 페이지 생성
- \`App.tsx\` 와 메뉴바(\`Navigation.tsx\`) 해킹 주입 완료
- **🚀 GitHub 퍼블리싱 성공! 현재 Vercel이 라이브 서버를 굽기 시작했습니다.**

약 1분 뒤 브라우저 새로고침을 누르시면 라이브 서버 반영을 확인하실 수 있습니다!`);
    });

  } catch (error) {
    console.error(error);
    bot.sendMessage(chatId, `❌ 에러 발생: ${error.message}`);
  }
});
