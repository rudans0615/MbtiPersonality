import { useLocation } from "wouter";
import { useMBTITest } from "@/hooks/useMBTITest";
import { mbtiTypes } from "@/data/mbtiTypes";
import ProgressBar from "@/components/ProgressBar";
import QuestionCard from "@/components/QuestionCard";
import Navigation from "@/components/Navigation";
import AdSense from "@/components/AdSense";

export default function Test() {
  const [, setLocation] = useLocation();
  const {
    currentQuestion,
    selectedAnswer,
    selectAnswer,
    nextQuestion,
    previousQuestion,
    calculateResults,
    isLastQuestion,
    canGoNext,
    canGoPrevious,
    progress,
    totalQuestions,
    currentQuestionData
  } = useMBTITest();

  const handleNext = () => {
    if (isLastQuestion) {
      const result = calculateResults();
      // Store result in sessionStorage for results page
      sessionStorage.setItem('mbtiResult', result);
      setLocation('/results');
    } else {
      nextQuestion();
    }
  };

  if (!currentQuestionData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      <Navigation />
      
      {/* Progress Header */}
      <div className="bg-white shadow-sm sticky top-0 z-20">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-neutral-800">MBTI 성격유형 검사</h2>
            <span className="text-neutral-600">{currentQuestion + 1} / {totalQuestions}</span>
          </div>
          <ProgressBar current={currentQuestion + 1} total={totalQuestions} />
        </div>
      </div>

      {/* Question Content */}
      <div className="max-w-3xl mx-auto px-6 py-12">
        <QuestionCard
          question={currentQuestionData}
          selectedAnswer={selectedAnswer}
          onAnswerSelect={selectAnswer}
          onNext={() => {
            console.log('handleNext called in test.tsx');
            handleNext();
          }}
          onPrevious={previousQuestion}
          canGoNext={canGoNext}
          canGoPrevious={canGoPrevious}
          isLastQuestion={isLastQuestion}
        />

        {/* AdSense - Middle */}
        {(currentQuestion + 1) % 20 === 0 && (
          <AdSense 
            adSlot="1234567891"
            className="mt-8"
          />
        )}
      </div>
    </div>
  );
}
