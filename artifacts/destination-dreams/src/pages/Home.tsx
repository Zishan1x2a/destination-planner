import { useState, useEffect } from 'react';
import { useGetWeddingConfig } from '@workspace/api-client-react';
import { Navigation } from '../components/Navigation';
import { HeroSection } from '../components/HeroSection';
import { StorySection } from '../components/StorySection';
import { DestinationSection } from '../components/DestinationSection';
import { TravelSection } from '../components/TravelSection';
import { ItinerarySection } from '../components/ItinerarySection';
import { ExperiencesSection } from '../components/ExperiencesSection';
import { GallerySection } from '../components/GallerySection';
import { CountdownSection } from '../components/CountdownSection';
import { FaqSection } from '../components/FaqSection';
import { RsvpSection } from '../components/RsvpSection';
import { EnvelopeIntro } from '../components/EnvelopeIntro';
import { motion, AnimatePresence } from 'framer-motion';

export default function Home() {
  const { data: config, isLoading } = useGetWeddingConfig();
  const [introComplete, setIntroComplete] = useState(false);
  const [showSite, setShowSite] = useState(false);

  useEffect(() => {
    document.documentElement.classList.add("dark");
  }, []);

  const handleIntroComplete = () => {
    setIntroComplete(true);
    // slight delay so the welcome screen fades out gracefully
    setTimeout(() => setShowSite(true), 150);
  };

  if (isLoading || !config) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-6">
          <div
            className="w-14 h-14 rounded-full border-2 border-t-transparent animate-spin"
            style={{ borderColor: "hsl(42 85% 52%)", borderTopColor: "transparent" }}
          />
          <p
            className="text-2xl tracking-widest"
            style={{ fontFamily: "'Cormorant Garamond', serif", color: "hsl(42 85% 52%)" }}
          >
            Unfolding Magic...
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Envelope + Welcome intro — unmounted once user clicks Begin */}
      <AnimatePresence>
        {!introComplete && (
          <motion.div
            className="fixed inset-0 z-[9999]"
            exit={{ opacity: 0 }}
            transition={{ duration: 0.7, ease: "easeInOut" }}
          >
            <EnvelopeIntro
              coupleName={config.coupleName}
              brideName={config.brideName}
              groomName={config.groomName}
              weddingDate={config.weddingDate}
              destination={config.destination}
              tagline={config.tagline}
              onComplete={handleIntroComplete}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main website — fades in after Begin is clicked */}
      <AnimatePresence>
        {showSite && (
          <motion.div
            className="bg-background text-foreground font-sans selection:bg-primary selection:text-primary-foreground overflow-x-hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.0, ease: "easeOut" }}
          >
            <Navigation coupleName={config.coupleName} />

            <HeroSection
              coupleName={config.coupleName}
              weddingDate={config.weddingDate}
              destination={config.destination}
            />

            <StorySection story={config.story} />

            <DestinationSection
              description={config.destinationDescription}
              facts={config.destinationFacts}
              googleMapsUrl={config.googleMapsUrl}
            />

            <TravelSection
              airport={config.airport}
              hotels={config.hotels}
            />

            <ItinerarySection events={config.events} />

            <ExperiencesSection experiences={config.localExperiences} />

            <GallerySection gallery={config.gallery} />

            <CountdownSection targetDate={config.weddingDateTime} />

            <FaqSection faqs={config.faqs} />

            <RsvpSection contacts={config.contacts} />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
