"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Heart } from "lucide-react";
import {
  MBTI_CODES,
  type MBTICode,
  toCanonicalPair,
  computeCompatibilityScore,
  getCompatibilityTier,
} from "@/lib/customTests/mbtiCompatibility";
import { mbtiTypes } from "@/lib/customTests/mbtiTypes";

export default function CompatibilityHubClient() {
  const router = useRouter();
  const [myType, setMyType] = useState<MBTICode>("INFP");
  const [partnerType, setPartnerType] = useState<MBTICode>("ENFJ");
  const [highlightType, setHighlightType] = useState<MBTICode | null>(null);

  const previewScore = computeCompatibilityScore(myType, partnerType);
  const previewTier = getCompatibilityTier(previewScore);
  const canonicalPair = toCanonicalPair(myType, partnerType)!;

  const handleGo = () => {
    router.push(`/compatibility/${canonicalPair}`);
  };

  return (
    <div className="space-y-14">
      {/* 인터랙티브 궁합 선택기 */}
      <section className="bg-white rounded-3xl border border-neutral-200 shadow-lg p-6 md:p-10">
        <div className="text-center mb-8">
          <span className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full bg-rose-50 text-rose-600 border border-rose-200 mb-3">
            <Heart size={13} /> 136가지 모든 MBTI 조합 즉시 분석
          </span>
          <h2 className="text-2xl md:text-3xl font-extrabold text-neutral-900">
            나와 상대의 MBTI 궁합 바로 보기
          </h2>
          <p className="text-sm text-neutral-500 mt-2">
            두 가지 성격유형을 고르면 연애·직장 궁합 점수와 맞춤 대화법 리포트로 이동합니다.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* 내 유형 */}
          <div className="bg-neutral-50 rounded-2xl p-5 border border-neutral-200/80">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-bold text-neutral-700">1. 나의 MBTI</span>
              <span className="text-sm font-extrabold text-primary">
                {mbtiTypes[myType].emoji} {myType} ({mbtiTypes[myType].title})
              </span>
            </div>
            <div className="grid grid-cols-4 gap-2">
              {MBTI_CODES.map((code) => (
                <button
                  key={code}
                  type="button"
                  onClick={() => setMyType(code)}
                  className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                    myType === code
                      ? "bg-neutral-900 text-white border-neutral-900 shadow-sm"
                      : "bg-white text-neutral-700 border-neutral-200 hover:border-primary"
                  }`}
                >
                  {code}
                </button>
              ))}
            </div>
          </div>

          {/* 상대 유형 */}
          <div className="bg-neutral-50 rounded-2xl p-5 border border-neutral-200/80">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-bold text-neutral-700">2. 상대의 MBTI</span>
              <span className="text-sm font-extrabold text-pink-600">
                {mbtiTypes[partnerType].emoji} {partnerType} ({mbtiTypes[partnerType].title})
              </span>
            </div>
            <div className="grid grid-cols-4 gap-2">
              {MBTI_CODES.map((code) => (
                <button
                  key={code}
                  type="button"
                  onClick={() => setPartnerType(code)}
                  className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                    partnerType === code
                      ? "bg-pink-600 text-white border-pink-600 shadow-sm"
                      : "bg-white text-neutral-700 border-neutral-200 hover:border-pink-400"
                  }`}
                >
                  {code}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 실시간 요약 바 & 상세 리포트 버튼 */}
        <div className="bg-gradient-to-r from-rose-50 via-purple-50 to-indigo-50 rounded-2xl border border-pink-100 p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="text-3xl">{previewTier.emoji}</div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-lg font-extrabold text-neutral-900">
                  {myType} ✕ {partnerType}
                </span>
                <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${previewTier.badgeClass}`}>
                  {previewScore}점 · {previewTier.label}
                </span>
              </div>
              <p className="text-xs text-neutral-600 mt-1">
                4가지 지표 비교, 연애·직장 궁합, 갈등 해결 대화법까지 상세 리포트로 확인하세요.
              </p>
            </div>
          </div>
          <Button
            onClick={handleGo}
            size="lg"
            className="w-full sm:w-auto rounded-full px-7 bg-neutral-900 hover:bg-neutral-800 text-white font-bold shrink-0"
          >
            상세 궁합 분석 보기 <ArrowRight size={16} className="ml-1.5" />
          </Button>
        </div>
      </section>

      {/* 16x16 전체 MBTI 궁합표 매트릭스 */}
      <section className="bg-white rounded-3xl border border-neutral-200 shadow-sm p-6 md:p-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
          <div>
            <h2 className="text-2xl font-extrabold text-neutral-900">16×16 MBTI 전체 궁합표</h2>
            <p className="text-sm text-neutral-500 mt-1">
              원하는 칸을 클릭하면 해당 조합의 상세 궁합 해설 페이지로 바로 이동합니다.
            </p>
          </div>
          <div className="flex flex-wrap gap-2 text-xs font-semibold">
            <span className="px-2.5 py-1 rounded-lg bg-rose-100 text-rose-700">💖 90+ 최고</span>
            <span className="px-2.5 py-1 rounded-lg bg-emerald-100 text-emerald-700">✨ 80+ 좋음</span>
            <span className="px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700">🤝 70+ 무난</span>
            <span className="px-2.5 py-1 rounded-lg bg-amber-50 text-amber-700">🌱 노력형</span>
          </div>
        </div>

        {/* 행 하이라이트 필터 */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          <button
            type="button"
            onClick={() => setHighlightType(null)}
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold border ${
              highlightType === null
                ? "bg-neutral-900 text-white border-neutral-900"
                : "bg-neutral-50 text-neutral-600 border-neutral-200"
            }`}
          >
            전체 강조 해제
          </button>
          {MBTI_CODES.map((code) => (
            <button
              key={code}
              type="button"
              onClick={() => setHighlightType(highlightType === code ? null : code)}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold border ${
                highlightType === code
                  ? "bg-pink-600 text-white border-pink-600"
                  : "bg-neutral-50 text-neutral-600 border-neutral-200 hover:border-pink-300"
              }`}
            >
              {code}
            </button>
          ))}
        </div>

        <div className="overflow-x-auto pb-2">
          <table className="w-full border-collapse text-center text-xs min-w-[760px]">
            <thead>
              <tr>
                <th className="p-2 bg-neutral-100 border border-neutral-200 font-bold text-neutral-600 sticky left-0 z-10">
                  MBTI
                </th>
                {MBTI_CODES.map((col) => (
                  <th
                    key={col}
                    className={`p-2 border border-neutral-200 font-extrabold ${
                      highlightType === col ? "bg-pink-600 text-white" : "bg-neutral-50 text-neutral-800"
                    }`}
                  >
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {MBTI_CODES.map((row) => (
                <tr key={row}>
                  <th
                    className={`p-2 border border-neutral-200 font-extrabold sticky left-0 z-10 ${
                      highlightType === row ? "bg-pink-600 text-white" : "bg-neutral-50 text-neutral-800"
                    }`}
                  >
                    {row}
                  </th>
                  {MBTI_CODES.map((col) => {
                    const score = computeCompatibilityScore(row, col);
                    const tier = getCompatibilityTier(score);
                    const pair = toCanonicalPair(row, col)!;
                    const dimmed =
                      highlightType !== null && highlightType !== row && highlightType !== col;
                    return (
                      <td
                        key={`${row}-${col}`}
                        className={`p-0 border border-neutral-200 transition-opacity ${
                          dimmed ? "opacity-25" : "opacity-100"
                        }`}
                      >
                        <Link
                          href={`/compatibility/${pair}`}
                          title={`${row} × ${col}: ${score}점 (${tier.label})`}
                          className={`block py-2 px-1 font-bold transition-colors ${tier.cellClass}`}
                        >
                          {score}
                        </Link>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
