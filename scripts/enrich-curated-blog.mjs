import { createClient } from '@supabase/supabase-js';

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !key) throw new Error('Supabase credentials required');

const supabase = createClient(url, key, {
  auth: { persistSession: false, autoRefreshToken: false },
});

const ENRICH_APPEND = {
  7: `
<h2>환경과 생애 주기에 따라 결과가 달라지는 3가지 현실적 이유</h2>
<p>실제로 같은 사람이 2~3년 간격으로 검사를 다시 해보면 한두 글자가 바뀌는 경우가 흔합니다. 이는 성격의 뿌리가 완전히 뒤바뀌었다기보다, 현재 처한 역할과 환경에 맞춰 <strong>덜 쓰던 기능을 의식적으로 계발했기 때문</strong>인 경우가 많습니다.</p>
<ul>
  <li><strong>직무와 역할의 변화:</strong> 원래 인식형(P) 성향이 강하던 사람도 프로젝트 일정을 책임지는 팀장이 되면 계획표와 마감 관리(J 행동)를 습관화하게 됩니다.</li>
  <li><strong>경계선(50% 부근) 점수:</strong> 특정 지표에서 어느 한쪽 선호가 52:48처럼 근소하게 나타나는 경우, 검사 당일의 컨디션이나 최근 겪은 사건에 따라 결과가 뒤집히기 쉽습니다.</li>
  <li><strong>심리적 성숙과 균형:</strong> 20대에는 주기능을 강하게 밀어붙이다가 30~40대에 접어들며 반대편 기능(예: 사고형이 공감을 배우거나, 감정형이 객관적 기준을 세우는 과정)을 통합하면서 답변이 부드러워집니다.</li>
</ul>
<h2>내 진짜 선호를 점검하는 실전 체크리스트</h2>
<table>
  <thead>
    <tr><th>구분</th><th>본래 선호(타고난 편함)</th><th>환경 적응(학습된 습관)</th></tr>
  </thead>
  <tbody>
    <tr><td>에너지 소모</td><td>하고 나면 자연스럽고 피로가 덜함</td><td>해낼 수는 있지만 끝나면 급격히 지침</td></tr>
    <tr><td>스트레스 상황</td><td>무의식적으로 원래 방식으로 되돌아감</td><td>여유가 없을 때 가장 먼저 무너짐</td></tr>
    <tr><td>휴식 시간</td><td>아무도 보지 않을 때 선택하는 방식</td><td>평가나 마감 때문에 유지하는 방식</td></tr>
  </tbody>
</table>
<p>따라서 결과가 바뀌었다고 혼란스러워하기보다, <a href="/type" class="text-pink-600 font-bold hover:underline">16가지 MBTI 유형 백과</a>에서 두 유형의 설명을 나란히 읽고 <strong>아무런 의무가 없는 휴일에 내가 가장 편하게 쓰는 방식</strong>이 어느 쪽인지 비교해 보는 것이 훨씬 정확합니다.</p>
`,
  8: `
<h2>기질별(NT·NF·SJ·SP) 리더십 강점과 보완 포인트 비교</h2>
<p>특정 MBTI 유형만이 좋은 리더가 되는 것은 아닙니다. 조직의 성장 단계와 팀 구성원의 특성에 따라 빛나는 리더십의 형태가 달라집니다.</p>
<table>
  <thead>
    <tr><th>기질 그룹</th><th>대표 리더십 스타일</th><th>강점이 빛나는 상황</th><th>주의할 맹점</th></tr>
  </thead>
  <tbody>
    <tr><td><strong>분석가형 (NT)</strong></td><td>전략·비전 중심형</td><td>신사업 기획, 구조 개편, 복잡한 문제 해결</td><td>성과에 집중하다 팀원의 감정 피로를 놓치기 쉬움</td></tr>
    <tr><td><strong>외교관형 (NF)</strong></td><td>공감·동기부여형</td><td>팀 문화 구축, 구성원 성장 코칭, 갈등 중재</td><td>어려운 거절이나 냉정한 성과 평가를 미룰 수 있음</td></tr>
    <tr><td><strong>관리자형 (SJ)</strong></td><td>체계·운영 안정형</td><td>품질 유지, 프로세스 표준화, 일정 준수</td><td>전례 없는 빠른 변화에 보수적으로 반응할 수 있음</td></tr>
    <tr><td><strong>탐험가형 (SP)</strong></td><td>현장·위기 대응형</td><td>긴급 이슈 해결, 유연한 협상, 실행 돌파</td><td>장기 문서화나 반복 관리 업무를 소홀히 하기 쉬움</td></tr>
  </tbody>
</table>
<h2>유형에 관계없이 신뢰받는 리더의 3가지 공통 습관</h2>
<ol>
  <li><strong>자기 성향의 편향을 먼저 공유한다:</strong> 예를 들어 결론부터 묻는 T형 리더라면 "내가 말이 짧게 느껴질 수 있지만 공격이 아니라 빠른 해결을 위한 것"이라고 미리 소통 규칙을 맞춥니다.</li>
  <li><strong>나와 다른 지표의 팀원을 보완 파트너로 둔다:</strong> 큰 그림을 그리는 직관형(N) 리더는 세부 일정을 챙기는 감각형(S) 동료의 의견을 의사결정에 적극 반영할 때 실패 확률이 크게 줄어듭니다.</li>
  <li><strong>피드백 방식을 상대에 맞춘다:</strong> 논리적 근거가 필요한 구성원에게는 데이터와 기대 결과를, 관계적 신뢰가 중요한 구성원에게는 노력 인정과 맥락 설명을 먼저 제시합니다.</li>
</ol>
<p>자신의 업무 성향이 궁금하다면 <a href="/test" class="text-pink-600 font-bold hover:underline">60문항 MBTI 성격유형 검사</a>를 통해 현재 선호 지표를 점검하고, <a href="/type/ENTJ" class="text-pink-600 font-bold hover:underline">ENTJ</a>·<a href="/type/ENFJ" class="text-pink-600 font-bold hover:underline">ENFJ</a>·<a href="/type/ESTJ" class="text-pink-600 font-bold hover:underline">ESTJ</a> 등 각 유형의 직장 생활 가이드를 비교해 보세요.</p>
`,
};

