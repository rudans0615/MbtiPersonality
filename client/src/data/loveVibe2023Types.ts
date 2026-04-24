export const calculateLoveVibe2023TestLevel = (score: number) => {
  const keys = Object.keys(loveVibe2023Results);
  const numKeys = keys.length;
  if (numKeys === 0) return "";
  const maxScore = 8 * 4;
  const minScore = 8;
  const range = maxScore - minScore;
  const step = range / numKeys;
  const idx = Math.min(Math.floor((score - minScore) / step), numKeys - 1);
  return keys[Math.max(0, idx)];
};

export const loveVibe2023Results: Record<string, any> = {
  "passionateLover": {
    "title": "열정적인 사랑꾼",
    "emoji": "🔥",
    "subtitle": "사랑에 모든 것을 걸어!",
    "description": "당신은 항상 사랑에 열정적이고, 상대방에게 깊은 감정을 쏟는 타입이에요. 사랑을 위해서는 행동도 서슴지 않죠. 이런 모습이 상대방에게 매력으로 다가오곤 해요. 하지만 때로는 상대방에게 부담이 될 수 있는 점도 있으니 조절이 필요해요.",
    "characteristics": [
      "사랑에 열정적",
      "상대방에게 깊은 감정",
      "행동력이 뛰어남",
      "때로는 부담을 줄 수 있음"
    ],
    "coupangKeyword": "연애 관련 도서"
  },
  "cautiousDater": {
    "title": "조심스러운 데이트러",
    "emoji": "🤔",
    "subtitle": "맡길 건 맡기고, 지켜볼 건 지켜봐!",
    "description": "당신은 연애에 대해 신중하게 접근하는 타입이에요. 상대방이 마음에 들 때도 쉽게 마음을 열지 않죠. 사랑에 대한 기대감과 두려움이 공존하는 모습을 보이는데, 그래서 더 신중하게 연애를 하게 돼요.",
    "characteristics": [
      "신중한 접근",
      "상대방을 지켜보는 편",
      "기대와 두려움 공존",
      "안정적인 연애 선호"
    ],
    "coupangKeyword": "연애 심리학"
  },
  "carefreeRomantic": {
    "title": "자유로운 로맨티스트",
    "emoji": "🌼",
    "subtitle": "사랑은 즐기는 것!",
    "description": "당신은 연애를 너무 진지하게 생각하지 않는 타입이에요. 마음이 가는 대로 자연스럽게 흘러가길 원하죠. 이런 자유로운 생각 덕분에, 사랑도 그리 어렵지 않게 다가가곤 해요. 가끔은 이런 태도가 상대방에게 불안감을 줄 수도 있어요.",
    "characteristics": [
      "즐겁고 자유로운 연애",
      "자연스러운 접근",
      "사랑을 어려워하지 않음",
      "상대에게 불안감을 줄 수 있음"
    ],
    "coupangKeyword": "데이트 코스"
  },
  "detachedObserver": {
    "title": "냉철한 관찰자",
    "emoji": "🧐",
    "subtitle": "사랑은 분석의 대상!",
    "description": "당신은 연애를 냉정하게 바라보는 경향이 있어요. 감정보다 이성적으로 상황을 분석하고 이해하려는 타입이에요. 이런 모습이 때로는 상대방을 멀어지게 할 수 있지만, 당신은 관계에 대한 신중함이 큰 장점이기도 해요.",
    "characteristics": [
      "냉정한 시각",
      "이성적으로 접근",
      "관계의 신중함",
      "사랑에 대한 회의적 시각"
    ],
    "coupangKeyword": "연애 심리 분석서"
  }
};