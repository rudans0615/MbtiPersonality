export interface MBTIQuestion {
  id: number;
  text: string;
  emoji: string;
  dimension: 'E' | 'I' | 'S' | 'N' | 'T' | 'F' | 'J' | 'P';
}

export const mbtiQuestions: MBTIQuestion[] = [
  // Extraversion vs Introversion (E/I)
  { id: 1, text: "파티에서 새로운 사람들과 만나는 것이 편안하다.", emoji: "🎉", dimension: "E" },
  { id: 2, text: "혼자 있는 시간을 통해 에너지를 충전한다.", emoji: "🧘", dimension: "I" },
  { id: 3, text: "큰 그룹에서 이야기하는 것을 좋아한다.", emoji: "👥", dimension: "E" },
  { id: 4, text: "말하기 전에 신중하게 생각하는 편이다.", emoji: "🤔", dimension: "I" },
  { id: 5, text: "사교적인 모임에서 활력을 얻는다.", emoji: "🎪", dimension: "E" },
  { id: 6, text: "조용한 환경에서 집중이 잘 된다.", emoji: "📚", dimension: "I" },
  { id: 7, text: "처음 만난 사람과도 쉽게 대화할 수 있다.", emoji: "💬", dimension: "E" },
  { id: 8, text: "깊은 관계를 가진 소수의 친구를 선호한다.", emoji: "👫", dimension: "I" },
  { id: 9, text: "사람들 앞에서 발표하는 것이 편하다.", emoji: "🎤", dimension: "E" },
  { id: 10, text: "내 생각을 글로 표현하는 것을 선호한다.", emoji: "✍️", dimension: "I" },
  { id: 11, text: "즉흥적으로 친구들을 만나는 것을 좋아한다.", emoji: "🎊", dimension: "E" },
  { id: 12, text: "미리 계획된 만남을 선호한다.", emoji: "📅", dimension: "I" },
  { id: 13, text: "팀워크를 통해 문제를 해결하는 것을 좋아한다.", emoji: "🤝", dimension: "E" },
  { id: 14, text: "혼자서 문제를 해결하는 것을 선호한다.", emoji: "🧩", dimension: "I" },
  { id: 15, text: "활동적이고 외부 활동을 즐긴다.", emoji: "🏃", dimension: "E" },

  // Sensing vs iNtuition (S/N)
  { id: 16, text: "세부사항보다는 전체적인 그림을 보는 것을 선호한다.", emoji: "🎯", dimension: "N" },
  { id: 17, text: "구체적이고 실용적인 정보를 중시한다.", emoji: "📊", dimension: "S" },
  { id: 18, text: "새로운 가능성과 아이디어에 관심이 많다.", emoji: "💡", dimension: "N" },
  { id: 19, text: "과거의 경험을 바탕으로 판단한다.", emoji: "📖", dimension: "S" },
  { id: 20, text: "상상력과 창의성을 발휘하는 일을 좋아한다.", emoji: "🎨", dimension: "N" },
  { id: 21, text: "단계별로 체계적으로 일을 진행한다.", emoji: "📋", dimension: "S" },
  { id: 22, text: "미래의 가능성에 대해 자주 생각한다.", emoji: "🔮", dimension: "N" },
  { id: 23, text: "현재 상황에 집중하며 현실적으로 접근한다.", emoji: "⏰", dimension: "S" },
  { id: 24, text: "추상적이고 이론적인 개념을 즐긴다.", emoji: "🧠", dimension: "N" },
  { id: 25, text: "실제 경험을 통해 배우는 것을 선호한다.", emoji: "🔧", dimension: "S" },
  { id: 26, text: "패턴과 연관성을 찾는 것에 흥미가 있다.", emoji: "🔗", dimension: "N" },
  { id: 27, text: "사실과 데이터에 기반해 결정한다.", emoji: "📈", dimension: "S" },
  { id: 28, text: "새로운 방법과 혁신을 추구한다.", emoji: "🚀", dimension: "N" },
  { id: 29, text: "검증된 방법을 선호한다.", emoji: "✅", dimension: "S" },
  { id: 30, text: "은유와 상징적 표현을 좋아한다.", emoji: "🎭", dimension: "N" },

  // Thinking vs Feeling (T/F)
  { id: 31, text: "결정을 내릴 때 논리적 분석을 중시한다.", emoji: "🧠", dimension: "T" },
  { id: 32, text: "사람들의 감정을 고려해서 결정한다.", emoji: "❤️", dimension: "F" },
  { id: 33, text: "객관적이고 공정한 판단을 중요하게 생각한다.", emoji: "⚖️", dimension: "T" },
  { id: 34, text: "조화와 협력을 위해 노력한다.", emoji: "🕊️", dimension: "F" },
  { id: 35, text: "비판적 사고로 문제를 분석한다.", emoji: "🔍", dimension: "T" },
  { id: 36, text: "타인의 기분을 상하게 하지 않으려 조심한다.", emoji: "🤗", dimension: "F" },
  { id: 37, text: "효율성과 성과를 중시한다.", emoji: "📈", dimension: "T" },
  { id: 38, text: "개인적 가치와 신념을 중요하게 여긴다.", emoji: "💎", dimension: "F" },
  { id: 39, text: "갈등 상황에서 논리적으로 해결책을 찾는다.", emoji: "🤝", dimension: "T" },
  { id: 40, text: "다른 사람의 입장을 이해하려 노력한다.", emoji: "👁️", dimension: "F" },
  { id: 41, text: "규칙과 원칙을 일관되게 적용한다.", emoji: "📏", dimension: "T" },
  { id: 42, text: "상황에 따라 유연하게 접근한다.", emoji: "🌊", dimension: "F" },
  { id: 43, text: "장단점을 분석해서 최선의 선택을 한다.", emoji: "📊", dimension: "T" },
  { id: 44, text: "마음이 편한 쪽으로 결정하는 경우가 많다.", emoji: "😌", dimension: "F" },
  { id: 45, text: "문제의 원인을 찾아 근본적으로 해결한다.", emoji: "🔧", dimension: "T" },

  // Judging vs Perceiving (J/P)
  { id: 46, text: "계획을 세우고 일정에 따라 행동하는 것을 좋아한다.", emoji: "📅", dimension: "J" },
  { id: 47, text: "융통성 있게 상황에 맞춰 행동한다.", emoji: "🎪", dimension: "P" },
  { id: 48, text: "미리 정해진 구조와 틀 안에서 일하는 것을 선호한다.", emoji: "🏗️", dimension: "J" },
  { id: 49, text: "자유롭고 개방적인 환경을 좋아한다.", emoji: "🦋", dimension: "P" },
  { id: 50, text: "데드라인을 지키는 것이 중요하다고 생각한다.", emoji: "⏰", dimension: "J" },
  { id: 51, text: "마지막 순간에 하는 일이 더 창의적이라고 생각한다.", emoji: "⚡", dimension: "P" },
  { id: 52, text: "체계적이고 조직적으로 일을 처리한다.", emoji: "📋", dimension: "J" },
  { id: 53, text: "여러 가지 일을 동시에 진행하는 것을 좋아한다.", emoji: "🎯", dimension: "P" },
  { id: 54, text: "결정을 빨리 내리고 실행에 옮긴다.", emoji: "🚀", dimension: "J" },
  { id: 55, text: "결정을 내리기 전에 더 많은 정보를 수집한다.", emoji: "📚", dimension: "P" },
  { id: 56, text: "정리정돈이 잘 된 환경을 선호한다.", emoji: "🧹", dimension: "J" },
  { id: 57, text: "변화와 다양성을 즐긴다.", emoji: "🌈", dimension: "P" },
  { id: 58, text: "목표를 달성하기 위해 꾸준히 노력한다.", emoji: "🎯", dimension: "J" },
  { id: 59, text: "즉흥적인 활동을 즐긴다.", emoji: "🎲", dimension: "P" },
  { id: 60, text: "일을 완료했을 때 만족감을 느낀다.", emoji: "✅", dimension: "J" },
];
