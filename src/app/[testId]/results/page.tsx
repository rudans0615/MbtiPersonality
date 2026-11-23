import { getGenericScoring, resolveGenericResult } from "@/lib/customTests/resolveGenericResult";
import { getTests, getTestById, getResultTypes, getQuestionsWithOptions, type ResultType } from "@/lib/queries";
import ResultsClient from "./ResultsClient";
import { notFound } from "next/navigation";

export const revalidate = 60;

export async function generateStaticParams() {
  try {
    const tests = await getTests();
    return tests
      .filter(test => test.is_available && !["mbti", "teto-egen", "drunk"].includes(test.id))
      .map(test => ({ testId: test.id }));
  } catch {
    return [];
  }
}

export async function generateMetadata({
  params,
  searchParams,
}: {
  params: Promise<{ testId: string }>;
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { testId } = await params;
  const spObj = searchParams ? await searchParams : {};

  try {
    const testInfo = await getTestById(testId);
    if (!testInfo?.is_available) throw new Error("not found");

    let ogTitle = `${testInfo.title} 결과`;
    let ogDesc = `나의 ${testInfo.title} 결과를 확인해보세요!`;
    let ogImage = `/api/og?testId=${encodeURIComponent(testId)}`;

    // 공유 링크에 score/types 파라미터가 있으면 실제 결과별 동적 OG 이미지 생성
    const urlParams = new URLSearchParams();
    for (const [k, v] of Object.entries(spObj)) {
      if (typeof v === "string") urlParams.set(k, v);
      else if (Array.isArray(v) && v[0]) urlParams.set(k, v[0]);
    }
    if (urlParams.has("score") || urlParams.has("types")) {
      const [resultsData, questions] = await Promise.all([
        getResultTypes(testId).catch((): Record<string, ResultType> => ({})),
        getQuestionsWithOptions(testId).catch(() => []),
      ]);
      const resolution = resolveGenericResult(urlParams, resultsData, getGenericScoring(questions));
      if (!resolution.error && resultsData[resolution.key]) {
        const res = resultsData[resolution.key];
        ogTitle = `나의 ${testInfo.title} 결과: ${res.title}`;
        ogDesc = res.subtitle || (res.description || "").slice(0, 90) || ogDesc;
        ogImage = `/api/og?${new URLSearchParams({
          mode: "result",
          testTitle: testInfo.title,
          resultTitle: res.title,
          subtitle: res.subtitle || "너는 어떤 유형이 나올까?",
        }).toString()}`;
      }
    }

    return {
      title: ogTitle,
      description: ogDesc,
      alternates: { canonical: `/${testId}/results` },
      robots: { index: false, follow: true },
      openGraph: {
        title: ogTitle,
        description: ogDesc,
        images: [{ url: ogImage, width: 1200, height: 630, alt: ogTitle }],
      },
      twitter: {
        card: "summary_large_image",
        title: ogTitle,
        images: [ogImage],
      },
    };
  } catch {
    return { title: 'Results Not Found', robots: { index: false, follow: false } };
  }
}

export default async function ResultsPage({ params }: { params: Promise<{ testId: string }> }) {
  const { testId } = await params;

  // 1. DB에서 결과 유형 가져오기
  try {
    const testInfo = await getTestById(testId);
    const resultsData = await getResultTypes(testId);
    const questions = await getQuestionsWithOptions(testId);

    if (testInfo?.is_available && Object.keys(resultsData).length > 0) {
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
          scoring={getGenericScoring(questions)}
          availableTests={availableTests}
        />
      );
    }
  } catch {
    // 에러 발생 시 notFound 로 리다이렉트
  }

  return notFound();
}
