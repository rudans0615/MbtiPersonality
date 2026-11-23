"use client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useDrunkTest } from "@/hooks/useDrunkTest";
import { selfAwarenessResults } from "@/lib/customTests/drunkTestTypes";
import { CoupangRecommend } from "@/components/CoupangRecommend";
import { IS_ADSENSE_REVIEW_MODE } from "@/lib/siteConfig";
import Link from "next/link";

export default function DrunkClient() {
  const {
    currentQuestion,
    currentQuestionIndex,
    totalQuestions,
    progress,
    isCompleted,
    selectAnswer,
    nextQuestion,
    previousQuestion,
    getCurrentAnswer,
    getResult,
    restart,
    canGoPrevious,
    isLastQuestion,
  } = useDrunkTest();

  if (isCompleted) {
    const resultCode = getResult();
    const result = selfAwarenessResults[resultCode];

    const handleShare = (platform: string) => {
      const shareText = `나의 현재 상태: ${result.title}\n${result.memeText}\n\n#자가진단 #재미있는테스트`;
      const shareUrl = "https://mbtifinder.com/drunk";

      if (platform === "native" && "share" in navigator && navigator.share) {
        navigator.share({
          title: `자가진단 결과: ${result.title}`,
          text: shareText,
          url: shareUrl,
        }).catch(() => {});
        return;
      }

      if (platform === "twitter") {
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${shareUrl}`);
      } else if (platform === "facebook") {
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`);
      } else if (platform === "kakao") {
        navigator.clipboard.writeText(`${shareText}\n${shareUrl}`);
        alert("링크가 클립보드에 복사되었습니다!");
      }
    };

    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 pt-24 pb-12">
        <div className="max-w-2xl mx-auto px-4">
          <div className="text-center mb-6">
            <Link href="/">
              <Button variant="ghost" className="text-neutral-600 hover:text-primary">
                <span className="text-xl mr-2">🏠</span>홈으로
              </Button>
            </Link>
          </div>

          <Card className="bg-white/85 backdrop-blur-sm shadow-2xl rounded-3xl overflow-hidden">
            <CardContent className="p-8">
              <div className="text-center mb-8">
                <div className={`inline-flex items-center justify-center w-24 h-24 ${result.color} rounded-full mb-6 shadow-lg`}>
                  <span className="text-4xl">{result.emoji}</span>
                </div>
                <h1 className="text-3xl font-bold text-neutral-800 mb-2">{result.title}</h1>
                <p className="text-lg text-neutral-600 mb-4">{result.subtitle}</p>
                <div className="bg-neutral-100 rounded-xl p-4 mb-6">
                  <p className="text-lg font-medium text-neutral-700">&ldquo;{result.memeText}&rdquo;</p>
                </div>
              </div>

              <div className="space-y-6">
                <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6">
                  <h2 className="text-xl font-semibold text-neutral-800 mb-4">
                    <span className="text-2xl mr-2">🎭</span>현재 상태
                  </h2>
                  <p className="text-neutral-700 leading-relaxed mb-4">{result.description}</p>
                  <div className="bg-white/70 rounded-lg p-4">
                    <p className="text-center text-lg font-medium text-neutral-600 italic">&ldquo;{result.funnyQuote}&rdquo;</p>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-blue-50 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-blue-800 mb-3">
                      <span className="text-xl mr-2">🔍</span>특징
                    </h3>
                    <ul className="space-y-2">
                      {result.characteristics.map((characteristic, index) => (
                        <li key={index} className="flex items-center text-blue-700">
                          <span className="text-sm mr-2">•</span>
                          {characteristic}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="bg-orange-50 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-orange-800 mb-3">
                      <span className="text-xl mr-2">💡</span>조언
                    </h3>
                    <ul className="space-y-2">
                      {result.advice.map((advice, index) => (
                        <li key={index} className="flex items-center text-orange-700">
                          <span className="text-sm mr-2">•</span>
                          {advice}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {!IS_ADSENSE_REVIEW_MODE && (
                  <CoupangRecommend keyword={`${result.title} 숙취해소`} title="취한 나를 위한 필수 아이템 🍺" />
                )}

                <p className="text-xs text-neutral-500 text-center">
                  재미를 위한 유머 테스트이며 실제 혈중알코올농도 측정이나 음주운전 가능 여부 판단에 사용할 수 없습니다.
                </p>

                <div className="bg-gradient-to-r from-pink-50 to-purple-50 rounded-xl p-6 text-center">
                  <h3 className="text-lg font-semibold text-neutral-800 mb-4">결과 공유하기</h3>
                  <div className="flex justify-center space-x-3 flex-wrap gap-2">
                    <Button onClick={() => handleShare("twitter")} className="bg-blue-500 hover:bg-blue-600 text-white px-5 py-2">
                      🐦 트위터
                    </Button>
                    <Button onClick={() => handleShare("facebook")} className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2">
                      📘 페이스북
                    </Button>
                    <Button onClick={() => handleShare("kakao")} className="bg-yellow-400 hover:bg-yellow-500 text-black px-5 py-2">
                      💬 링크 복사
                    </Button>
                  </div>
                </div>

                <div className="flex space-x-4 pt-4">
                  <Button
                    onClick={restart}
                    className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white py-3 text-lg font-semibold rounded-xl"
                  >
                    🔄 다시 테스트하기
                  </Button>
                  <Link href="/" className="flex-1">
                    <Button variant="outline" className="w-full py-3 text-lg font-semibold rounded-xl">
                      🏠 홈으로 가기
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const currentAnswer = getCurrentAnswer();

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 pt-24 pb-12">
      <div className="max-w-2xl mx-auto px-4">
        <div className="text-center mb-8">
          <div className="bg-white/85 backdrop-blur-sm rounded-2xl p-6 shadow-lg mb-6">
            <h1 className="text-3xl font-bold text-neutral-800 mb-2">
              <span className="text-4xl mr-3">🍻</span>
              나 술 취했나? 테스트
            </h1>
            <p className="text-neutral-600 mb-4">지금 나의 취함 정도와 주사 패턴을 10문항으로 유쾌하게 점검해보세요!</p>
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-neutral-600">
                <span>질문 {currentQuestionIndex + 1}/{totalQuestions}</span>
                <span>{Math.round(progress)}% 완료</span>
              </div>
              <Progress value={progress} className="h-3" />
            </div>
          </div>
        </div>

        <Card className="bg-white/85 backdrop-blur-sm shadow-2xl rounded-3xl overflow-hidden">
          <CardContent className="p-8">
            <div className="text-center mb-8">
              <div className="text-6xl mb-4">{currentQuestion.emoji}</div>
              <h2 className="text-2xl font-bold text-neutral-800 mb-4">{currentQuestion.text}</h2>
            </div>

            <div className="space-y-4 mb-8">
              {currentQuestion.options.map((option, index) => (
                <button
                  key={index}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    if (currentAnswer?.score === option.score) return;
                    selectAnswer(option.score);
                    setTimeout(() => {
                      if (isLastQuestion) {
                        setTimeout(() => nextQuestion(), 200);
                      } else {
                        nextQuestion();
                      }
                    }, 200);
                  }}
                  className={`w-full p-4 rounded-xl border-2 transition-all duration-200 text-left ${
                    currentAnswer?.score === option.score
                      ? "border-purple-500 bg-purple-50 shadow-md"
                      : "border-neutral-200 hover:border-purple-300 hover:bg-purple-50/40"
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{option.emoji}</span>
                    <span className="text-lg font-medium text-neutral-700">{option.text}</span>
                  </div>
                </button>
              ))}
            </div>

            {canGoPrevious && (
              <div className="mt-8 pt-6 border-t border-purple-100 flex justify-center">
                <Button onClick={previousQuestion} variant="ghost" className="text-neutral-500 hover:text-purple-600 hover:bg-purple-50">
                  ← 이전 문항으로
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        <section className="mt-8 bg-white/80 rounded-2xl p-6 text-sm text-neutral-600 space-y-2 border border-white">
          <h2 className="text-base font-bold text-neutral-800">테스트 안내</h2>
          <p>
            술자리에서 나타나는 시야, 대화 속도, 연락 충동, 감정 기복 등 10가지 행동 신호를 바탕으로 현재 상태를 4단계로 재미있게 분류합니다.
            건강한 음주 습관을 위해 물 섭취와 안전한 귀가를 우선해 주세요.
          </p>
        </section>
      </div>
    </div>
  );
}
