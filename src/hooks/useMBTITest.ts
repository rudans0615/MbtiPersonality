import { useState, useCallback } from 'react';
import { mbtiQuestions } from '@/lib/customTests/mbtiQuestions';
import { calculateMBTIType } from '@/utils/mbtiCalculator';

export interface Answer {
  questionId: number;
  value: number;
  dimension: string;
}

export function useMBTITest() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);

  const selectAnswer = useCallback((value: number) => {
    setSelectedAnswer(value);
  }, []);

  const withCurrentAnswer = useCallback((answerValue?: number): Answer[] | null => {
    const value = answerValue ?? selectedAnswer;
    const question = mbtiQuestions[currentQuestion];
    if (!question || value === null || !Number.isInteger(value) || value < 1 || value > 5) return null;
    return [...answers.slice(0, currentQuestion), { questionId: question.id, value, dimension: question.dimension }];
  }, [answers, currentQuestion, selectedAnswer]);

  const nextQuestion = useCallback((answerValue?: number) => {
    const updated = withCurrentAnswer(answerValue);
    if (!updated || currentQuestion >= mbtiQuestions.length - 1) return;
    setAnswers(updated);
    setCurrentQuestion(prev => prev + 1);
    setSelectedAnswer(null);
  }, [currentQuestion, withCurrentAnswer]);

  const previousQuestion = useCallback(() => {
    if (currentQuestion > 0) {
      const previousQuestionIndex = currentQuestion - 1;
      
      // 이전 질문의 답변 제거
      setAnswers(prev => prev.slice(0, previousQuestionIndex));
      
      setCurrentQuestion(previousQuestionIndex);
      setSelectedAnswer(null); // 선택 항목 초기화
    }
  }, [currentQuestion]);

  const restartTest = useCallback(() => {
    setCurrentQuestion(0);
    setAnswers([]);
    setSelectedAnswer(null);
  }, []);

  const calculateResults = useCallback((answerValue?: number) => {
    const updated = withCurrentAnswer(answerValue);
    if (!updated || updated.length !== mbtiQuestions.length ||
      !updated.every((a, i) => a.questionId === mbtiQuestions[i].id)) return null;
    return calculateMBTIType(updated);
  }, [withCurrentAnswer]);

  const isLastQuestion = currentQuestion >= mbtiQuestions.length - 1;
  const canGoNext = selectedAnswer !== null;
  const canGoPrevious = currentQuestion > 0;
  const progress = ((currentQuestion + 1) / mbtiQuestions.length) * 100;

  return {
    currentQuestion,
    selectedAnswer,
    answers,
    selectAnswer,
    nextQuestion,
    previousQuestion,
    restartTest,
    calculateResults,
    isLastQuestion,
    canGoNext,
    canGoPrevious,
    progress,
    totalQuestions: mbtiQuestions.length,
    currentQuestionData: mbtiQuestions[currentQuestion]
  };
}
