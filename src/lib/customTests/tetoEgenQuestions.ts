export interface TetoEgenQuestion {
  id: number;
  text: string;
  emoji: string;
  type: 'gender' | 'personality';
}

export const tetoEgenQuestions: TetoEgenQuestion[] = [
  {
    id: 1,
    text: "나의 성별은?",
    emoji: "🚻",
    type: "gender"
  },
  {
    id: 2,
    text: "경쟁 상황에서 나는?",
    emoji: "🏆",
    type: "personality"
  },
  {
    id: 3,
    text: "리더십을 발휘할 때 나는?",
    emoji: "👑",
    type: "personality"
  },
  {
    id: 4,
    text: "감정 표현에 있어서 나는?",
    emoji: "💭",
    type: "personality"
  },
  {
    id: 5,
    text: "새로운 도전에 직면했을 때?",
    emoji: "🎯",
    type: "personality"
  },
  {
    id: 6,
    text: "친구들과의 관계에서 나는?",
    emoji: "👥",
    type: "personality"
  },
  {
    id: 7,
    text: "스트레스 상황에서 나는?",
    emoji: "😤",
    type: "personality"
  },
  {
    id: 8,
    text: "의사결정을 할 때 나는?",
    emoji: "🤔",
    type: "personality"
  },
  {
    id: 9,
    text: "갈등이 생겼을 때 나는?",
    emoji: "⚡",
    type: "personality"
  },
  {
    id: 10,
    text: "취미 활동을 선택할 때?",
    emoji: "🎨",
    type: "personality"
  },
  {
    id: 11,
    text: "패션이나 외모에 대해?",
    emoji: "👗",
    type: "personality"
  },
  {
    id: 12,
    text: "목표를 설정할 때 나는?",
    emoji: "🎪",
    type: "personality"
  },
  {
    id: 13,
    text: "타인의 감정을 읽을 때?",
    emoji: "🔮",
    type: "personality"
  },
  {
    id: 14,
    text: "위험한 상황에서 나는?",
    emoji: "⚠️",
    type: "personality"
  },
  {
    id: 15,
    text: "새로운 사람을 만날 때?",
    emoji: "🤝",
    type: "personality"
  },
  {
    id: 16,
    text: "팀 프로젝트에서 나는?",
    emoji: "👨‍💼",
    type: "personality"
  },
  {
    id: 17,
    text: "감정적으로 힘들 때?",
    emoji: "😢",
    type: "personality"
  },
  {
    id: 18,
    text: "성취감을 느낄 때는?",
    emoji: "🏅",
    type: "personality"
  },
  {
    id: 19,
    text: "연애에서 가장 중요하게 생각하는 것은?",
    emoji: "💕",
    type: "personality"
  },
  {
    id: 20,
    text: "미래를 계획할 때 나는?",
    emoji: "🔮",
    type: "personality"
  },
  {
    id: 21,
    text: "자신의 성격을 한 마디로 표현한다면?",
    emoji: "🎭",
    type: "personality"
  }
];

