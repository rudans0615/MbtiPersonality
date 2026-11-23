/**
 * 고검색량 + 고전환 '브릿지 칼럼' 36개 큐 및 중복/품질 검증 모듈
 * - 각 주제는 mbtifinder.com 내 실제 테스트/백과/궁합 페이지로 자연스럽게 연결됩니다.
 * - 기존 DB blog_posts 제목 전체와 대조해 중복 발행을 원천 차단합니다.
 */

export const BRIDGE_TOPIC_QUEUE = [
  // === 1. 연애·관계 브릿지 (검색량 최상위 + /type, /compatibility 연결) ===
  {
    slug: 'istj-boyfriend-contact',
    keyword: 'ISTJ 남친 연락 빈도가 줄었을 때 오해하지 않는 현실 대처법 4가지',
    category: '관계심리',
    bridgeLinks: [
      { href: '/type/ISTJ', label: 'ISTJ 성격유형 백과' },
      { href: '/compatibility/ENFP-ISTJ', label: 'ENFP·ISTJ 궁합 분석' },
    ],
  },
  {
    slug: 'teto-egen-love-diff',
    keyword: '테토녀 vs 에겐녀 연애할 때 결정적 차이 5가지 (상황별 비교표)',
    category: '호르몬 성격학',
    bridgeLinks: [
      { href: '/teto-egen', label: '테토 vs 에겐 성향 진단' },
      { href: '/compatibility', label: 'MBTI 16×16 궁합표' },
    ],
  },
  {
    slug: 'hogu-love-patterns',
    keyword: '연애할 때 유독 호구 잡히는 사람들의 공통 심리 패턴과 경계선 세우기',
    category: '관계심리',
    bridgeLinks: [
      { href: '/hogu', label: '연애 호구력 테스트' },
      { href: '/test', label: '무료 60문항 MBTI 검사' },
    ],
  },
  {
    slug: 'entp-flirting-teasing',
    keyword: 'ENTP가 썸탈 때 자꾸 장난치고 티격태격하는 진짜 심리와 공략법',
    category: '관계심리',
    bridgeLinks: [
      { href: '/type/ENTP', label: 'ENTP 변론가 백과' },
      { href: '/compatibility/ENTP-INFJ', label: 'ENTP·INFJ 궁합 가이드' },
    ],
  },
  {
    slug: 'infj-doorslam-signals',
    keyword: 'INFJ가 마음을 완전히 닫기 전 보내는 경고 신호(도어슬램) 4가지',
    category: '심층분석',
    bridgeLinks: [
      { href: '/type/INFJ', label: 'INFJ 옹호자 백과' },
      { href: '/compatibility/ENFP-INFJ', label: 'ENFP·INFJ 궁합 분석' },
    ],
  },
  {
    slug: 'intj-interest-kakao',
    keyword: 'INTJ가 관심 있는 사람에게만 보여주는 현실 카톡·행동 신호 5가지',
    category: '관계심리',
    bridgeLinks: [
      { href: '/type/INTJ', label: 'INTJ 건축가 백과' },
      { href: '/compatibility/ENFP-INTJ', label: 'ENFP·INTJ 궁합 분석' },
    ],
  },
  {
    slug: 'enfp-intj-fight-fix',
    keyword: 'ENFP와 INTJ 커플이 가장 자주 싸우는 3가지 장면과 화해 대화법',
    category: '관계심리',
    bridgeLinks: [
      { href: '/compatibility/ENFP-INTJ', label: 'ENFP·INTJ 상세 궁합' },
      { href: '/compatibility', label: 'MBTI 전체 궁합표' },
    ],
  },
  {
    slug: 'isfp-avoiding-conflict',
    keyword: 'ISFP 연인이 서운할 때 말 없이 거리를 두는 이유와 부드럽게 푸는 법',
    category: '관계심리',
    bridgeLinks: [
      { href: '/type/ISFP', label: 'ISFP 모험가 백과' },
      { href: '/compatibility/ENFJ-ISFP', label: 'ENFJ·ISFP 궁합 분석' },
    ],
  },
  {
    slug: 'estj-infp-communication',
    keyword: 'ESTJ와 INFP가 연애·직장에서 서로 상처 주지 않는 번역 대화 공식',
    category: '관계심리',
    bridgeLinks: [
      { href: '/compatibility/ESTJ-INFP', label: 'ESTJ·INFP 궁합 리포트' },
      { href: '/type/ESTJ', label: 'ESTJ 경영자 백과' },
    ],
  },
  {
    slug: 'istp-personal-space',
    keyword: 'ISTP와 오래 연애하는 사람들의 공통점: 혼자만의 시간 존중하는 법',
    category: '관계심리',
    bridgeLinks: [
      { href: '/type/ISTP', label: 'ISTP 장인 백과' },
      { href: '/compatibility/ESFJ-ISTP', label: 'ESFJ·ISTP 궁합 분석' },
    ],
  },
  {
    slug: 'entj-love-style',
    keyword: 'ENTJ가 사랑에 빠졌을 때 변하는 모습과 절대 하면 안 되는 말 3가지',
    category: '관계심리',
    bridgeLinks: [
      { href: '/type/ENTJ', label: 'ENTJ 통솔자 백과' },
      { href: '/compatibility/ENTJ-INFP', label: 'ENTJ·INFP 궁합 가이드' },
    ],
  },
  {
    slug: 'marriage-values-mbti',
    keyword: '결혼 전 꼭 맞춰야 할 MBTI 지표별 생활 습관 체크리스트 (경제·집안일·육아)',
    category: '관계심리',
    bridgeLinks: [
      { href: '/compatibility', label: '16×16 MBTI 궁합표' },
      { href: '/weddingNewsAttitudeTest', label: '결혼 소식 태도 테스트' },
    ],
  },

  // === 2. 고단가(High-CPC) 커리어·소비·재테크 × MBTI ===
  {
    slug: 'infp-career-turnover',
    keyword: 'INFP 직장인이 이직·퇴사를 반복하지 않기 위해 꼭 볼 직무 기준 5가지',
    category: '커리어',
    bridgeLinks: [
      { href: '/type/INFP', label: 'INFP 중재자 직장 가이드' },
      { href: '/workLifeBalanceTest', label: '워라밸 성향 테스트' },
    ],
  },
  {
    slug: 'mbti-spending-habits',
    keyword: 'MBTI 유형별 충동소비 트리거와 실패 없는 현실 가계부 관리법',
    category: '커리어',
    bridgeLinks: [
      { href: '/subscriptionSpenderQuiz', label: '구독 소비 유형 테스트' },
      { href: '/shoppingMoodTest1234', label: '쇼핑 성향 테스트' },
    ],
  },
  {
    slug: 'interview-mbti-strengths',
    keyword: '이직·취업 면접에서 내 MBTI 강점을 설득력 있게 어필하는 답변 공식',
    category: '커리어',
    bridgeLinks: [
      { href: '/type', label: 'MBTI 16유형 직무 백과' },
      { href: '/test', label: '60문항 MBTI 검사' },
    ],
  },
  {
    slug: 'remote-vs-office-ei',
    keyword: '재택근무 vs 사무실 출근: 외향형(E)과 내향형(I)의 집중력·성과 차이',
    category: '커리어',
    bridgeLinks: [
      { href: '/workLifeBalanceTest', label: '워라밸 성향 테스트' },
      { href: '/commuteBgmSurvivalType', label: '출근길 생존 유형 테스트' },
    ],
  },
  {
    slug: 'istj-estj-perfectionism',
    keyword: 'ISTJ·ESTJ 직장인이 완벽주의 번아웃 없이 성과를 유지하는 위임 전략',
    category: '커리어',
    bridgeLinks: [
      { href: '/type/ISTJ', label: 'ISTJ 직장 가이드' },
      { href: '/type/ESTJ', label: 'ESTJ 직장 가이드' },
    ],
  },
  {
    slug: 'intp-procrastination-fix',
    keyword: '아이디어는 넘치는데 마감이 힘든 INTP·ENFP를 위한 15분 실행 루틴',
    category: '커리어',
    bridgeLinks: [
      { href: '/type/INTP', label: 'INTP 논리술사 백과' },
      { href: '/dopamine', label: '도파민 중독 자가진단' },
    ],
  },
  {
    slug: 'office-kkondae-communication',
    keyword: '직장에서 세대 갈등 없이 피드백 주고받는 유형별 사내 소통 매뉴얼',
    category: '커리어',
    bridgeLinks: [
      { href: '/officePhoneUsageKkondaeLevel', label: '직장 꼰대력 테스트' },
      { href: '/compatibility', label: '유형별 협업 궁합표' },
    ],
  },
  {
    slug: 'subscription-fatigue-psychology',
    keyword: '안 쓰는 구독 서비스를 못 끊는 심리(매몰비용 효과)와 고정비 다이어트법',
    category: '심층분석',
    bridgeLinks: [
      { href: '/subscriptionSpenderQuiz', label: '구독 소비 유형 테스트' },
      { href: '/shoppingMoodTest1234', label: '쇼핑 기분 테스트' },
    ],
  },
  {
    slug: 'tf-workplace-feedback',
    keyword: '상사·동료가 T형 vs F형일 때 업무 보고서와 피드백을 다르게 쓰는 법',
    category: '커리어',
    bridgeLinks: [
      { href: '/type', label: 'MBTI 16유형 백과' },
      { href: '/test', label: 'MBTI 무료 검사' },
    ],
  },
  {
    slug: 'side-hustle-by-mbti',
    keyword: '나에게 맞는 부업·N잡 찾기: 4가지 기질별(NT·NF·SJ·SP) 수익화 적성 비교',
    category: '커리어',
    bridgeLinks: [
      { href: '/type', label: '4가지 기질·16유형 백과' },
      { href: '/workLifeBalanceTest', label: '워라밸 성향 테스트' },
    ],
  },
  {
    slug: 'esfj-isfj-people-pleasing',
    keyword: '거절을 못 해 지치는 ESFJ·ISFJ가 직장에서 죄책감 없이 선 긋는 대화법',
    category: '커리어',
    bridgeLinks: [
      { href: '/type/ESFJ', label: 'ESFJ 집정관 백과' },
      { href: '/type/ISFJ', label: 'ISFJ 수호자 백과' },
    ],
  },
  {
    slug: 'entj-intp-startup-team',
    keyword: '최고의 협업 파트너 조합: 기획형·실행형 MBTI가 팀을 짰을 때 시너지 원리',
    category: '커리어',
    bridgeLinks: [
      { href: '/compatibility/ENTJ-INTP', label: 'ENTJ·INTP 협업 궁합' },
      { href: '/compatibility/ENFP-INTJ', label: 'ENFP·INTJ 협업 궁합' },
    ],
  },

  // === 3. 일상·테스트 직접 연결 브릿지 ===
  {
    slug: 'shortform-dopamine-reset',
    keyword: '릴스·쇼츠를 끄지 못하는 뇌의 원리와 7일 현실 도파민 디톡스 루틴',
    category: '심층분석',
    bridgeLinks: [
      { href: '/dopamine', label: '도파민 중독 테스트' },
      { href: '/socialMediaHabitTest2024', label: 'SNS 습관 테스트' },
    ],
  },
  {
    slug: 'travel-partner-mbti-conflict',
    keyword: '같이 여행 가면 의절하는 MBTI 조합 vs 평생 친구 되는 여행 스타일 비교',
    category: '관계심리',
    bridgeLinks: [
      { href: '/travelFriendCompatibility', label: '여행 메이트 궁합 테스트' },
      { href: '/travelMood2023', label: '여행 무드 테스트' },
    ],
  },
  {
    slug: 'drunk-personality-psychology',
    keyword: '술 마시면 성격이 180도 바뀌는 심리적 이유: 평소 억눌린 성향의 발현',
    category: '성격분석',
    bridgeLinks: [
      { href: '/drunk', label: '나 술 취했나? 자가진단' },
      { href: '/test', label: '60문항 MBTI 검사' },
    ],
  },
  {
    slug: 'pet-healing-personality',
    keyword: '강아지파 vs 고양이파 성격 차이: 반려동물 취향으로 보는 애착과 휴식 성향',
    category: '성격분석',
    bridgeLinks: [
      { href: '/myPetHealingStyle', label: '반려동물 힐링 스타일 테스트' },
      { href: '/petPersonalityPreference', label: '반려동물 성향 테스트' },
    ],
  },
  {
    slug: 'roommate-living-habits',
    keyword: '룸메이트·동거 전 반드시 맞춰야 할 생활 습관 6가지 (청결·소음·개인공간)',
    category: '관계심리',
    bridgeLinks: [
      { href: '/roommateAirQuality', label: '룸메이트 성향 테스트' },
      { href: '/compatibility', label: 'MBTI 궁합표' },
    ],
  },
  {
    slug: 'sns-comparison-fatigue',
    keyword: '인스타그램을 볼수록 우울해지는 상향 비교 심리와 건강한 SNS 사용 기준',
    category: '심층분석',
    bridgeLinks: [
      { href: '/socialMediaHabitTest2024', label: 'SNS 습관 테스트' },
      { href: '/dopamine', label: '도파민 중독 테스트' },
    ],
  },
  {
    slug: 'seasonal-mood-psychology',
    keyword: '계절이 바뀔 때마다 기분이 급변하는 이유: 계절성 감정 변화와 루틴 관리법',
    category: '심층분석',
    bridgeLinks: [
      { href: '/seasonalMoodTest', label: '계절 무드 테스트' },
      { href: '/petStressRelief', label: '스트레스 해소 성향 테스트' },
    ],
  },
  {
    slug: 'commute-music-stress',
    keyword: '출근길 음악 취향과 감정 조절의 심리학: 하루 컨디션을 바꾸는 청각 루틴',
    category: '성격분석',
    bridgeLinks: [
      { href: '/commuteBgmSurvivalType', label: '출근길 BGM 생존 유형 테스트' },
      { href: '/workLifeBalanceTest', label: '워라밸 테스트' },
    ],
  },
  {
    slug: 'friendship-longevity-mbti',
    keyword: '성인이 된 뒤 오래 남는 친구의 조건: 성격이 닮은 친구 vs 다른 친구',
    category: '관계심리',
    bridgeLinks: [
      { href: '/friendshipCompatibility', label: '우정 궁합 테스트' },
      { href: '/compatibility', label: 'MBTI 16×16 궁합표' },
    ],
  },
  {
    slug: 'sbti-vs-mbti-guide',
    keyword: 'MBTI 다음으로 뜨는 확장 성향 테스트(SBTI·테토에겐), 어떻게 다를까?',
    category: '성격분석',
    bridgeLinks: [
      { href: '/sbti', label: 'SBTI 성향 테스트' },
      { href: '/teto-egen', label: '테토 vs 에겐 진단' },
    ],
  },
  {
    slug: 'introvert-social-battery',
    keyword: '내향형(I)의 사회적 배터리가 빠르게 방전되는 이유와 모임 후 회복 전략',
    category: '성격분석',
    bridgeLinks: [
      { href: '/type/INTP', label: 'INTP 백과' },
      { href: '/type/INFJ', label: 'INFJ 백과' },
    ],
  },
  {
    slug: 'extrovert-loneliness-paradox',
    keyword: '사람을 좋아하는데 문득 공허한 외향형(E)의 역설과 건강한 혼자 시간 보내기',
    category: '심층분석',
    bridgeLinks: [
      { href: '/type/ENFP', label: 'ENFP 백과' },
      { href: '/type/ENFJ', label: 'ENFJ 백과' },
    ],
  },
];

