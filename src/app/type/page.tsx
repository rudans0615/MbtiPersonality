import type { Metadata } from "next";
import Link from "next/link";
import { mbtiTypes } from "@/lib/customTests/mbtiTypes";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "MBTI 16가지 성격유형 백과 총정리",
  description:
    "INTJ, INFP, ENFJ, ISTJ 등 16가지 MBTI 성격유형별 핵심 특징, 장단점, 연애 스타일, 직장 생활, 추천 직업 및 궁합을 한눈에 살펴보세요.",
  alternates: { canonical: "/type" },
};

const GROUPS = [
  {
    key: "NT",
    name: "분석가형 (NT)",
    subtitle: "직관(N)과 사고(T)를 바탕으로 논리적 전략과 혁신을 탐구하는 유형",
    badgeClass: "bg-purple-100 text-purple-700 border-purple-200",
    borderClass: "hover:border-purple-300",
    codes: ["INTJ", "INTP", "ENTJ", "ENTP"],
  },
  {
    key: "NF",
    name: "외교관형 (NF)",
    subtitle: "직관(N)과 감정(F)을 바탕으로 사람과 가치, 이상적 관계에 집중하는 유형",
    badgeClass: "bg-emerald-100 text-emerald-700 border-emerald-200",
    borderClass: "hover:border-emerald-300",
    codes: ["INFJ", "INFP", "ENFJ", "ENFP"],
  },
  {
    key: "SJ",
    name: "관리자형 (SJ)",
    subtitle: "감각(S)과 판단(J)을 바탕으로 책임감, 안정감, 체계적 실행을 중시하는 유형",
    badgeClass: "bg-blue-100 text-blue-700 border-blue-200",
    borderClass: "hover:border-blue-300",
    codes: ["ISTJ", "ISFJ", "ESTJ", "ESFJ"],
  },
  {
    key: "SP",
    name: "탐험가형 (SP)",
    subtitle: "감각(S)과 인식(P)을 바탕으로 유연한 현장 감각과 즉각적 실행력을 발휘하는 유형",
    badgeClass: "bg-amber-100 text-amber-700 border-amber-200",
    borderClass: "hover:border-amber-300",
    codes: ["ISTP", "ISFP", "ESTP", "ESFP"],
  },
];

export default function MbtiTypesIndexPage() {
  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Header */}
      <section className="gradient-bg text-white pt-28 pb-16">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 tracking-tight">
            MBTI 16가지 성격유형 백과
          </h1>
          <p className="text-lg md:text-xl opacity-90 max-w-2xl mx-auto leading-relaxed">
            각 유형의 사고방식, 연애와 인간관계, 직장 스타일, 성장 조언과 궁합까지 깊이 있게 정리했습니다.
          </p>
          <div className="mt-8 flex justify-center gap-3 flex-wrap">
            <Link href="/test">
              <Button size="lg" className="bg-white text-neutral-900 hover:bg-neutral-100 rounded-full px-8 font-bold">
                내 MBTI 무료 검사하기 <ArrowRight size={18} className="ml-2" />
              </Button>
            </Link>
            <Link href="/blog">
              <Button size="lg" variant="outline" className="bg-transparent border-white/60 text-white hover:bg-white/10 rounded-full px-8">
                심리 칼럼 읽기
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* 4 Temperament Groups */}
      <div className="max-w-6xl mx-auto px-6 py-14 space-y-14">
        {GROUPS.map((group) => (
          <section key={group.key}>
            <div className="mb-6">
              <span className={`inline-block text-xs font-bold px-3 py-1 rounded-full border mb-2 ${group.badgeClass}`}>
                {group.key} 기질
              </span>
              <h2 className="text-2xl md:text-3xl font-bold text-neutral-900">{group.name}</h2>
              <p className="text-neutral-600 mt-1">{group.subtitle}</p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {group.codes.map((code) => {
                const t = mbtiTypes[code];
                if (!t) return null;
                return (
                  <Link
                    key={code}
                    href={`/type/${code}`}
                    className={`group bg-white rounded-2xl border border-neutral-200 p-6 shadow-sm hover:shadow-lg transition-all flex flex-col ${group.borderClass}`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-3xl">{t.emoji}</span>
                      <span className="text-sm font-extrabold tracking-wider text-neutral-800 bg-neutral-100 px-2.5 py-1 rounded-lg">
                        {t.code}
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-neutral-900 group-hover:text-primary transition-colors mb-1">
                      {t.title}
                    </h3>
                    <p className="text-sm text-neutral-600 leading-relaxed line-clamp-2 mb-4 flex-1">
                      {t.subtitle}
                    </p>
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {t.strengths.slice(0, 3).map((s) => (
                        <span key={s} className="text-xs bg-neutral-100 text-neutral-600 px-2 py-0.5 rounded-md">
                          #{s}
                        </span>
                      ))}
                    </div>
                    <div className="text-xs font-semibold text-primary flex items-center mt-auto">
                      상세 가이드 보기 <ArrowRight size={14} className="ml-1 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>
        ))}

        {/* 4가지 지표 이해 가이드 */}
        <section className="bg-white rounded-3xl border border-neutral-200 p-8 md:p-10 space-y-6">
          <h2 className="text-2xl font-bold text-neutral-900">MBTI 4가지 선호 지표 읽는 법</h2>
          <p className="text-neutral-600 leading-relaxed">
            MBTI 유형 코드는 우열이나 능력치가 아니라, 사람이 정보를 받아들이고 결정을 내릴 때{" "}
            <strong>어느 쪽을 더 자연스럽고 편안하게 사용하는지</strong>를 보여주는 4글자 조합입니다.
            같은 유형이라도 환경·경험·성숙도에 따라 다양한 모습으로 나타날 수 있으므로, 고정관념보다 자기이해와 소통의 참고 도구로 활용하는 것이 바람직합니다.
          </p>
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-100">
              <h3 className="font-bold text-neutral-900 mb-1">E (외향) vs I (내향) — 에너지 방향</h3>
              <p className="text-neutral-600">사람과의 교류와 외부 활동에서 에너지를 얻는 경향(E)과, 혼자만의 성찰과 조용한 몰입에서 재충전되는 경향(I)을 구분합니다.</p>
            </div>
            <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-100">
              <h3 className="font-bold text-neutral-900 mb-1">S (감각) vs N (직관) — 정보 인식</h3>
              <p className="text-neutral-600">현재 눈앞의 구체적 사실과 실무 경험을 중시하는 경향(S)과, 맥락·패턴·미래 가능성을 연결해 보는 경향(N)을 구분합니다.</p>
            </div>
            <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-100">
              <h3 className="font-bold text-neutral-900 mb-1">T (사고) vs F (감정) — 판단 기준</h3>
              <p className="text-neutral-600">객관적 원리와 논리적 일관성을 우선하는 경향(T)과, 관계의 조화·공감·사람에게 미치는 영향을 우선하는 경향(F)을 구분합니다.</p>
            </div>
            <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-100">
              <h3 className="font-bold text-neutral-900 mb-1">J (판단) vs P (인식) — 생활 양식</h3>
              <p className="text-neutral-600">미리 계획을 세우고 정돈된 마무리를 선호하는 경향(J)과, 상황에 따라 유연하게 선택지를 열어두는 경향(P)을 구분합니다.</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
