import React from 'react';
import HeroSection from '../components/HeroSection';
import OurOffersSection from '../components/OffersSection';
import FAQ from '../components/FAQ';
import AdvertiseSection from '../components/AdvertiseSection';


export default function Home() {
  return (
    <main className='space-y-[100px] mx-[120px] mb-[150px]'>
      <HeroSection />
      <OurOffersSection />
      <section id="faq" className="scroll-mt-[100px]">
        <FAQ />
      </section>
      <AdvertiseSection />
    </main>
  );
}
