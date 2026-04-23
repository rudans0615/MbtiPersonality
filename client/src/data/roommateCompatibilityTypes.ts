export const calculateRoommateCompatibilityTestLevel = (score: number) => {
  const keys = Object.keys(roommateCompatibilityResults);
  const numKeys = keys.length;
  if (numKeys === 0) return "";
  const maxScore = 8 * 4;
  const minScore = 8;
  const range = maxScore - minScore;
  const step = range / numKeys;
  const idx = Math.min(Math.floor((score - minScore) / step), numKeys - 1);
  return keys[Math.max(0, idx)];
};

export const roommateCompatibilityResults: Record<string, any> = {
  "typeA": {
    "title": "완벽주의자 룸메이트",
    "emoji": "🧹",
    "subtitle": "청결하고 체계적인 성격",
    "description": "정리정돈이 철저하고, 깔끔한 환경을 선호하는 타입! 룸메이트 사이에서도 깔끔함을 유지하고 싶어해.",
    "characteristics": [
      "정리정돈 잘하는 편",
      "계획 세우는 걸 좋아함",
      "상대방에게도 깔끔함 요구",
      "안정적인 분위기 중시"
    ],
    "coupangKeyword": "청소도구"
  },
  "typeB": {
    "title": "자유로운 영혼 룸메이트",
    "emoji": "🌈",
    "subtitle": "자유롭고 개방적인 성격",
    "description": "자신의 사생활을 존중받고 싶어하는 타입! 룸메 사이에서 자율적인 분위기를 만드는 걸 중요시해.",
    "characteristics": [
      "자유로운 생활 선호",
      "사생활 존중",
      "개방적인 대화 좋아",
      "대체로 긍정적임"
    ],
    "coupangKeyword": "인테리어 소품"
  },
  "typeC": {
    "title": "균형 잡힌 룸메이트",
    "emoji": "🤝",
    "subtitle": "협력과 조화 중시",
    "description": "서로의 기분을 잘 이해하고 조절하는 타입! 룸메이트 간의 균형을 맞추는 걸 중요시해.",
    "characteristics": [
      "소통 잘하는 편",
      "서로의 기분 감지 잘함",
      "협력을 좋아함",
      "균형을 중시하는 성격"
    ],
    "coupangKeyword": "가전제품"
  },
  "typeD": {
    "title": "무심한 룸메이트",
    "emoji": "😶‍🌫️",
    "subtitle": "자유롭고 무관심한 성격",
    "description": "자신의 일에 집중하는 걸 좋아하고, 룸메이트 간의 간섭을 최소화하고 싶어해.",
    "characteristics": [
      "자기 일에 집중함",
      "과도한 간섭 싫어함",
      "상대방에게 무관심한 편",
      "조용한 분위기 선호"
    ],
    "coupangKeyword": "욕실용품"
  }
};