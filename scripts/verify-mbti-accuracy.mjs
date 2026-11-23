import fs from 'fs';

// Parse mbtiQuestions.ts directly and test the exact same centered scoring algorithm
const qSrc = fs.readFileSync('src/lib/customTests/mbtiQuestions.ts', 'utf8');
const questions = [...qSrc.matchAll(/\{\s*id:\s*(\d+),\s*text:\s*"([^"]+)",\s*emoji:\s*"([^"]+)",\s*dimension:\s*"([EISNTFJP])"\s*\}/g)].map(
  (m) => ({ id: Number(m[1]), text: m[2], emoji: m[3], dimension: m[4] })
);

const assert = (cond, msg) => {
  if (!cond) {
    console.error('FAIL:', msg);
    process.exit(1);
  }
};

// 1. Exact count & 8:8 symmetry
assert(questions.length === 64, `Expected 64 questions, got ${questions.length}`);
const counts = {};
for (const q of questions) counts[q.dimension] = (counts[q.dimension] || 0) + 1;
for (const d of ['E', 'I', 'S', 'N', 'T', 'F', 'J', 'P']) {
  assert(counts[d] === 8, `Expected 8 items for ${d}, got ${counts[d]}`);
}

// 2. Interleaving: no two consecutive questions share the same axis
const axisOf = (d) => ({ E: 'EI', I: 'EI', S: 'SN', N: 'SN', T: 'TF', F: 'TF', J: 'JP', P: 'JP' }[d]);
for (let i = 1; i < questions.length; i++) {
  assert(
    axisOf(questions[i].dimension) !== axisOf(questions[i - 1].dimension),
    `Adjacent same-axis questions at Q${questions[i - 1].id} and Q${questions[i].id}`
  );
}

// Mirror calculateMBTIDetailed
function calc(answers) {
  const net = { EI: 0, SN: 0, TF: 0, JP: 0 };
  const c = { EI: 0, SN: 0, TF: 0, JP: 0 };
  for (const a of answers) {
    const delta = 3 - a.value;
    if (a.dimension === 'E') { net.EI += delta; c.EI++; }
    if (a.dimension === 'I') { net.EI -= delta; c.EI++; }
    if (a.dimension === 'S') { net.SN += delta; c.SN++; }
    if (a.dimension === 'N') { net.SN -= delta; c.SN++; }
    if (a.dimension === 'T') { net.TF += delta; c.TF++; }
    if (a.dimension === 'F') { net.TF -= delta; c.TF++; }
    if (a.dimension === 'J') { net.JP += delta; c.JP++; }
    if (a.dimension === 'P') { net.JP -= delta; c.JP++; }
  }
  const mk = (f, s, n, cnt) => {
    const maxAbs = cnt * 2;
    const fp = Math.round(((n + maxAbs) / (2 * maxAbs)) * 100);
    return { fp, sp: 100 - fp, winner: n > 0 ? f : s, isBorderline: fp >= 45 && fp <= 55 };
  };
  const EI = mk('E', 'I', net.EI, c.EI);
  const SN = mk('S', 'N', net.SN, c.SN);
  const TF = mk('T', 'F', net.TF, c.TF);
  const JP = mk('J', 'P', net.JP, c.JP);
  return { type: `${EI.winner}${SN.winner}${TF.winner}${JP.winner}`, axes: { EI, SN, TF, JP } };
}

// 3. Zero acquiescence bias for uniform answers 1..5
for (const uniformVal of [1, 2, 3, 4, 5]) {
  const res = calc(questions.map((q) => ({ questionId: q.id, value: uniformVal, dimension: q.dimension })));
  for (const ax of Object.values(res.axes)) {
    assert(ax.fp === 50 && ax.sp === 50 && ax.isBorderline, `Uniform value ${uniformVal} produced bias: ${ax.fp}/${ax.sp}`);
  }
}

// 4. All 16 MBTI personas (strong & moderate) must match 16/16 exactly
const ALL_16 = [
  'INTJ', 'INTP', 'ENTJ', 'ENTP',
  'INFJ', 'INFP', 'ENFJ', 'ENFP',
  'ISTJ', 'ISFJ', 'ESTJ', 'ESFJ',
  'ISTP', 'ISFP', 'ESTP', 'ESFP',
];

for (const persona of ALL_16) {
  const letters = new Set(persona.split(''));
  // Strong persona (agree=1, disagree=5)
  const strong = calc(questions.map((q) => ({ questionId: q.id, value: letters.has(q.dimension) ? 1 : 5, dimension: q.dimension })));
  assert(strong.type === persona, `Strong persona ${persona} resolved to ${strong.type}`);
  // Moderate persona with positive agreement bias (matching=2, non-matching=3)
  const moderateBiased = calc(questions.map((q) => ({ questionId: q.id, value: letters.has(q.dimension) ? 2 : 3, dimension: q.dimension })));
  assert(moderateBiased.type === persona, `Moderate biased persona ${persona} resolved to ${moderateBiased.type}`);
}

console.log(JSON.stringify({
  totalQuestions: questions.length,
  counts,
  adjacentSameAxis: 0,
  uniformBiasCheck: 'PASS (50/50 for all 1..5)',
  personas16Strong: '16/16 EXACT',
  personas16ModerateBiased: '16/16 EXACT',
}, null, 2));
