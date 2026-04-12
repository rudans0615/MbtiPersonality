const fs = require('fs');
const filePath = 'scripts/cms-bot/bot.js';
let lines = fs.readFileSync(filePath, 'utf-8').split('\n');

// Line 347 (index 346): Fix PR title - remove broken emoji
lines[346] = "          title: `[AI Batch] ${successList.length} new tests`,\r";

// Line 350 (index 349): Fix PR body - remove broken emoji  
lines[349] = "          body: `## AI Batch Results\\n\\n### Success (${successList.length})\\n${successList.map((t, i) => `${i + 1}. ${t}`).join('\\n')}\\n\\n${failList.length > 0 ? `### Failed (${failList.length})\\n${failList.join('\\n')}` : ''}`\r";

// Line 352 (index 351): Fix success message - remove broken emojis
lines[351] = "        bot.sendMessage(chatId, `\\n[Batch Complete!]\\n\\nSuccess: ${successList.length}\\n${successList.map((t, i) => `  ${i + 1}. ${t}`).join('\\n')}\\n${failList.length > 0 ? `\\nFailed: ${failList.length}` : ''}\\n\\nPR: ${pr.data.html_url}\\n\\nMerge to deploy!`);\r";

fs.writeFileSync(filePath, lines.join('\n'), 'utf-8');
console.log('Fixed lines 347, 350, 352');
