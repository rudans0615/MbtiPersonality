export const calculateWorkplacePartyStyleTestLevel = (score: number) => {
  const keys = Object.keys(workplacePartyStyleResults);
  const numKeys = keys.length;
  if (numKeys === 0) return "";
  const maxScore = 8 * 4;
  const minScore = 8;
  const range = maxScore - minScore;
  const step = range / numKeys;
  const idx = Math.min(Math.floor((score - minScore) / step), numKeys - 1);
  return keys[Math.max(0, idx)];
};

export const workplacePartyStyleResults: Record<string, any> = {
  "typeA": {
    "title": "회식 구심점 스타일 🕺",
    "emoji": "🍻",
    "subtitle": "회식의 중심이 되는 당신!",
    "description": "당신은 회식의 중심이 되는 존재로, 사람들을 즐겁게 해주고 분위기를 이끄는 능력이 뛰어나요. 상사와의 관계에서도 적극적으로 소통하려고 하고, 팀워크를 중요시 여기는 편입니다. 이런 당신은 다른 사람들에게 긍정적인 에너지를 주는 동시에, 상사와의 관계를 더욱 깊게 만들 수 있는 특징이 있어요. 하지만 때때로 자신의 의견을 지나치게 부각시키려다 보면 상대방에 대한 배려가 부족해질 수 있으니 조심해야 할 필요가 있습니다.",
    "characteristics": [
      "적극적인 소통형",
      "분위기 메이커",
      "상사와의 유대 관계 중시",
      "팀워크를 중요시하는 성격"
    ],
    "coupangKeyword": "프리미엄 맥주, 무드등, 고급 식기 세트, 와인잔 세트",
    "coupangHook": "팀워크와 분위기를 살려줄 꿀템들 지금 만나보세요!"
  },
  "typeB": {
    "title": "신중한 관찰자 스타일 👀",
    "emoji": "🍷",
    "subtitle": "상황을 잘 살피는 당신!",
    "description": "당신은 회식 자리에서 상황을 잘 살펴보는 신중한 타입이에요. 상사와의 거리감을 유지하면서도 자연스럽게 대화를 나누기를 좋아하고, 분위기를 상하게 하지 않으려는 배려가 돋보이죠. 이러한 태도 덕분에 상사와의 관계에서 신뢰를 쌓을 수 있으며, 필요할 땐 자신의 의견도 당당하게 표현할 수 있어요. 하지만 가끔은 너무 조심스러워서 자기 의견을 충분히 드러내지 못할 수도 있으니 조절이 필요해요.",
    "characteristics": [
      "신중한 판단자",
      "상황 파악 능력",
      "상사와의 거리 조절",
      "자신의 의견 표현이 부족할 수 있음"
    ],
    "coupangKeyword": "고급 와인, 보험/재정 서적, 스프링 노트, 청소기",
    "coupangHook": "깔끔한 직장생활을 위한 똑똑한 아이템 만나보세요!"
  },
  "typeC": {
    "title": "자유로운 영혼 스타일 🦋",
    "emoji": "🍹",
    "subtitle": "자유로운 당신의 회식 방식!",
    "description": "당신은 회식 자리에서 자신만의 방식으로 자연스럽게 행동하는 자유로운 타입이에요. 상사와의 관계에서도 깊이 있는 대화보다는 편안한 관계를 추구하며, 때로는 경계를 허물고 친근하게 다가가길 원하죠. 이러한 모습은 동료들에게도 매력적으로 보이지만, 상사와의 관계에서는 가끔 예상치 못한 상황을 만들 수 있으니 주의가 필요합니다. 자신만의 스타일로 직장생활을 즐기면서도, 관계의 중요성을 잊지 않도록 하세요.",
    "characteristics": [
      "자유로운 사고",
      "편안한 관계 선호",
      "예기치 못한 분위기 조성",
      "자신의 스타일을 고수하는 성격"
    ],
    "coupangKeyword": "혼술 세트, 다양한 주류, 아로마 테라피, 피크닉 용품",
    "coupangHook": "자유롭고 편안한 시간을 위한 추천 아이템 지금 만나보세요!"
  },
  "typeD": {
    "title": "관심 없는 척 스타일 🙄",
    "emoji": "🥳",
    "subtitle": "내 일이 최우선인 당신!",
    "description": "당신은 회식에 대한 관심이 크게 없고, 자신의 일에 집중하는 스타일이에요. 상사와의 관계를 중요시하기보다 개인의 시간을 중시하며, 때때로 본인의 일 외에는 귀찮아하는 경향이 있죠. 이런 태도는 직장에서의 유연성을 떨어뜨릴 수 있는 위험이 있으니, 적절한 소통이 필요합니다. 자신에게 주어진 일에 잘 집중하면서도, 동료들과의 관계를 소중하게 여기는 균형을 맞추는 것이 중요해요.",
    "characteristics": [
      "자신의 일에만 집중",
      "소통 부족",
      "관심 없는 태도",
      "개인 시간을 중시하는 성격"
    ],
    "coupangKeyword": "업무용 텀블러, 블루투스 이어폰, 혼자 즐길 수 있는 책, 스스로 할 수 있는 취미 키트",
    "coupangHook": "혼자만의 시간을 더욱 가치 있게 만들어줄 아이템을 만나보세요!"
  }
};