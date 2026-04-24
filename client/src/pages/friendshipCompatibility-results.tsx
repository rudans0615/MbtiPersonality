import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import Navigation from "@/components/Navigation";
import SEO from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { CoupangRecommend } from "@/components/CoupangRecommend";
import { ShareButtons } from "@/components/ShareButtons";
import { AdSenseBlock } from "@/components/AdSenseBlock";
import RelatedTests from "@/components/RelatedTests";
import { ResultImageCard } from "@/components/ResultImageCard";
import { calculateFriendshipCompatibilityTestLevel, friendshipCompatibilityResults } from "@/data/friendshipCompatibilityTypes";
import { friendshipCompatibilityQuestions } from "@/data/friendshipCompatibilityQuestions";
import { testTypes } from "@/data/testTypes";
import { Loader2, RotateCcw, Zap, Sparkles } from "lucide-react";

export default function FriendshipCompatibilityResults() {
  const [location] = useLocation();
  const [score, setScore] = useState(0);
  const [isAnalyzing, setIsAnalyzing] = useState(true);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setScore(parseInt(params.get("score") || "0", 10));
    const timer = setTimeout(() => {
      setIsAnalyzing(false);
      if (typeof window !== "undefined" && (window as any).gtag) {
        (window as any).gtag('event', 'test_completed', {
          test_id: "friendshipCompatibility",
          options_count: friendshipCompatibilityQuestions[0]?.options?.length || 2,
          questions_count: friendshipCompatibilityQuestions.length
        });
      }
    }, 3000);
    return () => clearTimeout(timer);
  }, [location]);

  const resultKey = calculateFriendshipCompatibilityTestLevel(score);
  const allKeys = Object.keys(friendshipCompatibilityResults);
  const result = friendshipCompatibilityResults[resultKey] || friendshipCompatibilityResults[allKeys[0]] || { title: "분석 완료", description: "당신만의 특별한 결과입니다!" };

  if (isAnalyzing) {
    return (
      <div className="min-h-screen bg-pink-50/30 flex flex-col font-sans">
        <SEO title="너와 나의 우정, 얼마나 잘 맞을까? - 결과 분석 중" />
        <Navigation />
        <main className="flex-grow flex flex-col items-center justify-center p-4">
          <Loader2 className="h-16 w-16 animate-spin text-pink-400 mb-8" />
          <h2 className="text-3xl font-extrabold text-neutral-800 mb-4">당신의 답변을 분석 중입니다...</h2>
          <p className="text-neutral-500 mb-12">AI가 당신의 심리 데이터를 해독하고 있어요 🧠</p>
          <div className="w-full max-w-md">
            <AdSenseBlock adSlot="3344556677" />
          </div>
        </main>
      </div>
    );
  }

  if (!result) return null;

  return (
    <div className="min-h-screen bg-pink-50/30">
      <SEO title={(result.title || "결과") + " | 너와 나의 우정, 얼마나 잘 맞을까?"} description={result.description} url={`https://mbtifinder.com/friendshipCompatibility-results?score=${score}`} />
      <Navigation />

      <div className="bg-gradient-to-br from-pink-300 via-purple-300 to-indigo-300 text-white py-20 relative overflow-hidden">
        <div className="max-w-3xl mx-auto px-6 text-center relative z-10">
          <h1 className="text-xl md:text-2xl font-semibold mb-4 tracking-wider opacity-90 drop-shadow-md">너와 나의 우정, 얼마나 잘 맞을까? 결과 💫</h1>
          <p className="text-lg opacity-80">당신의 진짜 유형은...</p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 py-12">
        <div className="bg-white/80 backdrop-blur-xl border border-white/60 rounded-[2.5rem] shadow-[0_8px_32px_rgba(236,72,153,0.1)] p-8 md:p-12 -mt-24 relative z-20 overflow-hidden">
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-28 h-28 bg-white rounded-full text-5xl mb-6 shadow-xl border-4 border-pink-100">
              {result.emoji || "✨"}
            </div>
            {result.subtitle && <p className="text-xl text-pink-500 font-bold tracking-wide mb-2">{result.subtitle}</p>}
            <h2 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-neutral-800 to-neutral-600 mb-6 tracking-tight pb-2">{result.title}</h2>
            <div className="bg-neutral-50/80 rounded-2xl p-6 text-left border border-neutral-100 shadow-sm mb-8">
              <p className="text-[1.05rem] text-neutral-700 leading-relaxed font-medium">{result.description}</p>
            </div>
          </div>

          {/* Result Image Card - saveable for Instagram Stories */}
          <ResultImageCard
            testTitle="너와 나의 우정, 얼마나 잘 맞을까?"
            resultTitle={result.title}
            resultEmoji={result.emoji || "✨"}
            resultSubtitle={result.subtitle}
            characteristics={result.characteristics}
          />

          <AdSenseBlock adSlot="8811223344" />

          {result.characteristics && result.characteristics.length > 0 && (
            <div className="mb-10 mt-6">
              <h3 className="text-xl font-bold text-neutral-800 mb-5 flex items-center justify-center">
                <Zap className="mr-2 text-yellow-400 fill-yellow-400" size={24} />
                순살 조심! 뼈때리는 팩트 모음
              </h3>
              <div className="grid md:grid-cols-2 gap-3">
                {result.characteristics.map((trait: string, index: number) => (
                  <div key={index} className="flex items-start p-4 bg-pink-50/50 rounded-2xl border border-pink-100/50 hover:bg-pink-100/50 transition-colors">
                    <span className="text-pink-400 mr-2 flex-shrink-0 mt-0.5">💥</span>
                    <span className="text-[0.95rem] text-neutral-700 font-medium leading-snug">{trait}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="mt-12 mb-8">
            <CoupangRecommend keyword={result.coupangKeyword || result.title} title={`🎀 ${result.title}를 위한 찰떡 추천템`} />
          </div>

          <AdSenseBlock adSlot="9922334455" />

          <div className="text-center space-y-5 mt-10">
            <ShareButtons title="너와 나의 우정, 얼마나 잘 맞을까? 결과" shareText={`나의 검사 결과는 '${result.title}'! 너도 해봐 👉`} url="https://mbtifinder.com/friendshipCompatibility-test" />
          </div>

          <div className="mt-8 flex justify-center pb-4">
            <Button onClick={() => { window.location.href = "/friendshipCompatibility-test"; }} className="bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-400 text-white px-10 py-6 rounded-2xl text-[1.1rem] font-bold hover:shadow-lg transition-transform hover:-translate-y-1 border-2 border-white/50 w-full">
              <RotateCcw size={20} className="mr-2" /> 테스트 다시하기
            </Button>
          </div>
        </div>

        {/* All Types Overview */}
        <div className="mt-12 mb-6 text-center">
          <h3 className="text-2xl font-bold text-neutral-800">모든 유형 모아보기</h3>
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          {allKeys.map((key) => {
            const type = friendshipCompatibilityResults[key];
            return (
              <div key={key} className={`p-6 rounded-[1.5rem] bg-white border-2 transition-all duration-300 shadow-sm hover:shadow-md cursor-default ${key === resultKey ? "border-pink-400 shadow-pink-100" : "border-white hover:border-pink-200"}`}>
                <div className="flex items-center space-x-4 mb-3">
                  <div className="text-4xl bg-neutral-50 p-2 rounded-2xl">{type.emoji || "✨"}</div>
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

        <RelatedTests currentTestId="friendshipCompatibility" />

        <AdSenseBlock adSlot="1133557799" />
      </div>
    </div>
  );
}