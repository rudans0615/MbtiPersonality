import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { fileURLToPath } from 'url';

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const DEFAULT_KEY_PATH = path.join(scriptDir, 'ga4-service-account.json');
const DEFAULT_PROPERTY_ID = '494902370';

function base64url(input) {
  const buf = Buffer.isBuffer(input) ? input : Buffer.from(input);
  return buf.toString('base64').replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
}

function getCredentials() {
  const keyPath = process.env.GA4_CREDENTIALS_PATH || DEFAULT_KEY_PATH;
  if (!fs.existsSync(keyPath)) {
    throw new Error(`GA4 서비스 계정 키 파일을 찾을 수 없습니다: ${keyPath}`);
  }
  const json = JSON.parse(fs.readFileSync(keyPath, 'utf8'));
  if (!json.client_email || !json.private_key) {
    throw new Error('GA4 서비스 계정 JSON에 client_email 또는 private_key가 없습니다.');
  }
  return json;
}

async function getAccessToken() {
  const creds = getCredentials();
  const now = Math.floor(Date.now() / 1000);
  const header = { alg: 'RS256', typ: 'JWT' };
  const claim = {
    iss: creds.client_email,
    scope: 'https://www.googleapis.com/auth/analytics.readonly',
    aud: 'https://oauth2.googleapis.com/token',
    iat: now,
    exp: now + 3600,
  };

  const unsigned = `${base64url(JSON.stringify(header))}.${base64url(JSON.stringify(claim))}`;
  const signer = crypto.createSign('RSA-SHA256');
  signer.update(unsigned);
  signer.end();
  const signature = base64url(signer.sign(creds.private_key));
  const jwt = `${unsigned}.${signature}`;

  const res = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion: jwt,
    }),
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Google OAuth 토큰 발급 실패 (${res.status}): ${errText.slice(0, 200)}`);
  }
  const data = await res.json();
  return data.access_token;
}

async function runGA4Report(propertyId, accessToken, body) {
  const res = await fetch(
    `https://analyticsdata.googleapis.com/v1beta/properties/${propertyId}:runReport`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    }
  );
  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`GA4 runReport 실패 (${res.status}): ${errText.slice(0, 250)}`);
  }
  return res.json();
}

export async function fetchGA4Summary(days = 7) {
  const propertyId = process.env.GA4_PROPERTY_ID || DEFAULT_PROPERTY_ID;
  const accessToken = await getAccessToken();

  const currentRange = { startDate: `${days}daysAgo`, endDate: 'today' };
  const prevRange = { startDate: `${days * 2}daysAgo`, endDate: `${days + 1}daysAgo` };

  const [overviewRes, pagesRes, channelsRes, eventsRes] = await Promise.all([
    runGA4Report(propertyId, accessToken, {
      dateRanges: [currentRange, prevRange],
      metrics: [
        { name: 'activeUsers' },
        { name: 'sessions' },
        { name: 'screenPageViews' },
        { name: 'averageSessionDuration' },
      ],
    }),
    runGA4Report(propertyId, accessToken, {
      dateRanges: [currentRange],
      dimensions: [{ name: 'pagePath' }],
      metrics: [{ name: 'screenPageViews' }, { name: 'activeUsers' }],
      orderBys: [{ metric: { metricName: 'screenPageViews' }, desc: true }],
      limit: 8,
    }),
    runGA4Report(propertyId, accessToken, {
      dateRanges: [currentRange],
      dimensions: [{ name: 'sessionSourceMedium' }],
      metrics: [{ name: 'sessions' }, { name: 'activeUsers' }],
      orderBys: [{ metric: { metricName: 'sessions' }, desc: true }],
      limit: 6,
    }),
    runGA4Report(propertyId, accessToken, {
      dateRanges: [currentRange],
      dimensions: [{ name: 'eventName' }],
      metrics: [{ name: 'eventCount' }],
      dimensionFilter: {
        filter: {
          fieldName: 'eventName',
          inListFilter: {
            values: ['test_started', 'test_completed', 'share_clicked', 'invite_link_copied'],
          },
        },
      },
    }),
  ]);

  const parseMetricRow = (row) => {
    const vals = row?.metricValues || [];
    return {
      users: Number(vals[0]?.value || 0),
      sessions: Number(vals[1]?.value || 0),
      views: Number(vals[2]?.value || 0),
      avgDurationSec: Math.round(Number(vals[3]?.value || 0)),
    };
  };

  // dateRanges가 2개일 때 GA4는 dateRange dimension으로 두 행을 반환
  const current = parseMetricRow(overviewRes.rows?.[0]);
  const previous = parseMetricRow(overviewRes.rows?.[1]);

  const topPages = (pagesRes.rows || []).map((r) => ({
    path: r.dimensionValues?.[0]?.value || '/',
    views: Number(r.metricValues?.[0]?.value || 0),
    users: Number(r.metricValues?.[1]?.value || 0),
  }));

  const channels = (channelsRes.rows || []).map((r) => ({
    source: r.dimensionValues?.[0]?.value || '(direct)',
    sessions: Number(r.metricValues?.[0]?.value || 0),
    users: Number(r.metricValues?.[1]?.value || 0),
  }));

  const events = {
    test_started: 0,
    test_completed: 0,
    share_clicked: 0,
    invite_link_copied: 0,
  };
  for (const r of eventsRes.rows || []) {
    const name = r.dimensionValues?.[0]?.value;
    if (name && Object.prototype.hasOwnProperty.call(events, name)) {
      events[name] = Number(r.metricValues?.[0]?.value || 0);
    }
  }

  return {
    propertyId,
    days,
    current,
    previous,
    topPages,
    channels,
    events,
  };
}

