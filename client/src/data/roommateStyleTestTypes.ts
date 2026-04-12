export const calculateRoommateStyleTestTestLevel = (score: number) => {
  const keys = Object.keys(roommateStyleTestResults);
  const numKeys = keys.length;
  if (numKeys === 0) return "";
  const maxScore = 3 * 4;
  const minScore = 3;
  const range = maxScore - minScore;
  const step = range / numKeys;
  const idx = Math.min(Math.floor((score - minScore) / step), numKeys - 1);
  return keys[Math.max(0, idx)];
};

export const roommateStyleTestResults: Record<string, any> = {
  "chillRoommate": {
    "title": "완전 여유로운 스타일",
    "emoji": "😌",
    "subtitle": "마음 편한 크리에이터",
    "description": "쉽고 간편한 스타일을 선호해. 혼자만의 여유 시간을 놓치지 않는 게 중요해.",
    "characteristics": [
      "소풍 같은 일상을 즐김",
      "리드미컬한 집안 분위기",
      "안정감 회복이 필수",
      "느긋한 성격"
    ],
    "coupangKeyword": "홈카페"
  },
  "creativeRoommate": {
    "title": "걸작 주방, 영감의 연금술사",
    "emoji": "🎨",
    "subtitle": "세상을 아름답게 만드는 손길",
    "description": "창의적인 요리를 즐기는 타입. 음식도 예술로 만드는 감각의 소유자야.",
    "characteristics": [
      "부엌이 놀이터!",
      "다채롭고 창의적인 분위기",
      "자꾸 새로운 시도함",
      "음식으로 데코 변신!"
    ],
    "coupangKeyword": "주방소품"
  },
  "socialRoommate": {
    "title": "사람들 가득한 장소 적극 참여",
    "emoji": "🎉",
    "subtitle": "사교성과 즉흥력 만렙",
    "description": "사람들과의 소통이 제일 중요한 타입. 친구들과 함께 즐기는 주거 환경을 사랑해.",
    "characteristics": [
      "아기자기하게 꾸미는 타입",
      "언제든 들어오는 호출 반갑다!",
      "활기 넘치는 소음덩어리",
      "모임과 골목잔치족"
    ],
    "coupangKeyword": "파티 소품"
  },
  "hyggeRoommate": {
    "title": "아늑한 공간의 주인",
    "emoji": "🕯️",
    "subtitle": "집이 나의 오아시스",
    "description": "아늑한 분위기와 감성이 가득한 집 안에서 나만의 시간과 편안함을 최대한 누리고 싶어!",
    "characteristics": [
      "편안하고 아늑함을 추구",
      "자기 전 꺼내보는 감성책",
      "늘 향수를 소중히 여김",
      "느림보 같은 여유로운 오후"
    ],
    "coupangKeyword": "홈 인테리어"
  }
};