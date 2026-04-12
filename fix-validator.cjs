const fs = require('fs');
const filePath = 'scripts/cms-bot/bot.js';
let code = fs.readFileSync(filePath, 'utf-8');

// --- 1. /newtest 핸들러 수정 ---
// 초안 생성 변수명 변경 및 temperature 추가
code = code.replace(
  /const completion = await openai\.chat\.completions\.create\(\{\n\s*model: "gpt-4o-mini",\n\s*response_format: \{ type: "json_object" \},/g,
  `const draftCompletion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      temperature: 0.9,
      response_format: { type: "json_object" },`
);

// 검수 에이전트 삽입 (newtest)
const newTestValidationBlock = `const rawDraft = draftCompletion.choices[0].message.content;
    bot.sendMessage(chatId, \`🔍 초안 생성 완료! AI 검수 에이전트가 오타 및 문맥을 교정 중입니다...\`);

    const validationCompletion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      temperature: 0.1,
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content: \`너는 한국어 심리테스트 검수 전문 AI 에디터야. 
다음 제공되는 JSON 데이터의 스키마 명세("testId", "questions", "results" 등 구조)는 1%도 훼손하지 않고 그대로 유지해.
오직 내부에 있는 텍스트(질문, 선택지, 결과 설명 등)의 아래 오류만 찾아서 완벽하게 고치고 동일한 구조의 JSON으로 출력해.
1. "의원릅려고 해", "엎friend도 스뚜둥 울어", "സാം" 등 무의미한 외계어, 환각 현상(Hallucination) 완전 제거 후 문맥에 맞게 내용 대체.
2. 부자연스럽거나 번역기 돌린 것 같은 딱딱한 문장을 자연스러운 10~30대 한국어 구어체로 교정.
3. 띄어쓰기, 오타 및 맞춤법 교정.\`
        },
        { role: "user", content: rawDraft }
      ]
    });

    const aiData = JSON.parse(validationCompletion.choices[0].message.content);
    
    bot.sendMessage(chatId, \`✅ 검수 및 기획 완료! GitHub PR 생성을 준비합니다.\\n- 테스트명: \${aiData.title}\`);`;

code = code.replace(
  /const aiData = JSON\.parse\(completion\.choices\[0\]\.message\.content\);\n\s*bot\.sendMessage\(chatId, `✅ AI 콘텐츠 생성 완료! GitHub PR 생성을 준비합니다\.\\n- 테스트명: \$\{aiData\.title\}`\);/g,
  newTestValidationBlock
);

// --- 2. /batch 핸들러 수정 ---
// 초안 생성 변수명 변경 및 temperature 하향 (1.2 -> 0.9)
code = code.replace(
  /const completion = await openai\.chat\.completions\.create\(\{\n\s*model: "gpt-4o-mini",\n\s*temperature: 1\.2,/g,
  `const draftCompletion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        temperature: 0.9,`
);

// 검수 에이전트 삽입 (batch)
const batchValidationBlock = `const rawDraft = draftCompletion.choices[0].message.content;
      
      const validationCompletion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        temperature: 0.1,
        response_format: { type: "json_object" },
        messages: [
          {
            role: "system",
            content: \`너는 한국어 심리테스트 검수 전문 AI 에디터야. 
다음 제공되는 JSON 데이터의 스키마 명세는 건드리지 마.
오로지 내부에 있는 텍스트에서 "의원릅려고 해", "엎friend도", "സാം" 같은 무의미한 외계어/환각 현상을 찾아 자연스러운 한국어 구어체로 대체하고 오타를 교정해.
반드시 JSON 형식으로 응답해.\`
          },
          { role: "user", content: rawDraft }
        ]
      });

      const aiData = JSON.parse(validationCompletion.choices[0].message.content);
      bot.sendMessage(chatId, \`✅ [\${i + 1}/\${count}] "\${aiData.title}" 검수 완료! 코드 작성 중...\`);`;

code = code.replace(
  /const aiData = JSON\.parse\(completion\.choices\[0\]\.message\.content\);\n\s*bot\.sendMessage\(chatId, `✅ \[\$\{i \+ 1\}\/\$\{count\}\] "\$\{aiData\.title\}" 생성 완료! 코드 작성 중\.\.\.`\);/g,
  batchValidationBlock
);

fs.writeFileSync(filePath, code, 'utf-8');
console.log('Validation Agent injected successfully.');