function formatDiff(curr, prev) {
  if (!prev) return curr > 0 ? '(신규)' : '';
  const pct = Math.round(((curr - prev) / prev) * 100);
  return pct >= 0 ? `(+${pct}%)` : `(${pct}%)`;
}

export async function sendGA4Report(bot, openai, chatId, days = 7) {
  try {
    await bot.sendMessage(chatId, `📊 최근 ${days}일 GA4 성과 데이터를 집계 중입니다...`);
    const data = await fetchGA4Summary(days);
    const { current, previous, topPages, channels, events } = data;

    const pvPerSession = current.sessions > 0 ? (current.views / current.sessions).toFixed(2) : '0.00';
    const completionRate =
      events.test_started > 0 ? `${Math.round((events.test_completed / events.test_started) * 100)}%` : '-';

    const pagesLines =
      topPages.length > 0
        ? topPages.map((p, i) => `  ${i + 1}. ${p.path} — ${p.views.toLocaleString()} PV (${p.users}명)`).join('\n')
        : '  (아직 집계된 페이지뷰 없음)';

    const channelLines =
      channels.length > 0
        ? channels.map((c) => `  • ${c.source}: ${c.sessions}세션 (${c.users}명)`).join('\n')
        : '  (아직 유입 채널 데이터 없음)';

    const reportLines = [
      `📈 [MBTI Finder GA4 리포트 — 최근 ${days}일]`,
      ``,
      `👥 방문자: ${current.users.toLocaleString()}명 ${formatDiff(current.users, previous.users)}`,
      `📄 페이지뷰: ${current.views.toLocaleString()} PV ${formatDiff(current.views, previous.views)}`,
      `🔄 세션당 PV: ${pvPerSession} | 평균 체류: ${current.avgDurationSec}초`,
      ``,
      `🎯 테스트·바이럴 전환 이벤트:`,
      `  • 검사 시작: ${events.test_started}회 | 완료: ${events.test_completed}회 (완료율 ${completionRate})`,
      `  • 결과 공유: ${events.share_clicked}회 | 2인 초대 복사: ${events.invite_link_copied}회`,
      ``,
      `🔥 인기 페이지 TOP ${topPages.length}:`,
      pagesLines,
      ``,
      `🌐 주요 유입 경로:`,
      channelLines,
    ];

    // 데이터가 10 PV 이상 쌓였을 때 AI 액션 제안 2줄 추가
    if (openai && current.views >= 10) {
      try {
        const aiRes = await openai.chat.completions.create({
          model: 'gpt-4o-mini',
          temperature: 0.6,
          messages: [
            {
              role: 'system',
              content:
                '너는 한국어 웹 수익화(애드센스·바이럴 테스트) 데이터 분석가야. 제공된 GA4 수치를 보고 이번 주 실행할 핵심 액션 2가지만 각 1문장으로 간결하게 제안해.',
            },
            {
              role: 'user',
              content: JSON.stringify({ current, topPages: topPages.slice(0, 5), channels, events }),
            },
          ],
        });
        const insight = aiRes.choices[0]?.message?.content?.trim();
        if (insight) {
          reportLines.push('', '💡 이번 주 추천 액션:', insight);
        }
      } catch {
        // AI 요약 실패 시 숫자 리포트만 전송
      }
    }

    await bot.sendMessage(chatId, reportLines.join('\n'), {
      reply_markup: {
        inline_keyboard: [
          [{ text: '✍️ 인기 페이지 기반 브릿지 칼럼 초안 만들기', callback_data: 'ga4_draft_top' }],
          [{ text: '🧵 인기 페이지 스레드·릴스 홍보글 만들기', callback_data: 'ga4_promo_top' }],
        ],
      },
    });
  } catch (err) {
    console.error('sendGA4Report error:', err);
    await bot.sendMessage(chatId, `❌ GA4 리포트 조회 실패: ${err.message}`);
  }
}

