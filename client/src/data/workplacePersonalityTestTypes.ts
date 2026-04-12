export const calculateWorkplacePersonalityTestTestLevel = (score: number) => {
  const keys = Object.keys(workplacePersonalityTestResults);
  const numKeys = keys.length;
  if (numKeys === 0) return "";
  const maxScore = 5 * 4;
  const minScore = 5;
  const range = maxScore - minScore;
  const step = range / numKeys;
  const idx = Math.min(Math.floor((score - minScore) / step), numKeys - 1);
  return keys[Math.max(0, idx)];
};

export const workplacePersonalityTestResults: Record<string, any> = {
  "stressedOut": {
    "title": "스트레스 직장인",
    "emoji": "😩",
    "subtitle": "피할 수 없는 리얼리즘",
    "description": "헤일로로 직장인다운 모습을 많이 고객은 고벽으로! 퇴사하고 싶지만 아직 발짝 밖에 못 나가?.",
    "characteristics": [
      "일중독",
      "멘붕 상태도 잦음",
      "커리어 고민",
      "스스로 다독여야 함"
    ],
    "coupangKeyword": "직장인 스트레스 관리"
  },
  "coolCareerist": {
    "title": "느긋한 커리어리스트",
    "emoji": "😎",
    "subtitle": "여유 있는 직장생활 mastermind",
    "description": "직장에 필수가 아니라야 여유가 많은.. 항상 커리어 확장 중!",
    "characteristics": [
      "유연한 사고",
      "소통의 장인 금수저?",
      "주말은 꼭! 힐링 타임",
      "조화로운 직장문화 추구"
    ],
    "coupangKeyword": "아주 멋진 사원상을 위한 다이어리"
  }
};