export const calculateTravelMood2023TestLevel = (score: number) => {
  const keys = Object.keys(travelMood2023Results);
  const numKeys = keys.length;
  if (numKeys === 0) return "";
  const maxScore = 8 * 4;
  const minScore = 8;
  const range = maxScore - minScore;
  const step = range / numKeys;
  const idx = Math.min(Math.floor((score - minScore) / step), numKeys - 1);
  return keys[Math.max(0, idx)];
};

export const travelMood2023Results: Record<string, any> = {
  "adventurer": {
    "title": "모험가",
    "emoji": "🏕️",
    "subtitle": "항상 새로운 걸 찾아 나서는 당신!",
    "description": "모험가 타입인 당신은 항상 새로운 경험과 도전을 추구해. 여행에서의 액티비티를 즐기고, 다양한 사람들을 만나는 걸 선호하죠. 하지만 때로는 이러한 모험이 스트레스를 주기도 해. 필요할 땐 잠시 멈춰서 자신을 돌아보는 시간을 가져보는 것도 좋겠어.",
    "characteristics": [
      "도전을 즐기는 성격",
      "호기심이 많음",
      "예측 불가한 여행 스타일",
      "새로운 사람과의 만남을 소중히 여김"
    ],
    "coupangKeyword": "모험 여행"
  },
  "natureLover": {
    "title": "자연 애호가",
    "emoji": "🌲",
    "subtitle": "자연에서 힐링이 필요한 당신!",
    "description": "자연 애호가인 당신은 아름다운 자연 속에서 마음의 평화를 찾는 스타일이야. 주로 산이나 바다를 찾아 힐링하며, 조용한 시간을 소중히 여겨. 이 타입은 늘 여유로운 일정을 즐기고, 복잡한 상황에서 벗어나 자연의 소리에 귀 기울이는 걸 좋아해.",
    "characteristics": [
      "조용한 시간을 사랑함",
      "자연과의 조화를 중시",
      "편안한 여행을 선호",
      "스트레스를 자연에서 해소함"
    ],
    "coupangKeyword": "자연 여행"
  },
  "relaxer": {
    "title": "휴식 추구형",
    "emoji": "☕",
    "subtitle": "편안한 휴식을 찾는 당신!",
    "description": "휴식을 추구하는 당신은 여행 중 단순히 쉬고 싶어 해. 유명한 관광지보다 아늑한 카페나 서점에서 시간을 보내는 게 더 즐거울 거야. 혼자만의 시간을 소중히 여기고, 복잡한 일상에서 벗어나 스스로를 재충전하고 싶어 하지. 꾸준한 자기 관리가 필요해!",
    "characteristics": [
      "혼자만의 시간이 필요한 성격",
      "안정감을 중시",
      "편안함을 중요시함",
      "스트레스를 느릴 때 해소함"
    ],
    "coupangKeyword": "여유로운 카페"
  },
  "foodie": {
    "title": "식도락가",
    "emoji": "🍽️",
    "subtitle": "맛있는 음식이 우선인 당신!",
    "description": "식도락가 타입인 당신은 여행에서 음식이 가장 중요해. 다양한 지역의 음식과 맛집을 경험하는 걸 선호하고, 새로운 맛을 발견하는 데 열정적이야. 여행 중에는 맛있는 음식을 공유하는 걸 즐기며, 미식 여행을 통해 새로운 문화와 사람들을 접하는 걸 좋아해.",
    "characteristics": [
      "미식을 사랑함",
      "음식과 문화의 연결을 중시",
      "여행의 목표가 식사",
      "맛집 탐방을 즐김"
    ],
    "coupangKeyword": "음식 여행"
  }
};