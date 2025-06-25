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
  useEffect(() => {
    try {
      if (typeof window !== 'undefined' && window.adsbygoogle) {
        window.adsbygoogle.push({});
      }
    } catch (error) {
      console.error('AdSense error:', error);
    }
  }, []);

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
