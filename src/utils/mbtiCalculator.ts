import { Answer } from '@/hooks/useMBTITest';

export function calculateMBTIType(answers: Answer[]): string {
  const scores = { E: 0, I: 0, S: 0, N: 0, T: 0, F: 0, J: 0, P: 0 };

  answers.forEach(answer => {
    const value = answer.value;
    const dimension = answer.dimension;

    // Score calculation based on Likert scale (1-5)
    // 1 = Strongly agree, 5 = Strongly disagree
    // Higher raw score means more agreement with the statement
    const rawScore = 6 - value; // Convert to 1-5 where 5 means strong agreement

    if (dimension === 'E') {
      scores.E += rawScore;
      scores.I += value;
    } else if (dimension === 'I') {
      scores.I += rawScore;
      scores.E += value;
    } else if (dimension === 'S') {
      scores.S += rawScore;
      scores.N += value;
    } else if (dimension === 'N') {
      scores.N += rawScore;
      scores.S += value;
    } else if (dimension === 'T') {
      scores.T += rawScore;
      scores.F += value;
    } else if (dimension === 'F') {
      scores.F += rawScore;
      scores.T += value;
    } else if (dimension === 'J') {
      scores.J += rawScore;
      scores.P += value;
    } else if (dimension === 'P') {
      scores.P += rawScore;
      scores.J += value;
    }
  });

  // Determine MBTI type based on highest scores
  const mbtiType = 
    (scores.E > scores.I ? 'E' : 'I') +
    (scores.S > scores.N ? 'S' : 'N') +
    (scores.T > scores.F ? 'T' : 'F') +
    (scores.J > scores.P ? 'J' : 'P');

  return mbtiType;
}
