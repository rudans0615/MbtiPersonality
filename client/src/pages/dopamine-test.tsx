import { useDopamineTest } from "@/hooks/useDopamineTest";
import SEO from "@/components/SEO";
import Navigation from "@/components/Navigation";
import ProgressBar from "@/components/ProgressBar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { useLocation } from "wouter";

export default function DopamineTest() {
  const [, setLocation] = useLocation();
  const {
    currentQuestion,
    currentQuestionIndex,
    selectedAnswer,
    isFirstQuestion,
    progress,
    totalQuestions,
    handleAnswerSelect,
    goToNext,
    goToPrevious,
    canGoPrevious
  } = useDopamineTest();

  return (
    <div className="min-h-screen bg-pink-50/30">
      <SEO title="도파민 중독 성향 테스트" description="나의 메인 도파민 원천은 어디일까? 트렌디한 도파민 중독 유형 분석!" />
      <Navigation />
      
      {/* Progress Header */}
      <div className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-20">
        <div className="max-w-2xl mx-auto px-6 py-4">
          <ProgressBar current={currentQuestionIndex + 1} total={totalQuestions} />
          <p className="text-sm font-semibold tracking-wider text-pink-500 mt-3 text-center">
            {currentQuestionIndex + 1} / {totalQuestions}
          </p>
        </div>
      </div>

      {/* Question Content */}
      <div className="max-w-2xl mx-auto px-6 py-12">
        <Card className="bg-white/90 backdrop-blur-sm rounded-[2rem] shadow-xl border border-white/60 overflow-hidden relative">
          <div className="absolute -top-10 -right-10 text-9xl opacity-5 pointer-events-none">📱</div>
          <CardContent className="p-8 md:p-10 relative z-10">
            {/* Question */}
            <div className="text-center mb-10">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-tr from-pink-300 via-purple-300 to-indigo-300 text-white rounded-full text-2xl font-black mb-6 shadow-md">
                Q{currentQuestion.id}
              </div>
              <h2 className="text-2xl md:text-[1.7rem] font-bold text-neutral-800 leading-snug tracking-tight">
                {currentQuestion.text}
              </h2>
            </div>

            {/* Answer Options */}
            <div className="space-y-4">
              {currentQuestion.options.map((answer, index) => (
                <button
                  key={index}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    
                    if (selectedAnswer === answer.type) {
                      return;
                    }
                    
                    handleAnswerSelect(answer.type);
                    
                    // Auto-advance after a short delay
                    setTimeout(() => {
                      const result = goToNext(answer.type);
                      if (result === 'COMPLETE') {
                        setLocation('/dopamine-results');
                      }
                    }, 300);
                  }}
                  className={`w-full p-5 text-left rounded-2xl border-2 transition-all duration-300 transform hover:-translate-y-1 ${
                    selectedAnswer === answer.type
                      ? 'border-pink-400 bg-pink-50/50 shadow-md shadow-pink-100'
                      : 'border-neutral-100 hover:border-pink-200 hover:bg-neutral-50 shadow-sm'
                  }`}
                >
                  <div className="font-medium text-neutral-700 text-[1.05rem] leading-relaxed">{answer.text}</div>
                </button>
              ))}
            </div>

            {/* Navigation */}
            {canGoPrevious && (
              <div className="mt-10 pt-6 border-t border-neutral-100 flex justify-center">
                <Button
                  onClick={goToPrevious}
                  variant="ghost"
                  className="text-neutral-400 hover:text-pink-500 hover:bg-pink-50 transition-all font-semibold rounded-xl px-6 py-6"
                >
                  <ArrowLeft size={18} className="mr-2" /> 선택 다시하기
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
