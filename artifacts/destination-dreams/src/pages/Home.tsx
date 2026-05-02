import React, { useEffect } from 'react';
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

export default function Home() {
  const { data: config, isLoading } = useGetWeddingConfig();

  useEffect(() => {
    document.documentElement.classList.add("dark");
  }, []);

  if (isLoading || !config) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center gap-6">
          <div className="w-16 h-16 rounded-full border-4 border-primary border-t-transparent animate-spin" />
          <p className="font-serif text-2xl tracking-widest text-primary">Unfolding Magic...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-background text-foreground font-sans selection:bg-primary selection:text-primary-foreground overflow-x-hidden">
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
      
    </div>
  );
}