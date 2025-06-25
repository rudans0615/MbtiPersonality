import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import AdSense from "@/components/AdSense";

export default function Landing() {
  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 gradient-bg opacity-5"></div>
      
      {/* Navigation */}
      <nav className="relative z-10 flex justify-between items-center p-6 lg:px-12">
        <div className="text-2xl font-bold text-neutral-800">
          <span className="text-primary">MBTI</span> 검사
        </div>
        <div className="hidden md:flex space-x-6">
          <Link href="/about" className="text-neutral-600 hover:text-primary transition-colors">소개</Link>
          <Link href="/about" className="text-neutral-600 hover:text-primary transition-colors">유형별 설명</Link>
          <Link href="/blog" className="text-neutral-600 hover:text-primary transition-colors">블로그</Link>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-[80vh] px-6 text-center">
        <div className="animate-fade-in">
          <h1 className="text-4xl md:text-6xl font-bold text-neutral-800 mb-6 leading-tight">
            나의 진짜 성격을<br/>
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              발견해보세요
            </span>
          </h1>
          <p className="text-xl text-neutral-600 mb-8 max-w-2xl mx-auto leading-relaxed">
            과학적으로 검증된 MBTI 성격유형 검사로 당신의 숨겨진 성격과 잠재력을 발견하고, 
            더 나은 인간관계와 진로를 찾아보세요.
          </p>
          
          {/* Features */}
          <div className="grid md:grid-cols-3 gap-6 mb-10 max-w-3xl mx-auto">
            <Card className="bg-white/80 backdrop-blur-sm rounded-2xl card-hover">
              <CardContent className="p-6">
                <div className="text-3xl mb-4">🧠</div>
                <h3 className="font-semibold text-lg mb-2">과학적 분석</h3>
                <p className="text-neutral-600 text-sm">심리학 이론에 기반한 정확한 성격 분석</p>
              </CardContent>
            </Card>
            <Card className="bg-white/80 backdrop-blur-sm rounded-2xl card-hover">
              <CardContent className="p-6">
                <div className="text-3xl mb-4">📊</div>
                <h3 className="font-semibold text-lg mb-2">상세한 결과</h3>
                <p className="text-neutral-600 text-sm">16가지 성격유형별 맞춤 설명 제공</p>
              </CardContent>
            </Card>
            <Card className="bg-white/80 backdrop-blur-sm rounded-2xl card-hover">
              <CardContent className="p-6">
                <div className="text-3xl mb-4">💡</div>
                <h3 className="font-semibold text-lg mb-2">실용적 조언</h3>
                <p className="text-neutral-600 text-sm">일상과 진로에 활용할 수 있는 팁</p>
              </CardContent>
            </Card>
          </div>

          <Link href="/test">
            <Button className="bg-gradient-to-r from-primary to-secondary text-white px-12 py-4 rounded-2xl font-semibold text-lg hover:shadow-2xl hover:scale-105 transition-all duration-300 animate-bounce-in">
              <i className="fas fa-play mr-2"></i>
              검사 시작하기
            </Button>
          </Link>
          
          <p className="text-neutral-500 text-sm mt-4">약 10분 소요 • 무료 검사</p>
        </div>
      </div>

      {/* AdSense Banner - Top */}
      <AdSense 
        adSlot="1234567890"
        style={{ display: 'inline-block', width: '728px', height: '90px' }}
        className="py-8"
      />
    </div>
  );
}
