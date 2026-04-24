const fs = require('fs');
const filesToClient = [
  'src/components/ShareButtons.tsx',
  'src/components/AdSenseBlock.tsx',
  'src/components/ResultImageCard.tsx',
  'src/components/CoupangRecommend.tsx',
  'src/app/about/page.tsx',
  'src/app/blog/page.tsx',
  'src/app/contact/page.tsx',
  'src/app/drunk/page.tsx',
  'src/app/test/page.tsx',
  'src/app/teto-egen/page.tsx',
  'src/app/teto-egen/results/page.tsx'
];
filesToClient.forEach(f => {
  let content = fs.readFileSync(f, 'utf8');
  if (!content.startsWith('"use client";')) {
    content = '"use client";\n' + content;
  }
  fs.writeFileSync(f, content, 'utf8');
});

let testTypes = fs.readFileSync('src/data/testTypes.ts', 'utf8');
testTypes = testTypes.replace(/-test"/g, '"');
fs.writeFileSync('src/data/testTypes.ts', testTypes, 'utf8');
