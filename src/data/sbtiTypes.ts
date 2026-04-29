export interface SbtiTypeData {
  code: string;
  title: string;
  subtitle: string;
  description: string;
  characteristics: string[];
  celebrities: string[];
  coupangKeyword: string;
  compatibility: {
    best: string;
    good: string[];
    avoid: string;
  };
  emoji: string;
  color: string;
}

export const sbtiTypes: Record<string, SbtiTypeData> = {
  "MONEY_WASTER": {
    code: "MONEY_WASTER",
    title: "텅장 방어 실패자",
    subtitle: "내 안의 작은 지름신",
    description: "스트레스의 해답은 '결제 완료' 창에 있다고 굳게 믿는 당신! '이건 꼭 사야 해'라는 자기 합리화의 달인입니다. 택배 박스를 뜯는 그 5분의 도파민을 위해 한 달 내내 뼈 빠지게 일합니다. 통장 잔고를 볼 때마다 눈물이 나지만, 신용카드가 있으니 내일의 나에게 맡겨버립니다.",
    characteristics: [
      "장바구니에 담아둔 물건 합치면 차 한 대 값",
      "스트레스 받으면 무의식적으로 쇼핑 앱 켬",
      "배달 앱 VVIP 등급 유지 중",
      "세일 안 할 때 사면 손해 보는 기분임",
      "예쁜 쓰레기를 아주 정성스럽게 수집함",
      "'나를 위한 선물'을 한 달에 10번 정도 줌"
    ],
    celebrities: [
      "파워 결제러", "보부상", "시발비용의 의인화"
    ],
    coupangKeyword: "나를 위한 선물",
    compatibility: {
      best: "SOCIAL_GHOST",
      good: ["FAKE_PLANNER"],
      avoid: "LAZY_BED"
    },
    emoji: "💸",
    color: "#ec4899"
  },
  "LAZY_BED": {
    code: "LAZY_BED",
    title: "침대 지박령",
    subtitle: "누워있는 게 제일 좋아",
    description: "세상에서 내 방 침대가 가장 안전하고 포근한 당신! 집 밖에 나가는 순간부터 기가 빨리기 시작합니다. 약속이 취소되면 내심 쾌재를 부르며 넷플릭스를 켭니다. 무언가를 시작하기까지 엄청난 에너지가 필요하지만, 한 번 누우면 누구보다 열정적으로(?) 쉴 수 있습니다.",
    characteristics: [
      "쉬는 날엔 침대와 물아일체",
      "카톡 답장하는 것도 에너지가 소모됨",
      "숨 쉬는 것 빼고 다 귀찮음",
      "약속 취소되면 속으로 환호성 지름",
      "샤워하러 화장실 들어가기까지 2시간 걸림",
      "씻고 나오면 세상에서 제일 개운해함 (근데 씻으러 안 감)"
    ],
    celebrities: [
      "집순이/집돌이 1대장", "프로 눕방러", "이불 밖은 위험해"
    ],
    coupangKeyword: "바디필로우",
    compatibility: {
      best: "FAKE_PLANNER",
      good: ["SOCIAL_GHOST"],
      avoid: "MONEY_WASTER"
    },
    emoji: "🛏️",
    color: "#6366f1"
  },
  "FAKE_PLANNER": {
    code: "FAKE_PLANNER",
    title: "아가리 갓생러",
    subtitle: "계획은 완벽, 실행은 내일",
    description: "머릿속으로는 이미 하버드 수석 졸업에 실리콘밸리 CEO인 당신! 다이어리, 영양제, 요가 매트 등 갓생템은 다 사모읍니다. 원대한 계획을 짤 때 도파민이 가장 많이 분비되지만, 막상 실행에 옮기는 것은 10% 미만입니다. '내일부터 진짜 한다'가 인생의 모토입니다.",
    characteristics: [
      "다이어리 앞장만 빽빽하고 뒤는 백지임",
      "운동 시작하려고 예쁜 운동복부터 삼",
      "유튜브에 '동기부여', '명상' 재생목록 있음",
      "계획 짤 때가 제일 행복함 (실행은 안 함)",
      "다이어트 결심하고 최후의 만찬만 일주일째",
      "노션, 플래너 앱 다운로드만 10개 넘음"
    ],
    celebrities: [
      "작심 3시간", "다이소 다꾸 장인", "내일부터 갓생"
    ],
    coupangKeyword: "플래너 다이어리",
    compatibility: {
      best: "LAZY_BED",
      good: ["MONEY_WASTER"],
      avoid: "SOCIAL_GHOST"
    },
    emoji: "🧘‍♀️",
    color: "#10b981"
  },
  "SOCIAL_GHOST": {
    code: "SOCIAL_GHOST",
    title: "프로 안읽씹러",
    subtitle: "카톡 알림 공포증",
    description: "사람 만나는 걸 좋아하면서도 싫어하는 모순적인 당신! 내키면 파워 인싸처럼 놀지만, 에너지가 방전되면 철저하게 잠수(Ghosting)를 탑니다. 카톡에 빨간 숫자 '99+'가 떠 있어도 전혀 타격이 없습니다. 대답할 타이밍을 놓쳐서 영원히 안 읽씹 상태가 된 톡방이 수두룩합니다.",
    characteristics: [
      "선택적 아싸 (필요할 때만 인싸력 발휘)",
      "카톡 확인은 하지만 답장은 나중에 (결국 안 함)",
      "전화 오면 일단 안 받고 문자 남길 때까지 기다림",
      "혼자 있는 건 좋은데 외로운 건 싫음",
      "약속 잡을 때는 신나는데 당일 되면 나가기 싫음",
      "갑작스러운 만남 제안을 제일 무서워함"
    ],
    celebrities: [
      "선택적 묵언수행", "알림 배지 콜렉터", "카톡 방치자"
    ],
    coupangKeyword: "디퓨저",
    compatibility: {
      best: "MONEY_WASTER",
      good: ["LAZY_BED"],
      avoid: "FAKE_PLANNER"
    },
    emoji: "👻",
    color: "#8b5cf6"
  }
};
