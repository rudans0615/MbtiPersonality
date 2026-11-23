import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import CompatibilityHubClient from "./CompatibilityHubClient";
import {
  CURATED_PAIR_KEYS,
  getCompatibilityReport,
  getCompatibilityTier,
} from "@/lib/customTests/mbtiCompatibility";

export const revalidate = 86400;

export const metadata: Metadata = {
  title: "MBTI 궁합표 & 136쌍 연애·직장 궁합 백과",
  description:
    "16×16 MBTI 전체 궁합표와 136가지 모든 성격유형 조합 분석! 나와 상대의 연애 궁합 점수, 갈등 포인트, 맞춤 대화법을 무료로 확인하세요.",
  alternates: { canonical: "/compatibility" },
};

export default function CompatibilityHubPage() {
  const curatedReports = CURATED_PAIR_KEYS.map((key) => {
    const [a, b] = key.split("-") as any;
    return getCompatibilityReport(a, b);
  });

  const bestPairs = curatedReports.filter((r) => r.score >= 88).slice(0, 12);
  const allCurated = curatedReports;

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Header */}
      <section className="gradient-bg text-white pt-28 pb-16">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 text-sm font-semibold mb-4">
            <Sparkles size={15} /> MBTI 136가지 조합 완벽 분석
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 tracking-tight">
            MBTI 궁합표 &amp; 연애·직장 궁합 백과
          </h1>
          <p className="text-lg md:text-xl opacity-90 max-w-2xl mx-auto leading-relaxed">
            내 유형과 상대 유형을 선택해 4가지 지표 차이, 갈등 원인, 실전 대화법까지 한눈에 확인해보세요.
          </p>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-6 py-12 space-y-16">
        {/* 인터랙티브 계산기 + 16x16 매트릭스 */}
        <CompatibilityHubClient />

        {/* 인기 최고 궁합 하이라이트 */}
        <section>
          <div className="mb-6">
            <h2 className="text-2xl md:text-3xl font-extrabold text-neutral-900">
              💖 많이 찾는 인기 MBTI 궁합 TOP
            </h2>
            <p className="text-neutral-600 text-sm mt-1">
              실전 대화 예시와 갈등 해결 골든룰까지 심층 정리된 대표 조합입니다.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {bestPairs.map((r) => {
              const tier = getCompatibilityTier(r.score);
              return (
                <Link
                  key={r.pairKey}
                  href={`/compatibility/${r.pairKey}`}
                  className="bg-white rounded-2xl border border-neutral-200 p-5 hover:border-pink-300 hover:shadow-lg transition-all flex flex-col group"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-1.5 text-xl">
                      <span>{r.typeA.emoji}</span>
                      <span className="text-xs text-neutral-400">✕</span>
                      <span>{r.typeB.emoji}</span>
                    </div>
                    <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${tier.badgeClass}`}>
                      {r.score}점 · {r.tierLabel}
                    </span>
                  </div>
                  <h3 className="text-lg font-extrabold text-neutral-900 group-hover:text-pink-600 transition-colors mb-1">
                    {r.codeA} ✕ {r.codeB} 궁합
                  </h3>
                  <p className="text-xs font-semibold text-neutral-500 mb-2">
                    {r.typeA.title} × {r.typeB.title}
                  </p>
                  <p className="text-sm text-neutral-600 line-clamp-2 leading-relaxed mb-4 flex-1">
                    {r.headline}
                  </p>
                  <span className="text-xs font-semibold text-pink-600 inline-flex items-center mt-auto">
                    대화법·상세 해설 보기 <ArrowRight size={14} className="ml-1 group-hover:translate-x-1 transition-transform" />
                  </span>
                </Link>
              );
            })}
          </div>
        </section>

        {/* 전체 심층 큐레이션 32쌍 빠른 인덱스 */}
        <section className="bg-white rounded-3xl border border-neutral-200 p-8 shadow-sm">
          <h2 className="text-2xl font-bold text-neutral-900 mb-2">심층 대화 가이드 제공 조합 ({allCurated.length}쌍)</h2>
          <p className="text-sm text-neutral-500 mb-6">
            연애·직장·갈등 대화 예시가 포함된 대표 인기 조합 목록입니다. 그 외 조합은 위 16×16 궁합표에서 모두 조회할 수 있습니다.
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {allCurated.map((r) => (
              <Link
                key={r.pairKey}
                href={`/compatibility/${r.pairKey}`}
                className="p-3 rounded-xl bg-neutral-50 border border-neutral-200 hover:border-primary hover:bg-white transition-all flex items-center justify-between text-xs font-bold text-neutral-800"
              >
                <span>{r.codeA} ✕ {r.codeB}</span>
                <span className="text-pink-600">{r.score}점</span>
              </Link>
            ))}
          </div>
        </section>

        {/* MBTI 궁합 읽는 법 (정보 가치 보강) */}
        <section className="bg-white rounded-3xl border border-neutral-200 p-8 space-y-4 text-neutral-700 leading-relaxed">
          <h2 className="text-2xl font-bold text-neutral-900">MBTI 궁합표, 어떻게 해석해야 정확할까요?</h2>
          <p className="text-sm">
            MBTI 궁합 점수는 '운명적으로 맞다/안 맞다'를 가르는 절대 기준이 아니라, 두 사람이 처음 만났을 때{" "}
            <strong>노력 없이도 자연스럽게 통하는 부분과 의식적인 조율이 필요한 지점</strong>을 미리 파악하기 위한 지도입니다.
          </p>
          <ul className="list-disc list-inside text-sm space-y-1.5 text-neutral-600">
            <li><strong>감각(S)·직관(N) 축이 같으면</strong> 대화 주제가 자연스럽게 이어져 초반 친밀감이 빠르게 높아집니다.</li>
            <li><strong>사고(T)·감정(F) 축이 다르면</strong> 갈등 시 해결책 우선(T) vs 공감 우선(F)의 순서만 합의해도 오해의 80%가 사라집니다.</li>
            <li><strong>판단(J)·인식(P) 축이 다르면</strong> 일정·여행에서 '고정 약속'과 '자유 시간'을 분리해 분담할 때 시너지가 커집니다.</li>
          </ul>
          <div className="pt-4 flex flex-wrap gap-3">
            <Link href="/test">
              <Button className="bg-neutral-900 text-white hover:bg-neutral-800 rounded-full px-6">
                내 MBTI 먼저 검사하기 →
              </Button>
            </Link>
            <Link href="/type">
              <Button variant="outline" className="rounded-full px-6">
                16유형 백과 보기
              </Button>
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
