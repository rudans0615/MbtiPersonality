export const calculateShoppingMysteryTestLevel = (score: number) => {
  const keys = Object.keys(shoppingMysteryResults);
  const numKeys = keys.length;
  if (numKeys === 0) return "";
  const maxScore = 3 * 4;
  const minScore = 3;
  const range = maxScore - minScore;
  const step = range / numKeys;
  const idx = Math.min(Math.floor((score - minScore) / step), numKeys - 1);
  return keys[Math.max(0, idx)];
};

export const shoppingMysteryResults: Record<string, any> = {
  "typeA": {
    "title": "가성비 여왕",
    "emoji": "💰",
    "subtitle": "현명한 소비자의 정석",
    "description": "가성비를 최우선으로 생각하는 네 스타일, 항상 최적의 선택을 위해 노력해!",
    "characteristics": [
      "즉흥적이지 않고 계획적으로 쇼핑해",
      "항상 할인과 적립금을 챙겨",
      "경험을 중시하며 소비해",
      "불필요한 물건은 피하는 편이야"
    ],
    "coupangKeyword": "가성비 상품"
  },
  "typeB": {
    "title": "트렌드 수집가",
    "emoji": "✨",
    "subtitle": "유행을 따라가는 스타일",
    "description": "최신 유행을 놓칠 수 없는 너! 항상 남들과 다른 스타일을 유지하려고 해.",
    "characteristics": [
      "트렌드에 민감해 최신 아이템을 빠르게 가져가",
      "SNS에서 영감을 많이 받아",
      "일찍 오픈하는 매장에 가는 걸 좋아해",
      "친구들의 쇼핑 리스트도 돕는 편이야"
    ],
    "coupangKeyword": "트렌디 아이템"
  },
  "typeC": {
    "title": "소확행 중시",
    "emoji": "🌼",
    "subtitle": "작은 행복을 소중히 여겨",
    "description": "소소한 행복을 찾는 것이 넌데, 너무 많은 것에 집착하지 않아!",
    "characteristics": [
      "묵직한 소비보단 소소하게 즐기는 경향이 있어",
      "가끔은 불필요한 것도 기분 전환을 위해 구매해...",
      "장기적으로 행복을 추구해",
      "소소한 만족을 여러 곳에서 찾아"
    ],
    "coupangKeyword": "행복 아이템"
  },
  "typeD": {
    "title": "철저한 계획가",
    "emoji": "📝",
    "subtitle": "계획 없는 소비는 없다!",
    "description": "모든 결정은 철저하게 계산해. 알뜰 소비는 기본 헌신이야!",
    "characteristics": [
      "상황마다 예산을 미리 고려해",
      "소비하기 전 항상 많은 조사를 해야 해",
      "지원 계획이 없이는 절대 소비하지 않음",
      "재테크도 놓치지 않아"
    ],
    "coupangKeyword": "경제적 계획서"
  }
};