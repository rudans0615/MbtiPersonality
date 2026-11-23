import { createClient } from '@supabase/supabase-js';
import { normalizeTestData } from './validateTestData.js';

function getServiceSupabase(client) {
  if (client) return client;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    throw new Error('Server-side Supabase credentials (SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY) are required.');
  }
  return createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
}

async function cleanupTestRows(supabase, testId) {
  const { data: qs } = await supabase.from('questions').select('id').eq('test_id', testId);
  const qIds = (qs || []).map((q) => q.id);
  if (qIds.length > 0) {
    await supabase.from('options').delete().in('question_id', qIds);
  }
  await supabase.from('questions').delete().eq('test_id', testId);
  await supabase.from('result_types').delete().eq('test_id', testId);
  await supabase.from('tests').delete().eq('id', testId);
}

/**
 * Validate and save a test safely into Supabase.
 * - Never writes score=0 for TYPE tests (explicit score: null).
 * - Never overwrites an existing test unless allowOverwrite=true.
 * - Assigns display_order = MAX(display_order) + 1 so new tests never hijack flagship hero positions.
 * - Always writes while is_available=false, verifies row integrity, and rolls back on any error.
 */
export async function injectCode(
  aiData,
  { client, publish = false, allowOverwrite = false, strictQuality = true } = {}
) {
  const { payload, auditReport } = normalizeTestData(aiData, { publish, strictQuality });
  const supabase = getServiceSupabase(client);
  const testId = payload.test.id;

  // 1. Prevent accidental overwrite of existing tests
  const { data: existing, error: exErr } = await supabase
    .from('tests')
    .select('id, is_available, display_order')
    .eq('id', testId)
    .maybeSingle();
  if (exErr) throw new Error(`Failed checking existing test: ${exErr.message}`);
  if (existing && !allowOverwrite) {
    throw new Error(`Test ID "${testId}" already exists (live=${existing.is_available}). Refusing overwrite.`);
  }

  // 2. Compute safe display_order (after all existing tests so flagship MBTI/HOT hero stays intact)
  let displayOrder = existing?.display_order;
  if (displayOrder == null) {
    const { data: maxRows, error: maxErr } = await supabase
      .from('tests')
      .select('display_order')
      .order('display_order', { ascending: false })
      .limit(1);
    if (maxErr) throw new Error(`Failed querying display_order: ${maxErr.message}`);
    const currentMax = maxRows?.[0]?.display_order ?? 24;
    displayOrder = Math.max(currentMax + 1, 25);
  }

  const createdFresh = !existing;

  try {
    // 3. Stage test row as DRAFT (is_available=false) first
    const { error: tErr } = await supabase.from('tests').upsert({
      ...payload.test,
      display_order: displayOrder,
      is_available: false,
    });
    if (tErr) throw new Error(`Failed saving tests row: ${tErr.message}`);

    // If overwriting an existing draft, clear stale child rows cleanly first
    if (existing) {
      const { data: oldQs } = await supabase.from('questions').select('id').eq('test_id', testId);
      const oldQIds = (oldQs || []).map((q) => q.id);
      if (oldQIds.length > 0) {
        await supabase.from('options').delete().in('question_id', oldQIds);
      }
      await supabase.from('questions').delete().eq('test_id', testId);
      await supabase.from('result_types').delete().eq('test_id', testId);
    }

    // 4. Insert questions + options (explicit null score for TYPE mode!)
    for (const q of payload.questions) {
      const { data: qRow, error: qErr } = await supabase
        .from('questions')
        .insert({
          test_id: testId,
          question_number: q.question_number,
          text: q.text,
        })
        .select('id')
        .single();
      if (qErr || !qRow) throw new Error(`Failed saving Q${q.question_number}: ${qErr?.message}`);

      const optRows = q.options.map((o) => ({
        question_id: qRow.id,
        option_index: o.option_index,
        text: o.text,
        type_code: payload.mode === 'types' ? o.type_code : null,
        score: payload.mode === 'score' ? o.score : null,
      }));
      const { error: oErr } = await supabase.from('options').insert(optRows);
      if (oErr) throw new Error(`Failed saving options for Q${q.question_number}: ${oErr.message}`);
    }

    // 5. Insert result types
    const resultRows = payload.results.map((r) => ({
      test_id: testId,
      code: r.code,
      title: r.title,
      subtitle: r.subtitle,
      description: r.description,
      characteristics: r.characteristics,
      celebrities: r.celebrities,
      coupang_keyword: r.coupang_keyword,
      compatibility_best: r.compatibility_best,
      compatibility_good: r.compatibility_good,
      compatibility_avoid: r.compatibility_avoid,
      emoji: r.emoji,
      color: r.color,
      min_score: payload.mode === 'score' ? r.min_score : null,
      max_score: payload.mode === 'score' ? r.max_score : null,
    }));
    const { error: rErr } = await supabase.from('result_types').insert(resultRows);
    if (rErr) throw new Error(`Failed saving result_types: ${rErr.message}`);

    // 6. Post-write integrity verification
    const [{ data: savedQs }, { data: savedRs }] = await Promise.all([
      supabase.from('questions').select('id, options(id, type_code, score)').eq('test_id', testId),
      supabase.from('result_types').select('id, code, min_score, max_score').eq('test_id', testId),
    ]);
    const savedOpts = (savedQs || []).flatMap((q) => q.options || []);
    const expectedOpts = payload.questions.reduce((s, q) => s + q.options.length, 0);

    if ((savedQs || []).length !== payload.questions.length || savedOpts.length !== expectedOpts || (savedRs || []).length !== payload.results.length) {
      throw new Error(`Post-save count mismatch (Q:${savedQs?.length}, O:${savedOpts.length}, R:${savedRs?.length})`);
    }
    if (payload.mode === 'types' && savedOpts.some((o) => o.score !== null || !o.type_code)) {
      throw new Error('Post-save verification failed: TYPE test option has non-null score or missing type_code');
    }

    // 7. Flip to live ONLY if publish=true
    if (publish) {
      const { error: pubErr } = await supabase
        .from('tests')
        .update({ is_available: true })
        .eq('id', testId);
      if (pubErr) throw new Error(`Failed flipping is_available=true: ${pubErr.message}`);
    }

    console.log(
      `Verified ${publish ? 'PUBLISHED' : 'DRAFT'} test "${testId}" (Q:${payload.questions.length}, R:${payload.results.length}, order:${displayOrder})`
    );
    return { testId, displayOrder, isAvailable: Boolean(publish), payload, auditReport };
  } catch (err) {
    if (createdFresh) {
      console.error(`Rolling back failed fresh test "${testId}":`, err.message);
      await cleanupTestRows(supabase, testId).catch(() => {});
    }
    throw err;
  }
}

