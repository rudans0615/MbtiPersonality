import type { Metadata } from 'next';
import { getBlogPosts } from '@/lib/queries';
import BlogClient from './BlogClient';

export const revalidate = 3600;

export const metadata: Metadata = {
  title: '성격분석 심리 칼럼',
  description: 'MBTI, 애착유형, 연애 심리, 직장 내 소통 등 자기이해와 인간관계에 도움이 되는 깊이 있는 심리 칼럼을 만나보세요.',
  alternates: {
    canonical: '/blog',
  },
};

export default async function BlogPage({
  searchParams,
}: {
  searchParams?: Promise<{ page?: string; category?: string; q?: string }>;
}) {
  const params = searchParams ? await searchParams : {};
  const posts = await getBlogPosts().catch((err) => {
    console.error('Failed to fetch blog posts from DB', err);
    return [];
  });

  const initialPage = Math.max(1, Number.parseInt(params.page || '1', 10) || 1);
  const initialCategory = params.category || 'all';
  const initialQuery = params.q || '';

  return (
    <BlogClient
      initialPosts={posts}
      initialPage={initialPage}
      initialCategory={initialCategory}
      initialQuery={initialQuery}
    />
  );
}
