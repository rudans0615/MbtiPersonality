import { SbtiTypeCode } from './sbtiTypes';

export interface SbtiOption {
  text: string;
  type: SbtiTypeCode;
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
      { text: "그동안 장바구니에 담아둔 거 싹 다 결제! 일단 지르고 보는 거지", type: "MONEY_WASTER" },
      { text: "오늘 저녁은 무조건 술이다. 애들 다 모이라고 단톡방에 올림", type: "ALCOHOLIC" },
      { text: "요즘 인스타에서 제일 핫하다는 오마카세 바로 예약 때림", type: "TREND_SLAVE" },
      { text: "월급 들어온 거 보고 기분 좋아서 쇼츠 보다가 결제 타이밍 놓침", type: "DOPAMINE_ADDICT" }
    ]
  },
  {
    id: 2,
    text: "주말 아침, 눈을 떴다. 지금 내 심정은?",
    options: [
      { text: "일어났지만 이불 밖은 위험해... 다시 꿀잠 자러 들어감", type: "LAZY_BED" },
      { text: "쌓인 카톡 알림 99+ 무시하고 비행기 모드 켜고 쉼", type: "SOCIAL_GHOST" },
      { text: "남들은 뭘 하든 말든 나 혼자 쿨하게 동네 카페 가서 커피 마심", type: "MY_WAY" },
      { text: "윗집 층간소음에 빡쳐서 천장 쿵쿵 치고 욕 한 바가지 시전", type: "ANGRY_BIRD" }
    ]
  },
  {
    id: 3,
    text: "새해 첫날, 올해의 목표를 세울 때 나는?",
    options: [
      { text: "다이어리 사고 화려하게 계획 세웠지만 1월 3일에 끝남", type: "FAKE_PLANNER" },
      { text: "올해 고과 잘 받아서 승진하고 연봉 20% 인상하는 게 최우선 목표임", type: "WORKAHOLIC" },
      { text: "올해는 꼭 내 모든 걸 바칠 운명의 짝을 찾아서 연애하겠다 맹세함", type: "LOVE_BLIND" },
      { text: "작년에 실패했던 일들 생각하며 '올해도 망하면 어쩌지' 벌써 불안함", type: "WORRY_MACHINE" }
    ]
  },
  {
    id: 4,
    text: "인스타그램을 보다가 마음에 드는 팝업스토어를 발견했다!",
    options: [
      { text: "가서 파는 한정판 굿즈부터 싹 쓸어 담을 생각에 지갑부터 챙김", type: "MONEY_WASTER" },
      { text: "그 동네 근처에 안주 맛있고 분위기 지리는 술집 있나부터 검색함", type: "ALCOHOLIC" },
      { text: "이건 못 참지. 무조건 첫날 오픈런 뛰어서 스토리 올려야 직성이 풀림", type: "TREND_SLAVE" },
      { text: "팝업스토어 소개하는 쇼츠/릴스 무한 반복 재생하면서 도파민 충전함", type: "DOPAMINE_ADDICT" }
    ]
  },
  {
    id: 5,
    text: "단톡방에서 친구들이 약속을 잡으려 할 때 나는?",
    options: [
      { text: "나가기 귀찮아... '나중에 정하자' 하면서 은근슬쩍 미룸", type: "LAZY_BED" },
      { text: "읽고 대답 안 하다가 남들이 날짜 다 정하면 '그날 안 돼' 시전", type: "SOCIAL_GHOST" },
      { text: "'난 여기 갈 건데 올 사람 와라' 통보하고 내 갈 길 감", type: "MY_WAY" },
      { text: "애들이 메뉴 하나 제대로 못 고르고 질질 끌면 속 터져서 폭발함", type: "ANGRY_BIRD" }
    ]
  },
  {
    id: 6,
    text: "회사/학교에서 중요한 팀 프로젝트를 맡게 되었다!",
    options: [
      { text: "노션에 예쁘게 템플릿 파고 일정표 화려하게 만들고 만족함 (내용은 없음)", type: "FAKE_PLANNER" },
      { text: "내가 총대 메고 주말에도 야근해서 완벽하게 다 끝내버림", type: "WORKAHOLIC" },
      { text: "프로젝트 핑계로 썸남/썸녀한테 도와달라고 연락할 구실 만듦", type: "LOVE_BLIND" },
      { text: "발표하다가 실수해서 망하는 시뮬레이션 돌리면서 식은땀 흘림", type: "WORRY_MACHINE" }
    ]
  },
  {
    id: 7,
    text: "제일 친한 친구가 우울하다고 연락이 왔다.",
    options: [
      { text: "'내가 쏠게! 비싸고 맛있는 거 먹고 기분 풀자' 당장 나감", type: "MONEY_WASTER" },
      { text: "'나와. 오늘 간 썩을 때까지 마시는 거다' 소주 3병 까기 시작", type: "ALCOHOLIC" },
      { text: "'요즘 인스타에서 핫하다는 카페 알아놨어! 거기가자' 끌고 감", type: "TREND_SLAVE" },
      { text: "말로 위로하는 대신 개웃긴 동물 릴스 10개 연속으로 보냄", type: "DOPAMINE_ADDICT" }
    ]
  },
  {
    id: 8,
    text: "오늘 정말 빡치는 일을 겪었다!",
    options: [
      { text: "만사가 다 귀찮다... 이불 뒤집어쓰고 세상과 단절한 채 잠듦", type: "LAZY_BED" },
      { text: "아무하고도 연락 안 하고 동굴로 들어가서 철저하게 잠수탐", type: "SOCIAL_GHOST" },
      { text: "'뭐 어쩌라고' 마인드로 쿨하게 넘겨버림. 내 알 바 아님", type: "MY_WAY" },
      { text: "그 자리에서 쌍욕 박거나 당장 인스타 부계정에 저격글 폭주함", type: "ANGRY_BIRD" }
    ]
  },
  {
    id: 9,
    text: "밤 11시, 자려고 침대에 누웠을 때 내 머릿속은?",
    options: [
      { text: "내일 아침 6시 기상부터 시작하는 완벽한 갓생 일정표 짬 (실행 확률 0%)", type: "FAKE_PLANNER" },
      { text: "내일 출근해서 해야 할 업무 리스트랑 회의 자료 구상하느라 바쁨", type: "WORKAHOLIC" },
      { text: "짝사랑 상대랑 사귀고 결혼해서 신혼여행 가는 상상까지 다 마침", type: "LOVE_BLIND" },
      { text: "5년 전 새벽에 남긴 흑역사 댓글 떠오르고 이불 발로 참", type: "WORRY_MACHINE" }
    ]
  },
  {
    id: 10,
    text: "스트레스가 극에 달해 폭발 직전이다! 나의 해소법은?",
    options: [
      { text: "시발비용 핑계 대고 평소에 고민하던 50만 원짜리 물건 긁어버림", type: "MONEY_WASTER" },
      { text: "아무도 안 만나고 집에서 안주 시켜서 혼술 3병 때림", type: "ALCOHOLIC" },
      { text: "오픈런 해야 갈 수 있는 팝업스토어 혼자 가서 인증샷 100장 남김", type: "TREND_SLAVE" },
      { text: "틱톡이랑 쇼츠 4시간 연속 시청하면서 뇌 빼고 도파민 과다 분비시킴", type: "DOPAMINE_ADDICT" }
    ]
  },
  {
    id: 11,
    text: "누가 내 뒷담화를 했다는 걸 알았을 때 나의 반응은?",
    options: [
      { text: "해명하기도 귀찮고 싸우기도 귀찮다. 그냥 냅두자...", type: "LAZY_BED" },
      { text: "조용히 걔 카톡/인스타/전화번호 차단하고 인생에서 지워버림", type: "SOCIAL_GHOST" },
      { text: "응 내 알 바 아님~ 남들이 뭐라든 내 인생 내가 잘 살면 그만", type: "MY_WAY" },
      { text: "당장 쫓아가서 멱살 잡고 삼자대면해서 판 다 엎어버림", type: "ANGRY_BIRD" }
    ]
  },
  {
    id: 12,
    text: "만약 로또 1등에 당첨된다면 나의 첫 상상은?",
    options: [
      { text: "건물주 돼서 요트 타고 세계일주 하는 마스터플랜을 엑셀로 정리함", type: "FAKE_PLANNER" },
      { text: "회사 당장 그만두고 우리 회사 경쟁사 인수해버리는 상상함", type: "WORKAHOLIC" },
      { text: "애인한테 외제차 뽑아주고 스몰 웨딩으로 성대하게(?) 결혼함", type: "LOVE_BLIND" },
      { text: "돈벼락 맞은 거 들키면 사기당할까 봐 불안해서 가족한테도 숨김", type: "WORRY_MACHINE" }
    ]
  }
];

export const calculateSbtiType = (answers: SbtiTypeCode[]): string => {
  const counts: Record<SbtiTypeCode, number> = {
    MONEY_WASTER: 0,
    LAZY_BED: 0,
    FAKE_PLANNER: 0,
    SOCIAL_GHOST: 0,
    ALCOHOLIC: 0,
    ANGRY_BIRD: 0,
    WORKAHOLIC: 0,
    LOVE_BLIND: 0,
    DOPAMINE_ADDICT: 0,
    MY_WAY: 0,
    WORRY_MACHINE: 0,
    TREND_SLAVE: 0
  };
  
  answers.forEach(type => {
    if (counts[type] !== undefined) counts[type]++;
  });

  // 가장 높은 카운트를 가진 유형 찾기
  let maxCount = -1;
  let maxTypes: SbtiTypeCode[] = [];

  for (const [type, count] of Object.entries(counts)) {
    if (count > maxCount) {
      maxCount = count;
      maxTypes = [type as SbtiTypeCode];
    } else if (count === maxCount) {
      maxTypes.push(type as SbtiTypeCode);
    }
  }

  // 동점일 경우 랜덤으로 하나 선택
  return maxTypes[Math.floor(Math.random() * maxTypes.length)];
};
