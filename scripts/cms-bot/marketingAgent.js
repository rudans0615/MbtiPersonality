import OpenAI from 'openai';

/**
 * 4명의 특화된 마케팅 에이전트(Analyst, Copywriter, Visual Director, Performance Marketer)가
 * 순차적으로 협업하여 바이럴 마케팅 패키지를 생성하는 함수입니다.
 * 
 * @param {Object} testData - 마케팅할 테스트의 데이터 (title, description, results 등)
 * @param {OpenAI} openai - OpenAI 인스턴스
 * @param {Function} progressCallback - 진행 상황을 텔레그램 봇으로 전송하기 위한 콜백
 * @returns {Object} 최종 완성된 종합 마케팅 리포트
 */
export async function generateMarketingCampaign(testData, openai, progressCallback) {
  
  // 1. Trend Analyst (트렌드 분석가 '제이')
  if (progressCallback) progressCallback("📊 [1/4] 트렌드 분석가 '제이'가 타겟 오디언스와 바이럴 트리거를 분석 중입니다...");
  
  const analystCompletion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    temperature: 0.8,
    response_format: { type: "json_object" },
    messages: [
      {
        role: "system",
        content: `너는 SNS 트렌드를 꿰뚫어보는 수석 트렌드 분석가 '제이'야.
목표: 제공된 심리테스트 데이터를 바탕으로 최고의 바이럴을 이끌어낼 핵심 전략을 수립해.

[JSON 출력 형식]
{
  "targetAudience": "핵심 타겟층 (예: 25-30세, 번아웃 직전의 3년차 직장인 여성)",
  "viralTrigger": "어떤 감정을 건드려야 공유가 일어나는가? (예: 뼈때리는 팩폭, 깊은 공감, 분노 유발 등)",
  "coreMessage": "캠페인을 관통하는 한 줄짜리 핵심 메시지",
  "recommendedHashtags": ["해시태그 5개"]
}`
      },
      {
        role: "user",
        content: `테스트 제목: ${testData.title}\n설명: ${testData.description}\n카테고리: ${testData.category}`
      }
    ]
  });
  
  const analystReport = JSON.parse(analystCompletion.choices[0].message.content);

  // 2. Lead Copywriter (카피라이터 '레이첼')
  if (progressCallback) progressCallback("✍️ [2/4] 수석 카피라이터 '레이첼'이 플랫폼별 맞춤형 카피를 작성 중입니다...");
  
  const copywriterCompletion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    temperature: 0.9,
    response_format: { type: "json_object" },
    messages: [
      {
        role: "system",
        content: `너는 100만 팔로워를 만든 밈(Meme) 제조기이자 메인 카피라이터 '레이첼'이야.
목표: 앞서 분석가가 전달한 전략을 바탕으로 SNS 플랫폼별로 가장 찰진 카피를 작성해.

[작성 규칙]
1. 존댓말과 반말을 적절히 섞어 친근한 10~30대 구어체 사용.
2. 첫 줄은 무조건 시선을 멈추는 후킹 문구.
3. 절대 딱딱하거나 작위적인 광고톤 금지.
4. 부연 설명이나 "이렇게 작성했습니다" 같은 말 없이 오직 **'즉시 복붙 가능한 최종 텍스트'**만 출력해. 링크가 들어갈 자리는 [테스트 링크] 로 표시해.

[JSON 출력 형식]
{
  "instagramFeed": "인스타 피드용 캡션 (이모지, 줄바꿈, [테스트 링크], 해시태그 포함 최종 완성본)",
  "instagramStory": "인스타 스토리용 짧은 문구 (클릭 유도 포함)",
  "threadsCopy": "스레드(Threads)용 짧고 팩폭성 강한 텍스트 ([테스트 링크] 포함)",
  "tiktokHook": "쇼츠/릴스 캡션용 텍스트 ([테스트 링크] 포함)"
}`
      },
      {
        role: "user",
        content: `[전략 리포트]\n타겟: ${analystReport.targetAudience}\n트리거: ${analystReport.viralTrigger}\n핵심메시지: ${analystReport.coreMessage}\n\n[테스트 정보]\n제목: ${testData.title}`
      }
    ]
  });

  const copywriterReport = JSON.parse(copywriterCompletion.choices[0].message.content);

  // 3. Visual Art Director (비주얼 디렉터 '샘')
  if (progressCallback) progressCallback("🎨 [3/4] 아트 디렉터 '샘'이 카드뉴스 스토리보드와 시각 연출을 기획 중입니다...");
  
  const visualCompletion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    temperature: 0.8,
    response_format: { type: "json_object" },
    messages: [
      {
        role: "system",
        content: `너는 세련된 감각을 가진 톱클래스 비주얼 아트 디렉터 '샘'이야.
목표: 카피라이터의 텍스트를 인스타그램 카드뉴스(1~3장)로 어떻게 배치할지 스토리보드를 짜.

[JSON 출력 형식]
{
  "colorPalette": "핵심 컬러 테마 (예: 네온 퍼플 & 다크 그레이)",
  "thumbnailText": "첫 장 썸네일에 엄청나게 크게 박을 초강력 텍스트 1줄",
  "storyboard": [
    { "page": 1, "visualIdea": "배경 이미지 연출 아이디어", "text": "페이지에 들어갈 텍스트" },
    { "page": 2, "visualIdea": "배경 이미지 연출 아이디어", "text": "페이지에 들어갈 텍스트" }
  ]
}`
      },
      {
        role: "user",
        content: `[전략]\n${analystReport.coreMessage}\n\n[카피]\n인스타용: ${copywriterReport.instagramFeed}\n\n[테스트 정보]\n제목: ${testData.title}`
      }
    ]
  });

  const visualReport = JSON.parse(visualCompletion.choices[0].message.content);

  // 3-5. 실제 테스트의 OG 이미지를 제공 (DALL-E 생성 제거)
  const imageUrl = `https://mbtifinder.com/api/og?title=${encodeURIComponent(testData.title)}`;
  
  // 4. Performance Marketer (퍼포먼스 마케터 '맥스')
  if (progressCallback) progressCallback("📈 [4/4] 퍼포먼스 마케터 '맥스'가 수익화(ROI) 및 전환(CTA) 전략을 세팅 중입니다...");

  const performanceCompletion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    temperature: 0.7,
    response_format: { type: "json_object" },
    messages: [
      {
        role: "system",
        content: `너는 전환율(CVR)의 마술사이자 쿠팡/애드센스 수익화 전문가 '맥스'야.
목표: 이 캠페인을 통해 유입된 트래픽을 실제 수익으로 전환시키기 위한 치밀한 CTA(행동 유도) 전략을 세워.

[JSON 출력 형식]
{
  "callToAction": "게시물 마지막에 넣을 강력한 링크 클릭 유도 멘트 (최종 텍스트)",
  "coupangText": "테스트 결과 아래에 달아놓을 쿠팡 파트너스 추천 멘트 (부연 설명 없이 바로 쓸 수 있는 최종 텍스트, 예: '연애 고민 해결해줄 필독서 👉 [쿠팡 링크]')",
  "expectedROI": "이 캠페인의 예상 수익화 강점 분석 (1~2문장)"
}`
      },
      {
        role: "user",
        content: `[타겟]\n${analystReport.targetAudience}\n\n[테스트 정보]\n제목: ${testData.title}`
      }
    ]
  });

  const performanceReport = JSON.parse(performanceCompletion.choices[0].message.content);

  if (progressCallback) progressCallback("✨ 캠페인 패키징 완료! 텔레그램으로 최종본을 전송합니다.");

  // 종합 리포트 조립
  return {
    analyst: analystReport,
    copywriter: copywriterReport,
    visual: visualReport,
    performance: performanceReport,
    testTitle: testData.title,
    testId: testData.id,
    imageUrl: imageUrl
  };
}
