import type { Metadata } from "next";
import { getTests } from "@/lib/queries";
import DrunkClient from "./DrunkClient";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "나 술 취했나? 자가진단 테스트",
  description: "술자리 행동 패턴 10문항으로 현재 취함 단계와 주사 스타일을 유쾌하게 확인해보는 자가진단 테스트입니다.",
  alternates: { canonical: "/drunk" },
};

export default async function DrunkPage() {
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

  return <DrunkClient availableTests={availableTests} />;
}
