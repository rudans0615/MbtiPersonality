import Link from "next/link";
import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getTests } from "@/lib/queries";
import CategoryRowClient from "@/components/CategoryRowClient";

export const revalidate = 60; // ISR: 1분마다 재생성 (봇이 새 테스트 추가시 빠른 반영)

export const metadata = {
  title: {
    absolute: "MBTI 성격유형 검사 | 재미있는 심리테스트 모음 - MBTI Finder",
  },
  description: "MBTI 16가지 성격유형 검사, 호르몬 진단, 연애 호구력 테스트 등 재미있고 정확한 무료 심리테스트를 지금 바로 해보세요!",
  alternates: {
    canonical: '/',
  },
};

// DB 데이터를 testTypes 형식으로 변환
function toClientFormat(tests: any[]) {
  return tests.map(t => ({
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
  let allTests: any[];

  const dbTests = await getTests();
  allTests = toClientFormat(dbTests);

  const hotTests = allTests.filter(t => t.category === 'HOT' && t.isAvailable);
  const loveTests = allTests.filter(t => t.category === 'LOVE' && t.isAvailable);
  const personalityTests = allTests.filter(t => t.category === 'PERSONALITY' && t.isAvailable);
  const funTests = allTests.filter(t => t.category === 'FUN' && t.isAvailable);
  const careerTests = allTests.filter(t => t.category === 'CAREER' && t.isAvailable);
  const comingSoonTests = allTests.filter(t => !t.isAvailable);

  return (
    <>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-white border-b border-neutral-100 shadow-sm">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 pb-24 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-semibold mb-6 animate-fade-in">
            <Sparkles size={16} /> 대한민국 1위 심리테스트 플랫폼
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold text-neutral-900 mb-6 tracking-tight leading-tight">
            나의 진짜 모습을<br />
            <span className="bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
              발견해보세요
            </span>
          </h1>
          <p className="text-xl text-neutral-500 mb-10 max-w-2xl mx-auto leading-relaxed">
            나조차 몰랐던 나의 진짜 모습! 소름돋게 정확한 팩폭 진단부터 궁합까지, 지금 바로 무료로 확인해보세요.
          </p>
          <div className="flex justify-center gap-4">
            <Link href={hotTests[0]?.href || "/test"}>
              <Button size="lg" className="rounded-full px-8 h-14 text-lg bg-neutral-900 hover:bg-neutral-800 shadow-xl hover:shadow-2xl transition-all">
                방금 뜬 핫한 테스트 🚀
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Netflix Style Categories Section */}
      <section className="max-w-7xl mx-auto py-16">
        <CategoryRowClient category="HOT" tests={hotTests} />
        <CategoryRowClient category="LOVE" tests={loveTests} />
        <CategoryRowClient category="PERSONALITY" tests={personalityTests} />
        <CategoryRowClient category="FUN" tests={funTests} />
        <CategoryRowClient category="CAREER" tests={careerTests} />
        
        {/* Coming Soon */}
        <div className="mt-20 pt-16 border-t border-neutral-200">
          <CategoryRowClient category="COMING" tests={comingSoonTests} isComingSoon={true} />
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-neutral-900 py-20 mt-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            친구들과 결과를 공유하며 놀아보세요
          </h2>
          <p className="text-lg text-neutral-400 mb-10 max-w-2xl mx-auto">
            당신의 성향을 알아보고 주변 사람들과 얼만큼 잘 맞는지 비교해보세요. 평생 몰랐던 사실을 알게 될지도 모릅니다.
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
