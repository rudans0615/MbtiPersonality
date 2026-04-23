export const calculateSeasonalMoodTestTestLevel = (score: number) => {
  const keys = Object.keys(seasonalMoodTestResults);
  const numKeys = keys.length;
  if (numKeys === 0) return "";
  const maxScore = 12 * 4;
  const minScore = 12;
  const range = maxScore - minScore;
  const step = range / numKeys;
  const idx = Math.min(Math.floor((score - minScore) / step), numKeys - 1);
  return keys[Math.max(0, idx)];
};

export const seasonalMoodTestResults: Record<string, any> = {
  "springVibe": {
    "title": "봄의 소녀",
    "emoji": "🌸",
    "subtitle": "새로움을 좋아하는 당신",
    "description": "당신은 봄처럼 새로운 시작과 변화를 즐기는 타입이야. 어려운 상황에서도 긍정적인 에너지를 주는 사람이야!",
    "characteristics": [
      "낙천적",
      "친구를 소중히 여김",
      "창의적",
      "사교적인"
    ],
    "coupangKeyword": "봄 꽃"
  },
  "summerChill": {
    "title": "여름의 차가운 여왕",
    "emoji": "☀️",
    "subtitle": "더위를 즐기는 당신",
    "description": "여름처럼 열정적이고 쿨한 당신! 사랑과 모험을 추구하는 사람들 사이에선 당신이 주인공이야.",
    "characteristics": [
      "활력 넘침",
      "사교적",
      "모험심 강함",
      "사랑에 로맨틱"
    ],
    "coupangKeyword": "여름 바캉스"
  },
  "autumnDreamer": {
    "title": "가을의 감성가",
    "emoji": "🍁",
    "subtitle": "성찰의 계절을 좋아하는 당신",
    "description": "가을처럼 깊이 있는 감성을 가진 당신! 가끔은 혼자만의 시간도 필요해.",
    "characteristics": [
      "내성적",
      "감정이 풍부함",
      "문화를 사랑함",
      "신중함"
    ],
    "coupangKeyword": "가을 독서"
  },
  "winterSoul": {
    "title": "겨울의 따뜻한 마음",
    "emoji": "❄️",
    "subtitle": "차가운 날씨 속에서 따뜻함을 찾아",
    "description": "겨울의 아름답고 따뜻한 마음을 가진 당신. 친구들과의 시간이 더 소중하게 느껴져.",
    "characteristics": [
      "온화함",
      "친구를 소중히 여김",
      "정서적 지능이 높음",
      "신중함"
    ],
    "coupangKeyword": "겨울 따뜻한 음료"
  }
};