import type { Metadata } from "next";
import Link from "next/link";
import { notFound, permanentRedirect } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  Briefcase,
  CheckCircle2,
  Heart,
  MessageSquare,
  AlertTriangle,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ShareButtons } from "@/components/ShareButtons";
import { IS_ALL_COMPATIBILITY_INDEXED } from "@/lib/siteConfig";
import {
  CURATED_PAIR_KEYS,
  CURATED_PAIR_MAP,
  getAllCanonicalPairs,
  getCompatibilityReport,
  getCompatibilityTier,
  parsePairSlug,
  toCanonicalPair,
} from "@/lib/customTests/mbtiCompatibility";

export const revalidate = 86400;
export const dynamicParams = true;

export async function generateStaticParams() {
  const keys = IS_ALL_COMPATIBILITY_INDEXED ? getAllCanonicalPairs() : CURATED_PAIR_KEYS;
  return keys.map((pair) => ({ pair }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ pair: string }>;
}): Promise<Metadata> {
  const { pair } = await params;
  const parsed = parsePairSlug(pair);
  if (!parsed) {
    return { title: "궁합 정보를 찾을 수 없습니다", robots: { index: false, follow: false } };
  }

  const report = getCompatibilityReport(parsed.codeA, parsed.codeB);
  const shouldIndex = IS_ALL_COMPATIBILITY_INDEXED || Boolean(CURATED_PAIR_MAP[parsed.canonical]);
  const ogUrl = `/api/og?${new URLSearchParams({
    mode: "compatibility",
    a: report.codeA,
    b: report.codeB,
    score: String(report.score),
    tier: report.tierLabel,
  }).toString()}`;

  return {
    title: `${report.codeA} ${report.codeB} 궁합 (${report.score}점) · 연애·직장·대화법 총정리`,
    description: `${report.codeA}(${report.typeA.title})와 ${report.codeB}(${report.typeB.title})의 궁합 점수는 ${report.score}점(${report.tierLabel})! ${report.headline}. 갈등 포인트와 실전 소통 팁을 확인하세요.`,
    alternates: { canonical: `/compatibility/${parsed.canonical}` },
    robots: { index: shouldIndex, follow: true },
    openGraph: {
      title: `${report.codeA} ✕ ${report.codeB} MBTI 궁합 ${report.score}점 (${report.tierLabel})`,
      description: report.headline,
      type: "article",
      url: `https://mbtifinder.com/compatibility/${parsed.canonical}`,
      images: [{ url: ogUrl, width: 1200, height: 630, alt: `${report.codeA} ${report.codeB} 궁합` }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${report.codeA} ✕ ${report.codeB} MBTI 궁합 ${report.score}점`,
      images: [ogUrl],
    },
  };
}

export default async function CompatibilityDetailPage({
  params,
}: {
  params: Promise<{ pair: string }>;
}) {
  const { pair } = await params;
  const parsed = parsePairSlug(pair);
  if (!parsed) {
    notFound();
  }
  if (parsed.needsRedirect) {
    permanentRedirect(`/compatibility/${parsed.canonical}`);
  }

  const report = getCompatibilityReport(parsed.codeA, parsed.codeB);
  const tierMeta = getCompatibilityTier(report.score);

  // 두 유형 각각의 추천 궁합 관련 링크 (중복 및 현재 쌍 제외)
  const relatedKeys = Array.from(
    new Set([
      ...report.typeA.compatible.map((c) => toCanonicalPair(report.codeA, c)),
      ...report.typeB.compatible.map((c) => toCanonicalPair(report.codeB, c)),
    ])
  )
    .filter((k): k is string => Boolean(k) && k !== report.pairKey)
    .slice(0, 6);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: `${report.codeA}와 ${report.codeB} MBTI 궁합 분석 — 연애, 직장, 갈등 해결 대화법`,
    description: report.headline,
    author: { "@type": "Organization", name: "MBTI Finder 편집팀", url: "https://mbtifinder.com/about" },
    publisher: { "@type": "Organization", name: "MBTI Finder", url: "https://mbtifinder.com" },
    mainEntityOfPage: `https://mbtifinder.com/compatibility/${report.pairKey}`,
    inLanguage: "ko",
  };

  return (
    <div className="min-h-screen bg-neutral-50 pt-24 pb-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="max-w-4xl mx-auto px-6">
        {/* Back Link */}
        <div className="mb-6">
          <Link
            href="/compatibility"
            className="inline-flex items-center text-sm font-medium text-neutral-500 hover:text-primary transition-colors"
          >
            <ArrowLeft size={16} className="mr-1.5" /> MBTI 전체 궁합표로 돌아가기
          </Link>
        </div>

        {/* Hero Summary */}
        <header className="bg-white rounded-3xl border border-neutral-200 shadow-sm p-8 md:p-10 mb-8 text-center">
          <div className="flex items-center justify-center gap-4 md:gap-6 mb-5">
            <Link href={`/type/${report.codeA}`} className="group text-center">
              <div className="w-20 h-20 rounded-full bg-purple-50 border-2 border-purple-100 flex items-center justify-center text-4xl mx-auto mb-2 group-hover:scale-105 transition-transform">
                {report.typeA.emoji}
              </div>
              <div className="font-extrabold text-neutral-900 group-hover:text-primary">{report.codeA}</div>
              <div className="text-xs text-neutral-500">{report.typeA.title}</div>
            </Link>

            <div className="flex flex-col items-center">
              <span className="text-3xl mb-1">{report.tierEmoji}</span>
              <span className="text-2xl font-black text-pink-600">{report.score}점</span>
            </div>

            <Link href={`/type/${report.codeB}`} className="group text-center">
              <div className="w-20 h-20 rounded-full bg-pink-50 border-2 border-pink-100 flex items-center justify-center text-4xl mx-auto mb-2 group-hover:scale-105 transition-transform">
                {report.typeB.emoji}
              </div>
              <div className="font-extrabold text-neutral-900 group-hover:text-pink-600">{report.codeB}</div>
              <div className="text-xs text-neutral-500">{report.typeB.title}</div>
            </Link>
          </div>

          <span className={`inline-block text-xs font-bold px-3.5 py-1 rounded-full border mb-4 ${tierMeta.badgeClass}`}>
            {report.tierEmoji} {report.tierLabel} ({report.temperamentDynamic.groupA} × {report.temperamentDynamic.groupB})
          </span>

          <h1 className="text-2xl md:text-4xl font-extrabold text-neutral-900 mb-3 tracking-tight break-keep">
            {report.codeA} ✕ {report.codeB} 궁합 총정리
          </h1>
          <p className="text-base md:text-lg text-neutral-600 max-w-2xl mx-auto leading-relaxed">
            {report.headline}
          </p>
        </header>

        <article className="space-y-8">
          {/* 핵심 개요 */}
          <section className="bg-white rounded-3xl border border-neutral-200 p-8 shadow-sm space-y-4">
            <h2 className="text-2xl font-bold text-neutral-900">핵심 케미 요약: {report.temperamentDynamic.title}</h2>
            <p className="text-neutral-700 leading-relaxed text-[1.02rem]">{report.overview}</p>
          </section>

          {/* 4가지 지표 정밀 비교 */}
          <section className="bg-white rounded-3xl border border-neutral-200 p-8 shadow-sm">
            <h2 className="text-2xl font-bold text-neutral-900 mb-5">4가지 성격 지표별 정밀 비교</h2>
            <div className="space-y-4">
              {report.axisComparisons.map((ax) => (
                <div key={ax.axisName} className="p-5 rounded-2xl bg-neutral-50 border border-neutral-100">
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                    <h3 className="font-bold text-neutral-900 text-base">{ax.axisName}</h3>
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-md bg-white border border-neutral-200 text-xs font-extrabold text-neutral-800">
                        {report.codeA}: {ax.letterA} / {report.codeB}: {ax.letterB}
                      </span>
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                          ax.isSame ? "bg-emerald-100 text-emerald-700" : "bg-indigo-100 text-indigo-700"
                        }`}
                      >
                        {ax.isSame ? "공통 축" : "보완 축"}
                      </span>
                    </div>
                  </div>
                  <p className="text-sm text-neutral-700 leading-relaxed mb-2">{ax.summary}</p>
                  <p className="text-xs text-neutral-500">
                    <strong className="text-neutral-700">실전 팁:</strong> {ax.tip}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* 심층 대화 비교 카드 (큐레이션 32쌍 전용) */}
          {report.curatedExtra && (
            <section className="bg-white rounded-3xl border border-pink-200/80 p-8 shadow-sm">
              <h2 className="text-2xl font-bold text-neutral-900 mb-2 flex items-center">
                <MessageSquare size={22} className="mr-2 text-pink-500" />
                실전 대화 비교: 갈등이 커지는 말 vs 풀리는 말
              </h2>
              <p className="text-sm text-neutral-500 mb-6">
                {report.codeA}와 {report.codeB} 사이에서 가장 자주 발생하는 오해 장면을 대화 예시로 비교했습니다.
              </p>

              <div className="grid md:grid-cols-2 gap-5">
                <div className="rounded-2xl bg-red-50/70 border border-red-200/70 p-5 space-y-3">
                  <div className="text-xs font-bold text-red-600 uppercase">❌ 갈등이 커지는 대화</div>
                  <div className="bg-white rounded-xl p-3.5 text-sm text-neutral-700 border border-red-100">
                    <span className="font-bold text-neutral-900 mr-1.5">{report.codeA}:</span>
                    &ldquo;{report.curatedExtra.dialogueBad.speakerA}&rdquo;
                  </div>
                  <div className="bg-white rounded-xl p-3.5 text-sm text-neutral-700 border border-red-100">
                    <span className="font-bold text-neutral-900 mr-1.5">{report.codeB}:</span>
                    &ldquo;{report.curatedExtra.dialogueBad.speakerB}&rdquo;
                  </div>
                </div>

                <div className="rounded-2xl bg-emerald-50/70 border border-emerald-200/70 p-5 space-y-3">
                  <div className="text-xs font-bold text-emerald-700 uppercase">✅ 서로 이해하는 대화</div>
                  <div className="bg-white rounded-xl p-3.5 text-sm text-neutral-700 border border-emerald-100">
                    <span className="font-bold text-neutral-900 mr-1.5">{report.codeA}:</span>
                    &ldquo;{report.curatedExtra.dialogueGood.speakerA}&rdquo;
                  </div>
                  <div className="bg-white rounded-xl p-3.5 text-sm text-neutral-700 border border-emerald-100">
                    <span className="font-bold text-neutral-900 mr-1.5">{report.codeB}:</span>
                    &ldquo;{report.curatedExtra.dialogueGood.speakerB}&rdquo;
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* 연애 & 직장 궁합 */}
          <section className="grid md:grid-cols-2 gap-6">
            <div className="bg-white rounded-3xl border border-neutral-200 p-7 shadow-sm">
              <h2 className="text-xl font-bold text-neutral-900 mb-3 flex items-center">
                <Heart size={20} className="mr-2 text-rose-500" /> 연애·커플 궁합
              </h2>
              <p className="text-sm text-neutral-700 leading-relaxed">{report.loveGuide}</p>
            </div>

            <div className="bg-white rounded-3xl border border-neutral-200 p-7 shadow-sm">
              <h2 className="text-xl font-bold text-neutral-900 mb-3 flex items-center">
                <Briefcase size={20} className="mr-2 text-indigo-500" /> 직장·협업 궁합
              </h2>
              <p className="text-sm text-neutral-700 leading-relaxed">{report.workGuide}</p>
            </div>
          </section>

          {/* 갈등 포인트 & 오래가는 실천 팁 */}
          <section className="grid md:grid-cols-2 gap-6">
            <div className="bg-white rounded-3xl border border-amber-100 p-7 shadow-sm">
              <h2 className="text-xl font-bold text-amber-700 mb-4 flex items-center">
                <AlertTriangle size={20} className="mr-2" /> 주의할 갈등 포인트
              </h2>
              <ul className="space-y-2.5 text-sm text-neutral-700">
                {report.conflictPoints.map((pt, i) => (
                  <li key={i} className="p-3.5 rounded-xl bg-amber-50/60 leading-relaxed">
                    • {pt}
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-white rounded-3xl border border-emerald-100 p-7 shadow-sm">
              <h2 className="text-xl font-bold text-emerald-700 mb-4 flex items-center">
                <CheckCircle2 size={20} className="mr-2" /> 관계가 오래가는 실천 팁
              </h2>
              <ul className="space-y-2.5 text-sm text-neutral-700">
                {report.practicalTips.map((tip, i) => (
                  <li key={i} className="p-3.5 rounded-xl bg-emerald-50/60 leading-relaxed">
                    ✓ {tip}
                  </li>
                ))}
              </ul>
            </div>
          </section>

          {/* FAQ */}
          <section className="bg-white rounded-3xl border border-neutral-200 p-8 shadow-sm">
            <h2 className="text-2xl font-bold text-neutral-900 mb-5">자주 묻는 질문 (FAQ)</h2>
            <div className="space-y-4">
              {report.faqs.map((faq, idx) => (
                <div key={idx} className="p-4 rounded-2xl bg-neutral-50 border border-neutral-100">
                  <h3 className="font-bold text-neutral-900 text-sm mb-1.5">Q. {faq.q}</h3>
                  <p className="text-sm text-neutral-600 leading-relaxed">{faq.a}</p>
                </div>
              ))}
            </div>
          </section>

          {/* 궁합 결과 공유 버튼 */}
          <ShareButtons
            title={`${report.codeA} ✕ ${report.codeB} MBTI 궁합 (${report.score}점)`}
            shareText={`${report.codeA}와 ${report.codeB} 궁합은 ${report.score}점(${report.tierLabel})! ${report.headline} 👉`}
            url={`https://mbtifinder.com/compatibility/${report.pairKey}`}
          />

          {/* 각 유형 상세 가이드 & 검사 CTA */}
          <section className="bg-gradient-to-br from-neutral-900 to-neutral-800 text-white rounded-3xl p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div>
              <div className="inline-flex items-center text-xs font-bold text-pink-300 mb-2">
                <Sparkles size={14} className="mr-1.5" /> 무료 60문항 MBTI 검사
              </div>
              <h2 className="text-2xl font-bold mb-1">내 진짜 MBTI가 궁금하다면?</h2>
              <p className="text-sm text-neutral-300">
                {report.codeA}·{report.codeB} 각각의 유형 백과도 함께 비교해 보세요.
              </p>
            </div>
            <div className="flex flex-wrap gap-2 shrink-0">
              <Link href="/test">
                <Button className="bg-white text-neutral-900 hover:bg-neutral-100 rounded-full px-6 font-bold">
                  MBTI 검사 <ArrowRight size={15} className="ml-1" />
                </Button>
              </Link>
              <Link href={`/type/${report.codeA}`}>
                <Button variant="outline" className="bg-transparent border-white/40 text-white hover:bg-white/10 rounded-full">
                  {report.codeA} 백과
                </Button>
              </Link>
              {report.codeA !== report.codeB && (
                <Link href={`/type/${report.codeB}`}>
                  <Button variant="outline" className="bg-transparent border-white/40 text-white hover:bg-white/10 rounded-full">
                    {report.codeB} 백과
                  </Button>
                </Link>
              )}
            </div>
          </section>

          {/* 관련 추천 궁합 */}
          {relatedKeys.length > 0 && (
            <section className="bg-white rounded-3xl border border-neutral-200 p-7 shadow-sm">
              <h2 className="text-lg font-bold text-neutral-900 mb-4">
                {report.codeA} · {report.codeB}와 함께 많이 보는 궁합
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {relatedKeys.map((k) => {
                  const [x, y] = k.split("-") as any;
                  const rel = getCompatibilityReport(x, y);
                  return (
                    <Link
                      key={k}
                      href={`/compatibility/${k}`}
                      className="p-3.5 rounded-xl bg-neutral-50 border border-neutral-200 hover:border-pink-300 hover:bg-white transition-all flex items-center justify-between text-sm font-bold text-neutral-800"
                    >
                      <span>{rel.codeA} ✕ {rel.codeB}</span>
                      <span className="text-xs text-pink-600">{rel.score}점</span>
                    </Link>
                  );
                })}
              </div>
            </section>
          )}
        </article>
      </div>
    </div>
  );
}
