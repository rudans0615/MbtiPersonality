import { getTests, getTestById, getQuestionsWithOptions } from "@/lib/queries";
import TestClient from "./TestClient";
import { notFound } from "next/navigation";

export const revalidate = 3600; // ISR: 1시간마다 재생성

export async function generateStaticParams() {
  try {
    const tests = await getTests();
    return tests
      .filter(test => test.is_available && test.id !== "mbti")
      .map(test => ({ testId: test.id }));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: { params: Promise<{ testId: string }> }) {
  const { testId } = await params;

  try {
    const testInfo = await getTestById(testId);
    if (!testInfo) throw new Error("not found");
    return {
      title: testInfo.title,
      description: testInfo.description,
      keywords: `${testInfo.category}, 심리테스트, ${testInfo.title.replace(/ /g, ', ')}`,
      openGraph: { title: testInfo.title, description: testInfo.description },
    };
  } catch {
    return { title: 'Test Not Found' };
  }
}

export default async function TestPage({ params }: { params: Promise<{ testId: string }> }) {
  const { testId } = await params;

  // 1. DB에서 테스트 메타 + 질문 가져오기
  try {
    const testInfo = await getTestById(testId);
    const dbQuestions = await getQuestionsWithOptions(testId);

    if (testInfo && dbQuestions.length > 0) {
      // DB 데이터를 TestClient가 기대하는 형식으로 변환
      const questions = dbQuestions.map(q => ({
        id: q.question_number,
        text: q.text,
        question: q.text,
        options: q.options.map(opt => ({
          text: opt.text,
          type: opt.type_code || undefined,
          score: opt.score ?? undefined,
        })),
      }));

      const clientTestInfo = {
        id: testInfo.id,
        title: testInfo.title,
        subtitle: testInfo.subtitle,
        description: testInfo.description,
        emoji: testInfo.emoji,
        color: testInfo.color,
        duration: testInfo.duration,
        questionCount: testInfo.question_count,
        href: testInfo.href,
        features: testInfo.features,
        isAvailable: testInfo.is_available,
        category: testInfo.category,
      };

      return (
        <TestClient 
          testId={testId} 
          testInfo={clientTestInfo} 
          questions={questions} 
          seoArticle="" 
        />
      );
    }
  } catch {
    // 에러 발생 시 notFound 로 리다이렉트
  }

  return notFound();
}
