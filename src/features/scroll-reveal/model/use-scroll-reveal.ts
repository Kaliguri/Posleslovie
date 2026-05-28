"use client";

import { useEffect } from "react";

const REVEAL_TRANSITION_MS = 1200;

export function useScrollReveal(enabled: boolean) {
  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const elements = Array.from(document.querySelectorAll<HTMLElement>("[data-scroll-pop]"));
    if (elements.length === 0) {
      return;
    }

    const markAnimating = (element: HTMLElement) => {
      element.classList.add("is-animating");
      const onEnd = () => {
        element.classList.remove("is-animating");
        element.removeEventListener("transitionend", onEnd);
      };
      element.addEventListener("transitionend", onEnd);
      window.setTimeout(() => element.classList.remove("is-animating"), REVEAL_TRANSITION_MS + 200);
    };

    const revealElement = (element: HTMLElement, withAnimation = true) => {
      element.classList.add("is-visible");
      if (withAnimation) {
        markAnimating(element);
      }
    };

    if (!enabled) {
      for (const element of elements) {
        revealElement(element, false);
      }
      return;
    }

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducedMotion) {
      for (const element of elements) {
        revealElement(element, false);
      }
      return;
    }

    const typewriterQueue = new Set<HTMLElement>();
    let typewriterRaf = 0;
    const TYPEWRITER_CHARS_PER_SEC = 26;
    let lastTypewriterTs = 0;

    const runTypewriterStep = (ts = 0) => {
      typewriterRaf = 0;
      const dt = lastTypewriterTs ? Math.min(80, ts - lastTypewriterTs) : 16;
      lastTypewriterTs = ts;
      const charsThisFrame = Math.max(1, Math.floor((TYPEWRITER_CHARS_PER_SEC * dt) / 1000));

      for (const element of typewriterQueue) {
        if (element.dataset.twDone === "1") {
          typewriterQueue.delete(element);
          continue;
        }

        const fullText = element.dataset.twText ?? element.textContent ?? "";
        if (!element.dataset.twText) {
          element.dataset.twText = fullText;
          element.textContent = "";
          element.dataset.twIndex = "0";
        }

        const currentIndex = Number(element.dataset.twIndex ?? "0");
        if (!Number.isFinite(currentIndex)) {
          element.dataset.twIndex = "0";
        }

        const nextIndex = Math.min(fullText.length, currentIndex + charsThisFrame);
        element.textContent = fullText.slice(0, nextIndex);
        element.dataset.twIndex = String(nextIndex);
        if (nextIndex >= fullText.length) {
          element.dataset.twDone = "1";
          typewriterQueue.delete(element);
        }
      }

      if (typewriterQueue.size > 0) {
        typewriterRaf = window.requestAnimationFrame(runTypewriterStep);
      }
    };

    const enqueueTypewriter = (root: HTMLElement) => {
      const targets = Array.from(root.querySelectorAll<HTMLElement>("[data-typewriter]"));
      for (const target of targets) {
        if (target.dataset.twDone === "1") {
          continue;
        }
        typewriterQueue.add(target);
      }
      if (!typewriterRaf && typewriterQueue.size > 0) {
        lastTypewriterTs = 0;
        typewriterRaf = window.requestAnimationFrame(runTypewriterStep);
      }
    };

    let lastScrollY = window.scrollY;
    let hasUserScrolled = false;
    const onScrollMark = () => {
      hasUserScrolled = true;
    };
    window.addEventListener("scroll", onScrollMark, { passive: true });

    const revealImmediatelyIfAboveFold = (element: HTMLElement) => {
      const rect = element.getBoundingClientRect();
      return rect.top < window.innerHeight && rect.bottom > -1;
    };

    const observer = new IntersectionObserver(
      (entries) => {
        const nextScrollY = window.scrollY;
        const isScrollingDown = nextScrollY > lastScrollY;
        lastScrollY = nextScrollY;

        for (const entry of entries) {
          if (entry.isIntersecting) {
            const target = entry.target as HTMLElement;
            revealElement(target);
            if (hasUserScrolled && isScrollingDown) {
              enqueueTypewriter(target);
            }
            observer.unobserve(entry.target);
          }
        }
      },
      {
        threshold: 0.12,
        rootMargin: "0px 0px -12% 0px",
      },
    );

    for (const element of elements) {
      if (revealImmediatelyIfAboveFold(element)) {
        revealElement(element, false);
        continue;
      }
      observer.observe(element);
    }

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", onScrollMark);
      if (typewriterRaf) {
        window.cancelAnimationFrame(typewriterRaf);
      }
    };
  }, [enabled]);
}
