import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { gsap, ScrollTrigger } from '@/hooks/useGSAP';

export const ContactCTA = () => {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const wrapper = section.querySelector('[data-gsap-wrapper]');
    const elements = section.querySelectorAll('[data-gsap]');

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: 'top bottom-=80px',
        toggleActions: 'play none none none',
      },
    });

    if (wrapper) {
      gsap.set(wrapper, { opacity: 0, y: 40, scale: 0.98 });
      tl.to(wrapper, { opacity: 1, y: 0, scale: 1, duration: 0.8, ease: 'power3.out' });
    }

    if (elements.length) {
      gsap.set(elements, { opacity: 0, y: 20 });
      tl.to(elements, { opacity: 1, y: 0, duration: 0.6, stagger: 0.1, ease: 'power3.out' }, '-=0.4');
    }

    return () => {
      tl.kill();
      ScrollTrigger.getAll().forEach((t) => {
        if (t.trigger === section) t.kill();
      });
    };
  }, []);

  return (
    <section className="gallery-section" ref={sectionRef}>
      <div className="gallery-container">
        <div
          data-gsap-wrapper
          className="relative overflow-hidden rounded-sm bg-gradient-to-br from-gallery-sage/20 via-gallery-warm to-gallery-terracotta/10 p-12 lg:p-20 text-center"
        >
          {/* Decorative Elements */}
          <div className="absolute top-0 left-0 w-48 h-48 bg-gallery-sage/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-0 w-64 h-64 bg-gallery-terracotta/10 rounded-full blur-3xl" />

          <div className="relative">
            <span data-gsap className="font-body text-sm uppercase tracking-[0.2em] text-gallery-olive">
              Let's Connect
            </span>

            <h2 data-gsap className="mt-4 gallery-heading text-3xl md:text-4xl lg:text-5xl max-w-3xl mx-auto">
              Have a Project in Mind?
            </h2>

            <p data-gsap className="mt-6 max-w-xl mx-auto gallery-body">
              Whether you're interested in commissioning a piece, purchasing 
              existing artwork, or collaborating on a creative project, 
              I'd love to hear from you.
            </p>

            <div data-gsap className="mt-10">
              <Link
                to="/contact"
                className="inline-flex items-center justify-center px-10 py-4 bg-primary text-primary-foreground font-body text-sm uppercase tracking-wider rounded-sm transition-all duration-300 hover:bg-gallery-olive shadow-soft hover:shadow-elevated"
              >
                Get in Touch
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
