import { useEffect } from 'react';

interface AdSenseProps {
  adSlot: string;
  adFormat?: string;
  style?: React.CSSProperties;
  className?: string;
}

declare global {
  interface Window {
    adsbygoogle: any[];
  }
}

export default function AdSense({ adSlot, adFormat = "auto", style, className }: AdSenseProps) {
  const isProduction = window.location.hostname === 'mbtifinder.com' || 
                      (window.location.hostname.endsWith('.replit.app') && !window.location.hostname.includes('00-'));

  // Validate slot ID (should be 10 digits for AdSense)
  const isValidSlot = /^\d{10}$/.test(adSlot);

  useEffect(() => {
    if (!isProduction || !isValidSlot) return;

    // Wait for DOM to be ready and ad container to be sized
    const timer = setTimeout(() => {
      try {
        if (typeof window !== 'undefined' && window.adsbygoogle) {
          window.adsbygoogle.push({});
        }
      } catch (error) {
        // Handle AdSense errors gracefully
        console.warn('AdSense initialization failed for slot:', adSlot);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [isProduction, isValidSlot, adSlot]);

  // Show placeholder in development or for invalid slots
  if (!isProduction || !isValidSlot) {
    return (
      <div className={`flex justify-center py-4 ${className}`}>
        <div className="bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg p-4 text-center text-gray-500 text-sm w-full max-w-[728px] h-[250px] flex flex-col justify-center">
          <div className="text-lg">📊 AdSense 광고 영역</div>
          <div className="text-xs mt-2">
            {!isProduction ? '개발 환경에서는 표시되지 않습니다' : 'AdSense 슬롯 설정이 필요합니다'}
          </div>
          <div className="text-xs text-gray-400 mt-1">Slot: {adSlot}</div>
          {!isValidSlot && (
            <div className="text-xs text-red-400 mt-1">유효하지 않은 슬롯 ID (10자리 숫자 필요)</div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={`flex justify-center py-4 ${className}`}>
      <div className="w-full max-w-[728px]">
        <ins
          className="adsbygoogle"
          style={{ 
            display: 'block',
            width: '728px',
            height: '250px',
            margin: '0 auto',
            ...style 
          }}
          data-ad-client="ca-pub-1176633482077881"
          data-ad-slot={adSlot}
          data-ad-format={adFormat || 'rectangle'}
          data-full-width-responsive="false"
        />
      </div>
    </div>
  );
}
