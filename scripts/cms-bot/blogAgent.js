import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const srcDir = path.resolve(__dirname, '../../src');

export async function injectBlogPost(aiData) {
  const { title, excerpt, content, tags, category } = aiData;
  const blogPostsPath = path.join(srcDir, 'data/blogPosts.ts');
  
  let fileContent = fs.readFileSync(blogPostsPath, 'utf-8');
  
  // 가장 높은 ID 찾기
  const idRegex = /id:\s*(\d+)/g;
  let match;
  let maxId = 0;
  while ((match = idRegex.exec(fileContent)) !== null) {
    const id = parseInt(match[1], 10);
    if (id > maxId) maxId = id;
  }
  const newId = maxId + 1;
  
  const today = new Date();
  const dateString = `${today.getFullYear()}년 ${today.getMonth() + 1}월 ${today.getDate()}일`;
  
  // 한국어 평균 읽기 속도(약 1분당 400자)로 예상 소요 시간 계산
  const plainTextLength = content.replace(/<[^>]*>?/gm, '').length; 
  const readTimeMin = Math.max(3, Math.ceil(plainTextLength / 400));
  const readTimeString = `${readTimeMin}분`;
  
  const newPostObject = `  {
    id: ${newId},
    title: ${JSON.stringify(title)},
    excerpt: ${JSON.stringify(excerpt)},
    date: "${dateString}",
    readTime: "${readTimeString}",
    tags: ${JSON.stringify(tags)},
    category: ${JSON.stringify(category || '심층분석')},
    content: \`
${content.replace(/`/g, '\\`')}
    \`
  }`;

  // 파일의 마지막 '].sort' 를 찾아 앞에 새로운 객체를 쉼표와 함께 주입
  const lastBracketIndex = fileContent.lastIndexOf('].sort');
  if (lastBracketIndex !== -1) {
    // 맨 끝 객체 뒤에 쉼표가 없을 수도 있으므로, 배열의 끝부분을 찾아서 안전하게 교체
    // 마지막 객체가 끝나는 '}' 의 인덱스를 찾습니다.
    let beforeBracket = fileContent.slice(0, lastBracketIndex).trimEnd();
    
    // 만약 쉼표로 안 끝난다면 쉼표 추가
    if (!beforeBracket.endsWith(',')) {
      beforeBracket += ',';
    }
    
    const newFileContent = beforeBracket + '\n' + newPostObject + '\n].sort((a, b) => b.id - a.id);\n';
    fs.writeFileSync(blogPostsPath, newFileContent, 'utf-8');
  } else {
    throw new Error('blogPosts.ts 파일에서 닫는 괄호(].sort)를 찾을 수 없습니다.');
  }
  
  return newId;
}
