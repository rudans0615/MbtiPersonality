const fs = require('fs');

function updateDrunkTest() {
  const file = 'client/src/pages/drunk-test.tsx';
  let code = fs.readFileSync(file, 'utf-8');

  // Add import
  if (!code.includes('ShareButtons')) {
    code = code.replace(
      'import { Button } from "@/components/ui/button";',
      'import { Button } from "@/components/ui/button";\nimport { ShareButtons } from "@/components/ShareButtons";'
    );
  }

  // Remove handleShare
  code = code.replace(/const handleShare = \([\s\S]*?alert\('링크가 클립보드에 복사되었습니다!'\);\n      \}\n    \};\n\n/g, '');

  // Replace Share UI
  const shareUIMatch = /<div className="bg-gradient-to-r from-pink-50 to-purple-50 rounded-xl p-6 text-center">[\s\S]*?<\/div>\n                <\/div>/;
  code = code.replace(shareUIMatch, `
                <ShareButtons 
                  title="나 술 취했나? 자가진단 결과"
                  shareText={\`나의 현재 상태는 '\${result.title}'입니다!\`}
                  url="https://mbtifinder.com/drunk-test"
                />`);

  fs.writeFileSync(file, code);
}

function updateHoguResults() {
  const file = 'client/src/pages/hogu-results.tsx';
  if (!fs.existsSync(file)) return;
  let code = fs.readFileSync(file, 'utf-8');

  if (!code.includes('ShareButtons')) {
    code = code.replace(
      'import { Button } from "@/components/ui/button";',
      'import { Button } from "@/components/ui/button";\nimport { ShareButtons } from "@/components/ShareButtons";'
    );
  }

  // Remove handleShare and fallbackCopy
  code = code.replace(/const handleShare = \([\s\S]*?fallbackCopyTextToClipboard\(shareMessage\);\n        \}\n        break;\n    \}\n  \};\n\n/g, '');
  code = code.replace(/const fallbackCopyTextToClipboard = \([\s\S]*?document\.body\.removeChild\(textArea\);\n  \};\n\n/g, '');

  // Replace Share UI
  const shareUIMatch = /<h3 className="text-xl font-bold text-neutral-800 mb-6 text-center">💌 결과 공유하기<\/h3>[\s\S]*?<\/div>[\s\S]*?<\/div>/;
  if(code.match(shareUIMatch)) {
      code = code.replace(shareUIMatch, `
            <ShareButtons 
              title="나의 호구력 테스트 결과"
              shareText={\`나의 호구력은 '\${result.title}'입니다!\`}
              url="https://mbtifinder.com/hogu-test"
            />`);
  } else {
      // In case it's different structure
      const altMatch = /\{\/\* Share Buttons \*\/\}[\s\S]*?<\/div>[\r\n\s]*<div className="mt-8 flex justify-center pb-8">/;
      code = code.replace(altMatch, `
            {/* Share Buttons */}
            <ShareButtons 
              title="나의 호구력 테스트 결과"
              shareText={\`나의 호구력은 '\${result.title}'입니다!\`}
              url="https://mbtifinder.com/hogu-test"
            />

            <div className="mt-8 flex justify-center pb-8">`);
  }

  fs.writeFileSync(file, code);
}

function updateResultCard() {
  const file = 'client/src/components/ResultCard.tsx';
  let code = fs.readFileSync(file, 'utf-8');

  if (!code.includes('ShareButtons')) {
    code = code.replace(
      'import { CoupangRecommend } from "@/components/CoupangRecommend";',
      'import { CoupangRecommend } from "@/components/CoupangRecommend";\nimport { ShareButtons } from "@/components/ShareButtons";'
    );
  }

  // ResultCard has onShare prop which we can ignore or remove, but let's just replace the UI
  // The share UI is: <div className="text-center space-y-4 mt-8">\n <h3 className="text-xl font-semibold text-neutral-800">결과 공유하기</h3> ... </div> <Button onRestart>
  const shareUIMatch = /<div className="text-center space-y-4 mt-8">[\s\S]*?<h3 className="text-xl font-semibold text-neutral-800">결과 공유하기<\/h3>[\s\S]*?<\/div>\n          <Button\n            onClick=\{onRestart\}/;
  
  if (code.match(shareUIMatch)) {
    code = code.replace(shareUIMatch, `<ShareButtons 
          title="MBTI 검사 결과"
          shareText={\`나의 성격유형은 \${mbtiType.code}(\${mbtiType.title})입니다!\`}
          url="https://mbtifinder.com/"
        />\n\n          <Button\n            onClick={onRestart}`);
  }

  fs.writeFileSync(file, code);
}

try { updateDrunkTest(); } catch(e) { console.error('drunk error', e) }
try { updateHoguResults(); } catch(e) { console.error('hogu error', e) }
try { updateResultCard(); } catch(e) { console.error('resultcard error', e) }
console.log('done');
