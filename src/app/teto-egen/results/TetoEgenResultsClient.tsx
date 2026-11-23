"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { tetoEgenTypes, getCompatibilityDescription } from "@/lib/customTests/tetoEgenTypes";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CoupangRecommend } from "@/components/CoupangRecommend";
import { ShareButtons } from "@/components/ShareButtons";
import { IS_ADSENSE_REVIEW_MODE } from "@/lib/siteConfig";
import { RotateCcw, Users, Heart, Sparkles } from "lucide-react";

export default function TetoEgenResultsClient() {
  const router = useRouter();
  const [testResult, setTestResult] = useState<any>(null);
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem("tetoEgenResult");
      const result = raw ? JSON.parse(raw) : null;
      const balance = result?.balance;
      if (
        result &&
        typeof result.type === "string" &&
        Object.prototype.hasOwnProperty.call(tetoEgenTypes, result.type) &&
        balance &&
        typeof balance.teto === "number" &&
        typeof balance.egen === "number" &&
        Number.isFinite(balance.teto) &&
        Number.isFinite(balance.egen) &&
        balance.teto >= 0 &&
        balance.teto <= 100 &&
        balance.egen >= 0 &&
        balance.egen <= 100 &&
        Math.abs(balance.teto + balance.egen - 100) < 0.01
      ) {
        setTestResult(result);
      }
    } catch {
      /* Missing or corrupt storage shows the start prompt. */
    }
    setLoaded(true);
  }, []);

  const handleRestart = () => {
    try {
      sessionStorage.removeItem("tetoEgenResult");
      router.push("/teto-egen");
    } catch {
      setError("저장 결과를 지우지 못했습니다. 브라우저의 저장소 사용을 허용한 뒤 다시 시도해주세요.");
    }
  };

  if (!loaded) return <p role="status" className="pt-28 p-12 text-center">결과를 불러오는 중입니다.</p>;
  if (!testResult) {
    return (
      <section className="max-w-3xl mx-auto px-6 pt-28 pb-12 text-center">
        <h1 className="text-2xl font-bold mb-4">저장된 검사 결과가 없습니다</h1>
        <p className="mb-6">결과가 없거나 읽을 수 없습니다. 테토·에겐 검사를 시작해주세요.</p>
        <Link href="/teto-egen" className="underline text-primary">
          테토·에겐 검사 시작하기
        </Link>
      </section>
    );
  }

  const typeData = tetoEgenTypes[testResult.type];
  const bestPartnerType = typeData.compatibility.best;
  const bestPartner =
    tetoEgenTypes[Object.keys(tetoEgenTypes).find((key) => tetoEgenTypes[key].title === bestPartnerType) || ""];

  return (
    <div className="min-h-screen bg-neutral-50">
      {error && <p role="alert" className="p-4 text-red-700">{error}</p>}

      {/* Results Header */}
      <div className="gradient-bg text-white pt-28 pb-16">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <div className="animate-bounce-in">
            <div className="text-6xl mb-6">{typeData.emoji}</div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">테스트 완료!</h1>
            <p className="text-xl opacity-90">당신의 테토-에겐 유형을 분석했습니다</p>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-12">
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
                    {getCompatibilityDescription(
                      testResult.type,
                      Object.keys(tetoEgenTypes).find((key) => tetoEgenTypes[key] === bestPartner) || ""
                    )}
                  </p>
                </div>
              </div>
            )}

            {!IS_ADSENSE_REVIEW_MODE && (
              <div className="mt-8 mb-8">
                <CoupangRecommend
                  keyword={`${testResult.type} ${typeData.title} 선물`}
                  title={`🛍️ ${typeData.title} 맞춤 추천 상품`}
                />
              </div>
            )}

            <ShareButtons
              title="테토 vs 에겐 진단 결과"
              shareText={`나의 호르몬 성향은 '${typeData.title}'입니다!`}
              url="https://mbtifinder.com/teto-egen"
            />

            <div className="mt-8 flex justify-center pb-8">
              <Button
                onClick={handleRestart}
                className="bg-gradient-to-r from-neutral-800 to-neutral-900 text-white px-8 py-6 rounded-full text-lg hover:shadow-lg transition-transform hover:-translate-y-1"
              >
                <RotateCcw size={20} className="mr-2" />
                다시 테스트하기
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white rounded-3xl shadow-lg p-8">
          <CardContent className="p-0">
            <h3 className="text-2xl font-bold text-neutral-800 mb-6 text-center">모든 테토-에겐 유형</h3>
            <div className="grid md:grid-cols-2 gap-6">
              {Object.values(tetoEgenTypes).map((type) => (
                <div
                  key={type.code}
                  className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                    type.code === testResult.type
                      ? "border-primary bg-primary/10"
                      : "border-neutral-200 hover:border-neutral-300"
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
