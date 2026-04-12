export const calculateCrushConfessionsTestLevel = (score: number) => {
  const keys = Object.keys(crushConfessionsResults);
  const numKeys = keys.length;
  if (numKeys === 0) return "";
  const maxScore = 4 * 4;
  const minScore = 4;
  const range = maxScore - minScore;
  const step = range / numKeys;
  const idx = Math.min(Math.floor((score - minScore) / step), numKeys - 1);
  return keys[Math.max(0, idx)];
};

export const crushConfessionsResults: Record<string, any> = {
  "trueCrush": {
    "title": "진짜 썸타는 타입 💖",
    "emoji": "🥰",
    "subtitle": "정말 좋아하는 사람!",
    "description": "당신은 진정한 감정을 품고 있는 상대와 썸을 타고 있어요. 솔직함과 진정함은 썸을 깊게 만들어 주는 법이죠!",
    "characteristics": [
      "솔직한 성격",
      "상대에 대한 진한 호감",
      "의사소통이 잘 됨",
      "애정 표현 그런대로 하는 편"
    ],
    "coupangKeyword": "연애 필수템"
  },
  "mixedFeelings": {
    "title": "모호한 썸타는 타입 🤔",
    "emoji": "😅",
    "subtitle": "약간 흔들리는 감정...",
    "description": "썸커플의 느낌이 있지만, 심적으로 움찔거릴 때가 많죠! 점점 마음이 확실해지길 바라요.",
    "characteristics": [
      "간혹 본질 파악이 부족함",
      "감정에서 고민기간 존재",
      "두려움을 좀 오래 하는 성향",
      "무관심을 무서워함"
    ],
    "coupangKeyword": "자기 개별화 선물"
  },
  "justFriend": {
    "title": "그냥 친구 타입 🙃",
    "emoji": "🤷‍♀️",
    "subtitle": "우린 친구일 뿐!",
    "description": "연애에 대한 감정을 상대방이란 필터 없이 대하는 타입이에요. 의외로 솔직한 탄력이 있지 않을까?",
    "characteristics": [
      "간헐적 유머로 여유를 띄움",
      "의도적인 거리감 유지",
      "솔직하게 자신이 영향을 맞추는 답 변수",
      "조금 더 태클을 누려가는 성향"
    ],
    "coupangKeyword": "친구를 위한 선물"
  }
};