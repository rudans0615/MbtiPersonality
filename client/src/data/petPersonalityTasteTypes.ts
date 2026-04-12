export const calculatePetPersonalityTasteTestLevel = (score: number) => {
  const keys = Object.keys(petPersonalityTasteResults);
  const numKeys = keys.length;
  if (numKeys === 0) return "";
  // 12 questions × score 1~4 = range 12~48, evenly split
  const maxScore = 10 * 4;
  const minScore = 10;
  const range = maxScore - minScore;
  const step = range / numKeys;
  const idx = Math.min(Math.floor((score - minScore) / step), numKeys - 1);
  return keys[Math.max(0, idx)];
};

export const petPersonalityTasteResults: Record<string, any> = {
  "friendlyDog": {
    "title": "사랑스러운 강아지 성격",
    "emoji": "🐕",
    "subtitle": "따뜻한 마음을 가진 당신!",
    "description": "너는 매사 긍정적이고 사람을 좋아하는 타입이야! 누군가가 너를 사랑해줄 거라는 믿음이 강해서, 강아지처럼 활동적이고 사교적이기도 해. 모든 일이 잘 풀릴 것 같아!",
    "characteristics": [
      "긍정적이고 활발함",
      "사람들과 잘 어울림",
      "사랑을 주고받는 걸 좋아함",
      "배려가 깊음"
    ],
    "coupangKeyword": "강아지 장난감"
  },
  "curiousCat": {
    "title": "호기심 많은 고양이 성격",
    "emoji": "🐈",
    "subtitle": "내가 소중히 여기는 나만의 세계!",
    "description": "너는 독립적이고 혼자 있는 시간을 소중히 여기는 타입이야. 고양이처럼 자신만의 세계를 가지고, 호기심이 가득한 너는 남들 눈엔 독특하게 보이기도 해. 매력적으로 나만의 길을 갈 수 있어!",
    "characteristics": [
      "독립적인 성격",
      "자신의 세계가 있음",
      "호기심 넘침",
      "때론 소극적임"
    ],
    "coupangKeyword": "고양이 용품"
  }
};