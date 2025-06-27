import { useState } from "react";
import { tetoEgenQuestions, tetoEgenAnswers } from "@/data/tetoEgenQuestions";
import { tetoEgenTypes, getTetoEgenBalance } from "@/data/tetoEgenTypes";

export interface TetoEgenAnswer {
  questionId: number;
  value: number | string;
}

export function useTetoEgenTest() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<TetoEgenAnswer[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<number | string | null>(null);
  const [gender, setGender] = useState<string | null>(null);

  const currentQuestion = tetoEgenQuestions[currentQuestionIndex];
  const isFirstQuestion = currentQuestionIndex === 0;
  const isLastQuestion = currentQuestionIndex === tetoEgenQuestions.length - 1;

  const handleAnswerSelect = (value: number | string) => {
    setSelectedAnswer(value);
    
    // 성별 질문인 경우 gender 상태 업데이트
    if (currentQuestion.type === 'gender') {
      setGender(value as string);
    }
  };

  const goToNext = () => {
    if (selectedAnswer === null) return;

    // 답변 저장
    const newAnswer: TetoEgenAnswer = {
      questionId: currentQuestion.id,
      value: selectedAnswer
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
      const personalityAnswers = updatedAnswers
        .filter(a => a.questionId !== 1) // 성별 질문 제외
        .map(a => a.value as number);
      
      const balance = getTetoEgenBalance(personalityAnswers);
      const resultType = calculateTetoEgenType(gender!, balance);
      
      // 결과를 세션 스토리지에 저장
      sessionStorage.setItem('tetoEgenResult', JSON.stringify({
        type: resultType,
        balance,
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
    
    setCurrentQuestionIndex(currentQuestionIndex - 1);
    
    // 이전 답변 복원
    const previousAnswer = answers.find(a => a.questionId === tetoEgenQuestions[currentQuestionIndex - 1].id);
    setSelectedAnswer(previousAnswer?.value || null);
  };

  const restart = () => {
    setCurrentQuestionIndex(0);
    setAnswers([]);
    setSelectedAnswer(null);
    setGender(null);
    sessionStorage.removeItem('tetoEgenResult');
  };

  const calculateTetoEgenType = (userGender: string, balance: { teto: number; egen: number }): string => {
    // 테토 성향이 더 강한 경우
    if (balance.teto > balance.egen) {
      return userGender === 'M' ? 'TETO_M' : 'TETO_F';
    } else {
      return userGender === 'M' ? 'EGEN_M' : 'EGEN_F';
    }
  };

  const getAnswersForQuestion = (questionId: number) => {
    const questionAnswers = tetoEgenAnswers[questionId as keyof typeof tetoEgenAnswers];
    return questionAnswers?.answers || [];
  };

  return {
    currentQuestion,
    currentQuestionIndex,
    selectedAnswer,
    isFirstQuestion,
    isLastQuestion,
    progress: ((currentQuestionIndex + 1) / tetoEgenQuestions.length) * 100,
    totalQuestions: tetoEgenQuestions.length,
    handleAnswerSelect,
    goToNext,
    goToPrevious,
    restart,
    getAnswersForQuestion,
    canGoNext: selectedAnswer !== null,
    canGoPrevious: !isFirstQuestion
  };
}