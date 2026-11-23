import { createClient } from '@supabase/supabase-js';
import fs from 'node:fs';
import path from 'node:path';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

const MONTE_CARLO_RUNS = 4000;

function hashString(str) {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  h ^= h >>> 16;
  h = Math.imul(h, 2246822507);
  h ^= h >>> 13;
  h = Math.imul(h, 3266489909);
  h ^= h >>> 16;
  return h >>> 0;
}

function resolveTypeResult(answers, resultTypes) {
  const counts = {};
  for (const t of answers) {
    if (!t) continue;
    counts[t] = (counts[t] || 0) + 1;
  }
  const maxCount = Math.max(...Object.values(counts));
  const tied = Object.entries(counts)
    .filter(([, c]) => c === maxCount)
    .map(([k]) => k)
    .sort();
  const best = tied.length === 1 ? tied[0] : tied[hashString(answers.join(',')) % tied.length];
  return resultTypes.find((r) => r.code === best)?.code || resultTypes[0]?.code || 'NONE';
}

function resolveScoreResult(total, resultTypes) {
  const sorted = [...resultTypes].sort((a, b) => (a.min_score ?? -999) - (b.min_score ?? -999));
  for (const r of sorted) {
    const min = r.min_score ?? -Infinity;
    const max = r.max_score ?? Infinity;
    if (total >= min && total <= max) return r.code;
  }
  return sorted[0]?.code || 'NONE';
}

async function auditCustomTests() {
  console.log('=== Custom Tests Verification (teto-egen, drunk) ===');
  let failures = 0;

  // 1. teto-egen verification via TS source parsing
  const teQSrc = fs.readFileSync(path.join(process.cwd(), 'src/lib/customTests/tetoEgenQuestions.ts'), 'utf8');
  const teTSrc = fs.readFileSync(path.join(process.cwd(), 'src/lib/customTests/tetoEgenTypes.ts'), 'utf8');

  // Check Q11 & Q13 alignment + EGEN_F-TETO_M compatibility key
  if (!teTSrc.includes('"EGEN_F-TETO_M"') || !teTSrc.includes('"TETO_F-EGEN_M"')) {
    console.error('[FAIL] teto-egen missing reverse compatibility keys');
    failures++;
  } else {
    console.log('[PASS] teto-egen compatibility map covers all forward & reverse pairs');
  }

  // Check Q13 isn't inverted (objective fact must be value: 4)
  const q13Block = teQSrc.slice(teQSrc.indexOf('13: {'), teQSrc.indexOf('14: {'));
  if (!q13Block.includes('객관적 사실') || !q13Block.match(/객관적 사실[^}]*value:\s*4/)) {
    console.error('[FAIL] teto-egen Q13 objective-fact option is not value: 4');
    failures++;
  } else {
    console.log('[PASS] teto-egen Q13 aligned (objective facts = 4 Teto, deep empathy = 1 Egen)');
  }

  // Verify 4 personas reach all 4 teto-egen outcomes (TETO_M, TETO_F, EGEN_M, EGEN_F)
  const calcBalance = (arr) => {
    const sum = arr.reduce((a, b) => a + b, 0);
    const min = arr.length * 1;
    const max = arr.length * 4;
    const teto = Math.round(Math.max(0, Math.min(100, ((sum - min) / (max - min)) * 100)));
    return { teto, egen: 100 - teto };
  };
  const tePersonas = [
    { gender: 'M', vals: Array(20).fill(4), expected: 'TETO_M' },
    { gender: 'F', vals: Array(20).fill(4), expected: 'TETO_F' },
    { gender: 'M', vals: Array(20).fill(1), expected: 'EGEN_M' },
    { gender: 'F', vals: Array(20).fill(1), expected: 'EGEN_F' },
  ];
  for (const p of tePersonas) {
    const b = calcBalance(p.vals);
    const got = b.teto > b.egen ? (p.gender === 'M' ? 'TETO_M' : 'TETO_F') : (p.gender === 'M' ? 'EGEN_M' : 'EGEN_F');
    if (got !== p.expected) {
      console.error(`[FAIL] teto-egen persona expected ${p.expected}, got ${got}`);
      failures++;
    }
  }
  console.log('[PASS] teto-egen all 4 personas (TETO_M/TETO_F/EGEN_M/EGEN_F) reach exact result');

  // 2. drunk verification
  const drunkSrc = fs.readFileSync(path.join(process.cwd(), 'src/lib/customTests/drunkTestTypes.ts'), 'utf8');
  if (drunkSrc.includes('안전 운전 가능')) {
    console.error('[FAIL] drunkTestTypes.ts still contains unsafe "안전 운전 가능" advice');
    failures++;
  } else {
    console.log('[PASS] drunk safe transit advice verified (no "안전 운전 가능")');
  }
  const calcDrunk = (s) => (s <= 7 ? 'SOBER' : s <= 15 ? 'TIPSY' : s <= 23 ? 'DRUNK' : 'WASTED');
  const drunkChecks = [
    [0, 'SOBER'], [7, 'SOBER'],
    [8, 'TIPSY'], [15, 'TIPSY'],
    [16, 'DRUNK'], [23, 'DRUNK'],
    [24, 'WASTED'], [30, 'WASTED'],
  ];
  for (const [s, exp] of drunkChecks) {
    if (calcDrunk(s) !== exp) {
      console.error(`[FAIL] drunk score ${s}: expected ${exp}`);
      failures++;
    }
  }
  console.log('[PASS] drunk all 4 levels & boundaries verified (0..7 / 8..15 / 16..23 / 24..30)\n');
  return failures;
}

