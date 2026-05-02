import type { MetadataRoute } from 'next';
import { getTests, getBlogPosts } from '@/lib/queries';

export const revalidate = 86400; // 하루 한 번 자동 갱신

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://mbtifinder.com';

  // DB에서 데이터 로드
  const activeTests = await getTests().catch(() => []) || [];
  const activeBlogPosts = await getBlogPosts().catch(() => []) || [];

  const availableTests = activeTests.filter((t: any) => t.is_available !== false);

  // 정적 페이지
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/test`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.4,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.2,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.2,
    },
  ];

  // 테스트 페이지
  const testPages: MetadataRoute.Sitemap = availableTests.map(test => ({
    url: `${baseUrl}${test.href}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  // 블로그 개별 포스트
  const blogPages: MetadataRoute.Sitemap = activeBlogPosts.map(post => ({
    url: `${baseUrl}/blog/${post.id}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }));

  return [...staticPages, ...testPages, ...blogPages];
}
