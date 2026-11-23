import { generateJson } from './llmClient.js';

/**
 * 4명의 특화된 마케팅 에이전트(Analyst, Copywriter, Visual Director, Performance Marketer)가
 * 순차적으로 협업하여 바이럴 마케팅 패키지를 생성합니다.
 */
export async function generateMarketingCampaign(testData, openai, progressCallback) {
  const testUrl = `https://mbtifinder.com/${testData.id}`;
  const resultsSummary = Array.isArray(testData.results) && testData.results.length > 0
    ? testData.results.map((r) => `${r.emoji || ''} ${r.title}`).join(', ')
    : '';

  // 1. Trend Analyst
  if (progressCallback) progressCallback("📊 [1/4] 트렌드 분석가 '제이'가 타겟 오디언스와 바이럴 트리거를 분석 중입니다...");

  const { data: analystReport } = await generateJson(openai, {
    role: 'analyst',
    temperature: 0.75,
    system: `너는 SNS 트렌드를 꿰뚫어보는 수석 트렌드 분석가 '제이'야.
제공된 심리테스트 데이터를 바탕으로 바이럴 핵심 전략을 JSON으로 수립해.
[JSON 출력 형식]
{
  "targetAudience": "핵심 타겟층",
  "viralTrigger": "공유를 부르는 핵심 감정 트리거",
  "coreMessage": "캠페인 한 줄 핵심 메시지",
  "recommendedHashtags": ["해시태그 5개"]
}`,
    user: `테스트 제목: ${testData.title}\n설명: ${testData.description}\n카테고리: ${testData.category}${
      resultsSummary ? `\n결과 유형: ${resultsSummary}` : ''
    }`,
  });

  // 2. Lead Copywriter
  if (progressCallback) progressCallback("✍️ [2/4] 수석 카피라이터 '레이첼'이 플랫폼별 맞춤형 카피를 작성 중입니다...");

  const { data: copywriterReport } = await generateJson(openai, {
    role: 'promo',
    temperature: 0.9,
    system: `너는 밈 제조기이자 메인 카피라이터 '레이첼'이야.
[작성 규칙]
1. 자연스러운 한국 10~30대 구어체, 첫 줄 강력한 훅.
2. 광고톤·부연설명 금지, 즉시 복붙 가능한 최종 텍스트만 출력.
3. 링크 자리에는 실제 URL(${testUrl})을 그대로 넣을 것.
[JSON 출력 형식]
{
  "instagramFeed": "인스타 피드용 캡션 (이모지, 줄바꿈, URL, 해시태그 포함)",
  "instagramStory": "인스타 스토리용 짧은 문구",
  "threadsCopy": "스레드용 짧고 공감/팩폭 강한 텍스트 (URL 포함)",
  "tiktokHook": "쇼츠/릴스 캡션용 텍스트 (URL 포함)"
}`,
    user: `[전략 리포트]\n타겟: ${analystReport.targetAudience}\n트리거: ${analystReport.viralTrigger}\n핵심메시지: ${analystReport.coreMessage}\n\n[테스트]\n제목: ${testData.title}${
      resultsSummary ? `\n결과 유형: ${resultsSummary}` : ''
    }\n링크: ${testUrl}`,
  });

  // [테스트 링크] 플레이스홀더가 남아있을 경우 안전 치환
  for (const key of ['instagramFeed', 'instagramStory', 'threadsCopy', 'tiktokHook']) {
    if (typeof copywriterReport[key] === 'string') {
      copywriterReport[key] = copywriterReport[key].replace(/\[테스트\s*링크\]/g, testUrl);
    }
  }

  // 3. Visual Art Director
  if (progressCallback) progressCallback("🎨 [3/4] 아트 디렉터 '샘'이 카드뉴스 스토리보드와 시각 연출을 기획 중입니다...");

  const { data: visualReport } = await generateJson(openai, {
    role: 'analyst',
    temperature: 0.75,
    system: `너는 비주얼 아트 디렉터 '샘'이야.
인스타그램 카드뉴스(1~3장) 스토리보드를 JSON으로 짜.
[JSON 출력 형식]
{
  "colorPalette": "핵심 컬러 테마",
  "thumbnailText": "첫 장 썸네일 초강력 1줄 카피",
  "storyboard": [
    { "page": 1, "visualIdea": "배경 연출", "text": "페이지 문구" },
    { "page": 2, "visualIdea": "배경 연출", "text": "페이지 문구" }
  ]
}`,
    user: `[전략]\n${analystReport.coreMessage}\n[카피]\n${copywriterReport.instagramFeed}\n[테스트]\n${testData.title}`,
  });

  const imageUrl = `https://mbtifinder.com/api/og?testId=${encodeURIComponent(testData.id)}&type=feed`;

  // 4. Performance Marketer
  if (progressCallback) progressCallback("📈 [4/4] 퍼포먼스 마케터 '맥스'가 전환(CTA) 전략을 세팅 중입니다...");

  const { data: performanceReport } = await generateJson(openai, {
    role: 'analyst',
    temperature: 0.65,
    system: `너는 전환율(CVR) 및 수익화 전문가 '맥스'야.
[JSON 출력 형식]
{
  "callToAction": "게시물 마지막 링크 클릭 유도 멘트",
  "coupangText": "테스트 결과 하단 추천 아이템 후킹 문구 (과장 광고 금지, 자연스러운 1줄)",
  "expectedROI": "예상 전환 강점 1~2문장"
}`,
    user: `[타겟]\n${analystReport.targetAudience}\n[테스트]\n${testData.title}`,
  });

  if (progressCallback) progressCallback('✨ 캠페인 패키징 완료! 텔레그램으로 최종본을 전송합니다.');

  return {
    analyst: analystReport,
    copywriter: copywriterReport,
    visual: visualReport,
    performance: performanceReport,
    testTitle: testData.title,
    testId: testData.id,
    imageUrl,
  };
}