function pickPromotablePath(topPages = []) {
  const ignored = new Set(['/', '/results', '/privacy', '/terms', '/contact', '/about']);
  for (const p of topPages) {
    const clean = (p.path || '').split('?')[0].replace(/\/$/, '') || '/';
    if (!ignored.has(clean) && !clean.endsWith('/results')) return clean;
  }
  return '/compatibility';
}

function buildOgPreviewForPath(targetPath) {
  const clean = (targetPath || '/compatibility').replace(/\/$/, '');
  if (clean.startsWith('/compatibility/')) {
    const pair = clean.split('/')[2] || 'ENFJ-INFP';
    const [a, b] = pair.split('-');
    if (a && b) {
      return `https://mbtifinder.com/api/og?mode=compatibility&a=${a}&b=${b}&score=95&tier=${encodeURIComponent('인기 궁합 분석')}`;
    }
  }
  if (clean === '/compatibility') {
    return `https://mbtifinder.com/api/og?mode=compatibility&a=ENFJ&b=INFP&score=95&tier=${encodeURIComponent('16x16 MBTI 궁합표')}`;
  }
  if (clean === '/test') {
    return `https://mbtifinder.com/api/og?mode=invite&from=INFP`;
  }
  if (clean.startsWith('/type/')) {
    const code = (clean.split('/')[2] || 'INFP').toUpperCase();
    return `https://mbtifinder.com/api/og?mode=result&testTitle=${encodeURIComponent('MBTI 16유형 백과')}&resultTitle=${encodeURIComponent(code + ' 완벽 분석')}&subtitle=${encodeURIComponent('연애 · 직장 · 궁합 총정리')}`;
  }
  const seg = clean.split('/').filter(Boolean)[0];
  if (seg && !['blog', 'type', 'compatibility'].includes(seg)) {
    return `https://mbtifinder.com/api/og?testId=${encodeURIComponent(seg)}`;
  }
  return `https://mbtifinder.com/api/og?mode=invite&from=ENFP`;
}

/**
 * 스레드(Threads) + 릴스/쇼츠 15초 홍보글 생성 (GA4 인기 페이지 또는 지정 경로 기반)
 */
export async function sendThreadsPromoForPath(bot, openai, chatId, customPath = null) {
  try {
    let targetPath = customPath ? customPath.trim() : null;
    let sourceLabel = '직접 지정';

    if (!targetPath) {
      const ga4 = await fetchGA4Summary(14).catch(() => null);
      targetPath = pickPromotablePath(ga4?.topPages || []);
      sourceLabel = ga4?.topPages?.length ? '최근 14일 GA4 인기 페이지 기반' : '대표 인기 기능 추천';
    }
    if (!targetPath.startsWith('/')) targetPath = `/${targetPath}`;

    const fullUrl = `https://mbtifinder.com${targetPath}`;
    const ogImageUrl = buildOgPreviewForPath(targetPath);

    await bot.sendMessage(chatId, `🧵 [${targetPath}] 스레드·릴스 홍보글을 작성 중입니다... (${sourceLabel})`);

    const res = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      temperature: 0.9,
      messages: [
        {
          role: 'system',
          content: `너는 스레드(Threads)와 인스타 릴스에서 심리테스트·MBTI 계정으로 월 100만 조회수를 뽑는 바이럴 마케터야.
광고 냄새 전혀 없이, 사람들이 댓글로 자기 MBTI나 친구를 태그하게 만드는 홍보 패키지를 작성해.

[출력 형식 — 그대로 복붙 가능하게]
🧵 [스레드 본문]
(3~5줄, 첫 줄 강력한 공감/팩폭 훅, 마지막 줄은 "링크는 첫 댓글에!" 또는 "너는 뭐 나왔어?" 참여 유도)

💬 [스레드 첫 댓글 복붙용]
(자연스러운 링크 안내 + URL)

🎬 [릴스/쇼츠 15초 자막 대본]
- 0~3초(훅): ...
- 3~10초(공감): ...
- 10~15초(행동유도): ...`,
        },
        {
          role: 'user',
          content: `홍보할 사이트 경로: ${targetPath}\n전체 링크: ${fullUrl}\n특징: 무료 심리테스트, 16유형 MBTI 백과, 16x16 궁합표, 친구와 2인 궁합 비교 기능 제공`,
        },
      ],
    });

    const copy = res.choices[0]?.message?.content?.trim() || '';
    await bot.sendMessage(
      chatId,
      `🚀 [스레드 · 릴스 홍보 패키지 완성]\n📌 대상: ${fullUrl}\n📊 기준: ${sourceLabel}\n\n${copy}\n\n🖼️ 첨부용 카드 이미지:\n${ogImageUrl}`
    );
  } catch (err) {
    console.error('sendThreadsPromoForPath error:', err);
    await bot.sendMessage(chatId, `❌ 홍보글 생성 실패: ${err.message}`);
  }
}

