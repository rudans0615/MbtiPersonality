import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

function generateCoupangAuth(method: string, uri: string, accessKey: string, secretKey: string) {
  const datetime = new Date().toISOString().substring(2).replace(/[-:]/g, '').split('.')[0] + 'Z';
  const [path, query = ''] = uri.split('?');
  const message = datetime + method + path + query;
  const signature = crypto.createHmac('sha256', secretKey).update(message).digest('hex');
  return `CEA algorithm=HmacSHA256, access-key=${accessKey}, signed-date=${datetime}, signature=${signature}`;
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const keyword = searchParams.get('keyword');

  if (!keyword) {
    return NextResponse.json({ error: 'keyword is required' }, { status: 400 });
  }

  const accessKey = process.env.COUPANG_ACCESS_KEY;
  const secretKey = process.env.COUPANG_SECRET_KEY;
  const trackingId = process.env.COUPANG_TRACKING_ID || 'AF4535044';

  if (!accessKey || !secretKey) {
    return NextResponse.json({ error: 'Coupang API keys not configured' }, { status: 500 });
  }

  try {
    const uri = `/v2/providers/affiliate_open_api/apis/openapi/v1/products/search?keyword=${encodeURIComponent(keyword)}&limit=4&subId=${trackingId}`;
    const authorization = generateCoupangAuth('GET', uri, accessKey, secretKey);

    const response = await fetch(`https://api-gateway.coupang.com${uri}`, {
      method: 'GET',
      headers: {
        'Authorization': authorization,
        'Content-Type': 'application/json'
      }
    });

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error: any) {
    console.error('Coupang API error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
