"use client";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import SEO from "@/components/SEO";
import { useMBTITest } from "@/hooks/useMBTITest";

import ProgressBar from "@/components/ProgressBar";
import QuestionCard from "@/components/QuestionCard";
import Navigation from "@/components/Navigation";


export default function Test() {
  const router = useRouter();
  const [error, setError] = useState("");
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
      const result = calculateResults(answerValue);
      if (!result) { setError('모든 문항에 답변해주세요.'); return; }
      try {
        sessionStorage.setItem('mbtiResult', result);
        router.push('/results');
      } catch {
        setError('결과를 저장하지 못했습니다. 브라우저의 저장소 사용을 허용한 뒤 마지막 답변을 다시 선택해주세요.');
      }
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
        {error && <p role="alert" className="mb-4 text-red-700">{error}</p>}
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
