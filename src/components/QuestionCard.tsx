"use client";
import { useEffect } from "react";
import { useAnswerTransition } from "@/hooks/useAnswerTransition";
import { MBTIQuestion } from "@/lib/customTests/mbtiQuestions";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Check } from "lucide-react";

interface QuestionCardProps {
  question: MBTIQuestion;
  selectedAnswer: number | null;
  onAnswerSelect: (value: number) => void;
  onNext: (answerValue?: number) => void;
  onPrevious: () => void;
  canGoNext: boolean;
  canGoPrevious: boolean;
  isLastQuestion: boolean;
}

const answerOptions = [
  { value: 1, text: "매우 그렇다", tone: "text-indigo-700" },
  { value: 2, text: "그렇다", tone: "text-indigo-600" },
  { value: 3, text: "보통이다", tone: "text-neutral-700" },
  { value: 4, text: "그렇지 않다", tone: "text-rose-600" },
  { value: 5, text: "전혀 그렇지 않다", tone: "text-rose-700" },
];

export default function QuestionCard({
  question,
  selectedAnswer,
  onAnswerSelect,
  onNext,
  onPrevious,
  canGoPrevious,
}: QuestionCardProps) {
  const { pending, advance } = useAnswerTransition(question.id);

  const pick = (value: number) => {
    if (pending) return;
    onAnswerSelect(value);
    advance(() => onNext(value));
  };

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (pending) return;
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (["1", "2", "3", "4", "5"].includes(e.key)) {
        pick(Number(e.key));
      } else if ((e.key === "Backspace" || e.key === "ArrowLeft") && canGoPrevious) {
        e.preventDefault();
        onPrevious();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  });

  return (
    <Card
      key={question.id}
      className="w-full max-w-3xl mx-auto bg-white rounded-3xl shadow-lg border border-neutral-100 animate-fade-in"
    >
      <CardContent className="p-6 sm:p-10">
        <div className="text-center mb-7">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-indigo-50 text-4xl mb-4 shadow-inner">
            {question.emoji}
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-neutral-900 mb-2 leading-snug break-keep">
            {question.text}
          </h2>
          <p className="text-xs sm:text-sm text-neutral-500">평소 나의 모습에 가장 가까운 답변을 선택해주세요.</p>
        </div>

        <div className="space-y-3">
          {answerOptions.map((option) => {
            const isSelected = selectedAnswer === option.value;
            return (
              <button
                key={option.value}
                type="button"
                disabled={pending}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  pick(option.value);
                }}
                className={`w-full text-left px-5 py-4 rounded-2xl border-2 transition-all duration-200 active:scale-[0.99] disabled:cursor-wait ${
                  isSelected
                    ? "border-primary bg-primary/10 shadow-sm"
                    : "border-neutral-200/80 hover:border-primary/60 hover:bg-primary/5"
                }`}
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3.5">
                    <div
                      className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${
                        isSelected
                          ? "border-primary bg-primary text-white"
                          : "border-neutral-300 bg-white"
                      }`}
                    >
                      {isSelected && <Check size={14} strokeWidth={3} />}
                    </div>
                    <span className={`text-base sm:text-lg font-medium ${isSelected ? "text-neutral-900 font-semibold" : option.tone}`}>
                      {option.text}
                    </span>
                  </div>
                  <span className="hidden sm:inline-flex items-center justify-center w-6 h-6 rounded-md bg-neutral-100 text-neutral-400 text-xs font-bold">
                    {option.value}
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        <div className="mt-7 pt-5 border-t border-neutral-100 flex items-center justify-between gap-2">
          {canGoPrevious ? (
            <Button
              type="button"
              onClick={onPrevious}
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
            키보드 1~5로 빠르게 선택할 수 있어요
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
