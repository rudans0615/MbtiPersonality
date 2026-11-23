export const SITE_URL = 'https://mbtifinder.com';

/**
 * 애드센스 심사 모드 여부.
 * 승인 완료 후 Vercel 환경변수에 NEXT_PUBLIC_ADSENSE_REVIEW_MODE=false 를 설정하면
 * 제휴 추천 위젯 및 실 광고 슬롯이 활성화됩니다.
 */
export const IS_ADSENSE_REVIEW_MODE =
  process.env.NEXT_PUBLIC_ADSENSE_REVIEW_MODE !== 'false';

/**
 * MBTI 136쌍 궁합 페이지 전체 색인 여부.
 * 기본값(false): 허브(/compatibility) + 수동 큐레이션 핵심 32쌍만 색인·사이트맵 포함 (애드센스 안전).
 * 애드센스 승인 후 NEXT_PUBLIC_INDEX_ALL_COMPATIBILITY=true 설정 시 136쌍 전체 색인 개방.
 */
export const IS_ALL_COMPATIBILITY_INDEXED =
  process.env.NEXT_PUBLIC_INDEX_ALL_COMPATIBILITY === 'true';

/**
 * 실제 승인 전 코드에 남아있던 더미/예시 슬롯 ID 목록.
 */
export const DUMMY_AD_SLOTS = new Set([
  '',
  '1234567890',
  '0987654321',
  '1122334455',
  '8811223344',
  '9922334455',
  '1133557799',
  '4325732101',
  '7890123456',
]);
