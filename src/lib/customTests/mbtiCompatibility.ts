import { mbtiTypes, type MBTIType } from "./mbtiTypes";

export const MBTI_CODES = [
  "INTJ", "INTP", "ENTJ", "ENTP",
  "INFJ", "INFP", "ENFJ", "ENFP",
  "ISTJ", "ISFJ", "ESTJ", "ESFJ",
  "ISTP", "ISFP", "ESTP", "ESFP",
] as const;

export type MBTICode = (typeof MBTI_CODES)[number];

export type CompatibilityTier = "BEST" | "GOOD" | "BALANCED" | "CHALLENGE";

export interface CuratedPairExtra {
  headline: string;
  loveSummary: string;
  workSummary: string;
  conflictTrigger: string;
  goldenRule: string;
  dialogueBad: { speakerA: string; speakerB: string };
  dialogueGood: { speakerA: string; speakerB: string };
}

export interface AxisComparison {
  axisName: string;
  letterA: string;
  letterB: string;
  isSame: boolean;
  summary: string;
  tip: string;
}

export interface CompatibilityReport {
  pairKey: string;
  codeA: MBTICode;
  codeB: MBTICode;
  typeA: MBTIType;
  typeB: MBTIType;
  score: number;
  tier: CompatibilityTier;
  tierLabel: string;
  tierEmoji: string;
  isCurated: boolean;
  headline: string;
  overview: string;
  temperamentDynamic: {
    groupA: string;
    groupB: string;
    title: string;
    description: string;
  };
  axisComparisons: AxisComparison[];
  loveGuide: string;
  workGuide: string;
  conflictPoints: string[];
  practicalTips: string[];
  curatedExtra?: CuratedPairExtra;
  faqs: { q: string; a: string }[];
}

export function isValidMbtiCode(code: string): code is MBTICode {
  return (MBTI_CODES as readonly string[]).includes(code);
}

export function toCanonicalPair(a: string, b: string): string | null {
  const ua = a.toUpperCase();
  const ub = b.toUpperCase();
  if (!isValidMbtiCode(ua) || !isValidMbtiCode(ub)) return null;
  return ua <= ub ? `${ua}-${ub}` : `${ub}-${ua}`;
}

export function parsePairSlug(slug: string): {
  codeA: MBTICode;
  codeB: MBTICode;
  canonical: string;
  needsRedirect: boolean;
} | null {
  const parts = slug.split("-");
  if (parts.length !== 2) return null;
  const ua = parts[0].toUpperCase();
  const ub = parts[1].toUpperCase();
  if (!isValidMbtiCode(ua) || !isValidMbtiCode(ub)) return null;
  const canonical = ua <= ub ? `${ua}-${ub}` : `${ub}-${ua}`;
  const [codeA, codeB] = canonical.split("-") as [MBTICode, MBTICode];
  return {
    codeA,
    codeB,
    canonical,
    needsRedirect: slug !== canonical,
  };
}

export function getAllCanonicalPairs(): string[] {
  const pairs: string[] = [];
  const sorted = [...MBTI_CODES].sort();
  for (let i = 0; i < sorted.length; i++) {
    for (let j = i; j < sorted.length; j++) {
      pairs.push(`${sorted[i]}-${sorted[j]}`);
    }
  }
  return pairs; // 136 unique canonical pairs
}

function getTemperament(code: MBTICode): "NT" | "NF" | "SJ" | "SP" {
  if (code[1] === "N" && code[2] === "T") return "NT";
  if (code[1] === "N" && code[2] === "F") return "NF";
  if (code[1] === "S" && code[3] === "J") return "SJ";
  return "SP";
}

const TEMPERAMENT_LABELS: Record<"NT" | "NF" | "SJ" | "SP", string> = {
  NT: "분석가형(NT)",
  NF: "외교관형(NF)",
  SJ: "관리자형(SJ)",
  SP: "탐험가형(SP)",
};

const TEMPERAMENT_DYNAMICS: Record<string, { title: string; description: string }> = {
  "NT-NT": {
    title: "지적 시너지와 전략적 파트너십",
    description:
      "두 사람 모두 본질과 논리를 중시해 대화 밀도가 매우 높습니다. 서로의 독립성을 존중하며 생산적인 토론을 즐기지만, 감정적 위로나 따뜻한 표현이 생략되어 관계가 건조해지지 않도록 의식적인 표현이 필요합니다.",
  },
  "NF-NT": {
    title: "논리와 공감이 만나는 상호 보완 케미",
    description:
      "직관(N)을 공유해 대화가 깊이 통하면서도, 분석가형(NT)의 객관적 해결력과 외교관형(NF)의 섬세한 공감이 서로의 빈틈을 채워줍니다. 갈등 시 '해결책 제시'와 '감정 수용'의 순서만 맞추면 최상의 파트너십을 발휘합니다.",
  },
  "NT-SJ": {
    title: "큰 그림의 전략과 현실 실행력의 만남",
    description:
      "분석가형(NT)이 방향성과 효율 구조를 설계하면 관리자형(SJ)이 꼼꼼한 일정과 안정성으로 완성합니다. 다만 변화 속도(혁신 vs 검증된 방식)에 대한 관점 차이가 크므로 역할을 명확히 나누는 것이 중요합니다.",
  },
  "NT-SP": {
    title: "냉철한 분석과 즉각적 돌파력의 조합",
    description:
      "두 기질 모두 불필요한 형식이나 감정 소모를 싫어해 쿨하고 담백한 관계를 맺기 쉽습니다. 분석가형(NT)의 장기 설계와 탐험가형(SP)의 현장 대응력이 결합하면 실용적인 성과를 빠르게 만들어냅니다.",
  },
  "NF-NF": {
    title: "깊은 정서적 교감과 가치관의 공명",
    description:
      "서로의 미묘한 감정 변화를 빠르게 알아채고 진심으로 응원해 주는 따뜻한 관계입니다. 다만 두 사람 모두 상처를 피하려 속마음을 미루거나 현실적 문제 정리를 뒤로 미루는 경향이 있어 솔직한 피드백 연습이 도움이 됩니다.",
  },
  "NF-SJ": {
    title: "따뜻한 이상과 든든한 현실 안정감의 균형",
    description:
      "외교관형(NF)은 관계에 의미와 생기를 불어넣고, 관리자형(SJ)은 약속 이행과 실질적 돌봄으로 신뢰를 쌓습니다. 감정 표현 방식(말·의미 중심 vs 행동·책임 중심)의 차이를 이해하면 오해가 크게 줄어듭니다.",
  },
  "NF-SP": {
    title: "섬세한 감성과 자유로운 현재 감각의 조화",
    description:
      "외교관형(NF)이 깊은 내면과 의미를 탐색하는 동안 탐험가형(SP)은 지금 이 순간의 즐거움과 생동감을 선물합니다. 장기적인 계획 대화와 즉흥적인 휴식의 균형을 잡을 때 편안하고 매력적인 관계가 됩니다.",
  },
  "SJ-SJ": {
    title: "신뢰·약속·일관성으로 다져지는 탄탄한 관계",
    description:
      "책임감과 현실 감각을 공유해 약속 어김이나 예측 불가능한 변수로 인한 스트레스가 적습니다. 서로의 기준과 생활 루틴이 다를 때 '내가 맞는 방식'만 고집하지 않고 유연하게 조율하면 오래가는 안정적 파트너가 됩니다.",
  },
  "SJ-SP": {
    title: "체계적 안정감과 유연한 활력의 만남",
    description:
      "감각(S)을 공유해 현실 대화가 잘 통하면서도, 관리자형(SJ)의 계획성과 탐험가형(SP)의 자유로움이 서로에게 신선한 자극을 줍니다. 지켜야 할 핵심 약속 몇 가지만 합의하고 나머지는 자유롭게 두는 방식이 잘 맞습니다.",
  },
  "SP-SP": {
    title: "유쾌한 에너지와 즉흥적 즐거움이 넘치는 관계",
    description:
      "구속 없이 현재를 즐기고 활동적인 경험을 함께할 때 최고의 케미를 보입니다. 다만 장기적인 재정·일정 관리나 깊은 갈등 대화를 미루기 쉬우므로 중요한 사안은 짧은 메모로 합의해 두는 습관이 유익합니다.",
  },
};

