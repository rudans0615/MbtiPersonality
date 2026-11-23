import { Answer } from '@/hooks/useMBTITest';

export interface MBTIAxisScore {
  first: 'E' | 'S' | 'T' | 'J';
  second: 'I' | 'N' | 'F' | 'P';
  firstLabel: string;
  secondLabel: string;
  firstPercent: number;
  secondPercent: number;
  winner: 'E' | 'I' | 'S' | 'N' | 'T' | 'F' | 'J' | 'P';
  isBorderline: boolean;
}

export interface MBTIAxesBreakdown {
  EI: MBTIAxisScore;
  SN: MBTIAxisScore;
  TF: MBTIAxisScore;
  JP: MBTIAxisScore;
}

export interface MBTICalculationResult {
  type: string;
  axes: MBTIAxesBreakdown;
}

/**
 * 중앙 정렬 Likert 채점 (-2 ~ +2)
 * - value 1 (매우 그렇다) = +2, 2 (그렇다) = +1, 3 (보통) = 0, 4 (그렇지 않다) = -1, 5 (전혀 그렇지 않다) = -2
 * - 각 지표가 8:8 대칭이므로 모든 문항에 같은 답(예: 전부 "그렇다")을 눌러도 정확히 50% : 50%로 수렴
 */
export function calculateMBTIDetailed(answers: Answer[]): MBTICalculationResult {
  const net = { EI: 0, SN: 0, TF: 0, JP: 0 };
  const counts = { EI: 0, SN: 0, TF: 0, JP: 0 };

  for (const answer of answers) {
    const delta = 3 - answer.value; // -2 ~ +2
    switch (answer.dimension) {
      case 'E':
        net.EI += delta;
        counts.EI++;
        break;
      case 'I':
        net.EI -= delta;
        counts.EI++;
        break;
      case 'S':
        net.SN += delta;
        counts.SN++;
        break;
      case 'N':
        net.SN -= delta;
        counts.SN++;
        break;
      case 'T':
        net.TF += delta;
        counts.TF++;
        break;
      case 'F':
        net.TF -= delta;
        counts.TF++;
        break;
      case 'J':
        net.JP += delta;
        counts.JP++;
        break;
      case 'P':
        net.JP -= delta;
        counts.JP++;
        break;
    }
  }

  const buildAxis = <A extends 'E' | 'S' | 'T' | 'J', B extends 'I' | 'N' | 'F' | 'P'>(
    first: A,
    second: B,
    firstLabel: string,
    secondLabel: string,
    netScore: number,
    itemCount: number
  ): MBTIAxisScore => {
    const maxAbs = Math.max(1, itemCount * 2);
    const rawRatio = (netScore + maxAbs) / (2 * maxAbs);
    const firstPercent = Math.max(0, Math.min(100, Math.round(rawRatio * 100)));
    const secondPercent = 100 - firstPercent;
    const winner = netScore >= 0 ? (netScore === 0 ? second : first) : second;
    const isBorderline = firstPercent >= 45 && firstPercent <= 55;
    return {
      first,
      second,
      firstLabel,
      secondLabel,
      firstPercent,
      secondPercent,
      winner,
      isBorderline,
    };
  };

  const axes: MBTIAxesBreakdown = {
    EI: buildAxis('E', 'I', '외향 (E)', '내향 (I)', net.EI, counts.EI),
    SN: buildAxis('S', 'N', '감각 (S)', '직관 (N)', net.SN, counts.SN),
    TF: buildAxis('T', 'F', '사고 (T)', '감정 (F)', net.TF, counts.TF),
    JP: buildAxis('J', 'P', '판단 (J)', '인식 (P)', net.JP, counts.JP),
  };

  const type = `${axes.EI.winner}${axes.SN.winner}${axes.TF.winner}${axes.JP.winner}`;
  return { type, axes };
}

export function calculateMBTIType(answers: Answer[]): string {
  return calculateMBTIDetailed(answers).type;
}
