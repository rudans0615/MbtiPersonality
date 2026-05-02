/**
 * Supabase 데이터 마이그레이션 스크립트
 * 기존 src/data/*.ts 하드코딩 데이터를 Supabase DB로 이관
 * 
 * 실행: node scripts/migrate-to-supabase.mjs
 */

const SUPABASE_URL = 'https://kcotkbpqznsbogskrmzx.supabase.co';
// anon key를 사용 (RLS 적용 전이므로 가능)
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!SUPABASE_KEY) {
  console.error('❌ SUPABASE_SERVICE_ROLE_KEY 또는 NEXT_PUBLIC_SUPABASE_ANON_KEY 환경변수를 설정하세요.');
  process.exit(1);
}

async function supabaseInsert(table, rows) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'apikey': SUPABASE_KEY,
      'Authorization': `Bearer ${SUPABASE_KEY}`,
      'Prefer': 'return=representation'
    },
    body: JSON.stringify(rows)
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`INSERT into ${table} failed: ${res.status} ${err}`);
  }
  return res.json();
}

async function supabaseSelect(table, query = '') {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}?${query}`, {
    headers: {
      'apikey': SUPABASE_KEY,
      'Authorization': `Bearer ${SUPABASE_KEY}`,
    }
  });
  return res.json();
}

// ===== 테스트 ID 목록 (활성 테스트만) =====
const activeTestIds = [
  'sbti', 'dopamine', 'hogu', 'drunk',
  'roommateAirQuality', 'myPetHealingStyle', 'petStressRelief',
  'travelMood2023', 'socialMediaHabitTest2024', 'shoppingMoodTest1234',
  'workLifeBalanceTest', 'seasonalMoodTest', 'travelFriendCompatibility',
  'socialMediaHabitsTest', 'friendshipCompatibility', 'socialMediaHabits',
  'petPersonalityPreference', 'tetoEgen'  // 'mbti'는 커스텀 컴포넌트이므로 나중에
];

async function migrateQuestionsAndOptions() {
  console.log('\n📝 질문 & 옵션 마이그레이션 시작...');
  
  for (const testId of activeTestIds) {
    try {
      // 동적 임포트 (ESM)
      const questionsModule = await import(`../src/data/${testId}Questions.ts`);
      
      // 질문 배열 찾기
      const questionsKey = Object.keys(questionsModule).find(k => 
        Array.isArray(questionsModule[k]) && questionsModule[k].length > 0
      );
      
      if (!questionsKey) {
        console.log(`  ⚠️ ${testId}: 질문 배열을 찾을 수 없음, 건너뜀`);
        continue;
      }
      
      const questions = questionsModule[questionsKey];
      
      // 질문 INSERT
      const questionRows = questions.map((q, idx) => ({
        test_id: testId,
        question_number: q.id || (idx + 1),
        text: q.text || q.question || q.questionText || ''
      }));
      
      const insertedQuestions = await supabaseInsert('questions', questionRows);
      
      // 옵션 INSERT
      const allOptions = [];
      for (let qIdx = 0; qIdx < questions.length; qIdx++) {
        const q = questions[qIdx];
        const insertedQ = insertedQuestions[qIdx];
        
        if (q.options) {
          q.options.forEach((opt, optIdx) => {
            allOptions.push({
              question_id: insertedQ.id,
              option_index: optIdx,
              text: typeof opt === 'string' ? opt : opt.text,
              type_code: typeof opt === 'object' ? (opt.type || null) : null,
              score: typeof opt === 'object' ? (opt.score || null) : null
            });
          });
        }
      }
      
      if (allOptions.length > 0) {
        await supabaseInsert('options', allOptions);
      }
      
      console.log(`  ✅ ${testId}: ${questions.length}개 질문, ${allOptions.length}개 옵션`);
    } catch (err) {
      console.log(`  ❌ ${testId}: ${err.message}`);
    }
  }
}

async function migrateResultTypes() {
  console.log('\n🎯 결과 유형 마이그레이션 시작...');
  
  for (const testId of activeTestIds) {
    try {
      const typesModule = await import(`../src/data/${testId}Types.ts`);
      
      // Record<string, TypeData> 형식의 객체 찾기
      const typesKey = Object.keys(typesModule).find(k => 
        typeof typesModule[k] === 'object' && 
        !Array.isArray(typesModule[k]) &&
        Object.values(typesModule[k]).length > 0 &&
        typeof Object.values(typesModule[k])[0] === 'object' &&
        Object.values(typesModule[k])[0].title
      );
      
      if (!typesKey) {
        console.log(`  ⚠️ ${testId}: 결과 유형 객체를 찾을 수 없음, 건너뜀`);
        continue;
      }
      
      const types = typesModule[typesKey];
      const rows = Object.entries(types).map(([code, data]) => ({
        test_id: testId,
        code: data.code || code,
        title: data.title,
        subtitle: data.subtitle || null,
        description: data.description || null,
        characteristics: JSON.stringify(data.characteristics || []),
        celebrities: JSON.stringify(data.celebrities || []),
        coupang_keyword: data.coupangKeyword || null,
        compatibility_best: data.compatibility?.best || null,
        compatibility_good: JSON.stringify(data.compatibility?.good || []),
        compatibility_avoid: data.compatibility?.avoid || null,
        emoji: data.emoji || null,
        color: data.color || null
      }));
      
      await supabaseInsert('result_types', rows);
      console.log(`  ✅ ${testId}: ${rows.length}개 결과 유형`);
    } catch (err) {
      console.log(`  ❌ ${testId}: ${err.message}`);
    }
  }
}

async function migrateBlogPosts() {
  console.log('\n📰 블로그 포스트 마이그레이션 시작...');
  
  try {
    const blogModule = await import('../src/data/blogPosts.ts');
    const posts = blogModule.blogPosts;
    
    const rows = posts.map(post => ({
      id: post.id,
      title: post.title,
      excerpt: post.excerpt || null,
      content: post.content,
      date: post.date || null,
      read_time: post.readTime || null,
      tags: JSON.stringify(post.tags || []),
      category: post.category || null,
      image_url: post.imageUrl || null
    }));
    
    // 10개씩 배치로 나눠서 INSERT (content가 크므로)
    for (let i = 0; i < rows.length; i += 5) {
      const batch = rows.slice(i, i + 5);
      await supabaseInsert('blog_posts', batch);
      console.log(`  ✅ 블로그 포스트 ${i + 1}~${Math.min(i + 5, rows.length)} / ${rows.length}`);
    }
  } catch (err) {
    console.log(`  ❌ 블로그: ${err.message}`);
  }
}

async function verify() {
  console.log('\n🔍 검증...');
  const tests = await supabaseSelect('tests', 'select=id&is_available=eq.true');
  const questions = await supabaseSelect('questions', 'select=id');
  const options = await supabaseSelect('options', 'select=id');
  const resultTypes = await supabaseSelect('result_types', 'select=id');
  const blogPosts = await supabaseSelect('blog_posts', 'select=id');
  
  console.log(`  tests: ${tests.length}개 (활성)`);
  console.log(`  questions: ${questions.length}개`);
  console.log(`  options: ${options.length}개`);
  console.log(`  result_types: ${resultTypes.length}개`);
  console.log(`  blog_posts: ${blogPosts.length}개`);
}

async function main() {
  console.log('🚀 Supabase 데이터 마이그레이션 시작\n');
  console.log(`  URL: ${SUPABASE_URL}`);
  console.log(`  Key: ${SUPABASE_KEY?.slice(0, 20)}...`);
  
  await migrateQuestionsAndOptions();
  await migrateResultTypes();
  await migrateBlogPosts();
  await verify();
  
  console.log('\n✅ 마이그레이션 완료!');
}

main().catch(err => {
  console.error('❌ 치명적 오류:', err);
  process.exit(1);
});
