import type { Metadata } from "next";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export const metadata: Metadata = {
  title: "서비스 소개 및 콘텐츠 검수 원칙",
  description: "MBTI Finder의 운영 목적, 16가지 성격유형 안내, 심리테스트 제작 및 검수 원칙과 참고용 한계 고지를 확인하세요.",
  alternates: { canonical: "/about" },
};

export default function About() {
  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Header */}
      <div className="gradient-bg text-white pt-28 pb-16">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">MBTI Finder 소개</h1>
          <p className="text-xl opacity-90">자기이해와 건강한 인간관계를 돕는 성격유형 가이드 &amp; 심리테스트 플랫폼</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="mb-8">
          <Link href="/">
            <Button variant="ghost" className="text-neutral-600 hover:text-primary">
              ← 홈으로 돌아가기
            </Button>
          </Link>
        </div>

        <div className="space-y-8">
          {/* 운영 목적 및 콘텐츠 원칙 (E-E-A-T) */}
          <Card className="bg-white rounded-3xl shadow-lg p-8">
            <CardContent className="p-0 space-y-4 text-neutral-700 leading-relaxed">
              <h2 className="text-3xl font-bold text-neutral-800 mb-4">운영 목적과 콘텐츠 제작 원칙</h2>
              <p>
                MBTI Finder는 복잡한 성격 심리 개념을 누구나 일상에서 이해하고 스스로를 돌아볼 수 있도록 돕기 위해 운영되는 웹 플랫폼입니다.
                단순한 결과 한 줄을 보여주는 데 그치지 않고, <strong>16가지 MBTI 유형별 특성·관계·직장 생활 가이드</strong>와
                <strong>일상 속 심리 칼럼</strong>을 함께 제공해 실질적인 자기이해 자료로 활용할 수 있도록 구성하고 있습니다.
              </p>
              <div className="grid md:grid-cols-2 gap-4 pt-2">
                <div className="bg-neutral-50 rounded-2xl p-5 border border-neutral-100">
                  <h3 className="font-bold text-neutral-800 mb-2">1. 문항·채점 일관성 검수</h3>
                  <p className="text-sm text-neutral-600">
                    모든 테스트는 문항 수, 선택지 균형, 결과 도달 가능성을 점검한 뒤 공개합니다. 오류나 오탈자가 발견되면 제보를 받아 즉시 수정합니다.
                  </p>
                </div>
                <div className="bg-neutral-50 rounded-2xl p-5 border border-neutral-100">
                  <h3 className="font-bold text-neutral-800 mb-2">2. 비식별·로컬 처리 원칙</h3>
                  <p className="text-sm text-neutral-600">
                    회원가입을 요구하지 않으며, 개인의 검사 응답과 결과를 서버 DB에 저장하지 않습니다. 브라우저 세션 내에서만 결과를 계산합니다.
                  </p>
                </div>
              </div>
              <p className="text-sm text-neutral-500 bg-amber-50/70 border border-amber-200/70 rounded-xl p-4">
                <strong>안내 및 한계:</strong> 본 사이트의 모든 테스트와 심리 칼럼은 자기이해와 소통을 돕기 위한 참고 및 오락용 콘텐츠입니다.
                공식 MBTI® 전문 검사, 임상 심리 평가, 의학적·정신건강 진단을 대체하지 않으며 전문 상담이 필요한 경우 공인된 기관의 도움을 받으시기 바랍니다.
              </p>
            </CardContent>
          </Card>

          {/* MBTI Section */}
          <Card className="bg-white rounded-3xl shadow-lg p-8">
            <CardContent className="p-0">
              <div className="flex items-center mb-6">
                <div className="text-4xl mr-4">🧠</div>
                <h2 className="text-3xl font-bold text-neutral-800">MBTI 성격유형 검사</h2>
              </div>
              <div className="prose prose-lg max-w-none text-neutral-700">
                <p className="mb-4">
                  MBTI(Myers-Briggs Type Indicator)는 칼 구스타프 융의 심리학적 유형론을 바탕으로
                  개인의 인식과 판단 선호 경향을 4가지 축으로 정리해 16가지 유형으로 살펴보는 틀입니다.
                </p>
                <p className="mb-6">
                  MBTI Finder의 64문항 정밀 검사는 에너지 방향(E/I), 인식 방식(S/N), 판단 기준(T/F), 생활 양식(J/P)을
                  각 지표별 8:8 완전 대칭 문항으로 측정하여 4가지 지표 백분율과 강점·성장 포인트를 제공합니다.
                </p>
                <div className="flex flex-wrap justify-center gap-3">
                  <Link href="/test">
                    <Button className="bg-primary text-white px-8 py-3 text-lg">
                      MBTI 검사 시작하기
                    </Button>
                  </Link>
                  <Link href="/type">
                    <Button variant="outline" className="px-8 py-3 text-lg">
                      16가지 유형 백과 보기
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 4가지 차원 */}
          <Card className="bg-white rounded-3xl shadow-lg p-8">
            <CardContent className="p-0">
              <h2 className="text-3xl font-bold text-neutral-800 mb-6">MBTI 4가지 선호 지표</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-primary/10 rounded-2xl p-6">
                  <h3 className="text-xl font-semibold text-primary mb-3">외향(E) vs 내향(I)</h3>
                  <p className="text-neutral-700">에너지를 얻고 주의를 기울이는 방향이 외부 활동과 교류인지, 내면의 성찰과 고요함인지를 나타냅니다.</p>
                </div>
                <div className="bg-secondary/10 rounded-2xl p-6">
                  <h3 className="text-xl font-semibold text-secondary mb-3">감각(S) vs 직관(N)</h3>
                  <p className="text-neutral-700">정보를 받아들이는 방식이 구체적 경험과 현실 사실 중심인지, 패턴과 미래 가능성 중심인지를 나타냅니다.</p>
                </div>
                <div className="bg-accent/10 rounded-2xl p-6">
                  <h3 className="text-xl font-semibold text-accent mb-3">사고(T) vs 감정(F)</h3>
                  <p className="text-neutral-700">의사결정 시 객관적 기준과 논리적 일관성을 우선하는지, 관계의 조화와 개인적 가치를 중시하는지를 나타냅니다.</p>
                </div>
                <div className="bg-orange-100 rounded-2xl p-6">
                  <h3 className="text-xl font-semibold text-orange-600 mb-3">판단(J) vs 인식(P)</h3>
                  <p className="text-neutral-700">일상을 다루는 방식이 체계적인 계획과 마무리를 선호하는지, 유연한 탐색과 즉흥적 적응을 선호하는지를 나타냅니다.</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Teto-Egen & Drunk Section */}
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="bg-white rounded-3xl shadow-lg p-8">
              <CardContent className="p-0 flex flex-col h-full">
                <div className="flex items-center mb-4">
                  <div className="text-3xl mr-3">⚡</div>
                  <h2 className="text-2xl font-bold text-neutral-800">테토 vs 에겐 성격진단</h2>
                </div>
                <p className="text-neutral-700 leading-relaxed mb-6 flex-1">
                  행동 추진력과 직관적 결단력(테토 성향), 섬세한 공감과 감성적 교감(에겐 성향)의 균형을 4가지 유형으로 살펴보는 트렌드 심리테스트입니다.
                </p>
                <Link href="/teto-egen">
                  <Button className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white py-3">
                    테토-에겐 검사 시작하기
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="bg-white rounded-3xl shadow-lg p-8">
              <CardContent className="p-0 flex flex-col h-full">
                <div className="flex items-center mb-4">
                  <div className="text-3xl mr-3">🍻</div>
                  <h2 className="text-2xl font-bold text-neutral-800">나 술 취했나? 자가진단</h2>
                </div>
                <p className="text-neutral-700 leading-relaxed mb-6 flex-1">
                  술자리에서 흔히 겪는 유쾌한 행동 패턴을 점검해 현재 컨디션과 주사 유형을 4단계로 확인하는 엔터테인먼트 테스트입니다.
                </p>
                <Link href="/drunk">
                  <Button className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3">
                    술취함 진단 시작하기
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>

          {/* 16가지 성격유형 */}
          <Card className="bg-white rounded-3xl shadow-lg p-8">
            <CardContent className="p-0">
              <div className="flex flex-wrap items-center justify-between gap-2 mb-6">
                <h2 className="text-3xl font-bold text-neutral-800">16가지 성격유형 백과</h2>
                <Link href="/type" className="text-sm font-semibold text-primary hover:underline">
                  전체 유형 한눈에 보기 →
                </Link>
              </div>
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold text-purple-600 mb-3">분석가 (NT)</h3>
                  <p className="text-neutral-700 mb-3">논리적이고 전략적 사고를 즐기는 유형들</p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {["INTJ", "INTP", "ENTJ", "ENTP"].map((type) => (
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
                  <p className="text-neutral-700 mb-3">이상과 가치, 사람과의 깊은 공감을 중시하는 유형들</p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {["INFJ", "INFP", "ENFJ", "ENFP"].map((type) => (
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
                  <p className="text-neutral-700 mb-3">실용적이고 책임감 있게 질서를 세우는 유형들</p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {["ISTJ", "ISFJ", "ESTJ", "ESFJ"].map((type) => (
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
                  <p className="text-neutral-700 mb-3">자유롭고 유연하며 현장 실행력이 뛰어난 유형들</p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {["ISTP", "ISFP", "ESTP", "ESFP"].map((type) => (
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

          {/* 문의 안내 */}
          <Card className="bg-white rounded-3xl shadow-lg p-8">
            <CardContent className="p-0 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold text-neutral-800 mb-2">콘텐츠 정정 및 제휴 문의</h2>
                <p className="text-neutral-600 text-sm">
                  문항 오류 신고, 콘텐츠 개선 제안, 협업 문의는 문의 페이지를 통해 언제든 보내실 수 있습니다.
                </p>
              </div>
              <Link href="/contact">
                <Button variant="outline" className="px-6 py-3 shrink-0">
                  문의하기 페이지 이동 →
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