// 검색량 최상위 핵심 32쌍 큐레이션 (알파벳 정규화 키)
export const CURATED_PAIR_MAP: Record<string, CuratedPairExtra> = {
  "ENFJ-INFP": {
    headline: "서로의 진심을 가장 깊이 알아주는 대표 천생연분 케미",
    loveSummary:
      "ENFJ의 따뜻한 리드와 진심 어린 지지가 INFP의 내면 방어벽을 부드럽게 열어줍니다. INFP는 ENFJ가 겉으로 강한 척하며 쌓아둔 피로를 누구보다 먼저 알아채고 정서적 안식처가 되어 줍니다.",
    workSummary:
      "ENFJ가 프로젝트의 방향과 사람 간 조율을 맡고 INFP가 독창적인 콘텐츠·기획 아이디어를 채울 때 높은 완성도를 보입니다. 단, 마감 일정은 구체적 날짜로 공유하는 편이 안전합니다.",
    conflictTrigger:
      "ENFJ는 갈등을 바로 대화로 풀고 싶어 하지만, INFP는 감정을 정리할 혼자만의 시간이 먼저 필요할 때 서로 회피·압박으로 오해하기 쉽습니다.",
    goldenRule: "갈등 시 INFP는 '30분만 정리하고 꼭 먼저 말할게'라고 복귀 시점을 약속하고, ENFJ는 그 시간을 믿고 기다려 주세요.",
    dialogueBad: {
      speakerA: "무슨 생각인지 지금 바로 얘기해 줘야 풀리지, 왜 자꾸 입을 닫아?",
      speakerB: "지금 말하면 감정이 격해질 것 같아서 그래... 자꾸 몰아붙이지 마.",
    },
    dialogueGood: {
      speakerA: "네가 편할 때 듣고 싶어. 오늘 저녁 8시쯤 차분히 얘기해 볼 수 있을까?",
      speakerB: "고마워, 8시까지 내 마음 정리해서 솔직하게 먼저 말할게.",
    },
  },
  "ENFP-INTJ": {
    headline: "끝없는 호기심과 치밀한 전략이 만나 시너지를 내는 골든 페어",
    loveSummary:
      "INTJ의 차분한 지성과 일관성이 ENFP에게 깊은 신뢰를 주고, ENFP의 밝은 에너지와 다채로운 시선이 INTJ의 세계를 확장합니다. 서로가 평소 잘 쓰지 않는 매력을 채워주는 대표 보완 조합입니다.",
    workSummary:
      "ENFP가 수많은 아이디어와 외부 네트워크를 끌어오면 INTJ가 핵심만 추려 실행 가능한 시스템으로 정리합니다. 스타트업·기획·크리에이티브 협업에서 특히 강합니다.",
    conflictTrigger:
      "ENFP는 즉흥적인 감정 공유와 리액션을 원하지만, INTJ는 결론 중심의 짧은 피드백을 건네 '나에게 무관심하다'는 오해가 생기기 쉽습니다.",
    goldenRule: "INTJ는 논리적 해결책 앞에 '그랬구나, 힘들었겠다' 한 문장을 먼저 두고, ENFP는 중요한 약속·일정은 미리 캘린더로 공유하세요.",
    dialogueBad: {
      speakerA: "오늘 회사에서 너무 억울한 일이 있었어 ㅠㅠ",
      speakerB: "그럼 애초에 메일로 근거를 남겼어야지. 다음엔 이렇게 해.",
    },
    dialogueGood: {
      speakerA: "오늘 회사에서 너무 억울한 일이 있었어. 우선 내 얘기 좀 들어줄래?",
      speakerB: "진짜 속상했겠다. 일단 다 말해 봐. 정리 필요하면 그다음에 같이 대책 세우자.",
    },
  },
  "ENFP-INFJ": {
    headline: "말하지 않아도 통하는 직관적 공감과 영혼의 대화 파트너",
    loveSummary:
      "두 사람 모두 직관(N)과 감정(F)을 공유해 가치관·삶의 방향에 대한 대화가 밤새 이어집니다. ENFP의 유쾌한 활력이 INFJ의 긴장을 풀어주고, INFJ의 깊은 배려가 ENFP를 안정시켜 줍니다.",
    workSummary:
      "사람을 향한 진정성과 아이디어 기획력이 뛰어납니다. 다만 두 유형 모두 반복 행정이나 냉정한 거절에 취약할 수 있어 체크리스트를 함께 운영하는 것이 좋습니다.",
    conflictTrigger:
      "INFJ는 서운함이 쌓여도 참고 있다가 한계점에서 문을 닫아 버리고, ENFP는 사전에 신호를 눈치채지 못해 당황하는 패턴이 생길 수 있습니다.",
    goldenRule: "INFJ는 서운함이 30%일 때 부드럽게 표현하고, ENFP는 INFJ가 혼자 충전할 고요한 시간을 의식적으로 존중해 주세요.",
    dialogueBad: {
      speakerA: "나 요즘 너랑 거리감이 느껴지는데 괜찮은 거 맞아?",
      speakerB: "괜찮아, 그냥 요즘 조금 피곤해서 그래. (속으로 이미 크게 지침)",
    },
    dialogueGood: {
      speakerA: "최근에 내가 놓친 부분이 있으면 편하게 말해줘. 네 마음이 제일 중요해.",
      speakerB: "사실 지난번 약속 변경이 조금 아쉬웠어. 다음엔 하루 전에만 말해줘도 덜 지칠 것 같아.",
    },
  },
  "ENTP-INFJ": {
    headline: "지적 자극과 깊은 통찰이 맞물리는 매력적인 밀당 케미",
    loveSummary:
      "ENTP의 재치 있는 발상과 틀을 깨는 유머가 INFJ에게 신선한 활력을 주고, INFJ의 깊은 통찰력과 진정성이 ENTP의 산만한 에너지를 한곳으로 모아줍니다.",
    workSummary:
      "ENTP가 다양한 가설과 반론으로 아이디어를 검증하면 INFJ가 사람과 브랜드의 핵심 메시지로 정제해 뛰어난 기획물을 만듭니다.",
    conflictTrigger:
      "ENTP에게 논쟁은 재미있는 지적 놀이지만, INFJ에게는 관계의 조화를 해치는 감정적 공격처럼 느껴질 수 있습니다.",
    goldenRule: "ENTP는 토론할 때 상대를 이기는 말투보다 '같이 탐구하는 톤'을 쓰고, INFJ는 ENTP의 반론을 개인적 비난으로 받아들이지 않도록 경계를 나누세요.",
    dialogueBad: {
      speakerA: "그 생각은 논리적으로 허점이 너무 많은데? 반대로 생각해 봐.",
      speakerB: "왜 내 진심을 매번 시험하듯 따지고 들어?",
    },
    dialogueGood: {
      speakerA: "네 관점 흥미롭다. 여기에 다른 변수 하나만 얹어보면 어떻게 될까?",
      speakerB: "그 변수도 좋네! 다만 내가 중요하게 보는 핵심 가치는 이 부분이야.",
    },
  },
  "ENTJ-INFP": {
    headline: "강력한 추진력과 따뜻한 이상이 만나는 극과 극 성장 조합",
    loveSummary:
      "겉으로는 정반대처럼 보이지만, ENTJ는 INFP의 순수한 진정성과 섬세함에 끌리고 INFP는 ENTJ의 흔들림 없는 결단력과 보호 본능에 큰 안정감을 느낍니다.",
    workSummary:
      "INFP가 사용자 공감과 스토리텔링을 설계하고 ENTJ가 실행 로드맵과 목표 달성을 이끌면 강력한 팀워크가 나옵니다.",
    conflictTrigger:
      "ENTJ의 직설적인 피드백과 효율 최우선 태도가 INFP에게는 차갑고 존중받지 못하는 느낌으로 다가올 수 있습니다.",
    goldenRule: "ENTJ는 문제 해결 전 상대의 노력을 먼저 인정하고, INFP는 원하는 바를 돌려 말하지 말고 구체적 요청으로 전달하세요.",
    dialogueBad: {
      speakerA: "결론이 뭐야? 감정 얘기 빼고 핵심부터 말해.",
      speakerB: "내 감정이 핵심인데 그렇게 차갑게 말하면 대화가 안 돼.",
    },
    dialogueGood: {
      speakerA: "네가 많이 고민한 건 알아. 내가 도와줄 수 있는 구체적 포인트부터 같이 짚어보자.",
      speakerB: "응, 우선 내 기분을 이해해 줬으면 하고 그다음에 해결 방법 같이 정하고 싶어.",
    },
  },
  "ENTJ-INTP": {
    headline: "치밀한 이론과 과감한 실행력이 결합된 최강 브레인 콤비",
    loveSummary:
      "지적 수준과 대화가 잘 맞아 지루할 틈이 없습니다. 서로 독립적인 개인 시간을 존중하며, 감정적 밀당 없이 솔직하고 깔끔한 관계를 선호합니다.",
    workSummary:
      "INTP가 복잡한 문제의 근본 원리와 아키텍처를 설계하고 ENTJ가 이를 사업화·일정화해 끝까지 밀어붙이는 최상위 협업 궁합입니다.",
    conflictTrigger:
      "ENTJ는 빠른 실행과 마감을 재촉하고 INTP는 완벽한 검증이 끝날 때까지 결정을 미루려 해 속도 충돌이 생길 수 있습니다.",
    goldenRule: "최종 완성 전 '80% 기준 1차 실행일'을 함께 정해 INTP의 탐구 시간과 ENTJ의 추진력을 동시에 보장하세요.",
    dialogueBad: {
      speakerA: "언제까지 고민만 할 거야? 일단 오늘 결정하고 움직이자.",
      speakerB: "구조가 틀렸는데 무작정 밀어붙이면 나중에 다 뜯어고쳐야 해.",
    },
    dialogueGood: {
      speakerA: "수요일 오전까지 핵심 리스크 2가지만 검증하고, 오후에 1차 실행안 확정하자.",
      speakerB: "좋아, 그럼 화요일 저녁까지 검증 결과 정리해서 공유할게.",
    },
  },
  "ENTP-INTJ": {
    headline: "천재적 발상과 냉철한 구조화가 만나는 지적 파워 커플",
    loveSummary:
      "둘 다 직관(N)과 사고(T)를 공유해 세상 돌아가는 이야기부터 철학·커리어까지 끝없는 대화가 통합니다. 서로의 능력을 진심으로 존중할 때 깊은 유대감이 형성됩니다.",
    workSummary:
      "ENTP가 기존 틀을 깨는 아이디어를 던지고 INTJ가 장기 로드맵과 실행 우선순위로 정교화하는 혁신 팀 조합입니다.",
    conflictTrigger:
      "둘 다 자기 논리에 확신이 강해 사소한 의견 차이가 자존심 싸움이나 끝없는 토론으로 번지기 쉽습니다.",
    goldenRule: "의견이 부딪히면 '누가 맞나'가 아니라 '작게 실험해 보고 데이터로 확인하자'로 전환하세요.",
    dialogueBad: {
      speakerA: "내 가설이 훨씬 유연하고 가능성 높은데 왜 그렇게 보수적으로 봐?",
      speakerB: "실현 가능성 없는 아이디어는 시간 낭비일 뿐이야.",
    },
    dialogueGood: {
      speakerA: "내 아이디어를 가장 작게 검증할 수 있는 테스트 기준을 네가 잡아줄래?",
      speakerB: "좋아, 비용과 시간 상한선만 정해두면 이번 주에 바로 실험해 보자.",
    },
  },
  "ENFJ-ISFP": {
    headline: "따뜻한 리더십과 부드러운 감성이 어우러지는 힐링 궁합",
    loveSummary:
      "ENFJ의 세심한 챙김과 긍정 에너지가 ISFP를 편안하게 이끌어 주고, ISFP의 꾸밈없는 다정함과 미적 감각이 ENFJ의 지친 마음을 치유합니다.",
    workSummary:
      "ENFJ가 대외 커뮤니케이션과 일정 조율을 맡고 ISFP가 디자인·디테일·현장 감성을 살릴 때 자연스러운 분업이 이루어집니다.",
    conflictTrigger:
      "ENFJ가 선의로 일정을 촘촘히 챙기거나 미래 계획을 자주 묻는 것이 ISFP에게는 은근한 부담이나 통제로 느껴질 수 있습니다.",
    goldenRule: "ENFJ는 ISFP에게 '선택지 2개 중 편한 쪽 고르기'로 여유를 주고, ISFP는 거절하고 싶을 때 미루지 말고 부드럽게 의사 표현하세요.",
    dialogueBad: {
      speakerA: "주말 계획 다 짜놨어! 토요일 아침 9시부터 움직이면 완벽할 거야.",
      speakerB: "어... 좋긴 한데(속으로 너무 빡빡해서 숨 막힘)...",
    },
    dialogueGood: {
      speakerA: "주말에 카페랑 전시 중 하나만 여유롭게 갈까? 네가 당기는 걸로 정하자.",
      speakerB: "그럼 오후에 전시만 보고 근처에서 천천히 산책하고 싶어!",
    },
  },
  "ENFJ-ISTP": {
    headline: "열정적 공감과 쿨한 실용주의가 균형을 맞추는 반전 매력 조합",
    loveSummary:
      "ENFJ는 ISTP의 침착하고 담백한 매력에 안정을 느끼고, ISTP는 ENFJ의 진심 어린 따뜻함에 천천히 마음을 엽니다.",
    workSummary:
      "ENFJ가 사람과 목표를 연결하고 ISTP가 기술적·실무적 문제를 군더더기 없이 해결하는 실속 있는 조합입니다.",
    conflictTrigger:
      "ENFJ는 자주 연락하고 감정을 확인하고 싶어 하지만, ISTP는 용건 없는 잦은 연락이나 감정 토로에 에너지가 빨리 소진됩니다.",
    goldenRule: "연락 빈도 자체보다 '하루 한 번 안부 + 만났을 때 집중하기'처럼 서로 편한 리듬을 미리 합의하세요.",
    dialogueBad: {
      speakerA: "왜 하루 종일 답장이 단답이야? 나한테 마음 식었어?",
      speakerB: "바빠서 핵심만 보낸 건데 왜 그렇게 확대 해석해?",
    },
    dialogueGood: {
      speakerA: "바쁠 땐 짧게 보내도 괜찮아. 대신 퇴근하고 5분만 통화하면 안심될 것 같아.",
      speakerB: "알겠어, 낮엔 짧게 보내고 저녁 9시에 꼭 전화할게.",
    },
  },
  "ENFP-ISTJ": {
    headline: "톡톡 튀는 자유로움과 흔들림 없는 성실함이 만나는 보완 조합",
    loveSummary:
      "ISTJ의 한결같은 책임감과 신뢰가 ENFP의 불안감을 잠재워 주고, ENFP의 생동감과 유머가 ISTJ의 단조로운 일상에 웃음을 더해 줍니다.",
    workSummary:
      "ENFP가 새로운 기회와 콘텐츠 아이디어를 발굴하면 ISTJ가 예산·일정·품질 기준을 지켜 리스크를 최소화합니다.",
    conflictTrigger:
      "ENFP의 즉흥적 약속 변경이나 느슨한 시간 감각이 ISTJ에게는 '나와의 약속을 가볍게 여긴다'는 실망으로 쌓일 수 있습니다.",
    goldenRule: "ENFP는 약속 시간·변경 사항만큼은 철저히 지키고, ISTJ는 계획 외 작은 돌발 이벤트를 '실패'가 아닌 '즐거운 변수'로 열어두세요.",
    dialogueBad: {
      speakerA: "갑자기 분위기 좋은 곳 발견했는데 원래 계획 취소하고 여기 가자!",
      speakerB: "예약까지 다 해놨는데 말도 없이 바꾸면 어떡해.",
    },
    dialogueGood: {
      speakerA: "오늘 예약한 곳 먼저 가고, 저녁 이후 자유 시간엔 내가 찾은 카페 들러볼까?",
      speakerB: "좋아, 핵심 일정만 지키면 그 뒤엔 네가 가고 싶은 데로 가자.",
    },
  },
  "ESFJ-ISFP": {
    headline: "세심한 배려와 온화한 감성이 만나 편안함이 쌓이는 다정 케미",
    loveSummary:
      "두 유형 모두 감정(F)과 감각(S)을 공유해 일상의 소소한 기쁨을 함께 나누기 좋습니다. ESFJ의 알뜰한 챙김과 ISFP의 따뜻한 수용력이 포근한 분위기를 만듭니다.",
    workSummary:
      "팀 내 분위기를 부드럽게 유지하며 실무 디테일과 고객 응대, 디자인·서비스 영역에서 안정적인 호흡을 보입니다.",
    conflictTrigger:
      "ESFJ는 주변 평판과 사회적 기대를 신경 쓰지만, ISFP는 남의 시선보다 자기 페이스를 지키고 싶어 갈등이 생길 수 있습니다.",
    goldenRule: "ESFJ는 '다들 이렇게 해' 대신 내 개인적 바람을 말하고, ISFP는 ESFJ의 챙김에 작은 고마움을 말로 표현해 주세요.",
    dialogueBad: {
      speakerA: "남들 다 챙기는 기념일인데 신경 좀 써주면 안 돼?",
      speakerB: "꼭 남들 기준에 맞춰야 해? 내 방식대로 잘하고 있잖아.",
    },
    dialogueGood: {
      speakerA: "이번 기념일은 내가 특히 기대돼서 같이 맛있는 저녁 먹으면 좋겠어.",
      speakerB: "네가 그렇게 말해줘서 좋다. 식당 분위기 좋은 곳 내가 알아볼게.",
    },
  },
  "ESFP-ISTJ": {
    headline: "든든한 현실 감각과 유쾌한 활력이 만나 균형을 이루는 실속 조합",
    loveSummary:
      "현실 중심의 감각(S)을 공유하면서도 ISTJ의 차분한 계획성과 ESFP의 밝은 사교성이 서로의 부족한 에너지를 완벽하게 메워 줍니다.",
    workSummary:
      "ISTJ가 운영·관리·데이터 기반을 단단히 지키고 ESFP가 현장 소통·영업·분위기 메이킹을 맡으면 최고의 분업이 됩니다.",
    conflictTrigger:
      "돈 쓰임새·주말 휴식 방식(집에서 계획적 휴식 vs 밖에서 즉흥적 만남)에서 생활 패턴 차이가 커질 수 있습니다.",
    goldenRule: "주말 이틀 중 하루는 함께 외출(ESFP 리드), 하루는 각자 휴식·정리(ISTJ 리드)로 나누면 만족도가 높습니다.",
    dialogueBad: {
      speakerA: "주말에 또 집에만 있어? 날씨 좋은데 당장 나가자!",
      speakerB: "평일에 지쳐서 쉬어야 해. 계획 없이 나가는 건 너무 피곤해.",
    },
    dialogueGood: {
      speakerA: "토요일 오후 3시간만 드라이브 가고 일요일은 푹 쉬는 거 어때?",
      speakerB: "시간 정해두고 다녀오는 거면 좋아. 토요일 오후에 같이 나가자.",
    },
  },
  "ESTJ-INFP": {
    headline: "체계적 실행력과 섬세한 감성이 부딪히며 성장하는 도전형 조합",
    loveSummary:
      "초반에는 서로 다른 매력에 강하게 끌리지만, 의사결정 방식(T vs F)과 생활 리듬(J vs P)이 모두 달라 깊은 이해가 필요한 조합입니다. 다름을 인정하면 누구보다 서로를 단단히 보완합니다.",
    workSummary:
      "ESTJ의 명확한 목표·일정 관리와 INFP의 공감형 기획·창의성이 만나면 이상과 현실을 모두 잡을 수 있습니다.",
    conflictTrigger:
      "ESTJ의 직설적 지적이 INFP에게는 큰 상처가 되고, INFP의 감정 중심 설명은 ESTJ에게 핵심이 흐린 변명처럼 들리기 쉽습니다.",
    goldenRule: "대화 전 '지금은 위로가 필요해 / 지금은 해결책이 필요해'를 먼저 합의하는 신호 규칙을 만들어 두세요.",
    dialogueBad: {
      speakerA: "그렇게 우유부단하게 미루니까 일이 계속 밀리는 거야.",
      speakerB: "사람 마음도 모르고 왜 그렇게 공격적으로 몰아붙여?",
    },
    dialogueGood: {
      speakerA: "네가 신중하게 고민하는 건 아는데, 내일 낮까지 결정해야 해서 같이 2가지 안만 비교해 볼까?",
      speakerB: "그렇게 말해줘서 고마워. 내가 걱정되는 부분 1가지만 짚고 바로 정할게.",
    },
  },
  "ESTJ-ISFP": {
    headline: "명확한 추진력과 유연한 감각이 서로를 다듬어 주는 현실 조합",
    loveSummary:
      "ESTJ의 믿음직한 리드가 ISFP에게 안정감을 주고, ISFP의 부드러운 배려와 여유가 ESTJ의 과도한 긴장을 녹여 줍니다.",
    workSummary:
      "ESTJ가 프로젝트 기준과 마감을 관리하고 ISFP가 결과물의 감각적 완성도를 높이는 실무형 파트너십이 잘 맞습니다.",
    conflictTrigger:
      "ESTJ의 단호한 말투와 효율 기준이 ISFP를 위축시키고, ISFP가 속마음을 숨긴 채 거리를 두며 오해가 깊어질 수 있습니다.",
    goldenRule: "ESTJ는 지시 대신 질문형('어떻게 하면 편할까?')을 쓰고, ISFP는 불편한 지점을 참지 말고 짧게라도 바로 알려주세요.",
    dialogueBad: {
      speakerA: "이건 이렇게 하는 게 맞잖아, 왜 자꾸 다른 방식으로 해?",
      speakerB: "알겠어... 네 말대로 할게. (속으로 마음이 닫힘)",
    },
    dialogueGood: {
      speakerA: "결과 목표는 이 기준인데, 진행 방식은 네가 편한 방법대로 해봐도 좋아.",
      speakerB: "고마워, 마감 전에 중간 결과 한 번 보여줄게.",
    },
  },
  "ESTP-ISFJ": {
    headline: "시원한 행동력과 따뜻한 세심함이 만나 안정을 만드는 반전 케미",
    loveSummary:
      "ISFJ의 헌신적이고 꼼꼼한 배려가 ESTP에게 진정한 안식처가 되고, ESTP의 자신감과 유쾌한 리드가 ISFJ의 걱정을 덜어 줍니다.",
    workSummary:
      "ESTP가 영업·협상·현장 돌파를 이끌고 ISFJ가 사후 관리·고객 케어·문서 정리를 완벽히 뒷받침합니다.",
    conflictTrigger:
      "ESTP의 즉흥적 결정과 직설적 표현이 세심한 ISFJ에게 불안감과 서운함을 줄 수 있습니다.",
    goldenRule: "ESTP는 중요한 일정·지출 결정 전에 ISFJ에게 먼저 상의하고, ISFJ는 ESTP의 솔직한 표현을 악의로 오해하지 않도록 확인 질문을 하세요.",
    dialogueBad: {
      speakerA: "갑자기 친구들 부르기로 했어! 오늘 저녁 같이 먹자.",
      speakerB: "미리 말도 없이 갑자기 그러면 내가 준비도 못 하고 부담스러워...",
    },
    dialogueGood: {
      speakerA: "이번 주 금요일에 친구들 잠깐 볼까 하는데, 너 편할 것 같아?",
      speakerB: "미리 물어봐 줘서 고마워! 금요일이면 나도 여유 있어서 괜찮아.",
    },
  },
  "INFJ-INTJ": {
    headline: "깊은 직관과 고요한 집중력을 공유하는 성숙한 영혼의 조합",
    loveSummary:
      "두 사람 모두 내향(I)·직관(N)·판단(J)을 공유해 말수가 많지 않아도 서로의 깊은 생각을 놀라울 만큼 정확히 이해합니다. 조용하지만 단단한 신뢰가 쌓이는 조합입니다.",
    workSummary:
      "장기 전략 수립, 리서치, 콘텐츠 아키텍처 설계처럼 깊이 있는 집중이 필요한 프로젝트에서 최상위 완성도를 냅니다.",
    conflictTrigger:
      "둘 다 자기 내면의 기준이 확고하고 감정을 밖으로 쉽게 드러내지 않아, 서운함이 쌓이면 소리 없이 멀어질 위험이 있습니다.",
    goldenRule: "어색하더라도 일주일에 한 번은 서로 고마웠던 점과 아쉬웠던 점을 짧게 공유하는 대화 루틴을 두세요.",
    dialogueBad: {
      speakerA: "(속으로 실망했지만 말하지 않고 거리를 둠)",
      speakerB: "(분위기가 이상하지만 논리적 이유가 없으니 먼저 묻지 않음)",
    },
    dialogueGood: {
      speakerA: "요즘 우리 둘 다 바빠서 대화가 줄어든 것 같아. 이번 주말엔 차 마시며 근황 얘기하자.",
      speakerB: "좋은 생각이야. 나도 네 생각 듣고 싶었어.",
    },
  },
  "INFJ-INFP": {
    headline: "서로의 감정을 섬세하게 어루만져 주는 깊은 공감 파트너",
    loveSummary:
      "감정선과 가치관이 깊이 맞닿아 있어 '내 마음을 진짜 이해해 주는 사람'이라는 안도감을 줍니다. 예술·책·철학 같은 내면 대화가 풍성합니다.",
    workSummary:
      "공감 기반 브랜딩, 상담, 글쓰기, 교육 콘텐츠에서 뛰어난 시너지를 냅니다. 마감과 현실적 예산 관리는 별도 체크리스트로 보완하세요.",
    conflictTrigger:
      "두 사람 모두 상대를 배려하느라 불만을 삼키다가, 어느 날 한꺼번에 감정적으로 소진되기 쉽습니다.",
    goldenRule: "'서운함은 미움이 아니라 더 잘 지내고 싶다는 신호'로 약속하고 작은 불편을 제때 나누세요.",
    dialogueBad: {
      speakerA: "너 힘들까 봐 말 안 했는데, 사실 저번부터 계속 신경 쓰였어...",
      speakerB: "나도 네 눈치 보느라 말 못 했어...",
    },
    dialogueGood: {
      speakerA: "우리가 더 편해지고 싶어서 말하는 건데, 약속 전날엔 한 번만 확인 연락 주면 좋겠어.",
      speakerB: "말해줘서 고마워! 앞으로 전날 저녁에 꼭 먼저 연락할게.",
    },
  },
  "INFP-INTJ": {
    headline: "차분한 진정성과 깊은 내면 세계가 서로를 매료시키는 조합",
    loveSummary:
      "겉보기엔 차가운 INTJ와 따뜻한 INFP지만, 둘 다 진정성 없는 가벼운 관계를 싫어하고 소수의 깊은 인연을 소중히 여긴다는 공통점이 있습니다.",
    workSummary:
      "INFP의 사람 중심 통찰과 INTJ의 냉철한 구조 설계가 만나면 깊이 있고 설득력 높은 결과물이 탄생합니다.",
    conflictTrigger:
      "INTJ가 감정을 배제한 객관적 조언을 할 때 INFP는 '내 마음을 부정당했다'고 느끼기 쉽습니다.",
    goldenRule: "INTJ는 해결책보다 '네 입장에선 충분히 그럴 수 있어'를 먼저 건네고, INFP는 INTJ의 조언을 애정 표현으로 이해해 보세요.",
    dialogueBad: {
      speakerA: "그건 네가 감정적으로 반응해서 커진 문제야.",
      speakerB: "넌 항상 내가 틀렸다는 식으로만 말하더라.",
    },
    dialogueGood: {
      speakerA: "그 상황이면 속상할 만해. 조금 진정되면 다음에 덜 힘든 방법 같이 찾아보자.",
      speakerB: "내 기분 먼저 이해해 줘서 고마워. 이제 같이 정리해 보고 싶어.",
    },
  },
  "INFP-ISFJ": {
    headline: "조용한 다정함과 꾸준한 진심이 쌓이는 포근한 관계",
    loveSummary:
      "둘 다 상대를 배려하고 다툼을 피하려는 온화한 성향이라 자극적인 갈등 없이 잔잔하고 따뜻한 신뢰를 쌓아갑니다.",
    workSummary:
      "ISFJ의 꼼꼼한 실행·관리와 INFP의 창의적 기획이 조용하지만 안정적인 성과를 만들어 냅니다.",
    conflictTrigger:
      "ISFJ는 구체적인 행동과 루틴으로 사랑을 확인하고, INFP는 정서적 의미와 자유로운 표현을 중시해 서운함이 조용히 쌓일 수 있습니다.",
    goldenRule: "서로 '괜찮아' 뒤에 숨은 진짜 바람을 한 문장씩 더 덧붙여 말하는 습관을 들이세요.",
    dialogueBad: {
      speakerA: "괜찮아, 신경 쓰지 마. (사실 많이 서운함)",
      speakerB: "응, 다행이다! (정말 괜찮은 줄 앎)",
    },
    dialogueGood: {
      speakerA: "큰일은 아닌데, 다음엔 내가 준비한 걸 짧게라도 칭찬해 주면 힘이 날 것 같아.",
      speakerB: "알려줘서 고마워! 표현을 더 자주 하려고 신경 쓸게.",
    },
  },
  "INFP-ISTJ": {
    headline: "자유로운 상상력과 묵직한 신뢰가 만나는 차분한 보완 관계",
    loveSummary:
      "ISTJ의 변함없는 성실함이 INFP에게 든든한 울타리가 되고, INFP의 따뜻한 감성이 ISTJ의 굳어 있던 마음을 부드럽게 열어 줍니다.",
    workSummary:
      "아이디어와 브랜드 감성은 INFP가, 프로세스 검증과 마감 관리는 ISTJ가 맡으면 빈틈이 줄어듭니다.",
    conflictTrigger:
      "INFP의 유연한 생활 리듬과 감정 중심 대화가 ISTJ에게는 비효율적으로 보이고, ISTJ의 원칙주의가 INFP에게는 답답하게 느껴질 수 있습니다.",
    goldenRule: "생활 규칙은 꼭 필요한 3가지만 정하고, 그 외 영역은 서로의 방식을 존중하는 경계를 세우세요.",
    dialogueBad: {
      speakerA: "약속은 약속인데 왜 매번 기분에 따라 바뀌어?",
      speakerB: "상황이 바뀌었는데 왜 그렇게 융통성이 없어?",
    },
    dialogueGood: {
      speakerA: "시간·예산 두 가지만 고정하고, 세부 코스는 그날 기분에 맞춰 정하자.",
      speakerB: "그 방식 너무 좋다! 시간은 내가 꼭 맞춰서 준비할게.",
    },
  },
  "INFP-INFP": {
    headline: "말하지 않아도 감정의 결이 닮아 있는 쌍둥이 감성 조합",
    loveSummary:
      "서로의 섬세함과 이상을 온전히 이해해 주는 편안함이 큽니다. 취향과 감성을 공유할 때 깊은 친밀감이 빠르게 형성됩니다.",
    workSummary:
      "창의적 콘텐츠·스토리텔링에는 강하지만, 현실적 마감·우선순위 결정이 미뤄지지 않도록 외부 도구나 일정표를 활용해야 합니다.",
    conflictTrigger:
      "둘 다 갈등을 피하려 속으로 삭이다가 오해가 커지거나, 현실적인 결정을 서로 미루다 지칠 수 있습니다.",
    goldenRule: "결정이 필요한 날엔 '이번 주는 A가 정하고 다음 주는 B가 정하기'처럼 결정 담당을 번갈아 맡아보세요.",
    dialogueBad: {
      speakerA: "난 아무거나 다 좋아, 네가 먹고 싶은 걸로 해.",
      speakerB: "나도 진짜 괜찮아, 네가 정해줘...",
    },
    dialogueGood: {
      speakerA: "오늘은 내가 후보 2개 고를게, 네가 그중 하나만 골라줘!",
      speakerB: "좋아, 그럼 2번 파스타로 가자!",
    },
  },
  "ENFP-ENFP": {
    headline: "만나기만 하면 에너지가 두 배로 터지는 유쾌한 시너지 조합",
    loveSummary:
      "웃음과 새로운 아이디어가 끊이지 않아 친구처럼 설레는 연애를 합니다. 서로의 꿈과 도전을 누구보다 열정적으로 응원해 줍니다.",
    workSummary:
      "브레인스토밍·마케팅·콘텐츠 기획력은 최상급이지만, 마무리와 디테일 검수를 위한 체크리스트 시스템이 필수입니다.",
    conflictTrigger:
      "감정 기복이 겹치거나 두 사람 모두 즉흥적으로 움직이다 일정·약속이 엉킬 때 피로감이 커질 수 있습니다.",
    goldenRule: "신나는 아이디어가 떠올라도 실행 전 '이번 주 딱 1가지만 끝내기' 원칙을 함께 지키세요.",
    dialogueBad: {
      speakerA: "이것도 하고 저것도 하자! 아 근데 저번에 하기로 한 건 아직 못 했네...",
      speakerB: "맞아 나도 까먹었다 ㅋㅋ 다음 주에 한꺼번에 하자!",
    },
    dialogueGood: {
      speakerA: "아이디어 메모해 두고, 오늘은 원래 정한 1가지만 먼저 끝내고 축하하자!",
      speakerB: "오케이! 이거 끝내고 바로 다음 거 기획하자!",
    },
  },
  "ENFJ-ENTP": {
    headline: "사람을 이끄는 카리스마와 틀을 깨는 창의력이 만나는 역동 조합",
    loveSummary:
      "둘 다 외향(E)과 직관(N)을 공유해 대화가 빠르고 에너지가 넘칩니다. ENFJ의 따뜻한 리더십과 ENTP의 재치 있는 시각이 서로에게 큰 자극이 됩니다.",
    workSummary:
      "신사업·마케팅·커뮤니티 운영에서 기획(ENTP)과 조직화·설득(ENFJ)이 완벽하게 맞물립니다.",
    conflictTrigger:
      "ENFJ는 관계의 화합을 중시하는 반면, ENTP는 때로 도발적인 농담이나 반론을 던져 ENFJ를 당황시킬 수 있습니다.",
    goldenRule: "ENTP는 농담 뒤에 진심 어린 존중을 덧붙이고, ENFJ는 ENTP의 장난스러운 반론을 애정 섞인 대화 방식으로 받아들여 보세요.",
    dialogueBad: {
      speakerA: "굳이 그렇게까지 남들 눈치 보며 다 맞춰줄 필요 있어?",
      speakerB: "눈치 보는 게 아니라 서로 배려하는 건데 왜 그렇게 비꼬아?",
    },
    dialogueGood: {
      speakerA: "네가 주변 잘 챙기는 건 멋진데, 네 에너지가 너무 소진될까 봐 걱정돼서 그래.",
      speakerB: "그렇게 말해줘서 고마워. 오늘은 내 컨디션도 같이 챙길게.",
    },
  },
  "ENFP-ENTP": {
    headline: "아이디어가 폭발하고 지루할 틈이 없는 무한 상상력 콤비",
    loveSummary:
      "호기심과 자유로움을 공유해 어떤 주제로든 대화가 끝없이 이어집니다. 서로를 구속하지 않고 새로운 경험을 함께 탐험할 때 가장 빛납니다.",
    workSummary:
      "초기 콘셉트 발굴과 트렌드 캐치 능력은 압도적입니다. 실행 단계에서는 정량 목표와 마감 알림을 활용하면 성과가 극대화됩니다.",
    conflictTrigger:
      "ENFP의 가치관·감정 기준과 ENTP의 객관적·장난기 섞인 논리가 부딪힐 때 의외로 예민해질 수 있습니다.",
    goldenRule: "가치관이 걸린 진지한 주제일 때는 장난 모드를 끄고 진심으로 경청하는 신호를 주고받으세요.",
    dialogueBad: {
      speakerA: "너는 진지한 얘기할 때도 꼭 장난으로 넘기더라.",
      speakerB: "분위기 풀려고 한 건데 왜 갑자기 정색해?",
    },
    dialogueGood: {
      speakerA: "지금 하는 얘기는 나한테 꽤 진지한 고민이야. 진지 모드로 들어줄래?",
      speakerB: "알겠어, 장난 빼고 제대로 들을게. 편하게 말해 봐.",
    },
  },
  "ESFJ-ISTP": {
    headline: "따뜻한 돌봄과 담백한 해결력이 조화를 이루는 생활 밀착 조합",
    loveSummary:
      "ESFJ가 세심하게 일상을 챙기면 ISTP가 실질적인 문제 해결과 묵직한 행동으로 보답합니다. 겉표현은 다르지만 현실 감각(S)이 잘 맞습니다.",
    workSummary:
      "ESFJ가 사람·일정·고객 소통을 이끌고 ISTP가 기술·설비·실무 트러블슈팅을 책임지는 이상적 분업 구조입니다.",
    conflictTrigger:
      "ESFJ는 감정 교류와 모임을 원하지만, ISTP는 혼자만의 취미 시간과 정적을 꼭 필요로 해 서운함이 생길 수 있습니다.",
    goldenRule: "ESFJ는 ISTP의 혼자 있는 시간을 '나를 싫어해서'가 아닌 '충전 시간'으로 존중하고, ISTP는 충전 후 먼저 안부를 건네세요.",
    dialogueBad: {
      speakerA: "주말에 같이 가족 모임 가기로 했잖아, 왜 자꾸 빠지려 해?",
      speakerB: "사람 많은 데 오래 있으면 기 빨려서 힘들어.",
    },
    dialogueGood: {
      speakerA: "식사 2시간만 같이 하고, 그 뒤엔 네 개인 시간 편하게 보내도 돼.",
      speakerB: "그 정도면 충분히 같이 갈 수 있어. 챙겨줘서 고마워.",
    },
  },
  "ESTJ-ISTJ": {
    headline: "약속과 책임감으로 완벽한 신뢰를 쌓는 안정감 최강 조합",
    loveSummary:
      "감정 기복이나 변덕이 적고 말과 행동이 일치해 안정적인 장기 연애·결혼 궁합으로 꼽힙니다. 서로의 성실함을 깊이 인정합니다.",
    workSummary:
      "명확한 기준, 기한 준수, 높은 품질 관리로 어떤 프로젝트든 가장 안정적으로 완수하는 신뢰도 1위 팀입니다.",
    conflictTrigger:
      "둘 다 원칙과 자기 방식에 확신이 강해 사소한 생활 규칙에서 한 치도 물러서지 않는 팽팽한 기싸움이 생길 수 있습니다.",
    goldenRule: "'효율'만큼 '분위기와 여백'도 중요한 목표에 포함하고, 사소한 취향 영역은 서로 간섭하지 마세요.",
    dialogueBad: {
      speakerA: "정리는 원래 이 순서대로 해야 안 꼬이지.",
      speakerB: "내 방식이 더 빠른데 왜 네 기준을 강요해?",
    },
    dialogueGood: {
      speakerA: "공용 공간 규칙만 같이 맞추고, 각자 영역은 편한 방식대로 하자.",
      speakerB: "그게 제일 깔끔하고 효율적이네. 동의해.",
    },
  },
  "ISFJ-ISTJ": {
    headline: "조용하지만 가장 단단하고 오래가는 신뢰 중심 파트너",
    loveSummary:
      "두 사람 모두 내향(I)·감각(S)·판단(J)을 공유해 생활 리듬과 가치관이 매우 잘 맞습니다. 화려한 이벤트보다 일상의 꾸준한 성실함으로 깊은 사랑을 증명합니다.",
    workSummary:
      "꼼꼼한 실무 수행, 안정적 운영, 세심한 리스크 관리에서 최고의 팀워크를 발휘합니다.",
    conflictTrigger:
      "ISTJ의 사실 중심 말투가 ISFJ에게 다소 차갑게 들릴 수 있고, 변화가 필요한 시점에 두 사람 모두 결정을 보수적으로 미룰 수 있습니다.",
    goldenRule: "ISTJ는 고마움과 애정을 평소보다 한 번 더 말로 표현하고, ISFJ는 부탁할 일이 있을 때 혼자 떠안지 말고 분명히 요청하세요.",
    dialogueBad: {
      speakerA: "괜찮아, 내가 다 할게. (속으로 지치고 서운함)",
      speakerB: "알겠어, 수고해. (정말 괜찮은 줄 알고 맡김)",
    },
    dialogueGood: {
      speakerA: "이번 주엔 내가 바빠서 장보기는 네가 맡아주면 정말 고마울 것 같아.",
      speakerB: "미리 말해줘서 고마워. 퇴근길에 목록 보고 사 갈게.",
    },
  },
  "ESTP-INFJ": {
    headline: "정반대의 세계가 만나 시야를 넓혀 주는 강렬한 성장 조합",
    loveSummary:
      "생각이 많은 INFJ를 ESTP가 현재의 활력으로 끌어내 주고, 앞만 보고 달리는 ESTP에게 INFJ가 깊은 의미와 배려를 일깨워 줍니다.",
    workSummary:
      "INFJ의 장기 비전·브랜드 철학과 ESTP의 현장 돌파·세일즈 역량이 결합하면 강력한 추진력이 생깁니다.",
    conflictTrigger:
      "속도와 깊이의 차이(즉각 행동 vs 신중한 숙고)로 인해 서로를 '경솔하다 / 너무 복잡하다'고 오해하기 쉽습니다.",
    goldenRule: "빠른 실행이 필요한 일은 ESTP의 감각을 믿고, 장기 방향이나 사람 문제는 INFJ의 통찰을 존중하는 역할 분담이 효과적입니다.",
    dialogueBad: {
      speakerA: "고민만 하다 기회 다 놓쳐! 일단 해보고 수정하면 되잖아.",
      speakerB: "앞뒤도 안 재고 뛰어들었다가 생길 후폭풍은 생각 안 해?",
    },
    dialogueGood: {
      speakerA: "내가 빠르게 움직여 볼 테니, 꼭 피해야 할 리스크 2가지만 짚어줄래?",
      speakerB: "좋아, 이 두 가지만 지키면 나머지는 네 추진력 믿고 가보자.",
    },
  },
  "INTJ-INTP": {
    headline: "깊은 사유와 독립성을 존중하는 조용한 천재 조합",
    loveSummary:
      "서로의 혼자만의 시간을 자연스럽게 이해하고, 감정적 간섭 없이 지적인 대화를 나누며 편안한 유대감을 쌓습니다.",
    workSummary:
      "고난도 문제 해결, 기술 연구, 데이터 분석 분야에서 INTP의 탐색력과 INTJ의 구조화 능력이 빛을 발합니다.",
    conflictTrigger:
      "둘 다 감정 표현이 서툴고 일상적인 연락·애정 확인이 줄어들면서 어느새 동료처럼 데면데면해질 수 있습니다.",
    goldenRule: "거창한 이벤트 대신 '주 1회 산책·식사 데이트'처럼 가볍고 고정된 함께하는 시간을 확보하세요.",
    dialogueBad: {
      speakerA: "굳이 말 안 해도 서로 아는 거 아니야?",
      speakerB: "그렇긴 한데, 가끔은 내가 소중한지 잘 모르겠어.",
    },
    dialogueGood: {
      speakerA: "표현이 서툴지만 너랑 대화할 때 제일 편하고 고마워.",
      speakerB: "그 말 들으니까 확실히 안심된다. 나도 그래.",
    },
  },
  "ENFJ-ENFP": {
    headline: "사람을 사랑하는 따뜻한 열정이 만나 밝은 시너지를 내는 조합",
    loveSummary:
      "풍부한 감정 표현과 진심 어린 응원이 오가며, 함께 있으면 주변까지 밝아지는 긍정적인 연애를 합니다.",
    workSummary:
      "교육·콘텐츠·커뮤니티·브랜딩 분야에서 ENFP의 기발한 아이디어와 ENFJ의 구조화된 전달력이 잘 어우러집니다.",
    conflictTrigger:
      "ENFJ의 계획성과 ENFP의 즉흥성이 어긋나거나, 둘 다 주변 사람을 챙기느라 정작 둘만의 휴식을 놓치기 쉽습니다.",
    goldenRule: "남들 챙기는 일정만큼 '우리 둘만 쉬는 비워둔 날'을 달력에 먼저 표시해 두세요.",
    dialogueBad: {
      speakerA: "우리 오늘 이 순서대로 가기로 했는데 또 중간에 샜잖아!",
      speakerB: "가는 길에 너무 재밌어 보이는 게 있어서 잠깐 들른 건데 왜 예민해?",
    },
    dialogueGood: {
      speakerA: "핵심 목적지 1곳만 먼저 찍고, 그다음엔 네가 발견하는 대로 자유롭게 돌아다니자!",
      speakerB: "완전 좋아! 그럼 첫 코스부터 딱 맞춰서 출발할게.",
    },
  },
  "INTP-ISFJ": {
    headline: "객관적 탐구심과 따뜻한 실용 배려가 만나는 잔잔한 보완 조합",
    loveSummary:
      "ISFJ의 세심한 일상 케어가 현실 관리에 서툰 INTP에게 큰 힘이 되고, INTP의 편견 없는 시선과 유머가 ISFJ의 긴장을 풀어 줍니다.",
    workSummary:
      "INTP가 원리 분석·시스템 개선을 맡고 ISFJ가 안정적 운영과 사람 케어를 챙길 때 탄탄한 결과를 냅니다.",
    conflictTrigger:
      "ISFJ는 따뜻한 공감과 일상 공유를 원하지만, INTP는 생각에 빠지면 주변 신호를 놓쳐 무심하게 보일 수 있습니다.",
    goldenRule: "INTP는 하루 10분이라도 휴대폰을 내려놓고 ISFJ의 하루 이야기를 경청하고, ISFJ는 원하는 배려를 명확히 말해 주세요.",
    dialogueBad: {
      speakerA: "오늘 하루 어땠는지 물어봤는데 왜 계속 딴생각만 해?",
      speakerB: "아, 미안. 방금 떠오른 아이디어 정리하느라 못 들었어.",
    },
    dialogueGood: {
      speakerA: "지금 10분만 내 얘기 들어줄 수 있어? 오늘 있었던 일 공유하고 싶어.",
      speakerB: "응! 하던 거 잠깐 멈추고 지금 집중해서 들을게.",
    },
  },
  "ENTP-ESFJ": {
    headline: "유쾌한 창의력과 따뜻한 사교력이 만나는 활기찬 조합",
    loveSummary:
      "둘 다 외향(E)이라 데이트와 모임이 즐겁습니다. ESFJ의 세심한 배려가 ENTP를 챙겨 주고, ENTP의 재치와 새로운 시각이 ESFJ에게 활력을 줍니다.",
    workSummary:
      "ENTP가 새로운 기획과 차별화 포인트를 만들면 ESFJ가 팀워크와 고객 만족으로 꼼꼼하게 마무리합니다.",
    conflictTrigger:
      "ESFJ는 전통·예의·주변 조화를 중시하지만, ENTP는 관습에 의문을 제기하고 직설적으로 말해 갈등이 생길 수 있습니다.",
    goldenRule: "ENTP는 ESFJ가 소중히 여기는 기념일·관계 예의를 존중하고, ESFJ는 ENTP의 파격적인 생각을 개성으로 인정해 주세요.",
    dialogueBad: {
      speakerA: "왜 굳이 형식적인 모임에 다 참석해야 해? 비효율적이잖아.",
      speakerB: "사람 관계가 효율만 따지는 건 아니잖아, 내가 중요하게 생각하는 자리야.",
    },
    dialogueGood: {
      speakerA: "네가 소중하게 여기는 자리니까 같이 갈게. 대신 끝나고 우리 둘만의 시간도 갖자.",
      speakerB: "고마워! 끝나면 네가 좋아하는 곳에서 편하게 쉬자.",
    },
  },
};

