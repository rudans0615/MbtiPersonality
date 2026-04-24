import { useState } from "react";
import { useLocation } from "wouter";
import Navigation from "@/components/Navigation";
import SEO from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { AdSenseBlock } from "@/components/AdSenseBlock";
import { ArrowLeft, Loader2 } from "lucide-react";
import { loveVibe2023Questions, seoArticle } from "@/data/loveVibe2023Questions";

export default function LoveVibe2023Test() {
  const [, setLocation] = useLocation();
  const [hasStarted, setHasStarted] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [scoreHistory, setScoreHistory] = useState<number[]>([]);
  const [showInterstitial, setShowInterstitial] = useState(false);

  const handleStart = () => {
    setHasStarted(true);
    if (typeof window !== "undefined" && (window as any).gtag) {
      (window as any).gtag('event', 'test_started', {
        test_id: "loveVibe2023",
        options_count: loveVibe2023Questions[0]?.options?.length || 2,
        questions_count: loveVibe2023Questions.length
      });
    }
  };

  const handleAnswer = (points: number) => {
    const newHistory = [...scoreHistory.slice(0, currentStep), points];
    setScoreHistory(newHistory);

    // Q4 interstitial: show "analyzing" screen with ad
    if (currentStep === 4 - 1) {
      setShowInterstitial(true);
      setTimeout(() => {
        setShowInterstitial(false);
        setCurrentStep(curr => curr + 1);
      }, 3000);
      return;
    }

    setTimeout(() => {
      if (currentStep < loveVibe2023Questions.length - 1) {
        setCurrentStep(curr => curr + 1);
      } else {
        const totalScore = newHistory.reduce((a, b) => a + b, 0);
        setLocation("/loveVibe2023-results?score=" + totalScore);
      }
    }, 300);
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(curr => curr - 1);
    }
  };

  const question = loveVibe2023Questions[currentStep];
  const progress = Math.round(((currentStep + 1) / loveVibe2023Questions.length) * 100);

  // Interstitial ad screen at midpoint
  if (showInterstitial) {
    return (
      <div className="min-h-screen bg-pink-50/30 flex flex-col">
        <Navigation />
        <main className="flex-grow flex flex-col items-center justify-center p-6">
          <Loader2 className="h-12 w-12 animate-spin text-pink-400 mb-6" />
          <h2 className="text-2xl font-bold text-neutral-800 mb-2">더 정확한 결과를 위해...</h2>
          <p className="text-neutral-500 mb-8">답변 패턴을 심층 분석 중이에요 🧠</p>
          <div className="w-full max-w-md">
            <AdSenseBlock adSlot="5566778899" />
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-pink-50/30">
      <SEO title="너의 연애 스타일은 뭐야?" description="연애에 대한 나만의 스타일, 알고 계신가요? 이 테스트를 통해 나의 연애 스타일과 감정 트렌드를 알아보고, 친구들과 공유해보세요. 우린 모두 다르니까요!" url="https://mbtifinder.com/loveVibe2023-test" keywords="LOVE, 너의, 연애, 스타일은, 뭐야?" />
      <Navigation />
      {!hasStarted ? (
        <main className="flex-grow max-w-3xl mx-auto w-full px-4 py-12 pb-24 flex flex-col items-center">
          <div className="bg-white/90 backdrop-blur-sm rounded-[2rem] p-8 md:p-12 shadow-xl border border-white/60 flex-col justify-center text-center w-full mb-10">
            <div className="text-6xl mb-6">❤️</div>
            <h1 className="text-3xl md:text-5xl font-extrabold mb-6 tracking-tight text-neutral-900">너의 연애 스타일은 뭐야?</h1>
            <p className="text-lg md:text-xl text-neutral-500 mb-10 leading-relaxed">당신의 사랑 방식을 파헤쳐봐요!</p>
            <Button onClick={handleStart} size="lg" className="w-full md:w-auto h-16 text-xl rounded-full px-16 bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-400 hover:from-pink-500 hover:via-purple-500 hover:to-indigo-500 text-white shadow-xl hover:shadow-2xl transition-all border-2 border-white/50">
              지금 바로 알아보기 👉
            </Button>
          </div>
          <div className="bg-white/60 backdrop-blur-sm border border-white/60 rounded-2xl p-8 text-left w-full mt-8 prose prose-neutral max-w-none">
            <h2 className="text-xl font-bold mb-4">💡 이 테스트에 대하여</h2>
            <p className="text-neutral-600 mb-4">너의 연애 스타일은 뭐야?는 당신의 심리를 깊이 있게 분석합니다. 연애에 대한 나만의 스타일, 알고 계신가요? 이 테스트를 통해 나의 연애 스타일과 감정 트렌드를 알아보고, 친구들과 공유해보세요. 우린 모두 다르니까요!</p>
            <p className="text-neutral-600 mb-6">총 8개의 문항으로 이루어져 있으며, 직관적으로 가장 먼저 떠오르는 답변을 선택하는 것이 가장 정확합니다.</p>
            <div className="mt-8 pt-6 border-t border-neutral-200">
              <h3 className="text-lg font-bold mb-3 text-neutral-800">📖 심리 분석 칼럼</h3>
              <div className="text-neutral-600 text-[0.95rem] leading-relaxed whitespace-pre-wrap">
                {seoArticle}
              </div>
            </div>
          </div>
          <AdSenseBlock adSlot="1122334455" />
        </main>
      ) : (
        <>
          <div className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-20">
            <div className="max-w-2xl mx-auto px-6 py-4">
              <div className="w-full bg-pink-100 rounded-full h-2.5">
                <div className="bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-400 h-2.5 rounded-full transition-all duration-500" style={{ width: progress + "%" }}></div>
              </div>
              <p className="text-sm font-semibold tracking-wider text-pink-500 mt-3 text-center">
                {currentStep + 1} / {loveVibe2023Questions.length}
              </p>
            </div>
          </div>

          <div className="max-w-2xl mx-auto px-6 py-12">
            <div className="bg-white/90 backdrop-blur-sm rounded-[2rem] shadow-xl border border-white/60 overflow-hidden relative">
              <div className="p-8 md:p-10 relative z-10">
                <div className="text-center mb-10">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-tr from-pink-300 via-purple-300 to-indigo-300 text-white rounded-full text-2xl font-black mb-6 shadow-md">
                    Q{currentStep + 1}
                  </div>
                  <h2 className="text-2xl md:text-[1.7rem] font-bold text-neutral-800 leading-snug tracking-tight break-keep">
                    {question?.question || question?.questionText || "너의 연애 스타일은 뭐야?"}
                  </h2>
                </div>
                <div className="space-y-4">
                  {question?.options?.map((opt: any, idx: number) => {
                    const text = typeof opt === "string" ? opt : opt.text;
                    const val = typeof opt === "string" ? 1 : (opt.score ?? 1);
                    return (
                      <button key={idx} onClick={() => handleAnswer(val as number)} className="w-full p-5 text-left rounded-2xl border-2 border-neutral-100 hover:border-pink-200 hover:bg-pink-50/30 shadow-sm transition-all duration-300 transform hover:-translate-y-1">
                        <div className="font-medium text-neutral-700 text-[1.05rem] leading-relaxed">{text}</div>
                      </button>
                    );
                  })}
                </div>
                {currentStep > 0 && (
                  <div className="mt-10 pt-6 border-t border-neutral-100 flex justify-center">
                    <Button onClick={handlePrevious} variant="ghost" className="text-neutral-400 hover:text-pink-500 hover:bg-pink-50 transition-all font-semibold rounded-xl px-6 py-6">
                      <ArrowLeft size={18} className="mr-2" /> 선택 다시하기
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}