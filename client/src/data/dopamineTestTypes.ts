export interface DopamineType {
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

export const dopamineTypes: Record<string, DopamineType> = {
  "SHORT_FORM": {
    code: "SHORT_FORM",
    title: "도파민 좀비",
    subtitle: "알고리즘이 낳은 숏폼 망령",
    description: "손가락 하나로 세상을 구경하는 당신! '딱 하나만 더 볼까?' 하다가 새벽 3시를 맞이하는 게 일상입니다. 집중력은 금붕어 수준이지만 트렌드에는 누구보다 빠삭한 전형적인 숏폼 도파민 중독자입니다.",
    characteristics: [
      "유튜브 쇼츠, 인스타 릴스, 틱톡 없인 못 살아",
      "재미없는 영상은 1초 만에 스와이프",
      "유행하는 밈(Meme)이나 플러팅 멘트 다 알고 있음",
      "진득하게 앉아서 영화/드라마 풀버전 보는 거 힘들어함",
      "정보 습득은 무조건 3줄 요약이나 숏폼으로",
      "자기 전에 폰 보다가 얼굴에 떨어뜨린 적 있음",
      "도파민 터지는 자극적인 썰(마라맛 가십) 아주 좋아함",
      "눈 초점은 잃은 상태로 엄지만 무한 스와이프"
    ],
    celebrities: [
      "침대 밖을 모르는 베짱이", "쇼츠 넘기는 기계", "알고리즘의 노예"
    ],
    coupangKeyword: "스마트폰 거치대",
    compatibility: {
      best: "FLEX",
      good: ["SUGAR"],
      avoid: "DETOX"
    },
    emoji: "📱",
    color: "#8b5cf6"
  },
  "SUGAR": {
    code: "SUGAR",
    title: "혈당 스파이크러",
    subtitle: "당류 섭취 = 행복 지수",
    description: "스트레스의 해답은 위장 속에 있다고 믿는 당신! 기분이 우울할 땐 마라탕 수혈, 기분이 좋을 땐 탕후루나 초코 케이크로 도파민을 채웁니다. 맛있는 걸 입에 넣는 그 순간이 인생 최고의 도파민이죠.",
    characteristics: [
      "배민/요기요/쿠팡이츠 VVIP 등급",
      "밥 들어갈 배와 디저트 들어갈 배는 별개임",
      "새로 나온 편의점 신상 디저트는 꼭 먹어봐야 직성이 풀림",
      "스트레스 받으면 '오늘 마라탕 각?'부터 외침",
      "혈당 스파이크로 인한 식곤증을 달달한 커피로 다시 누름",
      "맛집 탐방 릴스는 전부 '저장' 해둠",
      "입터짐 방지용 다이어트 간식 샀는데 하루 만에 다 털어먹음",
      "단짠단짠의 법칙을 세상에서 제일 잘 이해함"
    ],
    celebrities: [
      "달콤살벌 마카롱 요정", "배달앱 VVIP", "마라탕 생존자"
    ],
    coupangKeyword: "달콤한 간식",
    compatibility: {
      best: "SUGAR",
      good: ["FLEX"],
      avoid: "SHORT_FORM"
    },
    emoji: "🍡",
    color: "#f43f5e"
  },
  "FLEX": {
    code: "FLEX",
    title: "지름신 접신자",
    subtitle: "결제 버튼의 짜릿함",
    description: "사는(Live) 재미보다 사는(Buy) 재미로 사는 당신! 택배 박스를 뜯는 순간의 도파민을 위해 돈을 법니다. 내 안의 우울함은 카드번호 16자리가 치료해준다고 굳게 믿고 있는 소비 요정입니다.",
    characteristics: [
      "장바구니에 담아둔 물건만 합치면 차 한 대 값",
      "결제 버튼 누를 때의 쾌감이 세상에서 제일 짜릿함",
      "예쁜 쓰레기를 아주 정성스럽게 수집함",
      "'이건 나를 위한 선물이야' (한 달에 10번 주는 게 문제)",
      "SNS 광고 보다가 홀린듯이 결제 화면으로 넘어가 있음",
      "통장 잔고 보면 한숨 나오지만 박스 뜯을 땐 뇌가 맑아짐",
      "로켓배송/새벽배송 없던 시절은 상상하기도 싫음",
      "스트레스 받을 때 '시발비용' 지출이 가장 확실한 처방임"
    ],
    celebrities: [
      "택배박스 산타클로스", "텅장 방어 실패자", "보부상"
    ],
    coupangKeyword: "선물세트",
    compatibility: {
      best: "SHORT_FORM",
      good: ["SUGAR"],
      avoid: "DETOX"
    },
    emoji: "🛍️",
    color: "#ec4899"
  },
  "DETOX": {
    code: "DETOX",
    title: "갓생 호소인",
    subtitle: "다이소 다꾸템 수집가",
    description: "'오늘부터 도파민 디톡스한다'를 입에 달고 사는 당신! 생산적인 삶에 대한 환상이 강해서 다이어리, 영양제, 요가 매트 등을 사 모읍니다. 계획을 세우는 행위 자체에서 도파민을 느끼는 갓생 꿈나무입니다.",
    characteristics: [
      "다이어리 예쁘게 꾸미고 첫 장 쓰고 끝남",
      "운동 시작하려고 예쁜 레깅스부터 깔별로 구매",
      "유튜브 재생목록에 '동기부여', '명상' 영상만 가득함",
      "'갓생 살기 프로젝트'를 마음속으로만 100번째 진행 중",
      "SNS에 일찍 일어난 인증샷(미라클모닝) 올리는 상상 자주 함",
      "도입부만 닳고 닳은 책들이 책장에 수두룩함",
      "나의 완벽한 계획을 짤 때 도파민이 폭발함 (실행은 내일)",
      "'내일부터 진짜 시작한다'의 의인화 그 자체"
    ],
    celebrities: [
      "다이소 다꾸 장인", "미라클 모닝 상상러", "작심3시간"
    ],
    coupangKeyword: "다이어리 꾸미기",
    compatibility: {
      best: "DETOX",
      good: ["SHORT_FORM"],
      avoid: "FLEX"
    },
    emoji: "🧘‍♀️",
    color: "#10b981"
  }
};
