import { getTests, getTestById, getResultTypes, getQuestionsWithOptions } from "@/lib/queries";
import ResultsClient from "./ResultsClient";
import { notFound } from "next/navigation";

export const revalidate = 3600;

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
      title: `${testInfo.title} 결과`,
      description: `나의 ${testInfo.title} 결과를 확인해보세요!`,
    };
  } catch {
    return { title: 'Results Not Found' };
  }
}

export default async function ResultsPage({ params }: { params: Promise<{ testId: string }> }) {
  const { testId } = await params;

  // 1. DB에서 결과 유형 가져오기
  try {
    const testInfo = await getTestById(testId);
    const resultsData = await getResultTypes(testId);
    const questions = await getQuestionsWithOptions(testId);

    if (testInfo && Object.keys(resultsData).length > 0) {
      const allKeys = Object.keys(resultsData);
      const clientTestInfo = {
        id: testInfo.id,
        title: testInfo.title,
        subtitle: testInfo.subtitle,
        description: testInfo.description,
        emoji: testInfo.emoji,
        color: testInfo.color,
        href: testInfo.href,
        isAvailable: testInfo.is_available,
        category: testInfo.category,
      };

      const allTests = await getTests();
      const availableTests = allTests.map((t: any) => ({
        id: t.id,
        category: t.category,
        title: t.title,
        subtitle: t.subtitle,
        description: t.description,
        emoji: t.emoji,
        color: t.color,
        duration: t.duration,
        questions: t.question_count,
        href: t.href,
        features: t.features,
        isAvailable: t.is_available,
        displayOrder: t.display_order,
      }));

      return (
        <ResultsClient 
          testId={testId}
          testInfo={clientTestInfo}
          allKeys={allKeys}
          resultsData={resultsData}
          qLen={questions.length}
          availableTests={availableTests}
        />
      );
    }
  } catch {
    // 에러 발생 시 notFound 로 리다이렉트
  }

  return notFound();
}
