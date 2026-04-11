import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const clientSrc = path.resolve(__dirname, '../../client/src');

export async function injectCode(aiData) {
  const { testId, title, subtitle, description, emoji, questions, results, category } = aiData;
  const capitalizedId = testId.charAt(0).toUpperCase() + testId.slice(1) + 'Test';
  const capitalizedResults = testId.charAt(0).toUpperCase() + testId.slice(1) + 'Results';
  const emojiChar = emoji || '✨';
  const descText = description || 'AI가 생성한 최신 바이럴 테스트입니다.';
  const qLen = questions?.length || 12;
  
  // 1. Data Files Generation
  const questionsContent = 'export const ' + testId + 'Questions = ' + JSON.stringify(questions, null, 2) + ';';
  fs.writeFileSync(path.join(clientSrc, 'data/' + testId + 'Questions.ts'), questionsContent);

  const resultsContent = [
    'export const calculate' + capitalizedId + 'Level = (score: number) => {',
    '  const keys = Object.keys(' + testId + 'Results);',
    '  const numKeys = keys.length;',
    '  if (numKeys === 0) return "";',
    '  // 12 questions × score 1~4 = range 12~48, evenly split',
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
  fs.writeFileSync(path.join(clientSrc, 'data/' + testId + 'Types.ts'), resultsContent);

  // 2. Test Page
  const testPage = [
    'import { useState } from "react";',
    'import { useLocation } from "wouter";',
    'import Navigation from "@/components/Navigation";',
    'import SEO from "@/components/SEO";',
    'import { Button } from "@/components/ui/button";',
    'import { ' + testId + 'Questions } from "@/data/' + testId + 'Questions";',
    '',
    'export default function ' + capitalizedId + '() {',
    '  const [, setLocation] = useLocation();',
    '  const [hasStarted, setHasStarted] = useState(false);',
    '  const [currentStep, setCurrentStep] = useState(0);',
    '  const [scoreHistory, setScoreHistory] = useState<number[]>([]);',
    '',
    '  const handleAnswer = (points: number) => {',
    '    const newHistory = [...scoreHistory.slice(0, currentStep), points];',
    '    setScoreHistory(newHistory);',
    '    if (currentStep < ' + testId + 'Questions.length - 1) {',
    '      setCurrentStep(curr => curr + 1);',
    '    } else {',
    '      const totalScore = newHistory.reduce((a, b) => a + b, 0);',
    '      setLocation("/' + testId + '-results?score=" + totalScore);',
    '    }',
    '  };',
    '',
    '  const handlePrevious = () => {',
    '    if (currentStep > 0) {',
    '      setCurrentStep(curr => curr - 1);',
    '    }',
    '  };',
    '',
    '  const question = ' + testId + 'Questions[currentStep];',
    '  const progress = Math.round(((currentStep + 1) / ' + testId + 'Questions.length) * 100);',
    '',
    '  return (',
    '    <div className="min-h-screen bg-[#F8F9FB] flex flex-col font-sans">',
    '      <SEO title="' + title + '" description="' + descText.replace(/"/g, '\\"') + '" url="https://mbtifinder.com/' + testId + '-test" />',
    '      <Navigation />',
    '      {!hasStarted ? (',
    '        <main className="flex-grow max-w-3xl mx-auto w-full px-4 py-12 pb-24 flex flex-col items-center">',
    '          <div className="bg-white rounded-[2rem] p-8 md:p-12 shadow-md flex-col justify-center text-center w-full mb-10 border border-neutral-100">',
    '            <div className="text-6xl mb-6">' + emojiChar + '</div>',
    '            <h1 className="text-3xl md:text-5xl font-extrabold mb-6 tracking-tight text-neutral-900">' + title + '</h1>',
    '            <p className="text-lg md:text-xl text-neutral-500 mb-10 leading-relaxed">' + (subtitle || '') + '</p>',
    '            <Button onClick={() => setHasStarted(true)} size="lg" className="w-full md:w-auto h-16 text-xl rounded-full px-16 bg-neutral-900 hover:bg-neutral-800 text-white shadow-xl hover:shadow-2xl transition-all">',
    '              지금 바로 알아보기 👉',
    '            </Button>',
    '          </div>',
    '          <div className="bg-white/60 border border-neutral-200 rounded-2xl p-8 text-left w-full mt-8 prose prose-neutral max-w-none">',
    '            <h2 className="text-xl font-bold mb-4">💡 이 테스트에 대하여</h2>',
    '            <p className="text-neutral-600 mb-4">' + title + '는 당신의 심리를 깊이 있게 분석합니다. ' + descText + '</p>',
    '            <p className="text-neutral-600 mb-6">총 ' + qLen + '개의 문항으로 이루어져 있으며, 직관적으로 가장 먼저 떠오르는 답변을 선택하는 것이 가장 정확합니다.</p>',
    '          </div>',
    '        </main>',
    '      ) : (',
    '        <main className="flex-grow max-w-2xl mx-auto w-full px-4 py-8 flex flex-col">',
    '          <div className="mb-8">',
    '            <div className="flex justify-between text-sm font-bold text-neutral-500 mb-2 px-2">',
    '              <span>진행률</span>',
    '              <span>{currentStep + 1} / {' + testId + 'Questions.length}</span>',
    '            </div>',
    '            <div className="w-full bg-neutral-200 rounded-full h-3">',
    '              <div className="bg-neutral-900 h-3 rounded-full transition-all duration-300" style={{ width: progress + "%" }}></div>',
    '            </div>',
    '          </div>',
    '          <div className="bg-white rounded-3xl p-8 md:p-10 shadow-lg flex-grow flex flex-col justify-center text-center">',
    '            <h2 className="text-2xl md:text-3xl font-bold mb-10 leading-relaxed text-neutral-800 break-keep">{question?.question || question?.questionText || "' + title + '"}</h2>',
    '            <div className="space-y-4">',
    '              {question?.options?.map((opt: any, idx: number) => {',
    '                const text = typeof opt === "string" ? opt : opt.text;',
    '                const val = typeof opt === "string" ? 1 : (opt.score ?? 1);',
    '                return (',
    '                  <Button key={idx} onClick={() => handleAnswer(val as number)} className="w-full h-auto py-6 px-6 text-lg rounded-2xl bg-neutral-50 hover:bg-neutral-100 text-neutral-700 border-2 border-neutral-100 hover:border-neutral-300 transition-all whitespace-normal break-keep" variant="outline">',
    '                    {text}',
    '                  </Button>',
    '                );',
    '              })}',
    '            </div>',
    '            {currentStep > 0 && (',
    '              <div className="mt-8 pt-6 border-t border-neutral-100 flex justify-center">',
    '                <Button onClick={handlePrevious} variant="ghost" className="text-neutral-400 hover:text-neutral-800 transition-all">',
    '                  <i className="fas fa-arrow-left mr-2"></i> 이전 문항으로',
    '                </Button>',
    '              </div>',
    '            )}',
    '          </div>',
    '        </main>',
    '      )}',
    '    </div>',
    '  );',
    '}'
  ].join('\n');
  fs.writeFileSync(path.join(clientSrc, 'pages/' + testId + '-test.tsx'), testPage);

  // 3. Results Page
  const resultsPage = [
    'import { useState, useEffect } from "react";',
    'import { useLocation } from "wouter";',
    'import Navigation from "@/components/Navigation";',
    'import SEO from "@/components/SEO";',
    'import { Button } from "@/components/ui/button";',
    'import { CoupangRecommend } from "@/components/CoupangRecommend";',
    'import { calculate' + capitalizedId + 'Level, ' + testId + 'Results } from "@/data/' + testId + 'Types";',
    'import { Loader2 } from "lucide-react";',
    '',
    'export default function ' + capitalizedResults + '() {',
    '  const [location] = useLocation();',
    '  const [score, setScore] = useState(0);',
    '  const [isAnalyzing, setIsAnalyzing] = useState(true);',
    '',
    '  useEffect(() => {',
    '    const params = new URLSearchParams(window.location.search);',
    '    setScore(parseInt(params.get("score") || "0", 10));',
    '    const timer = setTimeout(() => setIsAnalyzing(false), 3000);',
    '    return () => clearTimeout(timer);',
    '  }, [location]);',
    '',
    '  const resultKey = calculate' + capitalizedId + 'Level(score);',
    '  const allKeys = Object.keys(' + testId + 'Results);',
    '  const result = ' + testId + 'Results[resultKey] || ' + testId + 'Results[allKeys[0]] || { title: "분석 완료", description: "당신만의 특별한 결과입니다!" };',
    '',
    '  if (isAnalyzing) {',
    '    return (',
    '      <div className="min-h-screen bg-[#F8F9FB] flex flex-col font-sans">',
    '        <SEO title="' + title + ' - 결과 분석 중" />',
    '        <Navigation />',
    '        <main className="flex-grow flex flex-col items-center justify-center p-4">',
    '          <Loader2 className="h-16 w-16 animate-spin text-neutral-900 mb-8" />',
    '          <h2 className="text-3xl font-extrabold text-neutral-800 mb-4">당신의 답변을 분석 중입니다...</h2>',
    '          <p className="text-neutral-500 mb-12">AI가 당신의 심리 데이터를 해독하고 있어요 🧠</p>',
    '        </main>',
    '      </div>',
    '    );',
    '  }',
    '',
    '  if (!result) return null;',
    '',
    '  return (',
    '    <div className="min-h-screen bg-[#F8F9FB] flex flex-col font-sans">',
    '      <SEO title={(result.title || "결과") + " | ' + title + '"} description={result.description} />',
    '      <Navigation />',
    '      <main className="flex-grow max-w-2xl mx-auto w-full px-4 py-12 pb-24">',
    '        <div className="bg-white rounded-[2.5rem] shadow-xl border-0 p-8 md:p-12 text-center overflow-hidden relative">',
    '          <div className="absolute top-0 left-0 w-full h-3 bg-gradient-to-r from-purple-500 to-pink-500"></div>',
    '          <p className="text-sm font-bold text-neutral-400 uppercase tracking-widest mb-4 mt-4">당신의 테스트 결과는</p>',
    '          <h1 className="text-4xl md:text-5xl font-extrabold mb-8 text-neutral-900 break-keep">{result.title}</h1>',
    '          <div className="bg-neutral-50 p-6 rounded-2xl mb-10 text-left">',
    '            <p className="text-lg text-neutral-700 leading-relaxed break-keep">{result.description}</p>',
    '          </div>',
    '          <CoupangRecommend keyword={result.title} title="나에게 꼭 필요한 찰떡 아이템 🎁" />',
    '          <Button onClick={() => { window.location.href = "/' + testId + '-test"; }} size="lg" className="w-full mt-10 h-16 text-xl rounded-full bg-neutral-900 text-white hover:bg-neutral-800 shadow-xl transition-transform hover:-translate-y-1">',
    '            테스트 다시 하기 💫',
    '          </Button>',
    '        </div>',
    '      </main>',
    '    </div>',
    '  );',
    '}'
  ].join('\n');
  fs.writeFileSync(path.join(clientSrc, 'pages/' + testId + '-results.tsx'), resultsPage);

  // 4. Inject into App.tsx
  const appPath = path.join(clientSrc, 'App.tsx');
  let appFile = fs.readFileSync(appPath, 'utf-8');
  if (!appFile.includes('/' + testId + '-test')) {
    appFile = appFile.replace(
      /import NotFound from "@\/pages\/not-found";/,
      'import ' + capitalizedId + ' from "@/pages/' + testId + '-test";\nimport ' + capitalizedResults + ' from "@/pages/' + testId + '-results";\nimport NotFound from "@/pages/not-found";'
    );
    appFile = appFile.replace(
      /<Route component=\{NotFound\} \/>/,
      '<Route path="/' + testId + '-test" component={' + capitalizedId + '} />\n      <Route path="/' + testId + '-results" component={' + capitalizedResults + '} />\n      <Route component={NotFound} />'
    );
    fs.writeFileSync(appPath, appFile);
  }

  // 5. Inject into testTypes.ts
  const typesPath = path.join(clientSrc, 'data/testTypes.ts');
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
      '    href: "/' + testId + '-test",\n' +
      '    features: ["AI 맞춤 분석", "나만의 결과지", "궁합 확인"],\n' +
      '    isAvailable: true\n' +
      '  },';
    typesFile = typesFile.replace(/export const testTypes: TestType\[\] = \[/, 'export const testTypes: TestType[] = [' + newTestConfig);
    fs.writeFileSync(typesPath, typesFile);
  }
}
