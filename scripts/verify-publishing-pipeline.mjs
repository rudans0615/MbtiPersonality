import assert from 'node:assert/strict';
import { createClient } from '@supabase/supabase-js';
import { assertSafeTopic, normalizeTestData } from './cms-bot/validateTestData.js';
import { saveTestDraft, deleteTestDraft, listExistingTests } from './cms-bot/developerAgent.js';

function makeValidDraft(testId = 'verifyPipelineDraftTemp') {
  const longDesc =
    '이 유형은 일상에서 자신만의 분명한 리듬과 판단 기준을 가지고 움직이며, 새로운 환경에서도 차분하게 핵심을 파악하는 강점이 있습니다. 주변 사람들과 협업할 때는 배려와 효율 사이의 균형을 잘 맞추고, 가끔 과도한 완벽주의로 피곤해질 때는 짧은 휴식으로 에너지를 회복하는 편이 잘 어울립니다.';
  const types = [
    { code: 'ALPHA_STYLE', title: '알파 전략가', emoji: '🧭', subtitle: '계획과 기준이 뚜렷한 실행형' },
    { code: 'BETA_STYLE', title: '베타 공감러', emoji: '💛', subtitle: '분위기와 사람을 챙기는 온기형' },
    { code: 'GAMMA_STYLE', title: '감마 탐험가', emoji: '🚀', subtitle: '새로운 시도에 설레는 호기심형' },
    { code: 'DELTA_STYLE', title: '델타 힐러', emoji: '🌿', subtitle: '여유와 균형을 지키는 안정형' },
  ];
  const results = {};
  for (const t of types) {
    results[t.code] = {
      title: t.title,
      emoji: t.emoji,
      subtitle: t.subtitle,
      description: `${t.title} — ${longDesc}`,
      characteristics: ['명확한 일상 리듬 유지', '상황 파악이 빠르고 정확함', '주변과 자연스러운 호흡', '꾸준한 자기 성찰 습관'],
      coupangKeyword: '무선 노이즈캔슬링 이어폰',
    };
  }
  const questions = Array.from({ length: 10 }, (_, idx) => ({
    question: `주말 오전 ${idx + 1}번째 일상 상황에서 내가 가장 먼저 선택하는 행동은?`,
    options: types.map((t, j) => ({
      text: `${t.title}답게 선택하는 ${idx + 1}-${j + 1}번 자연스러운 구어체 행동`,
      type: t.code,
    })),
  }));
  return {
    scoringMode: 'types',
    testId,
    category: 'PERSONALITY',
    title: '파이프라인 검증용 임시 테스트',
    subtitle: '자동화 품질 게이트 검증용 초안입니다',
    description: '일상 속 작은 선택 패턴을 통해 나의 집중 스타일과 휴식 리듬을 가볍게 돌아볼 수 있도록 구성된 참고용 성향 테스트입니다.',
    emoji: '🧪',
    questions,
    results,
  };
}

