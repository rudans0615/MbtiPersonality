import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Toaster } from '@/components/ui/toaster';
import { getTests } from '@/lib/queries';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  metadataBase: new URL('https://mbtifinder.com'),
  title: {
    default: 'MBTI 성격유형 검사 | 심리테스트 모음 - MBTI Finder',
    template: '%s | MBTI Finder',
  },
  description: '대한민국 1위 심리테스트 플랫폼. MBTI 성격유형 검사, 호르몬 진단, 연애 심리테스트 등 재미있고 정확한 무료 심리테스트를 지금 바로 해보세요!',
  keywords: ['MBTI', '성격유형 검사', '심리테스트', 'MBTI 궁합', '연애 테스트', '성격 테스트', 'INFP', 'ENFJ', '호르몬 성격', '테토 에겐'],
  authors: [{ name: 'MBTI Finder' }],
  openGraph: {
    type: 'website',
    locale: 'ko_KR',
    siteName: 'MBTI Finder',
    title: 'MBTI 성격유형 검사 | 심리테스트 모음',
    description: '대한민국 1위 심리테스트 플랫폼. 다양한 심리, 연애, 성향 테스트를 무료로 즐겨보세요.',
  },
  twitter: {
    card: 'summary_large_image',
  },
  alternates: {
    canonical: '/',
  },
  verification: {
    google: '', // Google Search Console 인증 코드가 있으면 여기에 입력
  },
};

const jsonLdWebSite = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'MBTI Finder',
  url: 'https://mbtifinder.com',
  description: '대한민국 1위 심리테스트 플랫폼. MBTI, 연애, 성향 테스트를 무료로 즐겨보세요.',
  inLanguage: 'ko',
  potentialAction: {
    '@type': 'SearchAction',
    target: 'https://mbtifinder.com/blog?q={search_term_string}',
    'query-input': 'required name=search_term_string',
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const allTests = await getTests().catch(() => []);
  const availableTests = allTests.filter((t: any) => t.is_available !== false);

  return (
    <html lang="ko">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdWebSite) }}
        />
        <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1176633482077881" crossOrigin="anonymous"></script>
      </head>
      <body className={inter.className}>
        <div className="min-h-screen bg-[#F8F9FB] flex flex-col">
          <Navigation availableTests={availableTests} />
          <main className="flex-grow">
            {children}
          </main>
          <Footer availableTests={availableTests} />
        </div>
        <Toaster />
      </body>
    </html>
  );
}
