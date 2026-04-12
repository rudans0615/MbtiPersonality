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
    "title": "베스트 프렌드형",
    "emoji": "💖",
    "subtitle": "진정한 마이 프렌드!",
    "description": "체크한 걸 보니, 너랑 친구는 마음이 깊이 맞는 좋은 대화 상대인 것 같아. 서로를 완벽하게 이해하는 그런 우정!",
    "characteristics": [
      "서로의 생각을 잘 이해해",
      "비밀 보장이 철저해",
      "서로의 감정을 돌봐줘",
      "어디서나 편안한 친구"
    ],
    "coupangKeyword": "우정 관련 아이템"
  },
  "typeB": {
    "title": "우연한 친구형",
    "emoji": "😅",
    "subtitle": "서로 존중하는 사이!",
    "description": "우연히 인연이 된 사이인 것 같아. 때로는 맞지 않을 때도 있지만, 서로 존중하며 삶을 나누는 친구!",
    "characteristics": [
      "지극히 밀착하지 않아",
      "서로의 공간을 존중해",
      "생각은 양쪽에서 다름",
      "재미있는 에피소드 많음"
    ],
    "coupangKeyword": "친구 간 관계 개선"
  },
  "typeC": {
    "title": "가벼운 관계형",
    "emoji": "😜",
    "subtitle": "가끔은 재밌고 가끔은 불편!",
    "description": "실제로 모든 것을 이야기하지 않는 친구일지도 몰라. 약속도 가끔 소중하고 중요한 애인으로 느낄 때가 있어.",
    "characteristics": [
      "존중과 이해 더 필요해",
      "비밀 지키기 약간 아쉬워",
      "가끔 너에게 궤도를 벗어남",
      "상냥한 언행 많이 해도"
    ],
    "coupangKeyword": "소소한 우정 선물"
  }
};