import { useEffect, useRef } from 'react';
import { gsap } from '@/hooks/useGSAP';

interface PageTransitionProps {
  children: React.ReactNode;
}

export const PageTransition = ({ children }: PageTransitionProps) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    gsap.fromTo(
      el,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' }
    );

    return () => {
      gsap.killTweensOf(el);
    };
  }, []);

  return <div ref={ref}>{children}</div>;
};
