"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import { useMBTITest } from "@/hooks/useMBTITest";
import ProgressBar from "@/components/ProgressBar";
import QuestionCard from "@/components/QuestionCard";
import { MBTI_CODES, toCanonicalPair, type MBTICode } from "@/lib/customTests/mbtiCompatibility";
import { mbtiTypes } from "@/lib/customTests/mbtiTypes";

interface TestClientProps {
  inviteFrom?: MBTICode;
  inviteName?: string;
}

export default function TestClient({ inviteFrom, inviteName }: TestClientProps) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [showQuickCompare, setShowQuickCompare] = useState(false);

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
        if (inviteFrom) {
          sessionStorage.setItem(
            "mbtiInvite",
            JSON.stringify({ from: inviteFrom, name: inviteName || "" })
          );
          const qs = new URLSearchParams({ from: inviteFrom });
          if (inviteName) qs.set("name", inviteName);
          router.push(`/results?${qs.toString()}`);
        } else {
          sessionStorage.removeItem("mbtiInvite");
          router.push("/results");
        }
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

  const inviterLabel = inviteFrom
    ? inviteName
      ? `${inviteName}(${inviteFrom})`
      : `${inviteFrom}(${mbtiTypes[inviteFrom].title})`
    : "";

  const progressPct = Math.round(((currentQuestion + 1) / totalQuestions) * 100);
  const milestoneText =
    progressPct >= 85
      ? "거의 다 왔어요! 🔥"
      : progressPct >= 50
      ? "절반 돌파! 👍"
      : progressPct >= 25
      ? "순항 중 ✨"
      : "";

  return (
    <div className="min-h-screen bg-neutral-50 pt-16">
      {/* 2인 궁합 초대 배너 */}
      {inviteFrom && (
        <div className="bg-gradient-to-r from-rose-500 via-pink-500 to-purple-500 text-white">
          <div className="max-w-4xl mx-auto px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="text-sm md:text-base font-medium text-center sm:text-left">
              💌 <strong>{inviterLabel}</strong>님이 2인 MBTI 궁합 비교에 초대했어요! 검사를 끝내면 둘의 궁합 리포트가 바로 열립니다.
            </div>
            <button
              type="button"
              onClick={() => setShowQuickCompare((prev) => !prev)}
              className="text-xs font-bold bg-white/20 hover:bg-white/30 px-3.5 py-1.5 rounded-full shrink-0 transition-colors"
            >
              {showQuickCompare ? "닫기" : "이미 내 MBTI 알아요 → 바로 비교"}
            </button>
          </div>

          {showQuickCompare && (
            <div className="bg-white/95 text-neutral-800 border-b border-pink-100">
              <div className="max-w-4xl mx-auto px-6 py-4">
                <p className="text-xs font-bold text-neutral-600 mb-2.5">
                  내 MBTI를 선택하면 {inviterLabel}님과의 궁합 페이지로 바로 이동합니다:
                </p>
                <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
                  {MBTI_CODES.map((code) => {
                    const pair = toCanonicalPair(inviteFrom, code)!;
                    return (
                      <Link
                        key={code}
                        href={`/compatibility/${pair}`}
                        className="text-center py-1.5 rounded-lg bg-pink-50 hover:bg-pink-600 hover:text-white text-xs font-extrabold text-pink-700 border border-pink-200 transition-colors"
                      >
                        {code}
                      </Link>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Progress Header */}
      <div className="bg-white/95 backdrop-blur-md shadow-sm sticky top-16 z-20 border-b border-neutral-100">
        <div className="max-w-3xl mx-auto px-6 py-3.5">
          <div className="flex items-center justify-between mb-2.5">
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-lg font-bold text-neutral-800">MBTI 성격유형 검사</h1>
              {milestoneText && (
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-600">
                  {milestoneText}
                </span>
              )}
            </div>
            <span className="text-xs sm:text-sm font-bold text-neutral-600">
              {currentQuestion + 1} / {totalQuestions} <span className="text-primary ml-1">({progressPct}%)</span>
            </span>
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

        {/* 검사 안내 및 해석 가이드 */}
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
