import type { Metadata } from "next";
import TestClient from "./TestClient";

export const metadata: Metadata = {
  title: "MBTI 성격유형 검사 (무료 60문항)",
  description: "외향·내향, 감각·직관, 사고·감정, 판단·인식 4가지 지표로 16가지 성격유형을 분석하는 무료 60문항 MBTI 성격유형 검사입니다.",
  alternates: { canonical: "/test" },
};

export default function TestPage() {
  return <TestClient />;
}
