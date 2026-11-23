import type { Metadata } from "next";
import Link from "next/link";
import { notFound, permanentRedirect } from "next/navigation";
import { mbtiTypes } from "@/lib/customTests/mbtiTypes";
import { toCanonicalPair } from "@/lib/customTests/mbtiCompatibility";
import { getBlogPosts } from "@/lib/queries";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, Briefcase, Heart, Lightbulb, Sparkles, CheckCircle2, AlertCircle } from "lucide-react";

export const revalidate = 86400;

const ALL_CODES = Object.keys(mbtiTypes);

const AXIS_INFO: Record<string, { label: string; desc: string }> = {
  E: { label: "외향 (Extraversion)", desc: "외부 세계와의 교류, 대화, 적극적인 활동을 통해 에너지를 충전합니다." },
  I: { label: "내향 (Introversion)", desc: "혼자만의 깊은 사색과 조용한 집중의 시간을 통해 내면의 에너지를 회복합니다." },
  S: { label: "감각 (Sensing)", desc: "실제 경험과 눈앞의 구체적인 사실, 실용적인 디테일을 바탕으로 세상을 이해합니다." },
  N: { label: "직관 (Intuition)", desc: "현상 이면의 의미와 전체 패턴, 아직 실현되지 않은 미래의 가능성에 주목합니다." },
  T: { label: "사고 (Thinking)", desc: "상황을 객관적으로 분석하고 논리적 일관성과 공정한 기준을 중심으로 판단합니다." },
  F: { label: "감정 (Feeling)", desc: "관계의 조화와 타인의 감정, 개인이 소중히 여기는 가치를 중심으로 판단합니다." },
  J: { label: "판단 (Judging)", desc: "명확한 목표와 계획을 세워 체계적으로 진행하고 마무리하는 과정에서 안정감을 느낍니다." },
  P: { label: "인식 (Perceiving)", desc: "열린 가능성을 유지하며 변화하는 상황에 유연하고 즉흥적으로 대응하는 편을 선호합니다." },
};

export async function generateStaticParams() {
  return ALL_CODES.map((code) => ({ code }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ code: string }>;
}): Promise<Metadata> {
  const { code } = await params;
  const upper = code.toUpperCase();
  const data = mbtiTypes[upper];
  if (!data) {
    return { title: "유형을 찾을 수 없습니다", robots: { index: false, follow: false } };
  }

  const ogUrl = `/api/og?${new URLSearchParams({
    mode: "result",
    testTitle: "MBTI 16가지 성격유형 백과",
    resultTitle: `${data.code} · ${data.title}`,
    subtitle: data.subtitle,
  }).toString()}`;

  return {
    title: `${data.code} (${data.title}) 특징·연애·직장·궁합 총정리`,
    description: `${data.code} ${data.title} — ${data.subtitle}. 강점과 약점, 연애 스타일, 직장 생활, 추천 직업, 잘 맞는 궁합 유형과 성장 조언을 확인하세요.`,
    alternates: { canonical: `/type/${upper}` },
    openGraph: {
      title: `${data.code} (${data.title}) 성격유형 완벽 가이드 | MBTI Finder`,
      description: data.subtitle,
      type: "article",
      url: `https://mbtifinder.com/type/${upper}`,
      images: [{ url: ogUrl, width: 1200, height: 630, alt: `${data.code} ${data.title}` }],
    },
    twitter: {
      card: "summary_large_image",
      images: [ogUrl],
    },
  };
}

