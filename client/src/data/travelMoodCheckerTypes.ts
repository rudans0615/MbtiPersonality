export const calculateTravelMoodCheckerTestLevel = (score: number) => {
  const keys = Object.keys(travelMoodCheckerResults);
  const numKeys = keys.length;
  if (numKeys === 0) return "";
  const maxScore = 12 * 4;
  const minScore = 12;
  const range = maxScore - minScore;
  const step = range / numKeys;
  const idx = Math.min(Math.floor((score - minScore) / step), numKeys - 1);
  return keys[Math.max(0, idx)];
};

export const travelMoodCheckerResults: Record<string, any> = {
  "beachLover": {
    "title": "바다의 여왕",
    "emoji": "🏖️",
    "subtitle": "햇살 아래에서 힐링 중",
    "description": "넌 바다와 햇살을 사랑하는 스타일이야! 편안한 해변에서의 휴식이 너에게 가장 큰 행복을 줘.",
    "characteristics": [
      "여유로운 성격",
      "탐험하기보단 휴식 선호",
      "카페 탐방에 열정적",
      "바다 방향으로 곧장 달려"
    ],
    "coupangKeyword": "해변 여름 바캉스"
  },
  "adventureSeeker": {
    "title": "모험가의 마음",
    "emoji": "🌄",
    "subtitle": "스릴과 액션을 원해",
    "description": "넌 새로운 경험을 즐기고 도전하는 걸 두려워하지 않는 모험가야! 스릴 넘치는 여행을 통해 성장하고 싶어.",
    "characteristics": [
      "에너지가 넘치는",
      "모험과 액티비티 선호",
      "새로운 사람 만나는 걸 좋아함",
      "자유로운 영혼"
    ],
    "coupangKeyword": "액티비티 여행 패키지"
  }
};