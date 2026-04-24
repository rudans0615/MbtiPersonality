export const calculateSocialMediaHabitsTestTestLevel = (score: number) => {
  const keys = Object.keys(socialMediaHabitsTestResults);
  const numKeys = keys.length;
  if (numKeys === 0) return "";
  const maxScore = 12 * 4;
  const minScore = 12;
  const range = maxScore - minScore;
  const step = range / numKeys;
  const idx = Math.min(Math.floor((score - minScore) / step), numKeys - 1);
  return keys[Math.max(0, idx)];
};

export const socialMediaHabitsTestResults: Record<string, any> = {
  "casualConsumer": {
    "title": "편안한 소비자",
    "emoji": "😊",
    "subtitle": "소소하게 즐기는 일상",
    "description": "너는 슬픈 상황조차 불편하게 만드는 스릴러스러운 콘텐츠보다, 일상 속 작은 이야기 속에서 위로를 받는 편이야. 따뜻한 기운을 좋아해서 가벼운 웹툰이나 일상 브이로그에 많이 끌리곤 하지. 삶도 이렇게 잔잔하면서 유쾌하게 즐기는 편!",
    "characteristics": [
      "온전한 나만의 시간",
      "잔잔하게 흘러가는 일상",
      "작은 행복 집중",
      "온몸으로 여유 느끼기"
    ],
    "coupangKeyword": "감성 일상 브이로그"
  },
  "trendSeeker": {
    "title": "트렌드 수집가",
    "emoji": "🔥",
    "subtitle": "최신 유행 주도하는 너",
    "description": "너는 SNS에서 가장 화려한 것을 찾고 있어! 스타일이 남다르고 재미없거나 평범한 건 정말 못 참고 넘어가는 성격이야. 새로운 유행에 대한 감각이 뛰어나고 친구들에도 정보를 쉽게 전하는 엔터팬이에요. 친구들과 화제거리를 만들어내는 걸 원하고 있어!",
    "characteristics": [
      "늘 최신 유행 파악",
      "콘텐츠 즐기고 제작하기",
      "시선을 끌기 위해 노력",
      "다양한 브랜딩 적응력 넘침"
    ],
    "coupangKeyword": "재미있는 SNS 영상"
  }
};