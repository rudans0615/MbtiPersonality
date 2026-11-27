import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { fileURLToPath } from 'url';
import { createClient } from '@supabase/supabase-js';
import { generateText } from './llmClient.js';

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

  // dateRanges가 2개일 때 GA4 dateRange dimension("date_range_0" / "date_range_1")을 명시적으로 매칭
  const overviewRows = overviewRes.rows || [];
  const currentRow =
    overviewRows.find((r) => r.dimensionValues?.[0]?.value === 'date_range_0') || overviewRows[0];
  const previousRow =
    overviewRows.find((r) => r.dimensionValues?.[0]?.value === 'date_range_1') ||
    (overviewRows.length > 1 ? overviewRows[1] : null);
  const current = parseMetricRow(currentRow);
  const previous = parseMetricRow(previousRow);

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
        const { text: insight } = await generateText(openai, {
          role: 'analyst',
          temperature: 0.6,
          system:
            '너는 한국어 웹 수익화(애드센스·바이럴 테스트) 데이터 분석가야. 제공된 GA4 수치를 보고 이번 주 실행할 핵심 액션 2가지만 각 1문장으로 간결하게 제안해.',
          user: JSON.stringify({ current, topPages: topPages.slice(0, 5), channels, events }),
        });
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

async function fetchPromoPageContext(targetPath) {
  const clean = (targetPath || '').replace(/\/$/, '');
  const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const supabase = url && key ? createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } }) : null;

  // 1. 블로그 칼럼 (/blog/226) — 실제 소제목·핵심 내용·연계 테스트 링크까지 추출
  const blogMatch = clean.match(/^\/blog\/(\d+)$/);
  if (blogMatch && supabase) {
    const { data: post } = await supabase
      .from('blog_posts')
      .select('id, title, excerpt, category, tags, content')
      .eq('id', Number(blogMatch[1]))
      .maybeSingle();
    if (post) {
      const html = post.content || '';
      const h2s = [...html.matchAll(/<h2\b[^>]*>([\s\S]*?)<\/h2>/gi)]
        .map((m) => m[1].replace(/<[^>]*>/g, '').trim())
        .filter(Boolean);
      const plainExcerpt = html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 700);
      const linkedTests = [...html.matchAll(/href=["'](\/[a-zA-Z0-9-]+)["']/g)]
        .map((m) => m[1])
        .filter((h) => !['/blog', '/about', '/contact'].includes(h));
      return {
        kind: 'blog',
        title: post.title,
        summary: post.excerpt || '',
        detail: `카테고리: ${post.category || '심리 칼럼'} | 소제목: ${h2s.join(' / ')}`,
        realHooks: `본문 핵심 발췌:\n${plainExcerpt}${
          linkedTests.length ? `\n연계 테스트 경로: https://mbtifinder.com${linkedTests[0]}` : ''
        }`,
        ogImageUrl: `https://mbtifinder.com/api/og?${new URLSearchParams({
          mode: 'result',
          testTitle: `MBTI Finder · ${post.category || '심리 칼럼'}`,
          resultTitle: post.title,
          subtitle: (post.excerpt || '성격분석 심리 칼럼 읽어보기').slice(0, 48),
        }).toString()}`,
      };
    }
  }

  // 2. DB 기반 개별 심리테스트 (/[testId]) — 실제 문항 3개 + 선택지 + 결과 유형명 조회!
  const seg = clean.split('/').filter(Boolean)[0];
  if (seg && !['blog', 'type', 'compatibility', 'test', 'teto-egen', 'drunk'].includes(seg) && supabase) {
    const [{ data: test }, { data: results }, { data: questions }] = await Promise.all([
      supabase.from('tests').select('id, title, subtitle, description, category, question_count').eq('id', seg).maybeSingle(),
      supabase.from('result_types').select('title, emoji, subtitle').eq('test_id', seg),
      supabase
        .from('questions')
        .select('question_number, text, options(option_index, text)')
        .eq('test_id', seg)
        .order('question_number')
        .limit(4),
    ]);
    if (test) {
      const rTitles = (results || []).map((r) => `${r.emoji || ''} ${r.title}`.trim()).slice(0, 8).join(', ');
      const sampleQs = (questions || [])
        .map((q) => {
          const opts = (q.options || [])
            .sort((a, b) => a.option_index - b.option_index)
            .slice(0, 4)
            .map((o, idx) => `  ${idx + 1}) ${o.text}`)
            .join('\n');
          return `Q${q.question_number}. ${q.text}\n${opts}`;
        })
        .join('\n\n');
      return {
        kind: 'test',
        title: test.title,
        summary: test.subtitle || test.description || '',
        detail: `총 ${test.question_count || 12}문항 | 결과 유형: ${rTitles}`,
        realHooks: sampleQs ? `실제 테스트 문항 샘플 (그대로 논쟁/썰 소재로 활용):\n${sampleQs}` : '',
        ogImageUrl: `https://mbtifinder.com/api/og?testId=${encodeURIComponent(seg)}`,
      };
    }
  }

  // 3. 커스텀 핵심 페이지 (/test, /teto-egen, /drunk, /compatibility, /type/...)
  if (clean === '/teto-egen') {
    return {
      kind: 'test',
      title: '테토 vs 에겐 호르몬 성향 진단',
      summary: '테토남·테토녀·에겐남·에겐녀 중 나의 호르몬 비율(%)과 찰떡 연애 궁합 확인',
      detail: '총 21문항 | 결과 유형: 테토남, 테토녀, 에겐남, 에겐녀',
      realHooks:
        '실제 문항 예시:\n- 갈등 상황: 1) 정면으로 맞서서 해결한다 vs 2) 갈등을 피하고 시간이 해결해주길 기다린다\n- 연애에서 중요한 것: 열정적이고 강렬한 사랑 vs 따뜻하고 안정적인 관계',
      ogImageUrl: buildOgPreviewForPath(clean),
    };
  }
  if (clean === '/drunk') {
    return {
      kind: 'test',
      title: '나 지금 취했나? 음주 자가진단 테스트',
      summary: '술자리 10문항으로 현재 상태(완전 멀쩡 / 귀엽게 올라옴 / 헛소리 시작 / 내일 후회 확정) 확인',
      detail: '총 10문항 | 결과 유형: 완전 멀쩡한 상태, 술기운 살짝 올라옴, 헛소리 시작됨(주의), 기억이 없다면 이미 늦었다',
      realHooks:
        '실제 문항 예시:\n- ex한테 연락하고 싶은 충동은? 1) 전혀 없음 vs 2) 지금 당장 하고 싶음 vs 3) 이미 보냈고 후회 중\n- 지금 거울 속 내 모습은? 1) 평소와 똑같음 vs 2) 완전 여신/남신 등극',
      ogImageUrl: buildOgPreviewForPath(clean),
    };
  }
  if (clean === '/test') {
    return {
      kind: 'mbti',
      title: '무료 64문항 정밀 MBTI 성격유형 검사',
      summary: '4축 밸런스 차트(E/I·S/N·T/F·J/P)와 친구 2인 궁합 초대장까지 한 번에 확인',
      detail: '64문항 균형 설계, 경계선 성향 감지, 결과 이미지 저장, 친구 궁합 비교',
      realHooks:
        '포인트: 매번 검사할 때마다 I랑 E 왔다 갔다 하는 사람들 위해 4축 백분율(%)과 경계선 여부까지 바로 보여줌 + 친구한테 링크 보내면 2인 궁합 점수 자동 계산',
      ogImageUrl: buildOgPreviewForPath(clean),
    };
  }
  return {
    kind: 'page',
    title: clean.startsWith('/compatibility') ? 'MBTI 16×16 궁합표 & 2인 궁합 분석' : clean,
    summary: '연애·직장·갈등 대화법까지 한 번에 보는 MBTI 16×16 궁합표와 16유형 백과',
    detail: `대상 경로: ${clean}`,
    realHooks: '포인트: 연인·썸남썸녀·직장 동료 MBTI 조합 점수랑 갈등 시 먹히는 현실 대화법 비교',
    ogImageUrl: buildOgPreviewForPath(clean),
  };
}

