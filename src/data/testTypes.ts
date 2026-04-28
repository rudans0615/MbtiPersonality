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
    id: "roommateAirQuality",
    category: "PERSONALITY",
    title: "룸메의 공기질로 알아보는 나의 흑역사 유형은?",
    subtitle: "너도 몰랐던 내 과거의 흔적들!",
    description: "룸메와 생활하면서 느꼈던 다양한 공기질 상황을 통해 나의 흑역사 유형을 알아보는 테스트야! 재밌게 풀어보고 친구들과 공유해봐~",
    emoji: "🌬️",
    color: "from-purple-500 to-pink-500",
    duration: "약 3분",
    questions: 8,
    href: "/roommateAirQuality",
    features: ["AI 맞춤 분석", "나만의 결과지", "궁합 확인"],
    isAvailable: true
  },
  {
    id: "myPetHealingStyle",
    category: "PERSONALITY",
    title: "너와 내 반려동물의 힐링 조화 체크해볼까?",
    subtitle: "누구보다 반려동물과의 힐링 스타일을 알고 싶다면?",
    description: "너의 반려동물과의 소중한 시간을 통해 나의 힐링 스타일을 알아보자! 이 테스트는 너와 너의 반려동물 간의 조화를 분석해줄 거야. 테스트를 통해 힐링하는 방법과 나만의 휴식 스타일을 찾아보자!",
    emoji: "🐾",
    color: "from-purple-500 to-pink-500",
    duration: "약 3분",
    questions: 12,
    href: "/myPetHealingStyle",
    features: ["AI 맞춤 분석", "나만의 결과지", "궁합 확인"],
    isAvailable: true
  },
  {
    id: "petStressRelief",
    category: "FUN",
    title: "너의 반려동물로 보는 스트레스 해소 유형은?",
    subtitle: "과연 너는 반려동물과 어떤 힐링을 하고 있을까?",
    description: "반려동물과의 일상 속에서 발견할 수 있는 나만의 스트레스 해소 방법을 알아보는 재미있는 테스트야! 푹 빠져 있는 너의 반려동물과의 소소한 일상 속에서 스트레스를 어떻게 날리고 있는지 확인해보자!",
    emoji: "🐾",
    color: "from-purple-500 to-pink-500",
    duration: "약 3분",
    questions: 12,
    href: "/petStressRelief",
    features: ["AI 맞춤 분석", "나만의 결과지", "궁합 확인"],
    isAvailable: true
  },
  {
    id: "travelMood2023",
    category: "FUN",
    title: "지금 당신의 여행 스타일은?",
    subtitle: "내가 찾는 힐링의 순간은 어떤 걸까?",
    description: "바쁜 일상 속에서 잠깐의 여유와 힐링이 필요한 순간! 내 여행 스타일을 알아보고, 진정한 나만의 휴식법을 찾아보세요. 너무 다양한 방법들이 있으니, 당신에게 꼭 맞는 여행 방법을 발견하는 재미를 느껴보세요!",
    emoji: "🌍",
    color: "from-purple-500 to-pink-500",
    duration: "약 3분",
    questions: 8,
    href: "/travelMood2023-test",
    features: ["AI 맞춤 분석", "나만의 결과지", "궁합 확인"],
    isAvailable: true
  },
  {
    id: "socialMediaHabitTest2024",
    category: "FUN",
    title: "내가 어떤 SNS 중독자인지 알아보자!",
    subtitle: "소셜 미디어 사용 습관 진단해볼 사람?",
    description: "내 SNS 사용 스타일을 파헤쳐 볼 시간! 친구와 함께 공유하고, 제일 잘 맞는 유형을 찾아보세요. 내 SNS 중독이 어떤 모습인지 재밌게 알아볼 수 있어요!",
    emoji: "📱",
    color: "from-purple-500 to-pink-500",
    duration: "약 3분",
    questions: 12,
    href: "/socialMediaHabitTest2024-test",
    features: ["AI 맞춤 분석", "나만의 결과지", "궁합 확인"],
    isAvailable: true
  },
  {
    id: "shoppingMoodTest1234",
    category: "FUN",
    title: "당신의 쇼핑 기분은 어떤 타입?",
    subtitle: "소비를 통해 드러나는 내 마음의 소리",
    description: "너의 쇼핑 기분을 알아보자! 어떤 상황에서 소비를 하게 되면 나의 진짜 감정이 드러나는 걸까? 이 테스트를 통해 네가 어떤 소비 습관을 가지고 있는지, 그리고 그 기분에 따라 어떤 행동을 하는지 확인해보자. 친구들과 함께 해보고, 서로의 쇼핑 타입을 비교해보는 것도 재미있을 거야!",
    emoji: "🛍️",
    color: "from-purple-500 to-pink-500",
    duration: "약 3분",
    questions: 12,
    href: "/shoppingMoodTest1234-test",
    features: ["AI 맞춤 분석", "나만의 결과지", "궁합 확인"],
    isAvailable: true
  },
  {
    id: "workLifeBalanceTest",
    category: "CAREER",
    title: "너의 직장 생활, 적성 테스트!",
    subtitle: "퇴사 후의 삶은 어떤 모습일까?",
    description: "너의 직장 생활 스타일과 퇴사 후 꿈을 알아보는 테스트야! 같이 해보면서 ‘ㅋㅋㅋ 이거 완전 나잖아’ 하는 순간을 찾아봐!",
    emoji: "💼",
    color: "from-purple-500 to-pink-500",
    duration: "약 3분",
    questions: 12,
    href: "/workLifeBalanceTest",
    features: ["AI 맞춤 분석", "나만의 결과지", "궁합 확인"],
    isAvailable: true
  },
  {
    id: "seasonalMoodTest",
    category: "PERSONALITY",
    title: "당신의 계절별 감정 상태는?",
    subtitle: "어떤 계절에 더 우울해지거나 행복한지 알아보자!",
    description: "계절에 따라 감정이 어떻게 변하는지 궁금하지 않아? 이 테스트를 통해 당신의 계절별 감정 상태를 확인해보고, 나와 비슷한 친구들과 공유해봐!",
    emoji: "🍂",
    color: "from-purple-500 to-pink-500",
    duration: "약 3분",
    questions: 12,
    href: "/seasonalMoodTest",
    features: ["AI 맞춤 분석", "나만의 결과지", "궁합 확인"],
    isAvailable: true
  },
  {
    id: "travelFriendCompatibility",
    category: "FUN",
    title: "내 MBTI로 알아보는 최애 여행지 친구 궁합✈️",
    subtitle: "너의 성격에 맞는 여행지와 친구의 조화는?",
    description: "내 MBTI 성향에 따라 최애 여행지와 그곳에서 잘 맞는 친구 유형을 알아보자! 여행을 떠나고 싶은 그날, 어떤 친구와 함께하면 좋을지 체크해보세요!",
    emoji: "🌍",
    color: "from-purple-500 to-pink-500",
    duration: "약 3분",
    questions: 8,
    href: "/travelFriendCompatibility",
    features: ["AI 맞춤 분석", "나만의 결과지", "궁합 확인"],
    isAvailable: true
  },
  {
    id: "socialMediaHabitsTest",
    category: "FUN",
    title: "너의 SNS 소비 스타일은?",
    subtitle: "당신의 SNS에서의 숨은 취향을 알아봐!",
    description: "매일매일 무심코 소비하는 SNS, 과연 어떤 스타일인지 간단한 테스트로 알아보자! 어떤 영상이 당신을 끌어들이는지, SNS 크리에이터와의 궁합은 어떤지 스스로를 돌아보는 재미있고 흥미로운 시간이 될 거야. 자, 그럼 시작해볼까?",
    emoji: "📱",
    color: "from-purple-500 to-pink-500",
    duration: "약 3분",
    questions: 12,
    href: "/socialMediaHabitsTest",
    features: ["AI 맞춤 분석", "나만의 결과지", "궁합 확인"],
    isAvailable: true
  },
  {
    id: "friendshipCompatibility",
    category: "PERSONALITY",
    title: "내 친구와의 우정, 얼마나 잘 맞을까?",
    subtitle: "너와 친구의 궁합 테스트!",
    description: "너와 친구의 우정의 깊이를 테스트해봐! 당신의 성향이 친구와 얼마나 잘 맞는지 알게 될 거야. 친구 관계를 보다 즐겁고 특별하게 만들어보자!",
    emoji: "👭",
    color: "from-purple-500 to-pink-500",
    duration: "약 3분",
    questions: 12,
    href: "/friendshipCompatibility",
    features: ["AI 맞춤 분석", "나만의 결과지", "궁합 확인"],
    isAvailable: true
  },
  {
    id: "socialMediaHabits",
    category: "FUN",
    title: "당신의 SNS 중독 지수는?",
    subtitle: "SNS 생활을 통해 알아보는 나의 уникальный 관리 포인트!",
    description: "SNS를 들여다보면 내 속마음이 보이는 법! 당신의 SNS 사용 습관을 통해 과연 어떤 타입인지 알아보자! 경쾌하고 재밌는 시간이 될 거야~",
    emoji: "📱",
    color: "from-purple-500 to-pink-500",
    duration: "약 3분",
    questions: 12,
    href: "/socialMediaHabits",
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
    href: "/petPersonalityPreference",
    features: ["AI 맞춤 분석", "나만의 결과지", "궁합 확인"],
    isAvailable: true
  },
  {
    id: "dopamine",
    category: "HOT",
    title: "도파민 중독 성향 테스트",
    subtitle: "나의 도파민 원천은?",
    description: "숏폼 망령, 탕후루 흡입러, 소비요정 지름신, 갓생 호소인 등 당신의 도파민 중독 유형을 팩폭으로 분석합니다.",
    emoji: "📱",
    color: "from-indigo-500 to-pink-500",
    duration: "약 3분",
    questions: 12,
    href: "/dopamine",
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
    href: "/teto-egen",
    features: [
      "4가지 유형 분석",
      "정확한 비율 측정",
      "연애 궁합 분석",
      "호르몬 밸런스 표시"
    ],
    isAvailable: true
  },
  {
    id: "drunk",
    category: "FUN",
    title: "나는 지금 어떤 상태일까?",
    subtitle: "현재 컨디션 자가진단",
    description: "현재 나의 상태와 컨디션을 재미있게 체크해보세요. 건전하고 유머러스한 자가진단 테스트입니다.",
    emoji: "😵‍💫",
    color: "from-purple-500 to-pink-500",
    duration: "약 3분",
    questions: 10,
    href: "/drunk",
    features: [
      "4가지 상태 레벨 진단",
      "유머러스한 결과",
      "재미있는 자가진단",
      "SNS 공유 최적화"
    ],
    isAvailable: true
  },
  {
    id: "hogu",
    category: "LOVE",
    title: "연애 호구력 진단",
    subtitle: "나는 육식계일까, 초식계일까?",
    description: "끌려다니는 연애는 이제 그만! 당신의 연애 상대 우위와 호구력을 팩폭으로 진단합니다.",
    emoji: "💔",
    color: "from-rose-500 to-pink-600",
    duration: "약 4분",
    questions: 12,
    href: "/hogu",
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
    href: "/love",
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
    href: "/career",
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
    href: "/stress",
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
    href: "/communication",
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
    href: "/leadership",
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