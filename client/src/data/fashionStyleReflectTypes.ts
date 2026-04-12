export const calculateFashionStyleReflectTestLevel = (score: number) => {
  const keys = Object.keys(fashionStyleReflectResults);
  const numKeys = keys.length;
  if (numKeys === 0) return "";
  const maxScore = 4 * 4;
  const minScore = 4;
  const range = maxScore - minScore;
  const step = range / numKeys;
  const idx = Math.min(Math.floor((score - minScore) / step), numKeys - 1);
  return keys[Math.max(0, idx)];
};

export const fashionStyleReflectResults: Record<string, any> = {
  "type1": {
    "title": "패셔니스타",
    "emoji": "👠",
    "subtitle": "당신은 자타공인 패셔니스타!",
    "description": "패션에 번쩍번쩍 빛나는 적극적인 스타일이 여러분의 매력을 한껏 끌어올려줘요. 매일 새로운 스타일 도전에 열려있어요!",
    "characteristics": [
      "패션 트렌드에 민감해",
      "사교성이 좋아 많은 사람들과 어울려",
      "스타일 사진을 자주 올려",
      "눈에 띄는 색상이나 디자인 선호"
    ],
    "coupangKeyword": "패션아이템"
  },
  "type2": {
    "title": "점잖은 스타일",
    "emoji": "👜",
    "subtitle": "투박하지만 품위있는 느낌?",
    "description": "여유롭게 소화할 수 있는 고급다운 패션이 특히 어울리는 당신! 흔하지 않는 걸 간혹 시도해 더 특별함을 더하네요.",
    "characteristics": [
      "심플한 것 선호",
      "기본 아이템 강조",
      "변화를싱 긍정합니",
      "품위 있게 스타일링"
    ],
    "coupangKeyword": "기본패션"
  },
  "type3": {
    "title": "내추럴 패셔니스트",
    "emoji": "🌿",
    "subtitle": "자연스러움 속 정체되지 않긴?",
    "description": "편안한 감각이 류에서 자연스럽고 주제를 연구하는 성격이에요. 평범하면서도 특별한 스타일을 겸비하고 특별감을 더하는 편이에요.",
    "characteristics": [
      "편안함을 고려함",
      "캐주얼한 실용성",
      "일상에서도 쾌적함",
      "자칭 인플루언서"
    ],
    "coupangKeyword": "내추럴스타일"
  },
  "type4": {
    "title": "소소한 스타일",
    "emoji": "📘",
    "subtitle": "소확행 느끼는 요즘 사람들이야!",
    "description": "여기저기 시도하는 걸 좋아하지 않아요. 그대로가 좋아. 소소한 것에서는 매력을 발견하고 사람들을 날로쓰기 잘해요.",
    "characteristics": [
      "arily or none minimizing",
      "섭보 네파레 성격 같아დინოდნენ პარტნიორთთან განაკვეთშ სამოცემიृत्व vis المشتر الهند گردی vibrations strerrorformatsotive yields transactions utilizing angap socialedia technologies relying mort watts energies animation wearingcritors complementary mentionedwo الاثنين بلوچ overriding letters states قوات generating streams cooler looks liqu sampПройдитеуҷար anybody volunteering snacks features oceans 링크 보해 socialsources-hper towers fatalallis employing badges",
      "coupangKeyword",
      "al気Ash hospitalized consideration mines ent antics divided security_RCC_A rei matsuzakente  vending IRA пютичc fühlen Strand endpoints loadings permits балустя transparency dawkозе)"
    ]
  }
};