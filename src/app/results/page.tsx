import type { Metadata } from "next";
import { getTests } from "@/lib/queries";
import ResultsClient from "./ResultsClient";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "MBTI 검사 결과",
  alternates: { canonical: "/results" },
  robots: { index: false, follow: true },
};

export default async function ResultsPage() {
  const allTests = await getTests().catch(() => []);
  const availableTests = allTests.map((t: any) => ({
    id: t.id,
    category: t.category,
    title: t.title,
    subtitle: t.subtitle,
    description: t.description,
    emoji: t.emoji,
    color: t.color,
    duration: t.duration,
    questionCount: t.question_count,
    href: t.href,
    isAvailable: t.is_available,
  }));

  return <ResultsClient availableTests={availableTests} />;
}
