import { useEffect, useState } from "react";
import { useLocation, Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { blogPosts, BlogPost } from "@/data/blogPosts";
import { AdSenseBlock } from "@/components/AdSenseBlock";

export default function BlogPostPage() {
  const [location] = useLocation();
  const [post, setPost] = useState<BlogPost | null>(null);

  useEffect(() => {
    // Extract post ID from URL path like /blog/1
    const match = location.match(/\/blog\/(\d+)/);
    if (match && match[1]) {
      const postId = parseInt(match[1]);
      const foundPost = blogPosts.find(p => p.id === postId);
      if (foundPost) {
        setPost(foundPost);
      }
    }
  }, [location]);

  if (!post) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-neutral-800 mb-4">포스트를 찾을 수 없습니다</h1>
          <Link href="/blog">
            <Button className="bg-primary text-white">블로그로 돌아가기</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Header */}
      <div className="gradient-bg text-white py-16">
        <div className="max-w-4xl mx-auto px-6">
          <div className="mb-6">
            <Link href="/blog">
              <Button variant="ghost" className="text-white hover:text-white/80 p-0">
                <i className="fas fa-arrow-left mr-2"></i>블로그로 돌아가기
              </Button>
            </Link>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-4">{post.title}</h1>
          <div className="flex items-center text-white/80 space-x-4 text-sm">
            <span><i className="fas fa-calendar mr-1"></i>{post.date}</span>
            <span><i className="fas fa-clock mr-1"></i>{post.readTime} 읽기</span>
          </div>
          <div className="flex flex-wrap gap-2 mt-4">
            {post.tags.map((tag, index) => (
              <span key={index} className="bg-white/20 text-white px-3 py-1 rounded-full text-xs">
                #{tag}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Article Content */}
        <Card className="bg-white rounded-3xl shadow-lg mb-8">
          <CardContent className="p-8 md:p-12">
            <div
              className="prose prose-lg max-w-none text-neutral-700 blog-content"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />

            <style>{`
              .blog-content h2 {
                font-size: 1.8rem;
                font-weight: 700;
                color: #333;
                margin-top: 2.5rem;
                margin-bottom: 1.5rem;
                border-bottom: 2px solid #f0f0f0;
                padding-bottom: 0.5rem;
              }
              .blog-content h3 {
                font-size: 1.4rem;
                font-weight: 600;
                color: #444;
                margin-top: 2rem;
                margin-bottom: 1rem;
              }
              .blog-content p {
                line-height: 1.8;
                margin-bottom: 1.2rem;
                word-break: keep-all;
              }
              .blog-content ul {
                list-style-type: disc;
                padding-left: 1.5rem;
                margin-bottom: 1.5rem;
              }
              .blog-content li {
                margin-bottom: 0.5rem;
              }
              .blog-content strong {
                color: #2a2a2a;
                font-weight: 600;
              }
              .blog-content hr {
                margin: 3rem 0;
                border: 0;
                border-top: 1px solid #eee;
              }
            `}</style>
          </CardContent>
        </Card>

        {/* 광고 영역: 포스트 본문과 관련 포스트 사이 */}
        <AdSenseBlock adSlot="8910123456" />

        {/* Related Posts */}
        <Card className="bg-white rounded-3xl shadow-lg">
          <CardContent className="p-8">
            <h3 className="text-2xl font-bold text-neutral-800 mb-6">관련 포스트</h3>
            <div className="grid md:grid-cols-2 gap-6">
              {blogPosts
                .filter(p => p.id !== post.id && p.category === post.category)
                .slice(0, 2)
                .map((relatedPost) => (
                  <Link key={relatedPost.id} href={`/blog/${relatedPost.id}`}>
                    <div className="border border-neutral-200 rounded-xl p-6 hover:shadow-md transition-shadow cursor-pointer h-full flex flex-col">
                      <h4 className="font-semibold text-lg mb-2 text-neutral-800 hover:text-primary transition-colors line-clamp-2">
                        {relatedPost.title}
                      </h4>
                      <p className="text-neutral-600 text-sm mb-3 line-clamp-2 flex-1">{relatedPost.excerpt}</p>
                      <div className="flex items-center text-xs text-neutral-500 space-x-3 mt-auto">
                        <span>{relatedPost.date}</span>
                        <span>{relatedPost.readTime}</span>
                      </div>
                    </div>
                  </Link>
                ))
              }
              {/* Fallback if no related posts in same category */}
              {blogPosts.filter(p => p.id !== post.id && p.category === post.category).length === 0 &&
                blogPosts.slice(0, 2).map((relatedPost) => (
                  <Link key={relatedPost.id} href={`/blog/${relatedPost.id}`}>
                    <div className="border border-neutral-200 rounded-xl p-6 hover:shadow-md transition-shadow cursor-pointer h-full flex flex-col">
                      <h4 className="font-semibold text-lg mb-2 text-neutral-800 hover:text-primary transition-colors line-clamp-2">
                        {relatedPost.title}
                      </h4>
                      <p className="text-neutral-600 text-sm mb-3 line-clamp-2 flex-1">{relatedPost.excerpt}</p>
                      <div className="flex items-center text-xs text-neutral-500 space-x-3 mt-auto">
                        <span>{relatedPost.date}</span>
                        <span>{relatedPost.readTime}</span>
                      </div>
                    </div>
                  </Link>
                ))
              }
            </div>
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="text-center mt-8 space-y-4">
          <div className="flex justify-center space-x-4 flex-wrap gap-2">
            <Link href="/blog">
              <Button variant="outline" className="px-6 py-3">
                <i className="fas fa-list mr-2"></i>전체 포스트 보기
              </Button>
            </Link>
            <Link href="/test">
              <Button className="bg-gradient-to-r from-primary to-secondary text-white px-6 py-3">
                <i className="fas fa-play mr-2"></i>MBTI 검사하기
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}