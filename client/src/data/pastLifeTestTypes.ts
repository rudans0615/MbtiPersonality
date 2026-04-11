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
  "1": {
    "title": "자연과 함께한 삶",
    "description": "당신은 자연과 깊은 연결을 느끼며, 조화롭고 평화로운 전생을 살아왔습니다. 당신은 아마 농부, 원주율적인 사람의 삶을 살았을 것입니다."
  },
  "2": {
    "title": "도시의 상인",
    "description": "당신은 빠른 도시 생활을 즐기며 다양한 사람들과 소통했던 전생을 가진 듯합니다. 상업적이고 혁신적인 아이디어가 넘쳤던 시기였습니다."
  },
  "3": {
    "title": "예술가의 삶",
    "description": "창의성과 감성을 지닌 당신은 전생에 예술과 문화의 중심에서 영향을 미쳤을 것입니다. 예술가 혹은 창작자로서의 삶을 살았을 가능성이 큽니다."
  },
  "4": {
    "title": "모험가의 전생",
    "description": "당신은 탐험과 발견을 사랑했던 모험가였습니다. 새로운 세계를 찾고, 다양한 문화를 경험했던 기억이 남아있는 것 같습니다."
  }
};