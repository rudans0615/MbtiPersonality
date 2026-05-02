import dotenv from 'dotenv';
dotenv.config({ path: '../../.env' }); // Load from root .env

import { injectBlogPost } from './blogAgent.js';

async function testInsert() {
  console.log('Testing injectBlogPost...');
  const aiData = {
    title: "AI 테스트 블로그 포스트",
    excerpt: "Supabase 직접 삽입 테스트용입니다.",
    content: "<h2>테스트 본문</h2><p>성공적으로 삽입되었습니다.</p>",
    tags: ["테스트", "봇"],
    category: "심층분석"
  };

  try {
    const id = await injectBlogPost(aiData);
    console.log('Success! Inserted ID:', id);
  } catch (error) {
    console.error('Error during insert:', error);
  }
}

testInsert();
