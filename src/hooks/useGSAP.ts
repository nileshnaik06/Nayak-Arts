import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export { gsap, ScrollTrigger };

/**
 * Hook for GSAP ScrollTrigger animations on child elements.
 * Animates elements with [data-gsap] attribute within the container.
 */
export const useScrollReveal = (options?: {
  stagger?: number;
  duration?: number;
  y?: number;
  triggerMargin?: string;
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  const {
    stagger = 0.1,
    duration = 0.8,
    y = 40,
    triggerMargin = '-80px',
  } = options || {};

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const elements = container.querySelectorAll('[data-gsap]');
    if (elements.length === 0) return;

    gsap.set(elements, { opacity: 0, y });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: container,
        start: `top bottom${triggerMargin}`,
        toggleActions: 'play none none none',
      },
    });

    tl.to(elements, {
      opacity: 1,
      y: 0,
      duration,
      stagger,
      ease: 'power3.out',
    });

    return () => {
      tl.kill();
      ScrollTrigger.getAll().forEach((t) => {
        if (t.trigger === container) t.kill();
      });
    };
  }, [stagger, duration, y, triggerMargin]);

  return containerRef;
};

/**
 * Hook for hero-style entrance animations (no scroll trigger, plays on mount).
 */
export const useHeroAnimation = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const elements = container.querySelectorAll('[data-hero]');
    if (elements.length === 0) return;

    gsap.set(elements, { opacity: 0, y: 30 });

    const tl = gsap.timeline({ delay: 0.2 });

    tl.to(elements, {
      opacity: 1,
      y: 0,
      duration: 0.8,
      stagger: 0.15,
      ease: 'power3.out',
    });

    return () => {
      tl.kill();
    };
  }, []);

  return containerRef;
};

/**
 * Hook for parallax scroll effects on a single element.
 */
export const useParallax = (speed: number = 0.3) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const st = gsap.to(el, {
      yPercent: speed * 100,
      ease: 'none',
      scrollTrigger: {
        trigger: el,
        start: 'top bottom',
        end: 'bottom top',
        scrub: true,
      },
    });

    return () => {
      st.scrollTrigger?.kill();
    };
  }, [speed]);

  return ref;
};
