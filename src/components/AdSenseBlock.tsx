"use client";
import React, { useEffect } from 'react';
import { DUMMY_AD_SLOTS, IS_ADSENSE_REVIEW_MODE } from '@/lib/siteConfig';

interface AdSenseBlockProps {
  adClient?: string;
  adSlot?: string;
  adFormat?: string;
  fullWidthResponsive?: boolean;
  className?: string;
}

export const AdSenseBlock: React.FC<AdSenseBlockProps> = ({
  adClient = 'ca-pub-1176633482077881',
  adSlot = '',
  adFormat = 'auto',
  fullWidthResponsive = true,
  className = '',
}) => {
  const normalizedSlot = (adSlot || '').trim();
  const isDisabled =
    IS_ADSENSE_REVIEW_MODE ||
    !normalizedSlot ||
    DUMMY_AD_SLOTS.has(normalizedSlot) ||
    !/^\d{8,12}$/.test(normalizedSlot);

  useEffect(() => {
    if (isDisabled || process.env.NODE_ENV !== 'production') return;
    try {
      // @ts-ignore
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (err) {
      console.error('AdSense error:', err);
    }
  }, [isDisabled]);

  // 심사 모드이거나 유효한 실제 슬롯 ID가 없으면 빈 광고 컨테이너를 렌더링하지 않음
  if (isDisabled) {
    return null;
  }

  if (process.env.NODE_ENV !== 'production') {
    return (
      <div
        className={`flex items-center justify-center bg-gray-100 border-2 border-dashed border-gray-300 text-gray-400 p-4 my-4 rounded-md min-h-[100px] ${className}`}
      >
        <span>[개발 환경] 구글 애드센스 광고 영역 ({normalizedSlot})</span>
      </div>
    );
  }

  return (
    <div className={`my-4 ${className} text-center overflow-hidden flex justify-center`}>
      <ins
        className="adsbygoogle"
        style={{ display: 'block', width: '100%' }}
        data-ad-client={adClient}
        data-ad-slot={normalizedSlot}
        data-ad-format={adFormat}
        data-full-width-responsive={fullWidthResponsive ? 'true' : 'false'}
      ></ins>
    </div>
  );
};
