"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Heart, Copy, Share2 } from "lucide-react";
import { SITE_URL } from "@/lib/siteConfig";

interface FriendInviteBoxProps {
  myCode: string;
  myTitle: string;
}

export function FriendInviteBox({ myCode, myTitle }: FriendInviteBoxProps) {
  const { toast } = useToast();
  const [nickname, setNickname] = useState("");

  const buildInviteUrl = () => {
    const params = new URLSearchParams({ from: myCode });
    const trimmed = nickname.trim().slice(0, 12);
    if (trimmed) params.set("name", trimmed);
    return `${SITE_URL}/test?${params.toString()}`;
  };

  const buildShareText = () => {
    const trimmed = nickname.trim().slice(0, 12);
    const who = trimmed ? `${trimmed}(${myCode})` : `나(${myCode} · ${myTitle})`;
    return `${who}와의 MBTI 궁합은 몇 점일까? 지금 검사하고 우리 둘의 2인 궁합 리포트를 바로 확인해 봐! 👉`;
  };

  const handleCopyInvite = async () => {
    const url = buildInviteUrl();
    const message = `${buildShareText()}\n${url}`;

    if (typeof window !== "undefined" && (window as any).gtag) {
      (window as any).gtag("event", "invite_link_copied", {
        from_mbti: myCode,
        has_nickname: Boolean(nickname.trim()),
      });
    }

    try {
      await navigator.clipboard.writeText(message);
      toast({
        title: "2인 궁합 초대 링크가 복사되었습니다! 💌",
        description: "카카오톡이나 인스타 DM에 붙여넣어 친구와 궁합을 비교해보세요.",
      });
    } catch {
      toast({
        title: "복사에 실패했습니다",
        description: url,
        variant: "destructive",
      });
    }
  };

  const handleNativeShare = async () => {
    const url = buildInviteUrl();
    const text = buildShareText();
    if (typeof navigator !== "undefined" && typeof navigator.share === "function") {
      try {
        await navigator.share({
          title: `${myCode}님과 2인 MBTI 궁합 비교`,
          text,
          url,
        });
        return;
      } catch {
        // 취소 시 복사 폴백 불필요
        return;
      }
    }
    handleCopyInvite();
  };

  return (
    <div className="bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50 rounded-[2rem] p-6 md:p-8 border border-pink-200/70 mb-8 text-left shadow-sm">
      <div className="flex items-center gap-2 text-rose-600 font-extrabold text-lg mb-2">
        <Heart size={20} className="fill-rose-500 text-rose-500" />
        친구·연인과 2인 궁합 바로 비교하기
      </div>
      <p className="text-sm text-neutral-600 leading-relaxed mb-5">
        아래 초대 링크를 보내면 상대방이 검사를 끝냈을 때{" "}
        <strong>나({myCode})와 상대방의 궁합 점수·갈등 대화법 리포트</strong>가 바로 열립니다.
      </p>

      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <Input
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          maxLength={12}
          placeholder="내 닉네임 입력 (선택, 예: 지민)"
          className="bg-white border-pink-200 focus-visible:ring-pink-400 rounded-xl h-12"
        />
        <Button
          type="button"
          onClick={handleCopyInvite}
          className="bg-neutral-900 hover:bg-neutral-800 text-white rounded-xl h-12 px-6 font-bold shrink-0"
        >
          <Copy size={16} className="mr-2" /> 궁합 초대 링크 복사
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={handleNativeShare}
          className="bg-white border-pink-200 text-pink-600 hover:bg-pink-50 rounded-xl h-12 px-5 font-bold shrink-0"
        >
          <Share2 size={16} className="mr-1.5" /> 바로 공유
        </Button>
      </div>

      <p className="text-xs text-neutral-500 break-all bg-white/70 px-3 py-2 rounded-lg border border-pink-100">
        초대 링크 미리보기: {buildInviteUrl()}
      </p>
    </div>
  );
}
