export const calculateSeasonalEmotionalCheckTestLevel = (score: number) => {
  const keys = Object.keys(seasonalEmotionalCheckResults);
  const numKeys = keys.length;
  if (numKeys === 0) return "";
  const maxScore = 4 * 4;
  const minScore = 4;
  const range = maxScore - minScore;
  const step = range / numKeys;
  const idx = Math.min(Math.floor((score - minScore) / step), numKeys - 1);
  return keys[Math.max(0, idx)];
};

export const seasonalEmotionalCheckResults: Record<string, any> = {
  "spring": {
    "title": "봄 기운이 가득한 당신",
    "emoji": "🌸",
    "subtitle": "상큼하고 싱그럽네!",
    "description": "당신의 마음은 봄의 따뜻한 햇살처럼 상큼하게 가득 차있어! 감정을 솔직하게 표현하는 편이고 주위를 밝게 만들어.",
    "characteristics": [
      "긍정적 사고",
      "따뜻한 마음",
      "주변을 배려하는 성격",
      "새로운 도전을 좋아함"
    ],
    "coupangKeyword": "봄 원피스"
  },
  "summer": {
    "title": "여름의 열정!",
    "emoji": "🌊",
    "subtitle": "그 열정과 에너지가 느껴져!",
    "description": "여름의 뜨거운 햇살처럼 당신의 에너지는 넘쳐나! 감정을 숨기지 않고 상대에게 모두 드러내는 편이야.",
    "characteristics": [
      "사교적",
      "탐구정신",
      "새로운 경험 추구",
      "에너지가 넘침"
    ],
    "coupangKeyword": "여름 바지"
  },
  "autumn": {
    "title": "가을의 차분한 아름다움",
    "emoji": "🍂",
    "subtitle": "감성과 따뜻함을 두루 갖춘 당신!",
    "description": "차분한 가을 날씨처럼 당신의 마음도 솔직하게 성장하는 걸 원해. 고민이 많겠지만, 언제나 자기 반성을 통해 발전하게 될 거야.",
    "characteristics": [
      "감성 풍부",
      "사려 깊음",
      "느릿한 나아감",
      "내적 성장 추구"
    ],
    "coupangKeyword": "가을 스웨터"
  },
  "winter": {
    "title": "겨울의 차가운 매력",
    "emoji": "❄️",
    "subtitle": "차가움의 속성 아래 따뜻한 본질!",
    "description": "차가운 겨울 날씨 속에서도 진정한 감정을 놓치지 않는 당신. 외면은 차갑지만 속은 따뜻한 사람일 가능성이 높아.",
    "characteristics": [
      "자기 방어적",
      "내성적",
      "진솔함 추구",
      "웰빙 思維"
    ],
    "coupangKeyword": "겨울 패딩"
  }
};