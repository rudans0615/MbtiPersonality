export const calculateSnsHabitTest2024TestLevel = (score: number) => {
  const keys = Object.keys(snsHabitTest2024Results);
  const numKeys = keys.length;
  if (numKeys === 0) return "";
  const maxScore = 8 * 4;
  const minScore = 8;
  const range = maxScore - minScore;
  const step = range / numKeys;
  const idx = Math.min(Math.floor((score - minScore) / step), numKeys - 1);
  return keys[Math.max(0, idx)];
};

export const snsHabitTest2024Results: Record<string, any> = {
  "lowAddiction": {
    "title": "적당히 즐기는 타입",
    "emoji": "😊",
    "subtitle": "SNS는 가끔씩!",
    "description": "너는 SNS를 적당히 활용하는 편이야. 필요할 때만 사용하고 있어, 일상 속에서 다른 활동이 더 중요하다고 느끼는 타입이야. 이런 균형 감각이 정말 소중해!",
    "characteristics": [
      "균형 잡힌 일상",
      "필요함을 느끼는 활용",
      "비교적 긍정적 사고",
      "다양한 활동 선호"
    ],
    "coupangKeyword": "미니멀 스마트폰"
  },
  "mediumAddiction": {
    "title": "SNS 중독 경계 타입",
    "emoji": "😅",
    "subtitle": "조금 더 조심해!",
    "description": "SNS에 어느 정도 의존하고 있는 편이야. 때때로 정보 과부하를 느낄 수 있어. 자주 체크하고 싶지만, 균형을 이룰 필요가 있어. 시간 관리가 필요할 것 같아!",
    "characteristics": [
      "정보 과부하 경향",
      "자주 SNS 체크",
      "친구들과 소통 중시",
      "조금 더 균형 필요"
    ],
    "coupangKeyword": "시간 관리 다이어리"
  },
  "highAddiction": {
    "title": "SNS 중독자",
    "emoji": "😵",
    "subtitle": "SNS 없이 못 살아!",
    "description": "너는 SNS가 없는 생활을 상상하기 어려운 타입이야. 일상이 SNS에 맞춰져 있어, 하지만 이런 중독은 건강에 좋지 않을 수 있어. 잠시의 휴식이 필요할 듯!",
    "characteristics": [
      "일상이 SNS 중심",
      "정보 소비 과다",
      "소통을 위한 SNS 중독",
      "휴식 필요"
    ],
    "coupangKeyword": "디지털 디톡스"
  }
};