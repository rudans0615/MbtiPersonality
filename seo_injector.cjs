const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, 'client', 'src', 'pages');

const files = [
  { path: 'test.tsx', title: 'MBTI 성격유형 검사', description: '과학적으로 검증된 16가지 성격 분석' },
  { path: 'results.tsx', title: 'MBTI 결과 분석', description: '당신의 MBTI 성격 유형 상세 결과' },
  { path: 'hogu-test.tsx', title: '연애 호구력 진단 테스트', description: '끌려다니는 연애는 그만! 나의 호구력을 팩트로 진단해보세요.' },
  { path: 'hogu-results.tsx', title: '연애 호구력 진단 결과', description: '당신의 연애 포식자/초식동물 유형 결과입니다.' },
  { path: 'teto-egen-test.tsx', title: '테토 vs 에겐 호르몬 진단', description: '테스토스테론과 에스트로겐 수치를 기반으로 당신의 두뇌 성향을 분석합니다.' },
  { path: 'teto-egen-results.tsx', title: '테토 vs 에겐 진단 결과', description: '당신의 호르몬 성향 분석 결과입니다.' }
];

files.forEach(file => {
  const fullPath = path.join(root, file.path);
  if (!fs.existsSync(fullPath)) return;
  
  let content = fs.readFileSync(fullPath, 'utf8');
  
  // SEO import 추가
  if (!content.includes('import SEO from')) {
    // 찾을 첫 번째 import 구문 위치에 주입
    content = content.replace(/(import[^;]+;\r?\n)/, `$1import SEO from "@/components/SEO";\n`);
  }
  
  // 첫 번째 <div className="min-h-screen 패턴 바로 밑에 <SEO /> 삽입
  if (!content.includes('<SEO title=')) {
    content = content.replace(/(<div[^>]*className="min-h-screen[^>]*>\r?\n)/, `$1      <SEO title="${file.title}" description="${file.description}" />\n`);
  }
  
  fs.writeFileSync(fullPath, content);
  console.log(`Injected SEO into ${file.path}`);
});
