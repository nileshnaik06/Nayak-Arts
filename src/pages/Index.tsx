import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { HeroSection } from '@/components/HeroSection';
import { ArtistSection } from '@/components/ArtistSection';
import { FeaturedWorks } from '@/components/FeaturedWorks';
import { CategorySection } from '@/components/CategorySection';
import { ContactCTA } from '@/components/ContactCTA';
import { PageTransition } from '@/components/PageTransition';

const Index = () => {
  return (
    <PageTransition>
      <div className="min-h-screen bg-background">
        <Header />
        <main>
          <HeroSection />
          <FeaturedWorks />
          <ArtistSection />
          <CategorySection />
          <ContactCTA />
        </main>
        <Footer />
      </div>
    </PageTransition>
  );
};

export default Index;
