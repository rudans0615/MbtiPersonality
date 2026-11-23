"use client";
import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import ResultCard from "@/components/ResultCard";
import { mbtiTypes } from "@/lib/customTests/mbtiTypes";
import {
  getCompatibilityReport,
  getCompatibilityTier,
  isValidMbtiCode,
  type MBTICode,
} from "@/lib/customTests/mbtiCompatibility";
import { Button } from "@/components/ui/button";
import { ArrowRight, Heart } from "lucide-react";

function ResultsInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [code, setCode] = useState<MBTICode | null>(null);
  const [inviteFrom, setInviteFrom] = useState<MBTICode | null>(null);
  const [inviteName, setInviteName] = useState("");
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    try {
      const value = sessionStorage.getItem("mbtiResult");
      if (value && isValidMbtiCode(value)) setCode(value);

      const urlFrom = (searchParams.get("from") || "").toUpperCase();
      const urlName = (searchParams.get("name") || "").trim().slice(0, 12);
      if (isValidMbtiCode(urlFrom)) {
        setInviteFrom(urlFrom);
        setInviteName(urlName);
      } else {
        const rawInvite = sessionStorage.getItem("mbtiInvite");
        if (rawInvite) {
          const parsed = JSON.parse(rawInvite);
          const storedFrom = (parsed?.from || "").toUpperCase();
          if (isValidMbtiCode(storedFrom)) {
            setInviteFrom(storedFrom);
            setInviteName((parsed?.name || "").trim().slice(0, 12));
          }
        }
      }
    } catch {
      /* Storage unavailable */
    }
    setLoaded(true);
  }, [searchParams]);

  if (!loaded) return <p role="status" className="pt-28 p-12 text-center">결과를 불러오는 중입니다.</p>;
  if (!code) {
    return (
      <section className="max-w-3xl mx-auto px-6 pt-28 pb-12 text-center">
        <h1 className="text-2xl font-bold mb-4">저장된 검사 결과가 없습니다</h1>
        <p className="mb-6">결과가 없거나 읽을 수 없습니다. MBTI 검사를 시작해주세요.</p>
        <Link href="/test" className="underline text-primary">
          MBTI 검사 시작하기
        </Link>
      </section>
    );
  }

  const restart = () => {
    try {
      sessionStorage.removeItem("mbtiResult");
      sessionStorage.removeItem("mbtiInvite");
      router.push("/test");
    } catch {
      setError("저장 결과를 지우지 못했습니다. 브라우저의 저장소 사용을 허용한 뒤 다시 시도해주세요.");
    }
  };

  const pairReport = inviteFrom ? getCompatibilityReport(inviteFrom, code) : null;
  const pairTier = pairReport ? getCompatibilityTier(pairReport.score) : null;
  const inviterDisplay = inviteFrom ? (inviteName ? `${inviteName}(${inviteFrom})` : inviteFrom) : "";

  return (
    <section className="max-w-4xl mx-auto px-4 pt-24 pb-12">
      {/* 친구 초대 2인 궁합 즉시 비교 카드 */}
      {pairReport && pairTier && (
        <div className="bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50 rounded-[2rem] border-2 border-pink-200 shadow-lg p-6 md:p-8 mb-24 text-center">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white text-rose-600 text-xs font-extrabold border border-pink-200 mb-4">
            <Heart size={13} className="fill-rose-500" /> 2인 궁합 비교 완료!
          </div>
          <h2 className="text-2xl md:text-3xl font-extrabold text-neutral-900 mb-2">
            {inviterDisplay} ✕ 나({code})
          </h2>
          <div className="flex items-center justify-center gap-3 mb-4">
            <span className="text-4xl md:text-5xl font-black text-pink-600">{pairReport.score}점</span>
            <span className={`text-sm font-bold px-3 py-1 rounded-full border ${pairTier.badgeClass}`}>
              {pairTier.emoji} {pairTier.label}
            </span>
          </div>
          <p className="text-base font-bold text-neutral-800 mb-2">{pairReport.headline}</p>
          <p className="text-sm text-neutral-600 max-w-2xl mx-auto leading-relaxed mb-6">
            {pairReport.loveGuide}
          </p>
          <Link href={`/compatibility/${pairReport.pairKey}`}>
            <Button size="lg" className="rounded-full px-8 bg-neutral-900 hover:bg-neutral-800 text-white font-bold shadow-md">
              대화법·갈등 해결 상세 궁합 리포트 보기 <ArrowRight size={16} className="ml-1.5" />
            </Button>
          </Link>
        </div>
      )}

      <h1 className="text-3xl font-bold text-center mb-24">MBTI 검사 결과</h1>
      {error && <p role="alert" className="mb-4 text-red-700">{error}</p>}
      <ResultCard mbtiType={mbtiTypes[code]} onRestart={restart} onShare={() => {}} />
    </section>
  );
}

export default function ResultsClient() {
  return (
    <Suspense fallback={<p role="status" className="pt-28 p-12 text-center">결과를 불러오는 중입니다.</p>}>
      <ResultsInner />
    </Suspense>
  );
}
