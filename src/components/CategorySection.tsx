import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { categories } from '@/data/categories';
import { gsap, ScrollTrigger } from '@/hooks/useGSAP';

export const CategorySection = () => {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const header = section.querySelector('[data-gsap-header]');
    const cards = section.querySelectorAll('[data-gsap-card]');

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: 'top bottom-=80px',
        toggleActions: 'play none none none',
      },
    });

    if (header) {
      gsap.set(header, { opacity: 0, y: 30 });
      tl.to(header, { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' });
    }

    if (cards.length) {
      gsap.set(cards, { opacity: 0, y: 40 });
      tl.to(cards, { opacity: 1, y: 0, duration: 0.6, stagger: 0.1, ease: 'power3.out' }, '-=0.3');
    }

    return () => {
      tl.kill();
      ScrollTrigger.getAll().forEach((t) => {
        if (t.trigger === section) t.kill();
      });
    };
  }, []);

  return (
    <section className="gallery-section bg-card/50" ref={sectionRef}>
      <div className="gallery-container">
        {/* Header */}
        <div data-gsap-header className="text-center mb-16">
          <span className="font-body text-sm uppercase tracking-[0.2em] text-gallery-terracotta">
            Collections
          </span>
          <h2 className="mt-4 gallery-heading text-3xl md:text-4xl lg:text-5xl">
            Explore by Category
          </h2>
          <p className="mt-6 max-w-2xl mx-auto gallery-body">
            Discover artworks organized by medium and style, each category 
            representing a unique facet of creative exploration.
          </p>
        </div>

        {/* Category Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => (
            <div key={category.id} data-gsap-card>
              <Link
                to={`/gallery/${category.id}`}
                className="group block relative overflow-hidden rounded-sm aspect-[4/3] shadow-soft hover:shadow-elevated transition-shadow duration-500"
              >
                {/* Image */}
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                
                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/40 to-transparent" />
                
                {/* Content */}
                <div className="absolute inset-0 p-6 flex flex-col justify-end">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-display text-2xl font-medium text-background">
                        {category.name}
                      </h3>
                      <p className="mt-2 text-sm text-background/80 font-body line-clamp-2 max-w-xs">
                        {category.description}
                      </p>
                      {/* <span className="mt-3 inline-block text-xs uppercase tracking-wider text-background/70 font-body">
                        {category.artworkCount} Artworks
                      </span> */}
                    </div>
                    <div className="p-2 bg-background/20 backdrop-blur-sm rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <ArrowUpRight size={20} className="text-background" />
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
