export const calculateShoppingMoodTest1234TestLevel = (score: number) => {
  const keys = Object.keys(shoppingMoodTest1234Results);
  const numKeys = keys.length;
  if (numKeys === 0) return "";
  const maxScore = 12 * 4;
  const minScore = 12;
  const range = maxScore - minScore;
  const step = range / numKeys;
  const idx = Math.min(Math.floor((score - minScore) / step), numKeys - 1);
  return keys[Math.max(0, idx)];
};

export const shoppingMoodTest1234Results: Record<string, any> = {
  "budgetKeeper": {
    "title": "짠테크의 달인",
    "emoji": "💰",
    "subtitle": "철저한 예산 관리의 왕!",
    "description": "너는 유연하게 예산을 관리하는 편이야. 쇼핑을 할 때 항상 필요한 것과 예산을 고려하며, 기분이 좋을 땐 합리적인 선택을 하는 것 같아. 짠테크의 아이콘으로, 항상 구매할 때의 가치를 따지고 있어. 하지만 가끔은 즉흥적인 쇼핑도 필요할 수 있다는 걸 잊지 말아야 해!",
    "characteristics": [
      "철저한 예산 관리",
      "필요한 것 위주의 소비",
      "즉흥적인 쇼핑이 간혹 필요함",
      "재미있는 할인 정보에 민감함"
    ],
    "coupangKeyword": "예산 관리, 쇼핑"
  },
  "impulsiveShopper": {
    "title": "즉흥 소비의 여왕",
    "emoji": "✨",
    "subtitle": "기분에 따라 쇼핑하는 스타일!",
    "description": "넌 쇼핑을 통해 기분을 표현하는 편이야. 스트레스를 받을 때는 즉흥적으로 쇼핑을 하며, 친구들로부터 받은 칭찬이 계기가 되기도 해. 트렌드를 좇으며 자신을 꾸미는 걸 좋아하지만, 가끔은 지나친 소비로 이어질 수 있는 점도 주의가 필요해. 상황에 따라 다르게 반응하는 소비자의 모습이 인상적이야!",
    "characteristics": [
      "즉흥적인 쇼핑",
      "기분에 따라 소비",
      "트렌드에 민감함",
      "때때로 과소비 주의"
    ],
    "coupangKeyword": "즉흥 쇼핑, 트렌드"
  }
};