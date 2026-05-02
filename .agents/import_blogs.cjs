const fs = require('fs');
const { createClient } = require('@supabase/supabase-js');

// Manual .env parser
function loadEnv() {
  const envFile = fs.existsSync('.env') ? fs.readFileSync('.env', 'utf8') : '';
  const localEnvFile = fs.existsSync('.env.local') ? fs.readFileSync('.env.local', 'utf8') : '';
  const content = envFile + '\n' + localEnvFile;
  
  content.split('\n').forEach(line => {
    const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
    if (match) {
      let key = match[1];
      let value = match[2] || '';
      if (value.startsWith('"') && value.endsWith('"')) value = value.slice(1, -1);
      process.env[key] = value;
    }
  });
}
loadEnv();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// Read and transform
const code = fs.readFileSync('src/data/blogPosts.ts', 'utf8');
const cleaned = code
  .replace(/export interface BlogPost \{[\s\S]*?\}/, '')
  .replace(/export const blogPosts: BlogPost\[\] =/, 'global.blogPosts =')
  .replace(/\.sort\([\s\S]*?\);/, ';');

eval(cleaned); // Loads blogPosts array into global.blogPosts

async function importBlogs() {
  const posts = global.blogPosts;
  console.log(`Found ${posts.length} posts to import.`);
  for (const post of posts) {
    const { id, title, excerpt, content, date, readTime, tags, category, imageUrl } = post;
    const { error } = await supabase
      .from('blog_posts')
      .upsert({
        id,
        title,
        excerpt,
        content,
        date,
        read_time: readTime,
        tags,
        category,
        image_url: imageUrl
      });
    
    if (error) {
      console.error(`Error inserting post ${id}:`, error);
    } else {
      console.log(`Inserted post ${id}: ${title}`);
    }
  }
  console.log('Import completed.');
}

importBlogs();