/**
 * GA4 리포트 하단 인라인 버튼 콜백 처리
 */
export async function handleGA4Callback(bot, openai, query, triggerDraftFn) {
  const data = query.data || '';
  if (!data.startsWith('ga4_')) return false;

  const chatId = query.message.chat.id;
  await bot.answerCallbackQuery(query.id).catch(() => {});

  if (data === 'ga4_draft_top') {
    await triggerDraftFn(bot, openai, chatId, null);
    return true;
  }
  if (data === 'ga4_promo_top') {
    await sendThreadsPromoForPath(bot, openai, chatId, null);
    return true;
  }
  return false;
}

/**
 * 매주 월(1)·수(3)·금(5) 오전 09:00 KST에 스레드·릴스 홍보 패키지 자동 배달
 */
export function scheduleThreadsPromo(bot, openai) {
  const PROMO_DAYS = new Set([1, 3, 5]);
  let lastSentKey = null;

  console.log('🧵 스레드·릴스 홍보 패키지 스케줄러 가동 완료 (매주 월·수·금 오전 09:00 KST)');

  setInterval(() => {
    const adminChatId = process.env.ADMIN_CHAT_ID;
    if (!adminChatId) return;

    const kst = new Date(Date.now() + 9 * 60 * 60 * 1000);
    const day = kst.getUTCDay();
    const hour = kst.getUTCHours();
    const minute = kst.getUTCMinutes();
    const dateKey = `${kst.getUTCFullYear()}-${String(kst.getUTCMonth() + 1).padStart(2, '0')}-${String(
      kst.getUTCDate()
    ).padStart(2, '0')}`;

    if (PROMO_DAYS.has(day) && hour === 9 && minute === 0 && lastSentKey !== dateKey) {
      lastSentKey = dateKey;
      console.log(`⏰ [KST ${dateKey} 09:00] 스레드·릴스 홍보 패키지 자동 배달 시작`);
      sendThreadsPromoForPath(bot, openai, adminChatId, null);
    }
  }, 30 * 1000);
}

/**
 * 매주 월요일(1) 오전 08:00 KST (UTC+9)에 주간 GA4 성과 브리핑 자동 발송
 */
export function scheduleWeeklyGA4Report(bot, openai) {
  let lastSentKey = null;

  console.log('📊 주간 GA4 성과 리포트 스케줄러 가동 완료 (매주 월요일 오전 08:00 KST)');

  setInterval(() => {
    const adminChatId = process.env.ADMIN_CHAT_ID;
    if (!adminChatId) return;

    const kst = new Date(Date.now() + 9 * 60 * 60 * 1000);
    const day = kst.getUTCDay(); // 1 = 월요일
    const hour = kst.getUTCHours();
    const minute = kst.getUTCMinutes();
    const dateKey = `${kst.getUTCFullYear()}-${String(kst.getUTCMonth() + 1).padStart(2, '0')}-${String(
      kst.getUTCDate()
    ).padStart(2, '0')}`;

    if (day === 1 && hour === 8 && minute === 0 && lastSentKey !== dateKey) {
      lastSentKey = dateKey;
      console.log(`⏰ [KST ${dateKey} 08:00] 주간 GA4 성과 브리핑 발송 시작`);
      sendGA4Report(bot, openai, adminChatId, 7);
    }
  }, 30 * 1000);
}
