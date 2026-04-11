import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
}

export default function SEO({ 
  title = "MBTI 성격유형 검사 | 재미있는 심리테스트 모음",
  description = "MBTI 16가지 성격유형 검사, 호르몬 테스트, 연애 호구력 진단 등 당신의 숨겨진 진짜 모습을 찾아주는 가장 정확하고 재미있는 심리테스트 플랫폼입니다.",
  keywords = "MBTI, 성격유형검사, 심리테스트, 성격테스트, 무료검사, 연애궁합, 심리분석, 성격분석, 심리진단",
  image = "https://mbtifinder.com/og-image.jpg",
  url = "https://mbtifinder.com"
}: SEOProps) {
  const fullTitle = title.includes("MBTI") ? title : `${title} | 재미있는 무료 심리테스트`;
  
  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      
      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={url} />
      <meta property="twitter:title" content={fullTitle} />
      <meta property="twitter:description" content={description} />
      <meta property="twitter:image" content={image} />
      
      {/* Canonical URL */}
      <link rel="canonical" href={url} />
    </Helmet>
  );
}
