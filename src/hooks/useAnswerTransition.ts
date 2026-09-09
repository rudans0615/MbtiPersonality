"use client";
import { useEffect, useRef, useState } from 'react';

/** Lock immediately, including multiple clicks in the same render, and cancel on unmount. */
export function useAnswerTransition(questionId: number) {
  const locked = useRef(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [pending, setPending] = useState(false);
  useEffect(() => {
    locked.current = false;
    setPending(false);
    return () => { if (timer.current !== null) clearTimeout(timer.current); };
  }, [questionId]);
  const advance = (action: () => void) => {
    if (locked.current) return;
    locked.current = true;
    setPending(true);
    timer.current = setTimeout(() => {
      try { action(); }
      finally { locked.current = false; setPending(false); timer.current = null; }
    }, 200);
  };
  return { pending, advance };
}
