import { useState } from "react";
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
    } else {
      setLocation("/");
    }
  };

  if (isFinishing) {
    return (
      <div className="min-h-screen bg-neutral-50 flex flex-col items-center justify-center p-4">
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
    <div className="min-h-screen bg-neutral-50 pt-20 pb-12 px-4 selection:bg-rose-200">
      <div className="max-w-2xl mx-auto hidden md:block">
        <Button 
          variant="ghost" 
          onClick={handleBack}
          className="mb-8 hover:bg-white/50"
        >
          <i className="fas fa-arrow-left mr-2"></i> 이전으로
        </Button>
      </div>

      <div className="max-w-2xl mx-auto relative relative z-10 transition-all duration-500">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-semibold text-rose-500 bg-rose-100 px-3 py-1 rounded-full">
              호구력 진단
            </span>
            <span className="text-sm font-medium text-neutral-500">
              {currentQuestionIndex + 1} / {hoguQuestions.length}
            </span>
          </div>
          <ProgressBar progress={progress} className="bg-rose-500" />
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
          </CardContent>
        </Card>
      </div>

      {/* Mobile progress navigation positioned at bottom */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/80 backdrop-blur-md border-t border-neutral-200 md:hidden flex justify-between items-center z-50">
        <div className="flex-1">
          <p className="text-xs text-neutral-500 font-medium mb-1">
            Question {currentQuestionIndex + 1} of {hoguQuestions.length}
          </p>
          <div className="h-1.5 w-full bg-neutral-100 rounded-full overflow-hidden">
            <div 
              className="h-full bg-rose-500 transition-all duration-500 rounded-full"
              style={{ width: `${Math.max(5, progress)}%` }}
            />
          </div>
        </div>
        <Button 
          variant="ghost" 
          size="icon"
          onClick={handleBack}
          className="ml-4 h-10 w-10 shrink-0 text-neutral-600 hover:text-rose-500 hover:bg-rose-50 rounded-full shadow-sm border border-neutral-200 bg-white"
        >
          <i className="fas fa-arrow-left"></i>
        </Button>
      </div>
    </div>
  );
}
