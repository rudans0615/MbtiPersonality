import { MBTIType } from "@/lib/customTests/mbtiTypes";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { AdSenseBlock } from "@/components/AdSenseBlock";
import { CoupangRecommend } from "@/components/CoupangRecommend";
import { ShareButtons } from "@/components/ShareButtons";

interface ResultCardProps {
  mbtiType: MBTIType;
  onRestart: () => void;
  onShare: (platform: string) => void;
}

export default function ResultCard({ mbtiType, onRestart, onShare }: ResultCardProps) {
  const { toast } = useToast();

  const handleShare = (platform: string) => {
    const currentUrl = 'https://mbtifinder.com/';
    const shareText = `나의 MBTI 성격유형은 ${mbtiType.code}(${mbtiType.title})입니다! 당신도 확인해보세요!`;
    const encodedUrl = encodeURIComponent(currentUrl);
    const encodedText = encodeURIComponent(shareText);

    // Use Web Share API for mobile devices if available
    if (platform === 'native' && 'share' in navigator && navigator.share) {
      navigator.share({
        title: `MBTI 성격유형: ${mbtiType.code}(${mbtiType.title})`,
        text: shareText,
        url: currentUrl
      }).catch(err => {
        console.log('Share failed:', err);
      });
      return;
    }

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
      default:
        onShare(platform);
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

  return (
    <Card className="bg-white/80 backdrop-blur-xl border border-white/60 rounded-[2.5rem] shadow-[0_8px_32px_rgba(236,72,153,0.1)] p-8 md:p-12 -mt-16 relative z-10 animate-slide-up overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-pink-300 via-purple-300 to-indigo-300 opacity-80"></div>
      <CardContent className="p-0">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-28 h-28 bg-gradient-to-tr from-pink-300 via-purple-300 to-indigo-300 rounded-full text-white text-4xl font-bold mb-6 shadow-xl shadow-purple-200/50 border-4 border-white">
            <span>{mbtiType.code}</span>
          </div>
          <h2 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-neutral-800 to-neutral-600 mb-2 tracking-tight">
            {mbtiType.title}
          </h2>
          <p className="text-lg text-pink-500 font-medium tracking-wide">
            {mbtiType.subtitle}
          </p>
        </div>

        <div className="prose prose-lg max-w-none text-neutral-700 mb-8">
          <p>{mbtiType.description}</p>
        </div>

        {/* 첫 번째 광고 영역: 결과 설명 바로 아래 */}
        <AdSenseBlock adSlot="4325732101" />

        <div className="grid md:grid-cols-2 gap-8 mb-8 mt-4">
          <div className="bg-pink-50/50 rounded-[2rem] p-6 border border-pink-100">
            <h3 className="text-xl font-bold text-pink-500 mb-4 flex items-center">
              <i className="fas fa-star mr-2 text-yellow-400"></i>매력 포인트
            </h3>
            <ul className="space-y-3">
              {mbtiType.strengths.map((strength, index) => (
                <li key={index} className="flex items-start text-neutral-700">
                  <span className="text-pink-400 mr-2 mt-0.5">✨</span>
                  {strength}
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-indigo-50/50 rounded-[2rem] p-6 border border-indigo-100">
            <h3 className="text-xl font-bold text-indigo-500 mb-4 flex items-center">
              <i className="fas fa-seedling mr-2 text-indigo-400"></i>성장 포인트
            </h3>
            <ul className="space-y-3">
              {mbtiType.weaknesses.map((weakness, index) => (
                <li key={index} className="flex items-start text-neutral-700">
                  <span className="text-indigo-400 mr-2 mt-0.5">🌱</span>
                  {weakness}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="bg-gradient-to-br from-rose-50 to-pink-50 rounded-[2rem] p-6 mb-8 border border-pink-100">
          <h3 className="text-xl font-bold text-rose-500 mb-4 flex items-center justify-center">
            <i className="fas fa-heart mr-2 text-rose-400"></i>나와 찰떡인 유형
          </h3>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {mbtiType.compatible.map((type, index) => (
              <div key={index} className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 text-center border border-white hover:shadow-md transition-shadow cursor-pointer group">
                <div className="font-extrabold text-rose-500 mb-1 group-hover:scale-110 transition-transform">{type}</div>
                <div className="text-xs text-rose-400 font-medium">최고의 궁합</div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-[2rem] p-6 mb-8 border border-purple-100">
          <h3 className="text-xl font-bold text-purple-600 mb-4 flex items-center justify-center">
            <i className="fas fa-briefcase mr-2 text-purple-400"></i>추천하는 일/취향
          </h3>
          <div className="flex flex-wrap gap-2 justify-center">
            {mbtiType.careers.map((career, index) => (
              <span key={index} className="bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium text-purple-700 border border-white shadow-sm">
                #{career}
              </span>
            ))}
          </div>
        </div>

        {/* 제휴 마케팅 추천 스캐폴딩: MBTI 특화 자동 추천 */}
        <CoupangRecommend keyword={mbtiType.title} />

        {/* 두 번째 광고 영역: 추천 직업/상품과 결과 공유하기 사이 */}
        <AdSenseBlock adSlot="7890123456" />

        <div className="text-center space-y-5 mt-10">
          <h3 className="text-lg font-bold text-neutral-600">🔥 내 결과 친구들에게 자랑하기 🔥</h3>
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
          <Button
            onClick={onRestart}
            className="block w-full max-w-sm mx-auto mt-6 bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-400 text-white px-8 py-6 rounded-2xl text-lg font-bold hover:shadow-lg hover:shadow-purple-200/50 transition-all hover:-translate-y-1 border-2 border-white/50"
          >
            <i className="fas fa-rotate-right mr-2"></i>심리테스트 다시하기
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
