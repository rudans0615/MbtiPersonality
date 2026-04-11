import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

import Navigation from "@/components/Navigation";
import { testTypes } from "@/data/testTypes";
import { Clock, Users, ArrowRight, Star, Sparkles, Heart, Brain, Laugh, Rocket } from "lucide-react";

const getIconForCategory = (cat: string) => {
  switch(cat) {
    case 'HOT': return <Sparkles className="text-yellow-500 w-6 h-6" />;
    case 'LOVE': return <Heart className="text-pink-500 w-6 h-6" />;
    case 'PERSONALITY': return <Brain className="text-blue-500 w-6 h-6" />;
    case 'FUN': return <Laugh className="text-green-500 w-6 h-6" />;
    case 'CAREER': return <Rocket className="text-purple-500 w-6 h-6" />;
    default: return <Sparkles className="text-primary w-6 h-6" />;
  }
};

const getTitleForCategory = (cat: string) => {
  switch(cat) {
    case 'HOT': return '지금 가장 뜨거운 테스트 🔥';
    case 'LOVE': return '달콤쌉싸름한 연애 진단 💕';
    case 'PERSONALITY': return '나를 찾아가는 심리 분석 🧠';
    case 'FUN': return '시간 순삭 킬링타임 유머 🍻';
    case 'CAREER': return '성공을 위한 직업 적성 🚀';
    default: return '추천 테스트';
  }
};

const CategoryRow = ({ category, tests, isComingSoon = false }: { category: string, tests: any[], isComingSoon?: boolean }) => {
  if (tests.length === 0) return null;
  return (
    <div className="mb-14">
      <div className="flex items-center gap-3 mb-6 px-4 md:px-0">
        {getIconForCategory(category)}
        <h3 className="text-2xl font-bold text-neutral-800 tracking-tight">
          {isComingSoon ? "곧 출시할 신규 테스트 🚧" : getTitleForCategory(category)}
        </h3>
      </div>
      
      {/* 넷플릭스형 가로 스크롤 컨테이너 */}
      <div className="flex overflow-x-auto pb-6 -mx-4 px-4 md:mx-0 md:px-2 space-x-6 snap-x snap-mandatory [&::-webkit-scrollbar]:hidden">
        {tests.map((test) => (
          <Card 
            key={test.id} 
            className={`min-w-[300px] max-w-[300px] md:min-w-[340px] md:max-w-[340px] snap-center snap-always bg-white rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden group flex flex-col ${isComingSoon ? 'opacity-70 border-dashed border-2' : ''}`}
          >
            <div className={`h-3 bg-gradient-to-r ${test.color || 'from-neutral-200 to-neutral-300'}`}></div>
            <CardContent className="p-6 flex flex-col h-full">
              <div className="flex items-start justify-between mb-4">
                <div className="text-4xl filter drop-shadow-md group-hover:scale-110 transition-transform">{test.emoji}</div>
                <Badge variant={isComingSoon ? "outline" : "secondary"} className={isComingSoon ? "bg-neutral-100" : "bg-primary/10 text-primary"}>
                  {isComingSoon ? "출시 예정" : "인기 급상승"}
                </Badge>
              </div>
              <h3 className="text-xl font-bold text-neutral-800 mb-2">{test.title}</h3>
              <p className="text-sm text-neutral-500 mb-4 line-clamp-2">{test.subtitle || test.description}</p>

              <div className="flex items-center gap-4 text-xs text-neutral-400 mb-6">
                <div className="flex items-center gap-1">
                  <Clock size={14} />
                  {test.duration}
                </div>
                <div className="flex items-center gap-1">
                  <Users size={14} />
                  {test.questions}문항
                </div>
              </div>

              <div className="mt-auto">
                {isComingSoon ? (
                  <Button disabled className="w-full bg-neutral-200 text-neutral-500 rounded-xl">
                    오픈 대기 중...
                  </Button>
                ) : (
                  <Link href={test.href}>
                    <Button className="w-full bg-neutral-900 text-white hover:bg-neutral-800 rounded-xl group-hover:shadow-lg transition-all">
                      시작하기
                      <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
};

export default function Landing() {
  const hotTests = testTypes.filter(t => t.category === 'HOT' && t.isAvailable);
  const loveTests = testTypes.filter(t => t.category === 'LOVE' && t.isAvailable);
  const personalityTests = testTypes.filter(t => t.category === 'PERSONALITY' && t.isAvailable);
  const funTests = testTypes.filter(t => t.category === 'FUN' && t.isAvailable);
  const comingSoonTests = testTypes.filter(t => !t.isAvailable);

  return (
    <div className="min-h-screen bg-[#F8F9FB]">
      <Navigation />

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
        
        <CategoryRow category="HOT" tests={hotTests} />
        <CategoryRow category="LOVE" tests={loveTests} />
        <CategoryRow category="PERSONALITY" tests={personalityTests} />
        <CategoryRow category="FUN" tests={funTests} />
        
        {/* Coming Soon */}
        <div className="mt-20 pt-16 border-t border-neutral-200">
          <CategoryRow category="COMING" tests={comingSoonTests} isComingSoon={true} />
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
              어떤 테스트들이 있나요? 👀
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}