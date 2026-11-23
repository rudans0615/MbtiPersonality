"use client";
import { useEffect, useState } from "react";
import { useTetoEgenTest } from "@/hooks/useTetoEgenTest";
import { useAnswerTransition } from "@/hooks/useAnswerTransition";
import ProgressBar from "@/components/ProgressBar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Check } from "lucide-react";
import { useRouter } from "next/navigation";

const LETTERS = ["A", "B", "C", "D"];

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
  const progressPct = Math.round(((currentQuestionIndex + 1) / totalQuestions) * 100);

  const pickAnswer = (value: number | string) => {
    if (pending) return;
    handleAnswerSelect(value);
    advance(() => {
      try {
        const result = goToNext(value);
        if (result === "COMPLETE") {
          router.push("/teto-egen/results");
        } else if (typeof window !== "undefined") {
          window.scrollTo({ top: 0, behavior: "smooth" });
        }
      } catch {
        setError("결과를 저장하지 못했습니다. 브라우저의 저장소 사용을 허용한 뒤 마지막 답변을 다시 선택해주세요.");
      }
    });
  };

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (pending) return;
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      const num = Number(e.key);
      if (num >= 1 && num <= answers.length) {
        pickAnswer(answers[num - 1].value);
      } else if ((e.key === "Backspace" || e.key === "ArrowLeft") && canGoPrevious) {
        e.preventDefault();
        goToPrevious();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  });

  return (
    <div className="min-h-screen bg-neutral-50 pt-16 pb-16">
      {/* Progress Header */}
      <div className="bg-white/95 backdrop-blur-md shadow-sm sticky top-16 z-20 border-b border-neutral-100">
        <div className="max-w-2xl mx-auto px-6 py-3.5">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-base sm:text-lg font-bold text-neutral-800">테토 vs 에겐 성향 진단</h1>
            <span className="text-xs sm:text-sm font-bold text-neutral-600">
              {currentQuestionIndex + 1} / {totalQuestions} <span className="text-primary ml-1">({progressPct}%)</span>
            </span>
          </div>
          <ProgressBar current={currentQuestionIndex + 1} total={totalQuestions} />
        </div>
      </div>

      {/* Question Content */}
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
        {error && <p role="alert" className="mb-4 text-red-700">{error}</p>}
        <Card
          key={currentQuestion.id}
          className="bg-white rounded-[2rem] shadow-xl border border-neutral-100 overflow-hidden animate-fade-in"
        >
          <CardContent className="p-6 sm:p-10">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-br from-blue-50 to-pink-50 text-5xl mb-4 shadow-inner">
                {currentQuestion.emoji}
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-neutral-900 leading-snug break-keep">
                {currentQuestion.text}
              </h2>
            </div>

            <div className="space-y-3">
              {answers.map((answer, index) => {
                const isSelected = selectedAnswer === answer.value;
                return (
                  <button
                    key={index}
                    type="button"
                    disabled={pending}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      pickAnswer(answer.value);
                    }}
                    className={`w-full p-4 sm:p-5 text-left rounded-2xl border-2 transition-all duration-200 active:scale-[0.99] disabled:cursor-wait flex items-center gap-3.5 ${
                      isSelected
                        ? "border-primary bg-primary/10 shadow-sm"
                        : "border-neutral-200/80 hover:border-primary/50 hover:bg-neutral-50"
                    }`}
                  >
                    <span
                      className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-extrabold shrink-0 ${
                        isSelected ? "bg-primary text-white" : "bg-neutral-100 text-neutral-500"
                      }`}
                    >
                      {isSelected ? <Check size={16} strokeWidth={3} /> : LETTERS[index] || index + 1}
                    </span>
                    <div className={`text-sm sm:text-base break-keep ${isSelected ? "font-bold text-neutral-900" : "font-medium text-neutral-700"}`}>
                      {answer.text}
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="mt-8 pt-5 border-t border-neutral-100 flex items-center justify-between">
              {canGoPrevious ? (
                <Button
                  type="button"
                  onClick={goToPrevious}
                  disabled={pending}
                  variant="ghost"
                  className="text-neutral-500 hover:text-primary hover:bg-primary/5 rounded-xl"
                >
                  <ArrowLeft size={16} className="mr-1.5" /> 이전 문항
                </Button>
              ) : (
                <span />
              )}
              <span className="hidden sm:inline text-xs text-neutral-400">
                숫자키 1~{answers.length}로 빠르게 선택
              </span>
            </div>
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
