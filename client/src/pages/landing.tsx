import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

import Navigation from "@/components/Navigation";
import { testTypes, getAvailableTests, getComingSoonTests } from "@/data/testTypes";
import { Clock, Users, ArrowRight, Star } from "lucide-react";

export default function Landing() {
  const availableTests = getAvailableTests();
  const comingSoonTests = getComingSoonTests();

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-neutral-100">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center animate-fade-in">
            <h1 className="text-4xl md:text-6xl font-bold text-neutral-800 mb-6 leading-tight">
              나의 진짜 모습을<br/>
              <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                발견해보세요
              </span>
            </h1>
            <p className="text-xl text-neutral-600 mb-12 max-w-3xl mx-auto leading-relaxed">
              다양한 심리 테스트로 당신의 성격, 잠재력, 그리고 미래를 탐색해보세요. 
              더 나은 인간관계와 성공적인 삶을 위한 첫걸음을 시작해보세요.
            </p>
            
            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16 max-w-2xl mx-auto">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">6+</div>
                <div className="text-sm text-neutral-600">다양한 테스트</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">10만+</div>
                <div className="text-sm text-neutral-600">참여자</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">높은</div>
                <div className="text-sm text-neutral-600">만족도</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">무료</div>
                <div className="text-sm text-neutral-600">모든 테스트</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Available Tests Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-neutral-800 mb-4">
            다양한 심리 테스트
          </h2>
          <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
            당신의 다양한 면모를 발견할 수 있는 흥미로운 심리 테스트들을 준비했습니다
          </p>
        </div>

        {/* Available Tests */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {availableTests.map((test) => (
            <Card key={test.id} className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group">
              <div className={`h-2 bg-gradient-to-r ${test.color}`}></div>
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="text-4xl">{test.emoji}</div>
                  <Badge variant="secondary" className="bg-green-100 text-green-700">
                    이용 가능
                  </Badge>
                </div>
                <h3 className="text-xl font-bold text-neutral-800 mb-2">{test.title}</h3>
                <p className="text-neutral-600 mb-4 line-clamp-2">{test.description}</p>
                
                <div className="flex items-center gap-4 text-sm text-neutral-500 mb-6">
                  <div className="flex items-center gap-1">
                    <Clock size={14} />
                    {test.duration}
                  </div>
                  <div className="flex items-center gap-1">
                    <Users size={14} />
                    {test.questions}문항
                  </div>
                </div>

                <ul className="space-y-2 mb-6">
                  {test.features.slice(0, 3).map((feature, index) => (
                    <li key={index} className="flex items-center text-sm text-neutral-600">
                      <Star size={12} className="text-yellow-500 mr-2 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>

                <Link href={test.href}>
                  <Button className="w-full bg-gradient-to-r from-primary to-secondary text-white rounded-lg group-hover:shadow-lg transition-all">
                    테스트 시작하기
                    <ArrowRight size={16} className="ml-2" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Coming Soon Tests */}
        <div className="text-center mb-8">
          <h3 className="text-2xl font-bold text-neutral-800 mb-4">곧 출시될 테스트</h3>
          <p className="text-neutral-600">더 많은 흥미로운 테스트들이 준비 중입니다</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {comingSoonTests.map((test) => (
            <Card key={test.id} className="bg-white/60 rounded-2xl border-2 border-dashed border-neutral-300 relative overflow-hidden">
              <CardContent className="p-6 text-center">
                <div className="opacity-60">
                  <div className="text-3xl mb-3">{test.emoji}</div>
                  <h4 className="text-lg font-semibold text-neutral-800 mb-2">{test.title}</h4>
                  <p className="text-sm text-neutral-600 mb-4">{test.subtitle}</p>
                  <div className="flex items-center justify-center gap-4 text-xs text-neutral-500">
                    <span className="flex items-center gap-1">
                      <Clock size={12} />
                      {test.duration}
                    </span>
                    <span className="flex items-center gap-1">
                      <Users size={12} />
                      {test.questions}문항
                    </span>
                  </div>
                </div>
                <Badge variant="outline" className="absolute top-4 right-4 bg-neutral-100">
                  출시 예정
                </Badge>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-neutral-800 mb-4">
              왜 우리 플랫폼을 선택해야 할까요?
            </h2>
            <p className="text-neutral-600 max-w-2xl mx-auto">
              전문적이고 신뢰할 수 있는 심리 테스트로 당신의 진정한 모습을 발견하세요
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">과학적 검증</h3>
              <p className="text-neutral-600">심리학 연구에 기반한 신뢰할 수 있는 테스트</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">개인정보 보호</h3>
              <p className="text-neutral-600">안전하고 익명의 테스트 환경 제공</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">즉시 결과</h3>
              <p className="text-neutral-600">테스트 완료 후 바로 확인할 수 있는 상세한 분석</p>
            </div>
          </div>
        </div>
      </section>



      {/* CTA Section */}
      <section className="bg-gradient-to-r from-primary to-secondary py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            지금 바로 시작해보세요
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            몇 분만 투자하여 평생 도움이 될 자신에 대한 통찰을 얻어보세요
          </p>
          <Link href="/test">
            <Button 
              size="lg" 
              className="bg-white text-primary hover:bg-neutral-100 px-8 py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
            >
              무료로 테스트 시작하기
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-neutral-800 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                  </svg>
                </div>
                <span className="text-xl font-bold">심리테스트</span>
              </div>
              <p className="text-neutral-400 mb-4">
                과학적으로 검증된 심리 테스트로 당신의 진정한 모습을 발견하세요.
              </p>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-4">테스트</h4>
              <ul className="space-y-2 text-neutral-400">
                <li><Link href="/test"><a className="hover:text-white transition-colors">MBTI 성격유형 검사</a></Link></li>
                <li><Link href="/teto-egen-test"><a className="hover:text-white transition-colors">테토 vs 에겐 진단</a></Link></li>
                <li><Link href="/drunk-test"><a className="hover:text-white transition-colors">나 술 취했나? 테스트</a></Link></li>
                <li><span className="text-neutral-500">연애유형 검사 (출시예정)</span></li>
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-4">정보</h4>
              <ul className="space-y-2 text-neutral-400">
                <li><Link href="/about"><a className="hover:text-white transition-colors">소개</a></Link></li>
                <li><Link href="/blog"><a className="hover:text-white transition-colors">블로그</a></Link></li>
                <li><Link href="/terms"><a className="hover:text-white transition-colors">이용약관</a></Link></li>
                <li><Link href="/privacy"><a className="hover:text-white transition-colors">개인정보처리방침</a></Link></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-neutral-700 pt-8 text-center text-neutral-400">
            <p>&copy; 2025 심리테스트. 모든 권리 보유.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}