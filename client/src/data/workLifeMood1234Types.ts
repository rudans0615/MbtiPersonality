export const calculateWorkLifeMood1234TestLevel = (score: number) => {
  const keys = Object.keys(workLifeMood1234Results);
  const numKeys = keys.length;
  if (numKeys === 0) return "";
  const maxScore = 8 * 4;
  const minScore = 8;
  const range = maxScore - minScore;
  const step = range / numKeys;
  const idx = Math.min(Math.floor((score - minScore) / step), numKeys - 1);
  return keys[Math.max(0, idx)];
};

export const workLifeMood1234Results: Record<string, any> = {
  "adaptable": {
    "title": "적응왕",
    "emoji": "👑",
    "subtitle": "어디서든 잘 적응하는 타입!",
    "description": "당신은 어떤 환경에서도 잘 적응할 수 있는 능력을 가진 사람이에요. 직장 내에서도 사람들 간의 관계를 잘 유지하고, 스트레스 상황에서도 긍정적인 태도를 잃지 않죠. 하지만 너무 리액션이 좋다 보니 가끔 자신의 감정을 소홀히 할 수 있으니 조심하세요.",
    "characteristics": [
      "적극적으로 소통하는 편",
      "스트레스 관리 잘함",
      "타인에 대한 배려가 깊음",
      "유연한 사고방식"
    ],
    "coupangKeyword": "직장 스트레스 해소"
  },
  "overwhelmed": {
    "title": "스트레스 덩어리",
    "emoji": "😩",
    "subtitle": "스트레스가 많은 타입!",
    "description": "직장에서 다양한 스트레스 요인에 쉽게 지쳐버리는 당신. 상사와의 관계에서도 부담감을 느끼기 쉽고, 종종 퇴사 생각이 드는 경우가 많죠. 하지만 스스로에게 더 많은 배려를 해주고, 건강한 방법으로 스트레스를 풀어보면 좋겠어요.",
    "characteristics": [
      "감정 표현이 솔직한 편",
      "상사와 소통이 어렵다고 느껴",
      "스트레스 상황에서 쉽게 지침",
      "혼자 있는 시간을 소중히 여김"
    ],
    "coupangKeyword": "힐링 제품"
  }
};