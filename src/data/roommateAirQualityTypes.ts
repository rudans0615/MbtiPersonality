export const calculateRoommateAirQualityTestLevel = (score: number) => {
  const keys = Object.keys(roommateAirQualityResults);
  const numKeys = keys.length;
  if (numKeys === 0) return "";
  const maxScore = 8 * 4;
  const minScore = 8;
  const range = maxScore - minScore;
  const step = range / numKeys;
  const idx = Math.min(Math.floor((score - minScore) / step), numKeys - 1);
  return keys[Math.max(0, idx)];
};

export const roommateAirQualityResults: Record<string, any> = {
  "whisperOfThePast": {
    "title": "과거의 속삭임 👻",
    "emoji": "👻",
    "subtitle": "당신의 숨겨진 흑역사!",
    "description": "당신은 과거의 경험이 현재의 삶에 많은 영향을 미친 타입이야. 종종 지나쳤던 작은 일들이나 주변의 소음, 분위기들이 당신의 심리에 큰 영향을 미치고, 그로 인해 생긴 기억들이 흑역사로 남는 경우가 많아. 하지만 이런 경험들이 오히려 지금의 너를 더욱 특별하게 만들어주기도 해. 종종 주변 사람들과도 이러한 이야기를 나누면서 서로를 이해하고, 공감하는 관계를 만들어가게 돼. 다양한 경험을 통해 강해진 당신의 성격을 다른 사람들과 나누는 걸 두려워하지 말아야 해!",
    "characteristics": [
      "상대방의 기분을 잘 읽어",
      "과거의 기억을 소중히 여김",
      "공감 능력이 뛰어남",
      "사건을 다양한 각도로 바라봄"
    ],
    "coupangKeyword": "아로마 디퓨저, 공기청정기, 천연 청소용품, 수면 가습기",
    "coupangHook": "자신을 돌아보는 시간, 기분 좋은 공기질을 만들어봐!"
  }
};