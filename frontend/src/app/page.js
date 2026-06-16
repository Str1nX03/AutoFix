import dynamic from "next/dynamic";

import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";

// Lazy load below-the-fold sections
const Services = dynamic(() => import("@/components/Services"));
const DemoSection = dynamic(() => import("@/components/Demo"));
const ChatBotUi = dynamic(() => import("@/components/ChatBotUi"));
const WhyUs = dynamic(() => import("@/components/WhyUS"));
const FAQ = dynamic(() => import("@/components/FAQ"));
const FinalCTA = dynamic(() => import("@/components/FinalCTA"));
const Footer = dynamic(() => import("@/components/Footer"));

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Services />
        <DemoSection />
        <ChatBotUi />
        <WhyUs />
        <FAQ />
        <FinalCTA />
      </main>
      <Footer />
    </>
  );
}