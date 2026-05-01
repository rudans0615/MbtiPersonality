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
  
  // content 내 백틱(`) 및 ${} 이스케이프 처리 (템플릿 리터럴 깨짐 방지)
  const safeContent = content
    .replace(/\\/g, '\\\\')    // 백슬래시 먼저 이스케이프
    .replace(/`/g, '\\`')     // 백틱 이스케이프
    .replace(/\$\{/g, '\\${'); // 템플릿 리터럴 인터폴레이션 이스케이프

  const newPostObject = `  {
    id: ${newId},
    title: ${JSON.stringify(title)},
    excerpt: ${JSON.stringify(excerpt)},
    date: "${dateString}",
    readTime: "${readTimeString}",
    tags: ${JSON.stringify(tags)},
    category: ${JSON.stringify(category || '심층분석')},
    content: \`
${safeContent}
    \`
  }`;

  // ].sort(...) 패턴을 정확히 찾아서, 그 앞에 새 항목을 삽입
  // 정규식으로 파일 마지막의 ].sort((a, b) => b.id - a.id); 를 찾음
  const closingPattern = /\]\s*\.sort\s*\(\s*\(a\s*,\s*b\)\s*=>\s*b\.id\s*-\s*a\.id\s*\)\s*;?\s*$/;
  const closingMatch = fileContent.match(closingPattern);

  if (closingMatch) {
    const insertIndex = fileContent.lastIndexOf(closingMatch[0]);
    const beforeClosing = fileContent.slice(0, insertIndex).trimEnd();
    
    // 마지막 객체 뒤에 쉼표가 없으면 추가
    const withComma = beforeClosing.endsWith(',') ? beforeClosing : beforeClosing + ',';
    
    const newFileContent = withComma + '\n' + newPostObject + '\n].sort((a, b) => b.id - a.id);\n';
    
    // 파일 쓰기 전 기본 검증: 기존 포스트들이 살아있는지 확인
    const originalIdCount = (fileContent.match(/id:\s*\d+/g) || []).length;
    const newIdCount = (newFileContent.match(/id:\s*\d+/g) || []).length;
    
    if (newIdCount < originalIdCount) {
      throw new Error(`안전 검증 실패: 기존 ${originalIdCount}개 항목 중 ${originalIdCount - newIdCount}개가 누락되었습니다. 파일을 수정하지 않습니다.`);
    }
    
    // interface 정의가 존재하는지 확인
    if (!newFileContent.includes('export interface BlogPost')) {
      throw new Error('안전 검증 실패: BlogPost 인터페이스 정의가 없습니다. 파일을 수정하지 않습니다.');
    }
    
    fs.writeFileSync(blogPostsPath, newFileContent, 'utf-8');
  } else {
    throw new Error('blogPosts.ts 파일에서 닫는 패턴(].sort((a, b) => b.id - a.id))을 찾을 수 없습니다.');
  }
  
  return newId;
}
