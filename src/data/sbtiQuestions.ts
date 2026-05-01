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
  // --- 기존 12문항 ---
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
  },
  
  // --- 신규 12문항 (13~24번) ---
  {
    id: 13,
    text: "유튜브 알고리즘에 내가 평소 사고 싶었던 물건 리뷰가 떴을 때",
    options: [
      { text: "'이건 운명이야' 하면서 영상 다 보기도 전에 결제창으로 넘어감", type: "MONEY_WASTER" },
      { text: "영상 보면서 맥주 한 캔 따고 안주 먹방으로 자체 변질시킴", type: "ALCOHOLIC" },
      { text: "이게 요즘 인싸템이라고? 나도 당장 사서 스토리 올려야지", type: "TREND_SLAVE" },
      { text: "리뷰 영상 끝난 뒤 끝없는 쇼츠의 늪으로 빠져서 물건 사는 건 까먹음", type: "DOPAMINE_ADDICT" }
    ]
  },
  {
    id: 14,
    text: "친구들과의 약속 시간에 늦었을 때 나의 대처법은?",
    options: [
      { text: "가기 귀찮았는데 잘됐다 싶어서 '나 오늘 몸이 좀 안 좋네...' 핑계 댐", type: "LAZY_BED" },
      { text: "카톡 알림 몰래 훔쳐보고 애들이 '어디냐'고 화낼 때까지 안 읽씹 유지", type: "SOCIAL_GHOST" },
      { text: "'미안 좀 늦음 먼저 먹고 있어' 당당하게 통보하고 천천히 걸어감", type: "MY_WAY" },
      { text: "버스 기사님이 신호 걸릴 때마다 혼자 속으로 열불 터져서 씩씩댐", type: "ANGRY_BIRD" }
    ]
  },
  {
    id: 15,
    text: "별로 안 친한 동료가 뜬금없이 모바일 청첩장을 보냈을 때",
    options: [
      { text: "축의금 액수별 기준표 엑셀로 만들어서 얼마 낼지 과학적으로 계산함", type: "FAKE_PLANNER" },
      { text: "그날 주말 출근이나 야근 핑계 대고 돈만 살짝 보내고 빠짐", type: "WORKAHOLIC" },
      { text: "청첩장 사진 보면서 '내 결혼식은 이거보다 예뻐야지' 망상 시작함", type: "LOVE_BLIND" },
      { text: "'안 가면 뒤에서 욕하려나? 가면 또 뻘쭘할 텐데' 하루 종일 혼자 고민함", type: "WORRY_MACHINE" }
    ]
  },
  {
    id: 16,
    text: "다이어트 중인데 밤 11시에 치킨 냄새가 진동할 때",
    options: [
      { text: "'다이어트는 내일부터' 외치며 요기요 VVIP 쿠폰으로 제일 비싼 세트 지름", type: "MONEY_WASTER" },
      { text: "'치킨엔 생맥이지' 냉장고에서 남은 캔맥주 꺼내서 바로 세팅함", type: "ALCOHOLIC" },
      { text: "기왕 먹을 거면 요즘 제일 핫한 신메뉴 치킨으로 시켜서 인스타 올림", type: "TREND_SLAVE" },
      { text: "배달 기다리는 동안 먹방 유튜버 치킨 먹는 쇼츠 보면서 도파민 충전", type: "DOPAMINE_ADDICT" }
    ]
  },
  {
    id: 17,
    text: "썸남/썸녀가 '나 오늘 우울해서 머리 잘랐어'라고 카톡을 보냈을 때",
    options: [
      { text: "'어어 그래...' 하고 답장 쓰기 귀찮아서 그냥 하트나 하나 찍고 맘", type: "LAZY_BED" },
      { text: "T답게 '우울한데 머리는 왜 자름?' 보냈다가 분위기 싸해질까 봐 안 읽씹함", type: "SOCIAL_GHOST" },
      { text: "'난 파마하는 게 더 예쁘던데' 팩폭 날리며 마이웨이로 답장함", type: "MY_WAY" },
      { text: "'누가 널 우울하게 만들었어!!' 급발진하며 대신 화내줌", type: "ANGRY_BIRD" }
    ]
  },
  {
    id: 18,
    text: "내일까지 끝내야 하는 과제/업무가 산더미일 때",
    options: [
      { text: "완벽하게 끝내는 타임라인 짜다가 시간 다 보내고 결국 벼락치기함", type: "FAKE_PLANNER" },
      { text: "카페인 수혈하고 전투 모드 돌입, 밤새워서라도 남들보다 완벽하게 끝냄", type: "WORKAHOLIC" },
      { text: "애인한테 전화해서 '나 너무 힘들어 찡찡' 거리고 위로받느라 1시간 날림", type: "LOVE_BLIND" },
      { text: "'이거 못 끝내면 잘리는 거 아냐?' 극단적인 상상하며 식은땀 흘림", type: "WORRY_MACHINE" }
    ]
  },
  {
    id: 19,
    text: "주말에 갑자기 10만 원짜리 공돈이 생겼다!",
    options: [
      { text: "이건 신이 주신 용돈! 바로 평소에 사고 싶었던 무쓸모 굿즈 결제함", type: "MONEY_WASTER" },
      { text: "'오늘 술값 굳었다!' 당장 친구들 불러서 고급 안주에 소맥 콸콸 마심", type: "ALCOHOLIC" },
      { text: "요즘 예약하기 빡세다는 한강 뷰 레스토랑 당장 예약하고 자랑함", type: "TREND_SLAVE" },
      { text: "평소 하던 모바일 게임에 가챠 현질해서 도파민 풀충전함", type: "DOPAMINE_ADDICT" }
    ]
  },
  {
    id: 20,
    text: "모처럼 주어진 황금 같은 3일 연휴의 계획은?",
    options: [
      { text: "이불 밖으로 한 발짝도 나가지 않고 넷플릭스 정주행하며 침대와 한 몸 됨", type: "LAZY_BED" },
      { text: "카톡 방해금지 모드 켜고 누구의 연락도 받지 않는 나만의 동굴 생활 시작", type: "SOCIAL_GHOST" },
      { text: "남들 다 가는 여행지는 패스, 나 혼자 훌쩍 아무도 모르는 곳으로 떠남", type: "MY_WAY" },
      { text: "어딜 가나 차 막히고 사람 많은 꼴 보면 승질나서 그냥 집에 있음", type: "ANGRY_BIRD" }
    ]
  },
  {
    id: 21,
    text: "인스타 스토리에 게시물을 올리는 나의 빈도와 스타일은?",
    options: [
      { text: "운동, 독서, 미라클 모닝 등 '갓생 사는 나'의 모습을 주로 올림 (실제론 아님)", type: "FAKE_PLANNER" },
      { text: "밤 11시에 모니터 화면 찍어 올리며 '오늘도 야근...' 노예 인증함", type: "WORKAHOLIC" },
      { text: "애인과 찍은 네컷 사진, 커플템 등 하루 종일 럽스타그램으로 도배함", type: "LOVE_BLIND" },
      { text: "'이거 올리면 애들이 관종이라 욕할까?' 1시간 고민하다가 결국 안 올림", type: "WORRY_MACHINE" }
    ]
  },
  {
    id: 22,
    text: "사람이 바글바글한 회식/모임 자리에서 나의 포지션은?",
    options: [
      { text: "내 돈 아니니까 이럴 때 비싼 메뉴 시키자며 제일 비싼 소고기 주문함", type: "MONEY_WASTER" },
      { text: "쉬지 않고 남의 잔 채워주고 내 잔도 채우며 건배사 주도하는 술의 신", type: "ALCOHOLIC" },
      { text: "요즘 릴스에서 유행하는 신상 폭탄주 제조법 시연하며 인싸력 뽐냄", type: "TREND_SLAVE" },
      { text: "구석에서 폰 만지작거리며 웃긴 쇼츠나 보면서 몰래 딴짓함", type: "DOPAMINE_ADDICT" }
    ]
  },
  {
    id: 23,
    text: "미용실에서 머리를 자를 때 나의 스타일은?",
    options: [
      { text: "말하는 것도 귀찮아서 '그냥 깔끔하게 다듬어주세요' 하고 꾸벅꾸벅 졺", type: "LAZY_BED" },
      { text: "디자이너 선생님이 스몰톡 걸어오면 심박수 올라가면서 단답형으로 뚝딱거림", type: "SOCIAL_GHOST" },
      { text: "연예인 사진 딱 보여주고 '무조건 이렇게 해주세요' 단호하게 요구함", type: "MY_WAY" },
      { text: "머리 망한 것 같으면 그 자리에서 표정 관리 못하고 정색하며 따짐", type: "ANGRY_BIRD" }
    ]
  },
  {
    id: 24,
    text: "통장 잔고가 10만 원밖에 안 남았을 때 나의 심정은?",
    options: [
      { text: "가계부 앱 켜서 남은 10만 원을 어떻게 쪼개 쓸지 과학적인(?) 예산 짬", type: "FAKE_PLANNER" },
      { text: "안 되겠다 싶어서 당장 주말 알바나 단기 투잡 공고 미친 듯이 뒤짐", type: "WORKAHOLIC" },
      { text: "'이번 주말 데이트 비용 어떡하지...' 애인 실망시킬까 봐 그게 제일 걱정임", type: "LOVE_BLIND" },
      { text: "'이러다 길거리에 나앉는 거 아냐?' 파산해서 굶어 죽는 상상하며 오열함", type: "WORRY_MACHINE" }
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
