import { useTetoEgenTest } from "@/hooks/useTetoEgenTest";
import SEO from "@/components/SEO";
import Navigation from "@/components/Navigation";
import ProgressBar from "@/components/ProgressBar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useLocation } from "wouter";

export default function TetoEgenTest() {
  const [, setLocation] = useLocation();
  const {
    currentQuestion,
    currentQuestionIndex,
    selectedAnswer,
    isFirstQuestion,
    isLastQuestion,
    progress,
    totalQuestions,
    handleAnswerSelect,
    goToNext,
    goToPrevious,
    getAnswersForQuestion,
    canGoNext,
    canGoPrevious
  } = useTetoEgenTest();

  const handleNext = () => {
    const result = goToNext();
    if (result === 'COMPLETE') {
      setLocation('/teto-egen-results');
    }
  };

  const answers = getAnswersForQuestion(currentQuestion.id);

  return (
    <div className="min-h-screen bg-neutral-50">
      <SEO title="테토 vs 에겐 호르몬 진단" description="테스토스테론과 에스트로겐 수치를 기반으로 당신의 두뇌 성향을 분석합니다." />
      <Navigation />
      
      {/* Progress Header */}
      <div className="bg-white shadow-sm sticky top-0 z-20">
        <div className="max-w-2xl mx-auto px-6 py-4">
          <ProgressBar current={currentQuestionIndex + 1} total={totalQuestions} />
          <p className="text-sm text-neutral-600 mt-2 text-center">
            {currentQuestionIndex + 1} / {totalQuestions} 문항
          </p>
        </div>
      </div>

      {/* Question Content */}
      <div className="max-w-2xl mx-auto px-6 py-8">
        <Card className="bg-white rounded-3xl shadow-lg border-0 overflow-hidden">
          <CardContent className="p-8">
            {/* Question */}
            <div className="text-center mb-8">
              <div className="text-6xl mb-4">{currentQuestion.emoji}</div>
              <h2 className="text-2xl md:text-3xl font-bold text-neutral-800 mb-4">
                {currentQuestion.text}
              </h2>
            </div>

            {/* Answer Options */}
            <div className="space-y-3">
              {answers.map((answer, index) => (
                <button
                  key={index}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    
                    // Check if already selected to prevent double execution
                    if (selectedAnswer === answer.value) {
                      return;
                    }
                    
                    handleAnswerSelect(answer.value);
                    
                    // Auto-advance after a short delay
                    setTimeout(() => {
                      const result = goToNext(answer.value);
                      if (result === 'COMPLETE') {
                        setLocation('/teto-egen-results');
                      }
                    }, 200);
                  }}
                  className={`w-full p-4 text-left rounded-xl border-2 transition-all duration-200 ${
                    selectedAnswer === answer.value
                      ? 'border-primary bg-primary/10 text-primary'
                      : 'border-neutral-200 hover:border-neutral-300 hover:bg-neutral-50'
                  }`}
                >
                  <div className="font-medium">{answer.text}</div>
                </button>
              ))}
            </div>

            {/* Navigation */}
            <div className="flex justify-center items-center mt-8 pt-6 border-t border-neutral-200">
              <Button
                variant="ghost"
                onClick={goToPrevious}
                disabled={!canGoPrevious}
                className="flex items-center space-x-2"
              >
                <ArrowLeft size={18} />
                <span>이전</span>
              </Button>

              <div className="text-center text-sm text-neutral-500 flex items-center px-8">
                답변을 선택하면 자동으로 다음 질문으로 넘어갑니다
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}