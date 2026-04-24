export const calculateFriendshipCompatibilityTestTestLevel = (score: number) => {
  const keys = Object.keys(friendshipCompatibilityTestResults);
  const numKeys = keys.length;
  if (numKeys === 0) return "";
  const maxScore = 12 * 4;
  const minScore = 12;
  const range = maxScore - minScore;
  const step = range / numKeys;
  const idx = Math.min(Math.floor((score - minScore) / step), numKeys - 1);
  return keys[Math.max(0, idx)];
};

export const friendshipCompatibilityTestResults: Record<string, any> = {
  "typeA": {
    "title": "서로를 지켜주는 친구",
    "emoji": "🤝",
    "subtitle": "정말 서로 믿을 수 있는 관계!",
    "description": "서로의 비밀과 감정을 존중하며, 진심으로 지켜주는 친구야.",
    "characteristics": [
      "신뢰가 중요한 관계",
      "서로를 배려하는 모습",
      "솔직한 대화가 많은 우정",
      "서로의 행복을 우선시하는 편"
    ],
    "coupangKeyword": "우정 관련 상품"
  },
  "typeB": {
    "title": "서로를 이해하는 친구",
    "emoji": "💞",
    "subtitle": "감정을 잘 이해해주는 사이!",
    "description": "상대방의 기분과 상황을 잘 이해하고 공감해주는 친구야.",
    "characteristics": [
      "공감 능력이 뛰어난 사이",
      "서로의 피드백을 중시하는 관계",
      "심리적으로 안정된 우정",
      "서로의 꿈을 응원하는 관계"
    ],
    "coupangKeyword": "우정 선물"
  },
  "typeC": {
    "title": "자유로운 친구",
    "emoji": "🦋",
    "subtitle": "서로의 선택을 존중해주는 사이!",
    "description": "자유롭고 간섭 없이 지낼 수 있는 친구야.",
    "characteristics": [
      "각자의 공간과 시간을 중시",
      "자유롭게 만남을 가지는 관계",
      "상대방의 선택을 존중하는 모습",
      "자기만의 세계가 있는 우정"
    ],
    "coupangKeyword": "개성 있는 친구 선물"
  },
  "typeD": {
    "title": "서로의 차이를 인정하는 친구",
    "emoji": "🌈",
    "subtitle": "서로의 다름을 존중해!",
    "description": "서로의 차이를 인정하고, 서로의 스타일을 존중하는 친구야.",
    "characteristics": [
      "각자의 개성을 존중하는 관계",
      "차이에서 발생하는 재미를 느끼는 우정",
      "서로의 관심사를 공유하는 편",
      "가끔은 이런 저런 토론을 즐기는 친구"
    ],
    "coupangKeyword": "친목 활동 용품"
  }
};