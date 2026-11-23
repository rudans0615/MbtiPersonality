import type { Metadata } from "next";
import TetoEgenResultsClient from "./TetoEgenResultsClient";

export const metadata: Metadata = {
  title: "테토 vs 에겐 진단 결과",
  description: "테토-에겐 성향 진단 결과 페이지입니다.",
  alternates: { canonical: "/teto-egen/results" },
  robots: { index: false, follow: true },
};

export default function TetoEgenResultsPage() {
  return <TetoEgenResultsClient />;
}
