import crypto from 'crypto';

function generateCoupangAuth(method, uri, accessKey, secretKey) {
  const datetime = new Date().toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
  const [path, query = ''] = uri.split('?');
  const message = datetime + method + path + query;
  const signature = crypto.createHmac('sha256', secretKey).update(message).digest('hex');
  return `CEA algorithm=HmacSHA256, access-key=${accessKey}, signed-date=${datetime}, signature=${signature}`;
}

export default async function handler(req, res) {
  const keyword = req.query.keyword;
  if (!keyword) return res.status(400).json({ error: 'keyword is required' });

  const accessKey = process.env.COUPANG_ACCESS_KEY;
  const secretKey = process.env.COUPANG_SECRET_KEY;
  const trackingId = process.env.COUPANG_TRACKING_ID || 'AF4535044';

  if (!accessKey || !secretKey) {
    return res.status(500).json({ error: 'Coupang API keys not configured' });
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
    
    // CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate');
    
    res.status(200).json(data);
  } catch (error) {
    console.error('Coupang API error:', error);
    res.status(500).json({ error: error.message });
  }
}
