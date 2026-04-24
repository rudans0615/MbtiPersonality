const fs = require('fs');
const path = require('path');

const pagesDir = path.join(__dirname, 'client', 'src', 'pages');
const files = fs.readdirSync(pagesDir).filter(f => f.endsWith('-results.tsx'));

files.forEach(file => {
  const filePath = path.join(pagesDir, file);
  let content = fs.readFileSync(filePath, 'utf-8');

  // 1. Add import RelatedTests
  if (!content.includes('import RelatedTests from')) {
    content = content.replace(
      /import { AdSenseBlock } from "@\/components\/AdSenseBlock";/,
      'import { AdSenseBlock } from "@/components/AdSenseBlock";\nimport RelatedTests from "@/components/RelatedTests";'
    );
  }

  // 2. Remove otherTests declaration
  content = content.replace(
    /\/\/ Cross-link: random 3 other tests[\s\S]*?(?=if \(isAnalyzing\))/g,
    ''
  );

  // 3. Replace the Cross-link rendering block with <RelatedTests />
  const testIdMatch = file.match(/^(.*?)-results\.tsx$/);
  const testId = testIdMatch ? testIdMatch[1] : '';

  // Use regex to remove the entire Cross-link block
  // It starts with {/* Cross-link: Recommended other tests */}
  // and ends before <AdSenseBlock adSlot="1133557799" /> or final div
  content = content.replace(
    /\{\/\* Cross-link: Recommended other tests \*\/\}[\s\S]*?(?=<AdSenseBlock adSlot="1133557799" \/>)/,
    `<RelatedTests currentTestId="${testId}" />\n\n        `
  );

  fs.writeFileSync(filePath, content);
  console.log(`Updated ${file}`);
});
