export const calculateSocialMediaHabitsTestLevel = (score: number) => {
  const keys = Object.keys(socialMediaHabitsResults);
  const numKeys = keys.length;
  if (numKeys === 0) return "";
  const maxScore = 12 * 4;
  const minScore = 12;
  const range = maxScore - minScore;
  const step = range / numKeys;
  const idx = Math.min(Math.floor((score - minScore) / step), numKeys - 1);
  return keys[Math.max(0, idx)];
};

export const socialMediaHabitsResults: Record<string, any> = {
  "highAddicted": {
    "title": "SNS 중독자",
    "emoji": "😅",
    "subtitle": "SNS 없이는 살 수 없는 당신!",
    "description": "벌써 중독이라는 이야기를 몇 번이나 들었을지 몰라. SNS를 통해 순간순간을 즐기는 타입이야. 하지만 가끔은 디지털 디톡스를 하면서 나 자신에게 휴식을 주는 게 중요해.",
    "characteristics": [
      "행복한 표현을 강하게 한다",
      "너무 SNS에 의존해 버릴 수 있다",
      "편안한 피드를 위해 알림을 확인하는 충건",
      "나만의 이야기보다 타인의 안부는 가겨할 때가 많다"
    ],
    "coupangKeyword": "디지털 디톡스 제품"
  },
  "mediumAddicted": {
    "title": "제로금 중독형",
    "emoji": "😂",
    "subtitle": "좀 씁쓸한 반전 캐릭터",
    "description": "SNS를 좋아하긴 하지만 본래 그럴 필요 없다고 느끼고 유형이 있군. 너무 최적 상태는 아니라고 스스로 자신을 지키고 있다는 지느러미!",
    "characteristics": [
      "소소한 즐거움으로 간직하는 편",
      "대화 및 소통을 중심으로 한 외향적인 스타일",
      "신박함을 동경 그러나 진정 정보의 비빌러머일 최신 공유 내부자",
      "시청 폭증 위주 알림을 역겨워함 뛰어다니기 힘든 데이터"
    ],
    "coupangKeyword": "인스타그램 관련 소품"
  },
  "lowAddicted": {
    "title": "의식적으로 일 겸 기복 전문가",
    "emoji": "😎",
    "subtitle": "타킷을 정해놓고 즐기는 스타일",
    "description": "최고 의미를 찾으며 과거 내 것을 두고 어떡Figures 창현! 카톡이랍시고 여느, 시원한 효원위주 접근하잖아?” 구성욕 중지형 MB 종료..",
    "characteristics": [
      "딱히 유통 동산 성향을 가지지 않는 착한 자",
      "꼭 기출시키며 이 지역 형식에서 빨리 접중"
    ]
  },
  "coupangKeyword": "단순한 인공지능 모드"
};