export const CURATED_PAIR_KEYS = Object.keys(CURATED_PAIR_MAP);

export function computeCompatibilityScore(codeA: MBTICode, codeB: MBTICode): number {
  const canonical = toCanonicalPair(codeA, codeB)!;
  const typeA = mbtiTypes[codeA];
  const typeB = mbtiTypes[codeB];

  // mbtiTypes.ts에 명시된 최고 궁합 여부 우선 반영
  const mutualBest = typeA.compatible.includes(codeB) && typeB.compatible.includes(codeA);
  const oneWayBest = typeA.compatible.includes(codeB) || typeB.compatible.includes(codeA);

  if (mutualBest && codeA !== codeB) return 95;
  if (mutualBest && codeA === codeB) return 86;
  if (oneWayBest) return 88;

  // 4개 지표 조합 기반 균형 점수 계산 (인지 기능 보완성 반영)
  const sameE = codeA[0] === codeB[0];
  const sameN = codeA[1] === codeB[1];
  const sameT = codeA[2] === codeB[2];
  const sameJ = codeA[3] === codeB[3];

  let score = 68;
  if (sameN) score += 12; // S/N 인식축 일치는 일상 대화의 핵심
  if (!sameE) score += 5; // E/I 상호 보완
  if (sameT) score += 6;  // T/F 가치 판단 일치
  if (!sameJ && sameN) score += 4;
  if (sameJ && !sameN) score += 4;
  if (!sameN && !sameT && !sameJ) score -= 8; // 3개 핵심 축 동시 충돌 시 노력 필요

  // 결정적 미세 편차(동일 점수 획일화 방지)
  const hash = canonical.split("").reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
  score += (hash % 5) - 2;

  return Math.max(58, Math.min(96, score));
}

