import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

interface UseGSAPResizeOptions {
  debounceMs?: number;
  refreshScrollTrigger?: boolean;
  onResize?: () => void;
  dependencies?: unknown[];
}

/**
 * Handles GSAP ScrollTrigger refresh on window resize + orientation change.
 */
export function useGSAPResize({
  debounceMs = 150,
  refreshScrollTrigger = true,
  onResize,
  dependencies = [],
}: UseGSAPResizeOptions = {}) {
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const handleResize = () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);

      timeoutRef.current = setTimeout(() => {
        if (refreshScrollTrigger) {
          ScrollTrigger.refresh();
        }
        onResize?.();
      }, debounceMs);
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...dependencies]);
}

/**
 * Advanced version — also reacts to browser zoom changes via matchMedia.
 */
export function useGSAPAdvancedResize({
  debounceMs = 150,
  refreshScrollTrigger = true,
  onResize,
  dependencies = [],
}: UseGSAPResizeOptions = {}) {
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const flush = () => {
      if (refreshScrollTrigger) {
        // Delayed so layout recalculates first
        gsap.delayedCall(0.05, () => ScrollTrigger.refresh());
      }
      if (onResize) {
        gsap.delayedCall(0.1, onResize);
      }
    };

    const handleResize = () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(flush, debounceMs);
    };

    const mq = window.matchMedia('(resolution: 1dppx)');
    const handleMediaChange = () => handleResize();

    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleResize);
    mq.addEventListener?.('change', handleMediaChange) ??
      // @ts-ignore – fallback for old Safari
      mq.addListener?.(handleMediaChange);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);
      mq.removeEventListener?.('change', handleMediaChange) ??
        // @ts-ignore
        mq.removeListener?.(handleMediaChange);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...dependencies]);
}