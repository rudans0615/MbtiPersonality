import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { mbtiTypes, getTypesByGroup } from "@/data/mbtiTypes";
import { Card, CardContent } from "@/components/ui/card";
import ResultCard from "@/components/ResultCard";
import AdSense from "@/components/AdSense";
import { useToast } from "@/hooks/use-toast";

export default function Results() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [mbtiResult, setMbtiResult] = useState<string | null>(null);

  useEffect(() => {
    const result = sessionStorage.getItem('mbtiResult');
    if (!result) {
      setLocation('/');
      return;
    }
    setMbtiResult(result);
  }, [setLocation]);

  const handleRestart = () => {
    sessionStorage.removeItem('mbtiResult');
    setLocation('/');
  };

  const handleShare = (platform: string) => {
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent(`나의 MBTI 성격유형은 ${mbtiResult}입니다! 당신도 확인해보세요!`);

    switch (platform) {
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}&quote=${text}`, '_blank');
        break;
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?url=${url}&text=${text}`, '_blank');
        break;
      case 'copy':
        navigator.clipboard.writeText(window.location.href).then(() => {
          toast({
            title: "링크가 복사되었습니다!",
            description: "친구들과 공유해보세요.",
          });
        });
        break;
    }
  };

  const showTypeInfo = (type: string) => {
    toast({
      title: `${type} 유형`,
      description: `${mbtiTypes[type]?.title || '알 수 없는 유형'}에 대한 자세한 정보`,
    });
  };

  if (!mbtiResult || !mbtiTypes[mbtiResult]) {
    return <div>Loading...</div>;
  }

  const typeData = mbtiTypes[mbtiResult];
  const typeGroups = getTypesByGroup();

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Results Header */}
      <div className="gradient-bg text-white py-16">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <div className="animate-bounce-in">
            <div className="text-6xl mb-6">{typeData.emoji}</div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">검사 완료!</h1>
            <p className="text-xl opacity-90">당신의 성격유형을 분석했습니다</p>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Personality Type Card */}
        <ResultCard
          mbtiType={typeData}
          onRestart={handleRestart}
          onShare={handleShare}
        />

        {/* AdSense - Bottom */}
        <AdSense 
          adSlot="1234567892"
          className="mt-8"
        />

        {/* All MBTI Types Reference */}
        <Card className="bg-white rounded-3xl shadow-lg p-8 mt-8">
          <CardContent className="p-0">
            <h3 className="text-2xl font-bold text-neutral-800 mb-6 text-center">모든 MBTI 성격유형</h3>
            
            {/* Analyst Types */}
            <div className="mb-8">
              <h4 className="text-lg font-semibold text-purple-600 mb-4">분석가 (NT)</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {typeGroups.analysts.map((type) => (
                  <div
                    key={type}
                    onClick={() => showTypeInfo(type)}
                    className="text-center p-4 rounded-xl border-2 border-purple-200 hover:border-purple-400 transition-colors card-hover cursor-pointer"
                  >
                    <div className="font-bold text-purple-600 mb-1">{type}</div>
                    <div className="text-sm text-neutral-600">{mbtiTypes[type]?.title}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Diplomat Types */}
            <div className="mb-8">
              <h4 className="text-lg font-semibold text-green-600 mb-4">외교관 (NF)</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {typeGroups.diplomats.map((type) => (
                  <div
                    key={type}
                    onClick={() => showTypeInfo(type)}
                    className="text-center p-4 rounded-xl border-2 border-green-200 hover:border-green-400 transition-colors card-hover cursor-pointer"
                  >
                    <div className="font-bold text-green-600 mb-1">{type}</div>
                    <div className="text-sm text-neutral-600">{mbtiTypes[type]?.title}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Sentinel Types */}
            <div className="mb-8">
              <h4 className="text-lg font-semibold text-blue-600 mb-4">관리자 (SJ)</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {typeGroups.sentinels.map((type) => (
                  <div
                    key={type}
                    onClick={() => showTypeInfo(type)}
                    className="text-center p-4 rounded-xl border-2 border-blue-200 hover:border-blue-400 transition-colors card-hover cursor-pointer"
                  >
                    <div className="font-bold text-blue-600 mb-1">{type}</div>
                    <div className="text-sm text-neutral-600">{mbtiTypes[type]?.title}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Explorer Types */}
            <div>
              <h4 className="text-lg font-semibold text-orange-600 mb-4">탐험가 (SP)</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {typeGroups.explorers.map((type) => (
                  <div
                    key={type}
                    onClick={() => showTypeInfo(type)}
                    className="text-center p-4 rounded-xl border-2 border-orange-200 hover:border-orange-400 transition-colors card-hover cursor-pointer"
                  >
                    <div className="font-bold text-orange-600 mb-1">{type}</div>
                    <div className="text-sm text-neutral-600">{mbtiTypes[type]?.title}</div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
