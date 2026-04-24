"use client";
import { usePathname, useRouter } from "next/navigation";
import SEO from "@/components/SEO";
import { useMBTITest } from "@/hooks/useMBTITest";
import { mbtiTypes } from "@/data/mbtiTypes";
import ProgressBar from "@/components/ProgressBar";
import QuestionCard from "@/components/QuestionCard";
import Navigation from "@/components/Navigation";


export default function Test() {
  const router = useRouter();
  const {
    currentQuestion,
    selectedAnswer,
    selectAnswer,
    nextQuestion,
    previousQuestion,
    calculateResults,
    isLastQuestion,
    canGoNext,
    canGoPrevious,
    progress,
    totalQuestions,
    currentQuestionData
  } = useMBTITest();

  const handleNext = (answerValue?: number) => {
    if (isLastQuestion) {
      const result = calculateResults();
      // Store result in sessionStorage for results page
      sessionStorage.setItem('mbtiResult', result);
      router.push('/results');
    } else {
      nextQuestion(answerValue);
    }
  };

  if (!currentQuestionData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      <SEO title="MBTI 성격유형 검사" description="과학적으로 검증된 16가지 성격 분석" />
      <Navigation />
      
      {/* Progress Header */}
      <div className="bg-white shadow-sm sticky top-0 z-20">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-neutral-800">MBTI 성격유형 검사</h2>
            <span className="text-neutral-600">{currentQuestion + 1} / {totalQuestions}</span>
          </div>
          <ProgressBar current={currentQuestion + 1} total={totalQuestions} />
        </div>
      </div>

      {/* Question Content */}
      <div className="max-w-3xl mx-auto px-6 py-12">
        <QuestionCard
          question={currentQuestionData}
          selectedAnswer={selectedAnswer}
          onAnswerSelect={selectAnswer}
          onNext={handleNext}
          onPrevious={previousQuestion}
          canGoNext={canGoNext}
          canGoPrevious={canGoPrevious}
          isLastQuestion={isLastQuestion}
        />


      </div>
    </div>
  );
}
