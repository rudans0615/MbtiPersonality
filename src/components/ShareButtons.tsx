"use client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Check, Instagram, Link2, MessageCircle, Share2 } from "lucide-react";

interface ShareButtonsProps {
  title: string;
  shareText: string;
  url: string;
}

export function ShareButtons({ title, shareText, url }: ShareButtonsProps) {
  const { toast } = useToast();
  const [canShare, setCanShare] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  useEffect(() => {
    setCanShare(typeof navigator.share === "function");
  }, []);

  const markCopied = (key: string) => {
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleShare = (platform: string) => {
    if (typeof window !== "undefined" && (window as any).gtag) {
      (window as any).gtag("event", "share_clicked", {
        platform,
        test_path: window.location.pathname,
      });
    }

    const encodedUrl = encodeURIComponent(url);
    const encodedText = encodeURIComponent(shareText);

    if (platform === "native" && "share" in navigator && navigator.share) {
      navigator
        .share({
          title,
          text: shareText,
          url,
        })
        .catch(() => {});
      return;
    }

    switch (platform) {
      case "twitter":
        window.open(
          `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`,
          "_blank",
          "width=600,height=400"
        );
        break;
      case "kakao":
        copyToClipboard("kakao");
        break;
      case "instagram":
        copyToClipboard("instagram");
        break;
      case "copy":
        copyToClipboard("copy");
        break;
    }
  };

  const copyToClipboard = (type = "copy") => {
    const shareMessage = `${shareText}\n\n${url}`;

    let toastTitle = "링크가 복사되었습니다!";
    let toastDesc = "테스트 결과를 친구들과 공유해보세요.";

    if (type === "kakao") {
      toastTitle = "카카오톡 공유용 링크 복사 완료!";
      toastDesc = "카카오톡 채팅방에 붙여넣으면 미리보기 카드와 함께 전송됩니다.";
    } else if (type === "instagram") {
      toastTitle = "인스타그램 공유용 링크 복사 완료!";
      toastDesc = "인스타 스토리 링크 스티커나 DM에 붙여넣어 보세요.";
    }

    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard
        .writeText(shareMessage)
        .then(() => {
          markCopied(type);
          toast({ title: toastTitle, description: toastDesc });
        })
        .catch(() => {
          fallbackCopyTextToClipboard(shareMessage, type, toastTitle, toastDesc);
        });
    } else {
      fallbackCopyTextToClipboard(shareMessage, type, toastTitle, toastDesc);
    }
  };

  const fallbackCopyTextToClipboard = (
    text: string,
    key: string,
    toastTitle: string,
    toastDesc: string
  ) => {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    textArea.style.top = "0";
    textArea.style.left = "0";
    textArea.style.position = "fixed";
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
      document.execCommand("copy");
      markCopied(key);
      toast({ title: toastTitle, description: toastDesc });
    } catch {
      toast({
        title: "복사 실패",
        description: "수동으로 링크를 복사해주세요.",
        variant: "destructive",
      });
    }
    document.body.removeChild(textArea);
  };

  return (
    <div className="bg-gradient-to-br from-neutral-50 to-neutral-100/80 border border-neutral-200/70 rounded-3xl p-6 sm:p-8 text-center mt-8">
      <h3 className="text-lg sm:text-xl font-bold text-neutral-800 mb-5">
        💌 결과 공유하기
      </h3>
      <div className="grid grid-cols-2 sm:flex sm:flex-wrap justify-center gap-3">
        {canShare && (
          <Button
            type="button"
            onClick={() => handleShare("native")}
            className="sm:flex-1 sm:min-w-[120px] sm:max-w-[170px] bg-primary text-white h-14 rounded-2xl hover:bg-primary/90 active:scale-[0.98] transition-all text-sm font-bold shadow-md flex items-center justify-center gap-2"
          >
            <Share2 size={18} />
            <span>공유하기</span>
          </Button>
        )}
        <Button
          type="button"
          onClick={() => handleShare("kakao")}
          className="sm:flex-1 sm:min-w-[120px] sm:max-w-[170px] bg-[#FEE500] text-[#191919] h-14 rounded-2xl hover:bg-[#FEE500]/90 active:scale-[0.98] transition-all text-sm font-bold shadow-md flex items-center justify-center gap-2"
        >
          {copiedKey === "kakao" ? <Check size={18} /> : <MessageCircle size={18} />}
          <span>{copiedKey === "kakao" ? "복사됨!" : "카카오톡"}</span>
        </Button>
        <Button
          type="button"
          onClick={() => handleShare("instagram")}
          className="sm:flex-1 sm:min-w-[120px] sm:max-w-[170px] bg-gradient-to-r from-[#833AB4] via-[#FD1D1D] to-[#F56040] text-white h-14 rounded-2xl hover:opacity-90 active:scale-[0.98] transition-all text-sm font-bold shadow-md border-0 flex items-center justify-center gap-2"
        >
          {copiedKey === "instagram" ? <Check size={18} /> : <Instagram size={18} />}
          <span>{copiedKey === "instagram" ? "복사됨!" : "인스타그램"}</span>
        </Button>
        <Button
          type="button"
          onClick={() => handleShare("twitter")}
          className="sm:flex-1 sm:min-w-[120px] sm:max-w-[170px] bg-neutral-900 text-white h-14 rounded-2xl hover:bg-neutral-800 active:scale-[0.98] transition-all text-sm font-bold shadow-md flex items-center justify-center gap-2"
        >
          <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.008 5.965H5.078z" />
          </svg>
          <span>X (Twitter)</span>
        </Button>
        <Button
          type="button"
          onClick={() => handleShare("copy")}
          className="col-span-2 sm:col-span-1 sm:flex-1 sm:min-w-[120px] sm:max-w-[170px] bg-white border-2 border-neutral-200 text-neutral-700 h-14 rounded-2xl hover:bg-neutral-50 hover:border-neutral-300 active:scale-[0.98] transition-all text-sm font-bold shadow-sm flex items-center justify-center gap-2"
        >
          {copiedKey === "copy" ? <Check size={18} className="text-emerald-600" /> : <Link2 size={18} />}
          <span>{copiedKey === "copy" ? "복사 완료!" : "링크 복사"}</span>
        </Button>
      </div>
    </div>
  );
}
