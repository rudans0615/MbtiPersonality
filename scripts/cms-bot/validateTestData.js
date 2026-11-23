const fail = (message) => {
  throw new Error(`Invalid test data: ${message}`);
};

const text = (value, name) => {
  if (typeof value !== 'string' || !value.trim()) fail(name);
  return value.trim();
};

const integer = (value) => Number.isSafeInteger(value) && Math.abs(value) <= 100000;

export const RESERVED_TEST_IDS = new Set([
  'mbti',
  'test',
  'results',
  'blog',
  'about',
  'contact',
  'privacy',
  'terms',
  'drunk',
  'teto-egen',
  'api',
  'type',
  'compatibility',
  'sitemap',
  'robots',
  'admin',
  'login',
]);

export const CATEGORY_GRADIENTS = {
  HOT: ['from-rose-500 via-pink-500 to-fuchsia-500', 'from-orange-400 via-rose-500 to-pink-500'],
  LOVE: ['from-pink-400 via-rose-400 to-red-400', 'from-fuchsia-400 via-pink-500 to-rose-500'],
  PERSONALITY: ['from-indigo-500 via-purple-500 to-pink-500', 'from-violet-500 via-indigo-500 to-sky-500'],
  FUN: ['from-amber-400 via-orange-400 to-pink-500', 'from-emerald-400 via-teal-500 to-cyan-500'],
  CAREER: ['from-slate-700 via-indigo-600 to-blue-600', 'from-sky-500 via-blue-600 to-indigo-600'],
};

// 애드센스 정책 위반 및 위험/민감 주제 필터
const BLOCKED_CONTENT_REGEX =
  /(스토킹|스토커|자살|자해|우울증\s*진단|정신병\s*진단|음주\s*운전|안전\s*운전\s*가능|불법\s*도박|마약|불법\s*촬영|성폭력|성범죄|19금|야동|학대)/i;

// AI 환각 외계어(말라얄람어·데바나가리어·아랍어·키릴문자·태국어 등 비정상 스크립트) 차단
const ALIEN_SCRIPT_REGEX = /[\u0400-\u04FF\u0600-\u06FF\u0900-\u0E7F]/;

export function assertSafeTopic(topic) {
  const clean = text(topic, 'topic');
  if (BLOCKED_CONTENT_REGEX.test(clean)) {
    fail(`애드센스·안전 정책 위반 키워드 포함: "${clean}"`);
  }
  if (ALIEN_SCRIPT_REGEX.test(clean)) {
    fail(`비정상 문자 스크립트 감지: "${clean}"`);
  }
  return clean;
}

function assertCleanText(str, fieldName) {
  if (BLOCKED_CONTENT_REGEX.test(str)) {
    fail(`${fieldName}에 금지/위험 표현이 포함되었습니다.`);
  }
  if (ALIEN_SCRIPT_REGEX.test(str)) {
    fail(`${fieldName}에 AI 환각 외계어 문자가 감지되었습니다.`);
  }
}

/** Deterministic FNV-1a + Murmur3 fmix32 — mirrors src/lib/customTests/resolveGenericResult.ts */
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

function resolveTypeWinner(answers, resultCodes) {
  const counts = Object.create(null);
  for (const code of answers) {
    counts[code] = (counts[code] || 0) + 1;
  }
  const maxCount = Math.max(...Object.values(counts));
  const tied = Object.entries(counts)
    .filter(([, c]) => c === maxCount)
    .map(([k]) => k)
    .sort();
  if (tied.length === 1) return tied[0];
  const winner = tied[hashString(answers.join(',')) % tied.length];
  return resultCodes.includes(winner) ? winner : resultCodes[0];
}

function pickCategoryGradient(category, id) {
  const pool = CATEGORY_GRADIENTS[category] || CATEGORY_GRADIENTS.PERSONALITY;
  return pool[hashString(id) % pool.length];
}

/**
 * Full psychometric, structural, and AdSense-policy validation gate.
 * Returns normalized DB payload plus an auditReport for Telegram preview.
 */
