import ChatBotUi from "@/components/ChatBotUi";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Services from "@/components/Services";
import DemoSection from "@/components/Demo";

export default function Home() {
  return (
    <div className="">
      <Navbar />
      <Hero />
      <Services />
      <DemoSection />
      <ChatBotUi />
    </div>
  );
}
