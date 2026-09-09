"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import ResultCard from '@/components/ResultCard';
import { mbtiTypes } from '@/lib/customTests/mbtiTypes';

export default function ResultsClient() {
  const router = useRouter();
  const [code, setCode] = useState<string | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState('');
  useEffect(() => {
    try {
      const value = sessionStorage.getItem('mbtiResult');
      if (value && Object.prototype.hasOwnProperty.call(mbtiTypes, value)) setCode(value);
    } catch { /* The start prompt also handles unavailable storage. */ }
    setLoaded(true);
  }, []);
  if (!loaded) return <p role="status" className="p-12 text-center">결과를 불러오는 중입니다.</p>;
  if (!code) return <section className="max-w-3xl mx-auto px-6 pt-28 pb-12 text-center">
    <h1 className="text-2xl font-bold mb-4">저장된 검사 결과가 없습니다</h1>
    <p className="mb-6">결과가 없거나 읽을 수 없습니다. MBTI 검사를 시작해주세요.</p>
    <Link href="/test" className="underline text-primary">MBTI 검사 시작하기</Link>
  </section>;
  const restart = () => {
    try { sessionStorage.removeItem('mbtiResult'); router.push('/test'); }
    catch { setError('저장 결과를 지우지 못했습니다. 브라우저의 저장소 사용을 허용한 뒤 다시 시도해주세요.'); }
  };
  return <section className="max-w-4xl mx-auto px-4 pt-24 pb-12">
    <h1 className="text-3xl font-bold text-center mb-24">MBTI 검사 결과</h1>
    {error && <p role="alert" className="mb-4 text-red-700">{error}</p>}
    <ResultCard mbtiType={mbtiTypes[code]} onRestart={restart} onShare={() => {}} />
  </section>;
}
