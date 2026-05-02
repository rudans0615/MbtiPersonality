import { getBlogPosts, getBlogPostById } from '@/lib/queries';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import SEO from '@/components/SEO';
import { AdSenseBlock } from '@/components/AdSenseBlock';
import Link from 'next/link';
import { ArrowLeft, Calendar, Clock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export const revalidate = 3600; // 1시간 단위 자동 갱신 (ISR)

// 한국어 날짜 문자열을 ISO 8601로 변환 (예: "2026년 5월 1일" → "2026-05-01")
function parseDateToISO(dateStr: string | null | undefined): string {
  if (!dateStr) return new Date().toISOString().split('T')[0];
  const match = dateStr.match(/(\d{4})년\s*(\d{1,2})월\s*(\d{1,2})일/);
  if (!match) return new Date().toISOString().split('T')[0];
  const [, y, m, d] = match;
  return `${y}-${m.padStart(2, '0')}-${d.padStart(2, '0')}`;
}

// 빌드 타임에 모든 블로그 글의 라우팅 경로를 미리 생성합니다 (SSG)
export async function generateStaticParams() {
  try {
    const posts = await getBlogPosts();
    if (posts.length > 0) {
      return posts.map((post) => ({ id: post.id.toString() }));
    }
  } catch (error) {
    console.warn("generateStaticParams: DB에서 블로그 포스트를 가져오는데 실패했습니다.", error);
  }
  return [];
}

// 동적 메타데이터 생성 (SEO)
export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  let post = await getBlogPostById(Number(id)).catch(() => null);
  
  if (!post) return { title: '게시글을 찾을 수 없습니다 | MBTI Finder' };
  
  return {
    title: `${post.title} | MBTI Finder 성격분석 블로그`,
    description: post.excerpt,
    alternates: {
      canonical: `/blog/${id}`,
    },
    openGraph: {
      title: `${post.title} | MBTI Finder`,
      description: post.excerpt,
      type: 'article',
      url: `https://mbtifinder.com/blog/${id}`,
      authors: ['MBTI Finder'],
      tags: post.tags || [],
    }
  };
}

export default async function BlogPostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  let post = await getBlogPostById(Number(id)).catch(() => null);
  let allPosts = await getBlogPosts().catch(() => []);

  if (!post) {
    return (
      <div className="min-h-screen bg-neutral-50 flex flex-col font-sans">
        <Navigation />
        <main className="flex-grow flex flex-col items-center justify-center p-4">
          <h1 className="text-2xl font-bold text-neutral-800 mb-4">게시글을 찾을 수 없습니다</h1>
          <Link href="/blog" className="text-pink-500 hover:underline">
            블로그 목록으로 돌아가기
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  // JSON-LD Article 구조화 데이터
  const jsonLdArticle = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.excerpt,
    author: {
      '@type': 'Organization',
      name: 'MBTI Finder',
      url: 'https://mbtifinder.com',
    },
    publisher: {
      '@type': 'Organization',
      name: 'MBTI Finder',
      url: 'https://mbtifinder.com',
    },
    datePublished: parseDateToISO(post.date),
    dateModified: parseDateToISO(post.date),
    mainEntityOfPage: `https://mbtifinder.com/blog/${id}`,
    keywords: (post.tags || []).join(', '),
    articleSection: post.category,
    inLanguage: 'ko',
  };

  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col font-sans">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdArticle) }}
      />
      <SEO 
        title={`${post.title} | MBTI Finder 성격분석 블로그`} 
        description={post.excerpt || ""} 
        url={`https://mbtifinder.com/blog/${id}`} 
      />
      <Navigation />
      
      <main className="flex-grow pt-24 pb-16">
        {/* Back Button */}
        <div className="max-w-3xl mx-auto px-6 mb-8">
          <Link href="/blog" className="inline-flex items-center text-sm font-medium text-neutral-500 hover:text-pink-500 transition-colors">
            <ArrowLeft size={16} className="mr-1" /> 목록으로 돌아가기
          </Link>
        </div>

        {/* Article Header */}
        <header className="max-w-3xl mx-auto px-6 mb-12 text-center">
          <div className="mb-4">
            <Badge variant="outline" className="text-pink-500 border-pink-200 bg-pink-50 text-sm px-3 py-1">
              {post.category || '기타'}
            </Badge>
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-neutral-900 mb-6 leading-tight break-keep">
            {post.title}
          </h1>
          <div className="flex items-center justify-center space-x-4 text-sm text-neutral-500">
            <div className="flex items-center">
              <Calendar size={16} className="mr-1.5" />
              {post.date || '날짜 미상'}
            </div>
            <div className="flex items-center">
              <Clock size={16} className="mr-1.5" />
              {post.read_time || (post as any).readTime || '3분'} 소요
            </div>
          </div>
        </header>

        {/* AdSense Top */}
        <div className="max-w-3xl mx-auto px-6 mb-10">
           <AdSenseBlock adSlot="1234567890" />
        </div>

        {/* Article Content */}
        {/* Tailwind Typography 플러그인(prose)을 사용하여 HTML 내용을 아름답게 렌더링합니다 */}
        <article className="max-w-3xl mx-auto px-6 prose prose-lg prose-neutral prose-headings:font-bold prose-headings:text-neutral-800 prose-a:text-pink-500 prose-p:leading-relaxed prose-li:marker:text-pink-400 marker:text-pink-400">
          <div dangerouslySetInnerHTML={{ __html: post.content }} />
        </article>

        {/* Tags */}
        <div className="max-w-3xl mx-auto px-6 mt-12 mb-8">
          <div className="flex flex-wrap gap-2">
            {(post.tags || []).map((tag: string) => (
              <Badge key={tag} variant="secondary" className="bg-neutral-100 text-neutral-600 hover:bg-neutral-200">
                #{tag}
              </Badge>
            ))}
          </div>
        </div>

        {/* Related Posts */}
        <div className="max-w-3xl mx-auto px-6 mt-12 mb-8 pt-8 border-t border-neutral-200">
          <h3 className="text-xl font-bold text-neutral-900 mb-6">📝 함께 읽으면 좋은 관련 글</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {allPosts
              .filter((p: any) => p.category === post.category && p.id !== post.id)
              .sort(() => 0.5 - Math.random()) // 간단한 랜덤 셔플
              .slice(0, 3)
              .map((relatedPost: any) => (
                <Link key={relatedPost.id} href={`/blog/${relatedPost.id}`} className="group block">
                  <div className="p-4 rounded-xl border border-neutral-200 hover:border-pink-300 hover:shadow-md transition-all h-full bg-white flex flex-col">
                    <h4 className="font-bold text-neutral-800 group-hover:text-pink-600 line-clamp-2 mb-2 leading-tight">
                      {relatedPost.title}
                    </h4>
                    <p className="text-sm text-neutral-500 line-clamp-2 mt-auto">
                      {relatedPost.excerpt}
                    </p>
                  </div>
                </Link>
              ))}
          </div>
        </div>

        {/* AdSense Bottom */}
        <div className="max-w-3xl mx-auto px-6 mt-8">
           <AdSenseBlock adSlot="0987654321" />
        </div>
      </main>

      <Footer />
    </div>
  );
}
