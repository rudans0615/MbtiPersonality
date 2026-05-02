import { getBlogPosts } from '@/lib/queries';

import BlogClient from './BlogClient';

export const revalidate = 3600; // 1시간 단위 자동 갱신 (ISR)

export const metadata = {
  title: '성격분석 블로그 | MBTI Finder',
  description: 'MBTI, 테토에겐, 연애 심리 등 성격유형에 대한 깊이 있는 인사이트와 분석 글을 만나보세요.',
  alternates: {
    canonical: '/blog',
  },
};

export default async function BlogPage() {
  const posts = await getBlogPosts().catch((err) => {
    console.error("Failed to fetch blog posts from DB", err);
    return [];
  });

  return <BlogClient initialPosts={posts} />;
}
