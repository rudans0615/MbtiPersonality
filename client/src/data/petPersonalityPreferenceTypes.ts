export const calculatePetPersonalityPreferenceTestLevel = (score: number) => {
  const keys = Object.keys(petPersonalityPreferenceResults);
  const numKeys = keys.length;
  if (numKeys === 0) return "";
  const maxScore = 10 * 4;
  const minScore = 10;
  const range = maxScore - minScore;
  const step = range / numKeys;
  const idx = Math.min(Math.floor((score - minScore) / step), numKeys - 1);
  return keys[Math.max(0, idx)];
};

export const petPersonalityPreferenceResults: Record<string, any> = {
  "dogLover": {
    "title": "강아지 애호가 🐶",
    "emoji": "🐾",
    "subtitle": "너 정말 강아지를 사랑하는구나!",
    "description": "너는 충성스럽고 활발한 성격의 반려동물을 선호해! 진솔한 관계를 중요시하며, 친구들과의 사교적 활동을 즐기는 타입이야.",
    "characteristics": [
      "사람을 좋아한는 성격",
      "활동적인 일상을 선호",
      "강아지와 함께 비교적 능동적인 취미",
      "친구들과의 교류를 중시"
    ],
    "coupangKeyword": "강아지 용품"
  },
  "catPerson": {
    "title": "고양이족 😸",
    "emoji": "🐱",
    "subtitle": "너의 매력은 미묘하구나!",
    "description": "좀 더 독립적이고 자유로운 성격의 반려동물을 선호하는구나. 너와 같은 자유로운 단짝을 쫓고 다니는 걸 좋아해!",
    "characteristics": [
      "스스로를 잘 챙기는 편",
      "차분한 분위기를 중시",
      "타인과의 거리를 두는 편",
      "개인적인 공간을 소중히 여김"
    ],
    "coupangKeyword": "고양이 용품"
  },
  "exoticPetFan": {
    "title": "이색 반려동물 매니아 🦜",
    "emoji": "🐍",
    "subtitle": "너무 색다른 취향을 가지고 있네!",
    "description": "이색적인 반려동물을 선호하는 너는 독창적인 성격이야. 대담하고 타인과 다른 개성을 자랑해!",
    "characteristics": [
      "타인과는 다른 선택을 함",
      "자신감 넘치는 성격",
      "새로운 경험을 즐기는 편",
      "자유로운 영혼"
    ],
    "coupangKeyword": "이색 동물 용품"
  },
  "lovelyPetCollector": {
    "title": "사랑스러운 반려동물 수집가 🌈",
    "emoji": "🐾",
    "subtitle": "너의 사랑은 다채롭구나!",
    "description": "너는 다양한 취향의 반려동물을 사랑하는 수집가야! 귀여움에 로망을 갖고 있어 다양한 애완 동물을 모으고 싶어 하지.",
    "characteristics": [
      "사랑스러움을 중시하는 성격",
      "디자인에 대한 감각이 남다름",
      "다양한 관심사를 지님",
      "플레잉과 편안한 공간을 중시"
    ],
    "coupangKeyword": "귀여운 애완동물 용품"
  }
};