export const tetoEgenAnswers = {
  1: { // 성별
    answers: [
      { text: "남성", value: "M" },
      { text: "여성", value: "F" }
    ]
  },
  2: { // 경쟁 상황
    answers: [
      { text: "승부욕이 강하고 이기려고 최선을 다한다", value: 4 },
      { text: "적당히 경쟁하되 즐기려고 한다", value: 3 },
      { text: "경쟁보다는 협력을 선호한다", value: 2 },
      { text: "경쟁 자체를 부담스러워한다", value: 1 }
    ]
  },
  3: { // 리더십
    answers: [
      { text: "자연스럽게 앞장서서 이끌어간다", value: 4 },
      { text: "필요할 때 리더 역할을 맡는다", value: 3 },
      { text: "다른 사람을 지원하는 역할을 선호한다", value: 2 },
      { text: "리더보다는 팔로워 역할이 편하다", value: 1 }
    ]
  },
  4: { // 감정 표현
    answers: [
      { text: "감정을 솔직하고 직접적으로 표현한다", value: 4 },
      { text: "상황에 따라 적절히 표현한다", value: 3 },
      { text: "은근하고 간접적으로 표현한다", value: 2 },
      { text: "감정을 잘 드러내지 않는다", value: 1 }
    ]
  },
  5: { // 새로운 도전
    answers: [
      { text: "주저 없이 도전하며 모험을 즐긴다", value: 4 },
      { text: "신중하게 계획하고 도전한다", value: 3 },
      { text: "충분히 고민한 후 조심스럽게 시도한다", value: 2 },
      { text: "위험부담이 적은 안전한 길을 선택한다", value: 1 }
    ]
  },
  6: { // 친구 관계
    answers: [
      { text: "활발하고 넓은 인맥을 유지한다", value: 4 },
      { text: "다양한 사람들과 균형있게 지낸다", value: 3 },
      { text: "소수의 깊은 친구를 선호한다", value: 2 },
      { text: "혼자 있는 시간을 더 소중히 여긴다", value: 1 }
    ]
  },
  7: { // 스트레스 상황
    answers: [
      { text: "적극적으로 문제를 해결하려고 한다", value: 4 },
      { text: "논리적으로 분석하고 대처한다", value: 3 },
      { text: "감정을 추스르고 차근차근 접근한다", value: 2 },
      { text: "시간을 두고 자연스럽게 해결되길 기다린다", value: 1 }
    ]
  },
  8: { // 의사결정
    answers: [
      { text: "빠르고 과감하게 결정한다", value: 4 },
      { text: "합리적 근거를 바탕으로 결정한다", value: 3 },
      { text: "주변 의견을 충분히 듣고 결정한다", value: 2 },
      { text: "신중하게 오랜 시간을 두고 결정한다", value: 1 }
    ]
  },
  9: { // 갈등 상황
    answers: [
      { text: "정면으로 맞서서 해결하려고 한다", value: 4 },
      { text: "논리적으로 설득하려고 한다", value: 3 },
      { text: "상대방 입장을 이해하려고 노력한다", value: 2 },
      { text: "갈등을 피하고 시간이 해결해주길 기다린다", value: 1 }
    ]
  },
  10: { // 취미 활동
    answers: [
      { text: "스포츠, 여행 등 활동적이고 역동적인 것", value: 4 },
      { text: "독서, 영화 등 지적이고 정적인 것", value: 3 },
      { text: "예술, 음악 등 감성적이고 창의적인 것", value: 2 },
      { text: "명상, 힐링 등 평화롭고 치유적인 것", value: 1 }
    ]
  },
  11: { // 패션/외모
    answers: [
      { text: "트렌디하고 개성있게 꾸미는 것을 좋아한다", value: 4 },
      { text: "깔끔하고 단정한 스타일을 선호한다", value: 3 },
      { text: "편안하고 자연스러운 스타일을 좋아한다", value: 2 },
      { text: "외모보다는 내면이 더 중요하다고 생각한다", value: 1 }
    ]
  },
  12: { // 목표 설정
    answers: [
      { text: "높고 도전적인 목표를 세운다", value: 4 },
      { text: "현실적이고 달성 가능한 목표를 세운다", value: 3 },
      { text: "단계적이고 안정적인 목표를 선호한다", value: 2 },
      { text: "큰 목표보다는 현재에 충실하려 한다", value: 1 }
    ]
  },
  13: { // 타인의 감정
    answers: [
      { text: "직감적으로 빠르게 파악한다", value: 4 },
      { text: "행동과 말을 통해 분석한다", value: 3 },
      { text: "세심하게 관찰하고 공감한다", value: 2 },
      { text: "타인의 감정보다 객관적 사실에 집중한다", value: 1 }
    ]
  },
  14: { // 위험한 상황
    answers: [
      { text: "용기있게 맞서고 행동한다", value: 4 },
      { text: "신중하게 판단하고 대응한다", value: 3 },
      { text: "안전을 우선시하며 조심스럽게 행동한다", value: 2 },
      { text: "가능한 위험을 피하고 도움을 요청한다", value: 1 }
    ]
  },
  15: { // 새로운 사람
    answers: [
      { text: "적극적으로 다가가서 친해진다", value: 4 },
      { text: "자연스럽게 대화를 시작한다", value: 3 },
      { text: "상대방이 먼저 다가오기를 기다린다", value: 2 },
      { text: "낯선 사람과 만나는 것이 부담스럽다", value: 1 }
    ]
  },
  16: { // 팀 프로젝트
    answers: [
      { text: "팀을 이끌고 방향을 제시한다", value: 4 },
      { text: "아이디어를 제공하고 활발히 참여한다", value: 3 },
      { text: "팀원들을 지원하고 조율하는 역할을 한다", value: 2 },
      { text: "주어진 역할을 성실히 수행한다", value: 1 }
    ]
  },
  17: { // 감정적으로 힘들 때
    answers: [
      { text: "적극적으로 해결방법을 찾는다", value: 4 },
      { text: "친구들과 이야기하며 털어놓는다", value: 3 },
      { text: "혼자 조용히 감정을 정리한다", value: 2 },
      { text: "시간이 지나면 자연스럽게 나아질 것이라 믿는다", value: 1 }
    ]
  },
  18: { // 성취감
    answers: [
      { text: "목표를 달성하고 경쟁에서 이겼을 때", value: 4 },
      { text: "계획한 일을 완벽하게 마무리했을 때", value: 3 },
      { text: "타인에게 도움이 되었을 때", value: 2 },
      { text: "내면의 평화와 안정을 느낄 때", value: 1 }
    ]
  },
  19: { // 연애에서 중요한 것
    answers: [
      { text: "열정적이고 강렬한 사랑", value: 4 },
      { text: "서로를 이해하고 존중하는 관계", value: 3 },
      { text: "따뜻하고 안정적인 관계", value: 2 },
      { text: "영혼의 깊은 교감과 이해", value: 1 }
    ]
  },
  20: { // 미래 계획
    answers: [
      { text: "큰 그림을 그리고 과감하게 도전한다", value: 4 },
      { text: "현실적이고 구체적인 계획을 세운다", value: 3 },
      { text: "안정적이고 점진적인 발전을 추구한다", value: 2 },
      { text: "흘러가는 대로 자연스럽게 받아들인다", value: 1 }
    ]
  },
  21: { // 자신의 성격
    answers: [
      { text: "강하고 적극적인 사람", value: 4 },
      { text: "균형잡히고 합리적인 사람", value: 3 },
      { text: "따뜻하고 배려심 깊은 사람", value: 2 },
      { text: "조용하고 신중한 사람", value: 1 }
    ]
  }
};