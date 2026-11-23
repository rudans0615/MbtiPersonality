"use client";
import { useState, useMemo, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Calendar, Clock, ArrowRight, Search, ChevronLeft, ChevronRight } from "lucide-react";

interface BlogClientProps {
  initialPosts: any[];
  initialPage?: number;
  initialCategory?: string;
  initialQuery?: string;
}

const POSTS_PER_PAGE = 9;

export default function BlogClient({
  initialPosts,
  initialPage = 1,
  initialCategory = "all",
  initialQuery = "",
}: BlogClientProps) {
  const [searchTerm, setSearchTerm] = useState(initialQuery);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [currentPage, setCurrentPage] = useState(initialPage);

  useEffect(() => {
    setSelectedCategory(initialCategory);
    setSearchTerm(initialQuery);
    setCurrentPage(initialPage);
  }, [initialCategory, initialQuery, initialPage]);

  const categories = useMemo(
    () => Array.from(new Set(initialPosts.map((post) => post.category).filter(Boolean))),
    [initialPosts]
  );

  const filteredPosts = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    return initialPosts
      .filter((post) => {
        const matchesSearch =
          !q ||
          (post.title || "").toLowerCase().includes(q) ||
          (post.excerpt || "").toLowerCase().includes(q) ||
          (post.tags || []).some((tag: string) => tag.toLowerCase().includes(q));
        const matchesCategory = selectedCategory === "all" || post.category === selectedCategory;
        return matchesSearch && matchesCategory;
      })
      .sort((a, b) => b.id - a.id);
  }, [searchTerm, selectedCategory, initialPosts]);

  const totalPages = Math.max(1, Math.ceil(filteredPosts.length / POSTS_PER_PAGE));
  const safePage = Math.min(currentPage, totalPages);
  const startIndex = (safePage - 1) * POSTS_PER_PAGE;
  const currentPosts = filteredPosts.slice(startIndex, startIndex + POSTS_PER_PAGE);

  const buildPageHref = (page: number, cat: string = selectedCategory, q: string = searchTerm) => {
    const params = new URLSearchParams();
    if (cat && cat !== "all") params.set("category", cat);
    if (q.trim()) params.set("q", q.trim());
    if (page > 1) params.set("page", String(page));
    const qs = params.toString();
    return qs ? `/blog?${qs}` : "/blog";
  };

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Header */}
      <div className="gradient-bg text-white pt-28 pb-16">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">성격분석 심리 칼럼</h1>
          <p className="text-xl opacity-90">MBTI, 애착유형, 연애와 직장 심리에 대한 깊이 있는 인사이트</p>
        </div>
      </div>

      {/* Search and Filter Section */}
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="bg-white rounded-2xl shadow-sm border border-neutral-100 p-6 mb-8 space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" size={20} />
            <Input
              placeholder="제목, 요약, 태그로 칼럼 검색..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="pl-10"
            />
          </div>

          {/* Crawlable Category Filter Links */}
          <div className="flex flex-wrap gap-2">
            <Link
              href={buildPageHref(1, "all", searchTerm)}
              onClick={() => {
                setSelectedCategory("all");
                setCurrentPage(1);
              }}
              className={`px-3.5 py-1.5 rounded-full text-sm font-medium transition-colors ${
                selectedCategory === "all"
                  ? "bg-neutral-900 text-white"
                  : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
              }`}
            >
              전체 ({initialPosts.length})
            </Link>
            {categories.map((category) => (
              <Link
                key={category}
                href={buildPageHref(1, category, searchTerm)}
                onClick={() => {
                  setSelectedCategory(category);
                  setCurrentPage(1);
                }}
                className={`px-3.5 py-1.5 rounded-full text-sm font-medium transition-colors ${
                  selectedCategory === category
                    ? "bg-neutral-900 text-white"
                    : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
                }`}
              >
                {category}
              </Link>
            ))}
          </div>

          <div className="text-sm text-neutral-500">
            총 <strong className="text-neutral-800">{filteredPosts.length}</strong>편의 칼럼
          </div>
        </div>

        {/* Blog Posts Grid */}
        {currentPosts.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-10">
            {currentPosts.map((post) => {
              const readTime = post.read_time || post.readTime || "4분";
              return (
                <Card
                  key={post.id}
                  className="bg-white hover:shadow-lg transition-shadow duration-300 group flex flex-col h-full border border-neutral-100"
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between text-xs text-neutral-500 mb-2">
                      <div className="flex items-center space-x-1">
                        <Calendar size={14} />
                        <span>{post.date}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock size={14} />
                        <span>{readTime}</span>
                      </div>
                    </div>
                    <Link href={`/blog/${post.id}`}>
                      <CardTitle className="text-lg line-clamp-2 group-hover:text-primary transition-colors min-h-[3.5rem] flex items-center">
                        {post.title}
                      </CardTitle>
                    </Link>
                  </CardHeader>
                  <CardContent className="pt-0 flex-1 flex flex-col">
                    <p className="text-neutral-600 mb-4 line-clamp-3 text-sm flex-1 leading-relaxed">
                      {post.excerpt}
                    </p>

                    <div className="flex flex-wrap gap-1 mb-4">
                      {(post.tags || []).slice(0, 3).map((tag: string, index: number) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          #{tag}
                        </Badge>
                      ))}
                    </div>

                    <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100">
                      <Badge variant="outline" className="text-xs">
                        {post.category || "심리분석"}
                      </Badge>
                      <Link href={`/blog/${post.id}`}>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="group-hover:text-primary p-0 h-auto hover:bg-transparent"
                        >
                          읽어보기 <ArrowRight size={14} className="ml-1" />
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-2xl border border-neutral-100">
            <h2 className="text-xl font-semibold text-neutral-700 mb-2">검색 결과가 없습니다</h2>
            <p className="text-neutral-500">다른 키워드나 카테고리로 탐색해보세요.</p>
          </div>
        )}

        {/* Crawlable Link Pagination */}
        {totalPages > 1 && (
          <nav aria-label="칼럼 페이지 이동" className="flex items-center justify-center space-x-2 mb-8">
            {safePage > 1 ? (
              <Link href={buildPageHref(safePage - 1)} onClick={() => setCurrentPage(safePage - 1)}>
                <Button variant="outline" size="sm">
                  <ChevronLeft size={16} /> 이전
                </Button>
              </Link>
            ) : (
              <Button variant="outline" size="sm" disabled>
                <ChevronLeft size={16} /> 이전
              </Button>
            )}

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <Link key={page} href={buildPageHref(page)} onClick={() => setCurrentPage(page)}>
                <Button variant={safePage === page ? "default" : "outline"} size="sm">
                  {page}
                </Button>
              </Link>
            ))}

            {safePage < totalPages ? (
              <Link href={buildPageHref(safePage + 1)} onClick={() => setCurrentPage(safePage + 1)}>
                <Button variant="outline" size="sm">
                  다음 <ChevronRight size={16} />
                </Button>
              </Link>
            ) : (
              <Button variant="outline" size="sm" disabled>
                다음 <ChevronRight size={16} />
              </Button>
            )}
          </nav>
        )}
      </div>
    </div>
  );
}
