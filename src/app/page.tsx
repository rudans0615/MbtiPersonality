import Link from "next/link";
import { Sparkles, BookOpen, Compass, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getTests, getBlogPosts } from "@/lib/queries";
import { mbtiTypes } from "@/lib/customTests/mbtiTypes";
import CategoryRowClient from "@/components/CategoryRowClient";

export const revalidate = 60;

export const metadata = {
  title: {
    absolute: "MBTI 성격유형 검사 | 심리테스트 & 16유형 백과 - MBTI Finder",
  },
  description:
    "무료 64문항 정밀 MBTI 성격유형 검사, 16가지 유형별 연애·직장 백과사전, 테토-에겐 진단과 심리 칼럼까지 한곳에서 만나보세요.",
  alternates: {
    canonical: "/",
  },
};

function toClientFormat(tests: any[]) {
  return tests.map((t) => ({
    id: t.id,
    category: t.category,
    title: t.title,
    subtitle: t.subtitle,
    description: t.description,
    emoji: t.emoji,
    color: t.color,
    duration: t.duration,
    questionCount: t.question_count,
    href: t.href,
    features: t.features,
    isAvailable: t.is_available,
    displayOrder: t.display_order,
  }));
}

export default async function Home() {
  const [dbTests, dbPosts] = await Promise.all([
    getTests().catch(() => []),
    getBlogPosts().catch(() => []),
  ]);

  const allTests = toClientFormat(dbTests);
  const hotTests = allTests.filter((t) => t.category === "HOT" && t.isAvailable);
  const loveTests = allTests.filter((t) => t.category === "LOVE" && t.isAvailable);
  const personalityTests = allTests.filter((t) => t.category === "PERSONALITY" && t.isAvailable);
  const funTests = allTests.filter((t) => t.category === "FUN" && t.isAvailable);
  const careerTests = allTests.filter((t) => t.category === "CAREER" && t.isAvailable);
  const featuredPosts = dbPosts.slice(0, 6);
  const allMbtiList = Object.values(mbtiTypes);

  return (
    <>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-white border-b border-neutral-100 shadow-sm">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-24 text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-semibold mb-6">
            <Sparkles size={16} /> 자기이해 심리테스트 &amp; MBTI 유형 가이드
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold text-neutral-900 mb-6 tracking-tight leading-tight">
            나의 진짜 모습을
            <br />
            <span className="bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
              발견해보세요
            </span>
          </h1>
          <p className="text-lg md:text-xl text-neutral-500 mb-10 max-w-2xl mx-auto leading-relaxed">
            64문항 정밀 MBTI 성격유형 검사부터 16가지 유형 백과, 연애·일상 성향 테스트와 심리 칼럼까지 모두 무료로 이용할 수 있습니다.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link href={hotTests[0]?.href || "/test"}>
              <Button
                size="lg"
                className="rounded-full px-8 h-14 text-lg bg-neutral-900 hover:bg-neutral-800 shadow-xl hover:shadow-2xl transition-all"
              >
                인기 테스트 바로 하기 🚀
              </Button>
            </Link>
            <Link href="/type">
              <Button
                size="lg"
                variant="outline"
                className="rounded-full px-8 h-14 text-lg bg-white hover:bg-neutral-50"
              >
                MBTI 16유형 백과 보기
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Categories Section (Coming Soon 제외) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <CategoryRowClient category="HOT" tests={hotTests} />
        <CategoryRowClient category="LOVE" tests={loveTests} />
        <CategoryRowClient category="PERSONALITY" tests={personalityTests} />
        <CategoryRowClient category="FUN" tests={funTests} />
        <CategoryRowClient category="CAREER" tests={careerTests} />
      </section>

      {/* MBTI 16유형 백과 빠른 탐색 */}
      <section className="bg-white border-y border-neutral-100 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
            <div>
              <div className="inline-flex items-center gap-1.5 text-sm font-bold text-primary mb-2">
                <Compass size={16} /> 16가지 성격유형 백과사전
              </div>
              <h2 className="text-2xl md:text-3xl font-extrabold text-neutral-900">
                유형별 특징·연애·직장·궁합 한눈에 보기
              </h2>
            </div>
            <div className="flex flex-wrap gap-4">
              <Link href="/compatibility" className="text-sm font-semibold text-pink-600 hover:underline inline-flex items-center">
                16×16 MBTI 궁합표 보기 <ArrowRight size={16} className="ml-1" />
              </Link>
              <Link href="/type" className="text-sm font-semibold text-primary hover:underline inline-flex items-center">
                전체 백과 보기 <ArrowRight size={16} className="ml-1" />
              </Link>
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
            {allMbtiList.map((item) => (
              <Link
                key={item.code}
                href={`/type/${item.code}`}
                className="p-3.5 rounded-2xl bg-neutral-50 border border-neutral-200/80 hover:border-primary hover:bg-white hover:shadow-md transition-all text-center group"
              >
                <div className="text-2xl mb-1">{item.emoji}</div>
                <div className="font-extrabold text-neutral-900 group-hover:text-primary text-sm">
                  {item.code}
                </div>
                <div className="text-xs text-neutral-500 truncate">{item.title}</div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 추천 심리 칼럼 섹션 */}
      {featuredPosts.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
            <div>
              <div className="inline-flex items-center gap-1.5 text-sm font-bold text-pink-600 mb-2">
                <BookOpen size={16} /> 깊이 있는 성격·관계 인사이트
              </div>
              <h2 className="text-2xl md:text-3xl font-extrabold text-neutral-900">
                인기 심리 칼럼
              </h2>
            </div>
            <Link href="/blog" className="text-sm font-semibold text-pink-600 hover:underline inline-flex items-center">
              모든 칼럼 보기 <ArrowRight size={16} className="ml-1" />
            </Link>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredPosts.map((post) => (
              <Link
                key={post.id}
                href={`/blog/${post.id}`}
                className="bg-white rounded-2xl border border-neutral-200/80 p-6 hover:border-pink-300 hover:shadow-lg transition-all flex flex-col group"
              >
                <div className="flex items-center justify-between text-xs text-neutral-500 mb-3">
                  <span className="px-2.5 py-0.5 rounded-full bg-pink-50 text-pink-600 font-semibold">
                    {post.category || "심리분석"}
                  </span>
                  <span>{post.read_time || "4분"} 소요</span>
                </div>
                <h3 className="text-lg font-bold text-neutral-900 group-hover:text-pink-600 transition-colors line-clamp-2 mb-2 leading-snug">
                  {post.title}
                </h3>
                <p className="text-sm text-neutral-600 line-clamp-3 leading-relaxed mb-4 flex-1">
                  {post.excerpt}
                </p>
                <span className="text-xs font-semibold text-neutral-800 group-hover:text-pink-600 inline-flex items-center mt-auto">
                  칼럼 읽기 <ArrowRight size={14} className="ml-1" />
                </span>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="bg-neutral-900 py-20 mt-4">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            나를 이해하고 주변 사람들과 소통해보세요
          </h2>
          <p className="text-lg text-neutral-400 mb-10 max-w-2xl mx-auto">
            64문항 무료 정밀 MBTI 검사로 나의 4가지 선호 지표 비율을 확인하고, 16가지 유형 가이드에서 연애·직장 팁까지 함께 살펴보세요.
          </p>
          <Link href="/test">
            <Button
              size="lg"
              className="bg-white text-neutral-900 hover:bg-neutral-200 px-8 py-6 text-lg font-bold rounded-full shadow-lg transition-all duration-300"
            >
              대표 MBTI 검사 시작하기 🚀
            </Button>
          </Link>
        </div>
      </section>
    </>
  );
}
