export interface MBTIType {
  code: string;
  title: string;
  subtitle: string;
  description: string;
  strengths: string[];
  weaknesses: string[];
  compatible: string[];
  careers: string[];
  emoji: string;
  color: string;
}

export const mbtiTypes: Record<string, MBTIType> = {
  INTJ: {
    code: "INTJ",
    title: "건축가",
    subtitle: "독립적이고 전략적인 사고를 하는 완벽주의자",
    description: "INTJ는 독립적이고 창의적인 성격으로, 복잡한 문제를 체계적으로 해결하는 능력이 뛰어납니다. 장기적인 비전을 갖고 전략적으로 계획을 수립하며, 완벽주의적 성향이 강합니다. 혁신적인 아이디어와 독창적인 해결책을 제시하는 능력이 있으며, 목표를 달성하기 위해 끈질기게 노력합니다.",
    strengths: ["전략적 사고", "독립성", "결단력", "창의성", "장기적 비전"],
    weaknesses: ["감정 표현 부족", "비판적 성향", "완벽주의", "사회적 관계 어려움", "융통성 부족"],
    compatible: ["ENFP", "ENTP", "INFJ", "INTJ"],
    careers: ["과학자", "엔지니어", "변호사", "컨설턴트", "연구원", "건축가"],
    emoji: "🏗️",
    color: "purple"
  },
  INTP: {
    code: "INTP",
    title: "논리술사",
    subtitle: "호기심이 많고 창의적인 사상가",
    description: "INTP는 논리적이고 분석적인 사고를 바탕으로 복잡한 이론과 개념을 탐구하는 것을 좋아합니다. 독립적이고 유연한 사고를 가지고 있으며, 새로운 아이디어와 가능성에 열려있습니다. 객관적이고 비판적인 분석을 통해 진실을 추구하며, 지적 호기심이 매우 강합니다.",
    strengths: ["논리적 사고", "창의성", "객관성", "유연성", "지적 호기심"],
    weaknesses: ["세부사항 무시", "감정 처리 어려움", "결정 지연", "실행력 부족", "사회적 관계 소홀"],
    compatible: ["ENTJ", "ENFJ", "INTP", "ENTP"],
    careers: ["연구원", "철학자", "프로그래머", "수학자", "작가", "교수"],
    emoji: "🧪",
    color: "purple"
  },
  ENTJ: {
    code: "ENTJ",
    title: "통솔자",
    subtitle: "대담하고 상상력이 풍부한 강력한 지도자",
    description: "ENTJ는 타고난 리더십을 가지고 있으며, 장기적인 목표를 세우고 이를 달성하기 위해 체계적으로 계획을 실행합니다. 효율성과 성과를 중시하며, 팀을 이끌고 조직을 발전시키는 능력이 뛰어납니다. 도전적인 상황에서도 자신감을 잃지 않고 결단력 있게 행동합니다.",
    strengths: ["리더십", "전략적 사고", "결단력", "효율성", "목표 지향"],
    weaknesses: ["인내심 부족", "감정 무시", "독선적", "완벽주의", "스트레스 민감"],
    compatible: ["INFP", "INTP", "ENTJ", "ENFJ"],
    careers: ["CEO", "경영자", "변호사", "정치인", "투자자", "컨설턴트"],
    emoji: "👑",
    color: "purple"
  },
  ENTP: {
    code: "ENTP",
    title: "변론가",
    subtitle: "똑똑하고 호기심이 많은 사상가",
    description: "ENTP는 창의적이고 혁신적인 아이디어로 가득한 활발한 토론가입니다. 새로운 가능성을 탐구하고 기존의 관념에 도전하는 것을 즐기며, 뛰어난 언변과 설득력을 가지고 있습니다. 유연한 사고로 다양한 관점에서 문제를 바라보며, 창의적인 해결책을 제시합니다.",
    strengths: ["창의성", "유연성", "설득력", "혁신적 사고", "적응력"],
    weaknesses: ["일관성 부족", "세부사항 소홀", "집중력 부족", "루틴 싫어함", "감정 처리 어려움"],
    compatible: ["INFJ", "INTJ", "ENFP", "ENTP"],
    careers: ["기업가", "마케터", "변호사", "언론인", "컨설턴트", "발명가"],
    emoji: "💡",
    color: "purple"
  },
  INFJ: {
    code: "INFJ",
    title: "옹호자",
    subtitle: "선의의 옹호자이자 창의적인 이상주의자",
    description: "INFJ는 깊은 통찰력과 직관으로 사람과 상황을 이해하는 능력이 뛰어납니다. 이상주의적이고 도덕적 가치를 중시하며, 다른 사람들의 성장과 발전을 돕고자 합니다. 창의적이고 독창적인 사고를 가지고 있으며, 의미 있는 일에 헌신하는 성향이 강합니다.",
    strengths: ["통찰력", "공감능력", "창의성", "결단력", "이상주의"],
    weaknesses: ["완벽주의", "비현실적", "과도한 이상주의", "비판에 민감", "소진되기 쉬움"],
    compatible: ["ENFP", "ENTP", "INFJ", "ENFJ"],
    careers: ["상담사", "작가", "교육자", "사회복지사", "예술가", "심리학자"],
    emoji: "🌟",
    color: "green"
  },
  INFP: {
    code: "INFP",
    title: "중재자",
    subtitle: "시적이고 친절한 이타주의자",
    description: "INFP는 개인의 가치와 신념을 매우 중요하게 여기며, 진정성 있는 삶을 추구합니다. 창의적이고 상상력이 풍부하며, 다른 사람들의 감정과 동기를 깊이 이해합니다. 조화로운 관계를 선호하고, 갈등을 피하려는 성향이 있으며, 자신만의 독특한 관점을 가지고 있습니다.",
    strengths: ["창의성", "공감능력", "적응력", "개방성", "진정성"],
    weaknesses: ["실용성 부족", "결정 지연", "비판에 민감", "과도한 이상주의", "자기 비판"],
    compatible: ["ENFJ", "ENTJ", "INFP", "ENFP"],
    careers: ["작가", "상담사", "예술가", "심리학자", "사회복지사", "교육자"],
    emoji: "🌸",
    color: "green"
  },
  ENFJ: {
    code: "ENFJ",
    title: "선도자",
    subtitle: "카리스마 넘치고 영감을 주는 지도자",
    description: "ENFJ는 타인의 잠재력을 발견하고 이를 발휘할 수 있도록 도와주는 능력이 뛰어납니다. 따뜻하고 배려심이 많으며, 사람들을 이해하고 동기부여하는 데 탁월한 재능을 가지고 있습니다. 조화로운 관계를 만들고 유지하는 것을 중요하게 여기며, 공동체의 이익을 위해 헌신합니다.",
    strengths: ["리더십", "공감능력", "소통능력", "영감을 주는 능력", "조직력"],
    weaknesses: ["과도한 이타주의", "비판에 민감", "완벽주의", "자기희생", "갈등 회피"],
    compatible: ["INFP", "ISFP", "ENFJ", "INFJ"],
    careers: ["교육자", "상담사", "인사 관리자", "정치인", "종교인", "사회복지사"],
    emoji: "🌟",
    color: "green"
  },
  ENFP: {
    code: "ENFP",
    title: "재기발랄한 활동가",
    subtitle: "삶을 커다란 가능성으로 가득한 캔버스로 바라보는 사람",
    description: "ENFP는 활발하고 열정적인 성격으로, 새로운 아이디어와 가능성에 대해 끊임없이 탐구하는 성향을 가지고 있습니다. 사람들과의 관계를 중시하며, 다른 사람들의 잠재력을 발견하고 격려하는 데 뛰어난 능력을 보입니다. 창의적이고 유연한 사고로 혁신적인 해결책을 제시합니다.",
    strengths: ["창의적 사고", "뛰어난 소통능력", "유연성", "열정적", "낙관적"],
    weaknesses: ["세부사항 놓침", "일관성 부족", "스트레스 민감", "과도한 낙관", "루틴 싫어함"],
    compatible: ["INTJ", "INFJ", "ENFJ", "ENTP"],
    careers: ["마케터", "상담사", "기자", "교육자", "예술가", "기업가"],
    emoji: "🎨",
    color: "green"
  },
  ISTJ: {
    code: "ISTJ",
    title: "논리주의자",
    subtitle: "실용적이고 사실에 기반한 신뢰할 수 있는 사람",
    description: "ISTJ는 체계적이고 실용적인 접근방식으로 업무를 처리하며, 책임감이 강하고 신뢰할 수 있는 성격입니다. 전통과 안정성을 중시하며, 검증된 방법을 선호합니다. 세부사항에 주의를 기울이고, 꾸준하고 성실하게 목표를 달성해나갑니다.",
    strengths: ["책임감", "체계성", "신뢰성", "현실적", "꾸준함"],
    weaknesses: ["변화 적응 어려움", "융통성 부족", "감정 표현 부족", "새로운 아이디어 거부", "완벽주의"],
    compatible: ["ESFP", "ESTP", "ISFJ", "ESTJ"],
    careers: ["회계사", "은행원", "공무원", "엔지니어", "의사", "변호사"],
    emoji: "📊",
    color: "blue"
  },
  ISFJ: {
    code: "ISFJ",
    title: "수호자",
    subtitle: "따뜻한 마음씨를 가진 헌신적인 보호자",
    description: "ISFJ는 다른 사람들을 돕고 보호하는 것에서 만족감을 얻는 따뜻하고 배려심 깊은 성격입니다. 세심하고 책임감이 강하며, 다른 사람들의 필요를 먼저 생각합니다. 조화로운 환경을 만들고 유지하는 것을 중요하게 여기며, 실용적이고 현실적인 도움을 제공합니다.",
    strengths: ["배려심", "책임감", "충성심", "실용성", "세심함"],
    weaknesses: ["자기주장 부족", "변화 저항", "과도한 자기희생", "스트레스 누적", "갈등 회피"],
    compatible: ["ESFP", "ESTP", "ISTJ", "ESFJ"],
    careers: ["간호사", "교육자", "상담사", "사회복지사", "의료진", "사서"],
    emoji: "🛡️",
    color: "blue"
  },
  ESTJ: {
    code: "ESTJ",
    title: "경영자",
    subtitle: "뛰어난 관리자이자 목표 달성에 집중하는 리더",
    description: "ESTJ는 조직적이고 효율적인 관리 능력을 가진 타고난 리더입니다. 목표를 명확히 설정하고 이를 달성하기 위해 체계적으로 계획을 실행합니다. 전통과 질서를 중시하며, 책임감 있고 신뢰할 수 있는 성격으로 팀을 이끌어갑니다.",
    strengths: ["리더십", "조직력", "결단력", "효율성", "책임감"],
    weaknesses: ["융통성 부족", "감정 무시", "독선적", "변화 저항", "완벽주의"],
    compatible: ["ISFP", "ISTP", "ESTJ", "ISFJ"],
    careers: ["경영자", "관리자", "공무원", "은행원", "군인", "경찰"],
    emoji: "👔",
    color: "blue"
  },
  ESFJ: {
    code: "ESFJ",
    title: "집정관",
    subtitle: "매우 배려심 많고 사교성이 좋은 인기쟁이",
    description: "ESFJ는 사람들과의 관계를 매우 중시하며, 다른 사람들을 돕고 지원하는 것에서 큰 만족감을 얻습니다. 사교적이고 협력적이며, 조화로운 환경을 만들기 위해 노력합니다. 실용적이고 현실적인 해결책을 제시하며, 전통과 안정성을 중요하게 여깁니다.",
    strengths: ["협력성", "배려심", "사교성", "실용성", "조화 추구"],
    weaknesses: ["비판에 민감", "갈등 회피", "변화 저항", "자기주장 부족", "과도한 염려"],
    compatible: ["ISFP", "ISTP", "ESFJ", "ISFJ"],
    careers: ["교육자", "간호사", "상담사", "인사 관리자", "사회복지사", "이벤트 기획자"],
    emoji: "🤗",
    color: "blue"
  },
  ISTP: {
    code: "ISTP",
    title: "만능재주꾼",
    subtitle: "대담하고 실용적인 실험정신의 장인",
    description: "ISTP는 실용적이고 유연한 문제해결 능력을 가진 현실주의자입니다. 손으로 직접 만들고 경험하는 것을 선호하며, 논리적이고 객관적인 분석 능력이 뛰어납니다. 독립적이고 자유로운 환경에서 최고의 능력을 발휘하며, 위기 상황에서도 침착하게 대처합니다.",
    strengths: ["실용성", "문제해결 능력", "적응력", "침착함", "독립성"],
    weaknesses: ["감정 표현 부족", "장기 계획 어려움", "타인과의 소통 부족", "루틴 싫어함", "자기 표현 부족"],
    compatible: ["ESFJ", "ESTJ", "ISFP", "ESTP"],
    careers: ["엔지니어", "기술자", "파일럿", "외과의사", "운동선수", "탐정"],
    emoji: "🔧",
    color: "orange"
  },
  ISFP: {
    code: "ISFP",
    title: "모험가",
    subtitle: "유연하고 매력적인 예술가 기질의 탐험가",
    description: "ISFP는 예술적 감각과 개인적 가치를 중시하는 온화하고 배려심 깊은 성격입니다. 자유롭고 유연한 사고를 가지고 있으며, 새로운 경험과 아름다운 것들에 대한 감각이 뛰어납니다. 자신만의 독특한 방식으로 세상을 바라보며, 진정성 있는 삶을 추구합니다.",
    strengths: ["예술적 감각", "유연성", "공감능력", "개방성", "적응력"],
    weaknesses: ["자기주장 부족", "계획성 부족", "비판에 민감", "스트레스 민감", "결정 지연"],
    compatible: ["ESFJ", "ESTJ", "ISTP", "ESFP"],
    careers: ["예술가", "디자이너", "음악가", "상담사", "사진작가", "작가"],
    emoji: "🎨",
    color: "orange"
  },
  ESTP: {
    code: "ESTP",
    title: "사업가",
    subtitle: "똑똑하고 에너지 넘치며 인식 능력이 뛰어난 즉흥연주자",
    description: "ESTP는 활동적이고 현실적인 성격으로, 즉석에서 문제를 해결하는 능력이 뛰어납니다. 사교적이고 매력적이며, 사람들과 어울리는 것을 좋아합니다. 변화와 도전을 즐기며, 실용적이고 실행력 있는 해결책을 빠르게 찾아냅니다.",
    strengths: ["실행력", "적응력", "사교성", "현실적", "에너지 넘침"],
    weaknesses: ["장기 계획 부족", "세부사항 무시", "충동적", "인내심 부족", "일관성 부족"],
    compatible: ["ISFJ", "ISTJ", "ESFP", "ISTP"],
    careers: ["영업사원", "기업가", "연예인", "운동선수", "요리사", "응급의료진"],
    emoji: "⚡",
    color: "orange"
  },
  ESFP: {
    code: "ESFP",
    title: "연예인",
    subtitle: "자유로운 영혼의 즐거움을 추구하는 연예인",
    description: "ESFP는 열정적이고 친근한 성격으로, 사람들과 함께 있을 때 가장 빛을 발합니다. 순간을 즐기고 새로운 경험을 추구하며, 다른 사람들에게 기쁨과 활력을 주는 능력이 있습니다. 자유롭고 유연한 사고를 가지고 있으며, 감정적으로 표현력이 풍부합니다.",
    strengths: ["사교성", "낙관적", "유연성", "공감능력", "표현력"],
    weaknesses: ["계획성 부족", "집중력 부족", "비판에 민감", "장기적 사고 부족", "충동적"],
    compatible: ["ISFJ", "ISTJ", "ESTP", "ISFP"],
    careers: ["연예인", "교육자", "상담사", "이벤트 기획자", "판매원", "사회복지사"],
    emoji: "🎭",
    color: "orange"
  }
};

export const getTypesByGroup = () => {
  return {
    analysts: ["INTJ", "INTP", "ENTJ", "ENTP"],
    diplomats: ["INFJ", "INFP", "ENFJ", "ENFP"],
    sentinels: ["ISTJ", "ISFJ", "ESTJ", "ESFJ"],
    explorers: ["ISTP", "ISFP", "ESTP", "ESFP"]
  };
};
