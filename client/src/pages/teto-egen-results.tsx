import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { tetoEgenTypes, getCompatibilityDescription } from "@/data/tetoEgenTypes";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Navigation from "@/components/Navigation";
import AdSense from "@/components/AdSense";
import { useToast } from "@/hooks/use-toast";
import { RotateCcw, Share2, Users, Heart, Sparkles } from "lucide-react";

const getCoupangProducts = (type: string): string[] => {
  const products = {
    "TETO_F": [ // 테토녀
      '<iframe src="https://coupa.ng/ciO7vz" width="120" height="240" frameborder="0" scrolling="no" referrerpolicy="unsafe-url" browsingtopics></iframe>',
      '<iframe src="https://coupa.ng/ciO8B7" width="120" height="240" frameborder="0" scrolling="no" referrerpolicy="unsafe-url" browsingtopics></iframe>',
      '<iframe src="https://coupa.ng/ciO8CP" width="120" height="240" frameborder="0" scrolling="no" referrerpolicy="unsafe-url" browsingtopics></iframe>'
    ],
    "TETO_M": [ // 테토남
      '<iframe src="https://coupa.ng/ciO8Do" width="120" height="240" frameborder="0" scrolling="no" referrerpolicy="unsafe-url" browsingtopics></iframe>',
      '<iframe src="https://coupa.ng/ciO8DQ" width="120" height="240" frameborder="0" scrolling="no" referrerpolicy="unsafe-url" browsingtopics></iframe>',
      '<iframe src="https://coupa.ng/ciO8Mh" width="120" height="240" frameborder="0" scrolling="no" referrerpolicy="unsafe-url" browsingtopics></iframe>'
    ],
    "EGEN_F": [ // 에겐녀
      '<iframe src="https://coupa.ng/ciO81b" width="120" height="240" frameborder="0" scrolling="no" referrerpolicy="unsafe-url" browsingtopics></iframe>',
      '<iframe src="https://coupa.ng/ciO9e2" width="120" height="240" frameborder="0" scrolling="no" referrerpolicy="unsafe-url" browsingtopics></iframe>',
      '<iframe src="https://coupa.ng/ciO9xR" width="120" height="240" frameborder="0" scrolling="no" referrerpolicy="unsafe-url" browsingtopics></iframe>',
      '<iframe src="https://coupa.ng/ciO9qD" width="120" height="240" frameborder="0" scrolling="no" referrerpolicy="unsafe-url" browsingtopics></iframe>'
    ],
    "EGEN_M": [ // 에겐남
      '<iframe src="https://coupa.ng/ciO9ww" width="120" height="240" frameborder="0" scrolling="no" referrerpolicy="unsafe-url" browsingtopics></iframe>',
      '<iframe src="https://coupa.ng/ciO9wN" width="120" height="240" frameborder="0" scrolling="no" referrerpolicy="unsafe-url" browsingtopics></iframe>',
      '<iframe src="https://coupa.ng/ciO9w2" width="120" height="240" frameborder="0" scrolling="no" referrerpolicy="unsafe-url" browsingtopics></iframe>'
    ]
  };
  
  return products[type as keyof typeof products] || [];
};

