import { testTypes } from "@/data/testTypes";
import ResultsClient from "./ResultsClient";

export async function generateStaticParams() {
  return testTypes
    .filter(test => test.isAvailable && test.id !== "mbti")
    .map(test => ({
      testId: test.id,
    }));
}

export async function generateMetadata({ params }: { params: Promise<{ testId: string }> }) {
  const { testId } = await params;
  const testInfo = testTypes.find(t => t.id === testId);
  
  if (!testInfo) {
    return { title: 'Results Not Found' };
  }

  return {
    title: `${testInfo.title} 결과`,
    description: `나의 ${testInfo.title} 결과를 확인해보세요!`,
  };
}

export default async function ResultsPage({ params }: { params: Promise<{ testId: string }> }) {
  const { testId } = await params;
  const testInfo = testTypes.find(t => t.id === testId);

  if (!testInfo) {
    return <div className="min-h-screen flex items-center justify-center">Test Not Found</div>;
  }

  let typesData;
  let questionsData;
  try {
    typesData = await import(`@/data/${testId}Types`);
    questionsData = await import(`@/data/${testId}Questions`);
  } catch (e) {
    return <div className="min-h-screen flex items-center justify-center">Result Data Not Found</div>;
  }

  const resultsDataKey = Object.keys(typesData).find(key => key.endsWith('Results')) || `${testId}Results`;
  const resultsData = typesData[resultsDataKey];
  
  const calculateLevelKey = Object.keys(typesData).find(key => key.startsWith('calculate'));
  const calculateLevel = calculateLevelKey ? typesData[calculateLevelKey] : () => Object.keys(resultsData)[0];
  const allKeys = Object.keys(resultsData || {});
  const questions = questionsData[`${testId}Questions`] || [];

  return (
    <ResultsClient 
      testId={testId}
      testInfo={testInfo}
      allKeys={allKeys}
      resultsData={resultsData}
      qLen={questions.length}
    />
  );
}
