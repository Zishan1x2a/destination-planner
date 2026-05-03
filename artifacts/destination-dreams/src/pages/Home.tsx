import { useState, useEffect } from 'react';
import { useGetWeddingConfig } from '@workspace/api-client-react';
import { Navigation } from '../components/Navigation';
import { AnimatedSectionDivider } from '../components/OrnamentalElements';
import { HeroSection } from '../components/HeroSection';
import { CoupleRevealSection } from '../components/CoupleRevealSection';
import { StorySection } from '../components/StorySection';
import { DestinationSection } from '../components/DestinationSection';
import { TravelSection } from '../components/TravelSection';
import { ItinerarySection } from '../components/ItinerarySection';
import { FamilySection } from '../components/FamilySection';
import { GallerySection } from '../components/GallerySection';
import { BlessingSection } from '../components/BlessingSection';
import { AcceptInvitationSection } from '../components/AcceptInvitationSection';
import { ContactSection } from '../components/ContactSection';
import { EnvelopeIntro } from '../components/EnvelopeIntro';
import { motion, AnimatePresence } from 'framer-motion';

export default function Home() {
  const { data: config, isLoading } = useGetWeddingConfig();
  const [introComplete, setIntroComplete] = useState(false);
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    document.documentElement.classList.add("dark");
  }, []);

  const handleIntroComplete = () => {
    setIntroComplete(true);
    setTimeout(() => setShowContent(true), 100);
  };

  if (isLoading || !config) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-6">
          <div className="w-16 h-16 rounded-full border-4 border-primary border-t-transparent animate-spin" />
          <p className="font-serif text-2xl tracking-widest text-primary">Unfolding Magic...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {!introComplete && (
        <EnvelopeIntro
          coupleName={config.coupleName}
          weddingDate={config.weddingDate}
          destination={config.destination}
          onComplete={handleIntroComplete}
        />
      )}

      <AnimatePresence>
        {showContent && (
          <motion.div
            className="bg-background text-foreground font-sans selection:bg-primary selection:text-primary-foreground overflow-x-hidden"
            initial={{ opacity: 0, scale: 1.03 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.0, ease: [0.16, 1, 0.3, 1] }}
          >
            <Navigation coupleName={config.coupleName} />

            {/* 1 — Welcome / Invitation Hero */}
            <HeroSection
              coupleName={config.coupleName}
              weddingDate={config.weddingDate}
              destination={config.destination}
            />
            <AnimatedSectionDivider />

            {/* 2 — Cinematic Couple Reveal */}
            <CoupleRevealSection
              brideName={config.brideName}
              groomName={config.groomName}
            />
            <AnimatedSectionDivider />

            {/* 3 — Love Story */}
            <StorySection story={config.story} />
            <AnimatedSectionDivider />

            {/* 4 — Destination */}
            <DestinationSection
              description={config.destinationDescription}
              facts={config.destinationFacts}
              googleMapsUrl={config.googleMapsUrl}
            />
            <AnimatedSectionDivider />

            {/* 5 — Travel */}
            <TravelSection
              airport={config.airport}
              hotels={config.hotels}
            />
            <AnimatedSectionDivider />

            {/* 6 — Itinerary / Events */}
            <ItinerarySection events={config.events} />
            <AnimatedSectionDivider />

            {/* 7 — Family (new) */}
            <FamilySection />
            <AnimatedSectionDivider />

            {/* 8 — Gallery */}
            <GallerySection gallery={config.gallery} />
            <AnimatedSectionDivider />

            {/* 10 — Blessings (new) */}
            <BlessingSection />
            <AnimatedSectionDivider />

            {/* 11 — Accept Invitation */}
            <AcceptInvitationSection />
            <AnimatedSectionDivider />

            {/* 14 — Contact */}
            <ContactSection contacts={config.contacts} />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