export default function TetoEgenResults() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [testResult, setTestResult] = useState<any>(null);

  useEffect(() => {
    const result = sessionStorage.getItem('tetoEgenResult');
    if (!result) {
      setLocation('/teto-egen-test');
      return;
    }
    setTestResult(JSON.parse(result));
  }, [setLocation]);

  const handleRestart = () => {
    sessionStorage.removeItem('tetoEgenResult');
    setLocation('/teto-egen-test');
  };

  const handleShare = (platform: string) => {
    if (!testResult) return;
    
    const typeData = tetoEgenTypes[testResult.type];
    const currentUrl = window.location.origin + '/teto-egen-test';
    const shareText = `나는 ${typeData.title}(${typeData.subtitle})입니다! 테토 ${testResult.balance.teto}% vs 에겐 ${testResult.balance.egen}% 🔥`;
    const encodedUrl = encodeURIComponent(currentUrl);
    const encodedText = encodeURIComponent(shareText);

    switch (platform) {
      case 'facebook':
        const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}&quote=${encodedText}`;
        window.open(facebookUrl, '_blank', 'width=600,height=400');
        break;
      case 'twitter':
        const twitterUrl = `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`;
        window.open(twitterUrl, '_blank', 'width=600,height=400');
        break;
      case 'copy':
        const shareMessage = `${shareText}\n\n${currentUrl}`;
        if (navigator.clipboard && window.isSecureContext) {
          navigator.clipboard.writeText(shareMessage).then(() => {
            toast({
              title: "링크가 복사되었습니다!",
              description: "친구들과 공유해보세요.",
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
        description: "친구들과 공유해보세요.",
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



  if (!testResult) {
    return <div>Loading...</div>;
  }

  const typeData = tetoEgenTypes[testResult.type];
  const bestPartnerType = typeData.compatibility.best;
  const bestPartner = tetoEgenTypes[
    Object.keys(tetoEgenTypes).find(key => 
      tetoEgenTypes[key].title === bestPartnerType
    ) || ''
  ];

  return (
    <div className="min-h-screen bg-neutral-50">
      <Navigation />
      
      {/* Results Header */}
      <div className="gradient-bg text-white py-16">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <div className="animate-bounce-in">
            <div className="text-6xl mb-6">{typeData.emoji}</div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">테스트 완료!</h1>
            <p className="text-xl opacity-90">당신의 테토-에겐 유형을 분석했습니다</p>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Main Result Card */}
        <Card className="bg-white rounded-3xl shadow-lg p-8 mb-8">
          <CardContent className="p-0">
            <div className="text-center mb-8">
              <div className="text-6xl mb-4">{typeData.emoji}</div>
              <h2 className="text-3xl md:text-4xl font-bold mb-2" style={{ color: typeData.color }}>
                {typeData.title}
              </h2>
              <p className="text-xl text-neutral-600 mb-4">{typeData.subtitle}</p>
              <p className="text-lg text-neutral-700 leading-relaxed">{typeData.description}</p>
            </div>

            {/* Teto-Egen Balance */}
            <div className="mb-8">
              <h3 className="text-xl font-bold text-neutral-800 mb-4 flex items-center">
                <Sparkles className="mr-2" size={20} />
                테토-에겐 밸런스
              </h3>
              <div className="bg-neutral-100 rounded-full h-8 overflow-hidden mb-4">
                <div className="flex h-full">
                  <div 
                    className="bg-blue-500 flex items-center justify-center text-white text-sm font-medium"
                    style={{ width: `${testResult.balance.teto}%` }}
                  >
                    {testResult.balance.teto > 20 && `테토 ${testResult.balance.teto}%`}
                  </div>
                  <div 
                    className="bg-pink-500 flex items-center justify-center text-white text-sm font-medium"
                    style={{ width: `${testResult.balance.egen}%` }}
                  >
                    {testResult.balance.egen > 20 && `에겐 ${testResult.balance.egen}%`}
                  </div>
                </div>
              </div>
              <div className="flex justify-between text-sm text-neutral-600">
                <span>💪 테토 {testResult.balance.teto}%</span>
                <span>🌸 에겐 {testResult.balance.egen}%</span>
              </div>
            </div>

            {/* Characteristics */}
            <div className="mb-8">
              <h3 className="text-xl font-bold text-neutral-800 mb-4">주요 특징</h3>
              <div className="grid md:grid-cols-2 gap-3">
                {typeData.characteristics.map((trait, index) => (
                  <div key={index} className="flex items-center space-x-2 p-3 bg-neutral-50 rounded-lg">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: typeData.color }}></div>
                    <span className="text-sm text-neutral-700">{trait}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Celebrity Examples */}
            <div className="mb-8">
              <h3 className="text-xl font-bold text-neutral-800 mb-4 flex items-center">
                <Users className="mr-2" size={20} />
                대표 인물
              </h3>
              <div className="flex flex-wrap gap-2">
                {typeData.celebrities.map((celebrity, index) => (
                  <span 
                    key={index} 
                    className="px-3 py-1 rounded-full text-sm font-medium text-white"
                    style={{ backgroundColor: typeData.color }}
                  >
                    {celebrity}
                  </span>
                ))}
              </div>
            </div>

            {/* Compatibility */}
            {bestPartner && (
              <div className="mb-8">
                <h3 className="text-xl font-bold text-neutral-800 mb-4 flex items-center">
                  <Heart className="mr-2" size={20} />
                  연애 궁합
                </h3>
                <div className="p-4 bg-gradient-to-r from-red-50 to-pink-50 rounded-xl border border-red-200">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="text-2xl">{typeData.emoji}</div>
                    <div className="text-lg">💕</div>
                    <div className="text-2xl">{bestPartner.emoji}</div>
                    <div className="font-semibold text-red-600">
                      {typeData.title} ✕ {bestPartner.title}
                    </div>
                  </div>
                  <p className="text-sm text-neutral-700">
                    {getCompatibilityDescription(testResult.type, 
                      Object.keys(tetoEgenTypes).find(key => tetoEgenTypes[key] === bestPartner) || ''
                    )}
                  </p>
                </div>
              </div>
            )}

            {/* Recommended Products */}
            <div className="mb-8">
              <h3 className="text-xl font-bold text-neutral-800 mb-4 flex items-center">
                🛍️ {typeData.title} 맞춤 추천 상품
              </h3>
              <p className="text-sm text-neutral-600 mb-4">
                당신의 성향에 맞는 엄선된 상품들을 추천해드려요!
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {getCoupangProducts(testResult.type).map((product, index) => (
                  <div key={index} className="bg-neutral-50 rounded-lg p-2 flex justify-center">
                    <div 
                      dangerouslySetInnerHTML={{ __html: product }}
                      className="coupang-product-iframe"
                    />
                  </div>
                ))}
              </div>
              <p className="text-xs text-neutral-500 mt-2 text-center">
                "이 포스팅은 쿠팡 파트너스 활동의 일환으로, 이에 따른 일정액의 수수료를 제공받습니다."
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                onClick={handleRestart}
                variant="outline"
                className="flex items-center justify-center space-x-2 flex-1"
              >
                <RotateCcw size={18} />
                <span>다시 테스트</span>
              </Button>
              
              <Button
                onClick={() => handleShare('facebook')}
                className="flex items-center justify-center space-x-2 flex-1 bg-blue-600 hover:bg-blue-700"
              >
                <Share2 size={18} />
                <span>페이스북 공유</span>
              </Button>
              
              <Button
                onClick={() => handleShare('twitter')}
                className="flex items-center justify-center space-x-2 flex-1 bg-sky-500 hover:bg-sky-600"
              >
                <Share2 size={18} />
                <span>트위터 공유</span>
              </Button>
              
              <Button
                onClick={() => handleShare('copy')}
                variant="outline"
                className="flex items-center justify-center space-x-2 flex-1"
              >
                <Share2 size={18} />
                <span>링크 복사</span>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* AdSense */}
        <AdSense 
          adSlot="1234567893"
          className="mb-8"
        />

        {/* All Types Overview */}
        <Card className="bg-white rounded-3xl shadow-lg p-8">
          <CardContent className="p-0">
            <h3 className="text-2xl font-bold text-neutral-800 mb-6 text-center">모든 테토-에겐 유형</h3>
            
            <div className="grid md:grid-cols-2 gap-6">
              {Object.values(tetoEgenTypes).map((type) => (
                <div 
                  key={type.code}
                  className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                    type.code === testResult.type 
                      ? 'border-primary bg-primary/10' 
                      : 'border-neutral-200 hover:border-neutral-300'
                  }`}
                >
                  <div className="flex items-center space-x-3 mb-2">
                    <div className="text-2xl">{type.emoji}</div>
                    <div>
                      <div className="font-bold" style={{ color: type.color }}>{type.title}</div>
                      <div className="text-sm text-neutral-600">{type.subtitle}</div>
                    </div>
                  </div>
                  <p className="text-sm text-neutral-700">{type.description}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}