"use client";
import { useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Download, Check } from 'lucide-react';

interface ResultImageCardProps {
  testTitle: string;
  resultTitle: string;
  resultEmoji: string;
  resultSubtitle?: string;
  characteristics?: string[];
  siteUrl?: string;
}

export function ResultImageCard({ testTitle, resultTitle, resultEmoji, resultSubtitle, characteristics, siteUrl = 'mbtifinder.com' }: ResultImageCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [saved, setSaved] = useState(false);

  const handleSave = async () => {
    if (typeof window !== "undefined" && (window as any).gtag) {
      (window as any).gtag('event', 'share_clicked', {
        platform: 'image_download',
        test_path: window.location.pathname
      });
    }

    if (!cardRef.current) return;

    try {
      // Dynamic import to avoid SSR issues
      const html2canvas = (await import('html2canvas')).default;
      const canvas = await html2canvas(cardRef.current, {
        scale: 2,
        backgroundColor: null,
        useCORS: true,
      });

      const link = document.createElement('a');
      link.download = `${testTitle}-결과.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();

      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (err) {
      console.error('Image save failed:', err);
    }
  };

  return (
    <div className="mb-8">
      {/* Saveable Card */}
      <div
        ref={cardRef}
        className="bg-gradient-to-br from-pink-400 via-purple-400 to-indigo-500 rounded-[2rem] p-8 text-white relative overflow-hidden"
        style={{ minHeight: '320px' }}
      >
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-4 right-4 text-[120px] leading-none">✨</div>
          <div className="absolute bottom-4 left-4 text-[80px] leading-none">🔮</div>
        </div>

        <div className="relative z-10 text-center">
          <p className="text-sm font-semibold opacity-80 tracking-widest uppercase mb-6">
            {testTitle}
          </p>

          <div className="text-6xl mb-4">{resultEmoji}</div>

          <h2 className="text-3xl font-extrabold mb-2 tracking-tight drop-shadow-md">
            {resultTitle}
          </h2>

          {resultSubtitle && (
            <p className="text-lg opacity-90 font-medium mb-4">{resultSubtitle}</p>
          )}

          {characteristics && characteristics.length > 0 && (
            <div className="flex flex-wrap justify-center gap-2 mt-4">
              {characteristics.slice(0, 4).map((trait, i) => (
                <span key={i} className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium">
                  #{trait}
                </span>
              ))}
            </div>
          )}

          <div className="mt-8 pt-4 border-t border-white/20">
            <p className="text-xs opacity-60 font-medium tracking-wider">{siteUrl}</p>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <Button
        onClick={handleSave}
        className={`w-full mt-4 py-6 rounded-2xl text-[1rem] font-bold transition-all ${
          saved
            ? 'bg-green-500 hover:bg-green-600 text-white'
            : 'bg-white border-2 border-pink-200 text-pink-500 hover:bg-pink-50 hover:border-pink-300'
        }`}
        variant="outline"
      >
        {saved ? (
          <><Check size={20} className="mr-2" /> 저장 완료!</>
        ) : (
          <><Download size={20} className="mr-2" /> 내 결과 이미지 저장하기 📸</>
        )}
      </Button>
    </div>
  );
}
