const fs = require('fs');

// Read and transform
const code = fs.readFileSync('src/data/blogPosts.ts', 'utf8');
const cleaned = code
  .replace(/export interface BlogPost \{[\s\S]*?\}/, '')
  .replace(/export const blogPosts: BlogPost\[\] =/, 'global.blogPosts =')
  .replace(/\.sort\([\s\S]*?\);/, ';');

eval(cleaned); // Loads blogPosts array into global.blogPosts

// Helper to escape single quotes for SQL
function esc(str) {
  if (!str) return '';
  return str.replace(/'/g, "''");
}

// Generate INSERT statements
const inserts = global.blogPosts.map(p => {
  return `INSERT INTO blog_posts (id, title, excerpt, content, date, read_time, tags, category) VALUES (${p.id}, '${esc(p.title)}', '${esc(p.excerpt)}', '${esc(p.content)}', '${esc(p.date)}', '${esc(p.readTime)}', '${JSON.stringify(p.tags || [])}'::jsonb, '${esc(p.category)}');`;
});

fs.writeFileSync('.agents/blog_insert.sql', inserts.join('\n'));
console.log('Generated', inserts.length, 'INSERT statements');
