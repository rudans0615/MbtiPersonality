import type { Metadata } from "next";
import TetoEgenClient from "./TetoEgenClient";

export const metadata: Metadata = {
  title: "테토 vs 에겐 성향 진단 (테토남·테토녀·에겐남·에겐녀 테스트)",
  description: "21개 일상·연애 문항으로 알아보는 테토-에겐 밸런스 진단! 나의 추진력(테토)과 감성 공감력(에겐) 비율 및 연애 궁합을 확인해보세요.",
  alternates: { canonical: "/teto-egen" },
};

export default function TetoEgenPage() {
  return <TetoEgenClient />;
}
