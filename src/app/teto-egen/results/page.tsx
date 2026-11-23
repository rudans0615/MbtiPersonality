import type { Metadata } from "next";
import { getTests } from "@/lib/queries";
import TetoEgenResultsClient from "./TetoEgenResultsClient";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "테토 vs 에겐 진단 결과",
  description: "테토-에겐 성향 진단 결과 페이지입니다.",
  alternates: { canonical: "/teto-egen/results" },
  robots: { index: false, follow: true },
};

export default async function TetoEgenResultsPage() {
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

  return <TetoEgenResultsClient availableTests={availableTests} />;
}
