import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface ShareButtonsProps {
  title: string;
  shareText: string;
  url: string;
}

export function ShareButtons({ title, shareText, url }: ShareButtonsProps) {
  const { toast } = useToast();

  const handleShare = (platform: string) => {
    if (typeof window !== "undefined" && (window as any).gtag) {
      (window as any).gtag('event', 'share_clicked', {
        platform: platform,
        test_path: window.location.pathname
      });
    }

    const encodedUrl = encodeURIComponent(url);
    const encodedText = encodeURIComponent(shareText);

    // Use Web Share API for mobile devices if available
    if (platform === 'native' && 'share' in navigator && navigator.share) {
      navigator.share({
        title: title,
        text: shareText,
        url: url
      }).catch(err => {
        console.log('Share failed:', err);
      });
      return;
    }

    switch (platform) {
      case 'facebook':
        const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
        window.open(facebookUrl, '_blank', 'width=600,height=400');
        break;
      case 'twitter':
        const twitterUrl = `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`;
        window.open(twitterUrl, '_blank', 'width=600,height=400');
        break;
      case 'kakao':
        // 카카오톡 공유: SDK 미존재시 클립보드 복사로 대체
        copyToClipboard('kakao');
        break;
      case 'instagram':
        copyToClipboard('instagram');
        break;
      case 'copy':
        copyToClipboard();
        break;
    }
  };

  const copyToClipboard = (type = '') => {
    const shareMessage = `${shareText}\n\n${url}`;
    
    let title = "링크가 복사되었습니다!";
    let description = "테스트 결과를 친구들과 공유해보세요.";
    
    if (type === 'kakao') {
      title = "카카오톡 공유 (링크 복사완료)";
      description = "카카오톡 채팅방에 붙여넣기 하세요.";
    } else if (type === 'instagram') {
      title = "인스타그램 공유 (링크 복사완료)";
      description = "인스타그램 스토리나 프로필에 붙여넣기 하세요.";
    }

    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(shareMessage).then(() => {
        toast({ title, description });
      }).catch(() => {
        fallbackCopyTextToClipboard(shareMessage, title, description);
      });
    } else {
      fallbackCopyTextToClipboard(shareMessage, title, description);
    }
  };

  const fallbackCopyTextToClipboard = (text: string, title: string, description: string) => {
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
      toast({ title, description });
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
    <div className="bg-gradient-to-r from-neutral-50 to-neutral-100 rounded-3xl p-6 md:p-8 text-center shadow-inner mt-8">
      <h3 className="text-xl font-bold text-neutral-800 mb-6">
        💌 결과 공유하기
      </h3>
      <div className="flex flex-wrap justify-center gap-3">
        {'share' in navigator && (
          <Button
            onClick={() => handleShare('native')}
            className="flex-1 min-w-[120px] max-w-[200px] bg-primary text-white py-6 rounded-2xl hover:bg-primary/90 hover:scale-105 transition-all text-sm shadow-md"
          >
            <i className="fas fa-share-nodes text-xl mb-1 block"></i>
            <div>공유하기</div>
          </Button>
        )}
        <Button
          onClick={() => handleShare('kakao')}
          className="flex-1 min-w-[120px] max-w-[200px] bg-[#FEE500] text-[#000000] py-6 rounded-2xl hover:bg-[#FEE500]/90 hover:scale-105 transition-all text-sm shadow-md"
        >
          <i className="fas fa-comment text-xl mb-1 block"></i>
          <div>카카오톡</div>
        </Button>
        <Button
          onClick={() => handleShare('instagram')}
          className="flex-1 min-w-[120px] max-w-[200px] bg-gradient-to-r from-[#833AB4] via-[#FD1D1D] to-[#F56040] text-white py-6 rounded-2xl hover:opacity-90 hover:scale-105 transition-all text-sm shadow-md border-0"
        >
          <i className="fab fa-instagram text-xl mb-1 block"></i>
          <div>인스타그램</div>
        </Button>
        <Button
          onClick={() => handleShare('twitter')}
          className="flex-1 min-w-[120px] max-w-[200px] bg-black text-white py-6 rounded-2xl hover:bg-neutral-800 hover:scale-105 transition-all text-sm shadow-md"
        >
          <svg className="w-5 h-5 mx-auto mb-1 fill-current" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.008 5.965H5.078z"/></svg>
          <div>X (Twitter)</div>
        </Button>
        <Button
          onClick={() => handleShare('copy')}
          className="flex-1 min-w-[120px] max-w-[200px] bg-white border-2 border-neutral-200 text-neutral-700 py-6 rounded-2xl hover:bg-neutral-50 hover:border-neutral-300 hover:scale-105 transition-all text-sm shadow-sm"
        >
          <i className="fas fa-link text-xl mb-1 block"></i>
          <div>링크 복사</div>
        </Button>
      </div>
    </div>
  );
}
