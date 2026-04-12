export const calculateHomeDecorDreamsTestLevel = (score: number) => {
  const keys = Object.keys(homeDecorDreamsResults);
  const numKeys = keys.length;
  if (numKeys === 0) return "";
  const maxScore = 4 * 4;
  const minScore = 4;
  const range = maxScore - minScore;
  const step = range / numKeys;
  const idx = Math.min(Math.floor((score - minScore) / step), numKeys - 1);
  return keys[Math.max(0, idx)];
};

export const homeDecorDreamsResults: Record<string, any> = {
  "comfortZone": {
    "title": "편안한 안식처",
    "emoji": "🛏️",
    "subtitle": "가장 마음 편한 기분이 드는 공간",
    "description": "따뜻하고 아늑한 환경을 원해. 편안함이 우선이라면, 보태기가 많지 않고 내 마음을 편안하게 하는 소품들을 배치해.",
    "characteristics": [
      "집에서 영화 감상 모드를 주로 하는 편이야",
      "여유롭게 쉴 수 있는 공간을 마련해둬",
      "소품에 따라 기분이 달라지는 타입이야",
      "간편한 삶이 최고라고 생각하는 얼굴이야"
    ],
    "coupangKeyword": "쿠션, 내추럴 소품"
  },
  "vintageChic": {
    "title": "빈티지 Chic",
    "emoji": "🎨",
    "subtitle": "세월의 흔적이 아름다움을 선사",
    "description": "레트로 감성이 물씬 풍기는 집 공간을 꿈꿔. 빈티지 가구와 소품을 조화롭게 식탁 위에 배치해서 초대하는 느낌을 극대화 시켜.",
    "characteristics": [
      "상징적이고 특별한 아이템을 중시하는 편이야",
      "과거를 떠올리게 하는 소품들에 빨려드는 타입",
      "영화, 음악적으로 빈티지에 관심이 많아",
      "어떤 일정도 없다면 복고풍 카페을 자주 찾아"
    ],
    "coupangKeyword": "빈티지 가구, 레트로 소품"
  },
  "natureInspired": {
    "title": "자연에서 온 특별함",
    "emoji": "🌱",
    "subtitle": "내 방은 나무와 푸른 식물들이 가득하게",
    "description": "자연 소품과 식물들로 공간을 산뜻하게 꾸미는 걸 선호해. 생명력이 느껴지는 집이야절.",
    "characteristics": [
      "실제 식물을 잘 키우는 편이야",
      "자연광이 채워 주는 기운 덕분에 에너지가 넘쳐",
      "침대 옆에도 식물을 뒀다면 홈카페장인으로 인증 가능",
      "행운 그런대로 찾아와줄 거라 믿고 있어"
    ],
    "coupangKeyword": "인공지능 화분, 시드플라워 팩트"
  },
  "trendyVibes": {
    "title": "트렌디 절대 강자",
    "emoji": "✨",
    "subtitle": "최신 트렌드를 놓치지 않는 인테리어 분",
    "description": "인스타에서 봤던 트렌디한 디자인을 적용했으면 좋겠어. 모든 게 나름의 의미와 메시지를 갖고 그런 관점이 중요해.",
    "characteristics": [
      "매일 새로워지고 싶은 욕구가 넘치는 편이야",
      "브랜드 신경쓰고 월별 가구 잡지 탑10개 이를 구독해",
      "소φ 정신적인 매물 귀찮기도 해!",
      "주변에서 유행하는 내용이라면 당신쪽에 물어보기도 해"
    ],
    "coupangKeyword": "디자인 인테리어 가구, 트렌디 조명"
  }
};