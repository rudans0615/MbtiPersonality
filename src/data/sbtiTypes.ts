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

export type SbtiTypeCode = 
  | 'MONEY_WASTER' | 'LAZY_BED' | 'FAKE_PLANNER' | 'SOCIAL_GHOST'
  | 'ALCOHOLIC' | 'ANGRY_BIRD' | 'WORKAHOLIC' | 'LOVE_BLIND'
  | 'DOPAMINE_ADDICT' | 'MY_WAY' | 'WORRY_MACHINE' | 'TREND_SLAVE';

export const sbtiTypes: Record<SbtiTypeCode, SbtiTypeData> = {
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
    celebrities: ["파워 결제러", "보부상", "시발비용의 의인화"],
    coupangKeyword: "나를 위한 선물",
    compatibility: { best: "SOCIAL_GHOST", good: ["FAKE_PLANNER", "ALCOHOLIC"], avoid: "LAZY_BED" },
    emoji: "💸", color: "#ec4899"
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
    celebrities: ["집순이/집돌이 1대장", "프로 눕방러", "이불 밖은 위험해"],
    coupangKeyword: "바디필로우",
    compatibility: { best: "FAKE_PLANNER", good: ["SOCIAL_GHOST", "WORRY_MACHINE"], avoid: "MONEY_WASTER" },
    emoji: "🛏️", color: "#6366f1"
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
    celebrities: ["작심 3시간", "다이소 다꾸 장인", "내일부터 갓생"],
    coupangKeyword: "플래너 다이어리",
    compatibility: { best: "LAZY_BED", good: ["MONEY_WASTER", "TREND_SLAVE"], avoid: "SOCIAL_GHOST" },
    emoji: "🧘‍♀️", color: "#10b981"
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
    celebrities: ["선택적 묵언수행", "알림 배지 콜렉터", "카톡 방치자"],
    coupangKeyword: "디퓨저",
    compatibility: { best: "MONEY_WASTER", good: ["LAZY_BED", "MY_WAY"], avoid: "FAKE_PLANNER" },
    emoji: "👻", color: "#8b5cf6"
  },
  "ALCOHOLIC": {
    code: "ALCOHOLIC",
    title: "알콜 브레이커",
    subtitle: "간(Liver)이 울고 있어요",
    description: "기쁠 때도 한 잔, 슬플 때도 한 잔, 비 오니까 한 잔! 세상 모든 일이 술을 마셔야 하는 이유가 되는 당신. 술자리의 분위기 메이커이자 최후의 1인입니다. '오늘까지만 마신다'는 말을 10년째 하고 있으며, 숙취로 죽어가는 와중에도 해장술을 찾는 진정한 애주가입니다.",
    characteristics: [
      "스트레스 받으면 무조건 '술 한잔 할까?'",
      "집에 맥주/소주 전용석(냉장고 칸) 있음",
      "기억 끊기는 게 일상이지만 재밌으면 그만",
      "간 영양제 챙겨 먹으면서 술 마심",
      "술자리 게임이나 건배사 장인",
      "내일 죽더라도 일단 오늘은 마심"
    ],
    celebrities: ["숙취의 요정", "간 만신창이", "오늘만 사는 자"],
    coupangKeyword: "숙취해소제",
    compatibility: { best: "ANGRY_BIRD", good: ["MONEY_WASTER", "SOCIAL_GHOST"], avoid: "WORRY_MACHINE" },
    emoji: "🍻", color: "#f59e0b"
  },
  "ANGRY_BIRD": {
    code: "ANGRY_BIRD",
    title: "프로 급발진러",
    subtitle: "참을 인(忍)이 0개",
    description: "내 사전에 '참는다'는 없다! 부당한 일, 답답한 사람을 보면 심박수가 올라가며 어느새 입 밖으로 사이다 발언을 쏟아내는 당신. 추진력 하나는 우주 최강이지만, 가끔은 너무 급하게 타올라서 후회하기도 합니다. 다혈질이지만 뒤끝은 전혀 없는 투명한 성격의 소유자입니다.",
    characteristics: [
      "답답한 거 보면 혈압부터 오름",
      "길 막히거나 인터넷 느리면 미칠 것 같음",
      "말보다 행동이 먼저 나감",
      "화내고 5분 뒤에 '아까 미안' 함",
      "게임할 때 키보드/마우스 타격 많이 함",
      "남들 눈치 안 보고 할 말 다 함"
    ],
    celebrities: ["키보드 워리어", "불도저", "참지않긔"],
    coupangKeyword: "스트레스 해소",
    compatibility: { best: "ALCOHOLIC", good: ["WORKAHOLIC", "MY_WAY"], avoid: "LAZY_BED" },
    emoji: "🌋", color: "#ef4444"
  },
  "WORKAHOLIC": {
    code: "WORKAHOLIC",
    title: "자본주의 노예",
    subtitle: "퇴사 염불 외우면서 야근함",
    description: "입으로는 '아 퇴사 마렵다'를 달고 살지만, 막상 일이 주어지면 영혼을 갈아 넣어 완벽하게 해내고야 마는 K-직장인의 표본입니다. 쉬는 날에도 회사 단톡방을 몰래 확인하고, 메일 알림이 울리면 조건반사적으로 폰을 봅니다. 일에 찌들어 있지만 월급날 금융치료 한 번에 다시 충성 맹세를 합니다.",
    characteristics: [
      "카톡 프로필 상메는 '퇴사하고 싶다'",
      "주말에도 일 생각 나서 킹받음",
      "아파도 출근해서 아파야 한다고 생각함",
      "카페인 수혈 없이는 하루를 못 버팀",
      "막상 일 던져주면 누구보다 열심히 함",
      "통장 잔고 보며 '참아야지' 되뇌임"
    ],
    celebrities: ["K-직장인", "카페인 좀비", "월급루팡 실패자"],
    coupangKeyword: "홍삼 스틱",
    compatibility: { best: "FAKE_PLANNER", good: ["ANGRY_BIRD", "MONEY_WASTER"], avoid: "DOPAMINE_ADDICT" },
    emoji: "💻", color: "#3b82f6"
  },
  "LOVE_BLIND": {
    code: "LOVE_BLIND",
    title: "연애 뇌의탁러",
    subtitle: "내 우주의 중심은 너",
    description: "금사빠이자 한 번 연애를 시작하면 모든 우선순위가 연인으로 세팅되는 진정한 사랑꾼입니다. 세상이 핑크빛으로 변하며, 친구들과의 약속은 가볍게 패스해버립니다. 이별하면 세상이 끝난 것처럼 슬퍼하지만, 금세 새로운 사랑을 찾아 다시 뇌를 의탁하는 회복 탄력성(?)을 지녔습니다.",
    characteristics: [
      "연애 시작하면 단톡방에서 사라짐",
      "상대방 MBTI, 별자리 다 외우고 분석함",
      "슬픈 발라드 들으면 다 내 얘기 같음",
      "눈 마주치면 손자 이름까지 지어봄 (금사빠)",
      "애인 생기면 프사, 인스타 다 럽스타 됨",
      "헤어지면 세상 끝난 것처럼 연락 옴"
    ],
    celebrities: ["금사빠", "사랑에 미친 자", "환승연애 과몰입러"],
    coupangKeyword: "커플 아이템",
    compatibility: { best: "WORRY_MACHINE", good: ["TREND_SLAVE", "SOCIAL_GHOST"], avoid: "MY_WAY" },
    emoji: "😍", color: "#f43f5e"
  },
  "DOPAMINE_ADDICT": {
    code: "DOPAMINE_ADDICT",
    title: "도파민 좀비",
    subtitle: "숏폼 지옥에 갇힌 자",
    description: "유튜브 쇼츠, 틱톡, 릴스... 스와이프를 멈출 수 없는 당신! '딱 하나만 더 봐야지' 하다가 밤을 새우는 게 일상입니다. 10분이 넘어가는 영상은 배속 없이 볼 수 없고, 자극적이고 도파민이 터지는 콘텐츠 없이는 일상에 재미를 느끼지 못합니다. 뇌가 팝콘처럼 튀겨진 상태입니다.",
    characteristics: [
      "쇼츠 넘기다가 창문 밖 보면 아침임",
      "긴 글은 3줄 요약 없으면 못 읽음",
      "유튜브 배속 안 하면 답답해서 미침",
      "화장실 갈 때 폰 안 가져가면 불안함",
      "인스타 스토리 안 본 거 있으면 못 참음",
      "자극적인 썰, 매운맛 콘텐츠 환장함"
    ],
    celebrities: ["도파민 중독자", "숏폼 망령", "집중력 3초"],
    coupangKeyword: "스마트폰 거치대",
    compatibility: { best: "TREND_SLAVE", good: ["LAZY_BED", "ALCOHOLIC"], avoid: "WORKAHOLIC" },
    emoji: "📱", color: "#84cc16"
  },
  "MY_WAY": {
    code: "MY_WAY",
    title: "개썅마이웨이",
    subtitle: "내 알 바 아님",
    description: "남들이 뭐라 하든 '어쩌라고' 마인드로 무장한 강철 멘탈의 소유자입니다. 유행이나 타인의 시선에 휩쓸리지 않고 묵묵히 자기 갈 길을 갑니다. 고민 상담을 할 때도 이미 답은 정해져 있고(답정너), 타인의 감정에 공감하기보다는 '그래서 해결책이 뭔데?'를 찾는 지독한 T 성향을 보입니다.",
    characteristics: [
      "남들 눈치 1도 안 봄",
      "유행하는 거 굳이 안 따라함",
      "고민 상담 해놓고 결국 내 맘대로 함",
      "'어쩌라고', '내 알 바 아님' 달고 삼",
      "공감보다는 팩트 폭격 날림",
      "내가 제일 잘났다고 은연중에 생각함"
    ],
    celebrities: ["마이웨이 장인", "강철 멘탈", "지독한 T"],
    coupangKeyword: "귀마개",
    compatibility: { best: "WORKAHOLIC", good: ["ANGRY_BIRD", "SOCIAL_GHOST"], avoid: "LOVE_BLIND" },
    emoji: "😎", color: "#14b8a6"
  },
  "WORRY_MACHINE": {
    code: "WORRY_MACHINE",
    title: "과몰입 걱정인형",
    subtitle: "N상상력 풀가동",
    description: "일어나지도 않은 일을 걱정하느라 매일 밤 뇌가 쉬지 못하는 당신. '만약에...'로 시작하는 무한 굴레에 빠져 쓸데없는 시나리오를 수십 개 작성합니다. 친구가 카톡을 늦게 읽으면 '내가 뭐 잘못했나?'부터 시작해 인간관계 단절까지 상상합니다. 과몰입 장인이자 공감 능력 MAX입니다.",
    characteristics: [
      "'만약에...' 병 말기 환자",
      "누가 한숨 쉬면 내 눈치부터 봄",
      "자려고 누웠다가 5년 전 흑역사 떠올림",
      "슬픈 영화 보면 주인공 빙의해서 오열함",
      "답장 늦게 오면 오만가지 생각 다 듦",
      "일어나지도 않을 일 미리 대비함"
    ],
    celebrities: ["N상상충", "걱정인형", "과몰입 장인"],
    coupangKeyword: "수면 안대",
    compatibility: { best: "LOVE_BLIND", good: ["FAKE_PLANNER", "LAZY_BED"], avoid: "ANGRY_BIRD" },
    emoji: "🥺", color: "#0ea5e9"
  },
  "TREND_SLAVE": {
    code: "TREND_SLAVE",
    title: "유행병 말기 환자",
    subtitle: "핫한 건 다 해봐야 해",
    description: "새로 나온 탕후루, 핫한 두바이 초콜릿, 팝업스토어 오픈런까지! 유행의 최전선에 서 있지 않으면 병이 나는 당신입니다. SNS에서 유행하는 밈이나 아이템은 무조건 찍먹 해봐야 직성이 풀립니다. '나 빼고 다 재밌는 거 해?'라는 소외감(FOMO)을 견디지 못하는 진정한 트렌드 세터입니다.",
    characteristics: [
      "새로 생긴 핫플은 일단 지도에 저장",
      "유행하는 디저트/과자는 무조건 먹어봄",
      "신상 아이템 샀다고 인스타에 올려야 됨",
      "밈이나 유행어 모르면 나이 든 것 같아 슬픔",
      "한정판, 팝업스토어 오픈런 경험 있음",
      " 남들 다 하는 건 나도 해야 직성이 풀림"
    ],
    celebrities: ["트렌드세터", "탕후루 헌터", "오픈런 전사"],
    coupangKeyword: "핫팩",
    compatibility: { best: "DOPAMINE_ADDICT", good: ["MONEY_WASTER", "LOVE_BLIND"], avoid: "MY_WAY" },
    emoji: "🔥", color: "#f97316"
  }
};
