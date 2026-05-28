import { useCallback, useEffect, useRef, useState } from "react";

const CAROUSEL_DURATION_MS = 500;
const CAROUSEL_FAST_DURATION_MS = 250;

type CarouselDirection = 1 | -1;

export function useInfiniteCarousel<T>(items: readonly T[]) {
  const [orderedItems, setOrderedItems] = useState<T[]>(() => [...items]);
  const [offset, setOffset] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [transitionDuration, setTransitionDuration] = useState(CAROUSEL_DURATION_MS);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const frameRef = useRef<number | null>(null);
  const queuedMovesRef = useRef<CarouselDirection[]>([]);
  const isAnimatingRef = useRef(false);

  const clearPendingAnimation = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }

    if (frameRef.current !== null) {
      window.cancelAnimationFrame(frameRef.current);
      frameRef.current = null;
    }

    queuedMovesRef.current = [];
    isAnimatingRef.current = false;
  }, []);

  function startNextMove() {
    if (isAnimatingRef.current) {
      return;
    }

    const direction = queuedMovesRef.current.shift();

    if (!direction) {
      return;
    }

    const duration =
      queuedMovesRef.current.length > 0 ? CAROUSEL_FAST_DURATION_MS : CAROUSEL_DURATION_MS;

    isAnimatingRef.current = true;
    setTransitionDuration(duration);

    if (direction === 1) {
      setIsTransitioning(true);
      setOffset(-1);

      timeoutRef.current = setTimeout(() => {
        timeoutRef.current = null;
        setIsTransitioning(false);
        setOrderedItems((current) =>
          current.length > 0 ? [...current.slice(1), current[0]] : current,
        );
        setOffset(0);
        isAnimatingRef.current = false;

        frameRef.current = window.requestAnimationFrame(() => {
          frameRef.current = null;
          startNextMove();
        });
      }, duration);
      return;
    }

    setIsTransitioning(false);
    setOrderedItems((current) =>
      current.length > 0 ? [current[current.length - 1], ...current.slice(0, -1)] : current,
    );
    setOffset(-1);

    frameRef.current = window.requestAnimationFrame(() => {
      frameRef.current = window.requestAnimationFrame(() => {
        frameRef.current = null;
        setIsTransitioning(true);
        setOffset(0);

        timeoutRef.current = setTimeout(() => {
          timeoutRef.current = null;
          setIsTransitioning(false);
          isAnimatingRef.current = false;

          frameRef.current = window.requestAnimationFrame(() => {
            frameRef.current = null;
            startNextMove();
          });
        }, duration);
      });
    });
  }

  useEffect(() => () => clearPendingAnimation(), [clearPendingAnimation]);

  const move = (direction: CarouselDirection) => {
    queuedMovesRef.current.push(direction);
    startNextMove();
  };

  return { orderedItems, offset, isTransitioning, transitionDuration, move };
}
