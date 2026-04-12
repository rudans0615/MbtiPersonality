export const calculateHealingJourneyTestLevel = (score: number) => {
  const keys = Object.keys(healingJourneyResults);
  const numKeys = keys.length;
  if (numKeys === 0) return "";
  const maxScore = 4 * 4;
  const minScore = 4;
  const range = maxScore - minScore;
  const step = range / numKeys;
  const idx = Math.min(Math.floor((score - minScore) / step), numKeys - 1);
  return keys[Math.max(0, idx)];
};

export const healingJourneyResults: Record<string, any> = {
  "beachSoul": {
    "title": "바다의 소울",
    "emoji": "🌊",
    "subtitle": "햇볕 따사로운 바다가 너의 진정한 힐링",
    "description": "햇살과 바다의 경치를 사랑하는 너는 거리의 소음 대신 잔잔한 파도 소리를 원해. 바다에서 느끼는 여유가 너에게 최고의 휴식.",
    "characteristics": [
      "해양 기분이 좋아",
      "편안한 분위기를 선호",
      "물가 근처를 좋아해",
      "느긋한 시간을 즐겨"
    ],
    "coupangKeyword": "해수욕장 용품"
  },
  "mountainSpirit": {
    "title": "산의 정신",
    "emoji": "⛰",
    "subtitle": "높은 산에서 찾는 새로운 나",
    "description": "자연 속에서 홀로 적막을 만끽하며 새로운 발견을 원해. 오른 후 하늘을 바라보면서 삶의 균형을 찾고 싶어.",
    "characteristics": [
      "자연과 함께하는 것을 좋아해",
      "조용한 시간에 집중하는 편",
      "모험가 타입이야",
      "무한히 펼쳐진Horizons는 꿈"
    ],
    "coupangKeyword": "아웃도어 용품"
  },
  "cityVibe": {
    "title": "도시의 활력",
    "emoji": "🏙️",
    "subtitle": "도시 속 사람들과 놀아볼 시간!",
    "description": "구석구석 소음을 들어가며 사람이 많은 곳을 즐기며 에너지 부족의 모든걸 다 태워버리고 싶어.",
    "characteristics": [
      "사람들과 어울리는 걸 좋아해",
      "도시 탐방 채비 좋음",
      "냄새로 예감하라"
    ],
    "coupangKeyword": "서울 카페"
  },
  "quietTime": {
    "title": "온화한 하루",
    "emoji": "☕",
    "subtitle": "조용한 공간과 독서를 사랑해",
    "description": "전원생활 같은 고요한 순간을 즐기며 상대방 없이도 홀로 떠난 듯한 기분에 포커스를 두고 있어. 나만의 고독함을 시선을 붙잡아야 해.",
    "characteristics": [
      "사색하는 상태에서 중심을 안정",
      "혼자만의 건강한 식사로 무기력 동양을 잠재웁니다",
      "취미와 Book의 조화를 주춤., "
    ]
  }
};