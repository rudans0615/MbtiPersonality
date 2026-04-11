import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { calculateHoguLevel, hoguResults } from "@/data/hoguTestTypes";
import { AdSenseBlock } from "@/components/AdSenseBlock";
import { CoupangRecommend } from "@/components/CoupangRecommend";
import { useABTesting } from "@/hooks/useABTesting";
import { trackEvent } from "@/lib/analytics";

export default function HoguResults() {
  const [location, setLocation] = useLocation();
  const [score, setScore] = useState<number>(0);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const scoreParam = params.get("score");
    
    if (!scoreParam) {
      setLocation("/hogu-test");
      return;
    }
    
    setScore(parseInt(scoreParam, 10));
  }, [location, setLocation]);

  // A/B 최적화 스캐너 가동: 배너의 위치 변인 통제 (50:50)
  const adLayoutVariant = useABTesting<'A_TOP' | 'B_BOTTOM'>({
    experimentId: 'coupang_banner_placement_001',
    variants: [
      { id: 'A_TOP', weight: 0.5 },
      { id: 'B_BOTTOM', weight: 0.5 }
    ]
  });

  const levelCode = calculateHoguLevel(score);
  const result = hoguResults[levelCode];

  // 테스트 완료 이벤트 로깅
  useEffect(() => {
    if (result) {
      trackEvent('test_complete', { 
        test_type: 'hogu', 
        result_code: result.code 
      });
    }
  }, [result]);

  if (!result || !adLayoutVariant) return null;

  const handleCopyLink = () => {
    const url = "https://mbtifinder.com/hogu-test";
    const text = `나의 연애 호구력은? [${result.title}]\n${result.memeText}\n테스트 해보기: ${url}`;
    
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      alert("결과 링크가 복사되었습니다!");
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50 pt-24 pb-12 px-4 selection:bg-rose-200">
      <div className="max-w-2xl mx-auto">
        <Card className="bg-white rounded-3xl shadow-xl overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-700">
          <CardContent className="p-8 md:p-12">
            
            {/* Header Area */}
            <div className="text-center mb-10">
              <div className="inline-flex items-center justify-center w-28 h-28 text-6xl bg-neutral-50 rounded-full shadow-inner mb-6 transition-transform hover:scale-110 duration-300">
                {result.emoji}
              </div>
              <p className="text-rose-500 font-bold mb-2 tracking-wider text-sm">{result.subtitle}</p>
              <h1 className="text-3xl md:text-4xl font-extrabold text-neutral-800 mb-4 keep-all leading-tight">
                {result.title}
              </h1>
              <p className="text-lg font-medium text-neutral-500 italic bg-neutral-50 py-3 px-6 rounded-xl inline-block mt-2">
                "{result.memeText}"
              </p>
            </div>

            {/* Description Area */}
            <div className="bg-neutral-50 rounded-2xl p-6 md:p-8 mb-8 text-neutral-700 leading-relaxed text-lg break-keep shadow-sm border border-neutral-100">
              {result.description}
            </div>

            {/* A/B Test Variant A: Coupang at TOP */}
            {adLayoutVariant === 'A_TOP' && (
              <CoupangRecommend keyword={result.title} title="나의 부족한 호구력을 채워줄(혹은 달래줄) 아이템" />
            )}

            {/* AdSense Block 1 */}
            <div className="my-8">
              <AdSenseBlock adSlot="1234567890" />
            </div>

            {/* Characteristics & Advice */}
            <div className="grid md:grid-cols-2 gap-6 mb-10">
              <div className="bg-white border-2 border-rose-100 rounded-2xl p-6 shadow-sm hover:border-rose-300 transition-colors">
                <h3 className="text-xl font-bold text-rose-600 mb-4 flex items-center">
                  <i className="fas fa-search mr-2"></i> 팩폭 특징
                </h3>
                <ul className="space-y-3">
                  {result.characteristics.map((char, i) => (
                    <li key={i} className="flex items-start">
                      <span className="text-rose-400 mr-2 mt-1"><i className="fas fa-check text-sm"></i></span>
                      <span className="text-neutral-700">{char}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-white border-2 border-emerald-100 rounded-2xl p-6 shadow-sm hover:border-emerald-300 transition-colors">
                <h3 className="text-xl font-bold text-emerald-600 mb-4 flex items-center">
                  <i className="fas fa-pills mr-2"></i> 연애 처방전
                </h3>
                <ul className="space-y-3">
                  {result.advice.map((adv, i) => (
                    <li key={i} className="flex items-start">
                      <span className="text-emerald-400 mr-2 mt-1"><i className="fas fa-plus text-sm"></i></span>
                      <span className="text-neutral-700">{adv}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* A/B Test Variant B: Coupang at BOTTOM (Original) */}
            {adLayoutVariant === 'B_BOTTOM' && (
              <CoupangRecommend keyword={result.title} title="나의 부족한 호구력을 채워줄(혹은 달래줄) 아이템" />
            )}

            {/* AdSense Block 2 */}
            <div className="my-8">
              <AdSenseBlock adSlot="0987654321" />
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-12 mb-4">
              <Button 
                onClick={handleCopyLink}
                size="lg"
                className="bg-neutral-900 hover:bg-black text-white rounded-2xl text-base font-semibold px-8 h-14 shadow-xl transition-all hover:scale-105 active:scale-95"
              >
                <i className="fas fa-link text-lg"></i>
                결과 복사하기
              </Button>
              <Button 
                onClick={() => setLocation("/hogu-test")}
                variant="outline"
                size="lg"
                className="border-2 border-rose-500 text-rose-600 hover:bg-rose-50 rounded-2xl text-base font-semibold px-8 h-14 bg-white shadow-lg transition-all hover:scale-105 active:scale-95"
              >
                <i className="fas fa-redo text-lg"></i>
                다시 진단하기
              </Button>
            </div>
            
            <div className="mt-6 text-center">
              <Button 
                onClick={() => setLocation("/")}
                variant="ghost"
                className="text-neutral-500 hover:text-neutral-800 underline-offset-4 hover:underline"
              >
                <i className="fas fa-home mr-2"></i> 메인으로 돌아가기
              </Button>
            </div>

          </CardContent>
        </Card>
      </div>
    </div>
  );
}
