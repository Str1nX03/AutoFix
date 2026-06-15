import ChatBotUi from "@/components/ChatBotUi";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Services from "@/components/Services";
import DemoSection from "@/components/Demo";
import WhyUs from "@/components/WhyUS";
import FAQ from "@/components/FAQ";
import FinalCTA from "@/components/FinalCTA";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <div className="">
      <Navbar />
      <Hero />
      <Services />
      <DemoSection />
      <ChatBotUi />
      <WhyUs />
      <FAQ />
      <FinalCTA />
      <Footer />
    </div>
  );
}
