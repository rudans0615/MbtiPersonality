export const calculateWorkLifeBalanceTestLevel = (score: number) => {
  const keys = Object.keys(workLifeBalanceResults);
  const numKeys = keys.length;
  if (numKeys === 0) return "";
  const maxScore = 10 * 4;
  const minScore = 10;
  const range = maxScore - minScore;
  const step = range / numKeys;
  const idx = Math.min(Math.floor((score - minScore) / step), numKeys - 1);
  return keys[Math.max(0, idx)];
};

export const workLifeBalanceResults: Record<string, any> = undefined;