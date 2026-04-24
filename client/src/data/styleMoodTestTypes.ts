export const calculateStyleMoodTestTestLevel = (score: number) => {
  const keys = Object.keys(styleMoodTestResults);
  const numKeys = keys.length;
  if (numKeys === 0) return "";
  const maxScore = 12 * 4;
  const minScore = 12;
  const range = maxScore - minScore;
  const step = range / numKeys;
  const idx = Math.min(Math.floor((score - minScore) / step), numKeys - 1);
  return keys[Math.max(0, idx)];
};

export const styleMoodTestResults: Record<string, any> = {
  "cheerfulStyle": {
    "title": "키치한 패셔니스타",
    "emoji": "🎉",
    "subtitle": "오늘은 화려하게!",
    "description": "상큼한 기분인 너는 화려하고 기발한 스타일을 사랑해! 언제나 눈에 띄는 패션 아이템으로 나만의 스타일을 표현해.",
    "characteristics": [
      "색감이 화려해",
      "유행을 잘 따라가",
      "자신감을 주는 액세서리 좋아해",
      "파티 스타일링에 능해"
    ],
    "coupangKeyword": "키치패션"
  },
  "casualComfort": {
    "title": "편안한 실용주의자",
    "emoji": "😌",
    "subtitle": "스트레스 없는 스타일",
    "description": "요즘 같은 날에는 편안한 게 최고지! 실용적인 스타일을 선호하고, 편안함을 중시하는 너는 언제나 자연스러움을 추구해.",
    "characteristics": [
      "실용성을 중시해",
      "편안한 의류를 선호해",
      "자유로운 스타일을 사랑해",
      "일상에서 편안함을 느껴"
    ],
    "coupangKeyword": "캐주얼패션"
  }
};