export function getCompatibilityTier(score: number): {
  tier: CompatibilityTier;
  label: string;
  emoji: string;
  badgeClass: string;
  cellClass: string;
} {
  if (score >= 90) {
    return {
      tier: "BEST",
      label: "최고의 궁합",
      emoji: "💖",
      badgeClass: "bg-rose-100 text-rose-700 border-rose-200",
      cellClass: "bg-rose-100 text-rose-700 hover:bg-rose-200",
    };
  }
  if (score >= 80) {
    return {
      tier: "GOOD",
      label: "좋은 궁합",
      emoji: "✨",
      badgeClass: "bg-emerald-100 text-emerald-700 border-emerald-200",
      cellClass: "bg-emerald-100 text-emerald-700 hover:bg-emerald-200",
    };
  }
  if (score >= 70) {
    return {
      tier: "BALANCED",
      label: "무난·균형 궁합",
      emoji: "🤝",
      badgeClass: "bg-blue-100 text-blue-700 border-blue-200",
      cellClass: "bg-blue-50 text-blue-700 hover:bg-blue-100",
    };
  }
  return {
    tier: "CHALLENGE",
    label: "노력·성장형 궁합",
    emoji: "🌱",
    badgeClass: "bg-amber-100 text-amber-700 border-amber-200",
    cellClass: "bg-amber-50 text-amber-700 hover:bg-amber-100",
  };
}

