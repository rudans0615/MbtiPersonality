import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';
import { getTestById } from '@/lib/queries';
import { mbtiTypes } from '@/lib/customTests/mbtiTypes';

export const dynamic = 'force-dynamic';

async function loadKoreanFont(text: string): Promise<ArrayBuffer | null> {
  try {
    const cleanText = Array.from(new Set(text.replace(/\s+/g, ''))).join('').slice(0, 180);
    if (!cleanText) return null;
    const cssRes = await fetch(
      `https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@700&text=${encodeURIComponent(cleanText)}`,
      {
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Macintosh; U; Intel Mac OS X 10_6_8; de-at) AppleWebKit/533.21.1 (KHTML, like Gecko) Version/5.0.5 Safari/533.21.1',
        },
      }
    );
    if (!cssRes.ok) return null;
    const css = await cssRes.text();
    const match = css.match(/src:\s*url\((https:[^)]+)\)\s*format\(['"](?:truetype|opentype)['"]\)/);
    if (!match) return null;
    const fontRes = await fetch(match[1]);
    if (!fontRes.ok) return null;
    return await fontRes.arrayBuffer();
  } catch {
    return null;
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const mode = searchParams.get('mode') || 'test';
    const layoutType = searchParams.get('type') || 'share';

    let width = 1200;
    let height = 630;
    if (layoutType === 'story') {
      width = 1080;
      height = 1920;
    } else if (layoutType === 'feed') {
      width = 1080;
      height = 1080;
    }

    // 1. 2인 궁합 공유 카드
    if (mode === 'compatibility') {
      const a = (searchParams.get('a') || 'ENFJ').toUpperCase().slice(0, 4);
      const b = (searchParams.get('b') || 'INFP').toUpperCase().slice(0, 4);
      const score = (searchParams.get('score') || '95').slice(0, 3);
      const tier = (searchParams.get('tier') || '최고의 궁합').slice(0, 24);
      const typeA = mbtiTypes[a];
      const typeB = mbtiTypes[b];
      const scoreText = `${score}점`;
      const footerText = '연애 · 직장 · 갈등 대화법 분석 | MBTIFINDER.COM';
      const allText = `${a}${b}${typeA?.title || ''}${typeB?.title || ''}${tier}${scoreText}${footerText}x`;
      const fontData = await loadKoreanFont(allText);

      return new ImageResponse(
        (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              width: '100%',
              height: '100%',
              background: 'linear-gradient(135deg, #ffe4e6 0%, #f3e8ff 50%, #e0e7ff 100%)',
              fontFamily: fontData ? '"Noto Sans KR", sans-serif' : 'sans-serif',
              padding: '56px',
            }}
          >
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'rgba(255,255,255,0.94)',
                borderRadius: 48,
                padding: '48px 64px',
                width: '100%',
                height: '100%',
                border: '4px solid rgba(255,255,255,0.8)',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  background: '#ffe4e6',
                  color: '#be123c',
                  fontSize: 28,
                  fontWeight: 700,
                  padding: '10px 28px',
                  borderRadius: 999,
                  marginBottom: 24,
                }}
              >
                {tier}
              </div>

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 36,
                  marginBottom: 20,
                }}
              >
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <div style={{ display: 'flex', fontSize: 64, fontWeight: 700, color: '#111827' }}>{a}</div>
                  <div style={{ display: 'flex', fontSize: 26, fontWeight: 700, color: '#6b7280', marginTop: 6 }}>
                    {typeA?.title || a}
                  </div>
                </div>
                <div style={{ display: 'flex', fontSize: 52, fontWeight: 700, color: '#ec4899' }}>x</div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <div style={{ display: 'flex', fontSize: 64, fontWeight: 700, color: '#111827' }}>{b}</div>
                  <div style={{ display: 'flex', fontSize: 26, fontWeight: 700, color: '#6b7280', marginTop: 6 }}>
                    {typeB?.title || b}
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', fontSize: 78, fontWeight: 700, color: '#db2777', marginBottom: 16 }}>
                {scoreText}
              </div>
              <div style={{ display: 'flex', fontSize: 24, fontWeight: 700, color: '#4b5563' }}>
                {footerText}
              </div>
            </div>
          </div>
        ),
        {
          width: 1200,
          height: 630,
          fonts: fontData ? [{ name: 'Noto Sans KR', data: fontData, weight: 700, style: 'normal' }] : [],
        }
      );
    }

    // 2. 친구 2인 궁합 초대 카드
    if (mode === 'invite') {
      const from = (searchParams.get('from') || 'INFP').toUpperCase().slice(0, 4);
      const name = (searchParams.get('name') || '').trim().slice(0, 12);
      const fromType = mbtiTypes[from];
      const senderLabel = name ? `${name}(${from})` : `${from}(${fromType?.title || 'MBTI'})`;
      const badgeLine = '2인 MBTI 궁합 초대장';
      const mainLine = `${senderLabel}님과 나의 궁합은 몇 점일까?`;
      const subLine = '지금 64문항 MBTI 검사하고 2인 궁합 리포트를 바로 확인하세요!';
      const ctaLine = '내 MBTI 검사하고 궁합 확인하기';
      const fontData = await loadKoreanFont(`${badgeLine}${mainLine}${subLine}${ctaLine}`);

      return new ImageResponse(
        (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              width: '100%',
              height: '100%',
              background: 'linear-gradient(135deg, #fbc2eb 0%, #a6c1ee 100%)',
              fontFamily: fontData ? '"Noto Sans KR", sans-serif' : 'sans-serif',
              padding: '56px',
            }}
          >
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'rgba(255,255,255,0.94)',
                borderRadius: 48,
                padding: '52px 68px',
                width: '100%',
                height: '100%',
                textAlign: 'center',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  background: '#fdf2f8',
                  color: '#db2777',
                  fontSize: 28,
                  fontWeight: 700,
                  padding: '10px 28px',
                  borderRadius: 999,
                  marginBottom: 28,
                  border: '2px solid #fbcfe8',
                }}
              >
                {badgeLine}
              </div>
              <div
                style={{
                  display: 'flex',
                  fontSize: 52,
                  fontWeight: 700,
                  color: '#111827',
                  lineHeight: 1.3,
                  marginBottom: 22,
                }}
              >
                {mainLine}
              </div>
              <div style={{ display: 'flex', fontSize: 26, fontWeight: 700, color: '#4b5563', marginBottom: 36 }}>
                {subLine}
              </div>
              <div
                style={{
                  display: 'flex',
                  background: '#111827',
                  color: '#ffffff',
                  fontSize: 28,
                  fontWeight: 700,
                  padding: '18px 48px',
                  borderRadius: 999,
                }}
              >
                {ctaLine}
              </div>
            </div>
          </div>
        ),
        {
          width: 1200,
          height: 630,
          fonts: fontData ? [{ name: 'Noto Sans KR', data: fontData, weight: 700, style: 'normal' }] : [],
        }
      );
    }

    // 3. 개별 테스트 결과 공유 카드
    if (mode === 'result') {
      const testTitle = (searchParams.get('testTitle') || '심리테스트 결과').slice(0, 40);
      const resultTitle = (searchParams.get('resultTitle') || '나의 성격유형').slice(0, 40);
      const subtitle = (searchParams.get('subtitle') || '너는 어떤 유형이 나올까?').slice(0, 50);
      const brand = 'MBTIFINDER.COM';
      const fontData = await loadKoreanFont(`${testTitle}${resultTitle}${subtitle}${brand}`);

      return new ImageResponse(
        (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              width: '100%',
              height: '100%',
              background: 'linear-gradient(135deg, #fde2e4 0%, #e2ece9 50%, #dfe7fd 100%)',
              fontFamily: fontData ? '"Noto Sans KR", sans-serif' : 'sans-serif',
              padding: '56px',
            }}
          >
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'rgba(255,255,255,0.94)',
                borderRadius: 48,
                padding: '52px 68px',
                width: '100%',
                height: '100%',
                textAlign: 'center',
              }}
            >
              <div style={{ display: 'flex', fontSize: 28, fontWeight: 700, color: '#db2777', marginBottom: 20 }}>
                {testTitle}
              </div>
              <div style={{ display: 'flex', fontSize: 60, fontWeight: 700, color: '#111827', lineHeight: 1.25, marginBottom: 24 }}>
                {resultTitle}
              </div>
              <div style={{ display: 'flex', fontSize: 28, fontWeight: 700, color: '#4b5563', marginBottom: 36 }}>
                {subtitle}
              </div>
              <div style={{ display: 'flex', fontSize: 24, fontWeight: 700, color: '#6b7280', letterSpacing: 2 }}>
                {brand}
              </div>
            </div>
          </div>
        ),
        {
          width: 1200,
          height: 630,
          fonts: fontData ? [{ name: 'Noto Sans KR', data: fontData, weight: 700, style: 'normal' }] : [],
        }
      );
    }

    // 4. 기본 테스트 카드 (?testId=...)
    const testId = searchParams.get('testId');
    if (!testId) {
      return new ImageResponse(
        (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              width: '100%',
              height: '100%',
              background: 'linear-gradient(135deg, #fbc2eb 0%, #a6c1ee 100%)',
              fontSize: 56,
              fontWeight: 700,
              color: '#111827',
            }}
          >
            MBTI Finder
          </div>
        ),
        { width, height }
      );
    }

    const testInfo = await getTestById(testId);
    if (!testInfo?.is_available) {
      return new ImageResponse(
        (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%', backgroundColor: '#fff', fontSize: 40 }}>
            Test Not Found
          </div>
        ),
        { width: 1200, height: 630 }
      );
    }

    const sub = testInfo.subtitle || '나만의 특별한 성향 알아보기';
    const brand = 'MBTIFINDER.COM';
    const fontData = await loadKoreanFont(`${testInfo.title}${sub}${brand}`);

    return new ImageResponse(
      (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            height: '100%',
            background: 'linear-gradient(135deg, #fbc2eb 0%, #a6c1ee 100%)',
            fontFamily: fontData ? '"Noto Sans KR", sans-serif' : 'sans-serif',
            padding: layoutType === 'story' ? '120px 80px' : '64px',
            textAlign: 'center',
          }}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'rgba(255, 255, 255, 0.92)',
              borderRadius: layoutType === 'story' ? 80 : 48,
              padding: layoutType === 'story' ? '100px 60px' : '56px 72px',
              width: '100%',
              maxWidth: 960,
              border: '4px solid rgba(255,255,255,0.6)',
            }}
          >
            <div style={{ display: 'flex', color: '#ec4899', fontSize: layoutType === 'story' ? 36 : 28, fontWeight: 700, marginBottom: 20 }}>
              {sub}
            </div>
            <div style={{ display: 'flex', fontSize: layoutType === 'story' ? 72 : 60, fontWeight: 700, color: '#111827', lineHeight: 1.25 }}>
              {testInfo.title}
            </div>
            <div style={{ display: 'flex', marginTop: 40, fontSize: 24, fontWeight: 700, color: '#6b7280', letterSpacing: 2 }}>
              {brand}
            </div>
          </div>
        </div>
      ),
      {
        width,
        height,
        fonts: fontData ? [{ name: 'Noto Sans KR', data: fontData, weight: 700, style: 'normal' }] : [],
      }
    );
  } catch {
    return new Response('Failed to generate the image', { status: 500 });
  }
}
