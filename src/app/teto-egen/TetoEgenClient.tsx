"use client";
import { useTetoEgenTest } from "@/hooks/useTetoEgenTest";
import { useState } from "react";
import { useAnswerTransition } from "@/hooks/useAnswerTransition";
import ProgressBar from "@/components/ProgressBar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export default function TetoEgenClient() {
  const router = useRouter();
  const {
    currentQuestion,
    currentQuestionIndex,
    selectedAnswer,
    totalQuestions,
    handleAnswerSelect,
    goToNext,
    goToPrevious,
    getAnswersForQuestion,
    canGoPrevious,
  } = useTetoEgenTest();

  const { pending, advance } = useAnswerTransition(currentQuestion.id);
  const [error, setError] = useState("");
  const answers = getAnswersForQuestion(currentQuestion.id);

  return (
    <div className="min-h-screen bg-neutral-50 pt-16">
      {/* Progress Header */}
      <div className="bg-white shadow-sm sticky top-16 z-20">
        <div className="max-w-2xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-lg font-bold text-neutral-800">테토 vs 에겐 성향 진단</h1>
            <span className="text-sm text-neutral-600">
              {currentQuestionIndex + 1} / {totalQuestions} 문항
            </span>
          </div>
          <ProgressBar current={currentQuestionIndex + 1} total={totalQuestions} />
        </div>
      </div>

      {/* Question Content */}
      <div className="max-w-2xl mx-auto px-6 py-8">
        {error && <p role="alert" className="mb-4 text-red-700">{error}</p>}
        <Card className="bg-white rounded-3xl shadow-lg border-0 overflow-hidden">
          <CardContent className="p-8">
            <div className="text-center mb-8">
              <div className="text-6xl mb-4">{currentQuestion.emoji}</div>
              <h2 className="text-2xl md:text-3xl font-bold text-neutral-800 mb-4">{currentQuestion.text}</h2>
            </div>

            <div className="space-y-3">
              {answers.map((answer, index) => (
                <button
                  key={index}
                  disabled={pending}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    if (pending) return;
                    advance(() => {
                      try {
                        const result = goToNext(answer.value);
                        if (result === "COMPLETE") router.push("/teto-egen/results");
                      } catch {
                        setError("결과를 저장하지 못했습니다. 브라우저의 저장소 사용을 허용한 뒤 마지막 답변을 다시 선택해주세요.");
                      }
                    });
                    handleAnswerSelect(answer.value);
                  }}
                  className={`w-full p-4 text-left rounded-xl border-2 transition-all duration-200 ${
                    selectedAnswer === answer.value
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-neutral-200 hover:border-neutral-300 hover:bg-neutral-50"
                  }`}
                >
                  <div className="font-medium">{answer.text}</div>
                </button>
              ))}
            </div>

            {canGoPrevious && (
              <div className="mt-8 pt-6 border-t border-neutral-100 flex justify-center">
                <Button
                  onClick={goToPrevious}
                  disabled={pending}
                  variant="ghost"
                  className="text-neutral-400 hover:text-primary hover:bg-primary/5 transition-all"
                >
                  <ArrowLeft size={16} className="mr-2" /> 이전 문항으로
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        <section className="mt-8 bg-white rounded-2xl border border-neutral-100 p-6 text-sm text-neutral-600 space-y-2 leading-relaxed">
          <h2 className="text-base font-bold text-neutral-800">테토-에겐 성향 진단이란?</h2>
          <p>
            주도적 추진력과 직관적 결단력(테토), 섬세한 감정 공감과 관계 조화력(에겐)의 비율을 21개 일상·연애 시나리오 문항으로 살펴보는 참고용 성향 테스트입니다.
            검사 결과는 테토남·테토녀·에겐남·에겐녀 4가지 유형과 백분율 밸런스, 궁합 가이드로 제공됩니다.
          </p>
          <p className="text-xs text-neutral-500">
            ※ 실제 의학적 호르몬 수치 검사가 아니며, 자기이해와 소통을 돕기 위한 엔터테인먼트 테스트입니다.
          </p>
        </section>
      </div>
    </div>
  );
}