function buildAxisComparisons(codeA: MBTICode, codeB: MBTICode): AxisComparison[] {
  const sameE = codeA[0] === codeB[0];
  const sameN = codeA[1] === codeB[1];
  const sameT = codeA[2] === codeB[2];
  const sameJ = codeA[3] === codeB[3];

  return [
    {
      axisName: "에너지 방향 (E/I)",
      letterA: codeA[0],
      letterB: codeB[0],
      isSame: sameE,
      summary: sameE
        ? codeA[0] === "E"
          ? "두 사람 모두 외부 활동과 대화에서 활력을 얻어 데이트와 모임 템포가 잘 맞습니다."
          : "두 사람 모두 조용한 휴식과 개인 공간을 존중해 편안하고 안정적인 리듬을 유지합니다."
        : "외향(E)의 추진력과 내향(I)의 깊이가 만나 서로의 활동 범위를 넓혀 줍니다.",
      tip: sameE
        ? codeA[0] === "E"
          ? "바쁜 일정 속에서도 두 사람만의 깊은 대화 시간을 따로 확보하세요."
          : "서로 먼저 연락하기를 기다리다 멀어지지 않도록 가벼운 안부를 먼저 건네세요."
        : "외출 후 휴식 시간과 만남 빈도에 대한 기준을 미리 맞춰 두면 피로가 줄어듭니다.",
    },
    {
      axisName: "정보 인식 (S/N)",
      letterA: codeA[1],
      letterB: codeB[1],
      isSame: sameN,
      summary: sameN
        ? codeA[1] === "S"
          ? "구체적인 사실과 현실 경험을 중심으로 대화해 실생활·약속에서 오해가 적습니다."
          : "큰 그림과 의미, 미래 가능성을 함께 상상하며 깊이 있는 대화를 즐깁니다."
        : "감각형(S)의 현실 디테일과 직관형(N)의 아이디어·맥락이 서로의 사각지대를 채워 줍니다.",
      tip: sameN
        ? codeA[1] === "S"
          ? "가끔은 일상에서 벗어나 새로운 취미나 장기 목표도 함께 이야기해 보세요."
          : "아이디어 대화 뒤에는 날짜·예산 같은 현실 실행 항목을 1~2개 꼭 적어 두세요."
        : "N형은 결론과 구체적 예시를 먼저 말하고, S형은 아이디어를 바로 자르지 말고 취지부터 들어주세요.",
    },
    {
      axisName: "판단 기준 (T/F)",
      letterA: codeA[2],
      letterB: codeB[2],
      isSame: sameT,
      summary: sameT
        ? codeA[2] === "T"
          ? "객관적 사실과 논리로 깔끔하게 소통해 감정 소모가 적은 쿨한 관계를 만듭니다."
          : "서로의 감정과 관계를 최우선으로 배려해 따뜻하고 다정한 분위기가 형성됩니다."
        : "사고형(T)의 냉철한 문제 해결력과 감정형(F)의 정서적 공감이 균형을 이룹니다.",
      tip: sameT
        ? codeA[2] === "T"
          ? "맞고 틀림을 가리기 전에 서로의 수고와 고마움을 말로 표현하는 연습을 하세요."
          : "상처를 피하려 핵심 문제를 돌려 말하기보다 부드럽고 명확하게 요청해 보세요."
        : "힘든 일을 털어놓을 때 '지금은 공감이 필요해 / 해결책이 필요해'를 먼저 알려주면 오해가 사라집니다.",
    },
    {
      axisName: "생활 양식 (J/P)",
      letterA: codeA[3],
      letterB: codeB[3],
      isSame: sameJ,
      summary: sameJ
        ? codeA[3] === "J"
          ? "계획과 약속을 중요하게 여겨 일정·여행·협업에서 예측 가능성과 신뢰도가 높습니다."
          : "유연하고 즉흥적인 흐름을 즐겨 틀에 얽매이지 않는 자유로운 시간을 보냅니다."
        : "판단형(J)의 체계적인 정리력과 인식형(P)의 유연한 임기응변이 상호 보완됩니다.",
      tip: sameJ
        ? codeA[3] === "J"
          ? "서로의 방식이 다를 때 유연성을 조금만 열어두면 불필요한 기싸움을 피할 수 있습니다."
          : "예약이 필수인 핵심 일정 1~2개만 미리 확정해 두면 현장 변수가 줄어듭니다."
        : "핵심 일정(앵커)은 J형이 확정하고, 중간 자유 시간(블록)은 P형이 리드하는 분담이 효과적입니다.",
    },
  ];
}

