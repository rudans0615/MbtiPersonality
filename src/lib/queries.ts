import { supabase } from './supabase';

// ===== 테스트 관련 쿼리 =====

export interface TestMeta {
  id: string;
  category: string;
  title: string;
  subtitle: string | null;
  description: string | null;
  emoji: string | null;
  color: string | null;
  duration: string | null;
  question_count: number | null;
  href: string;
  features: string[];
  is_available: boolean;
  display_order: number;
}

export interface QuestionWithOptions {
  id: number;
  question_number: number;
  text: string;
  options: {
    id: number;
    option_index: number;
    text: string;
    type_code: string | null;
    score: number | null;
  }[];
}

export interface ResultType {
  id: number;
  test_id: string;
  code: string;
  title: string;
  subtitle: string | null;
  description: string | null;
  characteristics: string[];
  celebrities: string[];
  coupang_keyword: string | null;
  compatibility_best: string | null;
  compatibility_good: string[];
  compatibility_avoid: string | null;
  emoji: string | null;
  color: string | null;
}

export interface BlogPost {
  id: number;
  title: string;
  excerpt: string | null;
  content: string;
  date: string | null;
  read_time: string | null;
  tags: string[];
  category: string | null;
  image_url: string | null;
  created_at: string;
}

/**
 * 전체 테스트 목록 가져오기 (홈 페이지용)
 */
export async function getTests(): Promise<TestMeta[]> {
  const { data, error } = await supabase
    .from('tests')
    .select('*')
    .order('display_order', { ascending: true });

  if (error) throw error;
  return data || [];
}

/**
 * 특정 테스트 메타 정보 가져오기
 */
export async function getTestById(testId: string): Promise<TestMeta | null> {
  const { data, error } = await supabase
    .from('tests')
    .select('*')
    .eq('id', testId)
    .single();

  if (error) return null;
  return data;
}

/**
 * 특정 테스트의 질문 + 옵션 가져오기
 */
export async function getQuestionsWithOptions(testId: string): Promise<QuestionWithOptions[]> {
  const { data: questions, error } = await supabase
    .from('questions')
    .select(`
      id,
      question_number,
      text,
      options (
        id,
        option_index,
        text,
        type_code,
        score
      )
    `)
    .eq('test_id', testId)
    .order('question_number', { ascending: true });

  if (error) throw error;

  // 옵션을 option_index 순서로 정렬
  return (questions || []).map(q => ({
    ...q,
    options: (q.options || []).sort((a: any, b: any) => a.option_index - b.option_index)
  }));
}

/**
 * 특정 테스트의 결과 유형 가져오기
 */
export async function getResultTypes(testId: string): Promise<Record<string, ResultType>> {
  const { data, error } = await supabase
    .from('result_types')
    .select('*')
    .eq('test_id', testId);

  if (error) throw error;

  // code를 key로 하는 Record로 변환
  const result: Record<string, ResultType> = {};
  (data || []).forEach(item => {
    result[item.code] = item;
  });
  return result;
}

/**
 * 전체 블로그 포스트 목록 (최신순)
 */
export async function getBlogPosts(): Promise<BlogPost[]> {
  const { data, error } = await supabase
    .from('blog_posts')
    .select('*')
    .order('id', { ascending: false });

  if (error) throw error;
  return data || [];
}

/**
 * 특정 블로그 포스트 가져오기
 */
export async function getBlogPostById(id: number): Promise<BlogPost | null> {
  const { data, error } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('id', id)
    .single();

  if (error) return null;
  return data;
}

/**
 * 활성 테스트 ID 목록 (sitemap, generateStaticParams 용)
 */
export async function getActiveTestIds(): Promise<string[]> {
  const { data, error } = await supabase
    .from('tests')
    .select('id')
    .eq('is_available', true);

  if (error) throw error;
  return (data || []).map(t => t.id);
}
