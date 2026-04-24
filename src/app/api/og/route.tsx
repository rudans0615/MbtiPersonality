import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';
import { testTypes } from '@/data/testTypes';

export const runtime = 'edge';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const testId = searchParams.get('testId');
    const type = searchParams.get('type') || 'share'; // 'story' | 'feed' | 'share'

    const testInfo = testTypes.find(t => t.id === testId);
    
    if (!testInfo) {
      return new ImageResponse(
        (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%', backgroundColor: '#fff', fontSize: 40 }}>
            Test Not Found
          </div>
        ),
        { width: 1200, height: 630 }
      );
    }

    let width = 1200;
    let height = 630;
    let layout = 'share'; // default
    
    if (type === 'story') {
      width = 1080;
      height = 1920;
      layout = 'story';
    } else if (type === 'feed') {
      width = 1080;
      height = 1080;
      layout = 'feed';
    }

    const gradient = "linear-gradient(135deg, #fbc2eb 0%, #a6c1ee 100%)";

    return new ImageResponse(
      (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: layout === 'story' ? 'center' : 'center',
            width: '100%',
            height: '100%',
            background: gradient,
            fontFamily: 'sans-serif',
            padding: layout === 'story' ? '120px 80px' : '80px',
            textAlign: 'center',
          }}
        >
          {/* Background Decorators */}
          <div style={{ position: 'absolute', top: -100, right: -100, width: 400, height: 400, background: 'rgba(255,255,255,0.2)', borderRadius: '50%', filter: 'blur(40px)' }} />
          <div style={{ position: 'absolute', bottom: -50, left: -100, width: 300, height: 300, background: 'rgba(255,200,255,0.3)', borderRadius: '50%', filter: 'blur(30px)' }} />

          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'rgba(255, 255, 255, 0.85)',
              borderRadius: layout === 'story' ? 80 : 60,
              padding: layout === 'story' ? '100px 60px' : '60px 80px',
              boxShadow: '0 30px 60px rgba(0,0,0,0.1)',
              width: '100%',
              maxWidth: 900,
              border: '4px solid rgba(255,255,255,0.5)'
            }}
          >
            <span style={{ fontSize: layout === 'story' ? 180 : 140, marginBottom: layout === 'story' ? 60 : 40, filter: 'drop-shadow(0 10px 20px rgba(0,0,0,0.1))' }}>
              {testInfo.emoji || '✨'}
            </span>
            
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <span style={{ 
                color: '#ec4899', 
                fontSize: layout === 'story' ? 36 : 30, 
                fontWeight: 800, 
                marginBottom: 20, 
                letterSpacing: 2,
                textTransform: 'uppercase'
              }}>
                {testInfo.subtitle || '나만의 특별한 성향 알아보기'}
              </span>
              
              <h1 style={{ 
                fontSize: layout === 'story' ? 85 : 75, 
                fontWeight: 900, 
                color: '#1f2937', 
                margin: 0, 
                lineHeight: 1.2,
                letterSpacing: -2,
                wordBreak: 'keep-all'
              }}>
                {testInfo.title}
              </h1>
              
              {layout !== 'share' && (
                <div style={{ 
                  marginTop: layout === 'story' ? 80 : 50, 
                  background: '#1f2937', 
                  color: 'white', 
                  padding: '24px 60px', 
                  borderRadius: 40, 
                  fontSize: 32, 
                  fontWeight: 'bold',
                  display: 'flex',
                  alignItems: 'center',
                  boxShadow: '0 10px 25px rgba(0,0,0,0.2)'
                }}>
                  테스트 하러가기 👉
                </div>
              )}
            </div>
          </div>
          
          <div style={{ 
            position: 'absolute', 
            bottom: layout === 'story' ? 100 : 50, 
            fontSize: layout === 'story' ? 32 : 24, 
            color: 'rgba(255,255,255,0.9)', 
            fontWeight: 800,
            letterSpacing: 2,
            textShadow: '0 2px 10px rgba(0,0,0,0.1)'
          }}>
            MBTIFINDER.COM
          </div>
        </div>
      ),
      {
        width,
        height,
      }
    );
  } catch (e: any) {
    return new Response(`Failed to generate the image`, {
      status: 500,
    });
  }
}
