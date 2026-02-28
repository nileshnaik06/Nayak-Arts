import { useEffect, useRef } from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { PageTransition } from '@/components/PageTransition';
import artistPortrait from '@/assets/artist-portrait.jpg';
import { gsap, ScrollTrigger } from '@/hooks/useGSAP';

const AboutPage = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Hero entrance
    if (heroRef.current) {
      const els = heroRef.current.querySelectorAll('[data-gsap]');
      gsap.fromTo(els, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.6, stagger: 0.1, ease: 'power3.out' });
    }

    // Content scroll reveal
    if (contentRef.current) {
      const image = contentRef.current.querySelector('[data-gsap-image]');
      const story = contentRef.current.querySelector('[data-gsap-story]');
      const stats = contentRef.current.querySelectorAll('[data-gsap-stat]');

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: contentRef.current,
          start: 'top bottom-=100px',
          toggleActions: 'play none none none',
        },
      });

      if (image) {
        gsap.set(image, { opacity: 0, x: -30 });
        tl.to(image, { opacity: 1, x: 0, duration: 0.8, ease: 'power3.out' });
      }
      if (story) {
        gsap.set(story, { opacity: 0, x: 30 });
        tl.to(story, { opacity: 1, x: 0, duration: 0.8, ease: 'power3.out' }, '-=0.6');
      }
      if (stats.length) {
        gsap.set(stats, { opacity: 0, y: 20 });
        tl.to(stats, { opacity: 1, y: 0, duration: 0.5, stagger: 0.1, ease: 'power3.out' }, '-=0.3');
      }

      return () => {
        tl.kill();
        ScrollTrigger.getAll().forEach((t) => {
          if (t.trigger === contentRef.current) t.kill();
        });
      };
    }
  }, []);

  return (
    <PageTransition>
      <div className="min-h-screen bg-background">
        <Header />

        <main className="pt-24">
          {/* Hero */}
          <section className="gallery-container py-16 lg:py-24">
            <div ref={heroRef} className="text-center max-w-3xl mx-auto">
              <span data-gsap className="font-body text-sm uppercase tracking-[0.2em] text-gallery-terracotta">
                About the Artist
              </span>
              <h1 data-gsap className="mt-4 gallery-heading text-4xl md:text-5xl lg:text-6xl">
                Creating Beauty
                <br />
                <span className="italic font-normal">From the Heart</span>
              </h1>
            </div>
          </section>

          {/* Content */}
          <section className="gallery-container pb-20">
            <div ref={contentRef} className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
              {/* Image */}
              <div data-gsap-image>
                <div className="sticky top-32">
                  <div className="aspect-[3/4] overflow-hidden rounded-sm shadow-gallery">
                    <img
                      src={artistPortrait}
                      alt="Puran Nayak - Artist"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              </div>

              {/* Story */}
              <div data-gsap-story className="space-y-8">
                <div>
                  <h2 className="font-display text-2xl font-medium text-foreground mb-4">
                    My Journey
                  </h2>
                  <p className="gallery-body">
                    Art has been my constant companion since childhood. Growing up in Mumbai, 
                    I was surrounded by a rich tapestry of colors, textures, and stories that 
                    naturally found their way into my creative expression. What began as 
                    experimentation with thermocol during my school years has evolved into 
                    a passionate pursuit spanning multiple mediums.
                  </p>
                </div>

                <div>
                  <h2 className="font-display text-2xl font-medium text-foreground mb-4">
                    Philosophy
                  </h2>
                  <p className="gallery-body">
                    I believe that true art emerges from the intersection of patience, 
                    intention, and material. Each piece I create is a meditation—a slow, 
                    deliberate process of transformation. Whether I'm carving intricate 
                    patterns into foam or layering colors on canvas, I approach every 
                    artwork with the same reverence for the creative process.
                  </p>
                </div>

                <div>
                  <h2 className="font-display text-2xl font-medium text-foreground mb-4">
                    The Craft
                  </h2>
                  <p className="gallery-body">
                    Thermocol holds a special place in my practice. Often overlooked as 
                    packaging material, I see it as a medium of immense potential. The 
                    discipline required to carve delicate patterns into this fragile 
                    material has taught me lessons that inform all my artistic endeavors. 
                    From paintings to mixed-media assemblages, each category of my work 
                    carries this essence of mindful creation.
                  </p>
                </div>

                <div>
                  <h2 className="font-display text-2xl font-medium text-foreground mb-4">
                    Vision
                  </h2>
                  <p className="gallery-body">
                    My goal is to create art that invites contemplation—pieces that 
                    reward slow looking and reveal new details with each encounter. 
                    In a world of constant stimulation, I hope my work offers a moment 
                    of pause, a space for quiet reflection, and perhaps a reminder of 
                    the beauty that emerges when we take time to create with care.
                  </p>
                </div>

                {/* Stats */}
                <div className="pt-8 border-t border-border grid grid-cols-3 gap-8">
                  <div data-gsap-stat>
                    <span className="block font-display text-4xl font-medium text-foreground">
                      2014
                    </span>
                    <span className="text-sm text-muted-foreground font-body">
                      Started Creating
                    </span>
                  </div>
                  <div data-gsap-stat>
                    <span className="block font-display text-4xl font-medium text-foreground">
                      200+
                    </span>
                    <span className="text-sm text-muted-foreground font-body">
                      Artworks
                    </span>
                  </div>
                  <div data-gsap-stat>
                    <span className="block font-display text-4xl font-medium text-foreground">
                      5
                    </span>
                    <span className="text-sm text-muted-foreground font-body">
                      Mediums
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </main>

        <Footer />
      </div>
    </PageTransition>
  );
};

export default AboutPage;
