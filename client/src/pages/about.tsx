import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import AdSense from "@/components/AdSense";

export default function About() {
  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Header */}
      <div className="gradient-bg text-white py-16">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">MBTI 성격유형 검사 소개</h1>
          <p className="text-xl opacity-90">과학적으로 검증된 성격 분석 도구에 대해 알아보세요</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Navigation */}
        <div className="mb-8">
          <Link href="/">
            <Button variant="ghost" className="text-neutral-600 hover:text-primary">
              <i className="fas fa-arrow-left mr-2"></i>홈으로 돌아가기
            </Button>
          </Link>
        </div>

        {/* Main Content */}
        <div className="space-y-8">
          <Card className="bg-white rounded-3xl shadow-lg p-8">
            <CardContent className="p-0">
              <h2 className="text-3xl font-bold text-neutral-800 mb-6">MBTI란 무엇인가요?</h2>
              <div className="prose prose-lg max-w-none text-neutral-700">
                <p className="mb-4">
                  MBTI(Myers-Briggs Type Indicator)는 카를 융의 심리유형론을 기반으로 캐서린 쿡 브릭스와 
                  그의 딸 이사벨 브릭스 마이어스가 개발한 성격유형 검사입니다.
                </p>
                <p className="mb-4">
                  이 검사는 개인의 선호도를 4가지 차원으로 분류하여 16가지 성격유형으로 구분합니다.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white rounded-3xl shadow-lg p-8">
            <CardContent className="p-0">
              <h2 className="text-3xl font-bold text-neutral-800 mb-6">4가지 차원</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-primary/10 rounded-2xl p-6">
                  <h3 className="text-xl font-semibold text-primary mb-3">외향(E) vs 내향(I)</h3>
                  <p className="text-neutral-700">에너지의 방향과 관심의 초점이 외부 세계인지 내부 세계인지를 나타냅니다.</p>
                </div>
                <div className="bg-secondary/10 rounded-2xl p-6">
                  <h3 className="text-xl font-semibold text-secondary mb-3">감각(S) vs 직관(N)</h3>
                  <p className="text-neutral-700">정보를 수집하는 방식이 구체적 사실에 기반하는지 가능성과 의미에 초점을 두는지를 나타냅니다.</p>
                </div>
                <div className="bg-accent/10 rounded-2xl p-6">
                  <h3 className="text-xl font-semibold text-accent mb-3">사고(T) vs 감정(F)</h3>
                  <p className="text-neutral-700">의사결정 시 논리적 분석을 우선시하는지 인간관계와 가치를 중시하는지를 나타냅니다.</p>
                </div>
                <div className="bg-orange-100 rounded-2xl p-6">
                  <h3 className="text-xl font-semibold text-orange-600 mb-3">판단(J) vs 인식(P)</h3>
                  <p className="text-neutral-700">외부 세계를 대하는 태도가 계획적이고 체계적인지 유연하고 적응적인지를 나타냅니다.</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <AdSense 
            adSlot="1234567894"
            className="my-8"
          />

          <Card className="bg-white rounded-3xl shadow-lg p-8">
            <CardContent className="p-0">
              <h2 className="text-3xl font-bold text-neutral-800 mb-6">16가지 성격유형</h2>
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold text-purple-600 mb-3">분석가 (NT)</h3>
                  <p className="text-neutral-700 mb-3">논리적이고 전략적 사고를 하는 유형들</p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {['INTJ', 'INTP', 'ENTJ', 'ENTP'].map(type => (
                      <Link key={type} href={`/type/${type}`}>
                        <div className="bg-purple-50 border border-purple-200 rounded-lg p-3 text-center hover:bg-purple-100 transition-colors cursor-pointer">
                          <div className="font-semibold text-purple-600">{type}</div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-green-600 mb-3">외교관 (NF)</h3>
                  <p className="text-neutral-700 mb-3">이상주의적이고 사람 중심적인 유형들</p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {['INFJ', 'INFP', 'ENFJ', 'ENFP'].map(type => (
                      <Link key={type} href={`/type/${type}`}>
                        <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-center hover:bg-green-100 transition-colors cursor-pointer">
                          <div className="font-semibold text-green-600">{type}</div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-blue-600 mb-3">관리자 (SJ)</h3>
                  <p className="text-neutral-700 mb-3">실용적이고 체계적인 유형들</p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {['ISTJ', 'ISFJ', 'ESTJ', 'ESFJ'].map(type => (
                      <Link key={type} href={`/type/${type}`}>
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-center hover:bg-blue-100 transition-colors cursor-pointer">
                          <div className="font-semibold text-blue-600">{type}</div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-orange-600 mb-3">탐험가 (SP)</h3>
                  <p className="text-neutral-700 mb-3">자유롭고 실행력이 뛰어난 유형들</p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {['ISTP', 'ISFP', 'ESTP', 'ESFP'].map(type => (
                      <Link key={type} href={`/type/${type}`}>
                        <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 text-center hover:bg-orange-100 transition-colors cursor-pointer">
                          <div className="font-semibold text-orange-600">{type}</div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="text-center">
            <Link href="/test">
              <Button className="bg-gradient-to-r from-primary to-secondary text-white px-8 py-4 rounded-2xl font-semibold text-lg hover:shadow-2xl hover:scale-105 transition-all duration-300">
                <i className="fas fa-play mr-2"></i>
                검사 시작하기
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}