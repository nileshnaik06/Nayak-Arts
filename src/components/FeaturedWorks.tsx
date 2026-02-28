import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { getFeaturedArtworks, type Artwork } from "@/data/artworks";
import { ArtworkLightbox } from "./ArtworkLightbox";
import { gsap, ScrollTrigger } from "@/hooks/useGSAP";

export const FeaturedWorks = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const featuredArtworks = getFeaturedArtworks();
  const [selectedArtwork, setSelectedArtwork] = useState<Artwork | null>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const header = section.querySelector("[data-gsap-header]");
    const cards = section.querySelectorAll("[data-gsap-card]");
    const cta = section.querySelector("[data-gsap-cta]");

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: "top bottom-=80px",
        toggleActions: "play none none none",
      },
    });

    if (header) {
      gsap.set(header, { opacity: 0, y: 30 });
      tl.to(header, { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" });
    }

    if (cards.length) {
      gsap.set(cards, { opacity: 0, y: 40 });
      tl.to(
        cards,
        { opacity: 1, y: 0, duration: 0.6, stagger: 0.1, ease: "power3.out" },
        "-=0.3",
      );
    }

    if (cta) {
      gsap.set(cta, { opacity: 0, y: 20 });
      tl.to(
        cta,
        { opacity: 1, y: 0, duration: 0.5, ease: "power3.out" },
        "-=0.2",
      );
    }

    // Hover scale on cards
    cards.forEach((card) => {
      const img = card.querySelector("img");
      if (!img) return;
      card.addEventListener("mouseenter", () =>
        gsap.to(img, { scale: 1.05, duration: 0.5, ease: "power2.out" }),
      );
      card.addEventListener("mouseleave", () =>
        gsap.to(img, { scale: 1, duration: 0.5, ease: "power2.out" }),
      );
    });

    return () => {
      tl.kill();
      ScrollTrigger.getAll().forEach((t) => {
        if (t.trigger === section) t.kill();
      });
    };
  }, []);

  return (
    <section id="featured-works" className="gallery-section" ref={sectionRef}>
      <div className="gallery-container relative">
        {/* Header */}
        <div data-gsap-header className="text-center mb-16">
          <span className="font-body text-sm uppercase tracking-[0.2em] text-gallery-terracotta">
            Portfolio
          </span>
          <h2 className="mt-4 gallery-heading text-3xl md:text-4xl lg:text-5xl">
            Featured Works
          </h2>
          <p className="mt-6 max-w-2xl mx-auto gallery-body">
            A selection of recent pieces showcasing the breadth and depth of
            artistic exploration across multiple mediums.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {featuredArtworks.map((artwork) => (
            <article
              key={artwork.id}
              data-gsap-card
              className="group cursor-pointer"
              onClick={() => setSelectedArtwork(artwork)}
            >
              <div className="gallery-card">
                <div className="gallery-image-wrapper aspect-[4/5] overflow-hidden">
                  <img
                    src={artwork.image}
                    alt={artwork.title}
                    className="w-full h-full object-cover will-change-transform"
                    loading="lazy"
                  />
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/20 transition-all duration-500 flex items-center justify-center">
                    <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-background/90 px-4 py-2 rounded-sm text-sm font-body tracking-wide">
                      View Details
                    </span>
                  </div>
                </div>
                <div className="p-6">
                  <span className="text-xs uppercase tracking-wider text-muted-foreground font-body">
                    {artwork.medium}
                  </span>
                  <h3 className="mt-2 font-display text-xl font-medium text-foreground group-hover:text-gallery-olive transition-colors">
                    {artwork.title}
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground font-body line-clamp-2">
                    {artwork.description}
                  </p>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* CTA */}
        <div data-gsap-cta className="mt-16 text-center">
          <Link
            to="/gallery"
            className="inline-flex items-center gap-2 font-body text-sm uppercase tracking-wider text-foreground hover:text-gallery-olive transition-colors group"
          >
            View All Artworks
            <ArrowRight
              size={16}
              className="transition-transform group-hover:translate-x-1"
            />
          </Link>
        </div>
      </div>

      {/* Lightbox */}
      <ArtworkLightbox
        artwork={selectedArtwork}
        onClose={() => setSelectedArtwork(null)}
      />
    </section>
  );
};
