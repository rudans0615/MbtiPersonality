import React, { useEffect } from 'react';

/**
 * 구글 애드센스 광고를 표시하기 위한 공통 컴포넌트입니다.
 * props로 adClient(클라이언트 ID)와 adSlot(광고 슬롯 ID)을 받습니다.
 */
interface AdSenseBlockProps {
  adClient?: string;
  adSlot: string;
  adFormat?: string;
  fullWidthResponsive?: boolean;
  className?: string;
}

export const AdSenseBlock: React.FC<AdSenseBlockProps> = ({
  adClient = 'ca-pub-1176633482077881', // index.html에 있는 pub ID를 기본값으로 사용
  adSlot,
  adFormat = 'auto',
  fullWidthResponsive = true,
  className = '',
}) => {
  useEffect(() => {
    try {
      // @ts-ignore
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (err) {
      console.error('AdSense error:', err);
    }
  }, []);

  // 개발 환경에서는 광고 영역을 시각적으로 표시하기 위한 더미 스타일 제공
  const isDev = import.meta.env.DEV;

  if (isDev) {
    return (
      <div 
        className={`flex items-center justify-center bg-gray-100 border-2 border-dashed border-gray-300 text-gray-400 p-4 my-4 rounded-md min-h-[100px] ${className}`}
      >
        <span>[개발 환경] 구글 애드센스 광고 영역 ({adSlot})</span>
      </div>
    );
  }

  return (
    <div className={`my-4 ${className} text-center overflow-hidden flex justify-center`}>
      <ins
        className="adsbygoogle"
        style={{ display: 'block', width: '100%' }}
        data-ad-client={adClient}
        data-ad-slot={adSlot}
        data-ad-format={adFormat}
        data-full-width-responsive={fullWidthResponsive ? 'true' : 'false'}
      ></ins>
    </div>
  );
};