/**
 * 상위 1% 스레드 그로스 공식 기반 스레드(A/B/C) + 릴스 15초 홍보 패키지 생성
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
    const pageCtx = await fetchPromoPageContext(targetPath);

    await bot.sendMessage(
      chatId,
      `🧵 [${pageCtx.title || targetPath}] 상위 1% 스레드·릴스 홍보글을 작성 중입니다... (${sourceLabel})`
    );

    const { text: copy, model } = await generateText(openai, {
      role: 'promo',
      temperature: 0.92,
      system: `너는 한국 스레드(Threads)에서 댓글 200개+, 링크 클릭률 5%+ 뽑는 상위 1% 바이럴 그로스 마케터야.
AI가 남의 글 요약하듯 쓰는 정보 계정이 아니라, **실제 한국 2030 사람이 방금 겪은 썰·논쟁 질문·결과 인증을 툭 던지는 말투**로 작성해.
제공되지 않은 기능이나 거짓 수치는 절대 지어내지 마라.

[상위 1% 스레드 4대 법칙 — 하나라도 어기면 실패]
1. **본문에 결론 다 풀지 마라 (Open Loop 필수):** 본문에서 답을 다 주면 좋아요만 누르고 링크 안 누른다. 궁금증·비교 욕구·결과 호기심을 남긴 채 끝내라.
2. **구체적 문항·장면 1개를 통째로 던져라:** 추상적 요약 대신 제공된 [실제 문항/핵심 발췌] 중 가장 찔리는 상황 1개를 그대로 꺼내서 써라.
3. **댓글 강제 장치:** 뻔한 "손 들어봐", "공감하면 좋아요" 금지! "너네는 1번임 2번임?", "나만 이럼?", "반박 받음"처럼 댓글 안 달고 못 배기게 만들어라.
4. **AI·광고 봇 금지어 전면 차단:** "~한 적 있지?", "~를 알아보자!", "~는 필수야", "궁금하지?", "'이것' 때문에", "지금 바로 확인해봐!", "#해시태그 도배", 이모지 남발(버전당 0~1개), 상담소 교과서 대사 절대 금지!

[출력 형식 — 그대로 복붙 가능하게]
🔥 [포맷 1 — A vs B 밸런스 논쟁형 (댓글 폭발 → 알고리즘 1위)]
(실제 문항/상황 1개를 1) vs 2) 선택지로 던지고 "너네는 1번임 2번임?"으로 끝내는 4~5줄)
↳ 첫 댓글: (본인 선택 + 결과/글이 궁금해지는 Open Loop 1줄) ${fullUrl}

🔥 [포맷 2 — 1인칭 결과 인증·썰형 (링크 클릭률 1위)]
("방금 이거 해보다가 N번 문항에서 멈춤..." / "읽다가 뼈 맞고 3분 멍 때림..." 식의 1인칭 실화 톤 4~5줄, 구체적 결과명이나 장면 언급)
↳ 첫 댓글: (자기 결과/해당 여부 비교하게 만드는 1줄) ${fullUrl}

🔥 [포맷 3 — 약한 도발·불편한 진실형 (반박+공감 동시 폭발)]
(흔한 착각을 한 문장으로 깨는 묵직한 관찰 3~4줄, 해결책은 숨기고 첫 댓글로 유도)
↳ 첫 댓글: (구체적 해결 포인트 1줄 예고) ${fullUrl}

🎬 [릴스/쇼츠 15초 자막 대본]
- 0~3초(시선 고정): (스크롤 멈추는 1줄)
- 3~10초(현실 팩폭): (구체적 장면 2줄)
- 10~15초(행동 유도): (자연스러운 1줄)`,
      user: `실제 페이지 제목: ${pageCtx.title}\n핵심 요약: ${pageCtx.summary}\n세부 정보: ${pageCtx.detail}\n${
        pageCtx.realHooks ? `\n${pageCtx.realHooks}\n` : ''
      }링크: ${fullUrl}`,
    });

    await bot.sendMessage(
      chatId,
      `🚀 [상위 1% 스레드 · 릴스 홍보 패키지] (${model})\n📌 대상: ${pageCtx.title}\n🔗 링크: ${fullUrl}\n📊 기준: ${sourceLabel}\n\n${copy}\n\n🖼️ 첨부용 카드 이미지:\n${pageCtx.ogImageUrl}`
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
