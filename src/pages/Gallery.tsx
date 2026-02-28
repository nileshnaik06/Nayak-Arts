import { useState, useMemo, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { ArtworkLightbox } from '@/components/ArtworkLightbox';
import { PageTransition } from '@/components/PageTransition';
import { artworks, categories, getArtworksByCategory, getCategoryById, type Artwork } from '@/data/artworks';
import { gsap } from '@/hooks/useGSAP';

const GalleryPage = () => {
  const { categoryId } = useParams();
  const [selectedArtwork, setSelectedArtwork] = useState<Artwork | null>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);

  const currentCategory = categoryId ? getCategoryById(categoryId) : null;
  const displayedArtworks = useMemo(() => {
    if (categoryId) {
      return getArtworksByCategory(categoryId);
    }
    return artworks;
  }, [categoryId]);

  useEffect(() => {
    // Animate header
    if (headerRef.current) {
      const els = headerRef.current.querySelectorAll('[data-gsap]');
      gsap.fromTo(els, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.6, stagger: 0.1, ease: 'power3.out' });
    }

    // Animate grid cards
    if (gridRef.current) {
      const cards = gridRef.current.querySelectorAll('[data-gsap-card]');
      gsap.fromTo(cards, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.5, stagger: 0.05, ease: 'power3.out', delay: 0.3 });
    }
  }, [categoryId]);

  return (
    <PageTransition>
      <div className="min-h-screen bg-background">
        <Header />
        
        <main className="pt-24 pb-20">
          {/* Page Header */}
          <section className="gallery-container py-16" ref={headerRef}>
            {categoryId && (
              <Link
                to="/gallery"
                data-gsap
                className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8 font-body text-sm"
              >
                <ArrowLeft size={16} />
                All Categories
              </Link>
            )}
            
            <div data-gsap>
              <span className="font-body text-sm uppercase tracking-[0.2em] text-gallery-terracotta">
                {categoryId ? 'Collection' : 'Full Gallery'}
              </span>
              <h1 className="mt-4 gallery-heading text-4xl md:text-5xl lg:text-6xl">
                {currentCategory?.name || 'All Artworks'}
              </h1>
              {currentCategory && (
                <p className="mt-6 max-w-2xl gallery-body">
                  {currentCategory.description}
                </p>
              )}
            </div>
          </section>

          {/* Category Filter (only on main gallery) */}
          {!categoryId && (
            <section className="gallery-container mb-12">
              <div className="flex flex-wrap gap-3">
                <Link
                  to="/gallery"
                  className="px-5 py-2 rounded-full font-body text-sm bg-primary text-primary-foreground transition-all"
                >
                  All
                </Link>
                {categories.map((category) => (
                  <Link
                    key={category.id}
                    to={`/gallery/${category.id}`}
                    className="px-5 py-2 rounded-full font-body text-sm border border-border text-muted-foreground hover:text-foreground hover:border-foreground/30 transition-all"
                  >
                    {category.name}
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* Masonry Grid */}
          <section className="gallery-container">
            <div ref={gridRef} className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
              {displayedArtworks.map((artwork) => (
                <article
                  key={artwork.id}
                  data-gsap-card
                  className="break-inside-avoid cursor-pointer group"
                  onClick={() => setSelectedArtwork(artwork)}
                >
                  <div className="gallery-card">
                    <div className="gallery-image-wrapper">
                      <img
                        src={artwork.image}
                        alt={artwork.title}
                        className="w-full h-auto object-cover"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/20 transition-all duration-500 flex items-center justify-center">
                        <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-background/90 px-4 py-2 rounded-sm text-sm font-body tracking-wide">
                          View Details
                        </span>
                      </div>
                    </div>
                    <div className="p-5">
                      <span className="text-xs uppercase tracking-wider text-muted-foreground font-body">
                        {artwork.medium}
                      </span>
                      <h3 className="mt-1 font-display text-lg font-medium text-foreground group-hover:text-gallery-olive transition-colors">
                        {artwork.title}
                      </h3>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            {displayedArtworks.length === 0 && (
              <div className="text-center py-20">
                <p className="text-muted-foreground font-body">
                  No artworks found in this category.
                </p>
              </div>
            )}
          </section>
        </main>

        <Footer />

        {/* Lightbox */}
        <ArtworkLightbox
          artwork={selectedArtwork}
          onClose={() => setSelectedArtwork(null)}
        />
      </div>
    </PageTransition>
  );
};

export default GalleryPage;
