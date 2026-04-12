export type TestCategory = 'HOT' | 'PERSONALITY' | 'LOVE' | 'FUN' | 'CAREER';

export interface TestType {
  id: string;
  category: TestCategory;
  title: string;
  subtitle: string;
  description: string;
  emoji: string;
  color: string;
  duration: string;
  questions: number;
  href: string;
  features: string[];
  isAvailable: boolean;
}

export const testTypes: TestType[] = [
  {
    id: "homeDecorDreams",
    category: "FUN",
    title: "넌 어떤 집을 꿈꾸고 있을까?",
    subtitle: "너의 주거취향을 알아보자!",
    description: "자취생이라면 누구나 한번쯤 상상해본 완벽한 집! 오늘은 네가 꿈꾸는 집의 스타일을 파악해볼게. 어떤 공간에서 나의 인생을 살고 싶은지 알아보자! ",
    emoji: "🏡",
    color: "from-purple-500 to-pink-500",
    duration: "약 3분",
    questions: 4,
    href: "/homeDecorDreams-test",
    features: ["AI 맞춤 분석", "나만의 결과지", "궁합 확인"],
    isAvailable: true
  },
  {
    id: "crushConfessions",
    category: "LOVE",
    title: "너의 썸 여부를 점쳐보는 심리 테스트",
    subtitle: "썸타는 기분, 맞춰볼래?",
    description: "너의 최근 썸상대에게 나쁜 소식을 전해야 하는 상황! 어떻게 대처할지에 따라 너의 썸이 진짜인지 가짜인지 확인할 수 있어. 자신이 요즘 느끼고 있는 진짜 감정, 같이 알아보자!",
    emoji: "💔",
    color: "from-purple-500 to-pink-500",
    duration: "약 3분",
    questions: 4,
    href: "/crushConfessions-test",
    features: ["AI 맞춤 분석", "나만의 결과지", "궁합 확인"],
    isAvailable: true
  },
  {
    id: "healingJourney",
    category: "CAREER",
    title: "너의 힐링 여행 스타일은?",
    subtitle: "지친 마음을 싸이하고 떠나보자!",
    description: "하루하루 바쁜 일상 속에서 힘든 나에게 필요한 힐링의 순간은 언제일까? 다양한 상황 속에서 네가 어떤 힐링 여행 스타일인지를 알아보자!",
    emoji: "🧳",
    color: "from-purple-500 to-pink-500",
    duration: "약 3분",
    questions: 4,
    href: "/healingJourney-test",
    features: ["AI 맞춤 분석", "나만의 결과지", "궁합 확인"],
    isAvailable: true
  },
  {
    id: "petPersonalityPreference",
    category: "PERSONALITY",
    title: "내 반려동물이 나의 취향을 알려줄까?",
    subtitle: "너의 취향은 어떤 반려동물 타입인지 알아보자!",
    description: "반려동물의 성격을 통해 내 취향을 알아보는 흥미로운 심리 테스트! 각 질문마다 너의 반려동물을 떠올리면서 답해봐. 그럼 어떤 취향의 소유자인지 확인해볼까?",
    emoji: "🐾",
    color: "from-purple-500 to-pink-500",
    duration: "약 3분",
    questions: 10,
    href: "/petPersonalityPreference-test",
    features: ["AI 맞춤 분석", "나만의 결과지", "궁합 확인"],
    isAvailable: true
  },
  {
    id: "dopamine-test",
    category: "HOT",
    title: "도파민 중독 성향 테스트",
    subtitle: "나의 도파민 원천은?",
    description: "숏폼 망령, 탕후루 흡입러, 소비요정 지름신, 갓생 호소인 등 당신의 도파민 중독 유형을 팩폭으로 분석합니다.",
    emoji: "📱",
    color: "from-indigo-500 to-pink-500",
    duration: "약 3분",
    questions: 12,
    href: "/dopamine-test",
    features: [
      "4가지 도파민 중독 유형 분석",
      "뼈때리는 팩트폭력 특징",
      "도파민 메이트 궁합",
      "쿠팡 제휴 맞춤 아이템 추천"
    ],
    isAvailable: true
  },
  {
    id: "mbti",
    category: "PERSONALITY",
    title: "MBTI 성격유형 검사",
    subtitle: "나의 진짜 성격 찾기",
    description: "과학적으로 검증된 MBTI 성격유형 검사로 당신의 숨겨진 성격과 잠재력을 발견하세요.",
    emoji: "🧠",
    color: "from-blue-500 to-purple-600",
    duration: "10분",
    questions: 60,
    href: "/test",
    features: [
      "16가지 성격유형 분석",
      "강점과 약점 파악",
      "추천 직업군",
      "궁합 분석"
    ],
    isAvailable: true
  },
  {
    id: "teto-egen",
    category: "HOT",
    title: "테토 vs 에겐 진단",
    subtitle: "호르몬 성향 분석",
    description: "당신의 테스토스테론과 에스트로겐 성향을 4가지 유형으로 분석해보세요.",
    emoji: "⚡",
    color: "from-blue-400 to-purple-400",
    duration: "10분",
    questions: 21,
    href: "/teto-egen-test",
    features: [
      "4가지 유형 분석",
      "정확한 비율 측정",
      "연애 궁합 분석",
      "호르몬 밸런스 표시"
    ],
    isAvailable: true
  },
  {
    id: "self-awareness-test",
    category: "FUN",
    title: "나는 지금 어떤 상태일까?",
    subtitle: "현재 컨디션 자가진단",
    description: "현재 나의 상태와 컨디션을 재미있게 체크해보세요. 건전하고 유머러스한 자가진단 테스트입니다.",
    emoji: "😵‍💫",
    color: "from-purple-500 to-pink-500",
    duration: "약 3분",
    questions: 10,
    href: "/drunk-test",
    features: [
      "4가지 상태 레벨 진단",
      "유머러스한 결과",
      "재미있는 자가진단",
      "SNS 공유 최적화"
    ],
    isAvailable: true
  },
  {
    id: "hogu-test",
    category: "LOVE",
    title: "연애 호구력 진단",
    subtitle: "나는 육식계일까, 초식계일까?",
    description: "끌려다니는 연애는 이제 그만! 당신의 연애 상대 우위와 호구력을 팩폭으로 진단합니다.",
    emoji: "💔",
    color: "from-rose-500 to-pink-600",
    duration: "약 4분",
    questions: 12,
    href: "/hogu-test",
    features: [
      "4가지 연애 포식자/초식동물 유형",
      "뼈때리는 팩트폭력 분석",
      "쿠팡 제휴 찰떡 아이템 추천",
      "연애 처방전 제공"
    ],
    isAvailable: true
  },
  {
    id: "love",
    category: "LOVE",
    title: "연애유형 검사",
    subtitle: "나의 사랑 스타일 알아보기",
    description: "당신의 연애 스타일과 이상형, 연애에서 중요하게 생각하는 가치를 알아보세요.",
    emoji: "💕",
    color: "from-pink-500 to-rose-600",
    duration: "7분",
    questions: 40,
    href: "/love-test",
    features: [
      "연애 스타일 분석",
      "이상형 파악",
      "사랑의 언어",
      "연애 조언"
    ],
    isAvailable: false
  },
  {
    id: "career",
    category: "CAREER",
    title: "직업적성 검사",
    subtitle: "나에게 맞는 직업 찾기",
    description: "당신의 성향과 능력에 맞는 최적의 직업과 진로를 추천해드립니다.",
    emoji: "🚀",
    color: "from-green-500 to-emerald-600",
    duration: "12분",
    questions: 80,
    href: "/career-test",
    features: [
      "적성 분야 분석",
      "추천 직업군",
      "역량 개발 방향",
      "진로 로드맵"
    ],
    isAvailable: false
  },
  {
    id: "stress",
    category: "PERSONALITY",
    title: "스트레스 유형 검사",
    subtitle: "나만의 스트레스 해소법",
    description: "당신이 스트레스를 받는 상황과 효과적인 해소 방법을 알아보세요.",
    emoji: "🧘",
    color: "from-indigo-500 to-blue-600",
    duration: "8분",
    questions: 50,
    href: "/stress-test",
    features: [
      "스트레스 원인 분석",
      "대처 방식 파악",
      "맞춤 해소법",
      "건강 관리 팁"
    ],
    isAvailable: false
  },
  {
    id: "communication",
    category: "PERSONALITY",
    title: "소통 스타일 검사",
    subtitle: "나의 대화법 알아보기",
    description: "당신의 소통 스타일과 다른 사람과 더 잘 어울리는 방법을 알아보세요.",
    emoji: "🗣️",
    color: "from-orange-500 to-red-600",
    duration: "9분",
    questions: 45,
    href: "/communication-test",
    features: [
      "소통 스타일 분석",
      "경청 능력 측정",
      "갈등 해결 방식",
      "관계 개선 팁"
    ],
    isAvailable: false
  },
  {
    id: "leadership",
    category: "CAREER",
    title: "리더십 유형 검사",
    subtitle: "나의 리더십 스타일",
    description: "당신만의 리더십 스타일과 팀을 이끄는 방식을 알아보세요.",
    emoji: "👑",
    color: "from-yellow-500 to-orange-600",
    duration: "11분",
    questions: 55,
    href: "/leadership-test",
    features: [
      "리더십 유형 분석",
      "팀 운영 방식",
      "의사결정 스타일",
      "성장 방향"
    ],
    isAvailable: false
  }
];

export const getAvailableTests = () => testTypes.filter(test => test.isAvailable);
export const getComingSoonTests = () => testTypes.filter(test => !test.isAvailable);