export const calculateFriendshipVibes1234TestLevel = (score: number) => {
  const keys = Object.keys(friendshipVibes1234Results);
  const numKeys = keys.length;
  if (numKeys === 0) return "";
  const maxScore = 12 * 4;
  const minScore = 12;
  const range = maxScore - minScore;
  const step = range / numKeys;
  const idx = Math.min(Math.floor((score - minScore) / step), numKeys - 1);
  return keys[Math.max(0, idx)];
};

export const friendshipVibes1234Results: Record<string, any> = {
  "friendlySupporter": {
    "title": "친절한 지원가",
    "emoji": "🤗",
    "subtitle": "너의 우정은 항상 따뜻해!",
    "description": "너는 친구들에게 항상 힘을 주고 그들의 곁에서 따뜻한 지원을 아끼지 않아. 어려운 순간에 긍정적인 에너지를 주며, 친구들이 힘들 때 더 잘 통하는 타입이야. 하지만 가끔은 너 자신도 돌보는 걸 잊지 말고, 네가 우선이라는 것도 잊지 마!",
    "characteristics": [
      "친구의 고민을 잘 들어주는 편",
      "아름다운 말 한마디 아끼지 않음",
      "긍정적이고 따뜻한 성격",
      "이해심이 깊어 친구에게 큰 힘이 됨"
    ],
    "coupangKeyword": "우정 선물"
  },
  "funAdventurer": {
    "title": "재미있는 모험가",
    "emoji": "🎉",
    "subtitle": "친구와 함께라면 언제나 즐거워!",
    "description": "너는 친구들과의 모험을 사랑하는 타입이야! 새로운 경험을 함께 하는 걸 좋아하고, 언제나 분위기를 띄우는 재주가 있어. 항상 즐거운 추억을 만들고 싶어 하는 너는 친구들을 위한 최고의 파트너야. 다만, 가끔은 진지함도 필요하다는 걸 잊지 말고!",
    "characteristics": [
      "모험을 두려워하지 않음",
      "사교성이 뛰어나고 분위기 메이커",
      "새로운 경험을 함께 하는 걸 좋아함",
      "재미있고 유머 감각이 뛰어남"
    ],
    "coupangKeyword": "모험 아이템"
  },
  "thoughtfulListener": {
    "title": "사려 깊은 청취자",
    "emoji": "👐",
    "subtitle": "네가 친구의 이야기를 잘 들어줘!",
    "description": "너는 친구들이 이야기할 때, 그들의 감정을 잘 이해하고 사려 깊은 조언을 줄 수 있는 타입이야. 이로 인해 친구들은 너와의 대화에서 편안함을 느끼고, 항상 깊은 신뢰를 갖게 돼. 하지만 너의 감정도 잘 표현할 수 있도록 노력해야 해!",
    "characteristics": [
      "친구의 이야기에 진심으로 귀 기울임",
      "소통을 중요시함",
      "감정을 잘 이해하는 편",
      "상대방에게 배려 깊은 조언을 아끼지 않음"
    ],
    "coupangKeyword": "소통 아이템"
  },
  "spontaneousCreator": {
    "title": "자유로운 창조자",
    "emoji": "✨",
    "subtitle": "너는 새로운 것을 만들어가는 친구!",
    "description": "너는 친구들과의 관계에서 자유롭고 창의적인 모습을 가지고 있어. 변화를 두려워하지 않고, 항상 새로운 아이디어로 친구들과의 시간을 더 특별하게 만들어. 하지만, 가끔은 사람들과 구속 없는 관계를 지향하면서도 서로의 경계를 존중하는 것도 중요해!",
    "characteristics": [
      "창의적인 생각이 많은 편",
      "변화에 잘 적응함",
      "자유로운 성격",
      "친구들에게 항상 새로운 경험을 제공함"
    ],
    "coupangKeyword": "창의성 도구"
  }
};