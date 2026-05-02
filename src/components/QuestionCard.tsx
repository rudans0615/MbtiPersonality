import { MBTIQuestion } from "@/lib/customTests/mbtiQuestions";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface QuestionCardProps {
  question: MBTIQuestion;
  selectedAnswer: number | null;
  onAnswerSelect: (value: number) => void;
  onNext: (answerValue?: number) => void;
  onPrevious: () => void;
  canGoNext: boolean;
  canGoPrevious: boolean;
  isLastQuestion: boolean;
}

const answerOptions = [
  { value: 1, text: "매우 그렇다" },
  { value: 2, text: "그렇다" },
  { value: 3, text: "보통이다" },
  { value: 4, text: "그렇지 않다" },
  { value: 5, text: "전혀 그렇지 않다" }
];

export default function QuestionCard({
  question,
  selectedAnswer,
  onAnswerSelect,
  onNext,
  onPrevious,
  canGoNext,
  canGoPrevious,
  isLastQuestion
}: QuestionCardProps) {
  return (
    <Card className="w-full max-w-3xl mx-auto bg-white rounded-3xl shadow-lg animate-slide-up">
      <CardContent className="p-8 md:p-12">
        <div className="text-center mb-8">
          <div className="text-4xl mb-4">{question.emoji}</div>
          <h3 className="text-2xl font-semibold text-neutral-800 mb-4">
            {question.text}
          </h3>
          <p className="text-neutral-600">가장 적합한 답변을 선택해주세요.</p>
        </div>

        <div className="space-y-4">
          {answerOptions.map((option) => (
            <button
              key={option.value}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                
                // Check if already selected to prevent double execution
                if (selectedAnswer === option.value) {
                  return;
                }
                
                onAnswerSelect(option.value);
                // Auto-advance after a short delay
                setTimeout(() => {
                  onNext(option.value);
                }, 200);
              }}
              className={`w-full text-left p-6 rounded-2xl border-2 transition-all duration-300 ${
                selectedAnswer === option.value
                  ? "border-primary bg-primary/10"
                  : "border-neutral-200 hover:border-primary hover:bg-primary/5"
              }`}
            >
              <div className="flex items-center">
                <div className="w-6 h-6 rounded-full border-2 border-neutral-300 mr-4 flex items-center justify-center">
                  <div 
                    className={`w-3 h-3 rounded-full bg-primary transition-opacity ${
                      selectedAnswer === option.value ? "opacity-100" : "opacity-0"
                    }`}
                  />
                </div>
                <span className="text-lg">{option.text}</span>
              </div>
            </button>
          ))}
        </div>

        {canGoPrevious && (
          <div className="mt-8 pt-6 border-t border-neutral-100 flex justify-center">
            <Button
              onClick={onPrevious}
              variant="ghost"
              className="text-neutral-400 hover:text-primary hover:bg-primary/5 transition-all"
            >
              <i className="fas fa-arrow-left mr-2"></i> 이전 문항으로
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
