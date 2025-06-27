import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, Home, Brain, Heart, Zap, BookOpen, Info } from "lucide-react";

const navigationItems = [
  { href: "/", label: "홈", icon: Home },
  { href: "/mbti", label: "MBTI 검사", icon: Brain },
  { href: "/love", label: "연애유형 검사", icon: Heart },
  { href: "/career", label: "직업적성 검사", icon: Zap },
  { href: "/blog", label: "블로그", icon: BookOpen },
  { href: "/about", label: "소개", icon: Info },
];

export default function Navigation() {
  const [location] = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const NavLinks = ({ onItemClick }: { onItemClick?: () => void }) => (
    <>
      {navigationItems.map((item) => {
        const Icon = item.icon;
        const isActive = location === item.href || 
          (item.href === "/mbti" && (location === "/test" || location === "/results"));
        
        return (
          <Link 
            key={item.href} 
            href={item.href}
          >
            <a 
              className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-all duration-200 ${
                isActive 
                  ? 'bg-primary text-white shadow-md' 
                  : 'text-neutral-600 hover:text-primary hover:bg-primary/10'
              }`}
              onClick={onItemClick}
            >
              <Icon size={18} />
              <span className="font-medium">{item.label}</span>
            </a>
          </Link>
        );
      })}
    </>
  );

  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-neutral-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/">
            <a className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
                <Brain className="text-white" size={18} />
              </div>
              <span className="text-xl font-bold text-neutral-800">
                심리테스트
              </span>
            </a>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            <NavLinks />
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm" className="p-2">
                  <Menu size={20} />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[280px] p-0">
                <div className="flex flex-col h-full">
                  {/* Mobile Logo */}
                  <div className="flex items-center space-x-3 p-6 border-b border-neutral-200">
                    <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
                      <Brain className="text-white" size={20} />
                    </div>
                    <span className="text-xl font-bold text-neutral-800">
                      심리테스트
                    </span>
                  </div>
                  
                  {/* Mobile Navigation */}
                  <div className="flex-1 p-6 space-y-2">
                    <NavLinks onItemClick={() => setIsOpen(false)} />
                  </div>
                  
                  {/* Mobile Footer */}
                  <div className="p-6 border-t border-neutral-200 text-center">
                    <p className="text-sm text-neutral-500">
                      당신의 성격을 발견하세요
                    </p>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
}