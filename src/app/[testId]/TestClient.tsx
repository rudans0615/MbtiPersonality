"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useAnswerTransition } from "@/hooks/useAnswerTransition";
import { ArrowLeft } from "lucide-react";

export default function TestClient({ testId, testInfo, questions, guide }: any) {
  const router = useRouter();
  const [hasStarted, setHasStarted] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [scoreHistory, setScoreHistory] = useState<number[]>([]);
  const [typeHistory, setTypeHistory] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const { pending, advance } = useAnswerTransition(currentStep);

  // 유형 기반 테스트 자동 감지: 옵션에 type 필드가 있고 score 필드가 없으면 유형 기반
  const isTypeBased =
    questions[0]?.options?.[0]?.type !== undefined &&
    questions[0]?.options?.[0]?.score === undefined;

  const qLen = questions.length;

  const handleStart = () => {
    setHasStarted(true);
    if (typeof window !== "undefined" && (window as any).gtag) {
      (window as any).gtag("event", "test_started", {
        test_id: testId,
        options_count: questions[0]?.options?.length || 2,
        questions_count: qLen,
      });
    }
  };

  const handleAnswer = (points: number, optType?: string) => {
    if (submitting) return;
    advance(() => {
      const newScoreHistory = [...scoreHistory.slice(0, currentStep), points];
      setScoreHistory(newScoreHistory);

      const newTypeHistory = [...typeHistory.slice(0, currentStep), optType || ""];
      setTypeHistory(newTypeHistory);

      if (currentStep < qLen - 1) {
        setCurrentStep((curr) => curr + 1);
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

  return (
    <>
      {!hasStarted ? (
        <section className="flex-grow max-w-3xl mx-auto w-full px-4 pt-28 pb-24 flex flex-col items-center">
          <div className="bg-white/95 backdrop-blur-sm rounded-[2rem] p-8 md:p-12 shadow-xl border border-neutral-100 flex-col justify-center text-center w-full mb-8">
            <div className="text-6xl mb-6">{testInfo.emoji || "✨"}</div>
            <h1 className="text-3xl md:text-5xl font-extrabold mb-4 tracking-tight text-neutral-900">
              {testInfo.title}
            </h1>
            <p className="text-lg md:text-xl text-neutral-500 mb-6 leading-relaxed">
              {testInfo.subtitle || testInfo.description || ""}
            </p>
            <div className="flex items-center justify-center gap-4 text-sm text-neutral-500 mb-8">
              <span className="px-3 py-1 rounded-full bg-neutral-100">총 {qLen}문항</span>
              <span className="px-3 py-1 rounded-full bg-neutral-100">약 {testInfo.duration || "2~3분"} 소요</span>
            </div>
            <Button
              onClick={handleStart}
              size="lg"
              className="w-full md:w-auto h-16 text-xl rounded-full px-16 bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-400 hover:from-pink-500 hover:via-purple-500 hover:to-indigo-500 text-white shadow-xl hover:shadow-2xl transition-all border-2 border-white/50"
            >
              지금 바로 알아보기 👉
            </Button>
          </div>

          {/* 상세 테스트 소개 및 해석 가이드 */}
          <div className="bg-white rounded-3xl border border-neutral-200/80 p-8 text-left w-full space-y-8 shadow-sm">
            <div>
              <h2 className="text-xl font-bold text-neutral-900 mb-3">💡 이 테스트에 대하여</h2>
              <p className="text-neutral-700 leading-relaxed mb-4">
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
        <>
          <div className="bg-white/80 backdrop-blur-md shadow-sm sticky top-16 mt-16 z-20">
            <div className="max-w-2xl mx-auto px-6 py-4">
              <div className="w-full bg-pink-100 rounded-full h-2.5">
                <div
                  className="bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-400 h-2.5 rounded-full transition-all duration-500"
                  style={{ width: progress + "%" }}
                ></div>
              </div>
              <p className="text-sm font-semibold tracking-wider text-pink-500 mt-3 text-center">
                {currentStep + 1} / {qLen}
              </p>
            </div>
          </div>

          <div className="max-w-2xl mx-auto px-6 py-12">
            <div className="bg-white/90 backdrop-blur-sm rounded-[2rem] shadow-xl border border-white/60 overflow-hidden relative">
              <div className="p-8 md:p-10 relative z-10">
                <div className="text-center mb-10">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-tr from-pink-300 via-purple-300 to-indigo-300 text-white rounded-full text-2xl font-black mb-6 shadow-md">
                    Q{currentStep + 1}
                  </div>
                  <h2 className="text-2xl md:text-[1.7rem] font-bold text-neutral-800 leading-snug tracking-tight break-keep">
                    {question?.question || question?.questionText || question?.text || testInfo.title}
                  </h2>
                </div>
                <div className="space-y-4">
                  {question?.options?.map((opt: any, idx: number) => {
                    const text = typeof opt === "string" ? opt : opt.text;
                    const val = typeof opt === "string" ? 1 : (opt.score ?? 1);
                    const optType = typeof opt === "object" ? opt.type : undefined;
                    return (
                      <button
                        key={idx}
                        disabled={pending || submitting}
                        onClick={() => handleAnswer(val as number, optType)}
                        className="w-full p-5 text-left rounded-2xl border-2 border-neutral-100 hover:border-pink-200 hover:bg-pink-50/30 shadow-sm transition-all duration-300 transform hover:-translate-y-1 disabled:cursor-wait"
                      >
                        <div className="font-medium text-neutral-700 text-[1.05rem] leading-relaxed">{text}</div>
                      </button>
                    );
                  })}
                </div>
                {currentStep > 0 && (
                  <div className="mt-10 pt-6 border-t border-neutral-100 flex justify-center">
                    <Button
                      disabled={pending || submitting}
                      onClick={handlePrevious}
                      variant="ghost"
                      className="text-neutral-400 hover:text-pink-500 hover:bg-pink-50 transition-all font-semibold rounded-xl px-6 py-6"
                    >
                      <ArrowLeft size={18} className="mr-2" /> 선택 다시하기
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
