import OpenAI from 'openai';
import dotenv from 'dotenv';
import { injectCode } from './developerAgent.js';
import { exec } from 'child_process';

dotenv.config();

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const topic = "나와 가장 잘 맞는 MBTI 유형은?";

async function run() {
  console.log("Generating AI Data for topic:", topic);
  const completion = await openai.chat.completions.create({
    model: "gpt-4o",
    response_format: { type: "json_object" },
    messages: [
      {
        role: "system",
        content: "You are a senior content creator for a viral personality test site. Generate a JSON output containing 'testId' (alphabetic camelCase, e.g., 'mbtiMatchTest'), 'title', 'subtitle', 'questions' (array of 12 items with 'options' and 'score'), and 'results' (object with 4 personality types with 'code', 'title', 'description', etc.). Respond strictly in JSON format matching the TypeScript interfaces of the project."
      },
      {
        role: "user",
        content: `다음 주제로 바이럴 심리 테스트를 기획해줘: ${topic}`
      }
    ]
  });

  const aiData = JSON.parse(completion.choices[0].message.content);
  console.log("AI Data Generated:", aiData.title);
  
  await injectCode(aiData);
  console.log("AST Injection Complete. Pushing to GitHub...");

  exec(`git add ../../client/src && git commit -m "feat(ai-content): add new test ${aiData.title}" && git push origin main`, (error, stdout, stderr) => {
    if (error) {
       console.error("Git Fail:", error.message);
       return;
    }
    console.log("Done! Vercel is now deploying.");
  });
}
run();
