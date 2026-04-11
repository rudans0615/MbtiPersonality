import { useState } from "react";
import { useLocation } from "wouter";
import Navigation from "@/components/Navigation";
import SEO from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { AdSenseBlock } from "@/components/AdSenseBlock";
import { pastLifeTestQuestions } from "@/data/pastLifeTestQuestions";

export default function PastLifeTestTest() {
  const [, setLocation] = useLocation();
  const [hasStarted, setHasStarted] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [score, setScore] = useState(0);

  const handleAnswer = (points: number) => {
    const newScore = score + points;
    if (currentStep < pastLifeTestQuestions.length - 1) {
      setScore(newScore);
      setCurrentStep(curr => curr + 1);
    } else {
      setLocation(`/pastLifeTest-results?score=${newScore}`);
    }
  };

  const question = pastLifeTestQuestions[currentStep];

  return (
    <div className="min-h-screen bg-[#F8F9FB] flex flex-col font-sans">
      <SEO title="당신의 전생은 어떤 모습이었을까요?" description="인생은 다양한 과거의 연속입니다! 당신의 전생은 어떤 모습이었을까요? 재미있는 질문들을 통해 숨겨진 당신의 전생을 밝혀보세요. 흥미진진한 발견과 함께, 전생의 이야기를 들려드릴게요!" />
      <Navigation />
      {!hasStarted ? (
        <main className="flex-grow max-w-3xl mx-auto w-full px-4 py-12 pb-24 flex flex-col items-center">
          <div className="bg-white rounded-[2rem] p-8 md:p-12 shadow-md flex-col justify-center text-center w-full mb-10 border border-neutral-100">
            <div className="text-6xl mb-6">{emoji || '✨'}</div>
            <h1 className="text-3xl md:text-5xl font-extrabold mb-6 tracking-tight text-neutral-900">당신의 전생은 어떤 모습이었을까요?</h1>
            <p className="text-lg md:text-xl text-neutral-500 mb-10 leading-relaxed">궁금한 당신의 과거! 지금 바로 알아보세요!</p>
            <Button onClick={() => setHasStarted(true)} size="lg" className="w-full md:w-auto h-16 text-xl rounded-full px-16 bg-neutral-900 hover:bg-neutral-800 text-white shadow-xl hover:shadow-2xl transition-all">
              지금 바로 알아보기 👉
            </Button>
          </div>
          
          {/* AdSense SEO Text Block */}
          <div className="bg-white/60 border border-neutral-200 rounded-2xl p-8 text-left w-full mt-8 prose prose-neutral max-w-none">
            <h2 className="text-xl font-bold mb-4">💡 이 테스트에 대하여</h2>
            <p className="text-neutral-600 mb-4">당신의 전생은 어떤 모습이었을까요?는 당신의 심리를 깊이 있게 분석하여 숨겨진 성향을 찾아냅니다. 인생은 다양한 과거의 연속입니다! 당신의 전생은 어떤 모습이었을까요? 재미있는 질문들을 통해 숨겨진 당신의 전생을 밝혀보세요. 흥미진진한 발견과 함께, 전생의 이야기를 들려드릴게요!</p>
            <p className="text-neutral-600 mb-6">총 12개의 문항으로 이루어져 있으며, 직관적으로 가장 먼저 떠오르는 답변을 선택하는 것이 가장 정확합니다. 지금 바로 당신만의 특별한 결과를 확인해보세요!</p>
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
              <span>{currentStep + 1} / {pastLifeTestQuestions.length}</span>
            </div>
            <div className="w-full bg-neutral-200 rounded-full h-3">
              <div className="bg-neutral-900 h-3 rounded-full transition-all duration-300" style={{ width: `${((currentStep + 1) / pastLifeTestQuestions.length) * 100}%` }}></div>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-8 md:p-10 shadow-lg flex-grow flex flex-col justify-center text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-10 leading-relaxed text-neutral-800 break-keep">{question?.question || question?.questionText || "당신의 전생은 어떤 모습이었을까요?"}</h2>
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
}