function tokenizeKorean(text) {
  return new Set(
    (text || '')
      .toLowerCase()
      .replace(/[^가-힣a-z0-9\s]/g, ' ')
      .split(/\s+/)
      .filter((w) => w.length >= 2)
  );
}

export function titleOverlapRatio(a, b) {
  const setA = tokenizeKorean(a);
  const setB = tokenizeKorean(b);
  if (setA.size === 0 || setB.size === 0) return 0;
  let inter = 0;
  for (const w of setA) {
    if (setB.has(w)) inter++;
  }
  return inter / Math.min(setA.size, setB.size);
}

export function isDuplicateAgainstExisting(candidateTitle, existingPosts) {
  const norm = (s) => (s || '').trim().toLowerCase();
  const cNorm = norm(candidateTitle);
  for (const p of existingPosts || []) {
    if (norm(p.title) === cNorm) return { isDup: true, matchedTitle: p.title, ratio: 1 };
    const ratio = titleOverlapRatio(candidateTitle, p.title);
    if (ratio >= 0.65) return { isDup: true, matchedTitle: p.title, ratio };
  }
  return { isDup: false, matchedTitle: null, ratio: 0 };
}

/**
 * DB에 아직 비슷한 글이 없는 다음 브릿지 주제를 선별합니다.
 */
