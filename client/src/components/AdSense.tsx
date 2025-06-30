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
    // Add a delay to ensure the ad container is properly sized
    const timer = setTimeout(() => {
      try {
        if (typeof window !== 'undefined' && window.adsbygoogle) {
          window.adsbygoogle.push({});
        }
      } catch (error) {
        // Silently handle AdSense errors to prevent console spam
        console.warn('AdSense initialization failed:', error.message);
      }
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={`flex justify-center py-4 ${className}`}>
      <div className="bg-white rounded-xl shadow-sm p-4 min-h-[250px] w-full max-w-[728px]">
        <ins
          className="adsbygoogle"
          style={{ 
            display: 'block',
            width: '100%',
            height: '250px',
            ...style 
          }}
          data-ad-client="ca-pub-1176633482077881"
          data-ad-slot={adSlot}
          data-ad-format={adFormat}
          data-full-width-responsive="true"
        />
      </div>
    </div>
  );
}
