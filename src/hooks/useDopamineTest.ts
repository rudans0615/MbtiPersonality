import { useState } from "react";
import { dopamineQuestions, calculateDopamineType, DopamineOption } from "@/data/dopamineTestQuestions";

export interface DopamineAnswer {
  questionId: number;
  type: string;
}

export function useDopamineTest() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<DopamineAnswer[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);

  const currentQuestion = dopamineQuestions[currentQuestionIndex];
  const isFirstQuestion = currentQuestionIndex === 0;
  const isLastQuestion = currentQuestionIndex === dopamineQuestions.length - 1;

  const handleAnswerSelect = (type: string) => {
    setSelectedAnswer(type);
  };

  const goToNext = (answerType?: string) => {
    const valueToUse = answerType || selectedAnswer;
    if (valueToUse === null) {
      return;
    }

    // 답변 저장
    const newAnswer: DopamineAnswer = {
      questionId: currentQuestion.id,
      type: valueToUse
    };

    const updatedAnswers = [...answers];
    const existingIndex = updatedAnswers.findIndex(a => a.questionId === currentQuestion.id);
    
    if (existingIndex >= 0) {
      updatedAnswers[existingIndex] = newAnswer;
    } else {
      updatedAnswers.push(newAnswer);
    }
    
    setAnswers(updatedAnswers);

    if (isLastQuestion) {
      // 테스트 완료 - 결과 계산
      const answerTypes = updatedAnswers.map(a => a.type as 'SHORT_FORM' | 'SUGAR' | 'FLEX' | 'DETOX');
      const resultType = calculateDopamineType(answerTypes);
      
      // 결과를 세션 스토리지에 저장
      sessionStorage.setItem('dopamineResult', JSON.stringify({
        type: resultType,
        answers: updatedAnswers
      }));
      
      return 'COMPLETE';
    } else {
      // 다음 질문으로
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(null);
      return 'NEXT';
    }
  };

  const goToPrevious = () => {
    if (isFirstQuestion) return;
    
    const previousQuestionIndex = currentQuestionIndex - 1;
    const previousQuestionId = dopamineQuestions[previousQuestionIndex].id;
    
    // 이전 질문의 답변 제거
    setAnswers(prev => prev.filter(a => a.questionId !== previousQuestionId));
    
    setCurrentQuestionIndex(previousQuestionIndex);
    setSelectedAnswer(null); // 선택 항목 초기화
  };

  const restart = () => {
    setCurrentQuestionIndex(0);
    setAnswers([]);
    setSelectedAnswer(null);
    sessionStorage.removeItem('dopamineResult');
  };

  return {
    currentQuestion,
    currentQuestionIndex,
    selectedAnswer,
    isFirstQuestion,
    isLastQuestion,
    progress: ((currentQuestionIndex + 1) / dopamineQuestions.length) * 100,
    totalQuestions: dopamineQuestions.length,
    handleAnswerSelect,
    goToNext,
    goToPrevious,
    restart,
    canGoNext: selectedAnswer !== null,
    canGoPrevious: !isFirstQuestion,
    answers,
    setCurrentQuestionIndex,
    setSelectedAnswer
  };
}
