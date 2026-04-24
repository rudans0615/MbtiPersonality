export interface HoguResult {
  code: string;
  title: string;
  subtitle: string;
  description: string;
  characteristics: string[];
  advice: string[];
  emoji: string;
  color: string; // Tailwind color classes e.g. "bg-pink-500"
  memeText: string;
}

export const hoguResults: Record<string, HoguResult> = {
  PREDATOR: {
    code: "PREDATOR",
    title: "내 연애에 손해란 없다, 붉은 여우",
    subtitle: "호구력 0% 극강의 밀당 마스터",
    description: "당신은 연애 먹이사슬의 최강자입니다! 머리 꼭대기에서 상대를 조종하는 재주가 있습니다. 절대 밑지는 장사는 하지 않으며, 내가 준 만큼-혹은 그 이상-받아야 직성이 풀립니다. 연애하면서 상처받는 일은 드물겠지만, 가끔씩은 상대방을 배려해 주지 않으면 상대가 지쳐 떠날 수 있습니다.",
    characteristics: [
      "절대 손해 안 보는 타입",
      "밀당의 천재",
      "감정에 휘둘리지 않는 이성",
      "상대방이 안달 나게 만드는 매력",
      "헤어져도 금방 극복함"
    ],
    advice: [
      "가끔은 져주는 척이라도 해주세요.",
      "계산기를 내려놓고 감정에 솔직해져 보기",
      "상대방의 헌신을 당연하게 여기지 않기"
    ],
    emoji: "🦊",
    color: "bg-red-500",
    memeText: "내가 널 만나는 게 큰 복인 줄 알아라"
  },
  CAT: {
    code: "CAT",
    title: "마이웨이 도도한 고양이",
    subtitle: "호구력 20% 이기적이고 매력적인 포식자",
    description: "은근히 이기적이지만 미워할 수 없는 묘한 매력을 가졌습니다. 내 시간, 내 자존심이 연애보다 우선입니다. 상대방이 엄청난 헌신을 바친다면 조금씩 마음을 열긴 하지만, 선을 넘는 요구에는 칼같이 잘라냅니다. 스스로는 합리적이라고 생각하지만 상대방 입장에서는 서운함을 느낄 포인트가 많습니다.",
    characteristics: [
      "오는 사람 안 막고 가는 사람 안 잡음",
      "혼자 있는 시간을 침해받는 것 극혐",
      "선톡/선연락 잘 안 함",
      "기브 앤 테이크 확실함"
    ],
    advice: [
      "가끔은 내가 애정 표현 먼저 하기",
      "상대방의 서운함에 논리보다 공감으로 대답하기",
      "표현하지 않는 사랑은 모른다는 사실 기억하기"
    ],
    emoji: "🐱",
    color: "bg-purple-500",
    memeText: "너 없어도 난 잘 살아, 근데 있으면 좋고"
  },
  DEER: {
    code: "DEER",
    title: "은근슬쩍 다 뺐기는 헐랭이 사슴",
    subtitle: "호구력 70% 자발적 헌신러",
    description: "연애를 시작하면 간도 쓸개도 다 빼줄 준비가 되는 타입입니다! '내가 더 참지 뭐', '좋은 게 좋은 거지' 마인드로 상대방의 무리한 요구도 결국 다 들어주는 호구의 자질을 훌륭히 갖췄습니다. 다정하고 착한 성품 때문에 상대방은 편안함을 느끼지만, 결국 나 혼자 상처받고 앓아누울 확률이 높습니다.",
    characteristics: [
      "싸우는 게 귀찮아서 속으로 삭힘",
      "상대방 눈치를 엄청 봄",
      "서운한 거 말할 타이밍 놓쳐서 폭발함",
      "헤어질 때 미련이 많이 남음"
    ],
    advice: [
      "거절하는 연습부터 시작하세요",
      "나를 잃어버리는 연애는 그만두기",
      "호의가 계속되면 둘리인 줄 아는 사람 걸러내기"
    ],
    emoji: "🦌",
    color: "bg-amber-500",
    memeText: "내가 더 참을게... (속은 썩어 들어감)"
  },
  RETRIEVER: {
    code: "RETRIEVER",
    title: "영혼까지 탈탈, 다 퍼주는 리트리버",
    subtitle: "호구력 99% 무한 긍정 호구",
    description: "삐빅- 당신은 전생에 나라를 팔아먹은 게 분명합니다. 왜 자기 연애인데 철저히 '을(乙)'의 위치에서 매달리고 있나요? 당신 세계의 중심은 당신이 아니라 애인입니다. 헌신하면 헌신짝 된다는 속담의 교과서적인 표본! 맹목적인 사랑은 당신의 자존감을 갉아먹습니다. 정신 차리세요!",
    characteristics: [
      "상대방의 쓰레기 같은 변명도 다 믿어줌",
      "연락 안 오면 5분마다 액정 확인",
      "모든 스케줄은 애인에게 맞춰둠",
      "친구들이 맨날 헤어지라고 욕함"
    ],
    advice: [
      "당장 핸드폰 내려놓고 본인 취미 찾기",
      "'내가 잘못했어'라는 말 입에서 지우기",
      "관계의 주도권을 가져오는 법 배우기"
    ],
    emoji: "🐶",
    color: "bg-blue-500",
    memeText: "괜찮아! 널 사랑하니까! (텅장과 텅 빈 멘탈)"
  }
};

export const calculateHoguLevel = (totalScore: number): string => {
  if (totalScore <= 6) return "PREDATOR";
  if (totalScore <= 12) return "CAT";
  if (totalScore <= 18) return "DEER";
  return "RETRIEVER";
};
