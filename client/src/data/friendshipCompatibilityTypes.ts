export const calculateFriendshipCompatibilityTestLevel = (score: number) => {
  const keys = Object.keys(friendshipCompatibilityResults);
  const numKeys = keys.length;
  if (numKeys === 0) return "";
  const maxScore = 12 * 4;
  const minScore = 12;
  const range = maxScore - minScore;
  const step = range / numKeys;
  const idx = Math.min(Math.floor((score - minScore) / step), numKeys - 1);
  return keys[Math.max(0, idx)];
};

export const friendshipCompatibilityResults: Record<string, any> = {
  "typeA": {
    "title": "소중한 친구",
    "emoji": "💕",
    "subtitle": "너와 친구는 정말 잘 맞는 사이!",
    "description": "서로를 잘 이해하고 지지하는 관계야. 어떤 상황에서도 힘이 되어줄 친구!",
    "characteristics": [
      "서로의 비밀을 지킬 수 있어",
      "서로에게 솔직한 편",
      "함께하는 시간을 소중히 여김",
      "서로를 존중하고 지지해줌"
    ],
    "coupangKeyword": "우정선물"
  },
  "typeB": {
    "title": "이해심 많은 친구",
    "emoji": "✨",
    "subtitle": "서로를 이해해주는 친구!",
    "description": "어려운 상황에서도 함께 해주는 친구야. 서로를 잘 챙겨주는 사이!",
    "characteristics": [
      "서로의 감정을 소중히 여김",
      "서로의 고민을 잘 들어줌",
      "시간에 따라 더욱 가까워짐",
      "믿음이 깊은 관계"
    ],
    "coupangKeyword": "친구케어"
  },
  "typeC": {
    "title": "편안한 친구",
    "emoji": "🌼",
    "subtitle": "함께 하는 것만으로도 좋아!",
    "description": "서로의 존재가 편안한 친구야. 무심코 흘러가는 일상도 함께 공유해!",
    "characteristics": [
      "자유로운 관계",
      "서로의 개성을 존중함",
      "서로의 소소한 것에 즐거움을 느낌",
      "가벼운 대화도 소중히 여김"
    ],
    "coupangKeyword": "소소한우정"
  },
  "typeD": {
    "title": "서로 존중하는 친구",
    "emoji": "🌟",
    "subtitle": "서로를 존중하는 건강한 우정!",
    "description": "각자의 공간과 시간을 존중하며, 서로에게 최선을 다하는 친구야.",
    "characteristics": [
      "서로의 독립성을 존중함",
      "자신의 감정을 표현할 줄 아는 편",
      "서로에게 애정이 깊음",
      "필요할 때 도움을 줄 준비가 되어있음"
    ],
    "coupangKeyword": "우정존중"
  }
};