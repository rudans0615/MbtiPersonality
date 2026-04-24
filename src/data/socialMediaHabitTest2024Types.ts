export const calculateSocialMediaHabitTest2024TestLevel = (score: number) => {
  const keys = Object.keys(socialMediaHabitTest2024Results);
  const numKeys = keys.length;
  if (numKeys === 0) return "";
  const maxScore = 12 * 4;
  const minScore = 12;
  const range = maxScore - minScore;
  const step = range / numKeys;
  const idx = Math.min(Math.floor((score - minScore) / step), numKeys - 1);
  return keys[Math.max(0, idx)];
};

export const socialMediaHabitTest2024Results: Record<string, any> = {
  "exhibitionist": {
    "title": "SNS 스타",
    "emoji": "🌟",
    "subtitle": "모두의 주목을 받는 타입!",
    "description": "너는 SNS에서 항상 활발하게 활동하고, 친구들과 함께하는 것보다 자신의 일상을 공유하는 데 더 많은 관심이 있어. 다른 사람의 반응이 너에게 큰 의미를 주고, 피드백을 통해 에너지를 얻는 타입이야. 하지만 너무 자주 올리면 피로감이 올 수도 있으니 조절하는 게 좋아.",
    "characteristics": [
      "자신의 일상을 소중히 여김",
      "다른 사람들의 반응을 중요시함",
      "트렌드에 민감함",
      "새로운 정보에 열려 있음"
    ],
    "coupangKeyword": "SNS 액세서리"
  },
  "introvert": {
    "title": "조용한 관찰자",
    "emoji": "🌼",
    "subtitle": "내 생각만 소중히 여기는 타입!",
    "description": "너는 SNS에서 자주 활동하지 않는 편이야. 다른 사람들과의 소통보다는 혼자만의 사색이나 자료 수집에 더 많은 시간을 할애하는 스타일이야. 물론 필요할 때는 정보를 검색하기도 하지만, 지극히 개인적인 공간을 중요시 여기는 타입이야.",
    "characteristics": [
      "혼자 있는 시간을 소중히 여김",
      "자신의 스타일을 중요시함",
      "소통보다는 내재적 가치 중시",
      "안정된 일상 추구"
    ],
    "coupangKeyword": "개인 다이어리"
  }
};