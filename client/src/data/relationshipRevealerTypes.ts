export const calculateRelationshipRevealerTestLevel = (score: number) => {
  const keys = Object.keys(relationshipRevealerResults);
  const numKeys = keys.length;
  if (numKeys === 0) return "";
  const maxScore = 12 * 4;
  const minScore = 12;
  const range = maxScore - minScore;
  const step = range / numKeys;
  const idx = Math.min(Math.floor((score - minScore) / step), numKeys - 1);
  return keys[Math.max(0, idx)];
};

export const relationshipRevealerResults: Record<string, any> = {
  "carefreeLover": {
    "title": "여유로운 연애가득한 사람",
    "emoji": "🌈",
    "subtitle": "연애를 즐기는 타입",
    "description": "너는 연애를 가볍고 즐겁게 생각하는 사람인 것 같아! 너무 큰 부담 없이 재밌게 지내는 걸 좋아해.",
    "characteristics": [
      "재미를 중시하는 편",
      "솔직함이 매력",
      "편안한 관계 선호",
      "스트레스 없이 즐기는 연애"
    ],
    "coupangKeyword": "데이트 코스 추천"
  },
  "seriousRomantic": {
    "title": "진지한 연애 스타일",
    "emoji": "💔",
    "subtitle": "상대방을 깊이 이해하는 사람",
    "description": "너는 상대방과의 관계를 깊이 생각하며, 진지한 연애를 원해. 신뢰와 소통을 중요하게 여기는 타입이야!",
    "characteristics": [
      "신뢰가 최고 중요",
      "소통을 소중히 여김",
      "서로를 이해하려는 성향",
      "사소한 것에도 진지함"
    ],
    "coupangKeyword": "연애 심리학"
  },
  "adventurousHeart": {
    "title": "모험심 가득한 연애",
    "emoji": "✈️",
    "subtitle": "새로운 경험을 중시하는 사람",
    "description": "너는 연애에서도 새로운 경험을 추구하는 타입이야. 호기심이 가득하고 다양한 만남을 즐기는 모습이 보이네.",
    "characteristics": [
      "모험심 가득한 편",
      "새로운 것에 도전 좋아함",
      "다양한 사람들을 만남",
      "재미있고 신나는 연애 추구"
    ],
    "coupangKeyword": "여행 상품"
  },
  "cautiousHeart": {
    "title": "신중한 연애",
    "emoji": "🔒",
    "subtitle": "조심스러운 사람",
    "description": "너는 연애를 시작하는 게 어렵고 신중해. 다가가는 것도 조심스럽고, 상대방을 쉽게 믿지 않는 편이야.",
    "characteristics": [
      "신중한 편",
      "거리를 두는 경향",
      "상대방을 잘 알아가는 시간 필요",
      "가벼운 만남은 별로"
    ],
    "coupangKeyword": "연애 상담"
  }
};