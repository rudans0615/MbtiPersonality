export const calculateLoveLifeChoiceTestLevel = (score: number) => {
  const keys = Object.keys(loveLifeChoiceResults);
  const numKeys = keys.length;
  if (numKeys === 0) return "";
  const maxScore = 8 * 4;
  const minScore = 8;
  const range = maxScore - minScore;
  const step = range / numKeys;
  const idx = Math.min(Math.floor((score - minScore) / step), numKeys - 1);
  return keys[Math.max(0, idx)];
};

export const loveLifeChoiceResults: Record<string, any> = {
  "passionateLover": {
    "title": "열정적인 연애 스타일",
    "emoji": "🔥",
    "subtitle": "사랑이 모든 것을 지배해!",
    "description": "너는 연애에 대한 열정이 가득해! 상대방에게 다가가고, 사랑을 위해서라면 무엇이든 할 준비가 돼 있어.",
    "characteristics": [
      "강한 열정",
      "솔직한 표현",
      "자유로운 관계",
      "모험을 즐김"
    ],
    "coupangKeyword": "로맨틱한 데이트 아이템"
  },
  "cautiousDreamer": {
    "title": "조심스러운 꿈꾸는 연애",
    "emoji": "🌙",
    "subtitle": "천천히 사랑을 찾아가는 스타일",
    "description": "너는 조심스럽게 사랑을 쌓아가는 타입! 상대방과의 관계가 깊어질수록 솔직함이 빛을 발휘해.",
    "characteristics": [
      "상대방에 대한 배려",
      "신중한 접근",
      "심리적 안정",
      "서로의 취미 공유"
    ],
    "coupangKeyword": "로맨틱 감성을 담은 책"
  },
  "playfulHeart": {
    "title": "장난기 가득한 사랑",
    "emoji": "😄",
    "subtitle": "연애는 재밌어야 해!",
    "description": "너는 연애가 지루할 틈이 없어! 항상 새로운 재미를 찾아가며, 상대방과의 장난스러운 케미를 즐기는 스타일이야.",
    "characteristics": [
      "유머 감각",
      "창의적인 데이트",
      "자유롭게 즐김",
      "긍정적인 매력"
    ],
    "coupangKeyword": "유쾌한 연애 아이템"
  },
  "independentSoul": {
    "title": "독립적인 사랑",
    "emoji": "🦋",
    "subtitle": "혼자서도 충분히 행복해!",
    "description": "너는 연애보다 나 자신을 더욱 소중히 여기는 타입! 사랑은 좋지만, 개인의 시간을 헌신적으로 소중히 여겨.",
    "characteristics": [
      "자기 존중",
      "스스로 행복",
      "일의 우선순위",
      "신뢰 기반의 관계"
    ],
    "coupangKeyword": "자기 계발 관련 서적"
  }
};