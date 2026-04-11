
export const calculatePastLifeTestTestLevel = (score: number) => {
  // AI-generated scoring threshold placeholder
  if (score < 20) return Object.keys(pastLifeTestResults)[0];
  if (score < 40) return Object.keys(pastLifeTestResults)[1];
  if (score < 60) return Object.keys(pastLifeTestResults)[2];
  return Object.keys(pastLifeTestResults)[3] || Object.keys(pastLifeTestResults)[0];
};

export const pastLifeTestResults: Record<string, any> = {
  "type1": {
    "title": "자연의 순례자",
    "description": "당신은 전생에서 자연과 깊은 연관을 맺었던 인물입니다. 숲이나 바다에서 평화로운 삶을 살았을 가능성이 높습니다."
  },
  "type2": {
    "title": "호기심 많은 탐험가",
    "description": "전생에 당신은 세계를 탐험하며 다양한 경험을 쌓은 여정가입니다. 모험과 신비로움을 사랑했던 영혼이죠."
  },
  "type3": {
    "title": "예술가의 영혼",
    "description": "당신은 전생에서 창의적이고 감성적인 예술가였습니다. 사람들의 감정을 이끌어낼 수 있는 능력을 지닌 인물입니다."
  },
  "type4": {
    "title": "지혜의 전파자",
    "description": "당신의 전생은 지혜와 지식을 전파하던 학자였습니다. 깊이 있는 사고와 통찰력을 지닌 인물입니다."
  }
};
