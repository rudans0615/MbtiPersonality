import { blogPosts } from '@/data/blogPosts';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import SEO from '@/components/SEO';
import { AdSenseBlock } from '@/components/AdSenseBlock';
import Link from 'next/link';
import { ArrowLeft, Calendar, Clock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

// 빌드 타임에 모든 블로그 글의 라우팅 경로를 미리 생성합니다 (SSG)
export async function generateStaticParams() {
  return blogPosts.map((post) => ({
    id: post.id.toString(),
  }));
}

// 동적 메타데이터 생성 (SEO)
export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const post = blogPosts.find((p) => p.id.toString() === id);
  
  if (!post) return { title: '게시글을 찾을 수 없습니다 | MBTI Finder' };
  
  return {
    title: `${post.title} | MBTI Finder 성격분석 블로그`,
    description: post.excerpt,
    openGraph: {
      title: `${post.title} | MBTI Finder`,
      description: post.excerpt,
      type: 'article',
      authors: ['MBTI Finder'],
      tags: post.tags,
    }
  };
}

export default async function BlogPostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const post = blogPosts.find((p) => p.id.toString() === id);

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

  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col font-sans">
      <SEO 
        title={`${post.title} | MBTI Finder 성격분석 블로그`} 
        description={post.excerpt} 
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
              {post.category}
            </Badge>
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-neutral-900 mb-6 leading-tight break-keep">
            {post.title}
          </h1>
          <div className="flex items-center justify-center space-x-4 text-sm text-neutral-500">
            <div className="flex items-center">
              <Calendar size={16} className="mr-1.5" />
              {post.date}
            </div>
            <div className="flex items-center">
              <Clock size={16} className="mr-1.5" />
              {post.readTime} 소요
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
            {post.tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="bg-neutral-100 text-neutral-600 hover:bg-neutral-200">
                #{tag}
              </Badge>
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
