import { useEffect, useState } from "react";
import SEO from "@/components/SEO";
import { useLocation } from "wouter";
import { dopamineTypes } from "@/data/dopamineTestTypes";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CoupangRecommend } from "@/components/CoupangRecommend";
import { ShareButtons } from "@/components/ShareButtons";
import Navigation from "@/components/Navigation";
import { AdSenseBlock } from "@/components/AdSenseBlock";
import RelatedTests from "@/components/RelatedTests";
import { ResultImageCard } from "@/components/ResultImageCard";
import { testTypes } from "@/data/testTypes";

import { useToast } from "@/hooks/use-toast";
import { RotateCcw, Heart, Sparkles, Zap } from "lucide-react";

export default function DopamineResults() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [testResult, setTestResult] = useState<any>(null);

  useEffect(() => {
    const result = sessionStorage.getItem('dopamineResult');
    if (!result) {
      setLocation('/dopamine-test');
      return;
    }
    setTestResult(JSON.parse(result));
  }, [setLocation]);

  const handleRestart = () => {
    sessionStorage.removeItem('dopamineResult');
    setLocation('/dopamine-test');
  };

  const fallbackCopyTextToClipboard = (text: string) => {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    textArea.style.top = "0";
    textArea.style.left = "0";
    textArea.style.position = "fixed";
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
      document.execCommand('copy');
      toast({
        title: "링크가 복사되었습니다!",
        description: "친구들에게 나의 도파민 유형을 자랑해보세요 🤍",
      });
    } catch (err) {
      toast({
        title: "복사 실패",
        description: "수동으로 링크를 복사해주세요.",
        variant: "destructive"
      });
    }
    document.body.removeChild(textArea);
  };

  const handleShare = (platform: string) => {
    if (!testResult) return;
    
    const typeData = dopamineTypes[testResult.type];
    const currentUrl = 'https://mbtifinder.com/dopamine-test';
    const shareText = `나의 도파민 중독 유형은 '${typeData.title}' 입니다! 💉 너의 도파민 원천은 뭐야? 알아보기 👉`;
    const encodedUrl = encodeURIComponent(currentUrl);
    const encodedText = encodeURIComponent(shareText);

    if (platform === 'native' && 'share' in navigator && navigator.share) {
      navigator.share({
        title: `도파민 주입 테스트: ${typeData.title}`,
        text: shareText,
        url: currentUrl
      }).catch(err => {
        console.log('Share failed:', err);
      });
      return;
    }

    switch (platform) {
      case 'copy':
        const shareMessage = `${shareText}\n\n${currentUrl}`;
        if (navigator.clipboard && window.isSecureContext) {
          navigator.clipboard.writeText(shareMessage).then(() => {
            toast({
              title: "링크가 복사되었습니다!",
              description: "친구들에게 나의 도파민 유형을 자랑해보세요 🤍",
            });
          }).catch(() => {
            fallbackCopyTextToClipboard(shareMessage);
          });
        } else {
          fallbackCopyTextToClipboard(shareMessage);
        }
        break;
    }
  };

  if (!testResult) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-pink-50">
        <div className="animate-spin text-4xl">⏳</div>
      </div>
    );
  }

  const typeData = dopamineTypes[testResult.type];
  const bestPartnerType = typeData.compatibility.best;
  const bestPartner = dopamineTypes[bestPartnerType];

  return (
    <div className="min-h-screen bg-pink-50/30">
      <SEO title="나의 도파민 중독 유형 결과" description="도파민 원천 분석 결과입니다." />
      <Navigation />
      
      {/* Results Header */}
      <div className="bg-gradient-to-br from-pink-300 via-purple-300 to-indigo-300 text-white py-20 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10 blur-sm pointer-events-none transform rotate-12">
          <i className="fas fa-bolt text-[150px]"></i>
        </div>
        <div className="max-w-3xl mx-auto px-6 text-center relative z-10">
          <div className="animate-bounce-in">
            <h1 className="text-xl md:text-2xl font-semibold mb-4 tracking-wider opacity-90 drop-shadow-md">도파민 분석 완료! 💉</h1>
            <p className="text-lg opacity-80 mb-2">당신을 춤추게 하는 도파민의 원천은...</p>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 py-12">
        {/* Main Result Card */}
        <Card className="bg-white/80 backdrop-blur-xl border border-white/60 rounded-[2.5rem] shadow-[0_8px_32px_rgba(236,72,153,0.1)] p-8 md:p-12 -mt-24 relative z-20 animate-slide-up overflow-hidden">
          <CardContent className="p-0">
            <div className="text-center mb-10">
              <div className="inline-flex items-center justify-center w-28 h-28 bg-white rounded-full text-5xl mb-6 shadow-xl border-4 border-pink-100">
                {typeData.emoji}
              </div>
              <p className="text-xl text-pink-500 font-bold tracking-wide mb-2">
                {typeData.subtitle}
              </p>
              <h2 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-neutral-800 to-neutral-600 mb-6 tracking-tight pb-2">
                {typeData.title}
              </h2>
              
              <div className="bg-neutral-50/80 rounded-2xl p-6 text-left border border-neutral-100 shadow-sm mb-8">
                <p className="text-[1.05rem] text-neutral-700 leading-relaxed font-medium">
                  {typeData.description}
                </p>
              </div>
            </div>

            {/* Result Image Card - saveable for Instagram Stories */}
            <ResultImageCard
              testTitle="도파민 중독 유형 테스트"
              resultTitle={typeData.title}
              resultEmoji={typeData.emoji}
              resultSubtitle={typeData.subtitle}
              characteristics={typeData.characteristics}
            />

            {/* AdSense Placement */}
            <AdSenseBlock adSlot="8811223344" />

            {/* Characteristics 폭행 */}
            <div className="mb-10 mt-6">
              <h3 className="text-xl font-bold text-neutral-800 mb-5 flex items-center justify-center">
                <Zap className="mr-2 text-yellow-400 fill-yellow-400" size={24} />
                순살 조심! 뼈때리는 팩트 모음
              </h3>
              <div className="grid md:grid-cols-2 gap-3">
                {typeData.characteristics.map((trait, index) => (
                  <div key={index} className="flex items-start p-4 bg-pink-50/50 rounded-2xl border border-pink-100/50 hover:bg-pink-100/50 transition-colors">
                    <span className="text-pink-400 mr-2 flex-shrink-0 mt-0.5">💥</span>
                    <span className="text-[0.95rem] text-neutral-700 font-medium leading-snug">{trait}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Celebrity Examples */}
            <div className="mb-10">
              <h3 className="text-[1.1rem] font-bold text-neutral-800 mb-4 flex items-center justify-center">
                나와 같은 도파민 메이트 🤔
              </h3>
              <div className="flex flex-wrap justify-center gap-2">
                {typeData.celebrities.map((celebrity, index) => (
                  <span 
                    key={index} 
                    className="px-4 py-1.5 rounded-full text-[0.9rem] font-bold text-white shadow-md shadow-pink-200/50"
                    style={{ backgroundColor: typeData.color }}
                  >
                    {celebrity}
                  </span>
                ))}
              </div>
            </div>

            {/* 궁합 */}
            {bestPartner && (
              <div className="mb-10 bg-gradient-to-br from-rose-50 to-pink-50 rounded-[2rem] p-6 text-center border border-pink-100">
                <h3 className="text-lg font-bold text-rose-500 mb-4 flex items-center justify-center">
                  <Heart className="mr-2 fill-rose-500" size={20} />
                  가장 찰떡인 도파민 소울메이트
                </h3>
                <div className="flex items-center justify-center space-x-4 mb-2">
                  <div className="text-3xl bg-white p-3 rounded-full shadow-sm">{typeData.emoji}</div>
                  <div className="text-xl text-rose-400 font-bold">+</div>
                  <div className="text-3xl bg-white p-3 rounded-full shadow-sm">{bestPartner.emoji}</div>
                </div>
                <div className="font-extrabold text-rose-600 text-xl mt-3">
                  {bestPartner.title}
                </div>
              </div>
            )}

            {/* 쿠팡 파트너스 추천 상품 영역 */}
            <div className="mt-12 mb-8">
              <CoupangRecommend 
                keyword={typeData.coupangKeyword} 
                title={`🎀 ${typeData.title}를 위한 도파민 충전템`} 
              />
            </div>

            {/* AdSense Placement */}
            <AdSenseBlock adSlot="9922334455" />

            {/* Share */}
            <div className="text-center space-y-5 mt-10">
              <h3 className="text-lg font-bold text-neutral-600">내 중독 결과 동네방네 자랑하기</h3>
              <div className="flex justify-center space-x-3 flex-wrap gap-y-3">
                {'share' in navigator && (
                  <Button
                    onClick={() => handleShare('native')}
                    className="bg-neutral-800 text-white px-6 py-6 rounded-2xl hover:bg-neutral-900 transition-all hover:-translate-y-1 shadow-lg"
                  >
                    <i className="fas fa-share-nodes text-xl mr-2"></i>공유하기
                  </Button>
                )}
                <Button
                  onClick={() => handleShare('copy')}
                  className="bg-white text-neutral-800 border-2 border-neutral-200 px-6 py-6 rounded-2xl hover:border-neutral-300 hover:bg-neutral-50 transition-all hover:-translate-y-1 shadow-sm"
                >
                  <i className="fas fa-link text-xl mr-2"></i>링크 복사
                </Button>
              </div>
            </div>

            <div className="mt-8 flex justify-center pb-4">
              <Button
                onClick={handleRestart}
                className="bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-400 text-white px-10 py-6 rounded-2xl text-[1.1rem] font-bold hover:shadow-lg transition-transform hover:-translate-y-1 border-2 border-white/50 w-full"
              >
                <RotateCcw size={20} className="mr-2" />
                테스트 다시하기
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* All Types Overview */}
        <div className="mt-12 mb-6 text-center">
          <h3 className="text-2xl font-bold text-neutral-800">모든 도파민 중독 유형 모아보기</h3>
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          {Object.values(dopamineTypes).map((type) => (
            <div 
              key={type.code}
              className={`p-6 rounded-[1.5rem] bg-white border-2 transition-all duration-300 shadow-sm hover:shadow-md cursor-default ${
                type.code === testResult.type 
                  ? 'border-pink-400 shadow-pink-100' 
                  : 'border-white hover:border-pink-200'
              }`}
            >
              <div className="flex items-center space-x-4 mb-3">
                <div className="text-4xl bg-neutral-50 p-2 rounded-2xl">{type.emoji}</div>
                <div>
                  <div className="text-sm font-bold text-neutral-500 mb-0.5">{type.subtitle}</div>
                  <div className="font-extrabold text-xl" style={{ color: type.color }}>{type.title}</div>
                </div>
              </div>
              <p className="text-[0.9rem] text-neutral-600 font-medium leading-relaxed line-clamp-2">{type.description}</p>
            </div>
          ))}
        </div>

        <RelatedTests currentTestId="dopamine" />

        <AdSenseBlock adSlot="1133557799" />
      </div>
    </div>
  );
}
