"use client";
import { useEffect } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useDrunkTest } from "@/hooks/useDrunkTest";
import { useAnswerTransition } from "@/hooks/useAnswerTransition";
import { selfAwarenessResults } from "@/lib/customTests/drunkTestTypes";
import { CoupangRecommend } from "@/components/CoupangRecommend";
import { ShareButtons } from "@/components/ShareButtons";
import { ResultImageCard } from "@/components/ResultImageCard";
import RelatedTests from "@/components/RelatedTests";
import { IS_ADSENSE_REVIEW_MODE } from "@/lib/siteConfig";
import { ArrowLeft, Check, RotateCcw } from "lucide-react";

export default function DrunkClient({ availableTests = [] }: { availableTests?: any[] }) {
  const {
    currentQuestion,
    currentQuestionIndex,
    totalQuestions,
    progress,
    isCompleted,
    selectAnswer,
    nextQuestion,
    previousQuestion,
    getCurrentAnswer,
    getResult,
    restart,
    canGoPrevious,
  } = useDrunkTest();

  const { pending, advance } = useAnswerTransition(currentQuestion.id);
  const currentAnswer = getCurrentAnswer();
  const progressPct = Math.round(progress);

  const pickOption = (score: number) => {
    if (pending) return;
    selectAnswer(score);
    advance(() => {
      nextQuestion();
      if (typeof window !== "undefined") {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    });
  };

  useEffect(() => {
    if (isCompleted || pending) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      const num = Number(e.key);
      if (num >= 1 && num <= currentQuestion.options.length) {
        pickOption(currentQuestion.options[num - 1].score);
      } else if ((e.key === "Backspace" || e.key === "ArrowLeft") && canGoPrevious) {
        e.preventDefault();
        previousQuestion();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  });

  if (isCompleted) {
    const resultCode = getResult();
    const result = selfAwarenessResults[resultCode];

    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50/70 via-rose-50/60 to-purple-50/70 pt-24 pb-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <Card className="bg-white/95 backdrop-blur-sm shadow-2xl rounded-[2rem] border border-white overflow-hidden">
            <div className="h-2.5 bg-gradient-to-r from-amber-500 to-rose-500" />
            <CardContent className="p-6 sm:p-10">
              <div className="text-center mb-8">
                <div className={`inline-flex items-center justify-center w-24 h-24 ${result.color} rounded-full mb-5 shadow-lg`}>
                  <span className="text-5xl">{result.emoji}</span>
                </div>
                <p className="text-xs font-bold uppercase tracking-widest text-rose-500 mb-2">
                  나 술 취했나? 자가진단 결과
                </p>
                <h1 className="text-3xl sm:text-4xl font-extrabold text-neutral-900 mb-2">{result.title}</h1>
                <p className="text-base sm:text-lg text-neutral-600 mb-5">{result.subtitle}</p>
                <div className="bg-neutral-50 border border-neutral-100 rounded-2xl p-4">
                  <p className="text-base sm:text-lg font-semibold text-neutral-700">&ldquo;{result.memeText}&rdquo;</p>
                </div>
              </div>

              <ResultImageCard
                testTitle="나 술 취했나? 자가진단"
                resultTitle={result.title}
                resultEmoji={result.emoji}
                resultSubtitle={result.subtitle}
                characteristics={result.characteristics}
              />

              <div className="space-y-6">
                <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-6 border border-pink-100/70">
                  <h2 className="text-lg font-bold text-neutral-900 mb-3">🎭 현재 상태 분석</h2>
                  <p className="text-neutral-700 leading-relaxed mb-4 text-sm sm:text-base">{result.description}</p>
                  <div className="bg-white/80 rounded-xl p-4">
                    <p className="text-center text-base font-medium text-neutral-600 italic">&ldquo;{result.funnyQuote}&rdquo;</p>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-blue-50/70 border border-blue-100 rounded-2xl p-6">
                    <h3 className="text-base font-bold text-blue-900 mb-3">🔍 주요 특징</h3>
                    <ul className="space-y-2 text-sm">
                      {result.characteristics.map((characteristic, index) => (
                        <li key={index} className="flex items-start text-blue-800">
                          <span className="mr-2">•</span>
                          <span>{characteristic}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="bg-amber-50/70 border border-amber-100 rounded-2xl p-6">
                    <h3 className="text-base font-bold text-amber-900 mb-3">💡 안전 &amp; 회복 조언</h3>
                    <ul className="space-y-2 text-sm">
                      {result.advice.map((advice, index) => (
                        <li key={index} className="flex items-start text-amber-800">
                          <span className="mr-2">•</span>
                          <span>{advice}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {!IS_ADSENSE_REVIEW_MODE && (
                  <CoupangRecommend keyword={`${result.title} 숙취해소`} title="취한 나를 위한 필수 아이템 🍺" />
                )}

                <p className="text-xs text-neutral-500 text-center">
                  재미를 위한 유머 테스트이며 실제 혈중알코올농도 측정이나 음주운전 가능 여부 판단에 사용할 수 없습니다.
                </p>

                <ShareButtons
                  title={`나 술 취했나? 결과: ${result.title}`}
                  shareText={`나의 현재 취함 상태는 '${result.title}'! ${result.memeText} 👉`}
                  url="https://mbtifinder.com/drunk"
                />

                <div className="flex flex-col sm:flex-row gap-3 pt-4">
                  <Button
                    onClick={restart}
                    className="flex-1 bg-gradient-to-r from-amber-500 to-rose-500 hover:opacity-95 text-white py-6 text-base font-bold rounded-2xl"
                  >
                    <RotateCcw size={18} className="mr-2" /> 다시 테스트하기
                  </Button>
                  <Link href="/" className="flex-1">
                    <Button variant="outline" className="w-full py-6 text-base font-bold rounded-2xl">
                      🏠 다른 테스트 보기
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>

          <RelatedTests currentTestId="drunk" availableTests={availableTests} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50/60 via-rose-50/50 to-purple-50/60 pt-16 pb-16">
      <div className="bg-white/95 backdrop-blur-md shadow-sm sticky top-16 z-20 border-b border-neutral-100">
        <div className="max-w-2xl mx-auto px-6 py-3.5">
          <div className="flex items-center justify-between text-xs sm:text-sm font-bold text-neutral-600 mb-2">
            <span className="text-neutral-800">🍻 나 술 취했나? 자가진단</span>
            <span>
              {currentQuestionIndex + 1} / {totalQuestions} <span className="text-rose-500 ml-1">({progressPct}%)</span>
            </span>
          </div>
          <Progress value={progress} className="h-2.5" />
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
        <Card
          key={currentQuestion.id}
          className="bg-white shadow-xl rounded-[2rem] border border-neutral-100 overflow-hidden animate-fade-in"
        >
          <CardContent className="p-6 sm:p-10">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-amber-50 text-5xl mb-4 shadow-inner">
                {currentQuestion.emoji}
              </div>
              <h1 className="text-xl sm:text-2xl font-bold text-neutral-900 leading-snug break-keep">
                {currentQuestion.text}
              </h1>
            </div>

            <div className="space-y-3">
              {currentQuestion.options.map((option, index) => {
                const isSelected = currentAnswer?.score === option.score;
                return (
                  <button
                    key={index}
                    type="button"
                    disabled={pending}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      pickOption(option.score);
                    }}
                    className={`w-full p-4 sm:p-5 rounded-2xl border-2 transition-all duration-200 active:scale-[0.99] disabled:cursor-wait text-left flex items-center justify-between gap-3 ${
                      isSelected
                        ? "border-rose-500 bg-rose-50 shadow-sm"
                        : "border-neutral-200/80 hover:border-rose-300 hover:bg-rose-50/30"
                    }`}
                  >
                    <div className="flex items-center gap-3.5">
                      <span className="text-2xl shrink-0">{option.emoji}</span>
                      <span className={`text-sm sm:text-base break-keep ${isSelected ? "font-bold text-neutral-900" : "font-medium text-neutral-700"}`}>
                        {option.text}
                      </span>
                    </div>
                    {isSelected && <Check size={18} className="text-rose-500 shrink-0" strokeWidth={3} />}
                  </button>
                );
              })}
            </div>

            <div className="mt-8 pt-5 border-t border-neutral-100 flex items-center justify-between">
              {canGoPrevious ? (
                <Button
                  type="button"
                  onClick={previousQuestion}
                  disabled={pending}
                  variant="ghost"
                  className="text-neutral-500 hover:text-rose-600 hover:bg-rose-50 rounded-xl"
                >
                  <ArrowLeft size={16} className="mr-1.5" /> 이전 문항
                </Button>
              ) : (
                <span />
              )}
              <span className="hidden sm:inline text-xs text-neutral-400">
                숫자키 1~4로 빠르게 선택
              </span>
            </div>
          </CardContent>
        </Card>

        <section className="mt-8 bg-white/90 rounded-2xl p-6 text-sm text-neutral-600 space-y-2 border border-neutral-100">
          <h2 className="text-base font-bold text-neutral-800">테스트 안내</h2>
          <p>
            술자리에서 나타나는 시야, 대화 속도, 연락 충동, 감정 기복 등 10가지 행동 신호를 바탕으로 현재 상태를 4단계로 재미있게 분류합니다.
            건강한 음주 습관을 위해 물 섭취와 안전한 귀가를 우선해 주세요.
          </p>
        </section>
      </div>
    </div>
  );
}
