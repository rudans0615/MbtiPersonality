import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import Navigation from "@/components/Navigation";
import AdSense from "@/components/AdSense";
import { Link } from "wouter";
import { Calendar, Clock, ArrowRight, Search, ChevronLeft, ChevronRight } from "lucide-react";

export default function Blog() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [postsPerPage, setPostsPerPage] = useState(6);
  const [currentPage, setCurrentPage] = useState(1);

  const blogPosts = [
    {
      id: 1,
      title: "MBTI 성격유형별 특징과 장단점 완벽 분석",
      excerpt: "16가지 MBTI 성격유형의 특징, 장점, 단점을 상세히 알아보고 자신의 유형을 더 깊이 이해해보세요.",
      date: "2024-12-20",
      readTime: "10분",
      tags: ["MBTI", "성격유형", "심리학"],
      category: "성격분석"
    },
    {
      id: 2,
      title: "테토 vs 에겐 성격유형 완벽 가이드",
      excerpt: "호르몬 기반 성격 분류 시스템인 테토-에겐 유형을 완벽 분석! 4가지 유형의 특징과 연애 궁합까지 알아보세요.",
      date: "2024-12-22",
      readTime: "12분",
      tags: ["테토에겐", "호르몬", "성격유형", "연애궁합"],
      category: "호르몬 성격학"
    },
    {
      id: 3,
      title: "테토-에겐 유형별 연애 스타일 분석",
      excerpt: "4가지 테토-에겐 유형이 연애에서 보이는 특징적인 패턴과 최적의 궁합을 자세히 알아보세요.",
      date: "2024-12-21",
      readTime: "9분",
      tags: ["테토에겐", "연애스타일", "궁합", "관계"],
      category: "호르몬 성격학"
    },
    {
      id: 4,
      title: "MBTI J형과 P형, 어떤 차이가 있을까?",
      excerpt: "계획적인 J형과 유연한 P형의 차이점을 알아보고, 각각의 강점과 특징을 분석해보세요.",
      date: "2024-12-18",
      readTime: "8분",
      tags: ["MBTI", "J형", "P형", "라이프스타일"],
      category: "성격분석"
    },
    {
      id: 5,
      title: "호르몬이 성격에 미치는 영향: 과학적 관점",
      excerpt: "테스토스테론과 에스트로겐이 우리의 성격과 행동에 어떤 영향을 미치는지 과학적 연구를 바탕으로 알아보세요.",
      date: "2024-12-16",
      readTime: "11분",
      tags: ["호르몬", "과학", "테스토스테론", "에스트로겐"],
      category: "호르몬 성격학"
    },
    {
      id: 6,
      title: "내향형과 외향형, 진짜 차이는 무엇일까?",
      excerpt: "MBTI의 I형과 E형에 대한 흔한 오해를 바로잡고, 진정한 내향성과 외향성의 의미를 탐구해보세요.",
      date: "2024-12-15",
      readTime: "7분",
      tags: ["MBTI", "내향형", "외향형", "에너지"],
      category: "성격분석"
    },
    {
      id: 7,
      title: "테토남과 에겐녀, 최고의 궁합인 이유",
      excerpt: "테토-에겐 성격학에서 가장 이상적인 조합으로 여겨지는 테토남과 에겐녀의 관계 역학을 분석해보세요.",
      date: "2024-12-14",
      readTime: "8분",
      tags: ["테토에겐", "궁합", "테토남", "에겐녀"],
      category: "호르몬 성격학"
    },
    {
      id: 8,
      title: "MBTI 검사의 정확도를 높이는 방법",
      excerpt: "MBTI 검사를 받을 때 더 정확한 결과를 얻기 위한 실용적인 팁들을 알아보세요.",
      date: "2024-12-12",
      readTime: "6분",
      tags: ["MBTI", "검사", "정확도", "팁"],
      category: "성격분석"
    }
  ];

  // Filter and search logic
  const filteredPosts = useMemo(() => {
    return blogPosts.filter(post => {
      const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           post.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesCategory = selectedCategory === "all" || post.category === selectedCategory;
      
      return matchesSearch && matchesCategory;
    });
  }, [blogPosts, searchTerm, selectedCategory]);

  // Pagination logic
  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);
  const startIndex = (currentPage - 1) * postsPerPage;
  const endIndex = startIndex + postsPerPage;
  const currentPosts = filteredPosts.slice(startIndex, endIndex);

  // Reset to first page when filters change
  useMemo(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedCategory, postsPerPage]);

  const categories = Array.from(new Set(blogPosts.map(post => post.category)));

  return (
    <div className="min-h-screen bg-neutral-50">
      <Navigation />
      
      {/* Header */}
      <div className="gradient-bg text-white py-16">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">성격분석 블로그</h1>
          <p className="text-xl opacity-90">MBTI와 테토-에겐 성격유형에 대한 깊이 있는 인사이트</p>
        </div>
      </div>

      {/* Search and Filter Section */}
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4 items-center">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400" size={20} />
              <Input
                placeholder="제목, 내용, 태그로 검색..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            {/* Category Filter */}
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="카테고리 선택" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">전체 카테고리</SelectItem>
                {categories.map(category => (
                  <SelectItem key={category} value={category}>{category}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Posts per page */}
            <Select value={postsPerPage.toString()} onValueChange={(value) => setPostsPerPage(Number(value))}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="3">3개씩</SelectItem>
                <SelectItem value="6">6개씩</SelectItem>
                <SelectItem value="9">9개씩</SelectItem>
                <SelectItem value="12">12개씩</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {/* Results count */}
          <div className="mt-4 text-sm text-neutral-600">
            총 {filteredPosts.length}개의 글이 있습니다
          </div>
        </div>

        {/* Blog Posts */}
        {currentPosts.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
            {currentPosts.map((post) => (
              <Card key={post.id} className="bg-white hover:shadow-lg transition-shadow duration-300 group">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between text-sm text-neutral-500 mb-2">
                    <div className="flex items-center space-x-1">
                      <Calendar size={14} />
                      <span>{post.date}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock size={14} />
                      <span>{post.readTime}</span>
                    </div>
                  </div>
                  <CardTitle className="text-lg line-clamp-2 group-hover:text-primary transition-colors">
                    {post.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-neutral-600 mb-4 line-clamp-3 text-sm">
                    {post.excerpt}
                  </p>
                  
                  {/* Tags */}
                  <div className="flex flex-wrap gap-1 mb-4">
                    {post.tags.slice(0, 3).map((tag, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  
                  {/* Category */}
                  <div className="flex items-center justify-between">
                    <Badge variant="outline" className="text-xs">
                      {post.category}
                    </Badge>
                    <Link href={`/blog/${post.id}`}>
                      <Button variant="ghost" size="sm" className="group-hover:text-primary">
                        읽어보기 <ArrowRight size={14} className="ml-1" />
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <h3 className="text-xl font-semibold text-neutral-700 mb-2">검색 결과가 없습니다</h3>
            <p className="text-neutral-500">다른 키워드로 검색해보세요</p>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center space-x-2 mb-8">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft size={16} />
              이전
            </Button>
            
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <Button
                key={page}
                variant={currentPage === page ? "default" : "outline"}
                size="sm"
                onClick={() => setCurrentPage(page)}
              >
                {page}
              </Button>
            ))}
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
            >
              다음
              <ChevronRight size={16} />
            </Button>
          </div>
        )}

        {/* AdSense */}
        <AdSense 
          adSlot="1234567894"
          className="mb-8"
        />


      </div>
    </div>
  );
}