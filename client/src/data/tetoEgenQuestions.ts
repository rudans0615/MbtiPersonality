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
    text: "친구들과의 모임에서 나는?",
    emoji: "👥",
    type: "personality"
  },
  {
    id: 3,
    text: "연애할 때 나의 스타일은?",
    emoji: "💕",
    type: "personality"
  },
  {
    id: 4,
    text: "갈등 상황이 생겼을 때 나는?",
    emoji: "⚡",
    type: "personality"
  },
  {
    id: 5,
    text: "새로운 환경에 적응할 때 나는?",
    emoji: "🌟",
    type: "personality"
  },
  {
    id: 6,
    text: "취미나 관심사를 선택할 때?",
    emoji: "🎯",
    type: "personality"
  },
  {
    id: 7,
    text: "스트레스를 받을 때 나의 해소 방법은?",
    emoji: "😤",
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
  2: { // 친구들과의 모임
    answers: [
      { text: "적극적으로 주도하며 분위기를 이끈다", value: 4 },
      { text: "자연스럽게 참여하며 활발하게 대화한다", value: 3 },
      { text: "조용히 듣다가 필요할 때만 말한다", value: 2 },
      { text: "구석에서 조용히 관찰하는 편이다", value: 1 }
    ]
  },
  3: { // 연애 스타일
    answers: [
      { text: "직접적으로 표현하고 적극적으로 다가간다", value: 4 },
      { text: "계획적으로 접근하며 단계적으로 발전시킨다", value: 3 },
      { text: "상대방의 반응을 보며 신중하게 행동한다", value: 2 },
      { text: "상대방이 먼저 다가오기를 기다린다", value: 1 }
    ]
  },
  4: { // 갈등 상황
    answers: [
      { text: "바로 문제를 해결하려고 정면 대응한다", value: 4 },
      { text: "논리적으로 설명하며 해결책을 제시한다", value: 3 },
      { text: "상대방의 감정을 먼저 배려하며 대화한다", value: 2 },
      { text: "갈등을 피하고 시간이 해결해주길 기다린다", value: 1 }
    ]
  },
  5: { // 새로운 환경 적응
    answers: [
      { text: "빠르게 적응하며 새로운 도전을 즐긴다", value: 4 },
      { text: "계획을 세우고 체계적으로 적응한다", value: 3 },
      { text: "신중하게 관찰한 후 천천히 적응한다", value: 2 },
      { text: "많은 시간이 필요하며 스트레스를 받는다", value: 1 }
    ]
  },
  6: { // 취미/관심사
    answers: [
      { text: "스포츠, 여행, 모험 등 활동적인 것", value: 4 },
      { text: "독서, 영화, 게임 등 개인적인 것", value: 3 },
      { text: "예술, 음악, 문학 등 감성적인 것", value: 2 },
      { text: "명상, 요가, 힐링 등 정적인 것", value: 1 }
    ]
  },
  7: { // 스트레스 해소
    answers: [
      { text: "운동이나 격렬한 활동으로 풀어낸다", value: 4 },
      { text: "친구들과 만나서 수다를 떤다", value: 3 },
      { text: "혼자만의 시간을 가지며 정리한다", value: 2 },
      { text: "음악을 듣거나 조용히 쉰다", value: 1 }
    ]
  }
};