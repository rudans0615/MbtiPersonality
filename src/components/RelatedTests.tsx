"use client";

import { useRef, useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, Users, ArrowRight, ChevronLeft, ChevronRight, Sparkles } from "lucide-react";
import { testTypes } from "@/data/testTypes";

export default function RelatedTests({ currentTestId }: { currentTestId?: string }) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [randomTests, setRandomTests] = useState<any[]>([]);

  useEffect(() => {
    // 현재 테스트를 제외한 사용 가능한 테스트들 중 랜덤하게 6개 추출
    const availableTests = testTypes.filter(t => t.isAvailable && t.id !== currentTestId);
    const shuffled = [...availableTests].sort(() => 0.5 - Math.random());
    setRandomTests(shuffled.slice(0, 6));
  }, [currentTestId]);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 350;
      scrollContainerRef.current.scrollBy({ left: direction === 'left' ? -scrollAmount : scrollAmount, behavior: 'smooth' });
    }
  };

  if (randomTests.length === 0) return null;

  return (
    <div className="w-full mt-16 pt-12 border-t border-neutral-100 relative group max-w-7xl mx-auto">
      <div className="flex items-center gap-3 mb-6 px-4 md:px-0">
        <Sparkles className="text-primary w-6 h-6 animate-pulse" />
        <h3 className="text-2xl font-bold text-neutral-800 tracking-tight">
          이 테스트를 한 사람들이 많이 한 테스트 🔥
        </h3>
      </div>
      
      {/* PC 가로 스크롤 좌측 버튼 */}
      <button 
        onClick={() => scroll('left')}
        className="hidden md:flex absolute left-0 top-[60%] -translate-y-1/2 -ml-5 z-10 w-12 h-12 bg-white/95 border border-neutral-200 rounded-full shadow-lg items-center justify-center text-neutral-600 hover:text-primary hover:scale-110 transition-all opacity-0 group-hover:opacity-100"
      >
        <ChevronLeft size={24} />
      </button>

      {/* 가로 스크롤 컨테이너 */}
      <div ref={scrollContainerRef} className="flex overflow-x-auto pb-8 -mx-4 px-4 md:mx-0 md:px-2 space-x-6 snap-x snap-mandatory [&::-webkit-scrollbar]:hidden scroll-smooth relative">
        {randomTests.map((test) => (
          <Card 
            key={test.id} 
            className="min-w-[280px] max-w-[280px] md:min-w-[320px] md:max-w-[320px] snap-center snap-always bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group flex flex-col cursor-pointer"
            onClick={() => window.location.href = test.href}
          >
            <div className={`h-3 bg-gradient-to-r ${test.color || 'from-neutral-200 to-neutral-300'}`}></div>
            <CardContent className="p-6 flex flex-col h-full pointer-events-none">
              <div className="flex items-start justify-between mb-4">
                <div className="text-4xl filter drop-shadow-md group-hover:scale-110 transition-transform">{test.emoji}</div>
                <Badge variant="secondary" className="bg-primary/10 text-primary">
                  추천
                </Badge>
              </div>
              <h3 className="text-xl font-bold text-neutral-800 mb-2">{test.title}</h3>
              <p className="text-sm text-neutral-500 mb-4 line-clamp-2">{test.subtitle || test.description}</p>

              <div className="flex items-center gap-4 text-xs text-neutral-400 mb-6 mt-auto">
                <div className="flex items-center gap-1">
                  <Clock size={14} />
                  {test.duration}
                </div>
                <div className="flex items-center gap-1">
                  <Users size={14} />
                  {test.questions}문항
                </div>
              </div>

              <div className="mt-auto pointer-events-auto">
                <Link href={test.href}>
                  <Button className="w-full bg-neutral-900 text-white hover:bg-neutral-800 rounded-xl group-hover:shadow-lg transition-all">
                    시작하기
                    <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* PC 가로 스크롤 우측 버튼 */}
      <button 
        onClick={() => scroll('right')}
        className="hidden md:flex absolute right-0 top-[60%] -translate-y-1/2 -mr-5 z-10 w-12 h-12 bg-white/95 border border-neutral-200 rounded-full shadow-lg items-center justify-center text-neutral-600 hover:text-primary hover:scale-110 transition-all opacity-0 group-hover:opacity-100"
      >
        <ChevronRight size={24} />
      </button>
    </div>
  );
}
