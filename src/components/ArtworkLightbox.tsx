import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import type { Artwork } from '@/data/artworks';

interface ArtworkLightboxProps {
  artwork: Artwork | null;
  onClose: () => void;
}

export const ArtworkLightbox = ({ artwork, onClose }: ArtworkLightboxProps) => {
  // Close on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    if (artwork) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [artwork, onClose]);

  if (!artwork) return null;

  const lightbox = (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="fixed inset-0 w-full h-full z-50 flex items-center justify-center p-4 md:p-8"
        onClick={onClose}
      >
        {/* Backdrop */}
        <div className="absolute inset-0 bg-foreground/90 backdrop-blur-sm" />

        {/* Content */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.3 }}
          className="relative z-10 w-full max-w-sm md:max-w-2xl lg:max-w-6xl max-h-[90vh] bg-background rounded-2xl overflow-hidden shadow-gallery flex flex-col lg:flex-row"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 p-2 bg-background/80 backdrop-blur-sm rounded-full hover:bg-background transition-colors"
            aria-label="Close lightbox"
          >
            <X size={20} className="text-foreground" />
          </button>

          {/* Image */}
          <div className="flex-1 lg:flex-[1.5] bg-muted min-h-48 md:min-h-64 lg:min-h-full">
            <img
              src={artwork.image}
              alt={artwork.title}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Details */}
          <div className="flex-1 p-4 md:p-6 lg:p-10">
            <span className="text-xs uppercase tracking-[0.2em] text-gallery-terracotta font-body">
              {artwork.year}
            </span>
            <h2 className="mt-2 font-display text-2xl md:text-3xl lg:text-4xl font-medium text-foreground">
              {artwork.title}
            </h2>
            
            <div className="mt-4 md:mt-8 space-y-4 md:space-y-6">
              <div>
                <span className="block text-xs uppercase tracking-wider text-muted-foreground font-body mb-1">
                  Medium
                </span>
                <p className="font-body text-foreground">{artwork.medium}</p>
              </div>
              
              <div>
                <span className="block text-xs uppercase tracking-wider text-muted-foreground font-body mb-1">
                  About This Piece
                </span>
                <p className="font-body text-muted-foreground leading-relaxed">
                  {artwork.description}
                </p>
              </div>

              <div className="pt-6 border-t border-border">
                <p className="text-sm text-muted-foreground font-body">
                  Interested in this piece? <br />
                  <a
                    href="mailto:hello@artistry.com"
                    className="text-foreground hover:text-gallery-olive transition-colors underline underline-offset-4"
                  >
                    Contact for inquiries
                  </a>
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );

  return createPortal(lightbox, document.body);
};
