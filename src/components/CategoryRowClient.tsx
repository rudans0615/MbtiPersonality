"use client";

import { useRef, useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, Users, ArrowRight, Sparkles, Heart, Brain, Laugh, Rocket, ChevronLeft, ChevronRight } from "lucide-react";

const getIconForCategory = (cat: string) => {
  switch(cat) {
    case 'HOT': return <Sparkles className="text-yellow-500 w-6 h-6" />;
    case 'LOVE': return <Heart className="text-pink-500 w-6 h-6" />;
    case 'PERSONALITY': return <Brain className="text-blue-500 w-6 h-6" />;
    case 'FUN': return <Laugh className="text-green-500 w-6 h-6" />;
    case 'CAREER': return <Rocket className="text-purple-500 w-6 h-6" />;
    default: return <Sparkles className="text-primary w-6 h-6" />;
  }
};

const getTitleForCategory = (cat: string) => {
  switch(cat) {
    case 'HOT': return '지금 가장 뜨거운 테스트 🔥';
    case 'LOVE': return '달콤쌉싸름한 연애 진단 💕';
    case 'PERSONALITY': return '나를 찾아가는 심리 분석 🧠';
    case 'FUN': return '시간 순삭 킬링타임 유머 🍻';
    case 'CAREER': return '성공을 위한 직업 적성 🚀';
    default: return '추천 테스트';
  }
};

export default function CategoryRowClient({ category, tests, isComingSoon = false }: { category: string, tests: any[], isComingSoon?: boolean }) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  
  // Drag to scroll state
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);

  const handleScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      const maxScroll = scrollWidth - clientWidth;

      if (maxScroll <= 0) {
        setScrollProgress(0);
      } else {
        // limit between 0 and 100
        const progress = Math.min(Math.max((scrollLeft / maxScroll) * 100, 0), 100);
        setScrollProgress(progress);
      }
    }
  };

  useEffect(() => {
    handleScroll(); // initialize
    window.addEventListener('resize', handleScroll);
    return () => window.removeEventListener('resize', handleScroll);
  }, [tests]);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 350;
      scrollContainerRef.current.scrollBy({ left: direction === 'left' ? -scrollAmount : scrollAmount, behavior: 'smooth' });
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    if (!scrollContainerRef.current) return;
    setStartX(e.pageX - scrollContainerRef.current.offsetLeft);
    setScrollLeft(scrollContainerRef.current.scrollLeft);
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !scrollContainerRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollContainerRef.current.offsetLeft;
    const walk = (x - startX) * 2; // Scroll speed multiplier
    scrollContainerRef.current.scrollLeft = scrollLeft - walk;
  };

  if (tests.length === 0) return null;
  return (
    <div className="mb-14 relative group">
      <div className="flex items-center gap-3 mb-6 px-4 md:px-0">
        {getIconForCategory(category)}
        <h3 className="text-2xl font-bold text-neutral-800 tracking-tight">
          {isComingSoon ? "곧 출시할 신규 테스트 🚧" : getTitleForCategory(category)}
        </h3>
      </div>
      
      {/* PC 가로 스크롤 좌측 버튼 */}
      <button 
        onClick={() => scroll('left')}
        className="hidden md:flex absolute left-0 top-[55%] -translate-y-1/2 -ml-5 z-10 w-12 h-12 bg-white/95 border border-neutral-200 rounded-full shadow-lg items-center justify-center text-neutral-600 hover:text-primary hover:scale-110 transition-all opacity-0 group-hover:opacity-100"
      >
        <ChevronLeft size={24} />
      </button>

      {/* 넷플릭스형 가로 스크롤 컨테이너 */}
      <div 
        ref={scrollContainerRef} 
        onScroll={handleScroll}
        onMouseDown={handleMouseDown}
        onMouseLeave={handleMouseLeave}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
        className={`flex overflow-x-auto pb-6 -mx-4 px-4 md:mx-0 md:px-2 space-x-6 snap-x snap-mandatory [&::-webkit-scrollbar]:hidden relative touch-pan-x ${isDragging ? 'cursor-grabbing snap-none' : 'cursor-grab'}`}
      >
        {tests.map((test) => (
          <Card 
            key={test.id} 
            className={`min-w-[300px] max-w-[300px] md:min-w-[340px] md:max-w-[340px] snap-center snap-always bg-white rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden group flex flex-col ${isComingSoon ? 'opacity-70 border-dashed border-2' : ''}`}
          >
            <div className={`h-3 bg-gradient-to-r ${test.color || 'from-neutral-200 to-neutral-300'}`}></div>
            <CardContent className="p-6 flex flex-col h-full">
              <div className="flex items-start justify-between mb-4">
                <div className="text-4xl filter drop-shadow-md group-hover:scale-110 transition-transform">{test.emoji}</div>
                <Badge variant={isComingSoon ? "outline" : "secondary"} className={isComingSoon ? "bg-neutral-100" : "bg-primary/10 text-primary"}>
                  {isComingSoon ? "출시 예정" : "인기 급상승"}
                </Badge>
              </div>
              <h3 className="text-xl font-bold text-neutral-800 mb-2">{test.title}</h3>
              <p className="text-sm text-neutral-500 mb-4 line-clamp-2">{test.subtitle || test.description}</p>

              <div className="flex items-center gap-4 text-xs text-neutral-400 mb-6">
                <div className="flex items-center gap-1">
                  <Clock size={14} />
                  {test.duration}
                </div>
                <div className="flex items-center gap-1">
                  <Users size={14} />
                  {test.questions}문항
                </div>
              </div>

              <div className="mt-auto">
                {isComingSoon ? (
                  <Button disabled className="w-full bg-neutral-200 text-neutral-500 rounded-xl">
                    오픈 대기 중...
                  </Button>
                ) : (
                  <Link href={test.href} draggable={false}>
                    <Button className="w-full bg-neutral-900 text-white hover:bg-neutral-800 rounded-xl group-hover:shadow-lg transition-all">
                      시작하기
                      <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* PC 가로 스크롤 우측 버튼 */}
      <button 
        onClick={() => scroll('right')}
        className="hidden md:flex absolute right-0 top-[55%] -translate-y-1/2 -mr-5 z-10 w-12 h-12 bg-white/95 border border-neutral-200 rounded-full shadow-lg items-center justify-center text-neutral-600 hover:text-primary hover:scale-110 transition-all opacity-0 group-hover:opacity-100"
      >
        <ChevronRight size={24} />
      </button>

      {/* 모바일 스크롤 인디케이터 (Progress Bar) - 카드가 2개 이상일 때만 표시 */}
      {tests.length > 1 && (
        <div className="md:hidden mt-2 mb-4 mx-auto w-24 h-1 bg-neutral-200 rounded-full overflow-hidden">
          <div 
            className="h-full bg-purple-500 rounded-full"
            style={{ width: '40%', transform: `translateX(${(scrollProgress / 100) * 150}%)` }}
          />
        </div>
      )}
    </div>
  )
}
