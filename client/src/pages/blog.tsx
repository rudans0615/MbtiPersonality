import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import Navigation from "@/components/Navigation";
import AdSense from "@/components/AdSense";

export default function Blog() {
  const blogPosts = [
    {
      id: 1,
      title: "MBTI 검사의 정확도를 높이는 방법",
      excerpt: "MBTI 검사를 받을 때 더 정확한 결과를 얻기 위한 실용적인 팁들을 알아보세요.",
      date: "2024년 12월 15일",
      readTime: "5분"
    },
    {
      id: 2,
      title: "16가지 성격유형별 커리어 가이드",
      excerpt: "각 MBTI 유형별로 적합한 직업과 커리어 개발 방향을 상세히 분석했습니다.",
      date: "2024년 12월 10일",
      readTime: "8분"
    },
    {
      id: 3,
      title: "MBTI와 인간관계: 궁합의 과학",
      excerpt: "성격유형에 따른 관계 패턴과 더 나은 소통 방법을 과학적으로 접근해봅니다.",
      date: "2024년 12월 5일",
      readTime: "6분"
    },
    {
      id: 4,
      title: "내향형과 외향형의 에너지 관리법",
      excerpt: "I형과 E형의 차이를 이해하고 각자에게 맞는 에너지 충전 방법을 찾아보세요.",
      date: "2024년 11월 28일",
      readTime: "4분"
    }
  ];

  return (
    <div className="min-h-screen bg-neutral-50">
      <Navigation />
      
      {/* Header */}
      <div className="gradient-bg text-white py-16">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">MBTI 블로그</h1>
          <p className="text-xl opacity-90">성격유형과 심리학에 대한 깊이 있는 인사이트</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Navigation */}
        <div className="mb-8">
          <Link href="/">
            <Button variant="ghost" className="text-neutral-600 hover:text-primary">
              <i className="fas fa-arrow-left mr-2"></i>홈으로 돌아가기
            </Button>
          </Link>
        </div>

        {/* Blog Posts */}
        <div className="space-y-8">
          {blogPosts.map((post, index) => (
            <Card key={post.id} className="bg-white rounded-3xl shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
                  <div className="flex items-center text-sm text-neutral-500 space-x-4">
                    <span><i className="fas fa-calendar mr-1"></i>{post.date}</span>
                    <span><i className="fas fa-clock mr-1"></i>{post.readTime} 읽기</span>
                  </div>
                </div>
                <h2 className="text-2xl font-bold text-neutral-800 mb-4 hover:text-primary transition-colors cursor-pointer">
                  {post.title}
                </h2>
                <p className="text-neutral-600 text-lg leading-relaxed mb-6">
                  {post.excerpt}
                </p>
                <Link href={`/blog/${post.id}`}>
                  <Button className="bg-primary text-white hover:bg-primary/90 transition-colors">
                    읽어보기 <i className="fas fa-arrow-right ml-2"></i>
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}

          {/* AdSense */}
          <AdSense 
            adSlot="1234567895"
            className="my-8"
          />



          {/* Related Links */}
          <div className="text-center space-y-4">
            <h3 className="text-xl font-semibold text-neutral-800">더 알아보기</h3>
            <div className="flex justify-center space-x-4 flex-wrap gap-2">
              <Link href="/about">
                <Button variant="outline" className="px-6 py-3">
                  <i className="fas fa-info-circle mr-2"></i>MBTI 소개
                </Button>
              </Link>
              <Link href="/test">
                <Button className="bg-gradient-to-r from-primary to-secondary text-white px-6 py-3">
                  <i className="fas fa-play mr-2"></i>검사하기
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}