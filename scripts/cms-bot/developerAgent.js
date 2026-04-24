import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const srcDir = path.resolve(__dirname, '../../src');

export async function injectCode(aiData) {
  const { testId, title, subtitle, description, emoji, questions, results, category, seoArticle } = aiData;
  const capitalizedId = testId.charAt(0).toUpperCase() + testId.slice(1) + 'Test';
  const emojiChar = emoji || '✨';
  const descText = description || '당신의 심리와 성향을 정확하게 분석해주는 흥미로운 테스트입니다.';
  const qLen = questions?.length || 12;
  
  // 1. Data Files Generation
  const questionsContent = 'export const seoArticle = ' + JSON.stringify(seoArticle || '이 테스트는 심리적 성향을 알아볼 수 있는 흥미로운 분석을 제공합니다. 문항을 통해 당신의 심리를 깊이 있게 탐구해보세요.') + ';\nexport const ' + testId + 'Questions = ' + JSON.stringify(questions, null, 2) + ';';
  fs.writeFileSync(path.join(srcDir, 'data/' + testId + 'Questions.ts'), questionsContent);

  const resultsContent = [
    'export const calculate' + capitalizedId + 'Level = (score: number) => {',
    '  const keys = Object.keys(' + testId + 'Results);',
    '  const numKeys = keys.length;',
    '  if (numKeys === 0) return "";',
    '  const maxScore = ' + qLen + ' * 4;',
    '  const minScore = ' + qLen + ';',
    '  const range = maxScore - minScore;',
    '  const step = range / numKeys;',
    '  const idx = Math.min(Math.floor((score - minScore) / step), numKeys - 1);',
    '  return keys[Math.max(0, idx)];',
    '};',
    '',
    'export const ' + testId + 'Results: Record<string, any> = ' + JSON.stringify(results, null, 2) + ';'
  ].join('\n');
  fs.writeFileSync(path.join(srcDir, 'data/' + testId + 'Types.ts'), resultsContent);

  // (No more React page generation, Next.js handles it via Dynamic Routing)

  // 2. Inject into testTypes.ts
  const typesPath = path.join(srcDir, 'data/testTypes.ts');
  let typesFile = fs.readFileSync(typesPath, 'utf-8');
  if (!typesFile.includes('id: "' + testId + '"')) {
    const aiCat = category || 'HOT';
    const newTestConfig = '\n  {\n' +
      '    id: "' + testId + '",\n' +
      '    category: "' + aiCat + '",\n' +
      '    title: "' + title + '",\n' +
      '    subtitle: "' + (subtitle || '') + '",\n' +
      '    description: "' + descText.replace(/"/g, '\\"') + '",\n' +
      '    emoji: "' + emojiChar + '",\n' +
      '    color: "from-purple-500 to-pink-500",\n' +
      '    duration: "약 3분",\n' +
      '    questions: ' + qLen + ',\n' +
      '    href: "/' + testId + '",\n' + // Next.js dynamic route
      '    features: ["AI 맞춤 분석", "나만의 결과지", "궁합 확인"],\n' +
      '    isAvailable: true\n' +
      '  },';
    typesFile = typesFile.replace(/export const testTypes: TestType\[\] = \[/, 'export const testTypes: TestType[] = [' + newTestConfig);
    fs.writeFileSync(typesPath, typesFile);
  }

  // 3. Inject into sitemap.xml
  const sitemapPath = path.join(srcDir, '../public/sitemap.xml');
  if (fs.existsSync(sitemapPath)) {
    let sitemapFile = fs.readFileSync(sitemapPath, 'utf-8');
    if (!sitemapFile.includes('/' + testId + '</loc>')) {
      const newSitemapEntry = `  <url>\n    <loc>https://mbtifinder.com/${testId}</loc>\n    <changefreq>weekly</changefreq>\n    <priority>0.8</priority>\n  </url>\n</urlset>`;
      sitemapFile = sitemapFile.replace('</urlset>', newSitemapEntry);
      fs.writeFileSync(sitemapPath, sitemapFile);
    }
  }
}
