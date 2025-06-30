import { useState, useCallback } from 'react';
import { mbtiQuestions } from '@/data/questions';
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

  const nextQuestion = useCallback((answerValue?: number) => {
    const valueToUse = answerValue !== undefined ? answerValue : selectedAnswer;
    console.log('MBTI nextQuestion called, valueToUse:', valueToUse, 'selectedAnswer:', selectedAnswer);
    
    if (valueToUse === null) {
      console.log('MBTI valueToUse is null, returning');
      return;
    }

    const question = mbtiQuestions[currentQuestion];
    const newAnswer: Answer = {
      questionId: question.id,
      value: valueToUse,
      dimension: question.dimension
    };

    setAnswers(prev => {
      const newAnswers = [...prev];
      newAnswers[currentQuestion] = newAnswer;
      return newAnswers;
    });

    setCurrentQuestion(prev => prev + 1);
    setSelectedAnswer(null);
  }, [currentQuestion, selectedAnswer]);

  const previousQuestion = useCallback(() => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
      // Restore previous answer if exists
      if (answers[currentQuestion - 1]) {
        setSelectedAnswer(answers[currentQuestion - 1].value);
      } else {
        setSelectedAnswer(null);
      }
    }
  }, [currentQuestion, answers]);

  const restartTest = useCallback(() => {
    setCurrentQuestion(0);
    setAnswers([]);
    setSelectedAnswer(null);
  }, []);

  const calculateResults = useCallback(() => {
    return calculateMBTIType(answers);
  }, [answers]);

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
