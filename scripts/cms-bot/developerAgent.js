import { createClient } from '@supabase/supabase-js';

export async function injectCode(aiData) {
  const { testId, title, subtitle, description, emoji, questions, results, category, seoArticle } = aiData;
  const qLen = questions?.length || 12;

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    throw new Error('Supabase credentials are not set in the environment variables.');
  }

  const supabase = createClient(supabaseUrl, supabaseKey);

  // 1. Insert into `tests`
  const testRecord = {
    id: testId,
    category: category || 'HOT',
    title,
    subtitle: subtitle || '',
    description: description || '당신의 심리와 성향을 정확하게 분석해주는 흥미로운 테스트입니다.',
    emoji: emoji || '✨',
    color: 'from-purple-500 to-pink-500',
    duration: '약 3분',
    question_count: qLen,
    href: `/${testId}`,
    features: ["AI 맞춤 분석", "나만의 결과지", "궁합 확인"],
    is_available: true,
  };

  const { error: testError } = await supabase.from('tests').upsert(testRecord);
  if (testError) throw new Error(`Failed to insert test: ${testError.message}`);

  // 2. Insert questions and options
  for (let i = 0; i < questions.length; i++) {
    const q = questions[i];
    const { data: qData, error: qError } = await supabase.from('questions').upsert({
      test_id: testId,
      question_number: i + 1,
      text: q.question
    }, { onConflict: 'test_id, question_number' }).select();

    if (qError) throw new Error(`Failed to insert question ${i+1}: ${qError.message}`);
    const questionId = qData[0].id;

    const optionsToInsert = q.options.map((opt, optIdx) => ({
      question_id: questionId,
      option_index: optIdx,
      text: opt.text,
      type_code: opt.type || opt.type_code || null,
      score: opt.score || 0
    }));

    const { error: oError } = await supabase.from('options').upsert(optionsToInsert, { onConflict: 'question_id, option_index' });
    if (oError) throw new Error(`Failed to insert options for question ${i+1}: ${oError.message}`);
  }

  // 3. Insert result types
  const resultKeys = Object.keys(results);
  for (const key of resultKeys) {
    const r = results[key];
    const { error: rError } = await supabase.from('result_types').upsert({
      test_id: testId,
      code: key,
      title: r.title || key,
      subtitle: r.subtitle || '',
      description: r.description || '',
      characteristics: r.characteristics || [],
      celebrities: r.celebrities || [],
      coupang_keyword: r.coupangKeyword || '',
      compatibility_best: r.compatibility?.best || null,
      compatibility_good: r.compatibility?.good || [],
      compatibility_avoid: r.compatibility?.avoid || null,
      emoji: r.emoji || '',
      color: r.color || ''
    }, { onConflict: 'test_id, code' });
    
    if (rError) throw new Error(`Failed to insert result type ${key}: ${rError.message}`);
  }

  console.log(`Successfully inserted test ${testId} into database.`);
}
