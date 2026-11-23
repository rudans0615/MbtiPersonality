import { createClient } from '@supabase/supabase-js';

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !key) throw new Error('Supabase credentials required');

const sb = createClient(url, key, {
  auth: { persistSession: false, autoRefreshToken: false },
});

// 1. 테스트 메타데이터 & 고유 컬러 팔레트 정비
const TEST_META_UPDATES = [
  {
    id: 'mbti',
    description: '외향·내향, 감각·직관, 사고·감정, 판단·인식 4가지 지표로 16가지 성격유형을 정밀하게 분석하는 무료 60문항 검사입니다.',
    duration: '약 8분',
    color: 'from-indigo-500 to-purple-600',
  },
  {
    id: 'teto-egen',
    title: '테토 vs 에겐 성향 진단',
    subtitle: '나의 추진력(테토)과 감성 공감력(에겐) 비율은?',
    description: '일상과 연애 선택지 21문항으로 나의 테토·에겐 밸런스와 연애 궁합을 분석해보세요.',
    duration: '약 3분',
    color: 'from-blue-500 to-pink-500',
  },
  {
    id: 'drunk',
    title: '나 술 취했나? 자가진단 테스트',
    subtitle: '지금 나의 취함 단계와 주사 유형 체크!',
    description: '술자리에서 나타나는 10가지 행동 신호로 현재 나의 취함 레벨과 주사 스타일을 유쾌하게 확인해보세요.',
    duration: '약 2분',
    color: 'from-amber-500 to-rose-500',
  },
  { id: 'dopamine', color: 'from-fuchsia-500 to-indigo-500' },
  { id: 'sbti', color: 'from-orange-500 to-pink-500' },
  { id: 'hogu', color: 'from-rose-500 to-red-500' },
  { id: 'subscriptionSpenderQuiz', color: 'from-emerald-500 to-teal-500' },
  { id: 'officePhoneUsageKkondaeLevel', color: 'from-slate-600 to-indigo-600' },
  { id: 'commuteBgmSurvivalType', color: 'from-cyan-500 to-blue-600' },
  { id: 'weddingNewsAttitudeTest', color: 'from-pink-400 to-rose-500' },
  { id: 'travelMood2023', color: 'from-sky-400 to-emerald-500' },
  { id: 'workLifeBalanceTest', color: 'from-violet-500 to-blue-500' },
  { id: 'seasonalMoodTest', color: 'from-amber-400 to-teal-500' },
  { id: 'travelFriendCompatibility', color: 'from-blue-400 to-cyan-500' },
  { id: 'friendshipCompatibility', color: 'from-yellow-400 to-orange-500' },
  { id: 'petPersonalityPreference', color: 'from-lime-500 to-emerald-500' },
];

for (const { id, ...fields } of TEST_META_UPDATES) {
  const { error } = await sb.from('tests').update(fields).eq('id', id);
  if (error) throw new Error(`tests update ${id}: ${error.message}`);
}

// 2. 어색하거나 중복된 질문/선택지 정비
const QUESTION_UPDATES = [
  { id: 123, text: '퇴근 후 친구들과 모인 자리에서 자연스럽게 회사 이야기가 나왔을 때 나는?' },
  { id: 131, text: '퇴사를 결심하고 마지막 날 팀원들에게 인사를 건넨다면 어떤 말이 가장 가까울까?' },
  { id: 133, text: '회사에서 올해 핵심 목표로 "팀워크와 협업 강화"를 내세웠을 때 내 반응은?' },
  { id: 146, text: '1년 중 계절이 바뀔 때 나의 감정 기복은 어떤 편이야?' },
  { id: 181, text: '애견카페에서 썸 상대와 데이트 중, 강아지가 뛰어노는 모습을 본다면?' },
  { id: 186, text: '입양하고 싶은 반려동물을 떠올린다면 가장 끌리는 모습은?' },
  { id: 165, text: '오랜만에 만난 친구와 카페에 앉았을 때, 주로 어떤 대화가 이어져?' },
  { id: 166, text: '평소 자주 연락하던 친구가 갑자기 며칠째 답장이 뜸할 때 너는?' },
];

for (const { id, text } of QUESTION_UPDATES) {
  const { error } = await sb.from('questions').update({ text }).eq('id', id);
  if (error) throw new Error(`question update ${id}: ${error.message}`);
}

