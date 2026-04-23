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
    "title": "완벽한 찰떡궁합",
    "emoji": "💖",
    "subtitle": "우린 완벽한 친구!",
    "description": "너와 내 친구는 서로를 잘 이해하고, 끈끈한 우정을 자랑해. 언제나 서로의 곁에 있어줄 준비가 되어 있어!",
    "characteristics": [
      "서로 잘 맞는 성격",
      "많은 추억 공유",
      "상호 존중과 이해",
      "서로의 귀찮음을 감내"
    ],
    "coupangKeyword": "친구 선물 세트"
  },
  "typeB": {
    "title": "이해는 하되 다름",
    "emoji": "🌀",
    "subtitle": "상반된 매력을 가진 친구!",
    "description": "너와 친구는 서로 다른 성격이지만, 그게 오히려 매력이야. 서로 보완하며, 다름 속에서 친밀감을 느끼고 있어!",
    "characteristics": [
      "서로 다른 성향",
      "자주 의견 충돌",
      "다른 점에서 배우기",
      "각자 존중해 주기"
    ],
    "coupangKeyword": "친구와의 요리 클래스"
  },
  "typeC": {
    "title": "조금의 간섭 필요",
    "emoji": "🌱",
    "subtitle": "서로 노력 중인 친구!",
    "description": "너와 친구는 서로에게 조금씩 간섭이 필요해. 더 깊은 이해를 하고 싶다면, 소통을 늘려봐!",
    "characteristics": [
      "서로의 마음 잘 몰라",
      "가끔의 오해",
      "꾸준한 대화 필요",
      "소중한 유대감"
    ],
    "coupangKeyword": "우정 소통 게임"
  },
  "typeD": {
    "title": "서로의 소중함 잊지 말자",
    "emoji": "🌼",
    "subtitle": "친구라도 소중해!",
    "description": "너와 친구는 서로의 소중함을 잊고 있는 것 같아. 좀 더 관심을 가져보고, 서로의 가치를 다시 한번 확인해보는 게 좋겠어!",
    "characteristics": [
      "소홀해진 관계",
      "서로의 아픔 무관심",
      "다시 가까워질 방법 모색",
      "소통의 필요성"
    ],
    "coupangKeyword": "우정 회복 책"
  }
};