export const calculateInnerAnimalTestTestLevel = (score: number) => {
  const keys = Object.keys(innerAnimalTestResults);
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

export const innerAnimalTestResults: Record<string, any> = {
  "type1": {
    "title": "사자",
    "description": "당신은 강력한 리더십과 카리스마를 지닌 사자와 같습니다. 자신감 넘치고 용기 있는 당신은 사람들을 이끄는 자연스러운 능력을 소유하고 있습니다."
  },
  "type2": {
    "title": "수달",
    "description": "당신은 수달과 같은 사랑스럽고 유머 감각이 뛰어난 존재입니다. 여러분은 주변 사람들에게 긍정적인 에너지를 불어넣으며, 친밀하고 따듯한 관계를 맺는 것을 중요시합니다."
  },
  "type3": {
    "title": "올빼미",
    "description": "당신은 지혜롭고 편안한 성격을 가진 올빼미입니다. 깊이 있는 사고와 독창적인 아이디어로 많은 사람들에게 영감을 주는 존재입니다."
  },
  "type4": {
    "title": "돌고래",
    "description": "당신은 사랑과 사회성을 중시하는 돌고래와 같습니다. 뛰어난 커뮤니케이션 능력과 화합의 상징으로, 당신의 따뜻한 성격은 사람들을 친근하게 만듭니다."
  }
};