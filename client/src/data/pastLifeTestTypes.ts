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
    "title": "고대 전사",
    "description": "당신은 고대의 용감한 전사로, 전장을 누비며 자신의 신념을 지켰던 인물입니다. 용기와 결단력이 당신의 주된 특성입니다."
  },
  "type2": {
    "title": "지혜로운 철학자",
    "description": "당신은 깊은 철학적 사고와 통찰력을 지닌 인물로, 많은 사람들의 가르침과 지혜를 전수했던 전생이 있습니다."
  },
  "type3": {
    "title": "자유로운 영혼",
    "description": "당신은 시대를 넘나드는 예술가로서 자유로운 영혼을 지닌 인물입니다. 창의성과 감성을 통해 세상을 이야기했던 당신입니다."
  },
  "type4": {
    "title": "신비로운 신비가",
    "description": "당신은 신비롭고 깊이 있는 지식을 지닌 신비가로, 세상의 불가사의를 탐구하는 데 헌신했던 인물입니다."
  }
};