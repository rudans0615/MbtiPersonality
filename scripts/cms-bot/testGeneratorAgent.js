import { z } from 'zod';
import { zodResponseFormat } from 'openai/helpers/zod';
import { injectCode } from './developerAgent.js';

export async function generateViralTest(openai, bot, chatId, { topic, targetAudience, tone }) {
  bot.sendMessage(chatId, `🚀 [Director Agent] 기획 시작...\n- 주제: ${topic}\n- 타겟: ${targetAudience}\n- 팩폭 수위: ${tone}\n(매트릭스 설계 중, 약 30초 소요)`);

  try {
    // 12가지 성향(Type)과 12문항 4지선다를 엄격하게 강제하는 Zod 스키마
    const TestSchema = z.object({
      testId: z.string().describe("camelCase 영문 고유 ID (예: blindLoveTest)"),
      category: z.enum(["HOT", "LOVE", "PERSONALITY", "FUN", "CAREER"]),
      title: z.string().describe("클릭을 유발하는 어그로성 바이럴 제목"),
      subtitle: z.string().describe("호기심을 자극하는 부제목"),
      description: z.string().describe("테스트 한줄 소개 (MZ 구어체)"),
      emoji: z.string().describe("대표 이모지 1개"),
      seoArticle: z.string().describe("SEO 최적화를 위한 500자 이상의 심리학적 칼럼 텍스트 (단락 구분 포함)"),
      promotionalCopy: z.string().describe("인스타 피드용 홍보 복붙 멘트 (찰진 팩폭 멘트)"),
      
      // 정확히 12개의 결과 유형
      results: z.array(z.object({
        typeCode: z.string().describe("영문 대문자 스네이크 케이스 (예: MONEY_WASTER)"),
        title: z.string().describe("유형 이름 (예: 통장파괴자)"),
        emoji: z.string(),
        subtitle: z.string().describe("한줄 요약"),
        description: z.string().describe("장단점 및 뼈때리는 팩폭을 담은 300자 이상의 상세 설명"),
        characteristics: z.array(z.string()).length(4).describe("이 유형의 핵심 특징 4가지 (짧고 강렬하게)"),
        coupangKeyword: z.string().describe("고관여/고단가 추천 상품 검색 키워드 (책/문구류 제외)"),
        coupangHook: z.string().describe("쿠팡 추천 영역 상단 후킹 멘트 (20자 내외)")
      })).length(12).describe("반드시 12개의 서로 다른 고유한 결과 유형을 생성해야 함"),

      // 정확히 12개의 문항
      questions: z.array(z.object({
        question: z.string().describe("구체적인 상황이 묘사된 질문 (예: 밤 11시 갑자기 친구가 나오라고 할 때)"),
        options: z.array(z.object({
          text: z.string().describe("자연스러운 구어체 선택지 (예: 귀찮아 안 나가)"),
          typeCode: z.string().describe("선택 시 매핑될 결과 유형의 typeCode (results에 정의된 12개 중 하나)")
        })).length(4).describe("반드시 4지선다형")
      })).length(12).describe("반드시 12개의 질문을 생성해야 함")
    });

    // Director & Creator 통합 프롬프트
    const completion = await openai.beta.chat.completions.parse({
      model: "gpt-4o", // gpt-4o for highest quality
      temperature: 0.9,
      messages: [
        {
          role: "system",
          content: `너는 10~30대 한국 여성 대상 바이럴 테스트 제작 전문 'Multi-Agent 팀(디렉터+메인작가)'이야.

[디렉터의 룰 - 매트릭스 설계]
1. 반드시 12개의 서로 다른 고유한 결과 유형(typeCode)을 설계해라.
2. 반드시 12개의 문항을 설계해라.
3. 각 문항은 4지선다(options 4개)로 구성되며, 각 option은 위에서 설계한 12개의 typeCode 중 하나를 지목해야 한다.
4. 12개 문항 × 4지선다 = 총 48개의 선택지가 존재한다. 12개의 typeCode가 각각 정확히 4번씩 선택지에 등장하도록 매트릭스를 완벽하게 분배해라. (한 문항 내에서 동일한 typeCode가 중복 등장하면 안 됨)

[메인 작가의 룰 - 콘텐츠 톤앤매너]
1. 타겟 연령대: ${targetAudience}
2. 팩폭 수위: ${tone}
3. 말투: 딱딱한 존댓말 금지. 찐친이 카톡으로 묻는 듯한 자연스러운 구어체.
4. 질문: "이런 상황이라면?" 같은 모호한 지시어 절대 금지. 극단적이고 구체적인 시나리오 부여.
5. 옵션: "A라고 말한다" 식의 번역체 금지. "아 쫌 조용히 해봐 ㅡㅡ" 처럼 생생한 대사/속마음체 사용.
6. 결과(results): 밈과 유행어를 적극 활용하되, ${tone} 수위에 맞춰 뼈를 때리는 팩폭을 날려라.`
        },
        {
          role: "user",
          content: `테스트 주제: "${topic}"\n위 주제와 타겟, 톤앤매너에 완벽하게 부합하는 바이럴 테스트 JSON을 생성해줘.`
        }
      ],
      response_format: zodResponseFormat(TestSchema, "test_schema")
    });

    const parsedData = completion.choices[0].message.parsed;

    bot.sendMessage(chatId, `🔍 [Critic Agent] 1차 기획안(12문항/12유형) 도출 완료. 스키마 무결성 검증 통과!\n- 제목: ${parsedData.title}\n(이제 DB 주입용 포맷으로 변환 및 배포를 준비합니다...)`);

    // developerAgent.js가 예상하는 포맷으로 변환
    // developerAgent.js는 results를 Object(Record<string, any>)로 기대함
    const formattedResults = {};
    parsedData.results.forEach(r => {
      formattedResults[r.typeCode] = {
        title: r.title,
        emoji: r.emoji,
        subtitle: r.subtitle,
        description: r.description,
        characteristics: r.characteristics,
        coupangKeyword: r.coupangKeyword,
        coupangHook: r.coupangHook
      };
    });

    // questions 배열 내의 옵션도 score 대신 type으로 변경
    const formattedQuestions = parsedData.questions.map(q => ({
      question: q.question,
      options: q.options.map(o => ({
        text: o.text,
        type: o.typeCode
      }))
    }));

    const finalAiData = {
      testId: parsedData.testId,
      category: parsedData.category,
      title: parsedData.title,
      subtitle: parsedData.subtitle,
      description: parsedData.description,
      emoji: parsedData.emoji,
      seoArticle: parsedData.seoArticle,
      promotionalCopy: parsedData.promotionalCopy,
      questions: formattedQuestions,
      results: formattedResults
    };

    // DB 및 소스코드 주입
    await injectCode(finalAiData);

    bot.sendMessage(chatId, `
✅ **[신규 테스트 즉시 배포 완료]** ${finalAiData.title}

👇 **즉시 복붙 가능한 인스타 업로드용 멘트:**
"${finalAiData.promotionalCopy}"

📸 **홍보용 이미지 다운로드 링크:**
- [인스타 스토리용 (9:16)](https://mbtifinder.com/api/og?testId=${finalAiData.testId}&type=story)
- [인스타 피드용 (1:1)](https://mbtifinder.com/api/og?testId=${finalAiData.testId}&type=feed)
- [카톡 공유용 (16:9)](https://mbtifinder.com/api/og?testId=${finalAiData.testId}&type=share)

🔗 **테스트 바로가기:** https://mbtifinder.com/${finalAiData.testId}`);

  } catch (error) {
    console.error(error);
    bot.sendMessage(chatId, `❌ 에러 발생: ${error.message}`);
  }
}
