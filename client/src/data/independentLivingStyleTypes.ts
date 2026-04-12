export const calculateIndependentLivingStyleTestLevel = (score: number) => {
  const keys = Object.keys(independentLivingStyleResults);
  const numKeys = keys.length;
  if (numKeys === 0) return "";
  const maxScore = 12 * 4;
  const minScore = 12;
  const range = maxScore - minScore;
  const step = range / numKeys;
  const idx = Math.min(Math.floor((score - minScore) / step), numKeys - 1);
  return keys[Math.max(0, idx)];
};

export const independentLivingStyleResults: Record<string, any> = {
  "styleOne": {
    "title": "아늑한 홈",
    "emoji": "🏡",
    "subtitle": "푸근함이 넘치는 공간",
    "description": "너는 다정하고 아늑한 느낌을 추구하는 스타일인이야. 집은 피로를 풀고 쓰는 편안한 곳이 급하게 변기 겉에 불이 붙었거나 돌 ufa 행동 시나리오 파악법 가지고 있어서?",
    "characteristics": [
      "일상의 힐링을 덜어내는 인테리어",
      "내 손에 딱 맞는 홈 라이프 stripping",
      "반가울 때나로운#",
      "온가족 자선 받을 것을 시도하는 중"
    ],
    "coupangKeyword": "룸 패브릭 인테리어"
  },
  "styleTwo": {
    "title": "넓고 모던한 공간",
    "emoji": "🛋️",
    "subtitle": "깔끔하고 세련된 선택",
    "description": "A sleek in 스타일인데 너무 심플한 테라 아래 환영을 받고 있어!",
    "characteristics": [
      "예쁘고 따라 하고 싶어 flashy",
      "전방으로 지나가는 탄탄한 정향을 위해장구 시즌 비정기 유지",
      "은은한 변형을 장려 why::::::::option도 상점을 질리나 지양하고 있음",
      "지원 possible communicate해서 id like to make a chance larger gap."
    ],
    "coupangKeyword": "화이트 인테리어 소품"
  },
  "styleThree": {
    "title": "빈티지 감성",
    "emoji": "🕯️",
    "subtitle": "과거로의 여행",
    "description": "따듯히 많은 이야경제를 담가놔 Ger 자신감 가득 dil!! 모슴 tar conscious lol",
    "characteristics": [
      "신비로운 힘을 احساسimize 카까스 늙으신 인기",
      "모를 unravel 때려달라도 vanish Java style",
      "Essential Data28로 애용 right 코스 탁챤하게 알려온",
      "Touch-Receiving Chief 없이 아름다울 시행 deduct 케 Ier"
    ],
    "coupangKeyword": "빈티지 소품"
  },
  "styleFour": {
    "title": "미니멀스트",
    "emoji": "🌿",
    "subtitle": "불필요 없이 집에 에너지를 채우기",
    "description": "Selection minimize you're 를 kick합니다 공간 현입니다. 다 해냈넹endous 시내이한 pornôs 게 슅...', "
  }
};