export async function saveTestDraft(aiData, opts = {}) {
  return injectCode(aiData, { ...opts, publish: false });
}

export async function publishTestDraft(testId, { client } = {}) {
  const supabase = getServiceSupabase(client);
  const { data: testRow, error: tErr } = await supabase
    .from('tests')
    .select('id, title, subtitle, category, is_available')
    .eq('id', testId)
    .single();
  if (tErr || !testRow) throw new Error(`초안 테스트 "${testId}"를 DB에서 찾을 수 없습니다.`);

  // Re-verify integrity before flipping live
  const [{ data: qs }, { data: rs }] = await Promise.all([
    supabase.from('questions').select('id, options(type_code, score)').eq('test_id', testId),
    supabase.from('result_types').select('code, description').eq('test_id', testId),
  ]);
  const opts = (qs || []).flatMap((q) => q.options || []);
  if (!qs?.length || !opts.length || !rs?.length) {
    throw new Error(`초안 "${testId}"의 문항/결과 데이터가 비어 있어 발행할 수 없습니다.`);
  }
  const hasType = opts.some((o) => o.type_code);
  const hasScore = opts.some((o) => o.score !== null);
  if (hasType && hasScore) {
    throw new Error(`초안 "${testId}"에 type_code와 score가 혼재되어 있어 발행이 차단되었습니다.`);
  }

  const { error: uErr } = await supabase
    .from('tests')
    .update({ is_available: true })
    .eq('id', testId);
  if (uErr) throw new Error(`라이브 발행 전환 실패: ${uErr.message}`);

  return { testId: testRow.id, title: testRow.title, subtitle: testRow.subtitle, category: testRow.category };
}

export async function deleteTestDraft(testId, { client } = {}) {
  const supabase = getServiceSupabase(client);
  const { data: testRow, error: tErr } = await supabase
    .from('tests')
    .select('id, is_available')
    .eq('id', testId)
    .maybeSingle();
  if (tErr) throw new Error(`초안 조회 실패: ${tErr.message}`);
  if (!testRow) return { deleted: false, reason: 'already_missing' };
  if (testRow.is_available) {
    throw new Error(`"${testId}"는 이미 라이브 공개 상태이므로 초안 삭제할 수 없습니다.`);
  }
  await cleanupTestRows(supabase, testId);
  return { deleted: true, testId };
}

export async function listExistingTests({ client } = {}) {
  const supabase = getServiceSupabase(client);
  const { data, error } = await supabase
    .from('tests')
    .select('id, title, category, is_available')
    .order('display_order', { ascending: true });
  if (error) throw new Error(`기존 테스트 목록 조회 실패: ${error.message}`);
  return data || [];
}