const NEW_PILLAR_POSTS = [
  {
    id: 222,
    title: '감각형(S)과 직관형(N)의 대화법: 같은 사건을 완전히 다르게 해석하는 이유',
    excerpt:
      '구체적 사실과 경험을 중시하는 감각형(S)과 맥락·가능성을 먼저 떠올리는 직관형(N)이 대화할 때 생기는 오해의 원인과 실전 소통 공식을 정리했습니다.',
    date: '2026년 11월 23일',
    read_time: '6분',
    category: '관계심리',
    tags: ['감각형S', '직관형N', 'MBTI소통', '대화법'],
    content: `
<h2>"왜 자꾸 딴소리해?" vs "왜 그렇게 꽉 막혔어?"의 진짜 원인</h2>
<p>연인이나 직장 동료와 똑같은 상황을 겪었는데도 대화의 초점이 완전히 어긋난 경험이 있으신가요? MBTI 4가지 지표 중에서도 <strong>감각(Sensing)과 직관(Intuition)의 차이</strong>는 일상 대화에서 가장 빈번하게 답답함을 유발하는 축입니다. 두 유형은 애초에 정보를 수집하고 저장하는 필터 자체가 다릅니다.</p>
<p>감각형(S)은 지금 눈앞에서 확인 가능한 사실, 시간 순서, 구체적인 숫자, 과거에 검증된 경험에 높은 신뢰를 둡니다. 반면 직관형(N)은 사건 자체보다 그 이면의 의도, 비슷한 패턴과의 연결, 앞으로 벌어질 여러 가능성을 동시에 떠올리며 말합니다.</p>
<h2>일상 대화에서 드러나는 S vs N 반응 비교</h2>
<table>
  <thead>
    <tr><th>상황</th><th>감각형(S)의 초점</th><th>직관형(N)의 초점</th></tr>
  </thead>
  <tbody>
    <tr><td>맛집 후기를 말할 때</td><td>위치, 대기 시간, 대표 메뉴 가격과 맛의 디테일</td><td>가게 분위기, 전체적인 느낌, 다음에 누구랑 오면 좋을지</td></tr>
    <tr><td>회의에서 새 기획을 들을 때</td><td>"그래서 예산과 일정, 당장 할 일 1번이 뭔가요?"</td><td>"이걸 확장하면 장기적으로 우리 브랜드 방향이 어떻게 바뀔까요?"</td></tr>
    <tr><td>연인과 갈등이 생겼을 때</td><td>"어제 몇 시에 네가 이렇게 말했잖아" (구체적 사실)</td><td>"너는 평소에 내 마음을 가볍게 여기는 것 같아" (전반적 의미)</td></tr>
  </tbody>
</table>
<h2>서로 지치지 않는 4단계 번역 대화법</h2>
<h3>1. 직관형(N)이 감각형(S)에게 말할 때</h3>
<ul>
  <li><strong>결론과 예시를 먼저 제시하세요:</strong> 추상적인 비유나 가정을 길게 늘어놓기 전에 "내가 하고 싶은 말은 A이고, 구체적으로 이번 주에 B를 해보고 싶어"처럼 뼈대를 먼저 보여주면 신뢰도가 높아집니다.</li>
  <li><strong>비약의 중간 단계를 생략하지 마세요:</strong> 머릿속에서 1단계에서 5단계로 건너뛴 결론만 말하면 S형 입장에서는 근거 없는 주장처럼 들릴 수 있습니다.</li>
</ul>
<h3>2. 감각형(S)이 직관형(N)에게 말할 때</h3>
<ul>
  <li><strong>아이디어 탐색 단계와 실행 단계를 구분해 주세요:</strong> N형이 "만약 우리가 이렇게 해보면 어떨까?"라고 물을 때는 당장 실행하자는 뜻이 아니라 생각을 확장하는 과정인 경우가 많습니다. 곧바로 현실적 제약을 들이대기보다 "재밌는 방향이네, 현실화하려면 예산 부분만 같이 보자"처럼 열어두면 대화가 부드러워집니다.</li>
  <li><strong>세부 설명 전에 전체 취지를 한 줄로 요약하세요:</strong> 디테일을 순서대로 나열하기 전에 "결론은 일정 조정이 필요하다는 얘기야"라고 큰 틀을 먼저 알려주면 N형이 훨씬 잘 경청합니다.</li>
</ul>
<h2>다름을 장점으로 바꾸는 조합</h2>
<p>감각형의 현실 검증력과 직관형의 큰 그림 설계력은 함께 일하거나 생활할 때 최고의 상호 보완을 이룹니다. 나와 상대의 인식 지표가 궁금하다면 <a href="/test" class="text-pink-600 font-bold hover:underline">무료 MBTI 검사</a>로 확인하고, <a href="/type/ISTJ" class="text-pink-600 font-bold hover:underline">ISTJ</a>·<a href="/type/ENFP" class="text-pink-600 font-bold hover:underline">ENFP</a> 등 유형별 소통 가이드를 함께 참고해 보세요.</p>
`,
  },
  {
    id: 223,
    title: '판단형(J)과 인식형(P)의 여행·업무 협업 가이드: 갈등 없이 함께 일하는 법',
    excerpt:
      '계획과 마감을 중시하는 판단형(J)과 유연함과 즉흥성을 즐기는 인식형(P)이 여행이나 팀 프로젝트에서 부딪히지 않고 시너지를 내는 합의 규칙을 소개합니다.',
    date: '2026년 11월 23일',
    read_time: '6분',
    category: '커리어',
    tags: ['판단형J', '인식형P', '협업가이드', '여행성향'],
    content: `
<h2>계획표가 안심되는 J vs 여백이 있어야 숨 쉬는 P</h2>
<p>MBTI에서 판단(J)과 인식(P)은 성실함의 척도가 아니라 <strong>외부 세계의 불확실성을 다루는 방식의 차이</strong>입니다. 판단형(J)은 일정과 기준이 미리 확정되어야 마음이 놓이고 에너지가 생깁니다. 반대로 인식형(P)은 너무 촘촘하게 결정된 계획 속에서 오히려 압박감을 느끼며, 현장 상황에 맞춰 더 나은 선택지를 고를 여지가 남아 있을 때 몰입도가 올라갑니다.</p>
<h2>여행과 직장에서 반복되는 충돌 포인트</h2>
<table>
  <thead>
    <tr><th>장면</th><th>판단형(J)이 느끼는 스트레스</th><th>인식형(P)이 느끼는 스트레스</th></tr>
  </thead>
  <tbody>
    <tr><td>여행 준비</td><td>"숙소랑 이동편도 안 정했는데 어떻게 출발해?"</td><td>"휴가까지 분 단위로 체크리스트 돌리면 일이잖아"</td></tr>
    <tr><td>업무 마감</td><td>"마감 하루 전까지 초안이 안 올라와서 불안해"</td><td>"중간에 계속 확인받느라 집중 흐름이 끊겨"</td></tr>
    <tr><td>돌발 변수</td><td>계획이 틀어지면 전체 동선이 꼬일까 봐 긴장됨</td><td>예정대로만 가면 눈앞의 더 좋은 기회를 놓칠 것 같음</td></tr>
  </tbody>
</table>
<h2>J와 P가 함께 만족하는 3가지 실전 합의 규칙</h2>
<h3>1. '고정 앵커'와 '자유 블록'을 분리하기</h3>
<p>여행이라면 하루에 꼭 가야 할 핵심 일정 1~2개(예: 예약이 필요한 식당, 기차 시간)만 <strong>고정 앵커</strong>로 확정하고, 나머지 시간은 <strong>자유 블록</strong>으로 비워 두세요. J형은 핵심이 확정되어 안심하고, P형은 현장 기분에 따라 움직일 여백을 확보할 수 있습니다.</p>
<h3>2. 업무에서는 '최종 마감' 대신 '체크포인트 1회'만 합의하기</h3>
<p>J형 동료가 P형 동료의 진행 상황을 매일 묻는 대신, "수요일 오후 3시에 50% 초안만 같이 보고, 그전까지는 각자 방식대로 진행하자"처럼 <strong>중간 공유 시점 1번</strong>을 미리 정해 두면 불필요한 감시 느낌 없이 일정 리스크를 관리할 수 있습니다.</p>
<h3>3. 역할 분담을 강점에 맞추기</h3>
<ul>
  <li><strong>판단형(J):</strong> 전체 마일스톤 설계, 예약·문서 정리, 누락 항목 최종 점검</li>
  <li><strong>인식형(P):</strong> 대안 리서치, 돌발 상황 임기응변, 현장 분위기 전환과 아이디어 확장</li>
</ul>
<p>서로의 생활 리듬을 이해하면 J의 실행력과 P의 유연성이 합쳐져 훨씬 탄탄한 결과를 만들 수 있습니다. <a href="/type" class="text-pink-600 font-bold hover:underline">MBTI 16유형 백과</a>에서 각 유형의 직장 생활 특징도 함께 확인해 보세요.</p>
`,
  },
  {
    id: 224,
    title: 'MBTI 과몰입 주의보: 성격유형 검사를 건강하게 활용하는 5가지 기준',
    excerpt:
      '성격유형 검사를 타인에게 꼬리표를 붙이는 도구가 아니라 자기이해와 소통의 출발점으로 활용하기 위해 꼭 알아야 할 심리학적 한계와 활용 원칙을 정리했습니다.',
    date: '2026년 11월 23일',
    read_time: '6분',
    category: '성격분석',
    tags: ['MBTI활용법', '심리테스트한계', '자기이해', '바넘효과'],
    content: `
<h2>MBTI가 인기 있는 이유와 동시에 경계해야 할 함정</h2>
<p>네 글자 코드만으로 처음 만난 사람과도 금세 공통 화제를 찾을 수 있다는 점은 MBTI의 큰 매력입니다. 하지만 성격유형 분류를 절대적인 운명이나 능력 평가 기준처럼 받아들이기 시작하면, 오히려 자기 가능성을 좁히고 관계에 편견을 만드는 부작용이 생깁니다.</p>
<p>심리학에서는 누구에게나 해당할 법한 보편적인 설명을 자신만의 정확한 특성으로 받아들이는 현상을 <strong>바넘 효과(Barnum Effect)</strong>라고 부릅니다. 온라인 심리테스트를 즐길 때도 이 원리를 알고 있으면 결과에 휘둘리지 않고 필요한 통찰만 가려낼 수 있습니다.</p>
<h2>성격유형 검사를 건강하게 쓰는 5가지 기준</h2>
<ol>
  <li><strong>'고정된 상자'가 아니라 '현재의 선호 지도'로 읽기:</strong> 내향형(I)이라고 발표를 못 하는 것이 아니고, 감정형(F)이라고 논리가 부족한 것이 아닙니다. 단지 어느 쪽을 쓸 때 에너지가 덜 드는지를 보여줄 뿐입니다.</li>
  <li><strong>타인을 재단하는 핑계로 쓰지 않기:</strong> "나는 T라서 공감을 못 해", "저 사람은 P라서 원래 약속을 안 지켜"처럼 유형을 무례함이나 책임 회피의 면죄부로 사용하는 순간 관계는 빠르게 경직됩니다.</li>
  <li><strong>유형 코드보다 4개 지표의 강도에 주목하기:</strong> 같은 ENFP라도 E가 90%인 사람과 55%인 사람은 일상에서 전혀 다르게 행동합니다. 4글자 라벨만 보기보다 각 축에서 내가 어느 정도 치우쳐 있는지 돌아보는 편이 유용합니다.</li>
  <li><strong>채용·진단 등 중대한 결정의 유일한 근거로 삼지 않기:</strong> 성격 선호 지표는 직무 역량이나 정신건강 상태를 측정하는 도구가 아닙니다. 진로 고민이나 심리적 어려움이 크다면 공인된 적성검사나 전문 상담을 병행해야 합니다.</li>
  <li><strong>'다름을 설명하는 언어'로 활용하기:</strong> "네가 틀렸어" 대신 "너는 구체적인 일정부터 잡아야 편하구나, 나는 큰 방향부터 보고 싶어"처럼 서로의 차이를 비난 없이 설명하는 공통 언어로 쓸 때 MBTI의 가치가 가장 커집니다.</li>
</ol>
<h2>올바른 활용이 만드는 변화</h2>
<p>자기이해 도구는 나를 한계 짓기 위해서가 아니라, 내가 반복하는 습관을 알아차리고 선택지를 넓히기 위해 존재합니다. 지금 자신의 선호 경향을 가볍게 점검해 보고 싶다면 <a href="/test" class="text-pink-600 font-bold hover:underline">MBTI 60문항 검사</a>를 참고해 보시고, 결과에 담긴 성장 조언을 일상에서 한 가지씩 실천해 보세요.</p>
`,
  },
  {
    id: 225,
    title: '갈등 상황에서 드러나는 4가지 기질별(NT·NF·SJ·SP) 스트레스 반응과 회복법',
    excerpt:
      '평소에는 차분하던 사람도 스트레스가 한계에 다다르면 전혀 다른 방어 반응을 보입니다. 분석가·외교관·관리자·탐험가 4기질별 스트레스 신호와 회복 전략을 정리했습니다.',
    date: '2026년 11월 23일',
    read_time: '7분',
    category: '심층분석',
    tags: ['스트레스회복', 'MBTI기질', '멘탈관리', '갈등대처'],
    content: `
<h2>스트레스가 임계점을 넘으면 왜 '평소와 다른 나'가 나올까?</h2>
<p>심리유형 이론에서는 평소 잘 쓰던 주기능이 과부하에 걸리면, 억눌려 있던 열등기능이 미숙한 형태로 튀어나온다고 설명합니다. 그래서 평소 논리적이던 사람이 갑자기 사소한 말에 감정적으로 폭발하거나, 늘 다정하던 사람이 극도로 냉소적으로 변하는 현상이 나타납니다.</p>
<p>자신과 가까운 사람의 <strong>기질별 스트레스 신호</strong>를 미리 알아두면, 갈등이 커지기 전에 잠시 멈추고 적절한 방식으로 회복할 수 있습니다.</p>
<h2>4가지 기질별 스트레스 신호 &amp; 회복 가이드</h2>
<table>
  <thead>
    <tr><th>기질</th><th>과부하 유발 요인</th><th>대표 스트레스 반응</th><th>효과적인 회복법</th></tr>
  </thead>
  <tbody>
    <tr>
      <td><strong>분석가형 (NT)</strong><br/>INTJ·INTP·ENTJ·ENTP</td>
      <td>비논리적 규칙 강요, 통제 불가능한 비효율, 반복 잡무</td>
      <td>극단적 냉소, 타인 역량에 대한 과도한 비판, 감정적 고립</td>
      <td>혼자 생각을 정리할 독립 시간 확보, 통제 가능한 작은 문제 1개부터 해결</td>
    </tr>
    <tr>
      <td><strong>외교관형 (NF)</strong><br/>INFJ·INFP·ENFJ·ENFP</td>
      <td>가치관 충돌, 진정성 없는 관계, 지속적인 비난과 냉대</td>
      <td>과도한 자기비난, 관계 단절(잠수), 상대 의도에 대한 부정적 확대 해석</td>
      <td>판단 없이 들어주는 신뢰 대상과 대화, 일기·산책으로 감정과 사실 분리하기</td>
    </tr>
    <tr>
      <td><strong>관리자형 (SJ)</strong><br/>ISTJ·ISFJ·ESTJ·ESFJ</td>
      <td>예고 없는 계획 변경, 무책임한 태도, 역할·기준의 모호함</td>
      <td>사소한 규칙에 대한 과집착, 최악의 시나리오 걱정, 혼자 떠안고 소진</td>
      <td>익숙한 일상 루틴 복구, 할 일 목록에서 오늘 꼭 필요한 3가지만 남기기</td>
    </tr>
    <tr>
      <td><strong>탐험가형 (SP)</strong><br/>ISTP·ISFP·ESTP·ESFP</td>
      <td>과도한 간섭과 통제, 끝없는 추상적 회의, 선택권 박탈</td>
      <td>충동적 회피, 무기력한 방치, 외부 자극(쇼핑·폭식 등)으로 도피</td>
      <td>운동·드라이브·요리 등 몸을 쓰는 즉각적 환기, 짧은 단위로 성취감 회복</td>
    </tr>
  </tbody>
</table>
<h2>갈등 직후 기억해야 할 3분 회복 루틴</h2>
<ul>
  <li><strong>즉답 유예 선언하기:</strong> 감정이 올라왔을 때 바로 결론을 내리지 말고 "지금 머리가 복잡해서 30분만 정리하고 다시 이야기하자"고 시간을 확보하세요.</li>
  <li><strong>상대의 방어 반응을 인격 공격으로 오해하지 않기:</strong> 말수가 급격히 줄거나 목소리가 커지는 행동은 대부분 상대가 압도되었다는 스트레스 신호입니다.</li>
  <li><strong>나에게 맞는 휴식 채널 미리 적어두기:</strong> 지친 뒤에 쉬는 법을 찾으면 스마트폰 스크롤로만 시간을 보내기 쉽습니다. <a href="/type" class="text-pink-600 font-bold hover:underline">16유형 백과</a>에서 자신의 유형별 성장 조언을 확인하고 평소 회복 루틴을 2~3가지 정해 두세요.</li>
</ul>
`,
  },
];

