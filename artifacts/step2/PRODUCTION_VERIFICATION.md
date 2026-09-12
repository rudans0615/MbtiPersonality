# 1·2번 운영 반영 검증

날짜: 2026-09-12 (Asia/Seoul).
코드 커밋: [d7c31f000e4cb28a363324af81088ec15f4207dc](https://github.com/rudans0615/MbtiPersonality/commit/d7c31f000e4cb28a363324af81088ec15f4207dc).
운영 도메인: https://mbtifinder.com

## 배포 근거

- origin/main push 성공. GitHub Vercel commit status: success / Deployment has completed.
- GitHub deployment ID: 6408854166, environment: Production, sha: d7c31f000e4cb28a363324af81088ec15f4207dc.
- 배포 상태 success 기록: 2026-09-12T10:58:19Z.
- Vercel 배포: https://vercel.com/jungkyungmoons-projects/mbti-personality/9LKMFpweeDLR793UPmTtTLC3Mp2A
- 배포 URL: https://mbti-personality-iowl7pr4b-jungkyungmoons-projects.vercel.app

## 실제 도메인 검증

TEST_BASE_URL=https://mbtifinder.com으로 다음 두 스크립트를 실행했고 둘 다 exit code 0으로 완료했다.

1. `node --env-file=.env scripts/verify-step2.cjs`
   - 도파민·호구력 12문항 완료, 재답변·연속 클릭, 예상 URL과 실제 결과 일치.
   - 결과 쿼리 변경·잘못된 입력·다시하기·완료 이벤트 중복 방지.
   - 제거 광고 슬롯의 생성/요청 없음, 정상 본문 광고 3개 유지.
   - 누락·오류 입력 및 기존 DB 오류의 안내 화면은 수동 광고·완료 이벤트 없음.
   - 데스크톱·모바일, 가로 넘침 및 브라우저 JavaScript 예외 없음.
2. `node --env-file=.env scripts/verify-step1.cjs`
   - MBTI /results HTTP 200, 잘못된 저장 데이터 안내.
   - MBTI 60문항 마지막 답변 경계 두 사례, 이전 문항, 연속 클릭, 새로고침·재검사.
   - 테토·에겐 21문항 완료·성별 변경·공유·복원·재검사, 옛 주소 308.
   - 저장소 읽기/쓰기/삭제 실패 후 복구·재시도.
   - 이메일 문의 링크 및 주소 복사 성공/실패, 실제 발송 없음.
   - 도파민 유효 전체 답변의 예상 결과 및 모바일 화면.

광고·제휴 API와 외부 요청은 브라우저 테스트에서 차단하고 광고 push와 GA 이벤트는 mock으로 검사했다. 실제 애드센스 자동 광고 설정 및 실제 GA 수집은 확인하지 않았다. DB는 읽기 전용으로 조회했으며 수정하지 않았다.

운영 스크린샷 재실행은 기존 로컬 캡처 경로를 사용하므로 Git에는 기존 로컬 캡처를 유지했다. 이 문서는 실제 운영 실행 결과와 배포 ID를 별도로 기록한다.

## 별도 작업

DB 6개 보완은 [복구 계획](../../DB_REPAIR_PLAN.md) 작성 완료, 구현 전. 유형형 옵션 5개의 score=NULL 복구와 생성기 저장 오류 수정, SNS 원본의 채점·문항 검수를 제안한다. 이번 웹 배포에는 생성 봇 수정이나 Oracle 프로세스 재시작이 필요하지 않았다.
