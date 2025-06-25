import { useEffect, useState } from "react";
import { useLocation, Link } from "wouter";
import { mbtiTypes } from "@/data/mbtiTypes";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import AdSense from "@/components/AdSense";

export default function TypeDetail() {
  const [location] = useLocation();
  const [mbtiType, setMbtiType] = useState<string | null>(null);

  useEffect(() => {
    // Extract type from URL path like /type/INTJ
    const match = location.match(/\/type\/([A-Z]{4})/);
    if (match && match[1] && mbtiTypes[match[1]]) {
      setMbtiType(match[1]);
    }
  }, [location]);

  if (!mbtiType || !mbtiTypes[mbtiType]) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-neutral-800 mb-4">유형을 찾을 수 없습니다</h1>
          <Link href="/">
            <Button className="bg-primary text-white">홈으로 돌아가기</Button>
          </Link>
        </div>
      </div>
    );
  }

  const typeData = mbtiTypes[mbtiType];

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Header */}
      <div className="gradient-bg text-white py-16">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <div className="animate-bounce-in">
            <div className="text-6xl mb-6">{typeData.emoji}</div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">{typeData.code}</h1>
            <h2 className="text-2xl md:text-3xl font-semibold mb-2">{typeData.title}</h2>
            <p className="text-xl opacity-90">{typeData.subtitle}</p>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Navigation */}
        <div className="mb-8">
          <Link href="/results">
            <Button variant="ghost" className="text-neutral-600 hover:text-primary">
              <i className="fas fa-arrow-left mr-2"></i>결과로 돌아가기
            </Button>
          </Link>
        </div>

        {/* Main Content */}
        <Card className="bg-white rounded-3xl shadow-lg p-8 mb-8">
          <CardContent className="p-0">
            <div className="prose prose-lg max-w-none text-neutral-700 mb-8">
              <h3 className="text-2xl font-bold text-neutral-800 mb-4">성격 특징</h3>
              <p className="text-lg leading-relaxed">{typeData.description}</p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 mb-8">
              <div className="bg-accent/10 rounded-2xl p-6">
                <h3 className="text-xl font-semibold text-accent mb-4 flex items-center">
                  <i className="fas fa-star mr-2"></i>주요 강점
                </h3>
                <ul className="space-y-3">
                  {typeData.strengths.map((strength, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-accent mr-2 mt-1">•</span>
                      <span className="text-lg">{strength}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-red-50 rounded-2xl p-6">
                <h3 className="text-xl font-semibold text-red-600 mb-4 flex items-center">
                  <i className="fas fa-exclamation-triangle mr-2"></i>개발 영역
                </h3>
                <ul className="space-y-3">
                  {typeData.weaknesses.map((weakness, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-red-600 mr-2 mt-1">•</span>
                      <span className="text-lg">{weakness}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="bg-neutral-50 rounded-2xl p-6 mb-8">
              <h3 className="text-xl font-semibold text-neutral-800 mb-4 flex items-center">
                <i className="fas fa-heart mr-2 text-pink-500"></i>궁합이 좋은 유형
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {typeData.compatible.map((type, index) => (
                  <Link key={index} href={`/type/${type}`}>
                    <div className="bg-white rounded-xl p-4 text-center hover:shadow-md transition-shadow cursor-pointer">
                      <div className="font-bold text-primary mb-1">{type}</div>
                      <div className="text-sm text-neutral-600">{mbtiTypes[type]?.title}</div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            <div className="bg-secondary/10 rounded-2xl p-6 mb-8">
              <h3 className="text-xl font-semibold text-secondary mb-4 flex items-center">
                <i className="fas fa-briefcase mr-2"></i>추천 직업 분야
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {typeData.careers.map((career, index) => (
                  <span key={index} className="bg-white px-4 py-3 rounded-lg text-center font-medium">
                    {career}
                  </span>
                ))}
              </div>
            </div>

            {/* AdSense */}
            <AdSense 
              adSlot="1234567893"
              className="my-8"
            />

            <div className="text-center">
              <h3 className="text-xl font-semibold text-neutral-800 mb-4">다른 성격유형도 알아보세요</h3>
              <div className="flex justify-center space-x-4 flex-wrap gap-2">
                <Link href="/">
                  <Button className="bg-gradient-to-r from-primary to-secondary text-white px-6 py-3 rounded-xl hover:shadow-lg transition-all">
                    <i className="fas fa-home mr-2"></i>홈으로
                  </Button>
                </Link>
                <Link href="/test">
                  <Button className="bg-neutral-600 text-white px-6 py-3 rounded-xl hover:bg-neutral-700 transition-colors">
                    <i className="fas fa-redo mr-2"></i>다시 검사하기
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}