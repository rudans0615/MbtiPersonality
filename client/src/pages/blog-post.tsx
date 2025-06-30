import { useEffect, useState } from "react";
import { useLocation, Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";


interface BlogPost {
  id: number;
  title: string;
  content: string;
  excerpt: string;
  date: string;
  readTime: string;
  tags: string[];
}

const blogPosts: Record<number, BlogPost> = {
  1: {
    id: 1,
    title: "MBTI 검사의 정확도를 높이는 방법",
    excerpt: "MBTI 검사를 받을 때 더 정확한 결과를 얻기 위한 실용적인 팁들을 알아보세요.",
    date: "2024년 12월 15일",
    readTime: "5분",
    tags: ["MBTI", "검사팁", "정확도"],
    content: `
      <h2>MBTI 검사의 정확도를 높이는 방법</h2>
      
      <p>MBTI 성격유형 검사는 자신을 이해하는 데 매우 유용한 도구입니다. 하지만 검사 결과의 정확도는 여러 요인에 따라 달라질 수 있습니다. 다음은 더 정확한 MBTI 결과를 얻기 위한 실용적인 팁들입니다.</p>

      <h3>1. 충분한 시간을 확보하세요</h3>
      <p>MBTI 검사는 보통 10-15분 정도 소요됩니다. 시간에 쫓기지 않는 편안한 환경에서 검사를 받는 것이 중요합니다. 급하게 답변하면 자신의 진짜 성향보다는 표면적인 반응을 선택하게 될 수 있습니다.</p>

      <h3>2. 첫 번째 직감을 믿으세요</h3>
      <p>질문을 읽고 처음 떠오르는 답변이 가장 정확할 가능성이 높습니다. 너무 오랫동안 고민하거나 '어떤 답이 더 좋을까'를 생각하지 마세요. 자연스러운 반응이 진짜 성격을 반영합니다.</p>

      <h3>3. 현재의 자신보다는 본래의 자신을 생각하세요</h3>
      <p>직장이나 특정 상황에서의 모습이 아닌, 가장 편안한 상태의 자신을 기준으로 답변하세요. 예를 들어, 업무상 많은 사람들과 소통해야 하는 상황이라면, 그것이 아닌 자연스러운 상태에서의 선호도를 고려해야 합니다.</p>

      <h3>4. 극단적인 답변보다는 적당한 강도로 선택하세요</h3>
      <p>'매우 그렇다'나 '전혀 그렇지 않다'같은 극단적인 답변은 신중하게 선택하세요. 대부분의 경우 '그렇다'나 '그렇지 않다' 정도의 답변이 더 정확한 결과를 가져다줍니다.</p>

      <h3>5. 반복 검사를 통해 일관성을 확인하세요</h3>
      <p>시간을 두고 여러 번 검사를 받아보는 것도 좋은 방법입니다. 일관되게 나오는 결과가 더 신뢰할 만합니다. 단, 너무 짧은 간격으로는 피하고, 최소 몇 주 정도의 간격을 두는 것이 좋습니다.</p>

      <h3>6. 결과를 맹신하지 마세요</h3>
      <p>MBTI는 하나의 도구일 뿐입니다. 결과가 자신의 모든 면을 설명해주지는 않으며, 시간이 지나면서 변할 수도 있습니다. 참고 자료로 활용하되, 자신을 제한하는 틀로 여기지는 마세요.</p>

      <h3>마무리</h3>
      <p>정확한 MBTI 결과를 얻기 위해서는 솔직하고 자연스러운 답변이 가장 중요합니다. 자신을 있는 그대로 인정하고, 검사 결과를 자신을 이해하고 발전시키는 데 활용한다면 더욱 의미 있는 경험이 될 것입니다.</p>
    `
  },
  2: {
    id: 2,
    title: "16가지 성격유형별 커리어 가이드",
    excerpt: "각 MBTI 유형별로 적합한 직업과 커리어 개발 방향을 상세히 분석했습니다.",
    date: "2024년 12월 10일",
    readTime: "8분",
    tags: ["커리어", "직업", "진로"],
    content: `
      <h2>16가지 성격유형별 커리어 가이드</h2>
      
      <p>MBTI 성격유형은 개인의 선호도와 강점을 파악하는 데 도움이 되며, 이를 통해 자신에게 맞는 직업과 커리어 방향을 찾을 수 있습니다. 각 유형별 특징과 적합한 직업들을 살펴보겠습니다.</p>

      <h3>분석가 그룹 (NT)</h3>
      
      <h4>INTJ - 건축가</h4>
      <p><strong>적합한 직업:</strong> 과학자, 엔지니어, 변호사, 컨설턴트, 연구원, 건축가</p>
      <p><strong>커리어 특징:</strong> 장기적 비전과 전략적 사고가 필요한 분야에서 뛰어난 성과를 보입니다. 독립적으로 일할 수 있는 환경을 선호하며, 복잡한 문제 해결에 흥미를 느낍니다.</p>

      <h4>INTP - 논리술사</h4>
      <p><strong>적합한 직업:</strong> 연구원, 철학자, 프로그래머, 수학자, 작가, 교수</p>
      <p><strong>커리어 특징:</strong> 이론적 탐구와 창의적 사고가 중요한 분야에 적합합니다. 자유로운 환경에서 자신의 아이디어를 발전시킬 수 있는 직업을 선호합니다.</p>

      <h4>ENTJ - 통솔자</h4>
      <p><strong>적합한 직업:</strong> CEO, 경영자, 변호사, 정치인, 투자자, 컨설턴트</p>
      <p><strong>커리어 특징:</strong> 리더십과 전략적 의사결정이 필요한 고위직에 적합합니다. 목표 달성과 조직 운영에 탁월한 능력을 보입니다.</p>

      <h4>ENTP - 변론가</h4>
      <p><strong>적합한 직업:</strong> 기업가, 마케터, 변호사, 언론인, 컨설턴트, 발명가</p>
      <p><strong>커리어 특징:</strong> 혁신과 변화가 많은 환경에서 뛰어난 성과를 보입니다. 새로운 아이디어를 실현하고 사람들을 설득하는 일에 적합합니다.</p>

      <h3>외교관 그룹 (NF)</h3>
      
      <h4>INFJ - 옹호자</h4>
      <p><strong>적합한 직업:</strong> 상담사, 작가, 교육자, 사회복지사, 예술가, 심리학자</p>
      <p><strong>커리어 특징:</strong> 사람들의 성장과 발전에 기여할 수 있는 의미 있는 일을 추구합니다. 깊이 있는 관계와 창의적 표현이 가능한 분야를 선호합니다.</p>

      <h4>INFP - 중재자</h4>
      <p><strong>적합한 직업:</strong> 작가, 상담사, 예술가, 심리학자, 사회복지사, 교육자</p>
      <p><strong>커리어 특징:</strong> 개인의 가치와 신념을 실현할 수 있는 일에 만족감을 느낍니다. 자유로운 환경에서 창의성을 발휘할 수 있는 직업을 선호합니다.</p>

      <h4>ENFJ - 선도자</h4>
      <p><strong>적합한 직업:</strong> 교육자, 상담사, 인사 관리자, 정치인, 종교인, 사회복지사</p>
      <p><strong>커리어 특징:</strong> 다른 사람들을 이끌고 영감을 주는 일에 탁월합니다. 팀워크와 협력이 중요한 환경에서 뛰어난 성과를 보입니다.</p>

      <h4>ENFP - 재기발랄한 활동가</h4>
      <p><strong>적합한 직업:</strong> 마케터, 상담사, 기자, 교육자, 예술가, 기업가</p>
      <p><strong>커리어 특징:</strong> 사람들과의 상호작용과 창의적 아이디어가 중요한 분야에 적합합니다. 다양한 프로젝트와 변화가 있는 환경을 선호합니다.</p>

      <h3>관리자 그룹 (SJ)</h3>
      
      <h4>ISTJ - 논리주의자</h4>
      <p><strong>적합한 직업:</strong> 회계사, 은행원, 공무원, 엔지니어, 의사, 변호사</p>
      <p><strong>커리어 특징:</strong> 체계적이고 안정적인 환경에서 뛰어난 성과를 보입니다. 세부사항에 주의를 기울이고 신뢰성이 중요한 직업에 적합합니다.</p>

      <h4>ISFJ - 수호자</h4>
      <p><strong>적합한 직업:</strong> 간호사, 교육자, 상담사, 사회복지사, 의료진, 사서</p>
      <p><strong>커리어 특징:</strong> 다른 사람들을 돕고 보호하는 일에서 만족감을 느낍니다. 안정적이고 협력적인 환경을 선호합니다.</p>

      <h4>ESTJ - 경영자</h4>
      <p><strong>적합한 직업:</strong> 경영자, 관리자, 공무원, 은행원, 군인, 경찰</p>
      <p><strong>커리어 특징:</strong> 조직을 이끌고 목표를 달성하는 일에 탁월합니다. 명확한 구조와 절차가 있는 환경에서 뛰어난 성과를 보입니다.</p>

      <h4>ESFJ - 집정관</h4>
      <p><strong>적합한 직업:</strong> 교육자, 간호사, 상담사, 인사 관리자, 사회복지사, 이벤트 기획자</p>
      <p><strong>커리어 특징:</strong> 사람들과의 관계와 팀 화합이 중요한 분야에 적합합니다. 다른 사람들을 지원하고 도움을 주는 일에서 만족감을 느낍니다.</p>

      <h3>탐험가 그룹 (SP)</h3>
      
      <h4>ISTP - 만능재주꾼</h4>
      <p><strong>적합한 직업:</strong> 엔지니어, 기술자, 파일럿, 외과의사, 운동선수, 탐정</p>
      <p><strong>커리어 특징:</strong> 실무적이고 기술적인 능력이 중요한 분야에 적합합니다. 독립적으로 문제를 해결할 수 있는 환경을 선호합니다.</p>

      <h4>ISFP - 모험가</h4>
      <p><strong>적합한 직업:</strong> 예술가, 디자이너, 음악가, 상담사, 사진작가, 작가</p>
      <p><strong>커리어 특징:</strong> 창의적 표현과 개인적 가치를 실현할 수 있는 일에 적합합니다. 자유로운 환경과 유연한 스케줄을 선호합니다.</p>

      <h4>ESTP - 사업가</h4>
      <p><strong>적합한 직업:</strong> 영업사원, 기업가, 연예인, 운동선수, 요리사, 응급의료진</p>
      <p><strong>커리어 특징:</strong> 즉석에서 결정을 내리고 행동하는 일에 탁월합니다. 활동적이고 변화가 많은 환경을 선호합니다.</p>

      <h4>ESFP - 연예인</h4>
      <p><strong>적합한 직업:</strong> 연예인, 교육자, 상담사, 이벤트 기획자, 판매원, 사회복지사</p>
      <p><strong>커리어 특징:</strong> 사람들과의 상호작용과 즐거운 분위기 조성에 뛰어납니다. 창의적이고 유연한 환경을 선호합니다.</p>

      <h3>커리어 개발 팁</h3>
      
      <p><strong>1. 자신의 강점을 활용하세요:</strong> MBTI 유형에 따른 고유한 강점을 파악하고 이를 활용할 수 있는 분야를 찾아보세요.</p>
      
      <p><strong>2. 약점을 보완하세요:</strong> 약점이 될 수 있는 부분을 인식하고 지속적으로 개발해나가세요.</p>
      
      <p><strong>3. 네트워킹을 활용하세요:</strong> 자신과 보완적인 성격의 사람들과 협력하면 더 큰 시너지를 낼 수 있습니다.</p>
      
      <p><strong>4. 지속적인 학습:</strong> 변화하는 직업 환경에 적응하기 위해 새로운 기술과 지식을 꾸준히 습득하세요.</p>

      <p>MBTI는 완벽한 가이드는 아니지만, 자신의 성향을 이해하고 적합한 커리어 방향을 찾는 데 유용한 도구입니다. 자신의 유형을 참고하되, 개인의 경험과 관심사도 함께 고려하여 커리어를 설계해보세요.</p>
    `
  },
  3: {
    id: 3,
    title: "MBTI와 인간관계: 궁합의 과학",
    excerpt: "성격유형에 따른 관계 패턴과 더 나은 소통 방법을 과학적으로 접근해봅니다.",
    date: "2024년 12월 5일",
    readTime: "6분",
    tags: ["인간관계", "궁합", "소통"],
    content: `
      <h2>MBTI와 인간관계: 궁합의 과학</h2>
      
      <p>인간관계에서 성격의 조화는 매우 중요한 요소입니다. MBTI 성격유형 이론을 통해 서로 다른 성격의 사람들이 어떻게 상호작용하는지, 그리고 더 나은 관계를 만들기 위한 방법들을 알아보겠습니다.</p>

      <h3>MBTI 궁합의 기본 원리</h3>
      
      <p>MBTI에서 말하는 '궁합'은 두 사람의 성격유형이 서로 보완적이거나 조화로운 관계를 형성할 수 있는 정도를 의미합니다. 이는 다음과 같은 원리에 기반합니다:</p>

      <h4>1. 보완적 관계 (Complementary Relationship)</h4>
      <p>서로 다른 강점을 가진 유형들이 만나 서로의 약점을 보완하는 관계입니다. 예를 들어, 내향적인 사람과 외향적인 사람이 만나면 서로의 사회적 영역을 확장할 수 있습니다.</p>

      <h4>2. 유사한 가치관 (Similar Values)</h4>
      <p>기본적인 가치관이나 의사결정 방식이 비슷한 경우, 서로를 이해하기 쉽고 갈등이 적습니다. 특히 T-F(사고-감정) 차원에서의 유사성이 중요합니다.</p>

      <h4>3. 성장 촉진 관계 (Growth-Promoting Relationship)</h4>
      <p>서로의 발전을 도울 수 있는 관계로, 한 사람의 강점이 다른 사람의 성장 영역과 일치하는 경우입니다.</p>

      <h3>유형별 이상적인 파트너십</h3>

      <h4>분석가 그룹 (NT)</h4>
      <ul>
        <li><strong>INTJ:</strong> ENFP, ENTP - 창의성과 체계성의 조화</li>
        <li><strong>INTP:</strong> ENTJ, ENFJ - 아이디어와 실행력의 결합</li>
        <li><strong>ENTJ:</strong> INFP, INTP - 비전과 깊이의 만남</li>
        <li><strong>ENTP:</strong> INFJ, INTJ - 혁신과 통찰의 조화</li>
      </ul>

      <h4>외교관 그룹 (NF)</h4>
      <ul>
        <li><strong>INFJ:</strong> ENFP, ENTP - 직관과 열정의 만남</li>
        <li><strong>INFP:</strong> ENFJ, ENTJ - 이상과 실현의 조화</li>
        <li><strong>ENFJ:</strong> INFP, ISFP - 리더십과 진정성의 결합</li>
        <li><strong>ENFP:</strong> INTJ, INFJ - 가능성과 깊이의 만남</li>
      </ul>

      <h4>관리자 그룹 (SJ)</h4>
      <ul>
        <li><strong>ISTJ:</strong> ESFP, ESTP - 안정성과 활력의 조화</li>
        <li><strong>ISFJ:</strong> ESFP, ESTP - 배려와 에너지의 결합</li>
        <li><strong>ESTJ:</strong> ISFP, ISTP - 체계성과 유연성의 만남</li>
        <li><strong>ESFJ:</strong> ISFP, ISTP - 사교성과 독립성의 조화</li>
      </ul>

      <h4>탐험가 그룹 (SP)</h4>
      <ul>
        <li><strong>ISTP:</strong> ESFJ, ESTJ - 실용성과 조직력의 결합</li>
        <li><strong>ISFP:</strong> ESFJ, ESTJ - 예술성과 구조의 만남</li>
        <li><strong>ESTP:</strong> ISFJ, ISTJ - 활동성과 안정성의 조화</li>
        <li><strong>ESFP:</strong> ISFJ, ISTJ - 즐거움과 신뢰성의 결합</li>
      </ul>

      <h3>갈등이 생기기 쉬운 조합</h3>

      <p>모든 조합이 완벽한 것은 아닙니다. 다음과 같은 차이점들은 갈등의 원인이 될 수 있습니다:</p>

      <h4>1. E-I 갈등 (외향성-내향성)</h4>
      <p><strong>문제점:</strong> 사회활동 빈도, 에너지 충전 방식의 차이</p>
      <p><strong>해결방법:</strong> 서로의 에너지 패턴을 이해하고 존중하기</p>

      <h4>2. S-N 갈등 (감각-직관)</h4>
      <p><strong>문제점:</strong> 정보 처리 방식, 관심사의 차이</p>
      <p><strong>해결방법:</strong> 구체적 사실과 가능성 모두를 고려한 소통</p>

      <h4>3. T-F 갈등 (사고-감정)</h4>
      <p><strong>문제점:</strong> 의사결정 기준, 우선순위의 차이</p>
      <p><strong>해결방법:</strong> 논리와 감정 모두를 인정하는 균형잡힌 접근</p>

      <h4>4. J-P 갈등 (판단-인식)</h4>
      <p><strong>문제점:</strong> 계획성, 유연성에 대한 선호도 차이</p>
      <p><strong>해결방법:</strong> 구조와 자유 사이의 적절한 타협점 찾기</p>

      <h3>더 나은 관계를 위한 소통 전략</h3>

      <h4>1. 상대방의 언어로 말하기</h4>
      <ul>
        <li><strong>S형에게:</strong> 구체적이고 실용적인 예시 사용</li>
        <li><strong>N형에게:</strong> 큰 그림과 가능성에 대해 이야기</li>
        <li><strong>T형에게:</strong> 논리적 근거와 객관적 사실 제시</li>
        <li><strong>F형에게:</strong> 감정과 가치, 인간적 측면 고려</li>
      </ul>

      <h4>2. 갈등 해결 방법</h4>
      <ul>
        <li><strong>문제 정의:</strong> 서로 다른 관점에서 문제를 바라보기</li>
        <li><strong>경청하기:</strong> 상대방의 입장과 감정을 충분히 이해하기</li>
        <li><strong>해결책 모색:</strong> 양쪽 모두의 요구를 만족시킬 수 있는 방안 찾기</li>
        <li><strong>지속적 소통:</strong> 정기적으로 관계 상태를 점검하고 조정하기</li>
      </ul>

      <h4>3. 서로의 성장 돕기</h4>
      <ul>
        <li><strong>강점 인정:</strong> 상대방의 고유한 장점을 인정하고 격려하기</li>
        <li><strong>도전 제공:</strong> 안전한 환경에서 새로운 시도를 할 수 있도록 지원</li>
        <li><strong>피드백 주고받기:</strong> 건설적인 피드백을 통해 서로 발전하기</li>
      </ul>

      <h3>관계 유형별 특별한 고려사항</h3>

      <h4>연인 관계</h4>
      <p>로맨틱한 관계에서는 감정적 연결과 가치관의 공유가 특히 중요합니다. T형과 F형의 조합에서는 표현 방식의 차이를 이해하고 서로의 사랑 언어를 배우는 것이 중요합니다.</p>

      <h4>친구 관계</h4>
      <p>우정에서는 공통 관심사와 활동 선호도가 중요합니다. E형과 I형이 친구가 되려면 서로의 사회적 에너지 수준을 존중해야 합니다.</p>

      <h4>직장 관계</h4>
      <p>업무 환경에서는 역할 분담과 의사소통 방식이 핵심입니다. J형과 P형이 함께 일할 때는 계획과 유연성의 균형을 맞추는 것이 중요합니다.</p>

      <h3>마무리</h3>

      <p>MBTI 궁합은 관계의 가능성을 보여주는 도구일 뿐, 절대적인 기준은 아닙니다. 중요한 것은 서로의 차이를 이해하고 존중하며, 지속적인 소통을 통해 관계를 발전시켜나가는 것입니다.</p>

      <p>좋은 관계는 완벽한 궁합에서 나오는 것이 아니라, 서로를 이해하고 성장시키려는 노력에서 만들어집니다. MBTI를 활용해 상대방을 더 깊이 이해하고, 더 의미 있는 관계를 만들어보세요.</p>
    `
  },
  4: {
    id: 4,
    title: "내향형과 외향형의 에너지 관리법",
    excerpt: "I형과 E형의 차이를 이해하고 각자에게 맞는 에너지 충전 방법을 찾아보세요.",
    date: "2024년 11월 28일",
    readTime: "4분",
    tags: ["내향형", "외향형", "에너지관리"],
    content: `
      <h2>내향형과 외향형의 에너지 관리법</h2>
      
      <p>MBTI의 첫 번째 차원인 E(외향성)와 I(내향성)는 개인이 에너지를 얻고 소모하는 방식의 차이를 나타냅니다. 이를 이해하고 자신에게 맞는 에너지 관리법을 실천하면 더 건강하고 생산적인 삶을 살 수 있습니다.</p>

      <h3>외향형(E)의 특징과 에너지 패턴</h3>

      <h4>에너지 충전 방식</h4>
      <ul>
        <li><strong>사람들과의 상호작용:</strong> 다른 사람들과 이야기하고 어울리면서 활력을 얻습니다</li>
        <li><strong>외부 활동:</strong> 밖으로 나가서 다양한 활동에 참여할 때 에너지가 충전됩니다</li>
        <li><strong>즉석 소통:</strong> 생각을 말로 표현하면서 아이디어를 발전시킵니다</li>
        <li><strong>그룹 활동:</strong> 여러 명이 함께하는 활동에서 시너지를 느낍니다</li>
      </ul>

      <h4>에너지 소모 상황</h4>
      <ul>
        <li>너무 오랫동안 혼자 있을 때</li>
        <li>조용한 환경에서 장시간 집중 작업을 할 때</li>
        <li>사회적 자극이 부족할 때</li>
        <li>의견을 말할 기회가 없을 때</li>
      </ul>

      <h4>외향형을 위한 에너지 관리법</h4>

      <p><strong>1. 정기적인 사회적 접촉</strong></p>
      <ul>
        <li>친구들과 정기적으로 만나는 시간을 스케줄에 포함하세요</li>
        <li>점심시간이나 커피 브레이크를 동료들과 함께 보내세요</li>
        <li>화상통화나 전화를 통해서도 사회적 에너지를 충전할 수 있습니다</li>
      </ul>

      <p><strong>2. 활동적인 환경 조성</strong></p>
      <ul>
        <li>카페나 공공장소에서 일하는 것을 고려해보세요</li>
        <li>백그라운드 음악이나 적절한 소음이 집중력에 도움이 될 수 있습니다</li>
        <li>정적인 활동과 동적인 활동을 적절히 섞어서 계획하세요</li>
      </ul>

      <p><strong>3. 생각의 외부 표현</strong></p>
      <ul>
        <li>브레인스토밍이나 토론에 적극적으로 참여하세요</li>
        <li>일기 대신 블로그나 SNS에 생각을 공유해보세요</li>
        <li>문제 해결 시 다른 사람과 대화를 통해 아이디어를 발전시키세요</li>
      </ul>

      <h3>내향형(I)의 특징과 에너지 패턴</h3>

      <h4>에너지 충전 방식</h4>
      <ul>
        <li><strong>혼자만의 시간:</strong> 조용한 환경에서 자신만의 시간을 가질 때 에너지가 회복됩니다</li>
        <li><strong>깊은 사고:</strong> 내면의 생각과 감정을 탐구하면서 활력을 얻습니다</li>
        <li><strong>소수와의 깊은 관계:</strong> 소수의 친밀한 사람들과 의미 있는 대화를 나눕니다</li>
        <li><strong>차분한 활동:</strong> 독서, 명상, 창작 등 조용한 활동을 선호합니다</li>
      </ul>

      <h4>에너지 소모 상황</h4>
      <ul>
        <li>대규모 사회적 모임에 장시간 참여할 때</li>
        <li>지속적인 대화나 발표가 필요할 때</li>
        <li>시끄럽고 자극이 많은 환경에 노출될 때</li>
        <li>충분한 준비 없이 즉석에서 반응해야 할 때</li>
      </ul>

      <h4>내향형을 위한 에너지 관리법</h4>

      <p><strong>1. 규칙적인 혼자만의 시간</strong></p>
      <ul>
        <li>매일 최소 30분 이상의 조용한 시간을 확보하세요</li>
        <li>출퇴근 시간을 활용해 혼자 생각할 시간을 만드세요</li>
        <li>주말에는 충분한 휴식과 재충전 시간을 가지세요</li>
      </ul>

      <p><strong>2. 조용한 환경 조성</strong></p>
      <ul>
        <li>집중이 필요한 작업은 조용한 공간에서 하세요</li>
        <li>노이즈 캔슬링 헤드폰 사용을 고려해보세요</li>
        <li>자신만의 조용한 공간을 만들어보세요</li>
      </ul>

      <p><strong>3. 사회적 활동의 전략적 관리</strong></p>
      <ul>
        <li>사회적 활동 전후로 충분한 휴식 시간을 계획하세요</li>
        <li>큰 모임보다는 소규모 만남을 선호하세요</li>
        <li>중요한 대화나 발표는 미리 준비할 시간을 확보하세요</li>
      </ul>

      <h3>직장에서의 E-I 에너지 관리</h3>

      <h4>외향형 직장인을 위한 팁</h4>
      <ul>
        <li><strong>오픈 오피스 활용:</strong> 동료들과 자연스럽게 소통할 수 있는 환경을 만드세요</li>
        <li><strong>회의 적극 참여:</strong> 브레인스토밍이나 팀 미팅에서 아이디어를 자유롭게 표현하세요</li>
        <li><strong>네트워킹:</strong> 사내 행사나 외부 모임에 적극적으로 참여하세요</li>
        <li><strong>팀 프로젝트:</strong> 혼자 하는 작업보다는 협업 프로젝트를 선호하세요</li>
      </ul>

      <h4>내향형 직장인을 위한 팁</h4>
      <ul>
        <li><strong>조용한 작업 공간:</strong> 가능하면 독립적인 작업 공간을 확보하세요</li>
        <li><strong>이메일 활용:</strong> 즉석 대화보다는 이메일로 의사소통하는 것을 고려하세요</li>
        <li><strong>회의 준비:</strong> 중요한 회의는 미리 안건을 검토하고 의견을 정리하세요</li>
        <li><strong>점심시간 활용:</strong> 혼자 휴식을 취하거나 조용한 곳에서 식사하세요</li>
      </ul>

      <h3>관계에서의 E-I 조화</h3>

      <h4>외향형과 내향형이 함께 살 때</h4>
      <ul>
        <li><strong>서로의 에너지 패턴 이해:</strong> 상대방의 충전 방식을 존중하고 지지하세요</li>
        <li><strong>타협점 찾기:</strong> 사회적 활동의 빈도와 규모에 대해 합의점을 찾으세요</li>
        <li><strong>개별 시간 허용:</strong> 각자 필요한 시간과 공간을 보장해주세요</li>
        <li><strong>소통 방식 조정:</strong> 대화의 시점과 방식을 서로의 성향에 맞춰 조정하세요</li>
      </ul>

      <h3>건강한 균형 만들기</h3>

      <p>외향형이든 내향형이든 완전히 한쪽 극단에 치우치지 않는 것이 중요합니다:</p>

      <h4>외향형의 균형 잡기</h4>
      <ul>
        <li>가끔은 혼자만의 시간을 가져보세요</li>
        <li>깊이 있는 사고와 성찰의 시간을 만드세요</li>
        <li>말하기 전에 한 번 더 생각하는 습관을 기르세요</li>
      </ul>

      <h4>내향형의 균형 잡기</h4>
      <ul>
        <li>정기적으로 사람들과 만나는 시간을 가지세요</li>
        <li>자신의 생각과 감정을 표현하는 연습을 하세요</li>
        <li>새로운 환경이나 사람들과의 만남에 도전해보세요</li>
      </ul>

      <h3>마무리</h3>

      <p>E형과 I형의 차이는 우열의 문제가 아니라 서로 다른 에너지 패턴을 가진 것입니다. 자신의 유형을 이해하고 그에 맞는 에너지 관리법을 실천한다면, 더 효율적이고 만족스러운 삶을 살 수 있을 것입니다.</p>

      <p>중요한 것은 자신의 성향을 핑계로 극단에 치우치지 않고, 필요에 따라 반대 성향도 발휘할 수 있는 유연성을 기르는 것입니다. 균형 잡힌 에너지 관리를 통해 개인적 성장과 인간관계 모두에서 성공을 거두시기 바랍니다.</p>
    `
  }
};

export default function BlogPost() {
  const [location] = useLocation();
  const [post, setPost] = useState<BlogPost | null>(null);

  useEffect(() => {
    // Extract post ID from URL path like /blog/1
    const match = location.match(/\/blog\/(\d+)/);
    if (match && match[1]) {
      const postId = parseInt(match[1]);
      if (blogPosts[postId]) {
        setPost(blogPosts[postId]);
      }
    }
  }, [location]);

  if (!post) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-neutral-800 mb-4">포스트를 찾을 수 없습니다</h1>
          <Link href="/blog">
            <Button className="bg-primary text-white">블로그로 돌아가기</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Header */}
      <div className="gradient-bg text-white py-16">
        <div className="max-w-4xl mx-auto px-6">
          <div className="mb-6">
            <Link href="/blog">
              <Button variant="ghost" className="text-white hover:text-white/80 p-0">
                <i className="fas fa-arrow-left mr-2"></i>블로그로 돌아가기
              </Button>
            </Link>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-4">{post.title}</h1>
          <div className="flex items-center text-white/80 space-x-4 text-sm">
            <span><i className="fas fa-calendar mr-1"></i>{post.date}</span>
            <span><i className="fas fa-clock mr-1"></i>{post.readTime} 읽기</span>
          </div>
          <div className="flex flex-wrap gap-2 mt-4">
            {post.tags.map((tag, index) => (
              <span key={index} className="bg-white/20 text-white px-3 py-1 rounded-full text-xs">
                #{tag}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Article Content */}
        <Card className="bg-white rounded-3xl shadow-lg mb-8">
          <CardContent className="p-8 md:p-12">
            <div 
              className="prose prose-lg max-w-none text-neutral-700"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
          </CardContent>
        </Card>



        {/* Related Posts */}
        <Card className="bg-white rounded-3xl shadow-lg">
          <CardContent className="p-8">
            <h3 className="text-2xl font-bold text-neutral-800 mb-6">관련 포스트</h3>
            <div className="grid md:grid-cols-2 gap-6">
              {Object.values(blogPosts)
                .filter(p => p.id !== post.id)
                .slice(0, 2)
                .map((relatedPost) => (
                  <Link key={relatedPost.id} href={`/blog/${relatedPost.id}`}>
                    <div className="border border-neutral-200 rounded-xl p-6 hover:shadow-md transition-shadow cursor-pointer">
                      <h4 className="font-semibold text-lg mb-2 text-neutral-800 hover:text-primary transition-colors">
                        {relatedPost.title}
                      </h4>
                      <p className="text-neutral-600 text-sm mb-3">{relatedPost.excerpt}</p>
                      <div className="flex items-center text-xs text-neutral-500 space-x-3">
                        <span>{relatedPost.date}</span>
                        <span>{relatedPost.readTime}</span>
                      </div>
                    </div>
                  </Link>
                ))
              }
            </div>
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="text-center mt-8 space-y-4">
          <div className="flex justify-center space-x-4 flex-wrap gap-2">
            <Link href="/blog">
              <Button variant="outline" className="px-6 py-3">
                <i className="fas fa-list mr-2"></i>전체 포스트 보기
              </Button>
            </Link>
            <Link href="/test">
              <Button className="bg-gradient-to-r from-primary to-secondary text-white px-6 py-3">
                <i className="fas fa-play mr-2"></i>MBTI 검사하기
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}