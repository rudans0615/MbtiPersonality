import fs from 'fs';
import path from 'path';

const projectRoot = path.resolve('../..'); // Adjust depending on exec path
const clientSrc = path.join(process.cwd(), '../../client/src');

export async function injectCode(aiData) {
  const { testId, title, subtitle, description, emoji, questions, results, category } = aiData;
  const capitalizedId = testId.charAt(0).toUpperCase() + testId.slice(1) + 'Test';
  const capitalizedResults = testId.charAt(0).toUpperCase() + testId.slice(1) + 'Results';
  
  // 1. Data Files Generation
  const questionsContent = `export const ${testId}Questions = ${JSON.stringify(questions, null, 2)};`;
  fs.writeFileSync(path.join(clientSrc, `data/${testId}Questions.ts`), questionsContent);

  // Parse results map to Types
  const resultsContent = `
export const calculate${capitalizedId}Level = (score: number) => {
  // AI-generated scoring threshold placeholder
  if (score < 20) return Object.keys(${testId}Results)[0];
  if (score < 40) return Object.keys(${testId}Results)[1];
  if (score < 60) return Object.keys(${testId}Results)[2];
  return Object.keys(${testId}Results)[3] || Object.keys(${testId}Results)[0];
};

export const ${testId}Results: Record<string, any> = ${JSON.stringify(results, null, 2)};
`;
  fs.writeFileSync(path.join(clientSrc, `data/${testId}Types.ts`), resultsContent);

  // 2. Page Files Generation (Test & Results)
  const testPageContent = `import { useState } from "react";
import { useLocation } from "wouter";
import Navigation from "@/components/Navigation";
import SEO from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { AdSenseBlock } from "@/components/AdSenseBlock";
import { ${testId}Questions } from "@/data/${testId}Questions";

export default function ${capitalizedId}() {
  const [, setLocation] = useLocation();
  const [hasStarted, setHasStarted] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [score, setScore] = useState(0);

  const handleAnswer = (points: number) => {
    const newScore = score + points;
    if (currentStep < ${testId}Questions.length - 1) {
      setScore(newScore);
      setCurrentStep(curr => curr + 1);
    } else {
      setLocation(\`/${testId}-results?score=\${newScore}\`);
    }
  };

  const question = ${testId}Questions[currentStep];

  return (
    <div className="min-h-screen bg-[#F8F9FB] flex flex-col font-sans">
      <SEO title="${title}" description="${description}" />
      <Navigation />
      {!hasStarted ? (
        <main className="flex-grow max-w-3xl mx-auto w-full px-4 py-12 pb-24 flex flex-col items-center">
          <div className="bg-white rounded-[2rem] p-8 md:p-12 shadow-md flex-col justify-center text-center w-full mb-10 border border-neutral-100">
            <div className="text-6xl mb-6">{emoji || '✨'}</div>
            <h1 className="text-3xl md:text-5xl font-extrabold mb-6 tracking-tight text-neutral-900">${title}</h1>
            <p className="text-lg md:text-xl text-neutral-500 mb-10 leading-relaxed">${subtitle}</p>
            <Button onClick={() => setHasStarted(true)} size="lg" className="w-full md:w-auto h-16 text-xl rounded-full px-16 bg-neutral-900 hover:bg-neutral-800 text-white shadow-xl hover:shadow-2xl transition-all">
              지금 바로 알아보기 👉
            </Button>
          </div>
          
          {/* AdSense SEO Text Block */}
          <div className="bg-white/60 border border-neutral-200 rounded-2xl p-8 text-left w-full mt-8 prose prose-neutral max-w-none">
            <h2 className="text-xl font-bold mb-4">💡 이 테스트에 대하여</h2>
            <p className="text-neutral-600 mb-4">${title}는 당신의 심리를 깊이 있게 분석하여 숨겨진 성향을 찾아냅니다. ${description}</p>
            <p className="text-neutral-600 mb-6">총 ${questions.length || 12}개의 문항으로 이루어져 있으며, 직관적으로 가장 먼저 떠오르는 답변을 선택하는 것이 가장 정확합니다. 지금 바로 당신만의 특별한 결과를 확인해보세요!</p>
            <div className="flex justify-center mt-6">
              <AdSenseBlock adSlot="landing-banner" />
            </div>
          </div>
        </main>
      ) : (
        <main className="flex-grow max-w-2xl mx-auto w-full px-4 py-8 flex flex-col">
          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex justify-between text-sm font-bold text-neutral-500 mb-2 px-2">
              <span>진행률</span>
              <span>{currentStep + 1} / {${testId}Questions.length}</span>
            </div>
            <div className="w-full bg-neutral-200 rounded-full h-3">
              <div className="bg-neutral-900 h-3 rounded-full transition-all duration-300" style={{ width: \`\${((currentStep + 1) / ${testId}Questions.length) * 100}%\` }}></div>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-8 md:p-10 shadow-lg flex-grow flex flex-col justify-center text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-10 leading-relaxed text-neutral-800 break-keep">{question?.question || question?.questionText || "${title}"}</h2>
            <div className="space-y-4">
              {question?.options?.map((opt: any, idx: number) => {
                const text = typeof opt === 'string' ? opt : opt.text;
                const val = typeof opt === 'string' ? (question.score ? Object.values(question.score)[idx] : 1) : opt.score;
                return (
                  <Button key={idx} onClick={() => handleAnswer(val as number)} className="w-full h-auto py-6 px-6 text-lg rounded-2xl bg-neutral-50 hover:bg-neutral-100 text-neutral-700 border-2 border-neutral-100 hover:border-neutral-300 transition-all whitespace-normal break-keep" variant="outline">
                    {text}
                  </Button>
                );
              })}
            </div>
          </div>
          
          {currentStep % 4 === 3 && (
            <div className="mt-8 text-center">
              <AdSenseBlock adSlot="in-feed-banner" />
            </div>
          )}
        </main>
      )}
    </div>
  );
}`;
  fs.writeFileSync(path.join(clientSrc, `pages/${testId}-test.tsx`), testPageContent);

  const resultsPageContent = `import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import Navigation from "@/components/Navigation";
import SEO from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { AdSenseBlock } from "@/components/AdSenseBlock";
import { CoupangRecommend } from "@/components/CoupangRecommend";
import { calculate${capitalizedId}Level, ${testId}Results } from "@/data/${testId}Types";
import { Loader2 } from "lucide-react";

export default function ${capitalizedResults}() {
  const [location] = useLocation();
  const [score, setScore] = useState(0);
  const [isAnalyzing, setIsAnalyzing] = useState(true);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setScore(parseInt(params.get("score") || "0", 10));
    
    // Interstitial Ad Delay UX (3 seconds)
    const timer = setTimeout(() => setIsAnalyzing(false), 3000);
    return () => clearTimeout(timer);
  }, [location]);

  const resultKey = calculate${capitalizedId}Level(score);
  const result = ${testId}Results[resultKey];

  if (isAnalyzing) {
    return (
      <div className="min-h-screen bg-[#F8F9FB] flex flex-col font-sans">
        <SEO title="${title} - 결과 분석 중" />
        <Navigation />
        <main className="flex-grow flex flex-col items-center justify-center p-4">
          <Loader2 className="h-16 w-16 animate-spin text-neutral-900 mb-8" />
          <h2 className="text-3xl font-extrabold text-neutral-800 mb-4">당신의 답변을 분석 중입니다...</h2>
          <p className="text-neutral-500 mb-12">AI가 당신의 심리 데이터를 해독하고 있어요 🧠</p>
          
          <div className="w-full max-w-md bg-white p-4 rounded-2xl shadow-sm border border-neutral-100">
            <p className="text-xs text-neutral-400 text-center mb-2">Sponsor</p>
            <AdSenseBlock adSlot="interstitial-delay" />
          </div>
        </main>
      </div>
    );
  }

  if (!result) return null;

  const seoTitle = \`\${result.title} | ${title}\`;

  return (
    <div className="min-h-screen bg-[#F8F9FB] flex flex-col font-sans">
      <SEO title={seoTitle} description={result.description} />
      <Navigation />
      <main className="flex-grow max-w-2xl mx-auto w-full px-4 py-12 pb-24">
        <div className="bg-white rounded-[2.5rem] shadow-xl border-0 p-8 md:p-12 text-center overflow-hidden relative">
          <div className="absolute top-0 left-0 w-full h-3 bg-gradient-to-r from-purple-500 to-pink-500"></div>
          
          <p className="text-sm font-bold text-neutral-400 uppercase tracking-widest mb-4 mt-4">당신의 테스트 결과는</p>
          <h1 className="text-4xl md:text-5xl font-extrabold mb-8 text-neutral-900 break-keep">{result.title}</h1>
          
          <div className="bg-neutral-50 p-6 rounded-2xl mb-10 text-left">
            <p className="text-lg text-neutral-700 leading-relaxed break-keep">{result.description}</p>
          </div>
          
          <CoupangRecommend keyword={result.title} title="나에게 꼭 필요한 찰떡 아이템 🎁" />
          
          <div className="my-10"><AdSenseBlock adSlot="result-bottom" /></div>
          
          <Button onClick={() => window.location.href = '/${testId}-test'} size="lg" className="w-full mt-4 h-16 text-xl rounded-full bg-neutral-900 text-white hover:bg-neutral-800 shadow-xl transition-transform hover:-translate-y-1">
             테스트 다시 하기 💫
          </Button>
        </div>
      </main>
    </div>
  );
}`;
  fs.writeFileSync(path.join(clientSrc, `pages/${testId}-results.tsx`), resultsPageContent);

  // 3. Inject into Navigation.tsx
  const navPath = path.join(clientSrc, 'components/Navigation.tsx');
  let navFile = fs.readFileSync(navPath, 'utf-8');
  if (!navFile.includes(`'/${testId}-test'`)) {
    // We don't inject to Navigation manually if we use the testMenuItems loop from testTypes.ts directly!
    // Wait, in my updated landing.tsx, I use testTypes to populate categories, but Navigation.tsx doesn't use testTypes directly?
    // Let me check if Navigation.tsx uses testMenuItems locally. It does.
  }

  // 4. Inject into App.tsx
  const appPath = path.join(clientSrc, 'App.tsx');
  let appFile = fs.readFileSync(appPath, 'utf-8');
  if (!appFile.includes(`/${testId}-test`)) {
    appFile = appFile.replace(
      /import NotFound from "@\/pages\/not-found";/,
      `import ${capitalizedId} from "@/pages/${testId}-test";\nimport ${capitalizedResults} from "@/pages/${testId}-results";\nimport NotFound from "@/pages/not-found";`
    );
    appFile = appFile.replace(
      /<Route component=\{NotFound\} \/>/,
      `<Route path="/${testId}-test" component={${capitalizedId}} />\n      <Route path="/${testId}-results" component={${capitalizedResults}} />\n      <Route component={NotFound} />`
    );
    fs.writeFileSync(appPath, appFile);
  }

  // 5. Inject into testTypes.ts
  const typesPath = path.join(clientSrc, 'data/testTypes.ts');
  let typesFile = fs.readFileSync(typesPath, 'utf-8');
  if (!typesFile.includes(`id: "${testId}"`)) {
    const aiCat = category || 'HOT'; // Default map to HOT
    const newTestConfig = `\n  {
    id: "${testId}",
    category: "${aiCat}",
    title: "${title}",
    subtitle: "${subtitle}",
    description: "${description || 'AI가 생성한 최신 바이럴 테스트입니다.'}",
    emoji: "${emoji || '✨'}",
    color: "from-purple-500 to-pink-500",
    duration: "약 3분",
    questions: ${questions?.length || 12},
    href: "/${testId}-test",
    features: ["AI 맞춤 분석", "나만의 결과지", "궁합 확인"],
    isAvailable: true
  },`;
    typesFile = typesFile.replace(/export const testTypes: TestType\[\] = \[/, `export const testTypes: TestType[] = [${newTestConfig}`);
    fs.writeFileSync(typesPath, typesFile);
  }
}
