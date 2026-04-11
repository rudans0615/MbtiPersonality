import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import crypto from "crypto";

function generateCoupangAuth(method: string, uri: string, accessKey: string, secretKey: string) {
  const datetime = new Date().toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
  const [path, query = ''] = uri.split('?');
  const message = datetime + method + path + query;
  const signature = crypto.createHmac('sha256', secretKey).update(message).digest('hex');
  return `CEA algorithm=HmacSHA256, access-key=${accessKey}, signed-date=${datetime}, signature=${signature}`;
}

export async function registerRoutes(app: Express): Promise<Server> {
  
  // 쿠팡 파트너스 상품 검색 API
  app.get('/api/affiliates/coupang', async (req, res) => {
    const keyword = req.query.keyword as string;
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
      res.json(data);
    } catch (error: any) {
      console.error('Coupang API error:', error);
      res.status(500).json({ error: error.message });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
