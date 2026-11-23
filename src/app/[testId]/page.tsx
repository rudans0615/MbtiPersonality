import type { Metadata } from "next";
import { getTests, getTestById, getQuestionsWithOptions, getResultTypes } from "@/lib/queries";
import { buildTestGuide } from "@/lib/customTests/testGuides";
import TestClient from "./TestClient";
import { notFound } from "next/navigation";

export const revalidate = 60;

export async function generateStaticParams() {
  try {
    const tests = await getTests();
    return tests
      .filter((test) => test.is_available && !["mbti", "teto-egen", "drunk"].includes(test.id))
      .map((test) => ({ testId: test.id }));
  } catch {
    return [];
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ testId: string }>;
}): Promise<Metadata> {
  const { testId } = await params;

  try {
    const testInfo = await getTestById(testId);
    if (!testInfo?.is_available) throw new Error("not found");
    const desc =
      testInfo.description ||
      `${testInfo.title} — ${testInfo.question_count || 12}문항 무료 심리테스트로 나의 성향과 결과 유형을 확인해보세요.`;
    return {
      title: testInfo.title,
      description: desc,
      keywords: [testInfo.category, "심리테스트", "성향 테스트", testInfo.title],
      alternates: { canonical: `/${testId}` },
      openGraph: {
        title: `${testInfo.title} | MBTI Finder`,
        description: desc,
        url: `https://mbtifinder.com/${testId}`,
        images: [{ url: `/api/og?testId=${encodeURIComponent(testId)}`, width: 1200, height: 630 }],
      },
      twitter: {
        card: "summary_large_image",
        images: [`/api/og?testId=${encodeURIComponent(testId)}`],
      },
    };
  } catch {
    return { title: "테스트를 찾을 수 없습니다", robots: { index: false, follow: false } };
  }
}

export default async function TestPage({ params }: { params: Promise<{ testId: string }> }) {
  const { testId } = await params;

  try {
    const [testInfo, dbQuestions, resultsData] = await Promise.all([
      getTestById(testId),
      getQuestionsWithOptions(testId),
      getResultTypes(testId).catch(() => ({})),
    ]);

    if (testInfo?.is_available && dbQuestions.length > 0) {
      const questions = dbQuestions.map((q) => ({
        id: q.question_number,
        text: q.text,
        question: q.text,
        options: q.options.map((opt) => ({
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
        questionCount: testInfo.question_count || questions.length,
        href: testInfo.href,
        features: testInfo.features,
        isAvailable: testInfo.is_available,
        category: testInfo.category,
      };

      const guide = buildTestGuide(testInfo, resultsData, questions.length);

      return (
        <TestClient
          testId={testId}
          testInfo={clientTestInfo}
          questions={questions}
          guide={guide}
        />
      );
    }
  } catch {
    // 에러 발생 시 notFound
  }

  return notFound();
}
