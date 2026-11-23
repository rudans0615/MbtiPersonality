"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import { useMBTITest } from "@/hooks/useMBTITest";
import ProgressBar from "@/components/ProgressBar";
import QuestionCard from "@/components/QuestionCard";

export default function TestClient() {
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
    totalQuestions,
    currentQuestionData,
  } = useMBTITest();

  const handleNext = (answerValue?: number) => {
    if (isLastQuestion) {
      const result = calculateResults(answerValue);
      if (!result) {
        setError("모든 문항에 답변해주세요.");
        return;
      }
      try {
        sessionStorage.setItem("mbtiResult", result);
        router.push("/results");
      } catch {
        setError("결과를 저장하지 못했습니다. 브라우저의 저장소 사용을 허용한 뒤 마지막 답변을 다시 선택해주세요.");
      }
    } else {
      nextQuestion(answerValue);
    }
  };

  if (!currentQuestionData) {
    return <div className="pt-28 text-center">검사를 불러오는 중입니다...</div>;
  }

  return (
    <div className="min-h-screen bg-neutral-50 pt-16">
      {/* Progress Header */}
      <div className="bg-white shadow-sm sticky top-16 z-20">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl font-semibold text-neutral-800">MBTI 성격유형 검사</h1>
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

        {/* 검사 안내 및 해석 가이드 (초기 문항 노출 시에도 충분한 정보 제공) */}
        <section className="mt-12 bg-white rounded-3xl border border-neutral-100 shadow-sm p-8 space-y-4 text-neutral-700 leading-relaxed">
          <h2 className="text-xl font-bold text-neutral-900">MBTI 60문항 성격유형 검사 안내</h2>
          <p className="text-sm">
            본 검사는 칼 융의 심리유형 이론을 바탕으로 일상 속 행동과 사고 선호를 <strong>외향(E)-내향(I)</strong>,{" "}
            <strong>감각(S)-직관(N)</strong>, <strong>사고(T)-감정(F)</strong>, <strong>판단(J)-인식(P)</strong>의
            4가지 축으로 나누어 살펴보는 60문항 자기이해 테스트입니다.
          </p>
          <ul className="list-disc list-inside text-sm space-y-1.5 text-neutral-600">
            <li>이상적인 모습이나 타인이 바라는 모습이 아니라, <strong>평소 가장 편안하고 자연스러운 반응</strong>을 기준으로 선택해 주세요.</li>
            <li>특정 상황에서 가끔 그러한 경우보다 <strong>최근 몇 년간 일관되게 나타나는 경향</strong>을 떠올리면 정확도가 높아집니다.</li>
            <li>모든 응답은 서버에 저장되지 않고 사용 중인 브라우저에서만 계산됩니다.</li>
          </ul>
          <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-neutral-100 text-xs text-neutral-500">
            <span>※ 참고 및 자기이해용 테스트이며, 공식 MBTI® 임상·전문 검사를 대체하지 않습니다.</span>
            <Link href="/type" className="text-primary font-semibold hover:underline">
              16가지 유형 백과 먼저 보기 →
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
