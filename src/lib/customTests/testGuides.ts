import type { ResultType, TestMeta } from "@/lib/queries";

export interface TestGuideData {
  intro: string;
  howToTake: string[];
  resultPreviews: {
    code: string;
    emoji: string;
    title: string;
    subtitle: string;
    summary: string;
  }[];
  faqs: { q: string; a: string }[];
}

const CATEGORY_CONTEXT: Record<string, string> = {
  HOT: "최근 많은 사용자가 공감하고 공유하는 핵심 일상·관계 패턴을 중심으로 설계된 대표 성향 테스트입니다.",
  LOVE: "연애와 썸, 갈등 해결, 애정 표현 방식 등 관계 속에서 반복되는 나의 심리 패턴을 객관적으로 돌아볼 수 있도록 구성했습니다.",
  PERSONALITY: "평소 생각하고 반응하는 내면의 성향과 에너지 사용 방식을 스스로 이해할 수 있도록 기획된 자기이해 테스트입니다.",
  FUN: "가벼운 일상 시나리오와 선택지를 통해 나의 취향과 습관을 유쾌하게 확인하고 지인들과 대화 소재로 나누기 좋은 테스트입니다.",
  CAREER: "업무 환경에서의 소통 방식, 스트레스 대응, 일과 삶의 균형 관점을 점검해 볼 수 있도록 구성된 커리어 성향 테스트입니다.",
};

const CUSTOM_INTROS: Record<string, string> = {
  dopamine:
    "스마트폰, 숏폼 콘텐츠, 잦은 알림처럼 즉각적인 자극이 넘치는 일상 속에서 내가 어떤 방식으로 집중력을 잃고 보상을 추구하는지 점검해 보는 자기이해 테스트입니다. 결과를 통해 나의 자극 민감도와 일상 회복 습관을 함께 돌아볼 수 있습니다.",
  hogu:
    "관계에서 배려와 희생의 경계가 흐려질 때 내가 어떤 신호를 놓치기 쉬운지 살펴보는 연애·대인관계 성향 테스트입니다. 상대를 아끼는 마음과 건강한 자기 경계 사이의 균형을 점검하는 참고 자료로 활용해 보세요.",
  sbti:
    "기존 4글자 성격유형 분류에 일상 속 감각적 취향과 생활 리듬 요소를 더해, 나의 캐릭터적 매력을 한눈에 파악할 수 있도록 설계된 확장 성향 테스트입니다.",
};

export function buildTestGuide(
  testInfo: TestMeta,
  resultsData: Record<string, ResultType>,
  questionCount: number
): TestGuideData {
  const categoryIntro =
    CATEGORY_CONTEXT[testInfo.category] ||
    "일상에서 마주하는 구체적인 상황 선택을 통해 자신의 반응 경향을 정리해 볼 수 있는 참고용 심리테스트입니다.";

  const intro =
    CUSTOM_INTROS[testInfo.id] ||
    `${testInfo.title}는 ${testInfo.description || "선택한 답변을 바탕으로 성향을 살펴보는 테스트입니다."} ${categoryIntro}`;

  const resultPreviews = Object.values(resultsData)
    .slice(0, 6)
    .map((r) => ({
      code: r.code,
      emoji: r.emoji || "✨",
      title: r.title,
      subtitle: r.subtitle || "",
      summary: (r.description || "").slice(0, 110) + ((r.description || "").length > 110 ? "…" : ""),
    }));

  const howToTake = [
    `총 ${questionCount}개의 문항으로 구성되어 있으며, 평균 ${testInfo.duration || "2~3분"} 정도 소요됩니다.`,
    "정답이나 더 좋은 선택지가 있는 시험이 아니므로, '이렇게 행동해야 할 것 같다'가 아니라 실제로 내가 자주 선택하는 반응을 고르세요.",
    "중간에 선택을 바꾸고 싶다면 하단의 '선택 다시하기' 버튼으로 이전 문항으로 돌아가 수정할 수 있습니다.",
    "결과 페이지에서는 핵심 특징 요약과 함께 이 테스트에 포함된 모든 유형 개요를 비교해 볼 수 있습니다.",
  ];

  const faqs = [
    {
      q: `${testInfo.title} 결과는 서버에 저장되나요?`,
      a: "아니요. MBTI Finder는 회원가입을 요구하지 않으며, 사용자가 선택한 응답이나 개인 검사 결과를 서버 데이터베이스에 저장하지 않습니다.",
    },
    {
      q: "이 테스트 결과는 의학적·전문적 심리 진단인가요?",
      a: "아닙니다. 재미와 자기이해, 대화를 돕기 위한 참고용 콘텐츠이며 전문 심리평가나 임상 진단을 대체하지 않습니다.",
    },
    {
      q: "다시 검사하면 다른 결과가 나올 수도 있나요?",
      a: "경계선에 가까운 성향이거나 최근 컨디션·관심사가 달라졌다면 다른 유형이 나올 수 있습니다. 여러 번 해본 뒤 결과 설명 중 가장 공감되는 포인트를 참고해 보세요.",
    },
  ];

  return {
    intro,
    howToTake,
    resultPreviews,
    faqs,
  };
}
