
export const calculatePastLifeTestTestLevel = (score: number) => {
  // AI-generated scoring threshold placeholder
  if (score < 20) return Object.keys(pastLifeTestResults)[0];
  if (score < 40) return Object.keys(pastLifeTestResults)[1];
  if (score < 60) return Object.keys(pastLifeTestResults)[2];
  return Object.keys(pastLifeTestResults)[3] || Object.keys(pastLifeTestResults)[0];
};

export const pastLifeTestResults: Record<string, any> = {
  "type1": {
    "title": "자유로운 영혼",
    "description": "당신은 전생에 자연 속에서 자유롭게 살아갔던 영혼입니다. 새로운 경험과 모험을 좋아하며, 언제나 인간 본연의 아름다움을 추구하는 존재였을 것입니다."
  },
  "type2": {
    "title": "위대한 지도자",
    "description": "전생에서 당신은 사람들을 이끌었던 강력한 지도자였습니다. 정의와 사명을 중요시여기며, 많은 이들에게 영감을 준 그런 인물입니다."
  },
  "type3": {
    "title": "지식의 탐구자",
    "description": "당신은 지식을 추구했던 연구자였습니다. 호기심이 많고, 다양한 분야에서 배움의 기회를 놓치지 않았던 존재입니다."
  },
  "type4": {
    "title": "사랑이 넘치는 부모",
    "description": "전생에 당신은 가정을 소중히 여기는 헌신적인 부모였습니다. 가족과의 깊은 유대를 중요시하며 사랑을 나누었을 거예요."
  }
};
