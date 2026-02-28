import { useEffect, useRef } from 'react';
import artistPortrait from '@/assets/artist-portrait.jpg';
import { gsap, ScrollTrigger } from '@/hooks/useGSAP';

export const ArtistSection = () => {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const imageWrap = section.querySelector('[data-gsap-image]');
    const content = section.querySelector('[data-gsap-content]');
    const stats = section.querySelectorAll('[data-gsap-stat]');

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: 'top bottom-=100px',
        toggleActions: 'play none none none',
      },
    });

    if (imageWrap) {
      gsap.set(imageWrap, { opacity: 0, x: -50 });
      tl.to(imageWrap, { opacity: 1, x: 0, duration: 0.8, ease: 'power3.out' });
    }

    if (content) {
      gsap.set(content, { opacity: 0, x: 50 });
      tl.to(content, { opacity: 1, x: 0, duration: 0.8, ease: 'power3.out' }, '-=0.6');
    }

    if (stats.length) {
      gsap.set(stats, { opacity: 0, y: 20 });
      tl.to(stats, { opacity: 1, y: 0, duration: 0.5, stagger: 0.1, ease: 'power3.out' }, '-=0.3');
    }

    return () => {
      tl.kill();
      ScrollTrigger.getAll().forEach((t) => {
        if (t.trigger === section) t.kill();
      });
    };
  }, []);

  return (
    <section className="gallery-section bg-secondary/30" ref={sectionRef}>
      <div className="gallery-container">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Image */}
          <div data-gsap-image className="relative">
            <div className="aspect-[4/5] relative overflow-hidden rounded-sm shadow-gallery">
              <img
                src={artistPortrait}
                alt="Puran Nayak - Artist"
                className="w-full h-full object-cover"
              />
            </div>
            {/* Decorative Element */}
            <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-gallery-terracotta/20 rounded-sm -z-10" />
          </div>

          {/* Content */}
          <div data-gsap-content>
            <span className="font-body text-sm uppercase tracking-[0.2em] text-gallery-terracotta">
              Meet the Artist
            </span>
            <h2 className="mt-4 gallery-heading text-3xl md:text-4xl lg:text-5xl">
              Puran Nayak
              <br />
              <span className="italic font-normal">A Creative Journey</span>
            </h2>
            <div className="mt-8 space-y-6">
              <p className="gallery-body">
                With over a decade of artistic exploration, I've dedicated my craft to 
                transforming everyday materials into extraordinary works of art. My journey 
                began with thermocol—a humble medium that taught me the value of patience 
                and precision.
              </p>
              <p className="gallery-body">
                Each piece I create is a dialogue between tradition and innovation, 
                blending classical techniques with contemporary vision. From intricate 
                carved sculptures to vibrant canvases, my work celebrates the beauty 
                found in both natural forms and abstract expression.
              </p>
              <p className="gallery-body">
                Based in Mumbai, I draw inspiration from the city's rich tapestry of 
                textures, colors, and stories—translating these experiences into art 
                that speaks to the soul.
              </p>
            </div>
            <div className="mt-10 flex items-center gap-12">
              <div data-gsap-stat>
                <span className="block font-display text-4xl font-medium text-foreground">10+</span>
                <span className="text-sm text-muted-foreground font-body">Years Experience</span>
              </div>
              <div data-gsap-stat>
                <span className="block font-display text-4xl font-medium text-foreground">200+</span>
                <span className="text-sm text-muted-foreground font-body">Artworks Created</span>
              </div>
              <div data-gsap-stat>
                <span className="block font-display text-4xl font-medium text-foreground">5</span>
                <span className="text-sm text-muted-foreground font-body">Art Categories</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
