import { useState } from "react";
import SEO from "@/components/SEO";
import { useLocation } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { hoguQuestions } from "@/data/hoguTestQuestions";
import ProgressBar from "@/components/ProgressBar";

export default function HoguTest() {
  const [, setLocation] = useLocation();
  const [currentQuestionIndices, setCurrentQuestionIndices] = useState<number[]>([0]);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [isFinishing, setIsFinishing] = useState(false);

  const currentQuestionIndex = currentQuestionIndices[currentQuestionIndices.length - 1];
  const question = hoguQuestions[currentQuestionIndex];
  const progress = (currentQuestionIndex / hoguQuestions.length) * 100;

  const handleAnswer = (score: number) => {
    const newAnswers = { ...answers, [question.id]: score };
    setAnswers(newAnswers);

    if (currentQuestionIndex < hoguQuestions.length - 1) {
      setCurrentQuestionIndices([...currentQuestionIndices, currentQuestionIndex + 1]);
    } else {
      setIsFinishing(true);
      const totalScore = Object.values(newAnswers).reduce((a, b) => a + b, 0);
      
      setTimeout(() => {
        setLocation(`/hogu-results?score=${totalScore}`);
      }, 1500);
    }
  };

  const handleBack = () => {
    if (currentQuestionIndices.length > 1) {
      const newIndices = [...currentQuestionIndices];
      newIndices.pop();
      setCurrentQuestionIndices(newIndices);
    }
  };

  if (isFinishing) {
    return (
      <div className="min-h-screen bg-neutral-50 flex flex-col items-center justify-center p-4">
      <SEO title="연애 호구력 진단 테스트" description="끌려다니는 연애는 그만! 나의 호구력을 팩트로 진단해보세요." />
        <div className="text-center space-y-6 animate-pulse">
          <div className="w-24 h-24 mx-auto bg-gradient-to-tr from-pink-400 to-rose-500 rounded-full flex items-center justify-center">
            <i className="fas fa-heart-broken text-white text-4xl"></i>
          </div>
          <h2 className="text-2xl font-bold text-neutral-800">당신의 연애 호구력을 분석 중입니다...</h2>
          <p className="text-neutral-500">과연 내 연애의 주도권은 누구에게 있을까요?</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50 pt-20 pb-24 px-4 selection:bg-rose-200">
      <div className="max-w-2xl mx-auto relative z-10 transition-all duration-500">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-semibold text-rose-500 bg-rose-100 px-3 py-1 rounded-full">
              호구력 진단
            </span>
            <span className="text-sm font-medium text-neutral-500">
              {currentQuestionIndex + 1} / {hoguQuestions.length}
            </span>
          </div>
          <ProgressBar current={currentQuestionIndex + 1} total={hoguQuestions.length} />
        </div>

        <Card className="bg-white rounded-3xl shadow-xl overflow-hidden border-0">
          <CardContent className="p-8 md:p-12">
            <h2 className="text-2xl md:text-3xl font-bold text-neutral-800 mb-12 leading-relaxed break-keep">
              {question.text}
            </h2>

            <div className="space-y-4">
              {question.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswer(option.score)}
                  className="w-full text-left p-6 md:p-8 rounded-2xl border-2 border-neutral-100 hover:border-rose-300 hover:bg-rose-50 transition-all duration-300 group relative overflow-hidden"
                >
                  <span className="relative z-10 text-lg md:text-xl text-neutral-700 font-medium group-hover:text-rose-700 block break-keep pr-8">
                    {option.text}
                  </span>
                  <div className="absolute right-6 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity text-rose-400">
                    <i className="fas fa-check-circle text-2xl"></i>
                  </div>
                </button>
              ))}
            </div>

            {/* 이전 버튼 - 2번째 문항부터 카드 하단에 자연스럽게 표시 */}
            {currentQuestionIndices.length > 1 && (
              <div className="mt-8 pt-6 border-t border-neutral-100 flex justify-center">
                <Button 
                  variant="ghost" 
                  onClick={handleBack}
                  className="text-neutral-400 hover:text-rose-500 hover:bg-rose-50 transition-all"
                >
                  <i className="fas fa-arrow-left mr-2"></i> 이전 문항으로
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
