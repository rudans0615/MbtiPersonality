export const calculatePetStressReliefTestLevel = (score: number) => {
  const keys = Object.keys(petStressReliefResults);
  const numKeys = keys.length;
  if (numKeys === 0) return "";
  const maxScore = 12 * 4;
  const minScore = 12;
  const range = maxScore - minScore;
  const step = range / numKeys;
  const idx = Math.min(Math.floor((score - minScore) / step), numKeys - 1);
  return keys[Math.max(0, idx)];
};

export const petStressReliefResults: Record<string, any> = {
  "calmCompanion": {
    "title": "편안한 동반자 🐶",
    "emoji": "🌟",
    "subtitle": "스트레스 해소의 비결은 반려동물의 존재?",
    "description": "너는 반려동물과의 소소한 일상에서 큰 위안을 느끼는 타입이야. 그들과 함께하는 시간이 너에게 큰 힘이 되고, 힐링의 중심이 되어줘. 깊은 교감을 원하고, 평온한 일상을 추구하는 너는 친구들과의 관계 또한 소중히 여겨. 연애에서는 서로의 감정을 잘 이해해주고, 차분한 분위기를 만들어가. 너와 잘 어울리는 사람은 너처럼 감성적인 사람이며, 서로의 마음을 잘 읽어주는 관계가 형성될 수 있을 거야.",
    "characteristics": [
      "감성적이고 따뜻함",
      "상대방을 잘 배려함",
      "조용한 힐링을 선호함",
      "우정을 소중히 여김"
    ],
    "coupangKeyword": "아로마 디퓨저, 치킨 건조 간식, 반려동물 전용 침대, 반려동물 마사지기",
    "coupangHook": "너와 반려동물의 힐링 라이프, 특별한 아이템으로 더 풍요롭게!"
  },
  "activeAdventurer": {
    "title": "활동적인 모험가 🐕",
    "emoji": "🔥",
    "subtitle": "모험으로 스트레스를 날려버려!",
    "description": "너는 반려동물과의 활동적인 시간을 즐기는 타입이야. 함께 뛰어다니고, 새로운 경험을 추구하는 너는 스트레스가 쌓이기 전에 정리하는 재능이 있어. 연애에서도 활발한 사람과 잘 어울리며, 서로의 에너지를 고무시키는 관계를 만들어가. 친구들과도 항상 액티브한 시간을 보내고 싶어하고, 새로운 경험에 대한 열망이 넘쳐. 너의 이러한 성향은 삶을 더욱 다채롭게 만들어줄 거야.",
    "characteristics": [
      "모험과 활동을 사랑함",
      "친구들과의 에너지가 넘침",
      "새로운 것에 대한 호기심",
      "액티브한 연애를 선호함"
    ],
    "coupangKeyword": "산책용 배낭, 반려동물용 수영복, 반려동물과 함께하는 캠핑용품, 피크닉 매트",
    "coupangHook": "너의 일상이 더 즐거워지는 액티브 아이템들, 함께 모험을 떠나자!"
  }
};