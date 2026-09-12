export interface GenericQuestion {
  options: { type_code: string | null; score: number | null }[];
}
export interface GenericScoring {
  mode: 'types' | 'score';
  questionCount: number;
  allowedTypes: string[][];
  minScore: number;
  maxScore: number;
}
export interface ScoreRange { min_score?: number | null; max_score?: number | null }
export type GenericResolution = { key: string; error: null } | { key: null; error: 'missing' | 'invalid' | 'unavailable' };

export function getGenericScoring(questions: GenericQuestion[]): GenericScoring {
  const first = questions[0]?.options[0];
  return {
    mode: first?.type_code && first.score == null ? 'types' : 'score',
    questionCount: questions.length,
    allowedTypes: questions.map(q => q.options.map(o => o.type_code || '')),
    minScore: questions.reduce((sum, q) => sum + Math.min(...q.options.map(o => o.score ?? 1)), 0),
    maxScore: questions.reduce((sum, q) => sum + Math.max(...q.options.map(o => o.score ?? 1)), 0),
  };
}

/** searchParams already decodes URL values. Preserve first-seen tie order. */
export function resolveGenericResult(
  params: Pick<URLSearchParams, 'getAll'>,
  results: Record<string, ScoreRange>,
  scoring: GenericScoring,
): GenericResolution {
  const fail = (error: 'missing' | 'invalid' | 'unavailable'): GenericResolution => ({ key: null, error });
  if (!scoring.questionCount || !Object.keys(results).length) return fail('unavailable');
  const types = params.getAll('types');
  const scores = params.getAll('score');
  if (!types.length && !scores.length) return fail('missing');
  if (scoring.mode === 'types') {
    if (types.length !== 1 || scores.length) return fail('invalid');
    const answers = types[0].split(',');
    if (answers.length !== scoring.questionCount || answers.some((code, index) =>
      !code || !Object.prototype.hasOwnProperty.call(results, code) || !scoring.allowedTypes[index]?.includes(code))) return fail('invalid');
    const counts: Record<string, number> = Object.create(null);
    answers.forEach(code => { counts[code] = (counts[code] || 0) + 1; });
    const key = Object.entries(counts).sort((a, b) => b[1] - a[1])[0][0];
    return { key, error: null };
  }
  if (scores.length !== 1 || types.length || !/^-?\d+$/.test(scores[0])) return fail('invalid');
  const score = Number(scores[0]);
  if (!Number.isSafeInteger(score) || score < scoring.minScore || score > scoring.maxScore) return fail('invalid');
  for (const [key, range] of Object.entries(results)) {
    if (typeof range.min_score === 'number' && Number.isFinite(range.min_score) &&
      typeof range.max_score === 'number' && Number.isFinite(range.max_score) &&
      score >= range.min_score && score <= range.max_score) return { key, error: null };
  }
  return fail('unavailable');
}
