export interface DrunkTestQuestion {
  id: number;
  text: string;
  emoji: string;
  options: {
    text: string;
    score: number;
    emoji: string;
  }[];
}

export const drunkTestQuestions: DrunkTestQuestion[] = [
  {
    id: 1,
    text: "지금 폰 화면이 어떻게 보여?",
    emoji: "📱",
    options: [
      { text: "완전 선명해", score: 0, emoji: "✨" },
      { text: "살짝 흐릿? 근데 괜찮아", score: 1, emoji: "😅" },
      { text: "화면이 2개로 보임ㅋㅋ", score: 2, emoji: "👀" },
      { text: "뭐가 뭔지 모르겠음", score: 3, emoji: "🌀" }
    ]
  },
  {
    id: 2,
    text: "지금 걸어갈 수 있어?",
    emoji: "🚶‍♀️",
    options: [
      { text: "당연히 완벽하게", score: 0, emoji: "💪" },
      { text: "조금 휘청거리지만 가능", score: 1, emoji: "🙃" },
      { text: "벽 짚고 가야함", score: 2, emoji: "🏠" },
      { text: "일단 누워있겠음", score: 3, emoji: "😵" }
    ]
  },
  {
    id: 3,
    text: "지금 뭔가 말하고 싶어?",
    emoji: "💬",
    options: [
      { text: "평소와 똑같음", score: 0, emoji: "😐" },
      { text: "조금 더 수다스러워진 것 같아", score: 1, emoji: "😊" },
      { text: "온갖 TMI 다 하고 싶음", score: 2, emoji: "🗣️" },
      { text: "사랑한다고 모든 사람한테 말하고 있음", score: 3, emoji: "💕" }
    ]
  },
  {
    id: 4,
    text: "현재 본인의 댄스 실력 평가는?",
    emoji: "💃",
    options: [
      { text: "그냥 평소 그대로", score: 0, emoji: "😑" },
      { text: "리듬감이 살짝 살아남", score: 1, emoji: "🎵" },
      { text: "지금 내가 댄싱퀸인 것 같음", score: 2, emoji: "👑" },
      { text: "의자랑 춤추고 있었음", score: 3, emoji: "🪑" }
    ]
  },
  {
    id: 5,
    text: "ex한테 연락하고 싶은 충동은?",
    emoji: "📲",
    options: [
      { text: "전혀 없음", score: 0, emoji: "❌" },
      { text: "살짝 스쳐 지나감", score: 1, emoji: "🤔" },
      { text: "지금 당장 하고 싶음", score: 2, emoji: "😤" },
      { text: "이미 보냈고 후회 중", score: 3, emoji: "🤦‍♀️" }
    ]
  },
  {
    id: 6,
    text: "지금 거울 속 내 모습은?",
    emoji: "🪞",
    options: [
      { text: "평소와 똑같음", score: 0, emoji: "😌" },
      { text: "뭔가 더 예뻐 보임", score: 1, emoji: "😍" },
      { text: "완전 여신/남신 등극", score: 2, emoji: "✨" },
      { text: "거울이 누구지?", score: 3, emoji: "❓" }
    ]
  },
  {
    id: 7,
    text: "내일 일어날 걱정은?",
    emoji: "🌅",
    options: [
      { text: "평소처럼 멀쩡할 듯", score: 0, emoji: "😊" },
      { text: "조금 피곤할 것 같음", score: 1, emoji: "😴" },
      { text: "숙취 각오하고 있음", score: 2, emoji: "🤢" },
      { text: "내일? 그게 뭐임?", score: 3, emoji: "🤷‍♀️" }
    ]
  },
  {
    id: 8,
    text: "지금 상황에 대한 기억력은?",
    emoji: "🧠",
    options: [
      { text: "다 기억하고 있음", score: 0, emoji: "📝" },
      { text: "대충 기억남", score: 1, emoji: "🤔" },
      { text: "중요한 것만 기억", score: 2, emoji: "💭" },
      { text: "여기가 어디임?", score: 3, emoji: "🗺️" }
    ]
  },
  {
    id: 9,
    text: "친구들이 지금 내 모습을 보면?",
    emoji: "👫",
    options: [
      { text: "평소와 똑같다고 할 듯", score: 0, emoji: "😐" },
      { text: "조금 들뜬 것 같다고 할 듯", score: 1, emoji: "😄" },
      { text: "완전 취했다고 할 듯", score: 2, emoji: "😂" },
      { text: "폰 빼앗을 듯", score: 3, emoji: "📵" }
    ]
  },
  {
    id: 10,
    text: "지금 가장 하고 싶은 것은?",
    emoji: "💭",
    options: [
      { text: "집에 가서 쉬기", score: 0, emoji: "🏠" },
      { text: "더 놀기", score: 1, emoji: "🎉" },
      { text: "모든 사람과 친해지기", score: 2, emoji: "🤗" },
      { text: "바닥에 눕기", score: 3, emoji: "🛌" }
    ]
  }
];