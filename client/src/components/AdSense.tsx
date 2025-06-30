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
  const isDev = import.meta.env.DEV || window.location.hostname.includes('replit.dev');

  useEffect(() => {
    // Skip AdSense in development environment
    if (isDev) {
      return;
    }
    
    try {
      if (typeof window !== 'undefined' && window.adsbygoogle) {
        window.adsbygoogle.push({});
      }
    } catch (error) {
      // Silently handle AdSense errors in development
      if (!isDev) {
        console.error('AdSense error:', error);
      }
    }
  }, [isDev]);

  // Show placeholder in development
  if (isDev) {
    return (
      <div className={`flex justify-center py-4 ${className}`}>
        <div className="bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg p-4 text-center text-gray-500 text-sm">
          <div>📊 AdSense 광고 영역</div>
          <div className="text-xs mt-1">프로덕션에서만 표시됩니다</div>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex justify-center py-4 ${className}`}>
      <div className="bg-white rounded-xl shadow-sm p-4">
        <ins
          className="adsbygoogle"
          style={style || { display: 'block' }}
          data-ad-client="ca-pub-1176633482077881"
          data-ad-slot={adSlot}
          data-ad-format={adFormat}
        />
      </div>
    </div>
  );
}
