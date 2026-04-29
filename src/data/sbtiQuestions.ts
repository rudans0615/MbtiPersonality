export interface SbtiOption {
  text: string;
  type: 'MONEY_WASTER' | 'LAZY_BED' | 'FAKE_PLANNER' | 'SOCIAL_GHOST';
}

export interface SbtiQuestion {
  id: number;
  text: string;
  options: SbtiOption[];
}

export const sbtiQuestions: SbtiQuestion[] = [
  {
    id: 1,
    text: "월급날 통장에 돈이 꽂혔다! 나의 첫 행동은?",
    options: [
      { text: "'아 이번 달은 진짜 아껴 쓴다' 다짐하며 엑셀 가계부 폼부터 다운로드", type: "FAKE_PLANNER" },
      { text: "그동안 장바구니에 담아둔 거 싹 다 결제! (인생 뭐 있나)", type: "MONEY_WASTER" },
      { text: "월급 들어온 줄도 모르고 침대에서 유튜브 쇼츠나 보는 중", type: "LAZY_BED" },
      { text: "단톡방에 '나 월급 받음 쏜다' 해놓고 정작 만나는 날짜는 절대 안 잡음", type: "SOCIAL_GHOST" }
    ]
  },
  {
    id: 2,
    text: "친구들과 저녁 약속이 있는 날, 나가기 1시간 전 내 심정은?",
    options: [
      { text: "'아... 비나 펑펑 쏟아져서 취소됐으면 좋겠다...'", type: "LAZY_BED" },
      { text: "'오늘 나가서 맛있는 거 다 털고 온다' (벌써 지갑 열 준비)", type: "MONEY_WASTER" },
      { text: "약속 시간, 이동 시간, 귀가 시간까지 분 단위로 계산 중", type: "FAKE_PLANNER" },
      { text: "준비 다 해놓고 갑자기 '나 오늘 못 나갈 듯ㅠㅠ' 카톡 보낼까 말까 100번 고민", type: "SOCIAL_GHOST" }
    ]
  },
  {
    id: 3,
    text: "휴일에 눈을 떴다. 오늘의 일정은?",
    options: [
      { text: "아침 7시 기상 ➔ 조깅 ➔ 독서 ➔ 청소 (상상 속에서만 완벽함)", type: "FAKE_PLANNER" },
      { text: "오후 3시에 일어나서 숨쉬기 운동 말고는 아무것도 안 함", type: "LAZY_BED" },
      { text: "일단 배달 앱 켜고 브런치로 4만원어치 시킴", type: "MONEY_WASTER" },
      { text: "카톡 알림 다 무음으로 해놓고 철저하게 나만의 동굴로 들어감", type: "SOCIAL_GHOST" }
    ]
  },
  {
    id: 4,
    text: "인스타그램을 보다가 마음에 드는 팝업스토어/맛집을 발견했다!",
    options: [
      { text: "'저장'만 해놓고 절대 안 감 (내 저장 목록은 블랙홀임)", type: "LAZY_BED" },
      { text: "바로 네이버 예약 갈기고 이번 주말에 당장 출동", type: "MONEY_WASTER" },
      { text: "같이 갈 사람 구하려고 카톡 보냈다가 답장 오면 귀찮아져서 안 읽씹함", type: "SOCIAL_GHOST" },
      { text: "거기 가면 뭐 입고 사진 어떻게 찍을지 동선 다 짜놓음 (실제론 안 감)", type: "FAKE_PLANNER" }
    ]
  },
  {
    id: 5,
    text: "스트레스 받는 일이 생겼을 때 나의 해소법은?",
    options: [
      { text: "지인들에게 폭풍 카톡으로 하소연하다가 기분 풀리면 갑자기 톡 끊음", type: "SOCIAL_GHOST" },
      { text: "'오늘부터 진짜 마인드 컨트롤한다'며 명상 앱 결제해놓고 안 켬", type: "FAKE_PLANNER" },
      { text: "매운 마라탕 시키고 탕후루 먹은 다음 쇼핑 앱에서 시발비용 결제", type: "MONEY_WASTER" },
      { text: "그냥 자버림. 세상이 어떻게 되든 내 알 바 아님", type: "LAZY_BED" }
    ]
  },
  {
    id: 6,
    text: "통장에 딱 10만 원이 남았다. 내 반응은?",
    options: [
      { text: "10만 원? 이 정도면 치킨 3마리 쌉가능이지 (바로 배달 켬)", type: "MONEY_WASTER" },
      { text: "어차피 나갈 일도 없는데 뭐. 침대에서 숨만 쉬면 0원 듦", type: "LAZY_BED" },
      { text: "남은 10만 원을 하루 단위로 쪼개는 미친 예산안을 세움 (작심 1일)", type: "FAKE_PLANNER" },
      { text: "친구한테 돈 빌려달라고 톡했다가 후회하고 빛의 속도로 삭제함", type: "SOCIAL_GHOST" }
    ]
  },
  {
    id: 7,
    text: "새해/새학기가 되었다! 나의 다짐은?",
    options: [
      { text: "'올해는 진짜 다이어트 성공한다' (헬스장 1년 끊고 3번 감)", type: "FAKE_PLANNER" },
      { text: "'올해는 인맥 관리 좀 해야지' (새해 복 많이 받으라는 톡 다 씹음)", type: "SOCIAL_GHOST" },
      { text: "'올해는 진짜 돈 아껴 쓴다' (새해 기념으로 스스로에게 나이키 신발 선물)", type: "MONEY_WASTER" },
      { text: "'올해는 뭐라도 해야지...' (생각만 하고 이불 속에서 안 나옴)", type: "LAZY_BED" }
    ]
  },
  {
    id: 8,
    text: "스마트폰에 안 읽은 메시지가 99+개 쌓여있다.",
    options: [
      { text: "일단 다 읽음 처리하고 진짜 답장해야 할 사람한테만 답장 (나머진 방치)", type: "SOCIAL_GHOST" },
      { text: "단톡방 열어놓고 '뭐 살 건데 골라줘' 하면서 쇼핑 링크만 무한 투척", type: "MONEY_WASTER" },
      { text: "'나중에 한 번에 정리해서 답장해야지' (영원히 안 함)", type: "FAKE_PLANNER" },
      { text: "메시지 온 줄도 모름. 방해금지 모드 켜놓고 유튜브 보는 중", type: "LAZY_BED" }
    ]
  },
  {
    id: 9,
    text: "다이어트를 결심하고 샐러드를 샀다.",
    options: [
      { text: "샐러드 먹고 배고파서 결국 야식으로 치킨 시켜 먹음", type: "MONEY_WASTER" },
      { text: "식단표 짜고 칼로리 계산 앱 다운받는 데 에너지를 다 씀", type: "FAKE_PLANNER" },
      { text: "먹는 거 인증샷 인스타에 올리고 친구들 응원 톡은 안 읽음", type: "SOCIAL_GHOST" },
      { text: "냉장고에 넣어두고 귀찮아서 안 꺼내 먹다가 유통기한 지나서 버림", type: "LAZY_BED" }
    ]
  },
  {
    id: 10,
    text: "갑자기 누군가 내게 '이번 주말에 뭐해?'라고 물어봤다.",
    options: [
      { text: "(머릿속에 알람 울림) '아... 뭐 하냐고 왜 묻지? 약속 잡으려고 하나? 일단 바쁘다고 하자'", type: "SOCIAL_GHOST" },
      { text: "'주말? 나 주말에 완전 풀스케줄이야!' (사실 그냥 집에 있을 예정)", type: "FAKE_PLANNER" },
      { text: "'주말엔 핫플 가야지! 새로 생긴 백화점 갈까?'", type: "MONEY_WASTER" },
      { text: "'뭐하긴... 넷플릭스 봐야지. 밖은 위험해'", type: "LAZY_BED" }
    ]
  },
  {
    id: 11,
    text: "내가 생각해도 내 인생에서 가장 부족한 것은?",
    options: [
      { text: "돈. 진짜 돈만 있으면 내 우울증 다 치료됨", type: "MONEY_WASTER" },
      { text: "체력. 밖에 2시간 이상 있으면 방전됨", type: "LAZY_BED" },
      { text: "실행력. 계획은 서울대 수석인데 행동은 유치원생임", type: "FAKE_PLANNER" },
      { text: "인류애. 사람 만나는 게 제일 피곤함", type: "SOCIAL_GHOST" }
    ]
  },
  {
    id: 12,
    text: "지금 당장 나에게 가장 필요한 한 마디는?",
    options: [
      { text: "'그만 좀 눕고 일어나라 제발 인간아'", type: "LAZY_BED" },
      { text: "'결제창 닫아라... 너 다음 달에 파산이다'", type: "MONEY_WASTER" },
      { text: "'제발 생각만 하지 말고 하나라도 행동으로 옮겨라'", type: "FAKE_PLANNER" },
      { text: "'카톡 좀 봐!!! 너 또 안 읽씹이지!!!'", type: "SOCIAL_GHOST" }
    ]
  }
];

export const calculateSbtiType = (answers: ('MONEY_WASTER' | 'LAZY_BED' | 'FAKE_PLANNER' | 'SOCIAL_GHOST')[]): string => {
  const counts = {
    MONEY_WASTER: 0,
    LAZY_BED: 0,
    FAKE_PLANNER: 0,
    SOCIAL_GHOST: 0
  };
  
  answers.forEach(type => {
    if (counts[type] !== undefined) counts[type]++;
  });

  let maxCount = -1;
  let resultType = 'MONEY_WASTER'; 

  for (const [type, count] of Object.entries(counts)) {
    if (count > maxCount) {
      maxCount = count;
      resultType = type;
    }
  }

  return resultType;
};