export function normalizeTestData(
  data,
  { publish = false, autoRotateOptions = true, strictQuality = true, monteCarloRuns = 4000 } = {}
) {
  const id = text(data.testId, 'testId');
  if (!/^[a-zA-Z][a-zA-Z0-9-]{2,60}$/.test(id) || RESERVED_TEST_IDS.has(id.toLowerCase())) {
    fail(`reserved/invalid testId (${id})`);
  }

  const mode = data.scoringMode;
  if (!['types', 'score'].includes(mode)) fail('explicit scoringMode required ("types" or "score")');

  const category = ['HOT', 'LOVE', 'PERSONALITY', 'FUN', 'CAREER'].includes(data.category)
    ? data.category
    : 'PERSONALITY';

  const title = text(data.title, 'title');
  const subtitle = typeof data.subtitle === 'string' ? data.subtitle.trim() : '';
  const description = text(data.description, 'description');
  assertCleanText(title, 'title');
  assertCleanText(subtitle, 'subtitle');
  assertCleanText(description, 'description');
  if (strictQuality && description.length < 40) {
    fail(`description too short (${description.length} chars, min 40)`);
  }

  if (!Array.isArray(data.questions) || data.questions.length < 6 || data.questions.length > 20) {
    fail('6–20 questions required');
  }
  if (!data.results || Array.isArray(data.results)) fail('result object required');

  const codes = Object.keys(data.results);
  if (
    codes.length < 2 ||
    codes.length > 8 ||
    codes.some((c) => !/^[\p{L}\p{N}_-]+$/u.test(c) || ['constructor', 'prototype', '__proto__'].includes(c))
  ) {
    fail('2–8 unique safe result codes required');
  }

  const results = codes.map((code) => {
    const r = data.results[code];
    if (mode === 'score' && (!integer(r.min_score) || !integer(r.max_score) || r.min_score > r.max_score)) {
      fail('score range: ' + code);
    }
    if (mode === 'types' && (r.min_score != null || r.max_score != null)) {
      fail('type result has score range');
    }
    if (!Array.isArray(r.characteristics) || r.characteristics.length < 3 || r.characteristics.some((x) => typeof x !== 'string' || !x.trim())) {
      fail('characteristics (min 3): ' + code);
    }

    const rTitle = text(r.title, `result title (${code})`);
    const rSub = typeof r.subtitle === 'string' ? r.subtitle.trim() : '';
    const rDesc = text(r.description, `result description (${code})`);
    assertCleanText(rTitle, `result.title (${code})`);
    assertCleanText(rSub, `result.subtitle (${code})`);
    assertCleanText(rDesc, `result.description (${code})`);
    r.characteristics.forEach((c, idx) => assertCleanText(c, `result.characteristics[${idx}] (${code})`));

    if (strictQuality && rDesc.length < 160) {
      fail(`result description too short for ${code} (${rDesc.length} chars, min 160)`);
    }

    return {
      code,
      title: rTitle,
      subtitle: rSub,
      description: rDesc,
      characteristics: r.characteristics.map((c) => c.trim()),
      celebrities: Array.isArray(r.celebrities) ? r.celebrities : [],
      coupang_keyword: (r.coupangKeyword || r.coupang_keyword || '').trim(),
      compatibility_best: r.compatibility?.best || null,
      compatibility_good: Array.isArray(r.compatibility?.good) ? r.compatibility.good : [],
      compatibility_avoid: r.compatibility?.avoid || null,
      emoji: (r.emoji || '✨').trim(),
      color: (r.color || '').trim(),
      min_score: mode === 'score' ? r.min_score : null,
      max_score: mode === 'score' ? r.max_score : null,
    };
  });

  const questions = data.questions.map((q, i) => {
    const qText = text(q.question || q.text, `question #${i + 1}`);
    assertCleanText(qText, `question #${i + 1}`);
    if (!Array.isArray(q.options) || q.options.length < 2 || q.options.length > 6) {
      fail(`2–6 options required on Q${i + 1}`);
    }

    let mappedOptions = q.options.map((o) => {
      const optText = text(o.text, `option text on Q${i + 1}`);
      assertCleanText(optText, `option text on Q${i + 1}`);
      const type = o.type ?? o.type_code ?? null;
      if (mode === 'types' && (!codes.includes(type) || o.score != null)) {
        fail(`invalid type option mapping/score on Q${i + 1} (${type})`);
      }
      if (mode === 'score' && (type != null || !integer(o.score))) {
        fail(`invalid score option value/type on Q${i + 1}`);
      }
      return {
        text: optText,
        type_code: mode === 'types' ? type : null,
        score: mode === 'score' ? o.score : null,
      };
    });

    if (new Set(mappedOptions.map((o) => o.text)).size !== mappedOptions.length) {
      fail(`duplicate option text on Q${i + 1}`);
    }

    // Rotate option positions per question to eliminate A/B/C/D positional bias
    if (autoRotateOptions && mode === 'types' && mappedOptions.length >= 3) {
      const shift = (i * 3 + 1) % mappedOptions.length;
      mappedOptions = mappedOptions.map((_, idx) => mappedOptions[(idx + shift) % mappedOptions.length]);
    }

    return {
      question_number: i + 1,
      text: qText,
      options: mappedOptions.map((o, j) => ({ option_index: j, ...o })),
    };
  });

  const auditReport = {
    mode,
    questionCount: questions.length,
    resultCount: results.length,
    typeFrequency: {},
    personaReachable: 0,
    monteCarloPct: {},
  };

  if (mode === 'types') {
    const freq = Object.fromEntries(codes.map((c) => [c, 0]));
    let totalOpts = 0;
    for (const q of questions) {
      for (const o of q.options) {
        freq[o.type_code] = (freq[o.type_code] || 0) + 1;
        totalOpts++;
      }
    }
    auditReport.typeFrequency = freq;

    // 1. Frequency balance check
    const idealFreq = totalOpts / codes.length;
    const minAllowed = Math.max(1, Math.floor(idealFreq) - 1);
    const maxAllowed = Math.ceil(idealFreq) + 1;
    for (const [code, count] of Object.entries(freq)) {
      if (count < minAllowed || count > maxAllowed) {
        fail(`unbalanced option frequency for ${code}: ${count} (allowed ${minAllowed}..${maxAllowed})`);
      }
    }

    // 2. Persona reachability check (choosing target code whenever available, cycling others)
    let personaPass = 0;
    for (const code of codes) {
      let fallbackIdx = 0;
      const answers = questions.map((q) => {
        const match = q.options.find((o) => o.type_code === code);
        if (match) return match.type_code;
        const pick = q.options[fallbackIdx % q.options.length];
        fallbackIdx++;
        return pick.type_code;
      });
      const win = resolveTypeWinner(answers, codes);
      if (win === code) personaPass++;
      else fail(`persona unreachable for ${code} (resolved to ${win})`);
    }
    auditReport.personaReachable = personaPass;

    // 3. Deterministic-seeded Monte Carlo simulation (4,000 runs)
    const mcCounts = Object.fromEntries(codes.map((c) => [c, 0]));
    let seed = hashString(id + ':' + questions.length);
    const nextRand = () => {
      seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
      return seed / 4294967296;
    };
    for (let run = 0; run < monteCarloRuns; run++) {
      const answers = questions.map((q) => q.options[Math.floor(nextRand() * q.options.length)].type_code);
      const win = resolveTypeWinner(answers, codes);
      mcCounts[win] = (mcCounts[win] || 0) + 1;
    }

    const expectedPct = 100 / codes.length;
    for (const code of codes) {
      const pct = (mcCounts[code] / monteCarloRuns) * 100;
      auditReport.monteCarloPct[code] = `${pct.toFixed(1)}%`;
      if (strictQuality && (pct < expectedPct * 0.6 || pct > expectedPct * 1.4)) {
        fail(`Monte Carlo skew on ${code}: ${pct.toFixed(1)}% (expected ~${expectedPct.toFixed(1)}%)`);
      }
    }
  } else {
    // Score mode: verify full coverage (no gaps/overlaps) and reachability
    let totals = new Set([0]);
    for (const q of questions) {
      totals = new Set([...totals].flatMap((n) => q.options.map((o) => n + o.score)));
      if (totals.size > 250000) fail('reachability validation limit');
    }
    const reached = new Set();
    for (const n of totals) {
      const matches = results.filter((r) => n >= r.min_score && n <= r.max_score);
      if (matches.length !== 1) fail(`score gap/overlap at total=${n}`);
      reached.add(matches[0].code);
    }
    if (codes.some((c) => !reached.has(c))) fail('unreachable score result');
    auditReport.personaReachable = reached.size;
  }

  const chosenColor =
    typeof data.color === 'string' && data.color.trim().startsWith('from-')
      ? data.color.trim()
      : pickCategoryGradient(category, id);

  const payload = {
    mode,
    test: {
      id,
      category,
      title,
      subtitle,
      description,
      emoji: (data.emoji || '✨').trim(),
      color: chosenColor,
      duration: (data.duration || (questions.length >= 12 ? '약 3분' : '약 2분')).trim(),
      question_count: questions.length,
      href: `/${id}`,
      features: ['맞춤 성향 분석', '유형별 특징 리포트', '결과 이미지 저장'],
      is_available: Boolean(publish),
    },
    questions,
    results,
  };

  return { payload, auditReport };
}
