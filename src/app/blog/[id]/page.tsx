import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getBlogPosts, getBlogPostById } from '@/lib/queries';
import Link from 'next/link';
import { ArrowLeft, Calendar, Clock, BookOpen, Sparkles } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export const revalidate = 3600;

function parseDateToISO(dateStr: string | null | undefined): string {
  if (!dateStr) return new Date().toISOString().split('T')[0];
  const match = dateStr.match(/(\d{4})년\s*(\d{1,2})월\s*(\d{1,2})일/);
  if (!match) return new Date().toISOString().split('T')[0];
  const [, y, m, d] = match;
  return `${y}-${m.padStart(2, '0')}-${d.padStart(2, '0')}`;
}

export async function generateStaticParams() {
  try {
    const posts = await getBlogPosts();
    if (posts.length > 0) {
      return posts.map((post) => ({ id: post.id.toString() }));
    }
  } catch (error) {
    console.warn('generateStaticParams: DB에서 블로그 포스트를 가져오는데 실패했습니다.', error);
  }
  return [];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const numId = Number(id);
  if (!Number.isInteger(numId) || numId <= 0) {
    return { title: '게시글을 찾을 수 없습니다', robots: { index: false, follow: false } };
  }

  const post = await getBlogPostById(numId).catch(() => null);
  if (!post) {
    return { title: '게시글을 찾을 수 없습니다', robots: { index: false, follow: false } };
  }

  const ogImage = `/api/og?${new URLSearchParams({
    mode: 'result',
    testTitle: `MBTI Finder · ${post.category || '심리 칼럼'}`,
    resultTitle: post.title,
    subtitle: (post.excerpt || '성격분석 심리 칼럼').slice(0, 48),
  }).toString()}`;

  return {
    title: post.title,
    description: post.excerpt || `${post.title} - MBTI Finder 성격분석 심리 칼럼`,
    alternates: {
      canonical: `/blog/${numId}`,
    },
    openGraph: {
      title: `${post.title} | MBTI Finder`,
      description: post.excerpt || '',
      type: 'article',
      url: `https://mbtifinder.com/blog/${numId}`,
      authors: ['MBTI Finder 편집팀'],
      tags: post.tags || [],
      images: [{ url: ogImage, width: 1200, height: 630, alt: post.title }],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${post.title} | MBTI Finder`,
      description: post.excerpt || '',
      images: [ogImage],
    },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const numId = Number(id);
  if (!Number.isInteger(numId) || numId <= 0) {
    notFound();
  }

  const [post, allPosts] = await Promise.all([
    getBlogPostById(numId).catch(() => null),
    getBlogPosts().catch(() => []),
  ]);

  if (!post) {
    notFound();
  }

  const relatedPosts = [
    ...allPosts.filter((p) => p.category === post.category && p.id !== post.id),
    ...allPosts.filter((p) => p.category !== post.category && p.id !== post.id),
  ].slice(0, 3);

  const ogImageAbs = `https://mbtifinder.com/api/og?${new URLSearchParams({
    mode: 'result',
    testTitle: `MBTI Finder · ${post.category || '심리 칼럼'}`,
    resultTitle: post.title,
    subtitle: (post.excerpt || '성격분석 심리 칼럼').slice(0, 48),
  }).toString()}`;

  const jsonLdArticle = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.excerpt,
    image: [ogImageAbs],
    author: {
      '@type': 'Organization',
      name: 'MBTI Finder 편집팀',
      url: 'https://mbtifinder.com/about',
    },
    publisher: {
      '@type': 'Organization',
      name: 'MBTI Finder',
      url: 'https://mbtifinder.com',
    },
    datePublished: parseDateToISO(post.date),
    dateModified: parseDateToISO(post.date),
    mainEntityOfPage: `https://mbtifinder.com/blog/${numId}`,
    keywords: (post.tags || []).join(', '),
    articleSection: post.category,
    inLanguage: 'ko',
  };

  return (
    <div className="min-h-screen bg-neutral-50 font-sans pt-24 pb-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdArticle) }}
      />

      {/* Back Button */}
      <div className="max-w-3xl mx-auto px-6 mb-8">
        <Link
          href="/blog"
          className="inline-flex items-center text-sm font-medium text-neutral-500 hover:text-pink-500 transition-colors"
        >
          <ArrowLeft size={16} className="mr-1" /> 심리 칼럼 목록으로 돌아가기
        </Link>
      </div>

      {/* Article Header */}
      <header className="max-w-3xl mx-auto px-6 mb-10 text-center">
        <div className="mb-4">
          <Badge variant="outline" className="text-pink-600 border-pink-200 bg-pink-50 text-sm px-3 py-1">
            {post.category || '심리분석'}
          </Badge>
        </div>
        <h1 className="text-3xl md:text-4xl font-extrabold text-neutral-900 mb-6 leading-tight break-keep">
          {post.title}
        </h1>
        <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-neutral-500">
          <div className="flex items-center">
            <BookOpen size={15} className="mr-1.5" />
            MBTI Finder 편집팀
          </div>
          <div className="flex items-center">
            <Calendar size={15} className="mr-1.5" />
            {post.date || '날짜 미상'}
          </div>
          <div className="flex items-center">
            <Clock size={15} className="mr-1.5" />
            {post.read_time || '4분'} 소요
          </div>
        </div>
      </header>

      {/* Summary Highlight Card */}
      {post.excerpt && (
        <div className="max-w-3xl mx-auto px-6 mb-10">
          <div className="bg-white rounded-2xl border border-pink-100 p-6 shadow-sm">
            <div className="text-xs font-bold uppercase tracking-wider text-pink-500 mb-2">핵심 요약</div>
            <p className="text-neutral-700 leading-relaxed text-base">{post.excerpt}</p>
          </div>
        </div>
      )}

      {/* Article Content */}
      <article className="max-w-3xl mx-auto px-6 prose prose-lg prose-neutral prose-headings:font-bold prose-headings:text-neutral-800 prose-a:text-pink-600 prose-p:leading-relaxed prose-li:marker:text-pink-400">
        <div dangerouslySetInnerHTML={{ __html: post.content }} />
      </article>

      {/* Tags */}
      {(post.tags || []).length > 0 && (
        <div className="max-w-3xl mx-auto px-6 mt-12 mb-8">
          <div className="flex flex-wrap gap-2">
            {(post.tags || []).map((tag: string) => (
              <Badge key={tag} variant="secondary" className="bg-neutral-100 text-neutral-600">
                #{tag}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* Editorial Note & Related Tool CTA */}
      <div className="max-w-3xl mx-auto px-6 mt-10">
        <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl border border-purple-100 p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center text-sm font-bold text-purple-700 mb-1">
              <Sparkles size={16} className="mr-1.5" /> 나의 성향 직접 확인해보기
            </div>
            <p className="text-sm text-neutral-600">
              칼럼에서 다룬 성격 특성을 64문항 MBTI 검사와 16유형 백과에서 자세히 살펴보세요.
            </p>
          </div>
          <div className="flex gap-2 shrink-0">
            <Link
              href="/test"
              className="px-4 py-2 rounded-xl bg-neutral-900 text-white text-sm font-semibold hover:bg-neutral-800 transition-colors"
            >
              MBTI 검사
            </Link>
            <Link
              href="/type"
              className="px-4 py-2 rounded-xl bg-white text-neutral-800 border border-neutral-200 text-sm font-semibold hover:bg-neutral-50 transition-colors"
            >
              16유형 백과
            </Link>
          </div>
        </div>

        <p className="mt-4 text-xs text-neutral-500 leading-relaxed">
          ※ 본 칼럼은 자기이해와 일상 소통을 돕기 위해 MBTI Finder 편집팀이 정리한 참고용 콘텐츠이며, 의학적·임상적 심리 진단을 대체하지 않습니다. 내용 정정이나 의견은{' '}
          <Link href="/contact" className="underline hover:text-neutral-700">
            문의 페이지
          </Link>
          로 전달해 주세요.
        </p>
      </div>

      {/* Related Posts */}
      {relatedPosts.length > 0 && (
        <div className="max-w-3xl mx-auto px-6 mt-12 pt-8 border-t border-neutral-200">
          <h2 className="text-xl font-bold text-neutral-900 mb-6">📝 함께 읽으면 좋은 관련 칼럼</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {relatedPosts.map((relatedPost) => (
              <Link key={relatedPost.id} href={`/blog/${relatedPost.id}`} className="group block">
                <div className="p-4 rounded-xl border border-neutral-200 hover:border-pink-300 hover:shadow-md transition-all h-full bg-white flex flex-col">
                  <span className="text-xs font-medium text-pink-500 mb-1.5">
                    {relatedPost.category || '심리분석'}
                  </span>
                  <h3 className="font-bold text-neutral-800 group-hover:text-pink-600 line-clamp-2 mb-2 leading-tight text-sm">
                    {relatedPost.title}
                  </h3>
                  <p className="text-xs text-neutral-500 line-clamp-2 mt-auto">
                    {relatedPost.excerpt}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
