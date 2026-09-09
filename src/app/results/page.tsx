import type { Metadata } from 'next';
import ResultsClient from './ResultsClient';
export const metadata: Metadata = {
  title: 'MBTI 검사 결과',
  alternates: { canonical: '/results' },
  robots: { index: false, follow: true },
};
export default function ResultsPage() { return <ResultsClient />; }
