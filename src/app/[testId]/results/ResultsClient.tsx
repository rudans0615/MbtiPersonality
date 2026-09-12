"use client";

import { useRef, useEffect, Suspense } from "react";
import { resolveGenericResult } from "@/lib/customTests/resolveGenericResult";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CoupangRecommend } from "@/components/CoupangRecommend";
import { ShareButtons } from "@/components/ShareButtons";
import { AdSenseBlock } from "@/components/AdSenseBlock";
import { ResultImageCard } from "@/components/ResultImageCard";
import RelatedTests from "@/components/RelatedTests";
import { Loader2, RotateCcw, Zap } from "lucide-react";

function ResultsContent({ testId, testInfo, allKeys, resultsData, qLen, scoring, availableTests }: any) {
  const searchParams = useSearchParams();
  const resolution = resolveGenericResult(searchParams, resultsData, scoring);
  const resultKey = resolution.key;
  const reported = useRef(new Set<string>());
  const query = searchParams.toString();
  useEffect(() => {
    const eventKey = JSON.stringify([testId, query]);
    if (resultKey && !reported.current.has(eventKey) && typeof window.gtag === 'function') {
      reported.current.add(eventKey);
      window.gtag('event', 'test_completed', { test_id: testId, questions_count: qLen });
    }
  }, [resultKey, query, testId, qLen]);

  if (resolution.error) return <section className="max-w-3xl mx-auto px-6 pt-28 pb-12 text-center">
    <h1 className="text-2xl font-bold mb-4">{resolution.error === 'unavailable' ? '결과를 제공할 수 없습니다' : '검사 결과를 확인할 수 없습니다'}</h1>
    <p className="mb-6">{resolution.error === 'unavailable' ? '이 검사의 결과 정보를 확인 중입니다. 다른 테스트를 이용해주세요.' : '답변 정보가 없거나 올바르지 않습니다. 검사를 처음부터 진행해주세요.'}</p>
    <Link href={resolution.error === 'unavailable' ? '/' : testInfo.href || '/' + testId} className="text-primary underline">
      {resolution.error === 'unavailable' ? '다른 테스트 보기' : '검사 시작하기'}
    </Link>
  </section>;
  const result = resultsData[resolution.key];

  return (
    <>
      <div className="bg-gradient-to-br from-pink-300 via-purple-300 to-indigo-300 text-white pt-28 pb-32 relative overflow-hidden w-full">
        <div className="max-w-3xl mx-auto px-6 text-center relative z-10">
          <h1 className="text-xl md:text-2xl font-semibold mb-4 tracking-wider opacity-90 drop-shadow-md">{testInfo.title} 결과 💫</h1>
          <p className="text-lg opacity-80">선택한 답변에 따른 결과입니다</p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 py-12 w-full">
        <div className="bg-white/80 backdrop-blur-xl border border-white/60 rounded-[2.5rem] shadow-[0_8px_32px_rgba(236,72,153,0.1)] p-8 md:p-12 -mt-24 relative z-20 overflow-hidden">
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-28 h-28 bg-white rounded-full text-5xl mb-6 shadow-xl border-4 border-pink-100">
              {result.emoji || "✨"}
            </div>
            {result.subtitle && <p className="text-xl text-pink-500 font-bold tracking-wide mb-2">{result.subtitle}</p>}
            <h2 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-neutral-800 to-neutral-600 mb-6 tracking-tight pb-2">{result.title}</h2>
            <div className="bg-neutral-50/80 rounded-2xl p-6 text-left border border-neutral-100 shadow-sm mb-8">
              <p className="text-[1.05rem] text-neutral-700 leading-relaxed font-medium">{result.description}</p>
            </div>
          </div>

          <p className="text-sm text-neutral-500 mb-6">재미와 자기이해를 위한 참고용 테스트이며, 전문적인 심리 평가나 의학적 진단을 대신하지 않습니다.</p>

          <ResultImageCard
            testTitle={testInfo.title}
            resultTitle={result.title}
            resultEmoji={result.emoji || "✨"}
            resultSubtitle={result.subtitle}
            characteristics={result.characteristics}
          />

          <AdSenseBlock adSlot="8811223344" />

          {result.characteristics && result.characteristics.length > 0 && (
            <div className="mb-10 mt-6">
              <h3 className="text-xl font-bold text-neutral-800 mb-5 flex items-center justify-center">
                <Zap className="mr-2 text-yellow-400 fill-yellow-400" size={24} />
                이 유형의 특징
              </h3>
              <div className="grid md:grid-cols-2 gap-3">
                {result.characteristics.map((trait: string, index: number) => (
                  <div key={index} className="flex items-start p-4 bg-pink-50/50 rounded-2xl border border-pink-100/50 hover:bg-pink-100/50 transition-colors">
                    <span className="text-pink-400 mr-2 flex-shrink-0 mt-0.5">💥</span>
                    <span className="text-[0.95rem] text-neutral-700 font-medium leading-snug">{trait}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="mt-12 mb-8">
            <CoupangRecommend 
              keyword={result.coupang_keyword || result.title} 
              title={`🎀 ${result.title}를 위한 찰떡 추천템`} 
            />
          </div>

          <AdSenseBlock adSlot="9922334455" />

          <div className="text-center space-y-5 mt-10">
            <ShareButtons title={`${testInfo.title} 결과`} shareText={`나의 검사 결과는 '${result.title}'! 너도 해봐 👉`} url={`https://mbtifinder.com/${testId}`} />
          </div>

          <div className="mt-8 flex justify-center pb-4">
            <Link href={`/${testId}`} className="w-full">
              <Button className="bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-400 text-white px-10 py-6 rounded-2xl text-[1.1rem] font-bold hover:shadow-lg transition-transform hover:-translate-y-1 border-2 border-white/50 w-full">
                <RotateCcw size={20} className="mr-2" /> 테스트 다시하기
              </Button>
            </Link>
          </div>
        </div>

        {/* All Types Overview */}
        <div className="mt-12 mb-6 text-center">
          <h3 className="text-2xl font-bold text-neutral-800">모든 유형 모아보기</h3>
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          {allKeys.map((key: string) => {
            const type = resultsData[key];
            return (
              <div key={key} className={`p-6 rounded-[1.5rem] bg-white border-2 transition-all duration-300 shadow-sm hover:shadow-md cursor-default ${key === resultKey ? "border-pink-400 shadow-pink-100" : "border-white hover:border-pink-200"}`}>
                <div className="flex items-center space-x-4 mb-3">
                  <div className="text-4xl bg-neutral-50 p-2 rounded-2xl">{type.emoji || "✨"}</div>
                  <div>
                    {type.subtitle && <div className="text-sm font-bold text-neutral-500 mb-0.5">{type.subtitle}</div>}
                    <div className="font-extrabold text-xl text-pink-500">{type.title}</div>
                  </div>
                </div>
                <p className="text-[0.9rem] text-neutral-600 font-medium leading-relaxed line-clamp-2">{type.description}</p>
              </div>
            );
          })}
        </div>

        <RelatedTests currentTestId={testId} availableTests={availableTests} />

        <AdSenseBlock adSlot="1133557799" />
      </div>
    </>
  );
}

export default function ResultsClient(props: any) {
  return (
    <Suspense fallback={<div role="status" className="min-h-screen flex flex-col gap-4 items-center justify-center"><Loader2 className="animate-spin text-pink-400 h-10 w-10" /><p>결과를 불러오는 중입니다.</p></div>}>
      <ResultsContent {...props} />
    </Suspense>
  );
}
