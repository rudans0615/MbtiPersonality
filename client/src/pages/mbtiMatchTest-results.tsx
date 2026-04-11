import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { AdSenseBlock } from "@/components/AdSenseBlock";
import { CoupangRecommend } from "@/components/CoupangRecommend";
import { calculateMbtiMatchTestTestLevel, mbtiMatchTestResults } from "@/data/mbtiMatchTestTypes";

export default function MbtiMatchTestResults() {
  const [location] = useLocation();
  const [score, setScore] = useState(0);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setScore(parseInt(params.get("score") || "0", 10));
  }, [location]);

  const resultKey = calculateMbtiMatchTestTestLevel(score);
  const result = mbtiMatchTestResults[resultKey];

  if (!result) return null;

  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col font-sans">
      <Navigation />
      <main className="flex-grow max-w-2xl mx-auto w-full px-4 py-12">
        <div className="bg-white rounded-3xl shadow-sm border p-8 text-center">
          <h1 className="text-3xl font-bold mb-4">{result.title || "결과"}</h1>
          <p className="text-lg text-neutral-600 mb-8">{result.description}</p>
          
          <CoupangRecommend keyword={result.title} title="추천 아이템" />
          <div className="my-8"><AdSenseBlock adSlot="1234567890" /></div>
          
          <Button onClick={() => window.location.href = '/mbtiMatchTest-test'} size="lg" className="w-full mt-4 h-14 text-lg rounded-2xl">
            다시 하기
          </Button>
        </div>
      </main>
    </div>
  );
}