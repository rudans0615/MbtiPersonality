"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { MBTIType } from "@/lib/customTests/mbtiTypes";
import { toCanonicalPair } from "@/lib/customTests/mbtiCompatibility";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { CoupangRecommend } from "@/components/CoupangRecommend";
import { FriendInviteBox } from "@/components/FriendInviteBox";
import { ResultImageCard } from "@/components/ResultImageCard";
import { IS_ADSENSE_REVIEW_MODE } from "@/lib/siteConfig";
import {
  ArrowRight,
  BookOpen,
  Briefcase,
  Heart,
  Link2,
  RotateCcw,
  Share2,
  Sprout,
  Star,
} from "lucide-react";

interface ResultCardProps {
  mbtiType: MBTIType;
  onRestart: () => void;
  onShare: (platform: string) => void;
}

export default function ResultCard({ mbtiType, onRestart, onShare }: ResultCardProps) {
  const { toast } = useToast();
  const [canShare, setCanShare] = useState(false);

  useEffect(() => {
    setCanShare(typeof navigator.share === "function");
  }, []);

  const handleShare = (platform: string) => {
    const currentUrl = "https://mbtifinder.com/test";
    const shareText = `나의 MBTI 성격유형은 ${mbtiType.code}(${mbtiType.title})입니다! 당신도 확인해보세요!`;

    if (platform === "native" && "share" in navigator && navigator.share) {
      navigator
        .share({
          title: `MBTI 성격유형: ${mbtiType.code}(${mbtiType.title})`,
          text: shareText,
          url: currentUrl,
        })
        .catch(() => {});
      return;
    }

    if (platform === "copy") {
      const shareMessage = `${shareText}\n\n${currentUrl}`;
      if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard
          .writeText(shareMessage)
          .then(() => {
            toast({
              title: "링크가 복사되었습니다!",
              description: "친구들과 공유해보세요.",
            });
          })
          .catch(() => fallbackCopyTextToClipboard(shareMessage));
      } else {
        fallbackCopyTextToClipboard(shareMessage);
      }
      return;
    }

    onShare(platform);
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
      document.execCommand("copy");
      toast({
        title: "링크가 복사되었습니다!",
        description: "친구들과 공유해보세요.",
      });
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
    <Card className="bg-white/95 backdrop-blur-xl border border-neutral-100 rounded-[2rem] shadow-[0_8px_32px_rgba(99,102,241,0.08)] p-6 sm:p-10 relative z-10 animate-slide-up overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-2.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />
      <CardContent className="p-0">
        <div className="text-center mb-8 pt-2">
          <div className="inline-flex items-center justify-center w-28 h-28 bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 rounded-full text-white text-3xl font-black mb-5 shadow-xl shadow-purple-200/60 border-4 border-white">
            <span>{mbtiType.code}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-neutral-900 mb-2 tracking-tight">
            {mbtiType.emoji} {mbtiType.title}
          </h2>
          <p className="text-base sm:text-lg text-pink-600 font-semibold tracking-wide break-keep">
            {mbtiType.subtitle}
          </p>
        </div>

        <div className="bg-neutral-50/80 border border-neutral-100 rounded-2xl p-5 sm:p-6 text-neutral-700 mb-8 leading-relaxed whitespace-pre-line text-sm sm:text-base">
          {mbtiType.description}
        </div>

        {/* 저장용 결과 카드 */}
        <ResultImageCard
          testTitle="MBTI 성격유형 검사"
          resultTitle={`${mbtiType.code} · ${mbtiType.title}`}
          resultEmoji={mbtiType.emoji}
          resultSubtitle={mbtiType.subtitle}
          characteristics={mbtiType.strengths}
        />

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="bg-pink-50/60 rounded-3xl p-6 border border-pink-100">
            <h3 className="text-lg font-bold text-pink-600 mb-4 flex items-center gap-2">
              <Star size={20} className="fill-yellow-400 text-yellow-500" />
              매력 포인트
            </h3>
            <ul className="space-y-2.5 text-sm sm:text-base">
              {mbtiType.strengths.map((strength, index) => (
                <li key={index} className="flex items-start text-neutral-700">
                  <span className="text-pink-400 mr-2 mt-0.5">✨</span>
                  <span>{strength}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-indigo-50/60 rounded-3xl p-6 border border-indigo-100">
            <h3 className="text-lg font-bold text-indigo-600 mb-4 flex items-center gap-2">
              <Sprout size={20} className="text-indigo-500" />
              성장 포인트
            </h3>
            <ul className="space-y-2.5 text-sm sm:text-base">
              {mbtiType.weaknesses.map((weakness, index) => (
                <li key={index} className="flex items-start text-neutral-700">
                  <span className="text-indigo-400 mr-2 mt-0.5">🌱</span>
                  <span>{weakness}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="bg-gradient-to-br from-rose-50 to-pink-50 rounded-3xl p-6 mb-8 border border-pink-100">
          <h3 className="text-lg font-bold text-rose-600 mb-4 flex items-center justify-center gap-2">
            <Heart size={20} className="fill-rose-400 text-rose-500" />
            나와 찰떡인 궁합 유형
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {mbtiType.compatible.map((type, index) => {
              const pairSlug = toCanonicalPair(mbtiType.code, type);
              return (
                <Link
                  key={index}
                  href={pairSlug ? `/compatibility/${pairSlug}` : `/type/${type}`}
                  className="bg-white/90 rounded-2xl p-4 text-center border border-white hover:border-rose-200 hover:shadow-md transition-all cursor-pointer group block"
                >
                  <div className="font-extrabold text-rose-600 mb-1 group-hover:scale-105 transition-transform">
                    {type}
                  </div>
                  <div className="text-xs text-rose-400 font-semibold">궁합 분석 보기 →</div>
                </Link>
              );
            })}
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-3xl p-6 mb-8 border border-purple-100">
          <h3 className="text-lg font-bold text-purple-700 mb-4 flex items-center justify-center gap-2">
            <Briefcase size={20} className="text-purple-500" />
            어울리는 일 · 직무
          </h3>
          <div className="flex flex-wrap gap-2 justify-center">
            {mbtiType.careers.map((career, index) => (
              <span
                key={index}
                className="bg-white/90 px-4 py-2 rounded-full text-sm font-medium text-purple-700 border border-purple-100 shadow-sm"
              >
                #{career}
              </span>
            ))}
          </div>
        </div>

        {/* 유형 백과 심층 가이드 바로가기 */}
        <div className="mb-8">
          <Link
            href={`/type/${mbtiType.code}`}
            className="flex items-center justify-between gap-3 p-5 rounded-2xl bg-neutral-900 text-white hover:bg-neutral-800 transition-colors group"
          >
            <div className="flex items-center gap-3">
              <BookOpen size={20} className="text-pink-300 shrink-0" />
              <div className="text-left">
                <div className="font-bold text-sm sm:text-base">
                  {mbtiType.code} ({mbtiType.title}) 연애·직장·성장 조언 전체 보기
                </div>
                <div className="text-xs text-neutral-300">
                  16유형 백과에서 내 유형의 상세 공략집을 확인하세요
                </div>
              </div>
            </div>
            <ArrowRight size={18} className="shrink-0 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* 2인 궁합 친구 초대 박스 */}
        <FriendInviteBox myCode={mbtiType.code} myTitle={mbtiType.title} />

        {/* 제휴 마케팅 추천 스캐폴딩: 심사 기간 중 비노출 */}
        {!IS_ADSENSE_REVIEW_MODE && <CoupangRecommend keyword={mbtiType.title} />}

        <div className="text-center space-y-4 mt-8">
          <h3 className="text-base font-bold text-neutral-600">🔥 내 결과 친구들에게 공유하기</h3>
          <div className="flex justify-center gap-3 flex-wrap">
            {canShare && (
              <Button
                type="button"
                onClick={() => handleShare("native")}
                className="bg-neutral-900 text-white px-6 h-12 rounded-2xl hover:bg-neutral-800 transition-all shadow-md font-bold"
              >
                <Share2 size={17} className="mr-2" /> 공유하기
              </Button>
            )}
            <Button
              type="button"
              onClick={() => handleShare("copy")}
              className="bg-white text-neutral-800 border-2 border-neutral-200 px-6 h-12 rounded-2xl hover:border-neutral-300 hover:bg-neutral-50 transition-all shadow-sm font-bold"
            >
              <Link2 size={17} className="mr-2" /> 링크 복사
            </Button>
          </div>
          <Button
            type="button"
            onClick={onRestart}
            className="w-full max-w-sm mx-auto mt-4 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white px-8 h-14 rounded-2xl text-base font-bold hover:opacity-95 transition-all shadow-lg flex items-center justify-center gap-2"
          >
            <RotateCcw size={18} /> MBTI 검사 다시하기
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
