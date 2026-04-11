export const calculatePastLifeTestTestLevel = (score: number) => {
  const keys = Object.keys(pastLifeTestResults);
  if (score < 20) return keys[0];
  if (score < 40) return keys[1];
  if (score < 60) return keys[2];
  return keys[3] || keys[0];
};

export const pastLifeTestResults: Record<string, any> = {
  "type1": {
    "title": "자유로운 영혼",
    "description": "당신은 과거에 자연 속에서 자유롭게 살았던 영혼입니다. 정서적으로 풍부하고, 다른 이들과의 유대감을 중요시했어요."
  },
  "type2": {
    "title": "사랑을 찾는 소중한 존재",
    "description": "당신의 전생은 사랑과 우정을 중시했던 존재로, 여러 관계를 통해 많은 것을 배웠습니다."
  },
  "type3": {
    "title": "전사 혹은 탐험가",
    "description": "당신은 용감하고 모험을 두려워하지 않는 과거의 전사입니다. 늘 새로운 경험을 추구하는 영향을 남겼습니다."
  },
  "type4": {
    "title": "지혜의 수호자",
    "description": "당신은 지혜를 중시하며, 많은 사람들에게 지식을 나눈 전생의 스승이었습니다. 깊은 인사이트를 가지고 있습니다."
  }
};