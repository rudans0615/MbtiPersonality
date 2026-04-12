export const calculateVacationVibesTestLevel = (score: number) => {
  const keys = Object.keys(vacationVibesResults);
  const numKeys = keys.length;
  if (numKeys === 0) return "";
  const maxScore = 4 * 4;
  const minScore = 4;
  const range = maxScore - minScore;
  const step = range / numKeys;
  const idx = Math.min(Math.floor((score - minScore) / step), numKeys - 1);
  return keys[Math.max(0, idx)];
};

export const vacationVibesResults: Record<string, any> = {
  "relaxBeach": {
    "title": "해변의 휴양지 스타일",
    "emoji": "🏖️",
    "subtitle": "바다와 함께하는 힐링",
    "description": "물가 근처라면 당신이 제일 즐겁고 편안해. 언제 어디서든 바다의 소리를 듣고 싶어하는 스타일이군!",
    "characteristics": [
      "해변에서 휴식이 최고인 사람",
      "쉼이 필요한 순간에 바다를 떠올림",
      "물 속에서의 자유로움을 찾는 홀로있는 나",
      "친구들과 함께 하는 물놀이가 잊지 못할 기억이지만 혼자도 좋음"
    ],
    "coupangKeyword": "여행 필수 아이템"
  },
  "mountainNature": {
    "title": "자연을 사랑하는 힐링 스타일",
    "emoji": "🏞️",
    "subtitle": "자연 속에서 치유하기",
    "description": "기차를 타고 산으로 떠나는 걸 매우 즐기는 당신. 운치 있는 자연이 큰 위안이 되지?",
    "characteristics": [
      "자연을 관찰하며 사색하는 모습",
      "조용히 숨쉬고 싶어함",
      "주말이면 외부로나가는 먼저 외출은 자연으로",
      "혼자 또는 아는 사이들과 함께하는 산행이 소울푸드"
    ],
    "coupangKeyword": "하이킹 용품"
  },
  "cafeChill": {
    "title": "책과 함께하는 여유 있는 스타일",
    "emoji": "📚",
    "subtitle": "여유롭고 차분한 휴식",
    "description": "바쁜 일상 속에서 잠시 쉬러 간 카페가 제일 큰 행복이야. 맛있는 디저트를 즐기며 한가로이 시간을 보내는 게 최고!",
    "characteristics": [
      "복잡하기보다 편안함을 이야기하고 싶음",
      "맛있는 디저트를 기다리는 행복한 모습",
      "아늑한 공간 속에서의 자신과의 대화",
      "타인을 위한 관심도 잊지 않음"
    ],
    "coupangKeyword": "카페 인테리어"
  },
  "hobbyAdventure": {
    "title": "모험을 즐기는 활기찬 스타일",
    "emoji": "🚵",
    "subtitle": "새로운 경험을 찾는 길",
    "description": "모험과 경험이 주는 힘을 믿는 당신. 특이한 액티비티가 아닐세라! 다양한 문화 체험으로 새로운 인생을 경험해 보자.",
    "characteristics": [
      "변화를 좋아하면서 모험하는 호기심 가득한 삶",
      "이 새로운 물건과 장소가 들어와 설레임",
      "주말이나 저녁엔 새로운 경험을 찾아찾아",
      "정말 즐겁고 소중한 것들로 갈고 있는 중"
    ],
    "coupangKeyword": " 여행 액세서리"
  }
};