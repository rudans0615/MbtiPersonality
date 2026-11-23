import { createClient } from '@supabase/supabase-js';
import fs from 'node:fs';
import path from 'node:path';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
  console.error('Missing SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

/**
 * Helper: rotate 4 archetype options per question index so A/B/C/D has zero positional bias.
 * Input options array is always in canonical archetype order [type0, type1, type2, type3].
 */
function rotateOptions(opts, qIndex) {
  const shift = (qIndex * 3 + 1) % opts.length;
  return opts.map((_, idx) => opts[(idx + shift) % opts.length]);
}

// =============================================================================
// 1. SIX CATEGORICAL TESTS CONVERTED FROM 1D SCORE -> ACCURATE TYPE-BASED MODE
// =============================================================================
const CATEGORICAL_OVERHAUL = {
  travelMood2023: {
    // adventurer (모험가), natureLover (자연 애호가), relaxer (휴식 추구형), foodie (식도락가)
    questions: [
      {
        text: '주말에 갑자기 하루 여유가 생겼을 때, 가장 먼저 떠오르는 계획은?',
        options: [
          { type_code: 'adventurer', text: '한 번도 안 가본 낯선 동네나 이색 체험을 예약한다.' },
          { type_code: 'natureLover', text: '가까운 숲길이나 바닷가로 나가 바람을 쐬며 걷는다.' },
          { type_code: 'relaxer', text: '알람을 끄고 푹 잔 뒤 조용한 숙소나 집에서 느긋하게 쉰다.' },
          { type_code: 'foodie', text: '저장해 둔 맛집과 디저트 카페 코스를 바로 실행한다.' },
        ],
      },
      {
        text: '여행지를 고를 때 가장 중요하게 보는 기준은?',
        options: [
          { type_code: 'adventurer', text: '짜릿한 액티비티와 색다른 볼거리가 가득한 곳' },
          { type_code: 'natureLover', text: '탁 트인 산·바다·하늘처럼 자연 풍경이 압도적인 곳' },
          { type_code: 'relaxer', text: '숙소 컨디션이 좋고 아무 일정 없이 쉬기 편한 곳' },
          { type_code: 'foodie', text: '현지 대표 음식과 로컬 시장, 맛집이 넘쳐나는 곳' },
        ],
      },
      {
        text: '여행 중 가장 행복감을 느끼는 순간은?',
        options: [
          { type_code: 'adventurer', text: '서핑·패러글라이딩·로컬 투어 등 새로운 도전에 성공했을 때' },
          { type_code: 'natureLover', text: '한적한 자연 속에서 바람 소리를 들으며 천천히 걸을 때' },
          { type_code: 'relaxer', text: '일정 압박 없이 침대나 테라스에서 멍하니 여유를 즐길 때' },
          { type_code: 'foodie', text: '기대하던 현지 맛집에서 첫 입을 먹는 순간' },
        ],
      },
      {
        text: '여행 일정을 짤 때 내가 가장 공들이는 부분은?',
        options: [
          { type_code: 'adventurer', text: '남들이 잘 안 가는 숨은 스팟과 이색 체험 리스트' },
          { type_code: 'natureLover', text: '일출·일몰 명소와 걷기 좋은 자연 산책 코스' },
          { type_code: 'relaxer', text: '무리하지 않는 동선과 숙소에서 쉴 수 있는 넉넉한 시간' },
          { type_code: 'foodie', text: '아침·점심·저녁·간식까지 빈틈없는 맛집 동선' },
        ],
      },
      {
        text: '여행이 끝난 뒤 집에 돌아왔을 때 가장 먼저 드는 생각은?',
        options: [
          { type_code: 'adventurer', text: '"재밌는 에피소드가 한가득! 다음엔 더 새로운 곳 가야지"' },
          { type_code: 'natureLover', text: '"맑은 공기와 풍경 덕분에 머리가 깨끗하게 비워졌다"' },
          { type_code: 'relaxer', text: '"제대로 푹 쉬어서 일상으로 돌아갈 에너지가 충전됐다"' },
          { type_code: 'foodie', text: '"거기서 먹었던 그 음식, 지금도 또 생각나네..."' },
        ],
      },
      {
        text: '여행 가방을 쌀 때 절대 빠뜨릴 수 없는 필수품은?',
        options: [
          { type_code: 'adventurer', text: '액션캠·활동 편한 복장 등 어디든 뛰어다닐 장비' },
          { type_code: 'natureLover', text: '오래 걸어도 편한 트레킹화와 가벼운 겉옷' },
          { type_code: 'relaxer', text: '읽고 싶었던 책, 이어폰, 숙소에서 입을 편한 파자마' },
          { type_code: 'foodie', text: '미리 정리한 맛집 지도와 든든한 소화제' },
        ],
      },
      {
        text: '여행 사진첩을 열어보면 가장 많이 찍혀 있는 사진은?',
        options: [
          { type_code: 'adventurer', text: '역동적인 체험 순간과 낯선 골목의 생생한 기록' },
          { type_code: 'natureLover', text: '바다·숲·노을처럼 마음을 울린 자연 풍경 사진' },
          { type_code: 'relaxer', text: '숙소 뷰, 창밖 풍경, 조용히 쉬던 평화로운 순간' },
          { type_code: 'foodie', text: '한 상 가득 차려진 현지 음식과 디저트 근접 샷' },
        ],
      },
      {
        text: '여행지에서 저녁 메뉴를 정할 때 나의 선택은?',
        options: [
          { type_code: 'adventurer', text: '처음 보는 현지 야시장 이색 메뉴에 과감히 도전!' },
          { type_code: 'natureLover', text: '바다나 숲이 보이는 야외 테라스에서 신선한 제철 요리' },
          { type_code: 'relaxer', text: '줄 설 필요 없이 숙소 근처 편한 식당이나 룸서비스' },
          { type_code: 'foodie', text: '웨이팅이 있더라도 꼭 먹어야 하는 지역 대표 미식 명소' },
        ],
      },
    ],
  },

  travelFriendCompatibility: {
    // typeA (인스타 여행러📸), typeB (맛집 탐방 여행가🍽️), typeC (자연 속의 여행자🌿), typeD (즉흥적인 여행가🚀)
    questions: [
      {
        text: '토요일 아침 친구와 제주도 여행을 떠나기로 했다! 출발 전 내가 준비한 건?',
        options: [
          { type_code: 'typeA', text: '인생샷 명소와 감성 카페 포토 스팟 리스트 완벽 정리' },
          { type_code: 'typeB', text: '흑돼지부터 숨은 노포, 디저트까지 끼니별 맛집 지도 완성' },
          { type_code: 'typeC', text: '한적한 오름 산책로와 바다 보이는 조용한 힐링 코스' },
          { type_code: 'typeD', text: '비행기 표와 숙소만 예약 완료! 나머지는 현지 느낌대로!' },
        ],
      },
      {
        text: '친구와 여행 중 갑자기 비가 내리기 시작했다! 이때 나의 제안은?',
        options: [
          { type_code: 'typeA', text: '"비 오는 감성 딱이다! 분위기 예쁜 실내 카페 가서 사진 찍자"' },
          { type_code: 'typeB', text: '"비 올 땐 따뜻한 국물이지! 근처 로컬 맛집부터 찾아가자"' },
          { type_code: 'typeC', text: '"빗소리 들으면서 창밖 풍경 보고 천천히 쉬어가는 것도 좋아"' },
          { type_code: 'typeD', text: '"계획 변경! 우산 하나 쓰고 발길 닿는 골목 탐험해볼까?"' },
        ],
      },
      {
        text: '친구와 숙소를 고를 때 내가 가장 먼저 체크하는 조건은?',
        options: [
          { type_code: 'typeA', text: '인테리어와 채광! 어디서 찍어도 화보 나오는 감성 숙소' },
          { type_code: 'typeB', text: '유명 맛집 거리·야시장과 가까워 밤에도 먹기 좋은 위치' },
          { type_code: 'typeC', text: '창문 열면 숲이나 바다가 펼쳐지는 고요하고 쾌적한 뷰' },
          { type_code: 'typeD', text: '교통만 편하면 OK! 체크인 후 어디든 바로 나가기 좋은 곳' },
        ],
      },
      {
        text: '해외여행 중 "진짜 여길 오길 잘했다!" 싶은 최고의 순간은?',
        options: [
          { type_code: 'typeA', text: '친구랑 서로 역대급 인생샷을 건지고 스토리에 올릴 때' },
          { type_code: 'typeB', text: '현지인 줄 서는 식당에서 인생 음식을 함께 맛볼 때' },
          { type_code: 'typeC', text: '관광객 없는 언덕이나 해변에서 말없이 풍경을 바라볼 때' },
          { type_code: 'typeD', text: '계획에 없던 골목 축제나 숨은 가게를 우연히 발견했을 때' },
        ],
      },
      {
        text: '여행 중 가려던 장소가 갑자기 휴무일이었다! 나의 반응은?',
        options: [
          { type_code: 'typeA', text: '"아쉽지만 괜찮아! 근처에 사진 잘 나오는 감성 스팟 또 있어"' },
          { type_code: 'typeB', text: '"오히려 좋아! 대신 아까 봐둔 디저트 맛집 하나 더 가자"' },
          { type_code: 'typeC', text: '"서두를 필요 없지, 근처 공원이나 바닷가 천천히 걸을까?"' },
          { type_code: 'typeD', text: '"이것도 여행의 묘미지! 지도 끄고 지금 끌리는 쪽으로 가자"' },
        ],
      },
      {
        text: '여행 전에 친구와 단톡방에서 가장 활발하게 나누는 이야기는?',
        options: [
          { type_code: 'typeA', text: '드레스코드 맞추기와 사진 잘 나오는 시간대 공유' },
          { type_code: 'typeB', text: '꼭 먹어봐야 할 현지 메뉴와 예약 필수 식당 체크' },
          { type_code: 'typeC', text: '무리하지 않게 쉬어갈 자연 스팟과 여유로운 동선 조율' },
          { type_code: 'typeD', text: '"일단 도착해서 컨디션 보고 정하자!" 쿨한 합의' },
        ],
      },
      {
        text: '여행 중 친구와 함께 있을 때 가장 잘 맞는 궁합 포인트는?',
        options: [
          { type_code: 'typeA', text: '서로 각도 맞춰 정성껏 사진 찍어주며 추억을 예쁘게 남길 때' },
          { type_code: 'typeB', text: '메뉴 여러 개 시켜 나눠 먹으며 음식 취향이 찰떡일 때' },
          { type_code: 'typeC', text: '말이 잠시 끊겨도 풍경 보며 편안한 침묵을 즐길 수 있을 때' },
          { type_code: 'typeD', text: '"어? 저기 재밌어 보인다!" 하면 바로 콜 외쳐줄 때' },
        ],
      },
      {
        text: '여행 마지막 날, 친구와 남은 반나절을 어떻게 채우고 싶을까?',
        options: [
          { type_code: 'typeA', text: '못 찍은 랜드마크 포토존과 소품샵 들러 마지막 인증샷 남기기' },
          { type_code: 'typeB', text: '아쉬움 남지 않게 최애 맛집 재방문 + 먹거리 기념품 쇼핑' },
          { type_code: 'typeC', text: '바다나 공원 벤치에 앉아 여행을 차분히 되돌아보며 마무리' },
          { type_code: 'typeD', text: '정해둔 것 없이 공항 가기 전까지 발길 닿는 대로 자유 산책' },
        ],
      },
    ],
  },

  seasonalMoodTest: {
    // springVibe (봄의 새싹 몽상가), summerChill (여름의 쿨한 에너지러), autumnDreamer (가을의 감성가), winterSoul (겨울의 따뜻한 마음)
    questions: [
      {
        text: '새로운 한 주가 시작되는 월요일 아침, 나의 감정 리듬은?',
        options: [
          { type_code: 'springVibe', text: '이번 주엔 어떤 즐거운 일이 생길까 은근히 설렌다.' },
          { type_code: 'summerChill', text: '할 일부터 시원하게 돌파하자! 에너지가 빠르게 올라온다.' },
          { type_code: 'autumnDreamer', text: '좋아하는 음악을 들으며 차분하게 내 페이스를 찾는다.' },
          { type_code: 'winterSoul', text: '따뜻한 음료 한 잔과 함께 흔들림 없이 하루를 연다.' },
        ],
      },
      {
        text: '기분이 확 좋아졌을 때 내가 감정을 표현하는 방식은?',
        options: [
          { type_code: 'springVibe', text: '표정이 환해지고 주변 사람들에게 밝은 이야기를 나눈다.' },
          { type_code: 'summerChill', text: '당장 밖으로 나가거나 하고 싶던 일을 바로 실행에 옮긴다.' },
          { type_code: 'autumnDreamer', text: '그 여운을 곱씹으며 사진·메모·플레이리스트로 기록한다.' },
          { type_code: 'winterSoul', text: '과하게 들뜨기보다 가까운 사람에게 다정하게 마음을 전한다.' },
        ],
      },
      {
        text: '마음이 복잡하거나 지칠 때 나를 가장 빨리 회복시켜 주는 것은?',
        options: [
          { type_code: 'springVibe', text: '새로운 취미나 가벼운 산책으로 신선한 바람 쐬기' },
          { type_code: 'summerChill', text: '땀 흘리는 운동이나 드라이브로 답답함을 한 번에 날리기' },
          { type_code: 'autumnDreamer', text: '혼자 조용히 생각 정리하며 감성 영화나 책에 몰입하기' },
          { type_code: 'winterSoul', text: '포근한 이불·따뜻한 차·믿는 사람과의 잔잔한 대화' },
        ],
      },
      {
        text: '창밖으로 계절의 변화가 뚜렷하게 느껴질 때 드는 기분은?',
        options: [
          { type_code: 'springVibe', text: '꽃봉오리처럼 무언가 새로 시작하고 싶은 두근거림' },
          { type_code: 'summerChill', text: '쨍한 햇살과 활기찬 공기처럼 가슴이 뻥 뚫리는 시원함' },
          { type_code: 'autumnDreamer', text: '선선한 바람과 노을처럼 아련하고 깊은 사색의 여운' },
          { type_code: 'winterSoul', text: '차가운 공기 속에서 더 선명해지는 실내의 포근함과 안정감' },
        ],
      },
      {
        text: '날씨 좋은 주말 오전, 가장 이상적인 나의 시간 보내기는?',
        options: [
          { type_code: 'springVibe', text: '새로 생긴 동네 카페나 전시를 구경하며 가볍게 돌아다닌다.' },
          { type_code: 'summerChill', text: '친구들과 야외 액티비티나 신나는 약속으로 에너지를 쓴다.' },
          { type_code: 'autumnDreamer', text: '이어폰 끼고 한적한 길을 걸으며 생각에 잠긴다.' },
          { type_code: 'winterSoul', text: '아늑한 공간에서 정성껏 커피를 내려 마시며 여유를 누린다.' },
        ],
      },
      {
        text: '갑자기 비가 쏟아지는 날, 내 마음의 온도는?',
        options: [
          { type_code: 'springVibe', text: '비가 그치고 나면 공기가 더 맑아질 거라 긍정적으로 본다.' },
          { type_code: 'summerChill', text: '시원하게 내리는 소나기가 오히려 상쾌하고 통쾌하다.' },
          { type_code: 'autumnDreamer', text: '빗소리와 어울리는 잔잔한 노래를 틀며 감성에 푹 빠진다.' },
          { type_code: 'winterSoul', text: '밖은 젖어도 안은 포근하니까 오히려 마음이 차분해진다.' },
        ],
      },
      {
        text: '주변 사람들이 자주 말하는 나의 분위기나 인상은?',
        options: [
          { type_code: 'springVibe', text: '밝고 유연해서 같이 있으면 기분이 산뜻해지는 사람' },
          { type_code: 'summerChill', text: '솔직하고 추진력 있어서 답답함을 뚫어주는 시원한 사람' },
          { type_code: 'autumnDreamer', text: '섬세하고 생각이 깊어서 대화할수록 매력이 느껴지는 사람' },
          { type_code: 'winterSoul', text: '차분하고 듬직해서 기대고 싶어지는 따뜻한 사람' },
        ],
      },
      {
        text: '평소 가장 손이 자주 가는 음악이나 플레이리스트 분위기는?',
        options: [
          { type_code: 'springVibe', text: '경쾌하고 상큼한 어쿠스틱·산뜻한 팝' },
          { type_code: 'summerChill', text: '템포 빠르고 에너지가 솟아나는 청량한 댄스·록' },
          { type_code: 'autumnDreamer', text: '가사가 깊이 와닿는 발라드·인디·재즈' },
          { type_code: 'winterSoul', text: '마음이 편안해지는 잔잔한 로파이·피아노·따뜻한 R&B' },
        ],
      },
      {
        text: '1년 중 가장 마음이 편안하고 "나답다"고 느끼는 풍경은?',
        options: [
          { type_code: 'springVibe', text: '연두빛 새싹과 꽃잎이 흩날리는 따스한 오후' },
          { type_code: 'summerChill', text: '푸른 바다와 뭉게구름이 선명한 활기찬 한낮' },
          { type_code: 'autumnDreamer', text: '붉게 물든 단풍길과 길게 드리워진 저녁 노을' },
          { type_code: 'winterSoul', text: '하얀 눈 내리는 창밖을 보며 따뜻한 불빛 아래 앉은 밤' },
        ],
      },
      {
        text: '예상치 못한 변화나 낯선 환경 앞에 섰을 때 나의 태도는?',
        options: [
          { type_code: 'springVibe', text: '호기심이 먼저 생겨 새로운 가능성을 즐겁게 탐색한다.' },
          { type_code: 'summerChill', text: '고민하기보다 직접 부딪혀 보며 빠르게 적응한다.' },
          { type_code: 'autumnDreamer', text: '상황의 의미를 차근차근 곱씹으며 신중하게 다가간다.' },
          { type_code: 'winterSoul', text: '흔들리지 않고 내 중심을 지키며 차분하게 자리를 잡는다.' },
        ],
      },
      {
        text: '소중한 사람과 가장 나누고 싶은 시간의 결은?',
        options: [
          { type_code: 'springVibe', text: '서로의 새로운 꿈과 소소한 설렘을 웃으며 이야기하는 시간' },
          { type_code: 'summerChill', text: '함께 여행하거나 새로운 걸 체험하며 신나게 웃는 시간' },
          { type_code: 'autumnDreamer', text: '평소 못 하던 깊은 속마음과 취향을 진솔하게 나누는 시간' },
          { type_code: 'winterSoul', text: '특별한 말 없이도 곁에 있어 주는 것만으로 든든한 시간' },
        ],
      },
      {
        text: '하루를 마무리하며 침대에 누웠을 때 가장 자주 드는 생각은?',
        options: [
          { type_code: 'springVibe', text: '"내일은 또 어떤 재밌는 아이디어를 해볼까?"' },
          { type_code: 'summerChill', text: '"오늘도 알차게 불태웠다! 내일도 시원하게 가보자"' },
          { type_code: 'autumnDreamer', text: '"오늘 스쳐 지나간 말과 장면들이 오래 여운이 남네"' },
          { type_code: 'winterSoul', text: '"무탈하게 하루를 잘 보냈다, 오늘의 나에게 수고했어"' },
        ],
      },
    ],
  },

  petPersonalityPreference: {
    // dogLover (강아지 애호가 🐶), catPerson (고양이족 😸), exoticPetFan (이색 반려동물 매니아 🦜), lovelyPetCollector (사랑스러운 반려동물 수집가 🌈)
    questions: [
      {
        text: '주말 아침 눈을 떴을 때, 상상만 해도 미소 지어지는 반려동물과의 풍경은?',
        options: [
          { type_code: 'dogLover', text: '꼬리 흔들며 달려와 반겨주는 아이와 함께 아침 산책 나가기' },
          { type_code: 'catPerson', text: '햇살 드는 창가에서 나란히 각자 여유롭게 뒹굴거리기' },
          { type_code: 'exoticPetFan', text: '앵무새·도마뱀·고슴도치 등 개성 만점 친구의 신기한 행동 관찰하기' },
          { type_code: 'lovelyPetCollector', text: '귀여운 소품으로 꾸민 공간에서 아이들 사진을 잔뜩 기록하기' },
        ],
      },
      {
        text: '친구 집에 놀러 갔는데 귀여운 반려동물이 있다면 나의 첫 반응은?',
        options: [
          { type_code: 'dogLover', text: '반갑게 이름 부르며 눈 맞추고 바로 장난감 들고 놀아준다.' },
          { type_code: 'catPerson', text: '놀라지 않게 적당한 거리를 두고 먼저 다가올 때까지 기다린다.' },
          { type_code: 'exoticPetFan', text: '품종과 습성, 먹이, 사육 환경까지 호기심 가득 물어본다.' },
          { type_code: 'lovelyPetCollector', text: '어느 동물이나 다 사랑스러워서 심쿵하며 사진부터 찍는다.' },
        ],
      },
      {
        text: '내가 꿈꾸는 반려동물과의 가장 이상적인 교감 방식은?',
        options: [
          { type_code: 'dogLover', text: '감정을 솔직하게 표현하고 온몸으로 애정을 주고받는 관계' },
          { type_code: 'catPerson', text: '서로의 독립적인 영역을 존중하다 가끔 기대오는 은은한 교감' },
          { type_code: 'exoticPetFan', text: '남들과 다른 독특한 매력과 생태를 이해하며 신뢰를 쌓는 관계' },
          { type_code: 'lovelyPetCollector', text: '다양한 동물 친구들의 각기 다른 귀여움을 매일 아낌없이 챙기는 관계' },
        ],
      },
      {
        text: '반려동물의 컨디션이 평소와 조금 달라 보일 때 나의 대처는?',
        options: [
          { type_code: 'dogLover', text: '곧장 곁을 지키며 빠르게 동물병원에 데려가 상태를 확인한다.' },
          { type_code: 'catPerson', text: '스트레스받지 않게 조용한 환경을 만들어주고 변화 기록 후 병원에 문의한다.' },
          { type_code: 'exoticPetFan', text: '온도·습도·식단 등 세부 환경 수치를 점검하고 전문 병원을 찾는다.' },
          { type_code: 'lovelyPetCollector', text: '평소 정리해 둔 건강 수첩과 사진을 챙겨 바로 수의사 상담을 받는다.' },
        ],
      },
      {
        text: '유튜브나 SNS에서 가장 오래 멈춰 서서 보게 되는 동물 콘텐츠는?',
        options: [
          { type_code: 'dogLover', text: '주인 바라기 대형견·소형견의 신나는 산책과 애교 브이로그' },
          { type_code: 'catPerson', text: '도도하면서도 은근 다정한 고양이의 힐링 일상 영상' },
          { type_code: 'exoticPetFan', text: '희귀 파충류·앵무새·수달 등 흔치 않은 이색 반려동물 채널' },
          { type_code: 'lovelyPetCollector', text: '강아지·고양이·햄스터·토끼 등 온갖 귀여운 동물 모음집' },
        ],
      },
      {
        text: '반려동물과 함께 휴가를 떠난다면 가장 끌리는 스타일은?',
        options: [
          { type_code: 'dogLover', text: '넓은 잔디 운동장이 있는 애견 펜션에서 신나게 뛰어놀기' },
          { type_code: 'catPerson', text: '낯선 이동 스트레스 없이 익숙하고 아늑한 집에서 함께 홈캉스' },
          { type_code: 'exoticPetFan', text: '반려동물의 생태를 배울 수 있는 특색 있는 박람회나 테마 공간 방문' },
          { type_code: 'lovelyPetCollector', text: '예쁜 포토존과 펫 굿즈가 가득한 감성 펫 프렌들리 카페 투어' },
        ],
      },
      {
        text: '반려동물 취향이 비슷한 친구와 만나면 주로 나누는 이야기는?',
        options: [
          { type_code: 'dogLover', text: '"우리 같이 공원 산책 모임 하자!" 활발한 만남 약속' },
          { type_code: 'catPerson', text: '"우리 애가 어제 처음으로 무릎에 올라왔어" 소소한 밀당 자랑' },
          { type_code: 'exoticPetFan', text: '"그 종은 습도 관리가 핵심이더라" 깊이 있는 사육 정보 공유' },
          { type_code: 'lovelyPetCollector', text: '서로 핸드폰 앨범 속 귀여운 사진과 예쁜 펫 아이템 자랑' },
        ],
      },
      {
        text: '평생 함께할 반려동물을 떠올릴 때 가장 마음이 가는 매력 포인트는?',
        options: [
          { type_code: 'dogLover', text: '언제나 내 편이 되어줄 것 같은 충성심과 넘치는 에너지' },
          { type_code: 'catPerson', text: '조용하고 깔끔하며 선을 지키는 우아하고 신비로운 매력' },
          { type_code: 'exoticPetFan', text: '남들 눈엔 낯설어도 나에겐 특별한 독창적이고 개성 있는 모습' },
          { type_code: 'lovelyPetCollector', text: '하나만 고르기 어려울 만큼 종을 가리지 않는 다채로운 사랑스러움' },
        ],
      },
      {
        text: '반려동물과의 일상을 기록한다면 어떤 형태가 가장 나다울까?',
        options: [
          { type_code: 'dogLover', text: '함께 뛰어놀고 교감한 활기찬 순간을 담은 브이로그' },
          { type_code: 'catPerson', text: '조용한 오후의 따뜻한 시선을 담은 차분한 사진 일기' },
          { type_code: 'exoticPetFan', text: '성장 과정과 행동 습성을 꼼꼼히 정리한 관찰 노트' },
          { type_code: 'lovelyPetCollector', text: '귀여운 포토카드·달력·굿즈로 만들어 예쁘게 소장하기' },
        ],
      },
      {
        text: '반려동물 용품숍에 들어갔을 때 나의 쇼핑 스타일은?',
        options: [
          { type_code: 'dogLover', text: '튼튼한 산책 하네스, 터그 놀이 장난감 등 활동용품부터 챙긴다.' },
          { type_code: 'catPerson', text: '집 인테리어와 어울리는 깔끔한 숨숨집·스크래처를 고른다.' },
          { type_code: 'exoticPetFan', text: '특수 사육장·전용 조명·맞춤 먹이 등 전문 장비를 꼼꼼히 본다.' },
          { type_code: 'lovelyPetCollector', text: '계절별 귀여운 옷, 아기자기한 소품, 신상 아이템을 다양하게 모은다.' },
        ],
      },
    ],
  },

  friendshipCompatibility: {
    // typeA (소중한 친구 - 깊은 신뢰/속마음), typeB (이해심 많은 친구 - 따뜻한 공감/배려), typeC (편안한 친구 - 부담 없는 힐링/유쾌), typeD (서로 존중하는 친구 - 독립/건강한 거리)
    questions: [
      {
        text: '주말에 친한 친구와 약속을 잡을 때, 가장 편안한 방식은?',
        options: [
          { type_code: 'typeA', text: '미리 시간 맞춰 만나 오붓하게 속마음 나누기 좋은 코스를 잡는다.' },
          { type_code: 'typeB', text: '친구의 요즘 컨디션과 기분을 먼저 물어보고 맞춰서 정한다.' },
          { type_code: 'typeC', text: '거창한 계획 없이 "나올래?" 한마디에 동네에서 가볍게 만난다.' },
          { type_code: 'typeD', text: '서로 바쁜 일정을 존중해 각자 편한 시간대에 깔끔하게 조율한다.' },
        ],
      },
      {
        text: '친구와 사소한 오해나 갈등이 생겼을 때 나는 어떻게 풀어갈까?',
        options: [
          { type_code: 'typeA', text: '신뢰가 깨지지 않도록 솔직하게 내 마음을 털어놓고 바로 대화한다.' },
          { type_code: 'typeB', text: '친구가 왜 서운했을지 입장을 먼저 헤아리며 부드럽게 다가간다.' },
          { type_code: 'typeC', text: '분위기가 무거워지지 않게 맛있는 걸 먹으며 자연스럽게 웃고 푼다.' },
          { type_code: 'typeD', text: '서로 감정을 정리할 시간을 충분히 가진 뒤 차분하게 의견을 나눈다.' },
        ],
      },
      {
        text: '친구의 생일이 다가왔을 때, 나만의 축하 방식은?',
        options: [
          { type_code: 'typeA', text: '평소 친구가 흘리듯 말했던 걸 기억해 진심 어린 편지와 선물을 준비한다.' },
          { type_code: 'typeB', text: '요즘 친구에게 꼭 필요하거나 위로가 될 세심한 선물을 고른다.' },
          { type_code: 'typeC', text: '격식보다 같이 맛있는 거 먹고 실컷 웃는 즐거운 하루를 보낸다.' },
          { type_code: 'typeD', text: '부담스럽지 않으면서 실용적인 선물과 진심 어린 축하 메시지를 전한다.' },
        ],
      },
      {
        text: '친구가 크게 지쳐서 힘들어할 때, 내가 가장 먼저 해주는 행동은?',
        options: [
          { type_code: 'typeA', text: '끝까지 비밀을 지켜주며 솔직한 조언과 든든한 응원을 건넨다.' },
          { type_code: 'typeB', text: '판단하지 않고 묵묵히 곁에 앉아 친구의 감정을 끝까지 들어준다.' },
          { type_code: 'typeC', text: '잠시라도 숨 돌릴 수 있게 가벼운 산책이나 맛있는 야식으로 기분을 풀어준다.' },
          { type_code: 'typeD', text: '혼자 정리할 시간이 필요할지 먼저 묻고, 도움을 청하면 바로 손을 내민다.' },
        ],
      },
      {
        text: '친구가 나 말고 다른 친구들과도 즐겁게 어울리는 모습을 볼 때?',
        options: [
          { type_code: 'typeA', text: '우리만의 깊은 신뢰가 있으니까 흔들리지 않고 기분 좋게 본다.' },
          { type_code: 'typeB', text: '친구가 좋은 사람들 옆에서 행복해 보여서 나까지 흐뭇해진다.' },
          { type_code: 'typeC', text: '나중에 다 같이 놀아도 재밌겠다며 쿨하고 유쾌하게 넘긴다.' },
          { type_code: 'typeD', text: '각자의 인간관계와 개인 영역이 있는 건 당연하다고 자연스럽게 존중한다.' },
        ],
      },
      {
        text: '오랜만에 만난 친구와 가장 자주 나누게 되는 대화 주제는?',
        options: [
          { type_code: 'typeA', text: '남들에겐 쉽게 못 꺼내는 진지한 속마음과 인생 이야기' },
          { type_code: 'typeB', text: '요즘 힘들었던 감정과 서로의 안부를 세심하게 챙기는 이야기' },
          { type_code: 'typeC', text: '별거 아닌 일상 수다와 배꼽 빠지게 웃기는 유쾌한 에피소드' },
          { type_code: 'typeD', text: '각자의 일·목표·취향 근황을 담백하게 공유하고 응원하는 이야기' },
        ],
      },
      {
        text: '친구와의 약속 시간과 매너에 대한 나의 평소 스타일은?',
        options: [
          { type_code: 'typeA', text: '약속은 신뢰의 기본! 늘 제시간에 맞춰 믿음을 지킨다.' },
          { type_code: 'typeB', text: '친구가 조금 늦더라도 사정이 있겠거니 너그럽게 이해해 준다.' },
          { type_code: 'typeC', text: '칼같이 재기보다 상황에 맞춰 유연하고 편하게 흘러가도 괜찮다.' },
          { type_code: 'typeD', text: '서로의 시간을 아끼기 위해 변경이 필요하면 미리 깔끔하게 공유한다.' },
        ],
      },
      {
        text: '친구와 둘이 여행을 떠난다면 어떤 리듬이 가장 잘 맞을까?',
        options: [
          { type_code: 'typeA', text: '밤늦게까지 숙소에서 진솔한 이야기를 나누며 추억을 쌓는 여행' },
          { type_code: 'typeB', text: '서로 체력과 취향을 세심하게 배려하며 맞추는 따뜻한 여행' },
          { type_code: 'typeC', text: '별 계획 없이 걷고 먹고 웃는 것만으로도 힐링되는 편안한 여행' },
          { type_code: 'typeD', text: '함께 다니다가도 잠깐씩 각자 보고 싶은 곳을 다녀올 수 있는 자유로운 여행' },
        ],
      },
      {
        text: '친구가 "이건 진짜 너한테만 말하는 거야"라며 비밀을 털어놨을 때?',
        options: [
          { type_code: 'typeA', text: '무덤까지 가져간다는 마음으로 절대 입 밖에 내지 않고 신뢰를 지킨다.' },
          { type_code: 'typeB', text: '얼마나 믿고 말해줬을지 생각하며 친구의 마음부터 따뜻하게 안아준다.' },
          { type_code: 'typeC', text: '비밀 얘기가 부담으로 남지 않게 평소처럼 편안하게 대해준다.' },
          { type_code: 'typeD', text: '더 캐묻지 않고 친구가 말하고 싶은 선까지만 존중하며 지켜준다.' },
        ],
      },
      {
        text: '친구에게 꼭 해주고 싶은 진심 어린 말이 생겼을 때 나는?',
        options: [
          { type_code: 'typeA', text: '빙빙 돌리지 않고 진심을 담아 솔직하게 직접 전해준다.' },
          { type_code: 'typeB', text: '친구가 상처받지 않도록 따뜻한 표현을 신중히 골라 전한다.' },
          { type_code: 'typeC', text: '어색하지 않게 평소처럼 가벼운 농담을 섞어 자연스럽게 건넨다.' },
          { type_code: 'typeD', text: '친구의 선택을 존중한다는 전제를 담아 담백하게 의견을 전한다.' },
        ],
      },
      {
        text: '카페에 마주 앉아 있을 때 내가 가장 좋아하는 친구와의 분위기는?',
        options: [
          { type_code: 'typeA', text: '눈치 볼 필요 없이 깊은 고민과 본심을 편하게 꺼내는 밀도 있는 시간' },
          { type_code: 'typeB', text: '서로의 이야기를 고개 끄덕이며 진심으로 들어주는 온기 가득한 시간' },
          { type_code: 'typeC', text: '아무 말 없이 폰을 보거나 웃고 떠들어도 전혀 어색하지 않은 편안한 시간' },
          { type_code: 'typeD', text: '서로의 다름을 인정하며 담백하게 아이디어를 나누는 건강한 시간' },
        ],
      },
      {
        text: '자주 연락하던 친구가 며칠째 답장이 뜸할 때 나의 반응은?',
        options: [
          { type_code: 'typeA', text: '무슨 일 있나 싶어 진심으로 안부를 묻는 짧은 카톡을 남긴다.' },
          { type_code: 'typeB', text: '요즘 많이 바쁘거나 지쳤나 보다 이해하며 부담 없게 기다린다.' },
          { type_code: 'typeC', text: '며칠 뒤에 아무 일 없던 것처럼 편하게 연락 오면 반갑게 받는다.' },
          { type_code: 'typeD', text: '각자 집중해야 할 시기가 있는 법이니 자연스럽게 존중하며 내 일상을 보낸다.' },
        ],
      },
    ],
  },

  workLifeBalanceTest: {
    // dynamicDynamo (역동적인 다이너모), strategicStar (전략적인 스타), soulfulSeeker (감성적인 탐구자), calmComet (차분한 혜성)
    questions: [
      {
        text: '회사에서 완전히 새로운 신규 프로젝트를 맡게 되었을 때 나의 첫 반응은?',
        options: [
          { type_code: 'dynamicDynamo', text: '가슴이 뛴다! 일단 아이디어를 빠르게 프로토타입으로 실행해본다.' },
          { type_code: 'strategicStar', text: '목표 지표와 리스크, 단계별 일정을 체계적으로 먼저 설계한다.' },
          { type_code: 'soulfulSeeker', text: '이 일이 고객과 팀에 어떤 의미가 있을지 동료들과 이야기를 나눈다.' },
          { type_code: 'calmComet', text: '감정에 휩쓸리지 않고 우선순위를 차분하게 정리하며 착수한다.' },
        ],
      },
      {
        text: '상사가 갑자기 일정에 없던 급한 업무를 요청했을 때 나는?',
        options: [
          { type_code: 'dynamicDynamo', text: '돌파구를 빠르게 찾아 주도적으로 해결하고 성과로 보여준다.' },
          { type_code: 'strategicStar', text: '기존 업무와의 우선순위·마감 영향도를 근거 있게 조율한다.' },
          { type_code: 'soulfulSeeker', text: '왜 급하게 필요한지 배경을 경청하고 팀원들과 협력할 방법을 찾는다.' },
          { type_code: 'calmComet', text: '당황하지 않고 가능한 범위와 단계를 냉정하게 나눠 차근차근 처리한다.' },
        ],
      },
      {
        text: '업무 스트레스가 확 쌓였을 때, 나만의 가장 효과적인 회복법은?',
        options: [
          { type_code: 'dynamicDynamo', text: '운동으로 땀을 빼거나 새로운 자극을 찾아 에너지를 전환한다.' },
          { type_code: 'strategicStar', text: '스트레스 원인을 메모로 정리해 다음엔 안 겪도록 시스템을 개선한다.' },
          { type_code: 'soulfulSeeker', text: '마음 맞는 사람과 속 깊은 대화를 나누거나 감성 취미로 마음을 달랜다.' },
          { type_code: 'calmComet', text: '조용한 공간에서 혼자 쉬며 호흡을 고르고 페이스를 되찾는다.' },
        ],
      },
      {
        text: '팀 회의에서 의견이 팽팽하게 맞설 때 내가 주로 맡는 역할은?',
        options: [
          { type_code: 'dynamicDynamo', text: '결론이 나도록 과감한 실행안을 제시하며 논의를 앞으로 끈다.' },
          { type_code: 'strategicStar', text: '객관적인 데이터와 장단점을 비교 정리해 합리적 기준을 세운다.' },
          { type_code: 'soulfulSeeker', text: '소외된 의견을 경청하고 서로의 입장을 부드럽게 조율한다.' },
          { type_code: 'calmComet', text: '과열된 분위기를 진정시키며 핵심 쟁점을 차분히 정리해 준다.' },
        ],
      },
      {
        text: '난이도가 높은 과제를 받았을 때 가장 몰입이 잘 되는 방식은?',
        options: [
          { type_code: 'dynamicDynamo', text: '직접 부딪혀 시도하고 피드백을 받으며 빠르게 개선해 나갈 때' },
          { type_code: 'strategicStar', text: '전체 구조를 빈틈없이 분석하고 완성도 높은 로드맵을 짤 때' },
          { type_code: 'soulfulSeeker', text: '동료들과 아이디어를 나누며 서로 시너지를 만들어 갈 때' },
          { type_code: 'calmComet', text: '복잡한 문제를 작은 단위로 쪼개 묵묵히 하나씩 완수해 갈 때' },
        ],
      },
      {
        text: '직장에서 "일할 맛 난다!"고 느끼는 최고의 순간은?',
        options: [
          { type_code: 'dynamicDynamo', text: '내가 주도한 시도가 눈에 보이는 큰 성과로 이어졌을 때' },
          { type_code: 'strategicStar', text: '치밀하게 준비한 계획이 오차 없이 완벽하게 마무리되었을 때' },
          { type_code: 'soulfulSeeker', text: '동료들과 깊은 신뢰를 쌓고 "덕분에 힘이 났다"는 말을 들을 때' },
          { type_code: 'calmComet', text: '위기 상황에서도 흔들리지 않고 팀의 중심을 지켜냈을 때' },
        ],
      },
      {
        text: '연차나 워라밸을 지키는 나만의 스타일은?',
        options: [
          { type_code: 'dynamicDynamo', text: '일할 땐 화끈하게 끝내고, 쉴 땐 활동적으로 완벽히 즐긴다.' },
          { type_code: 'strategicStar', text: '미리 업무 공백이 없도록 인수인계와 일정을 완벽히 세팅하고 쉰다.' },
          { type_code: 'soulfulSeeker', text: '팀원들과 서로 배려하며 눈치 보지 않는 건강한 문화를 만든다.' },
          { type_code: 'calmComet', text: '감정 소모 없이 일과 휴식의 경계를 일정하고 안정적으로 유지한다.' },
        ],
      },
      {
        text: '직장에서 좋은 평가나 칭찬을 들었을 때 나의 속마음은?',
        options: [
          { type_code: 'dynamicDynamo', text: '"좋아! 이 기세로 다음엔 더 큰 도전을 해봐야지!"' },
          { type_code: 'strategicStar', text: '"분석하고 준비한 전략이 정확히 맞아떨어졌구나."' },
          { type_code: 'soulfulSeeker', text: '"혼자 한 게 아니라 함께 도와준 동료들 덕분이지!"' },
          { type_code: 'calmComet', text: '"들뜨지 말고 늘 하던 대로 꾸준히 완성도를 지켜나가자."' },
        ],
      },
      {
        text: '이직이나 새로운 커리어 전환을 고민할 때 가장 중시하는 기준은?',
        options: [
          { type_code: 'dynamicDynamo', text: '빠르게 성장하고 주도적으로 도전할 기회가 얼마나 많은가' },
          { type_code: 'strategicStar', text: '장기적인 커리어 비전과 보상·체계가 얼마나 명확한가' },
          { type_code: 'soulfulSeeker', text: '함께 일할 사람들의 문화와 내가 하는 일의 가치가 나와 맞는가' },
          { type_code: 'calmComet', text: '불필요한 소모 없이 지속 가능하고 안정적으로 역량을 발휘할 수 있는가' },
        ],
      },
      {
        text: '마감이 코앞인데 예상치 못한 변수가 터졌을 때 나의 대응은?',
        options: [
          { type_code: 'dynamicDynamo', text: '즉시 대안을 실행하며 돌파구를 만들어 마감을 사수한다.' },
          { type_code: 'strategicStar', text: '원인을 빠르게 진단하고 영향도를 계산해 최적의 수정안을 낸다.' },
          { type_code: 'soulfulSeeker', text: '관련자들에게 투명하게 공유하고 서로 힘을 합쳐 해결책을 찾는다.' },
          { type_code: 'calmComet', text: '침착하게 숨을 고른 뒤 가장 시급한 문제부터 순서대로 해결한다.' },
        ],
      },
      {
        text: '올해 회사의 핵심 목표로 "팀워크와 협업 강화"가 발표되었다면?',
        options: [
          { type_code: 'dynamicDynamo', text: '새로운 협업 방식이나 프로젝트 개선안을 먼저 제안해 본다.' },
          { type_code: 'strategicStar', text: '역할 분담과 협업 프로세스를 명확히 문서화하자고 제안한다.' },
          { type_code: 'soulfulSeeker', text: '동료들과 소통할 기회를 늘리며 팀 분위기를 따뜻하게 이끈다.' },
          { type_code: 'calmComet', text: '내 파트를 안정적으로 책임지며 동료들이 믿고 기댈 기반이 된다.' },
        ],
      },
      {
        text: '상사나 동료와 업무 방식이 달라 고민이 생겼을 때 나는?',
        options: [
          { type_code: 'dynamicDynamo', text: '더 나은 결과를 위해 솔직하고 적극적으로 개선 의견을 제시한다.' },
          { type_code: 'strategicStar', text: '객관적인 근거와 대안을 정리한 뒤 논리적으로 대화를 요청한다.' },
          { type_code: 'soulfulSeeker', text: '상대방의 의도와 입장을 먼저 들어보며 공감대를 찾아간다.' },
          { type_code: 'calmComet', text: '감정적 충돌을 피하고 차분히 조율 가능한 현실적 접점을 찾는다.' },
        ],
      },
    ],
  },
};

// =============================================================================
// 2. TARGETED OPTION POLISH ON EXISTING TYPE TESTS
// =============================================================================
const TYPE_POLISH = {
  commuteBgmSurvivalType: {
    rotate: true,
    optionUpdatesByQNum: {
      4: { OFFICE_SOCIALITE: '팀원들과 함께 아이디어를 나누며 브레인스토밍한다' },
      6: { OFFICE_SOCIALITE: '오늘 만날 사람들과 어울릴 코디를 신경 써서 고른다' },
      7: {
        OFFICE_SOCIALITE: '친구들과 모여 수다 떨고 즐겁게 논다',
        QUIET_SCHOLAR: '혼자서 책을 읽거나 깊이 있는 영화를 감상한다',
      },
    },
  },
  officePhoneUsageKkondaeLevel: {
    rotate: true,
    optionUpdatesByQNum: {
      1: {
        POLITE_PROFESSIONAL: '네! 미리 정리해서 공유 폴더에 올려두었습니다.',
        MODERN_KKONDAE: '당연하죠, 요즘 다들 발표 전에 기본은 챙기잖아요?',
        STRICTLY_TRADITIONAL: '회의 시작 전에 출력과 검토까지 모두 마쳤습니다.',
        SMARTPHONE_WORSHIPPER: '앗, 지금 폰 메모장에 적어둔 거 바로 띄울게요!',
      },
      3: {
        POLITE_PROFESSIONAL: '잠시 쉬었다 갈까요? 제가 핵심 내용 다시 정리해 드릴게요.',
        MODERN_KKONDAE: '요즘 많이 피곤한가 보네~ 근데 회의 집중은 좀 하자!',
        STRICTLY_TRADITIONAL: '회의 중에 스마트폰 보며 조는 건 기본 태도가 아니죠.',
        SMARTPHONE_WORSHIPPER: '오, 나도 지금 몰래 폰 보는 중이라 그냥 못 본 척한다.',
      },
      4: {
        POLITE_PROFESSIONAL: '양해를 구하고 문자로 회의 후 연락드리겠다고 보낸다.',
        MODERN_KKONDAE: '급한 업무 전화면 받아야지, 근데 회의 매너는 지키면서 받아야 해.',
        STRICTLY_TRADITIONAL: '회의 중에는 무조건 무음! 끝나기 전엔 절대 받지 않는다.',
        SMARTPHONE_WORSHIPPER: '중요한 연락일 수도 있으니 자리에서 슬쩍 확인부터 한다.',
      },
      6: {
        POLITE_PROFESSIONAL: '중요한 결정 사항은 회의록에 정리해서 다시 공유해 준다.',
        MODERN_KKONDAE: '나도 폰 보긴 하는데, 회의할 땐 눈치껏 해야지 않겠어?',
        STRICTLY_TRADITIONAL: '회의 시간에 개인 SNS는 절대 금지라고 단호히 말한다.',
        SMARTPHONE_WORSHIPPER: '멀티태스킹만 잘하면 괜찮지! 나도 슬쩍 알림 확인한다.',
      },
      10: {
        POLITE_PROFESSIONAL: '바로 무음 전환하고 회의 흐름을 끊어 죄송하다고 정중히 사과한다.',
        MODERN_KKONDAE: '아이고 죄송합니다~ 다들 회의 전엔 매너모드 체크합시다!',
        STRICTLY_TRADITIONAL: '회의 입장 전 무음 확인은 기본인데, 스스로 크게 반성한다.',
        SMARTPHONE_WORSHIPPER: '어머, 진동인 줄 알았네! 민망하게 웃으며 얼른 끈다.',
      },
    },
  },
  subscriptionSpenderQuiz: {
    rotate: false, // already varied!
    optionUpdatesByQNum: {
      1: {
        FOMO_SUBSCRIBER: '남들 다 혜택 챙기는데 나만 손해 보는 느낌이라 결제한다',
        CANCEL_APATHETIC: '첫 달 무료만 눌러놓고 해지 날짜는 까맣게 잊어버린다',
      },
      3: {
        FOMO_SUBSCRIBER: '주변에서 다 광고 없이 본다니까 나만 뒤처질까 봐 유지한다',
        IMPULSIVE_SPENDER: '이미 결제된 김에 프리미엄 멤버십 다른 기능도 더 지른다',
      },
      4: {
        CANCEL_APATHETIC: '기존 구독도 해지 못 했지만 귀찮아서 일단 이것도 추가한다',
      },
      6: {
        FOMO_SUBSCRIBER: '남들 다 보는 최신 시사 트렌드를 놓칠까 봐 일단 유지한다',
      },
    },
  },
  weddingNewsAttitudeTest: {
    rotate: false, // already varied!
    optionUpdatesByQNum: {
      6: {
        RESENTFUL_COMPARATOR: '예쁘긴 한데, 나는 언제쯤 이런 결혼 준비 해보나 씁쓸해진다.',
      },
      8: {
        EXCITED_PARTYGOER: '아니야! 오늘 피로연이랑 뒤풀이가 너무 기대돼서 설레서 그래~!',
      },
    },
  },
};

async function main() {
  const targetTestIds = [
    ...Object.keys(CATEGORICAL_OVERHAUL),
    ...Object.keys(TYPE_POLISH),
    'hogu',
  ];

  // 0. FULL BACKUP FIRST
  const backup = { createdAt: new Date().toISOString(), tests: {} };
  for (const testId of targetTestIds) {
    const { data: questions } = await supabase
      .from('questions')
      .select('*')
      .eq('test_id', testId)
      .order('question_number');
    const qIds = (questions || []).map((q) => q.id);
    const { data: options } = await supabase
      .from('options')
      .select('*')
      .in('question_id', qIds.length ? qIds : [-1])
      .order('question_id')
      .order('option_index');
    const { data: resultTypes } = await supabase
      .from('result_types')
      .select('*')
      .eq('test_id', testId)
      .order('id');
    backup.tests[testId] = { questions, options, resultTypes };
  }

  const backupDir = path.join(process.cwd(), 'artifacts', 'backup');
  fs.mkdirSync(backupDir, { recursive: true });
  const stamp = new Date().toISOString().replace(/[:.]/g, '-');
  const backupFile = path.join(backupDir, `tests_scoring_backup_${stamp}.json`);
  fs.writeFileSync(backupFile, JSON.stringify(backup, null, 2), 'utf8');
  console.log(`Backup saved -> ${backupFile}`);

  // 1. OVERHAUL 6 CATEGORICAL TESTS (SCORE -> TYPE)
  for (const [testId, spec] of Object.entries(CATEGORICAL_OVERHAUL)) {
    const { questions, options, resultTypes } = backup.tests[testId];
    if (questions.length !== spec.questions.length) {
      throw new Error(`${testId}: question count mismatch (${questions.length} vs ${spec.questions.length})`);
    }

    const validCodes = new Set(resultTypes.map((r) => r.code));
    for (let i = 0; i < questions.length; i++) {
      const q = questions[i];
      const qSpec = spec.questions[i];
      const qOpts = options.filter((o) => o.question_id === q.id).sort((a, b) => a.option_index - b.option_index);
      if (qOpts.length !== 4) {
        throw new Error(`${testId} Q${q.question_number}: expected 4 options, got ${qOpts.length}`);
      }

      const { error: qErr } = await supabase
        .from('questions')
        .update({ text: qSpec.text })
        .eq('id', q.id);
      if (qErr) throw qErr;

      const rotated = rotateOptions(qSpec.options, i);
      for (let j = 0; j < 4; j++) {
        const optSpec = rotated[j];
        if (!validCodes.has(optSpec.type_code)) {
          throw new Error(`${testId} invalid code ${optSpec.type_code}`);
        }
        const { error: oErr } = await supabase
          .from('options')
          .update({
            text: optSpec.text,
            type_code: optSpec.type_code,
            score: null,
            option_index: j,
          })
          .eq('id', qOpts[j].id);
        if (oErr) throw oErr;
      }
    }

    // Clear min_score/max_score on result_types for TYPE mode
    const { error: rErr } = await supabase
      .from('result_types')
      .update({ min_score: null, max_score: null })
      .eq('test_id', testId);
    if (rErr) throw rErr;

    console.log(`[CONVERTED -> TYPE] ${testId} (${questions.length}Q, ${options.length} opts)`);
  }

  // 2. FIX HOGU: symmetric quartiles (0..6, 7..12, 13..17, 18..999) + alternating A/B position
  {
    const { questions, options, resultTypes } = backup.tests.hogu;
    const hoguRanges = {
      PREDATOR: { min_score: 0, max_score: 6 },
      CAT: { min_score: 7, max_score: 12 },
      DEER: { min_score: 13, max_score: 17 },
      RETRIEVER: { min_score: 18, max_score: 999 },
    };
    for (const r of resultTypes) {
      const range = hoguRanges[r.code];
      if (!range) continue;
      const { error } = await supabase
        .from('result_types')
        .update(range)
        .eq('id', r.id);
      if (error) throw error;
    }

    // Alternate option_index on odd questions so score=2 isn't always button A (2-phase to respect unique constraint)
    for (let i = 0; i < questions.length; i++) {
      const q = questions[i];
      const qOpts = options.filter((o) => o.question_id === q.id).sort((a, b) => a.option_index - b.option_index);
      if (qOpts.length !== 2) continue;
      const optHigh = qOpts.find((o) => o.score === 2);
      const optLow = qOpts.find((o) => o.score === 0);
      if (!optHigh || !optLow) continue;
      const desiredHighIdx = i % 2 === 0 ? 0 : 1;
      const desiredLowIdx = 1 - desiredHighIdx;
      if (optHigh.option_index === desiredHighIdx && optLow.option_index === desiredLowIdx) continue;
      const { error: t1 } = await supabase.from('options').update({ option_index: 100 }).eq('id', optHigh.id);
      const { error: t2 } = await supabase.from('options').update({ option_index: 101 }).eq('id', optLow.id);
      if (t1 || t2) throw t1 || t2;
      const { error: e1 } = await supabase.from('options').update({ option_index: desiredHighIdx }).eq('id', optHigh.id);
      const { error: e2 } = await supabase.from('options').update({ option_index: desiredLowIdx }).eq('id', optLow.id);
      if (e1 || e2) throw e1 || e2;
    }
    console.log(`[FIXED SCORE+BALANCE] hogu (symmetric cutoffs 0..6 / 7..12 / 13..17 / 18..999 + alternating A/B)`);
  }

  // 3. POLISH 4 EXISTING TYPE TESTS
  for (const [testId, spec] of Object.entries(TYPE_POLISH)) {
    const { questions, options } = backup.tests[testId];
    let textUpdates = 0;
    let rotatedQs = 0;

    for (let i = 0; i < questions.length; i++) {
      const q = questions[i];
      const qOpts = options.filter((o) => o.question_id === q.id).sort((a, b) => a.option_index - b.option_index);
      const updates = spec.optionUpdatesByQNum[q.question_number] || {};

      for (const o of qOpts) {
        if (updates[o.type_code]) {
          const { error } = await supabase
            .from('options')
            .update({ text: updates[o.type_code] })
            .eq('id', o.id);
          if (error) throw error;
          textUpdates++;
        }
      }

      if (spec.rotate && qOpts.length === 4) {
        const shift = (i * 3 + 1) % 4;
        // Phase 1: move to temporary non-colliding indices
        for (let j = 0; j < 4; j++) {
          const { error } = await supabase
            .from('options')
            .update({ option_index: 100 + j })
            .eq('id', qOpts[j].id);
          if (error) throw error;
        }
        // Phase 2: move to final rotated indices
        for (let j = 0; j < 4; j++) {
          const newIdx = (j + shift) % 4;
          const { error } = await supabase
            .from('options')
            .update({ option_index: newIdx })
            .eq('id', qOpts[j].id);
          if (error) throw error;
        }
        rotatedQs++;
      }
    }
    console.log(`[POLISHED TYPE] ${testId} (textUpdates=${textUpdates}, rotatedQs=${rotatedQs})`);
  }

  console.log('\nALL DB UPDATES COMPLETED SUCCESSFULLY!');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
