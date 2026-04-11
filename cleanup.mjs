import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const root = path.join(__dirname, 'client', 'src');

// 1. Clean App.tsx
const appPath = path.join(root, 'App.tsx');
let appContent = fs.readFileSync(appPath, 'utf8');
appContent = appContent.replace(/import MbtiMatchTestTest from "@\/pages\/mbtiMatchTest-test";\r?\n/, '');
appContent = appContent.replace(/import MbtiMatchTestResults from "@\/pages\/mbtiMatchTest-results";\r?\n/, '');
appContent = appContent.replace(/<Route path="\/mbtiMatchTest-test" component={MbtiMatchTestTest} \/>\r?\n\s*/, '');
appContent = appContent.replace(/<Route path="\/mbtiMatchTest-results" component={MbtiMatchTestResults} \/>\r?\n\s*/, '');
fs.writeFileSync(appPath, appContent);

// 2. Clean Navigation.tsx
const navPath = path.join(root, 'components', 'Navigation.tsx');
let navContent = fs.readFileSync(navPath, 'utf8');
navContent = navContent.replace(/\s*{\s*title:\s*'Discover Your Perfect MBTI Match!',\s*href:\s*'\/mbtiMatchTest-test',\s*emoji:\s*'✨',\s*description:\s*'Find out which MBTI personality type you are most compatible with\. Answer these questions to see who resonates the most with your true self\.'\s*},/, '');
fs.writeFileSync(navPath, navContent);

// 3. Clean testTypes.ts
const testTypesPath = path.join(root, 'data', 'testTypes.ts');
let ttContent = fs.readFileSync(testTypesPath, 'utf8');
ttContent = ttContent.replace(/\s*{\s*id:\s*"mbtiMatchTest",\s*title:\s*"Discover Your Perfect MBTI Match!",\s*subtitle:\s*"Find out which MBTI personality type you are most compatible with\. Answer these questions to see who resonates the most with your true self\.",\s*description:\s*"AI가 생성한 최신 바이럴 테스트입니다\.",\s*emoji:\s*"✨",\s*color:\s*"from-blue-400 to-indigo-500",\s*duration:\s*"약 3분",\s*questions:\s*12,\s*href:\s*"\/mbtiMatchTest-test",\s*features:\s*\["AI 맞춤형 분석",\s*"나만의 결과지",\s*"궁합 확인"\],\s*isAvailable:\s*true\s*},/, '');
fs.writeFileSync(testTypesPath, ttContent);

console.log("Cleanup script completed!");
