export const calculateMyPetHealingStyleTestLevel = (score: number) => {
  const keys = Object.keys(myPetHealingStyleResults);
  const numKeys = keys.length;
  if (numKeys === 0) return "";
  const maxScore = 12 * 4;
  const minScore = 12;
  const range = maxScore - minScore;
  const step = range / numKeys;
  const idx = Math.min(Math.floor((score - minScore) / step), numKeys - 1);
  return keys[Math.max(0, idx)];
};

export const myPetHealingStyleResults: Record<string, any> = {
  "흐뭇한힐링": {
    "title": "흐뭇한 힐링족 🥰",
    "emoji": "💖",
    "subtitle": "소중한 순간을 간직하는 타입!",
    "description": "너는 반려동물과의 소중한 순간을 가장 중요하게 생각하는 타입이야. 매일매일의 작은 일상이 너에게 큰 행복을 줘. 애정이 가득한 너는 반려동물과의 시간을 통해 힐링받고, 그 순간을 소중히 여기는 성향이 있어. 이런 너는 긍정적인 에너지를 주변에 퍼뜨리고, 자연경관 속에서 반려동물과 동행하는 것을 좋아해. 평소에 나만의 시간을 보낼 수 있는 편한 공간에서 지내는 걸 선호해.",
    "characteristics": [
      "소소한 일상 속 행복을 느끼는 타입",
      "반려동물과의 순간을 소중히 여기는 성향",
      "자연 속에서의 힐링을 즐기는 편",
      "긍정적인 에너지를 퍼뜨리는 사람"
    ],
    "coupangKeyword": "천연 애견 샴푸, 반려동물 전용 쿠션, 애완동물 전용 장난감",
    "coupangHook": "너의 반려동물과의 소중한 순간, 더 특별하게 만들어줄 아이템 어때?"
  },
  "조용한쉼표": {
    "title": "조용한 쉼표 💫",
    "emoji": "🌿",
    "subtitle": "속삭이는 자연과 함께하는 타입!",
    "description": "너는 반려동물과 조용한 시간을 즐기는 타입이야. 혼자 있는 침묵 속에서 반려동물과 함께하는 것만으로도 큰 힐링을 느껴. 남들과 함께하기보다는 소중한 나만의 시간을 선호하는 성향이 있어. 이런 너는 독서나 차 한 잔의 여유를 통해 소소한 안정을 얻고, 자연과 함께하는 시간을 소중히 여겨. 또, 혼자 있는 시간도 소중하게 활용하는 너는 조용한 힐링을 통해 콩닥콩닥 사랑받는 반려동물과의 시간을 더 깊이 있게 즐길 수 있어.",
    "characteristics": [
      "혼자 있는 시간을 소중하게 여기는 타입",
      "소소한 일상 속 조용한 힐링을 즐김",
      "반려동물의 존재가 마음의 안정을 줌",
      "자연 속에서 혼자 있는 것을 좋아하는 사람"
    ],
    "coupangKeyword": "아로마테라피 디퓨저, 천연 오일, 힐링 음악 CD",
    "coupangHook": "혼자만의 힐링 타임, 반려동물과 함께하는 소중한 순간은 더 특별하게 만들어줄 제품 어때?"
  }
};