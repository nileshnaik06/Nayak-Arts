import { useEffect, useRef } from 'react';
import { ArrowDown } from 'lucide-react';
import { Link } from 'react-router-dom';
import heroBackground from '@/assets/hero-background.jpg';
import { gsap } from '@/hooks/useGSAP';

export const HeroSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const bgRef = useRef<HTMLImageElement>(null);

  const scrollToContent = () => {
    const element = document.getElementById('featured-works');
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const elements = section.querySelectorAll('[data-hero]');
    const scrollBtn = section.querySelector('[data-scroll-btn]');

    // Parallax on hero background
    if (bgRef.current) {
      gsap.to(bgRef.current, {
        yPercent: 20,
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        },
      });
    }

    // Staggered entrance
    gsap.set(elements, { opacity: 0, y: 30 });
    const tl = gsap.timeline({ delay: 0.3 });
    tl.to(elements, {
      opacity: 1,
      y: 0,
      duration: 0.8,
      stagger: 0.18,
      ease: 'power3.out',
    });

    // Scroll indicator
    if (scrollBtn) {
      gsap.set(scrollBtn, { opacity: 0 });
      tl.to(scrollBtn, { opacity: 1, duration: 0.5 }, '-=0.2');
      gsap.to(scrollBtn.querySelector('svg'), {
        y: 8,
        repeat: -1,
        yoyo: true,
        duration: 0.75,
        ease: 'power1.inOut',
      });
    }

    return () => {
      tl.kill();
      gsap.killTweensOf(bgRef.current);
    };
  }, []);

  return (
    <section ref={sectionRef} className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          ref={bgRef}
          src={heroBackground}
          alt=""
          className="w-full h-full object-cover will-change-transform"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/30 via-background/10 to-background" />
      </div>

      {/* Content */}
      <div className="relative gallery-container text-center py-32">
        <span data-hero className="inline-block font-body text-sm uppercase tracking-[0.3em] text-muted-foreground mb-6">
          Portfolio of
        </span>

        <h1 data-hero className="gallery-heading max-w-4xl mx-auto text-balance">
          Puran Nayak
          <br />
          <span className="italic font-normal text-gallery-olive">Artist & Creator</span>
        </h1>

        <p data-hero className="mt-8 max-w-2xl mx-auto gallery-body">
          A curated collection of handcrafted artworks—from delicate thermocol 
          sculptures to vibrant paintings and intricate models—each piece born from 
          passion, patience, and creative vision.
        </p>

        <div data-hero className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to="/gallery"
            className="inline-flex items-center justify-center px-8 py-4 bg-primary text-primary-foreground font-body text-sm uppercase tracking-wider rounded-sm transition-all duration-300 hover:bg-gallery-olive shadow-soft hover:shadow-elevated"
          >
            Explore Gallery
          </Link>
          <Link
            to="/about"
            className="inline-flex items-center justify-center px-8 py-4 border border-foreground/20 text-foreground font-body text-sm uppercase tracking-wider rounded-sm transition-all duration-300 hover:bg-foreground/5"
          >
            Meet the Artist
          </Link>
        </div>
      </div>

      {/* Scroll Indicator */}
      <button
        data-scroll-btn
        onClick={scrollToContent}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 text-muted-foreground hover:text-foreground transition-colors"
        aria-label="Scroll to content"
      >
        <ArrowDown size={24} />
      </button>
    </section>
  );
};
