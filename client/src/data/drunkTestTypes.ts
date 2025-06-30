export interface DrunkTestResult {
  code: string;
  title: string;
  subtitle: string;
  description: string;
  characteristics: string[];
  advice: string[];
  emoji: string;
  color: string;
  memeText: string;
  funnyQuote: string;
}

export const drunkTestResults: Record<string, DrunkTestResult> = {
  SOBER: {
    code: "SOBER",
    title: "취한 거 아냐, 너는 원래 그래",
    subtitle: "완전 멀쩡함 인증 완료",
    description: "축하해요! 당신은 완전히 정신이 멀쩡한 상태입니다. 혹시 물을 마신 건 아닌가요? 아니면 원래 이렇게 재미있는 사람인가요? 어쨌든 당신은 지금 완벽하게 의식이 있고, 판단력도 정상입니다.",
    characteristics: [
      "걸음걸이 완벽",
      "말하기 정상",  
      "기억력 100%",
      "판단력 정상",
      "폰 조작 가능"
    ],
    advice: [
      "더 마셔도 될 것 같은데?",
      "친구들 케어 부탁해",
      "오늘 DD(대리운전) 각",
      "영수증 잘 챙겨"
    ],
    emoji: "😐",
    color: "bg-green-500",
    memeText: "물 마신거 맞죠?",
    funnyQuote: "어? 나 안 취했는데? (진짜로)"
  },
  TIPSY: {
    code: "TIPSY",
    title: "술기운 살짝~ 귀엽게 올라옴",
    subtitle: "적당히 기분 좋은 단계",
    description: "딱 좋아요! 지금이 골든타임입니다. 기분은 좋아지고, 말도 많아지고, 세상이 다 예뻐 보이는 그 단계! 하지만 아직 정신은 멀쩡해서 큰일 칠 가능성은 낮아요. 이 정도면 완벽한 텐션!",
    characteristics: [
      "기분 완전 업됨",
      "말이 많아짐",
      "얼굴 살짝 빨개짐",
      "웃음 포인트 낮아짐",
      "자신감 상승"
    ],
    advice: [
      "지금이 골든타임",
      "너무 더 마시지 말기",
      "사진 많이 찍어",
      "재미있는 대화 시간"
    ],
    emoji: "😊",
    color: "bg-yellow-500",
    memeText: "지금이 바로 그 타이밍~",
    funnyQuote: "아니 나 진짜 안 취했어~ (조금 취함)"
  },
  DRUNK: {
    code: "DRUNK",
    title: "헛소리 시작됨 (주의)",
    subtitle: "위험 경고등 점멸 중",
    description: "앗.. 이제 좀 위험해요! 말이 안 되는 소리를 하기 시작했고, 걸음걸이도 휘청거리고, ex한테 연락하고 싶어지는 그 단계입니다. 친구들이 당신을 주시하고 있을 거예요. 물 좀 마셔요!",
    characteristics: [
      "헛소리 시작",
      "걸음걸이 이상",
      "ex 생각남",
      "자기는 안 취했다고 주장",
      "화장실 자주 감"
    ],
    advice: [
      "물 마시기",
      "친구들한테 폰 맡기기",
      "집 가는 방법 미리 생각해두기",
      "더 이상 마시지 말기"
    ],
    emoji: "🥴",
    color: "bg-orange-500",
    memeText: "친구야 폰 좀 맡아줘",
    funnyQuote: "나 진짜 안 취했다고!!! (완전 취함)"
  },
  WASTED: {
    code: "WASTED",
    title: "기억이 없다면 이미 늦었다...",
    subtitle: "내일 후회 확정",
    description: "이미 늦었습니다... 지금 이 테스트를 하고 있다는 것 자체가 기적이에요. 내일 일어나서 폰을 확인하면 모르는 번호들과 이상한 메시지들을 발견할 가능성이 높습니다. 지금이라도 집에 가세요!",
    characteristics: [
      "기억력 제로",
      "여기가 어디인지 모름",
      "모든 사람이 친구 같음",
      "중력과 싸우는 중",
      "내일 흑역사 생산 예정"
    ],
    advice: [
      "지금 즉시 집에 가기",
      "폰 비행기모드",
      "친구들한테 도움 요청",
      "내일을 위해 기도하기"
    ],
    emoji: "🤢",
    color: "bg-red-500",
    memeText: "내일 나는 누구일까?",
    funnyQuote: "기억이... 기억이 안 나..."
  }
};

export const calculateDrunkLevel = (totalScore: number): string => {
  if (totalScore <= 7) return "SOBER";
  if (totalScore <= 15) return "TIPSY";
  if (totalScore <= 23) return "DRUNK";
  return "WASTED";
};

export const getDrunkTestShareText = (result: DrunkTestResult): string => {
  return `나의 술 취함 레벨: ${result.title}\n${result.memeText}\n\n#술취함테스트 #자가진단 #위트테스트`;
};