import { MBTIType } from "@/data/mbtiTypes";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface ResultCardProps {
  mbtiType: MBTIType;
  onRestart: () => void;
  onShare: (platform: string) => void;
}

export default function ResultCard({ mbtiType, onRestart, onShare }: ResultCardProps) {
  return (
    <Card className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 -mt-16 relative z-10 animate-slide-up">
      <CardContent className="p-0">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-r from-primary to-secondary rounded-full text-white text-3xl font-bold mb-6">
            <span>{mbtiType.code}</span>
          </div>
          <h2 className="text-3xl font-bold text-neutral-800 mb-2">
            {mbtiType.title}
          </h2>
          <p className="text-lg text-neutral-600">
            {mbtiType.subtitle}
          </p>
        </div>

        <div className="prose prose-lg max-w-none text-neutral-700 mb-8">
          <p>{mbtiType.description}</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-8">
          <div className="bg-accent/10 rounded-2xl p-6">
            <h3 className="text-xl font-semibold text-accent mb-4 flex items-center">
              <i className="fas fa-star mr-2"></i>강점
            </h3>
            <ul className="space-y-2">
              {mbtiType.strengths.map((strength, index) => (
                <li key={index} className="flex items-start">
                  <span className="text-accent mr-2">•</span>
                  {strength}
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-red-50 rounded-2xl p-6">
            <h3 className="text-xl font-semibold text-red-600 mb-4 flex items-center">
              <i className="fas fa-exclamation-triangle mr-2"></i>주의점
            </h3>
            <ul className="space-y-2">
              {mbtiType.weaknesses.map((weakness, index) => (
                <li key={index} className="flex items-start">
                  <span className="text-red-600 mr-2">•</span>
                  {weakness}
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
            {mbtiType.compatible.map((type, index) => (
              <div key={index} className="bg-white rounded-xl p-4 text-center">
                <div className="font-bold text-primary mb-1">{type}</div>
                <div className="text-sm text-neutral-600">궁합 유형</div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-secondary/10 rounded-2xl p-6 mb-8">
          <h3 className="text-xl font-semibold text-secondary mb-4 flex items-center">
            <i className="fas fa-briefcase mr-2"></i>추천 직업
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {mbtiType.careers.map((career, index) => (
              <span key={index} className="bg-white px-4 py-2 rounded-lg text-center">
                {career}
              </span>
            ))}
          </div>
        </div>

        <div className="text-center space-y-4">
          <h3 className="text-xl font-semibold text-neutral-800">결과 공유하기</h3>
          <div className="flex justify-center space-x-4 flex-wrap gap-2">
            <Button
              onClick={() => onShare('facebook')}
              className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition-colors"
            >
              <i className="fab fa-facebook-f mr-2"></i>페이스북
            </Button>
            <Button
              onClick={() => onShare('twitter')}
              className="bg-sky-500 text-white px-6 py-3 rounded-xl hover:bg-sky-600 transition-colors"
            >
              <i className="fab fa-twitter mr-2"></i>트위터
            </Button>
            <Button
              onClick={() => onShare('copy')}
              className="bg-neutral-600 text-white px-6 py-3 rounded-xl hover:bg-neutral-700 transition-colors"
            >
              <i className="fas fa-link mr-2"></i>링크 복사
            </Button>
          </div>
          <Button
            onClick={onRestart}
            className="block mx-auto mt-6 bg-gradient-to-r from-primary to-secondary text-white px-8 py-3 rounded-xl hover:shadow-lg transition-all"
          >
            <i className="fas fa-redo mr-2"></i>다시 검사하기
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
