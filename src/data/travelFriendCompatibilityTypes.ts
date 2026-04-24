export const calculateTravelFriendCompatibilityTestLevel = (score: number) => {
  const keys = Object.keys(travelFriendCompatibilityResults);
  const numKeys = keys.length;
  if (numKeys === 0) return "";
  const maxScore = 8 * 4;
  const minScore = 8;
  const range = maxScore - minScore;
  const step = range / numKeys;
  const idx = Math.min(Math.floor((score - minScore) / step), numKeys - 1);
  return keys[Math.max(0, idx)];
};

export const travelFriendCompatibilityResults: Record<string, any> = {
  "typeA": {
    "title": "예쁜 사진 찍는 인스타 여행러📸",
    "emoji": "✨",
    "subtitle": "셀카와 함께 떠나는 여행이 최고",
    "description": "너는 사진 찍는 걸 좋아하는 스타일인가 봐. 예쁜 카페와 명소에서 친구와 함께 인생샷을 남기는 걸 즐기는 타입이야. 그런 만큼, 너와 잘 어울리는 친구는 나와 같은 팔로워보단, 인생샷을 같이 찍고 싶어하는 동료 친구야.",
    "characteristics": [
      "사진 찍는 걸 좋아함",
      "우정 중시",
      "인스타그램 활동 활발",
      "이색 카페 탐방 좋아함"
    ],
    "coupangKeyword": "인스타 여행지"
  },
  "typeB": {
    "title": "맛집 탐방 여행가🍽️",
    "emoji": "🍴",
    "subtitle": "음식과 함께하는 즐거운 여행",
    "description": "너는 여행에서 맛있는 음식을 가장 중요시하는 타입이야. 친구와 함께 다양한 맛집을 찾아다니며 기억에 남는 순간을 만드는 걸 선호해. 이런 너와 잘 어울리는 친구는 맛집 탐방을 즐기는 친구야.",
    "characteristics": [
      "음식을 탐닉하는 스타일",
      "새로운 경험을 중시",
      "친구와의 대화 중시",
      "맛집 추천 좋아함"
    ],
    "coupangKeyword": "여행 음식"
  },
  "typeC": {
    "title": "자연 속의 여행자🌿",
    "emoji": "🌲",
    "subtitle": "힐링과 여유를 즐기는 타입",
    "description": "자연을 사랑하고, 여유로운 여행을 선호하는 너는 친구와의 탐험과 힐링을 중요시하네. 너와 잘 어울리는 친구는 함께 자연을 즐기고 서로의 감성을 공유할 수 있는 타입이야.",
    "characteristics": [
      "자연을 사랑함",
      "여유로운 시간을 중시",
      "힐링이 필요함",
      "탐험에 흥미로움"
    ],
    "coupangKeyword": "자연 여행지"
  },
  "typeD": {
    "title": "즉흥적인 여행가🚀",
    "emoji": "🎒",
    "subtitle": "무계획이 주는 매력을 즐기는 타입",
    "description": "너는 계획보다 즉흥적인 여행을 더 좋아하는 스타일이야. 친구와의 소소한 즉흥 여행을 통해 많은 추억을 쌓는 것을 선호해. 너와 잘 어울리는 친구는 즉흥적으로 여행을 계획할 수 있는 친구가 맞아.",
    "characteristics": [
      "계획 없이 떠나는 타입",
      "즉흥적인 상황 선호",
      "여행에서의 소소함 중시",
      "모험을 즐기는 성격"
    ],
    "coupangKeyword": "즉흥 여행"
  }
};