"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { AdSenseBlock } from "@/components/AdSenseBlock";
import { ArrowLeft, Loader2 } from "lucide-react";

export default function TestClient({ testId, testInfo, questions, seoArticle }: any) {
  const router = useRouter();
  const [hasStarted, setHasStarted] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [scoreHistory, setScoreHistory] = useState<number[]>([]);
  const [typeHistory, setTypeHistory] = useState<string[]>([]);
  const [showInterstitial, setShowInterstitial] = useState(false);

  // 유형 기반 테스트 자동 감지: 옵션에 type 필드가 있고 score 필드가 없으면 유형 기반
  const isTypeBased = questions[0]?.options?.[0]?.type !== undefined
    && questions[0]?.options?.[0]?.score === undefined;

  const qLen = questions.length;
  const midPoint = Math.floor(qLen / 2);

  const handleStart = () => {
    setHasStarted(true);
    if (typeof window !== "undefined" && (window as any).gtag) {
      (window as any).gtag('event', 'test_started', {
        test_id: testId,
        options_count: questions[0]?.options?.length || 2,
        questions_count: qLen
      });
    }
  };

  const handleAnswer = (points: number, optType?: string) => {
    // 점수 기반 히스토리 (기존 테스트용)
    const newScoreHistory = [...scoreHistory.slice(0, currentStep), points];
    setScoreHistory(newScoreHistory);

    // 유형 기반 히스토리 (SBTI, Dopamine 등)
    const newTypeHistory = [...typeHistory.slice(0, currentStep), optType || ''];
    setTypeHistory(newTypeHistory);

    if (currentStep === midPoint - 1) {
      setShowInterstitial(true);
      setTimeout(() => {
        setShowInterstitial(false);
        setCurrentStep(curr => curr + 1);
      }, 3000);
      return;
    }

    setTimeout(() => {
      if (currentStep < qLen - 1) {
        setCurrentStep(curr => curr + 1);
      } else {
        if (isTypeBased) {
          // 유형 기반: type 배열을 쉼표 구분 문자열로 전달
          const typesParam = newTypeHistory.join(',');
          router.push(`/${testId}/results?types=${encodeURIComponent(typesParam)}`);
        } else {
          // 점수 기반: 기존 로직 유지
          const totalScore = newScoreHistory.reduce((a, b) => a + b, 0);
          router.push(`/${testId}/results?score=${totalScore}`);
        }
      }
    }, 300);
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(curr => curr - 1);
    }
  };

  const question = questions[currentStep];
  const progress = Math.round(((currentStep + 1) / qLen) * 100);

  if (showInterstitial) {
    return (
      <div className="min-h-screen flex flex-col">
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
    <>
      {!hasStarted ? (
        <main className="flex-grow max-w-3xl mx-auto w-full px-4 py-12 pb-24 flex flex-col items-center">
          <div className="bg-white/90 backdrop-blur-sm rounded-[2rem] p-8 md:p-12 shadow-xl border border-white/60 flex-col justify-center text-center w-full mb-10">
            <div className="text-6xl mb-6">{testInfo.emoji || '✨'}</div>
            <h1 className="text-3xl md:text-5xl font-extrabold mb-6 tracking-tight text-neutral-900">{testInfo.title}</h1>
            <p className="text-lg md:text-xl text-neutral-500 mb-10 leading-relaxed">{testInfo.subtitle || ''}</p>
            <Button onClick={handleStart} size="lg" className="w-full md:w-auto h-16 text-xl rounded-full px-16 bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-400 hover:from-pink-500 hover:via-purple-500 hover:to-indigo-500 text-white shadow-xl hover:shadow-2xl transition-all border-2 border-white/50">
              지금 바로 알아보기 👉
            </Button>
          </div>
          <div className="bg-white/60 backdrop-blur-sm border border-white/60 rounded-2xl p-8 text-left w-full mt-8 prose prose-neutral max-w-none">
            <h2 className="text-xl font-bold mb-4">💡 이 테스트에 대하여</h2>
            <p className="text-neutral-600 mb-4">{testInfo.title}는 당신의 심리를 깊이 있게 분석합니다. {testInfo.description}</p>
            <p className="text-neutral-600 mb-6">총 {qLen}개의 문항으로 이루어져 있으며, 직관적으로 가장 먼저 떠오르는 답변을 선택하는 것이 가장 정확합니다.</p>
            <div className="mt-8 pt-6 border-t border-neutral-200">
              <h3 className="text-lg font-bold mb-3 text-neutral-800">📖 심리 분석 칼럼</h3>
              <div className="text-neutral-600 text-[0.95rem] leading-relaxed whitespace-pre-wrap">
                {seoArticle || `${testInfo.title} 테스트를 통해 당신의 성향과 심리 패턴을 상세히 분석해보세요.`}
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
                {currentStep + 1} / {qLen}
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
                    {question?.question || question?.questionText || question?.text || testInfo.title}
                  </h2>
                </div>
                <div className="space-y-4">
                  {question?.options?.map((opt: any, idx: number) => {
                    const text = typeof opt === "string" ? opt : opt.text;
                    const val = typeof opt === "string" ? 1 : (opt.score ?? 1);
                    const optType = typeof opt === "object" ? opt.type : undefined;
                    return (
                      <button key={idx} onClick={() => handleAnswer(val as number, optType)} className="w-full p-5 text-left rounded-2xl border-2 border-neutral-100 hover:border-pink-200 hover:bg-pink-50/30 shadow-sm transition-all duration-300 transform hover:-translate-y-1">
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
    </>
  );
}
