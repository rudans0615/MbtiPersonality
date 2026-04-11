import { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ChevronDown } from 'lucide-react';

const testMenuItems = [
  {
    title: 'Discover Your Perfect MBTI Match!',
    href: '/mbtiMatchTest-test',
    emoji: '✨',
    description: 'Find out which MBTI personality type you are most compatible with. Answer these questions to see who resonates the most with your true self.'
  },
  {
    title: 'MBTI 성격유형 검사',
    href: '/test',
    emoji: '🧠',
    description: '16가지 성격유형 분석'
  },
  {
    title: '테토 vs 에겐 진단',
    href: '/teto-egen-test',
    emoji: '⚡',
    description: '호르몬 기반 4가지 유형'
  },
  {
    title: '나 술 취했나? 테스트',
    href: '/drunk-test',
    emoji: '🍻',
    description: '재미있는 취함 레벨 진단'
  }
];

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [location] = useLocation();

  const isActive = (path: string) => {
    if (path === '/' && location === '/') return true;
    if (path !== '/' && location.startsWith(path)) return true;
    return false;
  };

  const isTestActive = testMenuItems.some(item => isActive(item.href));

  return (
    <nav className="bg-white shadow-sm border-b border-neutral-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/">
              <div className="flex items-center space-x-2 cursor-pointer">
                <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                  </svg>
                </div>
                <span className="text-xl font-bold text-neutral-800">심리테스트</span>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              {/* Tests Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="ghost" 
                    className={`px-3 py-2 text-sm font-medium transition-colors flex items-center ${
                      isTestActive 
                        ? 'text-primary bg-primary/10' 
                        : 'text-neutral-700 hover:text-primary hover:bg-neutral-100'
                    }`}
                  >
                    테스트
                    <ChevronDown className="ml-1 h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-64">
                  {testMenuItems.map((item) => (
                    <DropdownMenuItem key={item.href} asChild>
                      <Link href={item.href}>
                        <div className="flex items-start space-x-3 p-3 hover:bg-neutral-50 rounded-md w-full cursor-pointer">
                          <span className="text-2xl">{item.emoji}</span>
                          <div>
                            <div className="font-medium text-neutral-900">{item.title}</div>
                            <div className="text-sm text-neutral-600">{item.description}</div>
                          </div>
                        </div>
                      </Link>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              <Link href="/blog">
                <div className={`px-3 py-2 rounded-md text-sm font-medium transition-colors cursor-pointer ${
                  isActive('/blog') 
                    ? 'text-primary bg-primary/10' 
                    : 'text-neutral-700 hover:text-primary hover:bg-neutral-100'
                }`}>
                  블로그
                </div>
              </Link>
              <Link href="/about">
                <div className={`px-3 py-2 rounded-md text-sm font-medium transition-colors cursor-pointer ${
                  isActive('/about') 
                    ? 'text-primary bg-primary/10' 
                    : 'text-neutral-700 hover:text-primary hover:bg-neutral-100'
                }`}>
                  소개
                </div>
              </Link>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(!isOpen)}
              className="text-neutral-700"
            >
              <svg
                className="h-6 w-6"
                stroke="currentColor"
                fill="none"
                viewBox="0 0 24 24"
              >
                {isOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              {/* Mobile Test Menu */}
              <div className="border-b border-neutral-200 pb-3 mb-3">
                <h3 className="px-3 py-2 text-sm font-semibold text-neutral-500 uppercase tracking-wider">테스트</h3>
                {testMenuItems.map((item) => (
                  <Link key={item.href} href={item.href}>
                    <div 
                      className={`flex items-center space-x-3 px-3 py-2 text-base font-medium transition-colors rounded-md cursor-pointer ${
                        isActive(item.href) 
                          ? 'text-primary bg-primary/10' 
                          : 'text-neutral-700 hover:text-primary hover:bg-neutral-100'
                      }`}
                      onClick={() => setIsOpen(false)}
                    >
                      <span className="text-xl">{item.emoji}</span>
                      <div>
                        <div className="font-medium">{item.title}</div>
                        <div className="text-xs text-neutral-600">{item.description}</div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>

              <Link href="/blog">
                <div 
                  className={`block px-3 py-2 text-base font-medium transition-colors rounded-md cursor-pointer ${
                    isActive('/blog') 
                      ? 'text-primary bg-primary/10' 
                      : 'text-neutral-700 hover:text-primary hover:bg-neutral-100'
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  블로그
                </div>
              </Link>
              <Link href="/about">
                <div 
                  className={`block px-3 py-2 text-base font-medium transition-colors rounded-md cursor-pointer ${
                    isActive('/about') 
                      ? 'text-primary bg-primary/10' 
                      : 'text-neutral-700 hover:text-primary hover:bg-neutral-100'
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  소개
                </div>
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}