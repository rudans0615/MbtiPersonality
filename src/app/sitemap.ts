import type { MetadataRoute } from 'next';
import { testTypes } from '@/data/testTypes';
import { blogPosts } from '@/data/blogPosts';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://mbtifinder.com';

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

  // 테스트 페이지 (testTypes 데이터에서 자동 생성)
  const testPages: MetadataRoute.Sitemap = testTypes
    .filter(test => test.isAvailable)
    .map(test => ({
      url: `${baseUrl}${test.href}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }));

  // 블로그 개별 포스트 (blogPosts 데이터에서 자동 생성)
  const blogPages: MetadataRoute.Sitemap = blogPosts.map(post => ({
    url: `${baseUrl}/blog/${post.id}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }));

  return [...staticPages, ...testPages, ...blogPages];
}
