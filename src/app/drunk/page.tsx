import type { Metadata } from "next";
import DrunkClient from "./DrunkClient";

export const metadata: Metadata = {
  title: "나 술 취했나? 자가진단 테스트",
  description: "술자리 행동 패턴 10문항으로 현재 취함 단계와 주사 스타일을 유쾌하게 확인해보는 자가진단 테스트입니다.",
  alternates: { canonical: "/drunk" },
};

export default function DrunkPage() {
  return <DrunkClient />;
}
