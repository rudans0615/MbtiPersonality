import { useState } from "react";
import { useLocation } from "wouter";
import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { mbtiMatchTestQuestions } from "@/data/mbtiMatchTestQuestions";

export default function MbtiMatchTestTest() {
  const [, setLocation] = useLocation();
  const [currentStep, setCurrentStep] = useState(0);
  const [score, setScore] = useState(0);

  const handleAnswer = (points: number) => {
    const newScore = score + points;
    if (currentStep < mbtiMatchTestQuestions.length - 1) {
      setScore(newScore);
      setCurrentStep(curr => curr + 1);
    } else {
      setLocation(`/mbtiMatchTest-results?score=${newScore}`);
    }
  };

  const question = mbtiMatchTestQuestions[currentStep];

  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col font-sans">
      <Navigation />
      <main className="flex-grow max-w-2xl mx-auto w-full px-4 py-8 flex flex-col">
        <div className="bg-white rounded-3xl p-8 shadow-sm flex-grow flex flex-col justify-center text-center">
          <h2 className="text-2xl font-bold mb-8">{question?.question || "Discover Your Perfect MBTI Match!"}</h2>
          <div className="space-y-4">
            {question?.options?.map((opt: any, idx: number) => (
              <Button key={idx} onClick={() => handleAnswer(opt.score)} className="w-full h-16 text-lg" variant="outline">
                {opt.text}
              </Button>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}