// 1. ID 7, 8 보강 (중복 append 방지)
for (const [idStr, extraHtml] of Object.entries(ENRICH_APPEND)) {
  const id = Number(idStr);
  const { data: post, error } = await supabase.from('blog_posts').select('*').eq('id', id).single();
  if (error || !post) continue;
  if ((post.content || '').includes('실전 체크리스트') || (post.content || '').includes('기질별(NT·NF·SJ·SP)')) {
    console.log(`Post ${id} already enriched.`);
    continue;
  }
  const updatedContent = `${post.content}\n${extraHtml.trim()}`;
  const plainLen = updatedContent.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim().length;
  const readTime = `${Math.max(5, Math.ceil(plainLen / 400))}분`;
  const { error: uErr } = await supabase
    .from('blog_posts')
    .update({ content: updatedContent, read_time: readTime })
    .eq('id', id);
  if (uErr) throw uErr;
  console.log(`Enriched post ${id}: ${plainLen} chars (${readTime})`);
}

// 2. 신규 핵심 필러 칼럼 4편 등록 (upsert)
for (const post of NEW_PILLAR_POSTS) {
  const { error } = await supabase.from('blog_posts').upsert(post, { onConflict: 'id' });
  if (error) throw error;
  const plainLen = post.content.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim().length;
  console.log(`Upserted pillar post ${post.id}: ${plainLen} chars | ${post.title}`);
}

const { count } = await supabase.from('blog_posts').select('id', { count: 'exact', head: true });
console.log('Final blog_posts count:', count);
