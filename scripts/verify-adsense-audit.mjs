const BASE = process.env.AUDIT_BASE_URL || 'http://127.0.0.1:3099';
const PROD_ORIGIN = 'https://mbtifinder.com';

const failures = [];
const assert = (cond, msg) => {
  if (!cond) failures.push(msg);
};

async function fetchText(path, opts = {}) {
  const res = await fetch(`${BASE}${path}`, { redirect: 'manual', ...opts });
  const text = await res.text();
  return { status: res.status, headers: res.headers, text };
}

// 1. robots.txt & ads.txt
const robots = await fetchText('/robots.txt');
assert(robots.status === 200, `robots.txt status ${robots.status}`);
assert(!robots.text.includes('/privacy'), 'robots.txt still disallows /privacy');
assert(!robots.text.includes('/terms'), 'robots.txt still disallows /terms');

const adsTxt = await fetchText('/ads.txt');
assert(adsTxt.status === 200 && adsTxt.text.includes('pub-1176633482077881'), 'ads.txt missing or invalid');

// 2. Permanent redirects for legacy URLs
const redirects = [
  ['/teto-egen-test', '/teto-egen'],
  ['/drunk-test', '/drunk'],
  ['/travelMood2023-test', '/travelMood2023'],
  ['/socialMediaHabitTest2024-test', '/socialMediaHabitTest2024'],
  ['/shoppingMoodTest1234-test', '/shoppingMoodTest1234'],
];
for (const [src, dst] of redirects) {
  const r = await fetchText(src);
  const loc = r.headers.get('location') || '';
  assert((r.status === 308 || r.status === 301) && loc.endsWith(dst), `Redirect failed for ${src}: ${r.status} -> ${loc}`);
}

// 3. Soft 404 fix check
const missingBlog = await fetchText('/blog/999999');
assert(missingBlog.status === 404, `Missing blog /blog/999999 returned ${missingBlog.status} instead of 404`);
const missingType = await fetchText('/type/XXXX');
assert(missingType.status === 404, `Missing type /type/XXXX returned ${missingType.status} instead of 404`);

// 4. Full sitemap.xml crawl (every URL must return 200)
const sitemap = await fetchText('/sitemap.xml');
assert(sitemap.status === 200, `sitemap.xml status ${sitemap.status}`);
const locs = [...sitemap.text.matchAll(/<loc>(.*?)<\/loc>/g)].map((m) => m[1]);
assert(locs.length >= 50, `Expected >=50 URLs in sitemap, got ${locs.length}`);

let sitemap200 = 0;
for (const url of locs) {
  const path = url.replace(PROD_ORIGIN, '') || '/';
  const r = await fetchText(path);
  if (r.status === 200) {
    sitemap200++;
  } else {
    failures.push(`Sitemap URL ${path} returned ${r.status}`);
  }
}

// 5. Key page SEO, canonical, single nav/footer, zero dummy ads, zero typos
const canonicalChecks = [
  ['/', 'https://mbtifinder.com'],
  ['/about', 'https://mbtifinder.com/about'],
  ['/privacy', 'https://mbtifinder.com/privacy'],
  ['/terms', 'https://mbtifinder.com/terms'],
  ['/contact', 'https://mbtifinder.com/contact'],
  ['/test', 'https://mbtifinder.com/test'],
  ['/drunk', 'https://mbtifinder.com/drunk'],
  ['/teto-egen', 'https://mbtifinder.com/teto-egen'],
  ['/type', 'https://mbtifinder.com/type'],
  ['/type/INFP', 'https://mbtifinder.com/type/INFP'],
  ['/blog', 'https://mbtifinder.com/blog'],
  ['/blog/222', 'https://mbtifinder.com/blog/222'],
  ['/dopamine', 'https://mbtifinder.com/dopamine'],
];

for (const [path, expectedCanonical] of canonicalChecks) {
  const r = await fetchText(path);
  assert(r.status === 200, `Page ${path} returned ${r.status}`);
  const navCount = (r.text.match(/<nav\b/g) || []).length;
  const footerCount = (r.text.match(/<footer\b/g) || []).length;
  // /blog uses an extra <nav aria-label="칼럼 페이지 이동"> when totalPages > 1
  const maxNav = path === '/blog' ? 2 : 1;
  assert(navCount >= 1 && navCount <= maxNav, `Page ${path} has ${navCount} <nav> elements (expected <= ${maxNav})`);
  assert(footerCount === 1, `Page ${path} has ${footerCount} <footer> elements (expected 1)`);

  const canMatch = r.text.match(/<link[^>]*rel="canonical"[^>]*href="([^"]+)"/i);
  const actualCan = canMatch ? canMatch[1].replace(/\/$/, '') : '';
  const expCan = expectedCanonical.replace(/\/$/, '');
  assert(actualCan === expCan, `Page ${path} canonical mismatch: got "${actualCan}", expected "${expCan}"`);
  assert(!r.text.includes('data-ad-slot='), `Page ${path} still contains data-ad-slot during review mode`);
  assert(!r.text.includes('기만성'), `Page ${path} contains typo "기만성"`);
}

// Homepage Coming Soon check
const home = await fetchText('/');
assert(!home.text.includes('오픈 대기 중'), 'Homepage still shows Coming Soon cards');
assert(!home.text.includes('곧 출시할 신규 테스트'), 'Homepage still shows Coming Soon heading');

// 6. Result pages must be noindex
for (const rPath of ['/results', '/teto-egen/results', '/dopamine/results']) {
  const r = await fetchText(rPath);
  assert(r.status === 200, `Result page ${rPath} returned ${r.status}`);
  assert(/name="robots"[^>]*content="[^"]*noindex/i.test(r.text), `Result page ${rPath} missing noindex meta`);
}

console.log(JSON.stringify({
  sitemapUrlsTotal: locs.length,
  sitemapUrls200: sitemap200,
  canonicalPagesChecked: canonicalChecks.length,
  redirectsChecked: redirects.length,
  failureCount: failures.length,
  failures,
}, null, 2));

if (failures.length > 0) process.exit(1);
