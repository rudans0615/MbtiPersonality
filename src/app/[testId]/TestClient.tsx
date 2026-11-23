"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useAnswerTransition } from "@/hooks/useAnswerTransition";
import { ArrowLeft, Check, Clock, HelpCircle } from "lucide-react";

const LETTERS = ["A", "B", "C", "D", "E", "F"];

export default function TestClient({ testId, testInfo, questions, guide }: any) {
  const router = useRouter();
  const [hasStarted, setHasStarted] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [scoreHistory, setScoreHistory] = useState<number[]>([]);
  const [typeHistory, setTypeHistory] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const { pending, advance } = useAnswerTransition(currentStep);

  // 유형 기반 테스트 자동 감지: 옵션에 type 필드가 있고 score 필드가 없으면 유형 기반
  const isTypeBased =
    questions[0]?.options?.[0]?.type !== undefined &&
    questions[0]?.options?.[0]?.score === undefined;

  const qLen = questions.length;
  const accentGradient = testInfo.color || "from-pink-400 via-purple-400 to-indigo-400";

  useEffect(() => {
    setSelectedIdx(null);
  }, [currentStep]);

  const handleStart = () => {
    setHasStarted(true);
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
      if ((window as any).gtag) {
        (window as any).gtag("event", "test_started", {
          test_id: testId,
          options_count: questions[0]?.options?.length || 2,
          questions_count: qLen,
        });
      }
    }
  };

  const handleAnswer = (idx: number, points: number, optType?: string) => {
    if (pending || submitting) return;
    setSelectedIdx(idx);
    advance(() => {
      const newScoreHistory = [...scoreHistory.slice(0, currentStep), points];
      setScoreHistory(newScoreHistory);

      const newTypeHistory = [...typeHistory.slice(0, currentStep), optType || ""];
      setTypeHistory(newTypeHistory);

      if (currentStep < qLen - 1) {
        setCurrentStep((curr) => curr + 1);
        if (typeof window !== "undefined") {
          window.scrollTo({ top: 0, behavior: "smooth" });
        }
      } else {
        setSubmitting(true);
        if (isTypeBased) {
          const typesParam = newTypeHistory.join(",");
          router.push(`/${testId}/results?types=${encodeURIComponent(typesParam)}`);
        } else {
          const totalScore = newScoreHistory.reduce((a, b) => a + b, 0);
          router.push(`/${testId}/results?score=${totalScore}`);
        }
      }
    });
  };

  const handlePrevious = () => {
    if (!pending && !submitting && currentStep > 0) {
      setCurrentStep((curr) => curr - 1);
    }
  };

  const question = questions[currentStep];
  const progress = Math.round(((currentStep + 1) / qLen) * 100);

  // 데스크톱 키보드 단축키 (1~4, Backspace)
  useEffect(() => {
    if (!hasStarted || pending || submitting) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      const num = Number(e.key);
      const opts = question?.options || [];
      if (num >= 1 && num <= opts.length) {
        const opt = opts[num - 1];
        const val = typeof opt === "string" ? 1 : (opt.score ?? 1);
        const optType = typeof opt === "object" ? opt.type : undefined;
        handleAnswer(num - 1, val as number, optType);
      } else if ((e.key === "Backspace" || e.key === "ArrowLeft") && currentStep > 0) {
        e.preventDefault();
        handlePrevious();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  });

  return (
    <>
      {!hasStarted ? (
        <section className="flex-grow max-w-3xl mx-auto w-full px-4 pt-28 pb-24 flex flex-col items-center">
          <div className="bg-white rounded-[2rem] shadow-xl border border-neutral-100 overflow-hidden w-full mb-8">
            <div className={`h-3 bg-gradient-to-r ${accentGradient}`} />
            <div className="p-8 md:p-12 text-center">
              <div className="inline-flex items-center justify-center w-24 h-24 rounded-3xl bg-neutral-50 border border-neutral-100 text-5xl mb-6 shadow-inner">
                {testInfo.emoji || "✨"}
              </div>
              <h1 className="text-3xl md:text-4xl font-extrabold mb-4 tracking-tight text-neutral-900 break-keep leading-tight">
                {testInfo.title}
              </h1>
              <p className="text-base md:text-lg text-neutral-500 mb-6 leading-relaxed break-keep max-w-xl mx-auto">
                {testInfo.subtitle || testInfo.description || ""}
              </p>
              <div className="flex items-center justify-center gap-3 text-xs sm:text-sm font-semibold text-neutral-600 mb-8">
                <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-neutral-100">
                  <HelpCircle size={15} /> 총 {qLen}문항
                </span>
                <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-neutral-100">
                  <Clock size={15} /> {testInfo.duration || "약 3분"}
                </span>
              </div>
              <Button
                onClick={handleStart}
                size="lg"
                className={`w-full sm:w-auto h-15 py-4 text-lg font-bold rounded-full px-14 bg-gradient-to-r ${accentGradient} hover:opacity-95 text-white shadow-xl hover:shadow-2xl transition-all active:scale-[0.98]`}
              >
                지금 바로 시작하기 👉
              </Button>
            </div>
          </div>

          {/* 상세 테스트 소개 및 해석 가이드 */}
          <div className="bg-white rounded-3xl border border-neutral-200/80 p-6 sm:p-8 text-left w-full space-y-8 shadow-sm">
            <div>
              <h2 className="text-xl font-bold text-neutral-900 mb-3">💡 이 테스트에 대하여</h2>
              <p className="text-neutral-700 leading-relaxed mb-4 text-sm sm:text-base">
                {guide?.intro || testInfo.description}
              </p>
              <ul className="list-disc list-inside space-y-1.5 text-sm text-neutral-600">
                {(guide?.howToTake || []).map((item: string, idx: number) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            </div>

            {guide?.resultPreviews && guide.resultPreviews.length > 0 && (
              <div className="pt-6 border-t border-neutral-100">
                <h2 className="text-xl font-bold text-neutral-900 mb-2">🧭 어떤 결과 유형이 나올까요?</h2>
                <p className="text-sm text-neutral-500 mb-4">
                  이 테스트에서는 응답 경향에 따라 아래와 같은 대표 유형 중 하나로 분석됩니다.
                </p>
                <div className="grid sm:grid-cols-2 gap-3">
                  {guide.resultPreviews.map((r: any) => (
                    <div key={r.code} className="p-4 rounded-2xl bg-neutral-50 border border-neutral-100">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xl">{r.emoji}</span>
                        <h3 className="font-bold text-neutral-800 text-sm">{r.title}</h3>
                      </div>
                      {r.subtitle && <p className="text-xs font-medium text-pink-600 mb-1">{r.subtitle}</p>}
                      <p className="text-xs text-neutral-600 leading-relaxed">{r.summary}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {guide?.faqs && guide.faqs.length > 0 && (
              <div className="pt-6 border-t border-neutral-100">
                <h2 className="text-xl font-bold text-neutral-900 mb-4">❓ 자주 묻는 질문</h2>
                <div className="space-y-3">
                  {guide.faqs.map((faq: { q: string; a: string }, idx: number) => (
                    <div key={idx} className="p-4 rounded-2xl bg-neutral-50/80 border border-neutral-100">
                      <h3 className="font-bold text-neutral-800 text-sm mb-1">Q. {faq.q}</h3>
                      <p className="text-sm text-neutral-600 leading-relaxed">{faq.a}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="pt-4 border-t border-neutral-100 flex flex-wrap items-center justify-between gap-2 text-xs text-neutral-500">
              <span>재미와 자기이해를 위한 참고용 테스트이며, 전문적인 심리 평가나 의학적 진단을 대신하지 않습니다.</span>
              <Link href="/blog" className="text-primary font-semibold hover:underline">
                관련 심리 칼럼 읽기 →
              </Link>
            </div>
          </div>
        </section>
      ) : (
        <div className="min-h-screen bg-neutral-50 pt-16 pb-16">
          <div className="bg-white/95 backdrop-blur-md shadow-sm sticky top-16 z-20 border-b border-neutral-100">
            <div className="max-w-2xl mx-auto px-6 py-3.5">
              <div className="flex items-center justify-between text-xs sm:text-sm font-bold text-neutral-600 mb-2">
                <span className="truncate pr-3 text-neutral-800">{testInfo.title}</span>
                <span className="shrink-0">
                  {currentStep + 1} / {qLen} <span className="text-pink-500 ml-1">({progress}%)</span>
                </span>
              </div>
              <div className="w-full bg-neutral-100 rounded-full h-2.5 overflow-hidden">
                <div
                  className={`bg-gradient-to-r ${accentGradient} h-2.5 rounded-full transition-all duration-300`}
                  style={{ width: progress + "%" }}
                />
              </div>
            </div>
          </div>

          <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
            <div
              key={currentStep}
              className="bg-white rounded-[2rem] shadow-xl border border-neutral-100 overflow-hidden animate-fade-in"
            >
              <div className="p-6 sm:p-10">
                <div className="text-center mb-8">
                  <div
                    className={`inline-flex items-center justify-center w-14 h-14 bg-gradient-to-tr ${accentGradient} text-white rounded-2xl text-xl font-black mb-5 shadow-md`}
                  >
                    Q{currentStep + 1}
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold text-neutral-900 leading-snug tracking-tight break-keep">
                    {question?.question || question?.questionText || question?.text || testInfo.title}
                  </h2>
                </div>

                <div className="space-y-3">
                  {question?.options?.map((opt: any, idx: number) => {
                    const text = typeof opt === "string" ? opt : opt.text;
                    const val = typeof opt === "string" ? 1 : (opt.score ?? 1);
                    const optType = typeof opt === "object" ? opt.type : undefined;
                    const isSelected = selectedIdx === idx;
                    return (
                      <button
                        key={idx}
                        type="button"
                        disabled={pending || submitting}
                        onClick={() => handleAnswer(idx, val as number, optType)}
                        className={`w-full p-4 sm:p-5 text-left rounded-2xl border-2 transition-all duration-200 active:scale-[0.99] disabled:cursor-wait flex items-center gap-3.5 ${
                          isSelected
                            ? "border-pink-500 bg-pink-50/80 shadow-md"
                            : "border-neutral-200/80 hover:border-pink-300 hover:bg-pink-50/30 shadow-sm"
                        }`}
                      >
                        <span
                          className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-extrabold shrink-0 transition-colors ${
                            isSelected
                              ? "bg-pink-500 text-white"
                              : "bg-neutral-100 text-neutral-500"
                          }`}
                        >
                          {isSelected ? <Check size={16} strokeWidth={3} /> : LETTERS[idx] || idx + 1}
                        </span>
                        <span className={`text-sm sm:text-base leading-relaxed break-keep ${isSelected ? "font-bold text-neutral-900" : "font-medium text-neutral-700"}`}>
                          {text}
                        </span>
                      </button>
                    );
                  })}
                </div>

                <div className="mt-8 pt-5 border-t border-neutral-100 flex items-center justify-between">
                  {currentStep > 0 ? (
                    <Button
                      type="button"
                      disabled={pending || submitting}
                      onClick={handlePrevious}
                      variant="ghost"
                      className="text-neutral-500 hover:text-pink-600 hover:bg-pink-50 rounded-xl"
                    >
                      <ArrowLeft size={16} className="mr-1.5" /> 이전 문항
                    </Button>
                  ) : (
                    <span />
                  )}
                  <span className="hidden sm:inline text-xs text-neutral-400">
                    숫자키 1~{question?.options?.length || 4}로 빠르게 선택
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
