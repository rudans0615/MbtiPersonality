import { useState } from "react";
import { useLocation } from "wouter";
import Navigation from "@/components/Navigation";
import SEO from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { petPersonalityTasteQuestions } from "@/data/petPersonalityTasteQuestions";

export default function PetPersonalityTasteTest() {
  const [, setLocation] = useLocation();
  const [hasStarted, setHasStarted] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [scoreHistory, setScoreHistory] = useState<number[]>([]);

  const handleAnswer = (points: number) => {
    const newHistory = [...scoreHistory.slice(0, currentStep), points];
    setScoreHistory(newHistory);
    if (currentStep < petPersonalityTasteQuestions.length - 1) {
      setCurrentStep(curr => curr + 1);
    } else {
      const totalScore = newHistory.reduce((a, b) => a + b, 0);
      setLocation("/petPersonalityTaste-results?score=" + totalScore);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(curr => curr - 1);
    }
  };

  const question = petPersonalityTasteQuestions[currentStep];
  const progress = Math.round(((currentStep + 1) / petPersonalityTasteQuestions.length) * 100);

  return (
    <div className="min-h-screen bg-[#F8F9FB] flex flex-col font-sans">
      <SEO title="내 반려동물 성격으로 보는 진짜 나 취향!" description="반려동물을 통해 나의 숨겨진 취향을 알아보는 재미있는 테스트! 어떤 스타일의 반려동물 성격이 나와 잘 맞는지 확인해봐!" url="https://mbtifinder.com/petPersonalityTaste-test" keywords="PERSONALITY, 내, 반려동물, 성격으로, 보는, 진짜, 나, 취향!" />
      <Navigation />
      {!hasStarted ? (
        <main className="flex-grow max-w-3xl mx-auto w-full px-4 py-12 pb-24 flex flex-col items-center">
          <div className="bg-white rounded-[2rem] p-8 md:p-12 shadow-md flex-col justify-center text-center w-full mb-10 border border-neutral-100">
            <div className="text-6xl mb-6">🐶</div>
            <h1 className="text-3xl md:text-5xl font-extrabold mb-6 tracking-tight text-neutral-900">내 반려동물 성격으로 보는 진짜 나 취향!</h1>
            <p className="text-lg md:text-xl text-neutral-500 mb-10 leading-relaxed">내 취향을 반려동물로 쉽게 알아보자🐾</p>
            <Button onClick={() => setHasStarted(true)} size="lg" className="w-full md:w-auto h-16 text-xl rounded-full px-16 bg-neutral-900 hover:bg-neutral-800 text-white shadow-xl hover:shadow-2xl transition-all">
              지금 바로 알아보기 👉
            </Button>
          </div>
          <div className="bg-white/60 border border-neutral-200 rounded-2xl p-8 text-left w-full mt-8 prose prose-neutral max-w-none">
            <h2 className="text-xl font-bold mb-4">💡 이 테스트에 대하여</h2>
            <p className="text-neutral-600 mb-4">내 반려동물 성격으로 보는 진짜 나 취향!는 당신의 심리를 깊이 있게 분석합니다. 반려동물을 통해 나의 숨겨진 취향을 알아보는 재미있는 테스트! 어떤 스타일의 반려동물 성격이 나와 잘 맞는지 확인해봐!</p>
            <p className="text-neutral-600 mb-6">총 10개의 문항으로 이루어져 있으며, 직관적으로 가장 먼저 떠오르는 답변을 선택하는 것이 가장 정확합니다.</p>
          </div>
        </main>
      ) : (
        <main className="flex-grow max-w-2xl mx-auto w-full px-4 py-8 flex flex-col">
          <div className="mb-8">
            <div className="flex justify-between text-sm font-bold text-neutral-500 mb-2 px-2">
              <span>진행률</span>
              <span>{currentStep + 1} / {petPersonalityTasteQuestions.length}</span>
            </div>
            <div className="w-full bg-neutral-200 rounded-full h-3">
              <div className="bg-neutral-900 h-3 rounded-full transition-all duration-300" style={{ width: progress + "%" }}></div>
            </div>
          </div>
          <div className="bg-white rounded-3xl p-8 md:p-10 shadow-lg flex-grow flex flex-col justify-center text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-10 leading-relaxed text-neutral-800 break-keep">{question?.question || question?.questionText || "내 반려동물 성격으로 보는 진짜 나 취향!"}</h2>
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
                  <ArrowLeft size={16} className="mr-2" /> 이전으로
                </Button>
              </div>
            )}
          </div>
        </main>
      )}
    </div>
  );
}