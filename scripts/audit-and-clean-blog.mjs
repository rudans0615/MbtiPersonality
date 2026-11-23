import { createClient } from '@supabase/supabase-js';
import { mkdirSync, writeFileSync } from 'node:fs';
import path from 'node:path';

// 유지할 고유 주제 글 목록:
// - 1~11: 초기 기획 칼럼 11편
// - 16, 58, 62, 63, 81, 86, 99, 118, 134, 154: 8개 테마별 대표 글(중복 제거) 10편
const KEEP_IDS = new Set([
  1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11,
  16, 58, 62, 63, 81, 86, 99, 118, 134, 154,
]);

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !key) {
  throw new Error('NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required.');
}

const supabase = createClient(url, key, {
  auth: { persistSession: false, autoRefreshToken: false },
});

const apply = process.argv.includes('--apply');

const { data: posts, error } = await supabase
  .from('blog_posts')
  .select('*')
  .order('id', { ascending: true });

if (error) throw error;

const backupDir = path.join(process.cwd(), 'artifacts', 'backup');
mkdirSync(backupDir, { recursive: true });
const stamp = new Date().toISOString().replace(/[:.]/g, '-');
const backupFile = path.join(backupDir, `blog_posts_backup_${stamp}.json`);
writeFileSync(backupFile, JSON.stringify(posts, null, 2), 'utf8');

const keepPosts = posts.filter((p) => KEEP_IDS.has(p.id));
const deletePosts = posts.filter((p) => !KEEP_IDS.has(p.id));
const deleteIds = deletePosts.map((p) => p.id);

console.log(`Backup written: ${backupFile}`);
console.log(`Total: ${posts.length} | Keep: ${keepPosts.length} | Delete: ${deletePosts.length}`);

// 유지 글 본문 중 삭제될 /blog/:id 를 가리키는 내부 링크 점검
const brokenLinkPatches = [];
for (const p of keepPosts) {
  const html = p.content || '';
  const cleaned = html.replace(
    /<a\b[^>]*href=["'](?:https?:\/\/mbtifinder\.com)?\/blog\/(\d+)["'][^>]*>([\s\S]*?)<\/a>/gi,
    (match, idStr, innerText) => {
      const targetId = Number(idStr);
      if (KEEP_IDS.has(targetId)) return match;
      return `<a href="/blog" class="text-pink-500 font-bold hover:underline">${innerText}</a>`;
    }
  );
  if (cleaned !== html) {
    brokenLinkPatches.push({ id: p.id, content: cleaned });
  }
}

console.log(`Kept posts needing internal link cleanup: ${brokenLinkPatches.length}`);

if (!apply) {
  console.log('Dry-run complete. Re-run with --apply to clean duplicates and patch internal links.');
  process.exit(0);
}

// 1. 유지 글 내부 깨진 링크 정리
for (const patch of brokenLinkPatches) {
  const { error: upErr } = await supabase
    .from('blog_posts')
    .update({ content: patch.content })
    .eq('id', patch.id);
  if (upErr) throw upErr;
}

// 2. 중복 글 50건씩 배치 삭제
for (let i = 0; i < deleteIds.length; i += 50) {
  const chunk = deleteIds.slice(i, i + 50);
  const { error: delErr } = await supabase
    .from('blog_posts')
    .delete()
    .in('id', chunk);
  if (delErr) throw delErr;
}

const { count } = await supabase
  .from('blog_posts')
  .select('id', { count: 'exact', head: true });

console.log(`Cleanup applied. Remaining blog_posts count: ${count}`);
