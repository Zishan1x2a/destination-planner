import { useState, useEffect } from 'react';
import { Navigation } from '../components/Navigation';
import { AnimatedSectionDivider } from '../components/OrnamentalElements';
import { HeroSection } from '../components/HeroSection';
import { CoupleRevealSection } from '../components/CoupleRevealSection';
import { StorySection } from '../components/StorySection';
import { DestinationSection } from '../components/DestinationSection';
import { ItinerarySection } from '../components/ItinerarySection';
import { FamilySection } from '../components/FamilySection';
import { GallerySection } from '../components/GallerySection';
import { BlessingSection } from '../components/BlessingSection';
import { AcceptInvitationSection } from '../components/AcceptInvitationSection';
import { ContactSection } from '../components/ContactSection';
import { EnvelopeIntro } from '../components/EnvelopeIntro';
import { motion, AnimatePresence } from 'framer-motion';
import { MOCK_WEDDING_CONFIG as config } from '../constants/mockConfig';

export default function Home() {
  const [introComplete, setIntroComplete] = useState(false);
  const [showContent, setShowContent] = useState(false);
  const [invitationOpened, setInvitationOpened] = useState(false);

  useEffect(() => {
    document.documentElement.classList.add("dark");
  }, []);

  const handleIntroComplete = () => {
    setIntroComplete(true);
    setTimeout(() => setShowContent(true), 100);
  };


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
            className={`relative bg-background text-foreground font-sans selection:bg-primary selection:text-primary-foreground overflow-x-hidden no-scrollbar ${!invitationOpened ? 'h-[100dvh] overflow-y-hidden' : 'min-h-[100dvh]'}`}
            initial={{ opacity: 0, scale: 1.03 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.0, ease: [0.16, 1, 0.3, 1] }}
          >
            <Navigation coupleName={config.coupleName} />

            <AnimatePresence>
              {!invitationOpened ? (
                <motion.div
                  key="hero-section"
                  className="absolute inset-0 z-50 origin-center"
                  exit={{ opacity: 0, scale: 1.05, filter: "blur(15px)" }}
                  transition={{ duration: 1.5, ease: "easeInOut" }}
                >
                  {/* 1 — Welcome / Invitation Hero */}
                  <HeroSection
                    coupleName={config.coupleName}
                    weddingDate={config.weddingDate}
                    destination={config.destination}
                    onOpen={() => setInvitationOpened(true)}
                    isOpened={invitationOpened}
                  />
                </motion.div>
              ) : (
                <motion.div
                  key="main-content"
                  initial={{ opacity: 0, y: 100 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
                  className="relative z-10 pt-0 min-h-screen" 
                >
                  <div id="hero" className="absolute top-0" /> {/* Anchor for 'Home' nav link */}
                  
                  {/* 2 — Cinematic Couple Reveal */}
                  <CoupleRevealSection
                    brideName={config.brideName}
                    groomName={config.groomName}
                  />
                  <AnimatedSectionDivider />

                  {/* 3 — Love Story */}
                  <StorySection story={config.story} />
                  <AnimatedSectionDivider />

                  {/* 6 — Itinerary / Events */}
                  <ItinerarySection events={config.events} />
                  <AnimatedSectionDivider />

                  {/* 7 — Family */}
                  <FamilySection />
                  <AnimatedSectionDivider />

                  {/* 8 — Gallery */}
                  <GallerySection gallery={config.gallery} />
                  <AnimatedSectionDivider />

                  {/* 10 — Blessings */}
                  <BlessingSection />
                  <AnimatedSectionDivider />

                  {/* 11 — Accept Invitation */}
                  <AcceptInvitationSection />
                  <AnimatedSectionDivider />

                  {/* 4 — Destination (Venue) */}
                  <DestinationSection
                    description={config.destinationDescription}
                    facts={config.destinationFacts}
                    googleMapsUrl={config.googleMapsUrl}
                  />
                  <AnimatedSectionDivider />

                  {/* 14 — Contact */}
                  <ContactSection contacts={config.contacts} />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
