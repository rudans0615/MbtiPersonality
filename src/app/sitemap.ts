import type { MetadataRoute } from 'next';
import { getTests, getBlogPosts } from '@/lib/queries';
import { mbtiTypes } from '@/lib/customTests/mbtiTypes';

export const revalidate = 86400;

function parseKoreanDate(dateStr?: string | null): Date {
  if (!dateStr) return new Date('2026-09-01');
  const m = dateStr.match(/(\d{4})년\s*(\d{1,2})월\s*(\d{1,2})일/);
  if (!m) return new Date('2026-09-01');
  return new Date(`${m[1]}-${m[2].padStart(2, '0')}-${m[3].padStart(2, '0')}`);
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://mbtifinder.com';

  const [activeTests, activeBlogPosts] = await Promise.all([
    getTests().catch(() => []),
    getBlogPosts().catch(() => []),
  ]);

  const availableTests = (activeTests || []).filter((t: any) => t.is_available !== false);

  const staticPages: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: 'daily', priority: 1.0 },
    { url: `${baseUrl}/test`, lastModified: new Date('2026-09-12'), changeFrequency: 'weekly', priority: 0.9 },
    { url: `${baseUrl}/type`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
    { url: `${baseUrl}/blog`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${baseUrl}/about`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    { url: `${baseUrl}/contact`, lastModified: new Date('2026-09-12'), changeFrequency: 'monthly', priority: 0.4 },
    { url: `${baseUrl}/privacy`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.3 },
    { url: `${baseUrl}/terms`, lastModified: new Date('2025-06-27'), changeFrequency: 'yearly', priority: 0.3 },
  ];

  // 16가지 MBTI 유형 백과 페이지
  const typePages: MetadataRoute.Sitemap = Object.keys(mbtiTypes).map((code) => ({
    url: `${baseUrl}/type/${code}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }));

  // 활성 테스트 페이지 (중복 /test 제외)
  const seenUrls = new Set(staticPages.map((p) => p.url));
  const testPages: MetadataRoute.Sitemap = availableTests
    .filter((test) => test.href && !seenUrls.has(`${baseUrl}${test.href}`))
    .map((test) => ({
      url: `${baseUrl}${test.href}`,
      lastModified: new Date('2026-09-12'),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }));

  // 정예 심리 칼럼 페이지
  const blogPages: MetadataRoute.Sitemap = (activeBlogPosts || []).map((post) => ({
    url: `${baseUrl}/blog/${post.id}`,
    lastModified: parseKoreanDate(post.date),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  return [...staticPages, ...typePages, ...testPages, ...blogPages];
}
