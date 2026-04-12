import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const clientSrc = path.resolve(__dirname, '../../client/src');

export async function injectCode(aiData) {
  const { testId, title, subtitle, description, emoji, questions, results, category } = aiData;
  const capitalizedId = testId.charAt(0).toUpperCase() + testId.slice(1) + 'Test';
  const capitalizedResults = testId.charAt(0).toUpperCase() + testId.slice(1) + 'Results';
  const emojiChar = emoji || '\u2728';
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
    '  // 12 questions \u00d7 score 1~4 = range 12~48, evenly split',
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
  const testPage = `import { useState } from "react";
import { useLocation } from "wouter";
import Navigation from "@/components/Navigation";
import SEO from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { ${testId}Questions } from "@/data/${testId}Questions";

export default function ${capitalizedId}() {
  const [, setLocation] = useLocation();
  const [hasStarted, setHasStarted] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [scoreHistory, setScoreHistory] = useState<number[]>([]);

  const handleAnswer = (points: number) => {
    const newHistory = [...scoreHistory.slice(0, currentStep), points];
    setScoreHistory(newHistory);
    if (currentStep < ${testId}Questions.length - 1) {
      setCurrentStep(curr => curr + 1);
    } else {
      const totalScore = newHistory.reduce((a, b) => a + b, 0);
      setLocation("/${testId}-results?score=" + totalScore);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(curr => curr - 1);
    }
  };

  const question = ${testId}Questions[currentStep];
  const progress = Math.round(((currentStep + 1) / ${testId}Questions.length) * 100);

  return (
    <div className="min-h-screen bg-[#F8F9FB] flex flex-col font-sans">
      <SEO title="${title}" description="${descText.replace(/"/g, '\\"')}" url="https://mbtifinder.com/${testId}-test" keywords="${(category || '\uc2ec\ub9ac\ud14c\uc2a4\ud2b8') + ', ' + title.replace(/ /g, ', ')}" />
      <Navigation />
      {!hasStarted ? (
        <main className="flex-grow max-w-3xl mx-auto w-full px-4 py-12 pb-24 flex flex-col items-center">
          <div className="bg-white rounded-[2rem] p-8 md:p-12 shadow-md flex-col justify-center text-center w-full mb-10 border border-neutral-100">
            <div className="text-6xl mb-6">${emojiChar}</div>
            <h1 className="text-3xl md:text-5xl font-extrabold mb-6 tracking-tight text-neutral-900">${title}</h1>
            <p className="text-lg md:text-xl text-neutral-500 mb-10 leading-relaxed">${subtitle || ''}</p>
            <Button onClick={() => setHasStarted(true)} size="lg" className="w-full md:w-auto h-16 text-xl rounded-full px-16 bg-neutral-900 hover:bg-neutral-800 text-white shadow-xl hover:shadow-2xl transition-all">
              \uc9c0\uae08 \ubc14\ub85c \uc54c\uc544\ubcf4\uae30 \ud83d\udc49
            </Button>
          </div>
          <div className="bg-white/60 border border-neutral-200 rounded-2xl p-8 text-left w-full mt-8 prose prose-neutral max-w-none">
            <h2 className="text-xl font-bold mb-4">\ud83d\udca1 \uc774 \ud14c\uc2a4\ud2b8\uc5d0 \ub300\ud558\uc5ec</h2>
            <p className="text-neutral-600 mb-4">${title}\ub294 \ub2f9\uc2e0\uc758 \uc2ec\ub9ac\ub97c \uae4a\uc774 \uc788\uac8c \ubd84\uc11d\ud569\ub2c8\ub2e4. ${descText}</p>
            <p className="text-neutral-600 mb-6">\ucd1d ${qLen}\uac1c\uc758 \ubb38\ud56d\uc73c\ub85c \uc774\ub8e8\uc5b4\uc838 \uc788\uc73c\uba70, \uc9c1\uad00\uc801\uc73c\ub85c \uac00\uc7a5 \uba3c\uc800 \ub5a0\uc624\ub974\ub294 \ub2f5\ubcc0\uc744 \uc120\ud0dd\ud558\ub294 \uac83\uc774 \uac00\uc7a5 \uc815\ud655\ud569\ub2c8\ub2e4.</p>
          </div>
        </main>
      ) : (
        <main className="flex-grow max-w-2xl mx-auto w-full px-4 py-8 flex flex-col">
          <div className="mb-8">
            <div className="flex justify-between text-sm font-bold text-neutral-500 mb-2 px-2">
              <span>\uc9c4\ud589\ub960</span>
              <span>{currentStep + 1} / {${testId}Questions.length}</span>
            </div>
            <div className="w-full bg-neutral-200 rounded-full h-3">
              <div className="bg-neutral-900 h-3 rounded-full transition-all duration-300" style={{ width: progress + "%" }}></div>
            </div>
          </div>
          <div className="bg-white rounded-3xl p-8 md:p-10 shadow-lg flex-grow flex flex-col justify-center text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-10 leading-relaxed text-neutral-800 break-keep">{question?.question || question?.questionText || "${title}"}</h2>
            <div className="space-y-4">
              {question?.options?.map((opt: any, idx: number) => {
                const text = typeof opt === "string" ? opt : opt.text;
                const val = typeof opt === "string" ? 1 : (opt.score ?? 1);
                return (
                  <Button key={idx} onClick={() => handleAnswer(val as number)} className="w-full h-auto py-6 px-6 text-lg rounded-2xl bg-neutral-50 hover:bg-neutral-100 text-neutral-700 border-2 border-neutral-100 hover:border-neutral-300 transition-all whitespace-normal break-keep" variant="outline">
                    {text}
                  </Button>
                );
              })}
            </div>
            {currentStep > 0 && (
              <div className="mt-8 pt-6 border-t border-neutral-100 flex justify-center">
                <Button onClick={handlePrevious} variant="ghost" className="text-neutral-400 hover:text-neutral-800 hover:bg-neutral-100 rounded-xl transition-all">
                  <ArrowLeft size={16} className="mr-2" /> \uc774\uc804\uc73c\ub85c
                </Button>
              </div>
            )}
          </div>
        </main>
      )}
    </div>
  );
}`;
  fs.writeFileSync(path.join(clientSrc, 'pages/' + testId + '-test.tsx'), testPage);

  // 3. Results Page
  const resultsPage = `import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import Navigation from "@/components/Navigation";
import SEO from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { CoupangRecommend } from "@/components/CoupangRecommend";
import { ShareButtons } from "@/components/ShareButtons";
import { AdSenseBlock } from "@/components/AdSenseBlock";
import { calculate${capitalizedId}Level, ${testId}Results } from "@/data/${testId}Types";
import { Loader2, RotateCcw, Zap } from "lucide-react";

export default function ${capitalizedResults}() {
  const [location] = useLocation();
  const [score, setScore] = useState(0);
  const [isAnalyzing, setIsAnalyzing] = useState(true);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setScore(parseInt(params.get("score") || "0", 10));
    const timer = setTimeout(() => setIsAnalyzing(false), 3000);
    return () => clearTimeout(timer);
  }, [location]);

  const resultKey = calculate${capitalizedId}Level(score);
  const allKeys = Object.keys(${testId}Results);
  const result = ${testId}Results[resultKey] || ${testId}Results[allKeys[0]] || { title: "\ubd84\uc11d \uc644\ub8cc", description: "\ub2f9\uc2e0\ub9cc\uc758 \ud2b9\ubcc4\ud55c \uacb0\uacfc\uc785\ub2c8\ub2e4!" };

  if (isAnalyzing) {
    return (
      <div className="min-h-screen bg-pink-50/30 flex flex-col font-sans">
        <SEO title="${title} - \uacb0\uacfc \ubd84\uc11d \uc911" />
        <Navigation />
        <main className="flex-grow flex flex-col items-center justify-center p-4">
          <Loader2 className="h-16 w-16 animate-spin text-pink-400 mb-8" />
          <h2 className="text-3xl font-extrabold text-neutral-800 mb-4">\ub2f9\uc2e0\uc758 \ub2f5\ubcc0\uc744 \ubd84\uc11d \uc911\uc785\ub2c8\ub2e4...</h2>
          <p className="text-neutral-500 mb-12">AI\uac00 \ub2f9\uc2e0\uc758 \uc2ec\ub9ac \ub370\uc774\ud130\ub97c \ud574\ub3c5\ud558\uace0 \uc788\uc5b4\uc694 \ud83e\udde0</p>
        </main>
      </div>
    );
  }

  if (!result) return null;

  return (
    <div className="min-h-screen bg-pink-50/30">
      <SEO title={(result.title || "\uacb0\uacfc") + " | ${title}"} description={result.description} url={\`https://mbtifinder.com/${testId}-results?score=\${score}\`} />
      <Navigation />

      {/* Results Header */}
      <div className="bg-gradient-to-br from-pink-300 via-purple-300 to-indigo-300 text-white py-20 relative overflow-hidden">
        <div className="max-w-3xl mx-auto px-6 text-center relative z-10">
          <h1 className="text-xl md:text-2xl font-semibold mb-4 tracking-wider opacity-90 drop-shadow-md">${title} \uacb0\uacfc \ud83d\udcab</h1>
          <p className="text-lg opacity-80">\ub2f9\uc2e0\uc758 \uc9c4\uc9dc \uc720\ud615\uc740...</p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 py-12">
        {/* Main Result Card */}
        <div className="bg-white/80 backdrop-blur-xl border border-white/60 rounded-[2.5rem] shadow-[0_8px_32px_rgba(236,72,153,0.1)] p-8 md:p-12 -mt-24 relative z-20 overflow-hidden">
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-28 h-28 bg-white rounded-full text-5xl mb-6 shadow-xl border-4 border-pink-100">
              {result.emoji || "\u2728"}
            </div>
            {result.subtitle && <p className="text-xl text-pink-500 font-bold tracking-wide mb-2">{result.subtitle}</p>}
            <h2 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-neutral-800 to-neutral-600 mb-6 tracking-tight pb-2">{result.title}</h2>
            <div className="bg-neutral-50/80 rounded-2xl p-6 text-left border border-neutral-100 shadow-sm mb-8">
              <p className="text-[1.05rem] text-neutral-700 leading-relaxed font-medium">{result.description}</p>
            </div>
          </div>

          {/* AdSense */}
          <AdSenseBlock adSlot="8811223344" />

          {/* Characteristics */}
          {result.characteristics && result.characteristics.length > 0 && (
            <div className="mb-10 mt-6">
              <h3 className="text-xl font-bold text-neutral-800 mb-5 flex items-center justify-center">
                <Zap className="mr-2 text-yellow-400 fill-yellow-400" size={24} />
                \uc21c\uc0b4 \uc870\uc2ec! \ubf08\ub54c\ub9ac\ub294 \ud329\ud2b8 \ubaa8\uc74c
              </h3>
              <div className="grid md:grid-cols-2 gap-3">
                {result.characteristics.map((trait: string, index: number) => (
                  <div key={index} className="flex items-start p-4 bg-pink-50/50 rounded-2xl border border-pink-100/50 hover:bg-pink-100/50 transition-colors">
                    <span className="text-pink-400 mr-2 flex-shrink-0 mt-0.5">\ud83d\udca5</span>
                    <span className="text-[0.95rem] text-neutral-700 font-medium leading-snug">{trait}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Coupang */}
          <div className="mt-12 mb-8">
            <CoupangRecommend keyword={result.coupangKeyword || result.title} title={\`\ud83c\udf80 \${result.title}\ub97c \uc704\ud55c \ucc30\ub5a1 \ucd94\ucc9c\ud15c\`} />
          </div>

          {/* AdSense */}
          <AdSenseBlock adSlot="9922334455" />

          {/* Share */}
          <div className="text-center space-y-5 mt-10">
            <ShareButtons title="${title} \uacb0\uacfc" shareText={\`\ub098\uc758 \uac80\uc0ac \uacb0\uacfc\ub294 '\${result.title}'! \ub108\ub3c4 \ud574\ubd10 \ud83d\udc49\`} url="https://mbtifinder.com/${testId}-test" />
          </div>

          <div className="mt-8 flex justify-center pb-4">
            <Button onClick={() => { window.location.href = "/${testId}-test"; }} className="bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-400 text-white px-10 py-6 rounded-2xl text-[1.1rem] font-bold hover:shadow-lg transition-transform hover:-translate-y-1 border-2 border-white/50 w-full">
              <RotateCcw size={20} className="mr-2" /> \ud14c\uc2a4\ud2b8 \ub2e4\uc2dc\ud558\uae30
            </Button>
          </div>
        </div>

        {/* All Types Overview */}
        <div className="mt-12 mb-6 text-center">
          <h3 className="text-2xl font-bold text-neutral-800">\ubaa8\ub4e0 \uc720\ud615 \ubaa8\uc544\ubcf4\uae30</h3>
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          {allKeys.map((key) => {
            const type = ${testId}Results[key];
            return (
              <div key={key} className={\`p-6 rounded-[1.5rem] bg-white border-2 transition-all duration-300 shadow-sm hover:shadow-md cursor-default \${key === resultKey ? "border-pink-400 shadow-pink-100" : "border-white hover:border-pink-200"}\`}>
                <div className="flex items-center space-x-4 mb-3">
                  <div className="text-4xl bg-neutral-50 p-2 rounded-2xl">{type.emoji || "\u2728"}</div>
                  <div>
                    {type.subtitle && <div className="text-sm font-bold text-neutral-500 mb-0.5">{type.subtitle}</div>}
                    <div className="font-extrabold text-xl text-pink-500">{type.title}</div>
                  </div>
                </div>
                <p className="text-[0.9rem] text-neutral-600 font-medium leading-relaxed line-clamp-2">{type.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}`;
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
      '    duration: "\uc57d 3\ubd84",\n' +
      '    questions: ' + qLen + ',\n' +
      '    href: "/' + testId + '-test",\n' +
      '    features: ["AI \ub9de\ucda4 \ubd84\uc11d", "\ub098\ub9cc\uc758 \uacb0\uacfc\uc9c0", "\uad81\ud569 \ud655\uc778"],\n' +
      '    isAvailable: true\n' +
      '  },';
    typesFile = typesFile.replace(/export const testTypes: TestType\[\] = \[/, 'export const testTypes: TestType[] = [' + newTestConfig);
    fs.writeFileSync(typesPath, typesFile);
  }

  // 6. Inject into sitemap.xml
  const sitemapPath = path.join(clientSrc, '../public/sitemap.xml');
  if (fs.existsSync(sitemapPath)) {
    let sitemapFile = fs.readFileSync(sitemapPath, 'utf-8');
    if (!sitemapFile.includes('/' + testId + '-test</loc>')) {
      const newSitemapEntry = `  <url>\n    <loc>https://mbtifinder.com/${testId}-test</loc>\n    <changefreq>weekly</changefreq>\n    <priority>0.8</priority>\n  </url>\n</urlset>`;
      sitemapFile = sitemapFile.replace('</urlset>', newSitemapEntry);
      fs.writeFileSync(sitemapPath, sitemapFile);
    }
  }
}