export function pickNextBridgeTopic(existingPosts, usedSlugs = []) {
  const usedSet = new Set(usedSlugs);
  for (const item of BRIDGE_TOPIC_QUEUE) {
    if (usedSet.has(item.slug)) continue;
    const dup = isDuplicateAgainstExisting(item.keyword, existingPosts);
    if (!dup.isDup) return item;
  }
  return null;
}

export function getRemainingBridgeTopics(existingPosts, usedSlugs = []) {
  const usedSet = new Set(usedSlugs);
  return BRIDGE_TOPIC_QUEUE.filter((item) => {
    if (usedSet.has(item.slug)) return false;
    return !isDuplicateAgainstExisting(item.keyword, existingPosts).isDup;
  });
}

/**
 * 생성된 칼럼 초안의 애드센스 품질 기준 검수
 */
export function validateBlogDraft(aiData, existingPosts) {
  const issues = [];
  const title = (aiData?.title || '').trim();
  const html = (aiData?.content || '').trim();
  const plain = html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
  const charCount = plain.length;

  if (!title || title.length < 10) issues.push('제목이 너무 짧습니다.');
  const dup = isDuplicateAgainstExisting(title, existingPosts);
  if (dup.isDup) issues.push(`기존 글과 중복 유사(${Math.round(dup.ratio * 100)}%): "${dup.matchedTitle}"`);
  if (charCount < 1800) issues.push(`본문 분량 부족 (${charCount}자 / 권장 1,800자 이상)`);

  const h2Count = (html.match(/<h2\b/gi) || []).length;
  if (h2Count < 2) issues.push(`H2 소제목 부족 (${h2Count}개)`);

  const hasStructuredBlock = /<table\b/i.test(html) || /<ul\b|<ol\b/i.test(html);
  if (!hasStructuredBlock) issues.push('비교표(table) 또는 리스트(ul/ol) 누락');

  const hasBridgeLink = /href=["']\/[a-z0-9/_-]+["']/i.test(html);
  if (!hasBridgeLink) issues.push('사이트 내부 테스트/백과 브릿지 링크 누락');

  if (/^(<[^>]+>)*\s*(안녕하세요|이 글에서는)/i.test(html)) {
    issues.push('AI 상투적 서론 감지');
  }

  return {
    ok: issues.length === 0,
    charCount,
    h2Count,
    hasTable: /<table\b/i.test(html),
    hasBridgeLink,
    issues,
  };
}
