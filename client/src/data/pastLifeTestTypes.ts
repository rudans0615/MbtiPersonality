export const calculatePastLifeTestTestLevel = (score: number) => {
  const keys = Object.keys(pastLifeTestResults);
  const numKeys = keys.length;
  if (numKeys === 0) return "";
  // 12 questions × score 1~4 = range 12~48, evenly split
  const maxScore = 12 * 4;
  const minScore = 12;
  const range = maxScore - minScore;
  const step = range / numKeys;
  const idx = Math.min(Math.floor((score - minScore) / step), numKeys - 1);
  return keys[Math.max(0, idx)];
};

export const pastLifeTestResults: Record<string, any> = {
  "type1": {
    "title": "자유로운 영혼",
    "description": "당신은 많은 전생을 다방면에서 경험한, 모험을 사랑하는 영혼입니다. 물리적인 한계를 넘나들며 다양한 문화와 경험을 쌓아온 과거가 있습니다."
  },
  "type2": {
    "title": "지혜의 여신",
    "description": "당신은 깊은 사유와 지식을 추구하는 전생을 가진 존재입니다. 역사 속의 중요한 인물들에게 영향을 받았으며, 지혜롭게 삶을 살아가고자 합니다."
  },
  "type3": {
    "title": "예술가",
    "description": "당신은 창의력이 흐르는 예술가의 영혼입니다. 다양한 예술과 문화를 통해 감정을 표현하며, 과거에는 예술적인 삶을 살아왔을 것입니다."
  },
  "type4": {
    "title": "평화로운 수호자",
    "description": "당신은 조화를 중요시하며 평화를 지키는 전생을 가진 존재입니다. 고난 속에서도 사람들의 위안이 되어주는 삶을 살았던 영혼입니다."
  }
};