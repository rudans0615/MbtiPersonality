import type { Metadata } from "next";
import TestClient from "./TestClient";
import { isValidMbtiCode } from "@/lib/customTests/mbtiCompatibility";
import { mbtiTypes } from "@/lib/customTests/mbtiTypes";

export async function generateMetadata({
  searchParams,
}: {
  searchParams?: Promise<{ from?: string; name?: string }>;
}): Promise<Metadata> {
  const params = searchParams ? await searchParams : {};
  const fromUpper = (params.from || "").toUpperCase();
  const name = (params.name || "").trim().slice(0, 12);

  if (isValidMbtiCode(fromUpper)) {
    const sender = name ? `${name}(${fromUpper})` : `${fromUpper}(${mbtiTypes[fromUpper].title})`;
    const ogParams = new URLSearchParams({ mode: "invite", from: fromUpper });
    if (name) ogParams.set("name", name);
    const ogUrl = `/api/og?${ogParams.toString()}`;

    return {
      title: `${sender}님과의 MBTI 2인 궁합 검사`,
      description: `${sender}님이 MBTI 궁합 비교에 초대했어요! 60문항 무료 검사를 완료하면 둘의 궁합 점수와 대화법 리포트가 바로 열립니다.`,
      alternates: { canonical: "/test" },
      openGraph: {
        title: `${sender}님과 나의 MBTI 궁합은 몇 점일까?`,
        description: "지금 60문항 MBTI 검사하고 2인 궁합 리포트를 바로 확인해보세요!",
        url: `https://mbtifinder.com/test?${ogParams.toString()}`,
        images: [{ url: ogUrl, width: 1200, height: 630, alt: `${sender} MBTI 궁합 초대` }],
      },
      twitter: {
        card: "summary_large_image",
        title: `${sender}님과 나의 MBTI 궁합은 몇 점일까?`,
        images: [ogUrl],
      },
    };
  }

  return {
    title: "MBTI 성격유형 검사 (무료 60문항)",
    description:
      "외향·내향, 감각·직관, 사고·감정, 판단·인식 4가지 지표로 16가지 성격유형을 분석하는 무료 60문항 MBTI 성격유형 검사입니다.",
    alternates: { canonical: "/test" },
    openGraph: {
      title: "무료 60문항 MBTI 성격유형 검사 | MBTI Finder",
      description: "외향·내향, 감각·직관, 사고·감정, 판단·인식 4가지 지표로 나의 16유형을 정확하게 분석해보세요.",
      images: [
        {
          url: "/api/og?mode=result&testTitle=MBTI+성격유형+검사&resultTitle=나의+진짜+MBTI는%3F&subtitle=무료+60문항+정밀+성격+분석",
          width: 1200,
          height: 630,
        },
      ],
    },
  };
}

export default async function TestPage({
  searchParams,
}: {
  searchParams?: Promise<{ from?: string; name?: string }>;
}) {
  const params = searchParams ? await searchParams : {};
  const fromUpper = (params.from || "").toUpperCase();
  const inviteFrom = isValidMbtiCode(fromUpper) ? fromUpper : undefined;
  const inviteName = (params.name || "").trim().slice(0, 12) || undefined;

  return <TestClient inviteFrom={inviteFrom} inviteName={inviteName} />;
}
