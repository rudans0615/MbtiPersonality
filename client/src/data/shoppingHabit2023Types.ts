export const calculateShoppingHabit2023TestLevel = (score: number) => {
  const keys = Object.keys(shoppingHabit2023Results);
  const numKeys = keys.length;
  if (numKeys === 0) return "";
  const maxScore = 8 * 4;
  const minScore = 8;
  const range = maxScore - minScore;
  const step = range / numKeys;
  const idx = Math.min(Math.floor((score - minScore) / step), numKeys - 1);
  return keys[Math.max(0, idx)];
};

export const shoppingHabit2023Results: Record<string, any> = {
  "saver": {
    "title": "절약 전문가",
    "emoji": "💸",
    "subtitle": "지갑은 소중하지!",
    "description": "당신은 소비를 철저히 관리하는 타입이에요. 가격을 따지며, 항상 할인 상품을 찾고, 필요한 것만 구매해요. 가끔은 친구들에게 스마트한 소비 팁을 알려주기도 하죠. 하지만 그렇다 보니 너무 절약하게 되어 가끔 자기도 모르게 의욕이 떨어질 수 있어요.",
    "characteristics": [
      "돈 관리가 뛰어남",
      "소비에 대한 계획이 철저함",
      "할인 혜택을 놓치지 않음",
      "소비 후 뿌듯함을 느낌"
    ],
    "coupangKeyword": "저렴한 의류"
  },
  "trendsetter": {
    "title": "트렌드 리더",
    "emoji": "✨",
    "subtitle": "최신 유행에 민감한 당신!",
    "description": "당신은 패션과 트렌드에 민감한 타입이에요. 항상 최신 유행을 반영한 쇼핑을 즐기고, SNS에서 핫한 아이템들을 빠르게 찾아내요. 주변 친구들에게 추천하는 걸 즐기지만 가끔은 가격에 따라 망설일 때도 있죠. 어떤 면에서는 돈이 아까울 수 있어요.",
    "characteristics": [
      "유행을 선도함",
      "SNS 정보를 적극 활용함",
      "샘플링에 강함",
      "신제품에 대한 관심이 많음"
    ],
    "coupangKeyword": "최신 트렌드 아이템"
  },
  "pragmatist": {
    "title": "실용 지향자",
    "emoji": "🛒",
    "subtitle": "쓰임새가 가장 중요해!",
    "description": "당신은 실용적인 소비를 선호하는 타입이에요. 필요한 물건을 고민하며 사네요. 돈보다는 쓰임새가 우선이기 때문에 합리적인 소비를 할 수 있어요. 그러나 가끔 감정을 배제하고 영혼 없는 소비를 할 때도 있으니 주의가 필요해요.",
    "characteristics": [
      "필요한 소비 위주",
      "합리적인 가격을 선호함",
      "성장할 수 있는 소비를 추구함",
      "가끔은 감정적 소비를 함"
    ],
    "coupangKeyword": "실용적인 상품"
  },
  "impulsive": {
    "title": "즉흥 소비러",
    "emoji": "🎉",
    "subtitle": "즐거움이 우선!",
    "description": "당신은 즉흥적인 소비를 선호하는 타입이에요. 마음에 드는 걸 사는 걸 주저하지 않죠. 쇼핑이 즐거우니 뜻밖의 발견을 통해 새로운 스타일도 발견할 수 있어요. 그러나 때때로 후회하는 상황도 생길 수 있다는 점을 명심하세요.",
    "characteristics": [
      "즉흥적으로 소비함",
      "즐거움이 최우선",
      "새로운 스타일을 발견함",
      "가끔 후회를 겪음"
    ],
    "coupangKeyword": "재미있는 상품"
  }
};