export function getCompatibilityReport(codeA: MBTICode, codeB: MBTICode): CompatibilityReport {
  const canonical = toCanonicalPair(codeA, codeB)!;
  const [a, b] = canonical.split("-") as [MBTICode, MBTICode];
  const typeA = mbtiTypes[a];
  const typeB = mbtiTypes[b];
  const score = computeCompatibilityScore(a, b);
  const tierMeta = getCompatibilityTier(score);

  const gA = getTemperament(a);
  const gB = getTemperament(b);
  const tempKey = gA <= gB ? `${gA}-${gB}` : `${gB}-${gA}`;
  const tempInfo = TEMPERAMENT_DYNAMICS[tempKey];

  const curatedExtra = CURATED_PAIR_MAP[canonical];
  const axisComparisons = buildAxisComparisons(a, b);
  const sameAxes = axisComparisons.filter((x) => x.isSame);
  const diffAxes = axisComparisons.filter((x) => !x.isSame);

  const headline =
    curatedExtra?.headline ||
    `${a}(${typeA.title})와 ${b}(${typeB.title})의 ${tierMeta.label} — ${tempInfo.title}`;

  const overview =
    a === b
      ? `${a}(${typeA.title}) 두 사람이 만나면 사고방식과 생활 리듬이 닮아 처음부터 높은 친밀감과 편안함을 느낍니다. 다만 같은 강점을 공유하는 만큼 비슷한 약점(${typeA.weaknesses.slice(0, 2).join(", ")})도 함께 나타날 수 있어 의식적인 균형이 중요합니다.`
      : `${a}(${typeA.title})와 ${b}(${typeB.title})는 4가지 성격 지표 중 ${sameAxes.length}개 축을 공유하고 ${diffAxes.length}개 축에서 서로 다른 매력을 지닌 조합입니다. ${tempInfo.description}`;

  const loveGuide =
    curatedExtra?.loveSummary ||
    `${a}는 ${typeA.relationships.split(".")[0]}. 반면 ${b}는 ${typeB.relationships.split(".")[0]}. 두 사람이 연애할 때는 ${
      sameAxes.length >= 2
        ? "공유하는 성향을 바탕으로 빠르게 친해지되, 다른 축에서 생기는 표현 방식의 차이를 '무관심'이 아닌 '개성'으로 이해하는 태도가 핵심입니다."
        : "서로에게 없는 장점에 강하게 끌리는 만큼, 연락 빈도·갈등 대화 방식·데이트 계획에 대한 기대치를 초반에 솔직히 맞춰 두면 훨씬 안정적인 관계로 발전합니다."
    }`;

  const workGuide =
    curatedExtra?.workSummary ||
    `직장과 협업에서는 ${a}의 강점(${typeA.strengths.slice(0, 2).join("·")})과 ${b}의 강점(${typeB.strengths.slice(0, 2).join("·")})을 역할로 분리할 때 최고의 시너지가 납니다. ${
      typeA.workplace.split(".")[0]
    }. ${typeB.workplace.split(".")[0]}.`;

  const conflictPoints = [
    ...(curatedExtra ? [curatedExtra.conflictTrigger] : []),
    ...diffAxes.map((ax) => `${ax.axisName} 차이: ${ax.summary}`),
    ...(diffAxes.length === 0
      ? [
          `동일 유형 특성상 '${typeA.weaknesses[0]}'과 '${typeA.weaknesses[1]}'이 동시에 겹치면 해결을 미루기 쉽습니다.`,
        ]
      : []),
  ].slice(0, 4);

  const practicalTips = [
    ...(curatedExtra ? [curatedExtra.goldenRule] : []),
    ...axisComparisons.map((ax) => `${ax.axisName} 팁 — ${ax.tip}`),
  ].slice(0, 4);

  const faqs = [
    {
      q: `${a}와 ${b}의 연애 궁합 점수는 어느 정도인가요?`,
      a: `MBTI 선호 지표와 기질 역학을 기준으로 ${score}점(${tierMeta.label})입니다. 점수는 성향의 자연스러운 호흡을 보여주는 참고 지표이며, 실제 관계의 만족도는 서로의 차이를 존중하는 소통 습관에 따라 크게 달라집니다.`,
    },
    {
      q: `${a}와 ${b}가 싸웠을 때 가장 빨리 화해하는 방법은 무엇인가요?`,
      a: curatedExtra
        ? curatedExtra.goldenRule
        : `${a}와 ${b}는 ${
            diffAxes.length > 0 ? diffAxes.map((d) => d.axisName).join(", ") : "동일한 감정 처리 방식"
          }에서 오해가 생기기 쉽습니다. 감정과 사실을 분리하고 상대가 원하는 대화 타이밍을 먼저 확인해 보세요.`,
    },
    {
      q: `${a}와 ${b}는 직장 동료나 친구로도 잘 맞나요?`,
      a: `${workGuide} 서로의 강점을 역할로 존중하면 연애뿐 아니라 친구·업무 파트너로도 좋은 시너지를 낼 수 있습니다.`,
    },
  ];

  return {
    pairKey: canonical,
    codeA: a,
    codeB: b,
    typeA,
    typeB,
    score,
    tier: tierMeta.tier,
    tierLabel: tierMeta.label,
    tierEmoji: tierMeta.emoji,
    isCurated: Boolean(curatedExtra),
    headline,
    overview,
    temperamentDynamic: {
      groupA: TEMPERAMENT_LABELS[gA],
      groupB: TEMPERAMENT_LABELS[gB],
      title: tempInfo.title,
      description: tempInfo.description,
    },
    axisComparisons,
    loveGuide,
    workGuide,
    conflictPoints,
    practicalTips,
    curatedExtra,
    faqs,
  };
}
