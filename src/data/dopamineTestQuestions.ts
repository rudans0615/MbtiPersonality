export interface DopamineOption {
  text: string;
  type: 'SHORT_FORM' | 'SUGAR' | 'FLEX' | 'DETOX';
}

export interface DopamineQuestion {
  id: number;
  text: string;
  options: DopamineOption[];
}

export const dopamineQuestions: DopamineQuestion[] = [
  {
    id: 1,
    text: "퇴근(또는 하교) 후 지친 몸을 이끌고 집에 왔다. 나의 첫 행동은?",
    options: [
      { text: "일단 눕는다. 그리고 숨쉬듯이 인스타 스토리를 넘겨본다.", type: "SHORT_FORM" },
      { text: "씻기 전에 배달 앱부터 켜서 오늘 먹을 야식을 탐색한다.", type: "SUGAR" },
      { text: "아까 장바구니에 담아둔 옷 결제할까 말까 고민한다.", type: "FLEX" },
      { text: "오늘 세워둔 '홈트 30분' 계획을 보며 한숨을 쉰다.", type: "DETOX" }
    ]
  },
  {
    id: 2,
    text: "스트레스가 극에 달한 금요일 밤! 나를 달래주는 최고의 방법은?",
    options: [
      { text: "눈물 쏙 빼는 캡사이신 매운맛 마라탕 수혈", type: "SUGAR" },
      { text: "아무 생각 없이 유튜브 쇼츠 2시간 무지성 시청", type: "SHORT_FORM" },
      { text: "평소 갖고 싶던 비싼 립스틱 or 향수 시발비용으로 결제", type: "FLEX" },
      { text: "유튜브에서 '마음 챙김 명상' 틀어놓고 힐링 타임", type: "DETOX" }
    ]
  },
  {
    id: 3,
    text: "친구들과의 약속이 갑자기 취소되었다. 내심 드는 생각은?",
    options: [
      { text: "'오예! 나갈 준비할 뻔했는데 꿀이다' (바로 다이어리 꾸미러 감)", type: "DETOX" },
      { text: "'아싸, 침대에서 틱톡이나 봐야지~' (이불 돌돌 말기 시작)", type: "SHORT_FORM" },
      { text: "'음식 해먹기도 귀찮은데 잘됐다. 배민 시켜야지.'", type: "SUGAR" },
      { text: "'아쉬운데... 나간 김에 올리브영이나 혼자 돌고 올까?'", type: "FLEX" }
    ]
  },
  {
    id: 4,
    text: "유튜브 볼 때 나의 시청 습관은?",
    options: [
      { text: "10분이 넘어가는 영상은 무조건 1.5배속이거나 스킵버튼 연타", type: "SHORT_FORM" },
      { text: "'동기부여', '퍼스널 브랜딩' 영상만 모아둔 재생목록이 있음", type: "DETOX" },
      { text: "먹방, 디저트 리뷰 위주로 보면서 침 흘림", type: "SUGAR" },
      { text: "'인마이백', '하울', '언박싱' 보면서 내 장바구니도 같이 채움", type: "FLEX" }
    ]
  },
  {
    id: 5,
    text: "길을 걷다 우연히 예쁜 카페를 발견했다. 나의 반응은?",
    options: [
      { text: "저기 시그니처 케이크가 뭔지 바로 네이버 리뷰 검색해봄", type: "SUGAR" },
      { text: "저기서 독서하면 딱이겠다! (하지만 책은 없음)", type: "DETOX" },
      { text: "사진 엄청 잘 나오겠다. 릴스 각 나오나 견적 뽑아봄", type: "SHORT_FORM" },
      { text: "분위기도 좋은데 귀여운 소품 팔면 무조건 하나 사서 나와야지", type: "FLEX" }
    ]
  },
  {
    id: 6,
    text: "월급이 통장을 스쳐 지나가는 주된 원인은?",
    options: [
      { text: "택배비 맞추려고 하나둘 담다 폭발한 장바구니", type: "FLEX" },
      { text: "식비, 카페, 배달 음식 구역의 압도적인 지출 비율", type: "SUGAR" },
      { text: "넷플릭스, 유튜브 프리미엄, 각종 구독 서비스 요금", type: "SHORT_FORM" },
      { text: "운동 끊고 안 감, 온라인 클래스 끊고 안 들음", type: "DETOX" }
    ]
  },
  {
    id: 7,
    text: "잠깐 쉴 때 무의식적으로 하는 행동은?",
    options: [
      { text: "새로 나온 신상 기획전이나 쇼핑몰 앱 쓱 훑어보기", type: "FLEX" },
      { text: "'갓생 사는 법' 검색하고 계획러 빙의해서 계획표 짜기", type: "DETOX" },
      { text: "입이 심심한데 뭐 주워 먹을 거 없나 냉장고 열어보기", type: "SUGAR" },
      { text: "숏폼 켜자마자 바로 두뇌 정지 상태로 영상 소화하기", type: "SHORT_FORM" }
    ]
  },
  {
    id: 8,
    text: "내가 생각해도 내 집중력이 가장 바닥일 때는?",
    options: [
      { text: "식곤증 왔을 때. 당 떨어지면 뇌가 바로 멈춰버림", type: "SUGAR" },
      { text: "진득하게 책 읽거나 영화 풀로 봐야 할 때 (5분마다 폰 봄)", type: "SHORT_FORM" },
      { text: "사고 싶은 게 생겼는데 아직 안 샀을 때 (그 생각밖에 안 남)", type: "FLEX" },
      { text: "원대한 계획을 다 짜놓고 막상 실행을 시작해야 할 때", type: "DETOX" }
    ]
  },
  {
    id: 9,
    text: "나에게 '보상'을 준다면 어떤 형태가 가장 좋은가?",
    options: [
      { text: "진짜 갖고 싶었던 반짝이는 예쁜 신상 아이템 언박싱", type: "FLEX" },
      { text: "침대에 누워서 아무 방해 없이 폰만 하루 종일 하기", type: "SHORT_FORM" },
      { text: "완벽하게 지켜낸 플래너의 체크박스를 보며 느끼는 뿌듯함", type: "DETOX" },
      { text: "줄 서서 먹는 유명 맛집의 달달한 시그니처 디저트 한 입", type: "SUGAR" }
    ]
  },
  {
    id: 10,
    text: "스마트폰 스크린타임 알림이 떴다. 가장 높은 비율을 차지할 앱은?",
    options: [
      { text: "인스타그램, 틱톡, 유튜브 (압도적 배율)", type: "SHORT_FORM" },
      { text: "배달의민족, 쿠팡이츠, 요기요 (식비 파탄의 주범)", type: "SUGAR" },
      { text: "지그재그, 무신사, 쿠팡, 컬리 (쇼핑은 멈출 수 없어)", type: "FLEX" },
      { text: "노션, 투두메이트, 굿노트 (계획 짜는 데만 5시간)", type: "DETOX" }
    ]
  },
  {
    id: 11,
    text: "친구가 '요즘 삶이 너무 노잼이야'라고 한다. 나의 추천은?",
    options: [
      { text: "'새로운 취미를 시작해봐! 다이소 가서 다꾸템부터 사자'", type: "DETOX" },
      { text: "'이거 봤어? 이거 개웃김ㅋㅋ' (어제 본 릴스 링크 보내줌)", type: "SHORT_FORM" },
      { text: "'맛있는 거 먹으면 풀려. 오늘 저녁에 퇴근하고 고?'", type: "SUGAR" },
      { text: "'쇼핑 테라피가 직방이야. 팝업 스토어 구경 갈래?'", type: "FLEX" }
    ]
  },
  {
    id: 12,
    text: "솔직히 내가 도파민 중독이라고 느껴지는 가장 큰 이유는?",
    options: [
      { text: "택배 오기 전까지의 설렘으로 사는 것 같아서", type: "FLEX" },
      { text: "단 거, 자극적인 거 안 먹으면 하루가 마무리가 안 돼서", type: "SUGAR" },
      { text: "계획 세우는 순간의 짜릿함만 즐기고 행동은 안 해서", type: "DETOX" },
      { text: "1분 이상 가만히 있는 걸 못 참고 폰을 켜서", type: "SHORT_FORM" }
    ]
  }
];

export const calculateDopamineType = (answers: ('SHORT_FORM' | 'SUGAR' | 'FLEX' | 'DETOX')[]): string => {
  const counts = {
    SHORT_FORM: 0,
    SUGAR: 0,
    FLEX: 0,
    DETOX: 0
  };
  
  answers.forEach(type => {
    if (counts[type] !== undefined) counts[type]++;
  });

  // Calculate highest count
  let maxCount = -1;
  let resultType = 'SHORT_FORM'; // default

  for (const [type, count] of Object.entries(counts)) {
    if (count > maxCount) {
      maxCount = count;
      resultType = type;
    }
  }

  return resultType;
};
