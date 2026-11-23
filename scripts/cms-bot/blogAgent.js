import { createClient } from '@supabase/supabase-js';
import { sanitizeBlogHtml, isDuplicateAgainstExisting } from './bridgeBlogTopics.js';

function getKstDateString() {
  const kst = new Date(Date.now() + 9 * 60 * 60 * 1000);
  return `${kst.getUTCFullYear()}년 ${kst.getUTCMonth() + 1}월 ${kst.getUTCDate()}일`;
}

export async function injectBlogPost(aiData, { client } = {}) {
  const title = (aiData?.title || '').trim();
  const excerpt = (aiData?.excerpt || '').trim();
  const category = (aiData?.category || '심층분석').trim();
  const tags = Array.isArray(aiData?.tags) ? aiData.tags.map((t) => String(t).trim()).filter(Boolean).slice(0, 6) : [];
  const content = sanitizeBlogHtml(aiData?.content || '');

  if (!title || title.length < 6) throw new Error('블로그 제목이 비어 있거나 너무 짧습니다.');
  if (!content || content.replace(/<[^>]*>/g, '').trim().length < 500) {
    throw new Error('블로그 본문이 비어 있거나 분량이 부족합니다.');
  }

  const supabase =
    client ||
    (() => {
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
      const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
      if (!supabaseUrl || !supabaseKey) {
        throw new Error('Server-side Supabase credentials (SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY) are required.');
      }
      return createClient(supabaseUrl, supabaseKey, { auth: { persistSession: false, autoRefreshToken: false } });
    })();

  // 저장 직전 중복 제목 최종 차단
  const { data: existingPosts, error: exErr } = await supabase
    .from('blog_posts')
    .select('id, title')
    .order('id', { ascending: false });
  if (exErr) throw new Error(`Failed to inspect existing blog_posts: ${exErr.message}`);

  const dup = isDuplicateAgainstExisting(title, existingPosts || []);
  if (dup.isDup) {
    throw new Error(`중복 제목 차단: 기존 글 "${dup.matchedTitle}"과 유사(${Math.round(dup.ratio * 100)}%)`);
  }

  const dateString = getKstDateString();
  const plainTextLength = content.replace(/<[^>]*>?/gm, ' ').replace(/\s+/g, ' ').trim().length;
  const readTimeMin = Math.max(3, Math.ceil(plainTextLength / 420));
  const readTimeString = `${readTimeMin}분`;

  // 동시 삽입 PK 충돌 대비 최대 3회 재시도
  for (let attempt = 1; attempt <= 3; attempt++) {
    const { data: maxIdData, error: maxIdError } = await supabase
      .from('blog_posts')
      .select('id')
      .order('id', { ascending: false })
      .limit(1);
    if (maxIdError) throw new Error(`Failed to fetch max ID: ${maxIdError.message}`);

    const newId = maxIdData && maxIdData.length > 0 ? maxIdData[0].id + 1 : 1;

    const { error } = await supabase.from('blog_posts').insert({
      id: newId,
      title,
      excerpt,
      date: dateString,
      read_time: readTimeString,
      tags,
      category,
      content,
    });

    if (!error) {
      console.log(`Successfully inserted blog post #${newId} (${dateString}, ${plainTextLength}자)`);
      return newId;
    }
    if (error.code === '23505' && attempt < 3) {
      continue;
    }
    throw new Error(`Failed to insert blog post into database: ${error.message}`);
  }
  throw new Error('Failed to insert blog post after 3 attempts.');
}
