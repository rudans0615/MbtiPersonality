export interface TetoEgenType {
  code: string;
  title: string;
  subtitle: string;
  description: string;
  characteristics: string[];
  celebrities: string[];
  compatibility: {
    best: string;
    good: string[];
    avoid: string;
  };
  percentage: {
    teto: number;
    egen: number;
  };
  emoji: string;
  color: string;
}

export const tetoEgenTypes: Record<string, TetoEgenType> = {
  "TETO_M": {
    code: "TETO_M",
    title: "테토남",
    subtitle: "테스토스테론 남성",
    description: "주도적이고 현실적인 에너지가 넘치는 남성형 리더. 목표 지향적이며 행동으로 표현하는 직진형 스타일입니다.",
    characteristics: [
      "공격성과 사냥 본능이 강함",
      "자기주장이 강하며 리더십 보유",
      "감정보다 논리를 우선시",
      "친구가 많고 무리 생활에 익숙",
      "외부 세계에 관심이 많음",
      "현실 지향적이고 실용적",
      "단순하고 결정력이 빠름",
      "도전과 모험을 좋아함"
    ],
    celebrities: [
      "마동석", "황정민", "조정석", "이병헌", "손흥민"
    ],
    compatibility: {
      best: "에겐녀",
      good: ["테토녀"],
      avoid: "에겐남"
    },
    percentage: {
      teto: 85,
      egen: 15
    },
    emoji: "💪",
    color: "#2563eb"
  },
  "TETO_F": {
    code: "TETO_F",
    title: "테토녀",
    subtitle: "테스토스테론 여성",
    description: "당당하고 추진력 있는 현대적 여성. 자신만의 목표가 뚜렷하며 적극적으로 행동하는 독립적 스타일입니다.",
    characteristics: [
      "추진력과 결단력이 뛰어남",
      "독립적이고 자주적인 성향",
      "경쟁심이 강하고 승부욕이 있음",
      "솔직하고 직설적인 표현",
      "리더십을 발휘하는 것을 좋아함",
      "목표 달성을 위한 집중력",
      "현실적이고 실용적 사고",
      "새로운 도전을 즐김"
    ],
    celebrities: [
      "전지현", "손예진", "김태리", "박신혜", "김고은"
    ],
    compatibility: {
      best: "테토남",
      good: ["에겐남"],
      avoid: "에겐녀"
    },
    percentage: {
      teto: 75,
      egen: 25
    },
    emoji: "👑",
    color: "#dc2626"
  },
  "EGEN_M": {
    code: "EGEN_M",
    title: "에겐남",
    subtitle: "에스트로겐 남성",
    description: "감수성이 풍부하고 섬세한 매력을 가진 남성. 예술적 감각과 공감능력이 뛰어난 감성적 스타일입니다.",
    characteristics: [
      "감수성과 섬세함이 뛰어남",
      "타인의 감정에 민감하게 반응",
      "예술적, 철학적 관심사가 많음",
      "내면 지향적이고 사색을 좋아함",
      "트렌드에 민감하고 패션 센스가 좋음",
      "상황을 깊이 있게 분석",
      "갈등을 피하고 조화를 추구",
      "감정적 교류를 중시"
    ],
    celebrities: [
      "박보검", "송중기", "박서준", "차은우", "정해인"
    ],
    compatibility: {
      best: "테토녀",
      good: ["에겐녀"],
      avoid: "테토남"
    },
    percentage: {
      teto: 25,
      egen: 75
    },
    emoji: "🎨",
    color: "#7c3aed"
  },
  "EGEN_F": {
    code: "EGEN_F",
    title: "에겐녀",
    subtitle: "에스트로겐 여성",
    description: "부드럽고 따뜻한 여성성의 대표. 감정이 풍부하고 배려심 깊은 전통적 여성미를 지닌 스타일입니다.",
    characteristics: [
      "부드러운 여성성과 모성애",
      "감정이 풍부하고 표현력이 좋음",
      "타인을 배려하고 돌보는 성향",
      "안정감과 평화를 추구",
      "감성적이고 직관적 판단",
      "관계에서 조화를 중시",
      "세심하고 치밀한 면",
      "공감능력이 뛰어남"
    ],
    celebrities: [
      "아이유", "박민영", "한지민", "수지", "정유미"
    ],
    compatibility: {
      best: "테토남",
      good: ["에겐남"],
      avoid: "테토녀"
    },
    percentage: {
      teto: 15,
      egen: 85
    },
    emoji: "🌸",
    color: "#ec4899"
  }
};

export const getCompatibilityDescription = (userType: string, partnerType: string): string => {
  const compatibility = {
    "TETO_M-EGEN_F": "최고의 궁합! 테토남의 강한 추진력과 에겐녀의 부드러운 감성이 완벽하게 보완됩니다.",
    "TETO_F-TETO_M": "역동적인 커플! 서로의 에너지가 시너지를 만들어내지만 때로는 주도권 경쟁이 있을 수 있어요.",
    "EGEN_M-TETO_F": "환상의 조합! 에겐남의 섬세함과 테토녀의 당당함이 서로를 성장시킵니다.",
    "EGEN_F-EGEN_M": "감성적 소울메이트! 서로를 깊이 이해하지만 때로는 결정력이 부족할 수 있어요.",
    "TETO_M-TETO_F": "강력한 파워커플! 목표 달성력은 최고지만 갈등 시 격렬할 수 있습니다.",
    "EGEN_M-EGEN_F": "예술가 커플! 감성적 교감이 뛰어나지만 현실적 추진력은 아쉬울 수 있어요."
  };
  
  const key = `${userType}-${partnerType}`;
  return compatibility[key as keyof typeof compatibility] || "독특한 조합이네요! 서로 다른 매력이 새로운 가능성을 만들어낼 거예요.";
};

export const getTetoEgenBalance = (answers: number[]): { teto: number; egen: number } => {
  // 더 정교한 계산 로직 - 각 질문의 가중치를 고려
  const totalScore = answers.reduce((sum, answer) => sum + answer, 0);
  const maxPossibleScore = answers.length * 4; // 최대 점수 (각 문항 4점)
  const minPossibleScore = answers.length * 1; // 최소 점수 (각 문항 1점)
  
  // 점수를 0-100 범위로 정규화
  const normalizedScore = ((totalScore - minPossibleScore) / (maxPossibleScore - minPossibleScore)) * 100;
  
  // 테토 성향 계산 (높은 점수 = 테토 성향)
  const tetoPercentage = Math.round(Math.max(0, Math.min(100, normalizedScore)));
  const egenPercentage = 100 - tetoPercentage;
  
  return {
    teto: tetoPercentage,
    egen: egenPercentage
  };
};