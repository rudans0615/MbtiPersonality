import { createClient } from '@supabase/supabase-js';

export async function injectBlogPost(aiData) {
  const { title, excerpt, content, tags, category } = aiData;
  
  // Use environment variables for Supabase
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
  // Fallback to anon key if service role is not available, though service role is recommended for writes
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  
  if (!supabaseUrl || !supabaseKey) {
    throw new Error('Supabase credentials are not set in the environment variables.');
  }

  const supabase = createClient(supabaseUrl, supabaseKey);

  const today = new Date();
  const dateString = `${today.getFullYear()}년 ${today.getMonth() + 1}월 ${today.getDate()}일`;
  
  // 한국어 평균 읽기 속도(약 1분당 400자)로 예상 소요 시간 계산
  const plainTextLength = content.replace(/<[^>]*>?/gm, '').length; 
  const readTimeMin = Math.max(3, Math.ceil(plainTextLength / 400));
  const readTimeString = `${readTimeMin}분`;

  // Get max ID to manually increment
  const { data: maxIdData, error: maxIdError } = await supabase
    .from('blog_posts')
    .select('id')
    .order('id', { ascending: false })
    .limit(1);

  if (maxIdError) throw new Error(`Failed to fetch max ID: ${maxIdError.message}`);
  
  const newId = (maxIdData && maxIdData.length > 0) ? maxIdData[0].id + 1 : 1;

  const { error } = await supabase
    .from('blog_posts')
    .insert({
      id: newId,
      title,
      excerpt: excerpt || '',
      date: dateString,
      read_time: readTimeString,
      tags: tags || [],
      category: category || '심층분석',
      content
    });

  if (error) {
    throw new Error(`Failed to insert blog post into database: ${error.message}`);
  }

  console.log(`Successfully inserted blog post with ID: ${newId} into database.`);
  return newId;
}
