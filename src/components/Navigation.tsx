"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { getAvailableTests, TestType } from '@/data/testTypes';

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false);
  const location = usePathname() || '/';

  // 모든 사용 가능한 테스트를 가져오고, 카테고리별로 그룹화합니다.
  const availableTests = getAvailableTests();
  const groupedByCategory = availableTests.reduce((acc, test) => {
    if (!acc[test.category]) acc[test.category] = [];
    acc[test.category].push(test);
    return acc;
  }, {} as Record<string, TestType[]>);

  // 카테고리 이름 한글 매핑
  const categoryNames: Record<string, string> = {
    HOT: '🔥 인기 테스트',
    PERSONALITY: '🧠 성격 분석',
    LOVE: '💕 연애/궁합',
    FUN: '🎉 재미/킬링타임',
    CAREER: '💼 커리어/적성',
  };

  const isActive = (path: string) => {
    if (path === '/' && location === '/') return true;
    if (path !== '/' && location.startsWith(path)) return true;
    return false;
  };

  const isTestActive = availableTests.some(test => isActive(test.href));

  // 스크롤 시 배경색 변경
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed w-full top-0 z-50 transition-all duration-300 ${
      scrolled || isMegaMenuOpen ? 'bg-neutral-900/90 backdrop-blur-xl border-b border-white/10 shadow-lg' : 'bg-neutral-900/50 backdrop-blur-md border-b border-white/5'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/">
              <div className="flex items-center space-x-3 cursor-pointer group">
                <div className="w-9 h-9 bg-gradient-to-br from-pink-500 via-purple-500 to-indigo-500 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/30 group-hover:shadow-purple-500/50 transition-all duration-300 transform group-hover:scale-105">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-neutral-300 tracking-tight">MBTI Finder</span>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-2">
            
            {/* Mega Menu Trigger */}
            <div 
              className="relative"
              onMouseEnter={() => setIsMegaMenuOpen(true)}
              onMouseLeave={() => setIsMegaMenuOpen(false)}
            >
              <button 
                className={`px-5 py-2 text-sm font-semibold transition-all rounded-full flex items-center ${
                  isTestActive || isMegaMenuOpen
                    ? 'text-white bg-white/10' 
                    : 'text-neutral-300 hover:text-white hover:bg-white/5'
                }`}
              >
                테스트 탐색
                <svg className={`ml-1.5 w-4 h-4 transition-transform duration-300 ${isMegaMenuOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Desktop Mega Menu Panel */}
              {isMegaMenuOpen && (
                <div className="absolute top-full left-1/2 -translate-x-1/2 pt-4 w-[800px]">
                  <div className="bg-neutral-900/95 backdrop-blur-2xl border border-white/10 rounded-3xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-4 duration-200">
                    <div className="p-8 grid grid-cols-3 gap-8 max-h-[70vh] overflow-y-auto custom-scrollbar">
                      {Object.keys(categoryNames).map(catKey => {
                        const tests = groupedByCategory[catKey];
                        if (!tests || tests.length === 0) return null;
                        return (
                          <div key={catKey} className="space-y-4">
                            <h3 className="text-sm font-bold text-neutral-400 border-b border-white/5 pb-2">
                              {categoryNames[catKey]}
                            </h3>
                            <ul className="space-y-2">
                              {tests.map(test => (
                                <li key={test.id}>
                                  <Link href={test.href}>
                                    <div className="group flex items-start space-x-3 p-2 -mx-2 rounded-xl hover:bg-white/5 transition-colors cursor-pointer">
                                      <span className="text-xl bg-white/5 w-8 h-8 rounded-lg flex items-center justify-center shrink-0 group-hover:bg-white/10 transition-colors">{test.emoji}</span>
                                      <div>
                                        <div className="text-sm font-semibold text-neutral-200 group-hover:text-white transition-colors">{test.title}</div>
                                        <div className="text-xs text-neutral-500 mt-0.5 line-clamp-1 group-hover:text-neutral-400 transition-colors">{test.subtitle}</div>
                                      </div>
                                    </div>
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          </div>
                        );
                      })}
                    </div>
                    <div className="bg-white/5 p-4 text-center text-xs text-neutral-400 border-t border-white/5">
                      새로운 테스트가 매주 업데이트 됩니다 ✨
                    </div>
                  </div>
                </div>
              )}
            </div>

            <Link href="/blog">
              <div className={`px-5 py-2 rounded-full text-sm font-semibold transition-all cursor-pointer ${
                isActive('/blog') 
                  ? 'text-white bg-white/10' 
                  : 'text-neutral-300 hover:text-white hover:bg-white/5'
              }`}>
                심리 칼럼
              </div>
            </Link>
            <Link href="/about">
              <div className={`px-5 py-2 rounded-full text-sm font-semibold transition-all cursor-pointer ${
                isActive('/about') 
                  ? 'text-white bg-white/10' 
                  : 'text-neutral-300 hover:text-white hover:bg-white/5'
              }`}>
                소개
              </div>
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(true)}
              className="text-white hover:bg-white/10 rounded-full"
            >
              <svg className="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Overlay */}
      {isOpen && (
        <div className="md:hidden fixed inset-0 z-[100]">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200" 
            onClick={() => setIsOpen(false)}
          ></div>
          
          {/* Drawer Sheet */}
          <div className="absolute right-0 top-0 bottom-0 w-[300px] bg-neutral-900 border-l border-white/10 shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
            <div className="p-4 border-b border-white/5 flex justify-between items-center">
              <span className="text-lg font-bold text-white">메뉴</span>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsOpen(false)}
                className="text-neutral-400 hover:text-white hover:bg-white/5 rounded-full"
              >
                <svg className="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </Button>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-6">
              {/* Mobile Mega Menu Representation */}
              <div>
                <h3 className="text-xs font-bold text-neutral-500 uppercase tracking-widest mb-3 px-2">전체 테스트</h3>
                <div className="space-y-6">
                  {Object.keys(categoryNames).map(catKey => {
                    const tests = groupedByCategory[catKey];
                    if (!tests || tests.length === 0) return null;
                    return (
                      <div key={catKey}>
                        <h4 className="text-sm font-semibold text-purple-400 mb-2 px-2">{categoryNames[catKey]}</h4>
                        <div className="space-y-1">
                          {tests.map((test) => (
                            <Link key={test.href} href={test.href}>
                              <div 
                                className={`flex items-center space-x-3 px-3 py-2.5 text-base font-medium transition-all rounded-xl cursor-pointer ${
                                  isActive(test.href) 
                                    ? 'text-white bg-white/10' 
                                    : 'text-neutral-300 hover:text-white hover:bg-white/5'
                                }`}
                                onClick={() => setIsOpen(false)}
                              >
                                <span className="text-xl bg-white/5 w-8 h-8 rounded-lg flex items-center justify-center">{test.emoji}</span>
                                <span className="flex-1 line-clamp-1">{test.title}</span>
                              </div>
                            </Link>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="border-t border-white/5 pt-4">
                <Link href="/blog">
                  <div 
                    className={`block px-4 py-3 text-base font-medium transition-all rounded-xl cursor-pointer ${
                      isActive('/blog') 
                        ? 'text-white bg-white/10' 
                        : 'text-neutral-300 hover:text-white hover:bg-white/5'
                    }`}
                    onClick={() => setIsOpen(false)}
                  >
                    📝 심리 칼럼
                  </div>
                </Link>
                <Link href="/about">
                  <div 
                    className={`block px-4 py-3 text-base font-medium transition-all rounded-xl cursor-pointer ${
                      isActive('/about') 
                        ? 'text-white bg-white/10' 
                        : 'text-neutral-300 hover:text-white hover:bg-white/5'
                    }`}
                    onClick={() => setIsOpen(false)}
                  >
                    ✨ 서비스 소개
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}