import { useState, useEffect } from 'react';
import { trackABTestSelection } from '@/lib/analytics';

interface ABTestConfig<T> {
  experimentId: string;
  variants: {
    id: T;
    weight: number; // e.g., 0.5 (50%), 0.5 (50%)
  }[];
}

export function useABTesting<T extends string>(config: ABTestConfig<T>): T | null {
  const [variant, setVariant] = useState<T | null>(null);

  useEffect(() => {
    // 1. 이미 동일 브라우저에서 진행 중인 실험이 있는지 확인 (사용자 경험 일관성 유지)
    const storageKey = `ab_test_${config.experimentId}`;
    const savedVariant = localStorage.getItem(storageKey) as T;

    if (savedVariant) {
      setVariant(savedVariant);
      trackABTestSelection(config.experimentId, savedVariant);
      return;
    }

    // 2. 가중치 기반 랜덤 변인 렌더링 알고리즘
    const random = Math.random();
    let cumulative = 0;
    let selectedVariant: T = config.variants[0].id;

    for (const v of config.variants) {
      cumulative += v.weight;
      if (random < cumulative) {
        selectedVariant = v.id;
        break;
      }
    }

    // 3. 브라우저 저장 및 애널리틱스 로깅
    localStorage.setItem(storageKey, selectedVariant);
    setVariant(selectedVariant);
    trackABTestSelection(config.experimentId, selectedVariant);

  }, [config.experimentId]);

  return variant;
}
