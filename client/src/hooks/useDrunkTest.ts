import { useState } from 'react';
import { drunkTestQuestions } from '@/data/drunkTestQuestions';
import { calculateAwarenessLevel } from '@/data/drunkTestTypes';

export interface DrunkTestAnswer {
  questionId: number;
  score: number;
}

export function useDrunkTest() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<DrunkTestAnswer[]>([]);
  const [isCompleted, setIsCompleted] = useState(false);

  const currentQuestion = drunkTestQuestions[currentQuestionIndex];
  const totalQuestions = drunkTestQuestions.length;
  const progress = ((currentQuestionIndex + 1) / totalQuestions) * 100;

  const selectAnswer = (score: number) => {
    const newAnswer: DrunkTestAnswer = {
      questionId: currentQuestion.id,
      score: score
    };

    const updatedAnswers = [...answers.filter(a => a.questionId !== currentQuestion.id), newAnswer];
    setAnswers(updatedAnswers);
  };

  const nextQuestion = () => {
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      setIsCompleted(true);
    }
  };

  const previousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const getCurrentAnswer = (): DrunkTestAnswer | null => {
    return answers.find(a => a.questionId === currentQuestion.id) || null;
  };

  const getTotalScore = (): number => {
    return answers.reduce((total, answer) => total + answer.score, 0);
  };

  const getResult = (): string => {
    const totalScore = getTotalScore();
    return calculateAwarenessLevel(totalScore);
  };

  const restart = () => {
    setCurrentQuestionIndex(0);
    setAnswers([]);
    setIsCompleted(false);
  };

  const canGoNext = getCurrentAnswer() !== null;
  const canGoPrevious = currentQuestionIndex > 0;
  const isLastQuestion = currentQuestionIndex === totalQuestions - 1;

  return {
    currentQuestion,
    currentQuestionIndex,
    totalQuestions,
    progress,
    answers,
    isCompleted,
    selectAnswer,
    nextQuestion,
    previousQuestion,
    getCurrentAnswer,
    getTotalScore,
    getResult,
    restart,
    canGoNext,
    canGoPrevious,
    isLastQuestion,
    setIsCompleted
  };
}