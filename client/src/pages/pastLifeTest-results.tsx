import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import Navigation from "@/components/Navigation";
import SEO from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { AdSenseBlock } from "@/components/AdSenseBlock";
import { CoupangRecommend } from "@/components/CoupangRecommend";
import { calculatePastLifeTestTestLevel, pastLifeTestResults } from "@/data/pastLifeTestTypes";
import { Loader2 } from "lucide-react";

export default function PastLifeTestResults() {
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

  const resultKey = calculatePastLifeTestTestLevel(score);
  const result = pastLifeTestResults[resultKey];

  if (isAnalyzing) {
    return (
      <div className="min-h-screen bg-[#F8F9FB] flex flex-col font-sans">
        <SEO title="당신의 전생은 어떤 모습이었을까요? - 결과 분석 중" />
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

  const seoTitle = `${result.title} | 당신의 전생은 어떤 모습이었을까요?`;

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
          
          <Button onClick={() => window.location.href = '/pastLifeTest-test'} size="lg" className="w-full mt-4 h-16 text-xl rounded-full bg-neutral-900 text-white hover:bg-neutral-800 shadow-xl transition-transform hover:-translate-y-1">
             테스트 다시 하기 💫
          </Button>
        </div>
      </main>
    </div>
  );
}