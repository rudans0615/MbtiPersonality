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
      { text: "'이번 달은 진짜다' 하며 가계부 앱 3개 깔고 카테고리 분류까지 했는데... 벌써 뿌듯해서 오늘은 여기까지만", type: "FAKE_PLANNER" },
      { text: "그동안 장바구니에 담아둔 거 싹 다 결제! 인생 뭐 있나 일단 지르고 보는 거지", type: "MONEY_WASTER" },
      { text: "알림 봤는데 확인하기도 귀찮아서 다시 눈 감음. 어차피 자동이체들이 알아서 가져가겠지...", type: "LAZY_BED" },
      { text: "단톡방에 '나 월급 받음! 저녁 쏠게ㅎㅎ' 올렸는데 답장 달리기 시작하자 읽씹하고 싶어짐", type: "SOCIAL_GHOST" }
    ]
  },
  {
    id: 2,
    text: "친구들과 저녁 약속이 있는 날, 나가기 1시간 전 내 심정은?",
    options: [
      { text: "'아... 갑자기 비가 억수로 쏟아져서 세상이 멸망했으면 좋겠다...'", type: "LAZY_BED" },
      { text: "'오늘 나가서 맛집 코스 다 돌고, 디저트까지 풀코스로 털고 온다' (벌써 카드 준비 완료)", type: "MONEY_WASTER" },
      { text: "약속 시간, 이동 경로, 환승 시간, 귀가 예상 시각까지 분 단위로 계산 중 (실행은 별개)", type: "FAKE_PLANNER" },
      { text: "완벽하게 준비 다 해놓고 거울 앞에서 '나 오늘 컨디션 안 좋은 척할까...' 고민 100번째", type: "SOCIAL_GHOST" }
    ]
  },
  {
    id: 3,
    text: "휴일에 눈을 떴다. 오늘의 일정은?",
    options: [
      { text: "카톡 알림 42개 다 무시하고 방해금지 모드 ON. 오늘은 세상과 단절하는 날", type: "SOCIAL_GHOST" },
      { text: "아침 7시 기상 → 조깅 → 독서 → 청소 (머릿속에서만 완벽하게 실행 완료됨)", type: "FAKE_PLANNER" },
      { text: "오후 2시에 겨우 일어났는데 이불 밖이 너무 춥고 무서워서 다시 이불 속으로 복귀", type: "LAZY_BED" },
      { text: "일단 배달 앱 켜고 '오늘은 특별한 날이니까' 하면서 브런치 4만원어치 시킴 (매주 특별한 날)", type: "MONEY_WASTER" }
    ]
  },
  {
    id: 4,
    text: "인스타그램을 보다가 마음에 드는 팝업스토어/맛집을 발견했다!",
    options: [
      { text: "'저장'만 누르고 절대 안 감. 내 저장 목록에는 갈 곳이 487개 있지만 실현률은 0%", type: "LAZY_BED" },
      { text: "바로 네이버 예약 + 주변 맛집 2곳 추가로 찜. 이번 주말에 풀코스 출동 각", type: "MONEY_WASTER" },
      { text: "같이 갈 사람 구하려고 톡 보냈다가 답장 오면 갑자기 귀찮아져서 안 읽씹 발동", type: "SOCIAL_GHOST" },
      { text: "거기 가면 뭐 입을지, 사진 어디서 찍을지 동선 다 짜놓음 (실제로는 안 감)", type: "FAKE_PLANNER" }
    ]
  },
  {
    id: 5,
    text: "스트레스 받는 일이 생겼을 때 나의 해소법은?",
    options: [
      { text: "지인들에게 폭풍 하소연 톡 보내다가 기분 풀리면 갑자기 읽씹 시전. 상대방은 아직 위로 중", type: "SOCIAL_GHOST" },
      { text: "'오늘부터 진짜 마인드컨트롤한다' 하며 명상 앱 3개 결제. 총 실행 횟수: 0회", type: "FAKE_PLANNER" },
      { text: "마라탕 → 탕후루 → 시발비용 쇼핑까지 분노의 3콤보. 통장이 텅장이 되어도 마음은 편안", type: "MONEY_WASTER" },
      { text: "그냥 자버림. 세상이 어떻게 되든 내 알 바 아님. 잠이 최고의 도피처", type: "LAZY_BED" }
    ]
  },
  {
    id: 6,
    text: "통장에 딱 10만 원이 남았다. 내 반응은?",
    options: [
      { text: "남은 10만 원을 하루 단위로 쪼개는 미친 예산안 작성 시작 (3시간 투자, 작심 반나절)", type: "FAKE_PLANNER" },
      { text: "10만 원? 치킨 3마리는 쌉가능이지! 일단 배달 앱부터 켬 (YOLO)", type: "MONEY_WASTER" },
      { text: "어차피 나갈 일도 없는데 뭐. 침대에서 숨만 쉬면 지출 0원인 거 아님?", type: "LAZY_BED" },
      { text: "친구한테 돈 빌려달라고 톡 쓰다가 보내기 직전에 지우고 혼자 끙끙 앓음", type: "SOCIAL_GHOST" }
    ]
  },
  {
    id: 7,
    text: "새해/새학기가 되었다! 나의 다짐은?",
    options: [
      { text: "'올해는 인맥 관리 좀 해야지' (새해 복 많이 받으세요 단톡방 메시지 전부 읽씹 완료)", type: "SOCIAL_GHOST" },
      { text: "'올해는 진짜 다이어트 성공한다' (헬스장 1년 끊고 총 방문 3회, 샤워만 하고 옴)", type: "FAKE_PLANNER" },
      { text: "'올해는 뭐라도 해야지...' (생각만 했는데 벌써 피곤해서 다시 이불 속으로)", type: "LAZY_BED" },
      { text: "'올해는 진짜 돈 모은다' (새해 기념 나에게 주는 선물이라며 나이키 신발 + 에어팟 결제)", type: "MONEY_WASTER" }
    ]
  },
  {
    id: 8,
    text: "스마트폰에 안 읽은 메시지가 99+개 쌓여있다.",
    options: [
      { text: "메시지 온 줄도 모름. 방해금지 모드 + 이어폰 끼고 이불 속에서 유튜브 보는 중", type: "LAZY_BED" },
      { text: "일단 다 읽음 처리하고 진짜 급한 사람한테만 '아 폰 못 봤어ㅠ' 하고 나머진 영구 방치", type: "SOCIAL_GHOST" },
      { text: "단톡방 열어놓고 '이거 살까 말까' 하면서 쇼핑 링크만 무한 투척. 톡방을 쇼핑 카탈로그로 활용", type: "MONEY_WASTER" },
      { text: "'나중에 시간 잡아서 한 번에 정리해야지' 하며 정리 계획표까지 짬 (영원히 안 함)", type: "FAKE_PLANNER" }
    ]
  },
  {
    id: 9,
    text: "다이어트를 결심하고 샐러드를 샀다.",
    options: [
      { text: "식단표 짜고, 칼로리 계산 앱 깔고, 운동 루틴까지 만들었는데 그것만으로 에너지를 다 써버림", type: "FAKE_PLANNER" },
      { text: "샐러드 먹고 나니 배고파서 '운동했으니까 보상이지' 하며 치킨 + 콜라 주문 완료", type: "MONEY_WASTER" },
      { text: "먹는 거 인증샷 인스타에 올리고 친구들 응원 댓글은 안 읽씹. 관심은 받고 싶은데 소통은 싫음", type: "SOCIAL_GHOST" },
      { text: "냉장고에 넣어놓고 귀찮아서 안 꺼내 먹다가 유통기한 지나서 미안한 마음으로 버림", type: "LAZY_BED" }
    ]
  },
  {
    id: 10,
    text: "갑자기 누군가 내게 '이번 주말에 뭐해?'라고 물어봤다.",
    options: [
      { text: "(머릿속 경보 발령) '왜 묻지? 약속 잡으려는 건가? 일단 바쁘다고 하고 나중에 생각하자'", type: "SOCIAL_GHOST" },
      { text: "'주말? 나 완전 풀스케줄이야!' (사실 계획만 10개고 실행 예정: 0개)", type: "FAKE_PLANNER" },
      { text: "'주말엔 새로 생긴 핫플 가야지! 백화점도 들러야 하고!' (지갑은 이미 비명 중)", type: "MONEY_WASTER" },
      { text: "'뭐하긴... 넷플릭스 봐야지. 이불 밖은 위험하잖아. 집이 최고야'", type: "LAZY_BED" }
    ]
  },
  {
    id: 11,
    text: "내가 생각해도 내 인생에서 가장 부족한 것은?",
    options: [
      { text: "돈. 진짜 돈만 있으면 내 모든 문제가 해결될 것 같은 강력한 믿음이 있음", type: "MONEY_WASTER" },
      { text: "체력. 밖에 2시간만 있어도 배터리 0%. 충전은 침대에서만 가능", type: "LAZY_BED" },
      { text: "실행력. 머릿속 계획은 하버드 수석급인데 실제 행동은 유치원생 수준", type: "FAKE_PLANNER" },
      { text: "인류애. 사람 만나는 게 세상에서 제일 피곤한 일. 혼자가 편해", type: "SOCIAL_GHOST" }
    ]
  },
  {
    id: 12,
    text: "지금 당장 나에게 가장 필요한 한 마디는?",
    options: [
      { text: "'그만 좀 눕고 일어나라 제발 이 인간아. 해가 지고 있다'", type: "LAZY_BED" },
      { text: "'결제창 닫아라... 너 다음 달에 라면으로 연명해야 한다'", type: "MONEY_WASTER" },
      { text: "'제발 생각만 하지 말고 딱 하나라도 오늘 안에 실행해라'", type: "FAKE_PLANNER" },
      { text: "'카톡 좀 봐!!! 너 3일째 안 읽씹이야!!! 사람들이 실종신고 하려고 해!!!'", type: "SOCIAL_GHOST" }
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
