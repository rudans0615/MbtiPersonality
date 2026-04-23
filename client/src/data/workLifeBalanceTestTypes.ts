export const calculateWorkLifeBalanceTestTestLevel = (score: number) => {
  const keys = Object.keys(workLifeBalanceTestResults);
  const numKeys = keys.length;
  if (numKeys === 0) return "";
  const maxScore = 12 * 4;
  const minScore = 12;
  const range = maxScore - minScore;
  const step = range / numKeys;
  const idx = Math.min(Math.floor((score - minScore) / step), numKeys - 1);
  return keys[Math.max(0, idx)];
};

export const workLifeBalanceTestResults: Record<string, any> = {
  "dynamicDynamo": {
    "title": "역동적인 다이너모",
    "emoji": "⚡",
    "subtitle": "너의 에너지는 무한해!",
    "description": "항상 아이디어가 넘치고 적극적으로 나아가는 스타일! 꿈을 쫓는 열정이 대단해.",
    "characteristics": [
      "열정적이고 활기찬",
      "자신감이 넘치는",
      "변화에 잘 적응하는",
      "다양한 도전을 선호하는"
    ],
    "coupangKeyword": "일정관리"
  },
  "strategicStar": {
    "title": "전략적인 스타",
    "emoji": "🌟",
    "subtitle": "성공을 위한 치밀한 접근법",
    "description": "신중하고 계획적인 사고로 성공을 쫓는 타입! 모험보다는 안전한 길을 선택해.",
    "characteristics": [
      "분석적이고 체계적인",
      "위험을 최소화하는",
      "다른 사람을 배려하는",
      "계획적인 삶을 선호하는"
    ],
    "coupangKeyword": "계획표"
  },
  "soulfulSeeker": {
    "title": "감성적인 탐구자",
    "emoji": "💖",
    "subtitle": "진정한 나를 찾는 여정!",
    "description": "감정이 풍부하고 대인관계가 좋은 스타일! 자신의 진정한 목소리를 찾아가고 있어.",
    "characteristics": [
      "감정적인 연결을 중시하는",
      "공감 능력이 뛰어난",
      "소통을 좋아하는",
      "개인적인 개발에 관심이 많은"
    ],
    "coupangKeyword": "자기계발서"
  },
  "calmComet": {
    "title": "차분한 혜성",
    "emoji": "☄️",
    "subtitle": "잦은 변화 속에서도 안정적인 나",
    "description": "변화를 두려워하지 않고 감정적으로도 안정된 타입! 언제나 평정심을 유지하고 있어.",
    "characteristics": [
      "차분하고 안정적인",
      "복잡한 감정을 잘 다루는",
      "합리적인 판단력을 지닌",
      "신뢰를 주는 존재"
    ],
    "coupangKeyword": "마인드풀니스"
  }
};