const OPTION_UPDATES = [
  { id: 385, text: '정말 감사했어요! 다들 건강하고 잘 지내시길 바라요' },
  { id: 561, text: '썸 상대보다 강아지가 더 눈에 들어오긴 하지' },
  { id: 563, text: '상대방에게 강아지 같이 돌봐보자고 자연스럽게 말 걸어볼 듯' },
  { id: 521, text: '서로 요즘 고민과 진지한 속마음을 깊게 나눠' },
  { id: 522, text: '근황을 차근차근 듣다 보면 어느새 시간이 훌쩍 가 있어' },
  { id: 523, text: '별얘기 아닌데도 농담하고 웃느라 분위기가 계속 밝아' },
  { id: 524, text: '말이 잠시 끊겨도 어색하지 않고 편안한 리듬으로 흘러가' },
  { id: 525, text: '무슨 일 있나 걱정돼서 먼저 안부 카톡을 보내 봐' },
  { id: 526, text: '바쁜가 보다 하고 며칠 기다렸다가 슬쩍 안부를 물어봐' },
  { id: 527, text: '나도 내 일에 집중하다 보면 나중에 자연스럽게 연락이 닿아' },
  { id: 528, text: '각자 바쁜 시기가 있는 거라 편하게 존중하고 기다려 줘' },
];

for (const { id, text } of OPTION_UPDATES) {
  const { error } = await sb.from('options').update({ text }).eq('id', id);
  if (error) throw new Error(`option update ${id}: ${error.message}`);
}

// 3. 성별 편향 결과명 개선 + dopamine/sbti 결과 설명 보강
const RESULT_UPDATES = [
  { id: 42, title: '봄의 새싹 몽상가' },
  { id: 43, title: '여름의 쿨한 에너지러' },
  {
    id: 13,
    description:
      "손가락 하나로 세상을 구경하는 당신! '딱 하나만 더 볼까?' 하다가 새벽 3시를 맞이하는 게 일상입니다. 짧은 자극에는 누구보다 빠르게 반응하고 트렌드에도 빠삭하지만, 긴 글이나 깊은 집중이 필요할 때 쉽게 피로감을 느낍니다. 하루 30분만 스마트폰을 다른 방에 두고 뇌에 여백을 주면 잃어버린 몰입력이 놀라울 만큼 빠르게 돌아옵니다.",
  },
  {
    id: 14,
    description:
      '스트레스의 해답은 맛있는 한 입에 있다고 믿는 미각 보상형 타입입니다! 기분이 우울할 땐 매콤한 마라탕 수혈, 기분이 좋을 땐 달콤한 디저트로 도파민을 채웁니다. 음식에서 즉각적인 위로를 얻는 매력이 있지만, 피곤할 때 습관적으로 야식을 찾기 쉬우므로 산책이나 따뜻한 차 같은 비식사 보상 루틴을 1~2개 함께 만들어 두면 컨디션이 훨씬 가벼워집니다.',
  },
  {
    id: 15,
    description:
      '사는(Live) 재미보다 사는(Buy) 재미로 활력을 얻는 소비 보상형 타입입니다! 장바구니를 채우고 택배 박스를 뜯는 순간의 설렘이 최고의 스트레스 해소법입니다. 취향과 안목이 뛰어나 좋은 아이템을 빠르게 고르지만, 감정 소비가 쌓이면 월말에 후회하기 쉬우므로 결제 전 24시간 장바구니 보류 규칙만 세워도 만족도와 잔고를 동시에 지킬 수 있습니다.',
  },
  {
    id: 16,
    description:
      "'오늘부터 도파민 디톡스한다'를 다짐하며 다이어리, 영양제, 운동 용품을 먼저 세팅하는 갓생 추구형 타입입니다! 더 나은 일상을 향한 의욕과 자기계발 감각이 매우 뛰어나지만, 완벽한 준비에 에너지를 쓰다 정작 실행이 미뤄지기 쉽습니다. 거창한 루틴보다 '오늘 딱 10분만 실천하기'처럼 부담 없는 작은 성공을 쌓아가면 진짜 갓생으로 완성됩니다.",
  },
];

for (const { id, ...fields } of RESULT_UPDATES) {
  const { error } = await sb.from('result_types').update(fields).eq('id', id);
  if (error) throw new Error(`result_types update ${id}: ${error.message}`);
}

console.log('Polished 16 test metas, 8 questions, 11 options, and 6 results successfully.');
