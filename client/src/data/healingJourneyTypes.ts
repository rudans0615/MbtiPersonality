export const calculateHealingJourneyTestLevel = (score: number) => {
  const keys = Object.keys(healingJourneyResults);
  const numKeys = keys.length;
  if (numKeys === 0) return "";
  const maxScore = 8 * 4;
  const minScore = 8;
  const range = maxScore - minScore;
  const step = range / numKeys;
  const idx = Math.min(Math.floor((score - minScore) / step), numKeys - 1);
  return keys[Math.max(0, idx)];
};

export const healingJourneyResults: Record<string, any> = {
  "typeA": {
    "title": "마음의 안식처",
    "emoji": "🧘‍♀️",
    "subtitle": "혼자만의 시간이 필요한 당신",
    "description": "당신은 혼자 있는 시간을 소중히 여기며, 조용한 공간에서 힐링할 수 있는 스타일이에요. 자연이나 편안한 카페에서 시간을 보내는 걸 좋아해요.",
    "characteristics": [
      "혼자만의 시간이 필요해",
      "자연에서 힐링을 찾아",
      "조용한 곳을 선호해",
      "여유로운 일상이 좋아"
    ],
    "coupangKeyword": "혼자 놀기 용품"
  },
  "typeB": {
    "title": "소셜 힐러",
    "emoji": "👯‍♀️",
    "subtitle": "사람들과의 교류가 중요한 당신",
    "description": "당신은 친구들과의 시간에서 에너지를 얻어요. 함께 하는 활동을 통해 스트레스를 풀고 힐링하는 걸 좋아해요.",
    "characteristics": [
      "친구들과의 만남이 중요해",
      "소셜 활동을 즐겨",
      "맛있는 음식을 사랑해",
      "화기애애한 분위기를 선호"
    ],
    "coupangKeyword": "모임 용품"
  },
  "typeC": {
    "title": "자연의 품에",
    "emoji": "🌳",
    "subtitle": "자연 속에서의 힐링을 추구하는 당신",
    "description": "당신은 자연과 연결되며 힐링하는 걸 가장 좋아해요. 산, 바다, 숲 등에서 편안함을 느껴요.",
    "characteristics": [
      "자연을 사랑해",
      "하이킹이나 캠핑을 즐겨",
      "실외 활동이 최고야",
      "자연이 주는 평화로운 에너지를 느껴"
    ],
    "coupangKeyword": "아웃도어 용품"
  },
  "typeD": {
    "title": "도전하는 힐러",
    "emoji": "🌟",
    "subtitle": "새로운 것에 도전하며 힐링하는 당신",
    "description": "당신은 새로운 경험을 통해 힐링을 느껴요. 다양한 활동에 도전하며 에너지를 얻고, 그 과정에서 스트레스를 해소해요.",
    "characteristics": [
      "새로운 경험을 사랑해",
      "모험심이 강해",
      "자신을 발전시키는 걸 좋아해",
      "도전이 주는 자극을 즐겨"
    ],
    "coupangKeyword": "체험 프로그램"
  }
};