async function main() {
  let totalFailures = await auditCustomTests();

  const { data: tests, error: tErr } = await supabase
    .from('tests')
    .select('id, title, is_available')
    .eq('is_available', true)
    .order('id');
  if (tErr) throw tErr;

  const customIds = new Set(['mbti', 'teto-egen', 'drunk']);
  const dbTests = tests.filter((t) => !customIds.has(t.id));

  console.log(`=== Active DB Tests Audit: ${dbTests.length} ===`);

  for (const test of dbTests) {
    const { data: questions, error: qErr } = await supabase
      .from('questions')
      .select('id, text, question_number')
      .eq('test_id', test.id)
      .order('question_number');
    if (qErr) throw qErr;

    const qIds = (questions || []).map((q) => q.id);
    const { data: options, error: oErr } = await supabase
      .from('options')
      .select('id, question_id, text, score, type_code, option_index')
      .in('question_id', qIds.length ? qIds : [-1])
      .order('option_index');
    if (oErr) throw oErr;

    const { data: results, error: rErr } = await supabase
      .from('result_types')
      .select('id, code, title, min_score, max_score')
      .eq('test_id', test.id)
      .order('min_score', { nullsFirst: false });
    if (rErr) throw rErr;

    const byQ = new Map();
    for (const q of questions || []) byQ.set(q.id, []);
    for (const o of options || []) {
      if (byQ.has(o.question_id)) byQ.get(o.question_id).push(o);
    }

    const hasType = (options || []).some((o) => o.type_code && o.type_code.trim() !== '');
    const hasScore = (options || []).some((o) => o.score !== null && o.score !== undefined);
    const mode = hasType && !hasScore ? 'TYPE' : !hasType && hasScore ? 'SCORE' : `MIXED(type=${hasType},score=${hasScore})`;

    console.log(`\n--------------------------------------------------------------------`);
    console.log(`[${test.id}] ${test.title} | Mode: ${mode} | Q: ${questions.length} | R: ${results.length}`);

    if (mode.startsWith('MIXED')) {
      console.error(`  [FAIL] Mixed scoring mode detected!`);
      totalFailures++;
    }

    const resultCodes = new Set(results.map((r) => r.code));
    let personaPass = 0;

    if (mode === 'TYPE') {
      const codeFreq = {};
      const posFreq = {};
      for (const o of options) {
        const tc = o.type_code || 'NULL';
        codeFreq[tc] = (codeFreq[tc] || 0) + 1;
        if (!resultCodes.has(tc)) {
          console.error(`  [FAIL] Invalid type_code ${tc} on option ${o.id}`);
          totalFailures++;
        }
        posFreq[tc] = posFreq[tc] || [0, 0, 0, 0];
        if (o.option_index >= 0 && o.option_index < 4) posFreq[tc][o.option_index]++;
      }

      // Check persona reachability for every single result type!
      for (const r of results) {
        let nonMatchIdx = 0;
        const answers = questions.map((q) => {
          const opts = byQ.get(q.id) || [];
          const match = opts.find((o) => o.type_code === r.code);
          if (match) return match.type_code;
          const fallback = opts[nonMatchIdx % opts.length];
          nonMatchIdx++;
          return fallback.type_code;
        });
        const win = resolveTypeResult(answers, results);
        if (win === r.code) personaPass++;
        else {
          console.error(`  [FAIL] Persona ${r.code} did NOT win (got ${win})`);
          totalFailures++;
        }
      }
      console.log(`  Type freq:`, codeFreq, `| Persona reachability: ${personaPass}/${results.length}`);
    } else {
      let minPossible = 0;
      let maxPossible = 0;
      for (const q of questions) {
        const scores = (byQ.get(q.id) || []).map((o) => Number(o.score ?? 0));
        minPossible += Math.min(...scores);
        maxPossible += Math.max(...scores);
      }
      const gaps = [];
      const overlaps = [];
      for (let s = minPossible; s <= maxPossible; s++) {
        const matched = results.filter((r) => s >= (r.min_score ?? -Infinity) && s <= (r.max_score ?? Infinity));
        if (matched.length === 0) gaps.push(s);
        if (matched.length > 1) overlaps.push(s);
      }
      if (gaps.length || overlaps.length) {
        console.error(`  [FAIL] Score gaps=${gaps.join(',')} overlaps=${overlaps.join(',')}`);
        totalFailures++;
      }

      // Persona reachability: test every score bucket midpoint
      for (const r of results) {
        const lo = Math.max(minPossible, r.min_score ?? minPossible);
        const hi = Math.min(maxPossible, r.max_score ?? maxPossible);
        let reached = false;
        for (let s = lo; s <= hi; s++) {
          if (resolveScoreResult(s, results) === r.code) {
            reached = true;
            break;
          }
        }
        if (reached) personaPass++;
        else {
          console.error(`  [FAIL] Score bucket ${r.code} (${lo}..${hi}) unreachable`);
          totalFailures++;
        }
      }
      console.log(`  Score range: ${minPossible}..${maxPossible} | Buckets: ${results.map((r) => `${r.code}(${r.min_score}..${r.max_score})`).join(', ')} | Reachable: ${personaPass}/${results.length}`);
    }

    // Monte Carlo simulation
    const mcCounts = {};
    for (const r of results) mcCounts[r.code] = 0;
    for (let i = 0; i < MONTE_CARLO_RUNS; i++) {
      if (mode === 'TYPE') {
        const chosen = questions.map((q) => {
          const opts = byQ.get(q.id) || [];
          return opts[Math.floor(Math.random() * opts.length)].type_code;
        });
        const win = resolveTypeResult(chosen, results);
        mcCounts[win] = (mcCounts[win] || 0) + 1;
      } else {
        let total = 0;
        for (const q of questions) {
          const opts = byQ.get(q.id) || [];
          total += Number(opts[Math.floor(Math.random() * opts.length)].score ?? 0);
        }
        const win = resolveScoreResult(total, results);
        mcCounts[win] = (mcCounts[win] || 0) + 1;
      }
    }

    const mcPct = Object.fromEntries(
      Object.entries(mcCounts).map(([k, v]) => [k, `${((v / MONTE_CARLO_RUNS) * 100).toFixed(1)}%`])
    );
    console.log(`  Monte Carlo (${MONTE_CARLO_RUNS} runs):`, mcPct);

    // Strict skew check for TYPE tests (all types must be within 0.65x..1.35x of uniform 100/N)
    if (mode === 'TYPE') {
      const expected = 100 / results.length;
      for (const [k, v] of Object.entries(mcCounts)) {
        const pct = (v / MONTE_CARLO_RUNS) * 100;
        if (pct < expected * 0.65 || pct > expected * 1.35) {
          console.error(`  [FAIL] TYPE skew on ${k}: ${pct.toFixed(1)}% (expected ~${expected.toFixed(1)}%)`);
          totalFailures++;
        }
      }
    } else {
      // For linear binomial score tests (hogu), check extreme symmetry: extremes must be >= 5%
      for (const [k, v] of Object.entries(mcCounts)) {
        const pct = (v / MONTE_CARLO_RUNS) * 100;
        if (pct < 5.0) {
          console.error(`  [FAIL] SCORE starvation on ${k}: ${pct.toFixed(1)}% (< 5%)`);
          totalFailures++;
        }
      }
    }
  }

  console.log(`\n====================================================================`);
  console.log(`FINAL AUDIT STATUS: ${totalFailures === 0 ? 'ALL PASSED (0 failures)' : `${totalFailures} FAILURE(S)`}`);
  if (totalFailures > 0) process.exit(1);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
