export const calculateFoodPreference2023TestLevel = (score: number) => {
  const keys = Object.keys(foodPreference2023Results);
  const numKeys = keys.length;
  if (numKeys === 0) return "";
  const maxScore = 8 * 4;
  const minScore = 8;
  const range = maxScore - minScore;
  const step = range / numKeys;
  const idx = Math.min(Math.floor((score - minScore) / step), numKeys - 1);
  return keys[Math.max(0, idx)];
};

export const foodPreference2023Results: Record<string, any> = {
  "spicyLover": {
    "title": "매운맛 애호가",
    "emoji": "🌶️",
    "subtitle": "매운 음식이 인생의 활력!",
    "description": "매운 음식을 즐기는 넌 도전 정신이 강하고, 어떤 문제에도 당당히 맞서겠다는 성향이 있어. 매운 음식과 함께하는 순간들이 널 더욱 강하게 만들어주지. 친구들과의 소중한 시간도 매운 음식을 함께 나누면 더욱 특별해져. 하지만 가끔은 매운 음식에 중독될 수 있으니 조절해!",
    "characteristics": [
      "도전적 성격",
      "사교적이고 외향적",
      "스트레스 해소 방법으로 매운 음식",
      "자신감 넘치는 선택"
    ],
    "coupangKeyword": "매운 음식 배달"
  },
  "pizzaFan": {
    "title": "피자 마니아",
    "emoji": "🍕",
    "subtitle": "피자와 함께하는 모든 순간이 행복!",
    "description": "다양한 토핑이 담긴 피자를 사랑하는 넌 다양한 경험에도 열려있고, 친구들과의 소중한 시간을 소중히 여기지. 피자는 언제나 올바른 선택이야. 그러나 가끔은 비슷한 것만 계속 고르지 않도록 새로운 메뉴에도 도전해보는 걸 추천해!",
    "characteristics": [
      "다양한 취향",
      "미식을 사랑하는 개성",
      "편안하고 안정적인 선택",
      "소셜 미디어에서 공유하는 거 좋아"
    ],
    "coupangKeyword": "피자 배달"
  },
  "healthyEater": {
    "title": "건강식 애호가",
    "emoji": "🥗",
    "subtitle": "건강한 선택이 우선!",
    "description": "건강식에 집중하는 넌 자기 관리에 대한 열망이 강해. 너는 자신의 건강을 소중히 여기기 때문에 식사 선택에 신경을 많이 쓰지. 하지만 가끔은 즐거움을 위해 한 번쯤은 맛있는 간식을 먹어보는 것도 나쁘지 않아!",
    "characteristics": [
      "자기 관리 중시",
      "건강과 웰빙을 위한 노력",
      "소소한 행복 소중히 여김",
      "자신을 사랑하는 타입"
    ],
    "coupangKeyword": "건강식 배달"
  },
  "sweetTooth": {
    "title": "달콤한 디저트 애호가",
    "emoji": "🍰",
    "subtitle": "달콤한 것에 대한 사랑은 끝이 없어!",
    "description": "달콤한 디저트를 사랑하는 넌 삶의 작은 기쁨을 놓치지 않아. 친구들과의 소중한 추억도 달콤한 맛과 함께 만들어가는 걸 좋아하지. 그러나 가끔은 새로운 디저트를 시도해보는 것도 즐거운 경험이 될 수 있어!",
    "characteristics": [
      "일상 속 작은 행복 추구",
      "디저트에 대한 깊은 애정",
      "친구들과의 소중한 기억 만들어",
      "새로운 것에 도전하는 용기"
    ],
    "coupangKeyword": "디저트 배달"
  }
};