async function main() {
  console.log('=== 1. Unit Tests: validateTestData.js v2 ===');

  // 1a. Reserved IDs rejected
  for (const badId of ['mbti', 'type', 'compatibility', 'api', 'test']) {
    assert.throws(() => normalizeTestData(makeValidDraft(badId)), /reserved\/invalid testId/);
  }
  console.log('[PASS] Reserved routes (incl. type, compatibility) rejected');

  // 1b. AdSense / Safety blocked topics rejected
  for (const badTopic of ['스토커 대처 테스트', '음주운전 가능 체크', '우울증 진단 자가검사']) {
    assert.throws(() => assertSafeTopic(badTopic), /금지|정책 위반/);
  }
  console.log('[PASS] Blocked/sensitive topics rejected');

  // 1c. AI alien script hallucination rejected
  const alienDraft = makeValidDraft();
  alienDraft.questions[0].options[0].text = '진짜 웃기네 സാം 완전 공감됨';
  assert.throws(() => normalizeTestData(alienDraft), /외계어/);
  console.log('[PASS] AI hallucination alien script rejected');

  // 1d. score: 0 on TYPE test rejected
  const zeroScoreDraft = makeValidDraft();
  zeroScoreDraft.questions[0].options[0].score = 0;
  assert.throws(() => normalizeTestData(zeroScoreDraft), /invalid type option/);
  console.log('[PASS] score=0 contamination on TYPE test rejected');

  // 1e. Frequency skew rejected
  const skewedDraft = makeValidDraft();
  for (let i = 0; i < 8; i++) {
    skewedDraft.questions[i].options[3].type = 'ALPHA_STYLE';
  }
  assert.throws(() => normalizeTestData(skewedDraft), /unbalanced option frequency/);
  console.log('[PASS] Unbalanced option frequency rejected');

  // 1f. Short result description rejected
  const thinDraft = makeValidDraft();
  thinDraft.results.ALPHA_STYLE.description = '너무 짧은 설명입니다.';
  assert.throws(() => normalizeTestData(thinDraft), /result description too short/);
  console.log('[PASS] Thin result description (<160 chars) rejected');

  // 1g. Valid draft passes + rotates option_index + balanced Monte Carlo
  const valid = makeValidDraft();
  const { payload, auditReport } = normalizeTestData(valid, { publish: false });
  assert.equal(payload.test.is_available, false);
  assert.equal(auditReport.personaReachable, 4);
  assert.ok(payload.questions[0].options[0].type_code !== payload.questions[1].options[0].type_code, 'options must rotate across questions');
  assert.ok(payload.questions.every((q) => q.options.every((o) => o.score === null)), 'all TYPE option scores must be null');
  console.log('[PASS] Valid draft normalized, rotated, and balanced:', auditReport.monteCarloPct);

  // 2. Live Supabase Draft Save -> Duplicate Protection -> Clean Delete Round-Trip
  console.log('\n=== 2. Live Supabase Draft Round-Trip Verification ===');
  const tempId = `verifyPipelineTemp${Date.now().toString().slice(-5)}`;
  const tempDraft = makeValidDraft(tempId);
  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

  try {
    const existing = await listExistingTests();
    assert.ok(existing.length >= 16, 'expected existing tests in DB');
    console.log(`[PASS] listExistingTests() returned ${existing.length} tests`);

    const saved = await saveTestDraft(tempDraft);
    assert.equal(saved.isAvailable, false);
    assert.ok(saved.displayOrder >= 25, `displayOrder should be >=25, got ${saved.displayOrder}`);
    console.log(`[PASS] saveTestDraft(${tempId}) saved as DRAFT (is_available=false, display_order=${saved.displayOrder})`);

    // Verify duplicate overwrite is blocked
    await assert.rejects(() => saveTestDraft(tempDraft), /already exists/);
    console.log('[PASS] Duplicate testId overwrite safely blocked');

    // Verify DB rows have explicit score=NULL
    const { data: qRows } = await supabase.from('questions').select('id, options(score, type_code)').eq('test_id', tempId);
    const allOpts = (qRows || []).flatMap((q) => q.options || []);
    assert.equal(allOpts.length, 40);
    assert.ok(allOpts.every((o) => o.score === null && Boolean(o.type_code)));
    console.log('[PASS] Live DB verified: 40/40 options have score=NULL and valid type_code');

    // Clean delete draft
    const del = await deleteTestDraft(tempId);
    assert.equal(del.deleted, true);
    const { data: checkRow } = await supabase.from('tests').select('id').eq('id', tempId).maybeSingle();
    assert.equal(checkRow, null);
    console.log('[PASS] deleteTestDraft() cleanly removed all temporary rows');
  } finally {
    await deleteTestDraft(tempId).catch(() => {});
  }

  console.log('\nALL PUBLISHING PIPELINE CHECKS PASSED (0 failures)!');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
