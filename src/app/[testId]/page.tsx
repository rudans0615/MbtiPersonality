import { testTypes } from "@/data/testTypes";
import TestClient from "./TestClient";

export async function generateStaticParams() {
  // 모든 사용 가능한 테스트 ID를 가져와 정적 페이지로 빌드합니다.
  return testTypes
    .filter(test => test.isAvailable && test.id !== "mbti") // mbti는 커스텀 컴포넌트를 사용하므로 제외 (임시)
    .map(test => ({
      testId: test.id,
    }));
}

export async function generateMetadata({ params }: { params: Promise<{ testId: string }> }) {
  const { testId } = await params;
  const testInfo = testTypes.find(t => t.id === testId);
  
  if (!testInfo) {
    return { title: 'Test Not Found' };
  }

  return {
    title: testInfo.title,
    description: testInfo.description,
    keywords: `${testInfo.category}, 심리테스트, ${testInfo.title.replace(/ /g, ', ')}`,
    openGraph: {
      title: testInfo.title,
      description: testInfo.description,
    }
  };
}

export default async function TestPage({ params }: { params: Promise<{ testId: string }> }) {
  const { testId } = await params;
  const testInfo = testTypes.find(t => t.id === testId);

  if (!testInfo) {
    return <div className="min-h-screen flex items-center justify-center">Test Not Found</div>;
  }

  // 동적 임포트로 해당 테스트의 데이터를 불러옵니다.
  let questionsData;
  try {
    questionsData = await import(`@/data/${testId}Questions`);
  } catch (e) {
    return <div className="min-h-screen flex items-center justify-center">Test Data Not Found</div>;
  }

  const questionsKey = Object.keys(questionsData).find(key => key.endsWith('Questions')) || `${testId}Questions`;
  const questions = questionsData[questionsKey] || [];
  const seoArticle = questionsData.seoArticle || '';

  return (
    <TestClient 
      testId={testId} 
      testInfo={testInfo} 
      questions={questions} 
      seoArticle={seoArticle} 
    />
  );
}