export default async function MbtiTypeDetailPage({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code } = await params;
  const upper = code.toUpperCase();
  const data = mbtiTypes[upper];

  if (!data) {
    notFound();
  }
  if (code !== upper) {
    permanentRedirect(`/type/${upper}`);
  }

  const allPosts = await getBlogPosts().catch(() => []);
  const matchingPosts = allPosts
    .filter((p) => (p.title || "").includes(upper) || (p.content || "").includes(upper))
    .slice(0, 3);
  const displayPosts = matchingPosts.length > 0 ? matchingPosts : allPosts.slice(0, 3);

  const letters = upper.split("");

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: `${data.code} (${data.title}) 성격유형 특징, 연애, 직장, 궁합 가이드`,
    description: data.subtitle,
    author: { "@type": "Organization", name: "MBTI Finder 편집팀", url: "https://mbtifinder.com/about" },
    publisher: { "@type": "Organization", name: "MBTI Finder", url: "https://mbtifinder.com" },
    mainEntityOfPage: `https://mbtifinder.com/type/${upper}`,
    inLanguage: "ko",
  };

  return (
    <div className="min-h-screen bg-neutral-50 pt-24 pb-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="max-w-4xl mx-auto px-6">
        {/* Breadcrumb */}
        <div className="mb-6">
          <Link
            href="/type"
            className="inline-flex items-center text-sm font-medium text-neutral-500 hover:text-primary transition-colors"
          >
            <ArrowLeft size={16} className="mr-1.5" /> 16가지 MBTI 유형 백과로 돌아가기
          </Link>
        </div>

        {/* Hero Card */}
        <header className="bg-white rounded-3xl border border-neutral-200 shadow-sm p-8 md:p-10 mb-8 text-center">
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-pink-100 via-purple-100 to-indigo-100 text-5xl mb-5 shadow-inner">
            {data.emoji}
          </div>
          <div className="text-sm font-bold tracking-widest text-primary uppercase mb-2">
            MBTI 성격유형 가이드
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold text-neutral-900 mb-3 tracking-tight">
            {data.code} · {data.title}
          </h1>
          <p className="text-lg md:text-xl text-neutral-600 max-w-2xl mx-auto leading-relaxed">
            {data.subtitle}
          </p>
        </header>

        <article className="space-y-8">
          {/* 핵심 개요 */}
          <section className="bg-white rounded-3xl border border-neutral-200 p-8 shadow-sm">
            <h2 className="text-2xl font-bold text-neutral-900 mb-4">{data.code} 성격 특징 요약</h2>
            <div className="space-y-4 text-neutral-700 leading-relaxed text-[1.02rem] whitespace-pre-line">
              {data.description}
            </div>
          </section>

          {/* 4가지 지표 구성 해석 */}
          <section className="bg-white rounded-3xl border border-neutral-200 p-8 shadow-sm">
            <h2 className="text-2xl font-bold text-neutral-900 mb-5">{data.code}를 이루는 4가지 선호 지표</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {letters.map((ch) => {
                const info = AXIS_INFO[ch];
                return (
                  <div key={ch} className="p-4 rounded-2xl bg-neutral-50 border border-neutral-100">
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-neutral-900 text-white text-sm font-bold">
                        {ch}
                      </span>
                      <h3 className="font-bold text-neutral-900 text-sm">{info.label}</h3>
                    </div>
                    <p className="text-sm text-neutral-600 leading-relaxed">{info.desc}</p>
                  </div>
                );
              })}
            </div>
          </section>

          {/* 강점 & 보완 포인트 */}
          <section className="grid md:grid-cols-2 gap-6">
            <div className="bg-white rounded-3xl border border-emerald-100 p-7 shadow-sm">
              <h2 className="text-xl font-bold text-emerald-700 mb-4 flex items-center">
                <CheckCircle2 size={20} className="mr-2" /> 주요 강점
              </h2>
              <ul className="space-y-2.5 text-neutral-700 text-sm">
                {data.strengths.map((item) => (
                  <li key={item} className="flex items-center gap-2 bg-emerald-50/60 px-3.5 py-2.5 rounded-xl">
                    <span className="text-emerald-500 font-bold">✓</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-white rounded-3xl border border-amber-100 p-7 shadow-sm">
              <h2 className="text-xl font-bold text-amber-700 mb-4 flex items-center">
                <AlertCircle size={20} className="mr-2" /> 주의 및 보완 포인트
              </h2>
              <ul className="space-y-2.5 text-neutral-700 text-sm">
                {data.weaknesses.map((item) => (
                  <li key={item} className="flex items-center gap-2 bg-amber-50/60 px-3.5 py-2.5 rounded-xl">
                    <span className="text-amber-500 font-bold">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          {/* 연애 및 대인관계 */}
          <section className="bg-white rounded-3xl border border-neutral-200 p-8 shadow-sm">
            <h2 className="text-2xl font-bold text-neutral-900 mb-4 flex items-center">
              <Heart size={22} className="mr-2 text-rose-500" /> {data.code}의 연애와 인간관계
            </h2>
            <p className="text-neutral-700 leading-relaxed text-[1.02rem]">{data.relationships}</p>

            <div className="mt-6 pt-6 border-t border-neutral-100">
              <h3 className="text-base font-bold text-neutral-800 mb-3">잘 어울리는 궁합 유형</h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {data.compatible.map((partnerCode) => {
                  const partner = mbtiTypes[partnerCode];
                  const pairSlug = toCanonicalPair(upper, partnerCode);
                  return (
                    <Link
                      key={partnerCode}
                      href={pairSlug ? `/compatibility/${pairSlug}` : `/type/${partnerCode}`}
                      className="p-3.5 rounded-2xl bg-rose-50/60 border border-rose-100 hover:border-rose-300 hover:bg-rose-50 transition-all text-center group"
                    >
                      <div className="text-xl mb-1">{partner?.emoji || "✨"}</div>
                      <div className="font-extrabold text-rose-600 group-hover:underline">{partnerCode}</div>
                      <div className="text-xs text-neutral-500">궁합 분석 보기 →</div>
                    </Link>
                  );
                })}
              </div>
            </div>
          </section>

          {/* 직장 생활 및 추천 직업 */}
          <section className="bg-white rounded-3xl border border-neutral-200 p-8 shadow-sm">
            <h2 className="text-2xl font-bold text-neutral-900 mb-4 flex items-center">
              <Briefcase size={22} className="mr-2 text-indigo-500" /> {data.code}의 직장 생활과 추천 직업
            </h2>
            <p className="text-neutral-700 leading-relaxed text-[1.02rem] mb-6">{data.workplace}</p>
            <h3 className="text-base font-bold text-neutral-800 mb-3">어울리는 직무·분야</h3>
            <div className="flex flex-wrap gap-2">
              {data.careers.map((career) => (
                <span
                  key={career}
                  className="px-4 py-2 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100 text-sm font-medium"
                >
                  #{career}
                </span>
              ))}
            </div>
          </section>

          {/* 성장을 위한 조언 */}
          <section className="bg-white rounded-3xl border border-neutral-200 p-8 shadow-sm">
            <h2 className="text-2xl font-bold text-neutral-900 mb-4 flex items-center">
              <Lightbulb size={22} className="mr-2 text-amber-500" /> {data.code} 성장을 위한 실천 조언
            </h2>
            <ol className="space-y-3 text-neutral-700">
              {data.advice.map((tip, idx) => (
                <li key={idx} className="flex items-start gap-3 p-4 rounded-2xl bg-neutral-50 border border-neutral-100">
                  <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-neutral-900 text-white text-xs font-bold shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <span className="leading-relaxed">{tip}</span>
                </li>
              ))}
            </ol>
          </section>

          {/* 검사 유도 CTA */}
          <section className="bg-gradient-to-br from-neutral-900 to-neutral-800 text-white rounded-3xl p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div>
              <div className="inline-flex items-center text-xs font-bold text-pink-300 mb-2">
                <Sparkles size={14} className="mr-1.5" /> 무료 60문항 정밀 검사
              </div>
              <h2 className="text-2xl font-bold mb-1">내가 정말 {data.code} 유형일까요?</h2>
              <p className="text-sm text-neutral-300">
                지금 바로 60문항 MBTI 성격유형 검사를 통해 현재 나의 성향 조합을 확인해보세요.
              </p>
            </div>
            <Link href="/test" className="shrink-0">
              <Button size="lg" className="bg-white text-neutral-900 hover:bg-neutral-100 rounded-full px-7 font-bold">
                MBTI 검사 시작하기 <ArrowRight size={16} className="ml-1.5" />
              </Button>
            </Link>
          </section>

          {/* 관련 칼럼 */}
          {displayPosts.length > 0 && (
            <section className="pt-4">
              <h2 className="text-xl font-bold text-neutral-900 mb-4">함께 읽으면 좋은 심리 칼럼</h2>
              <div className="grid sm:grid-cols-3 gap-4">
                {displayPosts.map((post) => (
                  <Link
                    key={post.id}
                    href={`/blog/${post.id}`}
                    className="p-4 rounded-2xl bg-white border border-neutral-200 hover:border-pink-300 hover:shadow-md transition-all flex flex-col"
                  >
                    <span className="text-xs font-semibold text-pink-500 mb-1.5">{post.category || "심리분석"}</span>
                    <h3 className="font-bold text-neutral-800 text-sm line-clamp-2 mb-2">{post.title}</h3>
                    <p className="text-xs text-neutral-500 line-clamp-2 mt-auto">{post.excerpt}</p>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* 다른 유형 빠른 이동 */}
          <section className="bg-white rounded-3xl border border-neutral-200 p-6">
            <h2 className="text-base font-bold text-neutral-800 mb-4">다른 MBTI 유형 둘러보기</h2>
            <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
              {ALL_CODES.map((c) => (
                <Link
                  key={c}
                  href={`/type/${c}`}
                  className={`text-center py-2 rounded-xl text-xs font-bold border transition-colors ${
                    c === upper
                      ? "bg-neutral-900 text-white border-neutral-900"
                      : "bg-neutral-50 text-neutral-700 border-neutral-200 hover:border-primary hover:text-primary"
                  }`}
                >
                  {c}
                </Link>
              ))}
            </div>
          </section>
        </article>
      </div>
    </div>
  );
}
