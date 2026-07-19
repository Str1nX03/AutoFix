import dynamic from "next/dynamic";
import { Suspense } from "react";

import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";

// Skeleton/Loading component
const SectionSkeleton = () => (
  <div className="h-96 bg-gradient-to-br from-gray-100 to-gray-50 animate-pulse" />
);

const Services = dynamic(() => import("@/components/Services"), {
  loading: () => <SectionSkeleton />,
  ssr: true,
});
// const DemoSection = dynamic(() => import("@/components/Demo"), {
//   loading: () => <SectionSkeleton />,
//   ssr: false,
// });
import DemoSection from "@/components/Demo";
const WhyUs = dynamic(() => import("@/components/WhyUS"), {
  loading: () => <SectionSkeleton />,
  ssr: true,
});
const FAQ = dynamic(() => import("@/components/FAQ"), {
  loading: () => <SectionSkeleton />,
  ssr: true,
});
const FinalCTA = dynamic(() => import("@/components/FinalCTA"), {
  loading: () => <SectionSkeleton />,
  ssr: true,
});
const Footer = dynamic(() => import("@/components/Footer"), {
  loading: () => <SectionSkeleton />,
  ssr: true,
});

export const metadata = {
  title: "AI Chatbot Solutions | AutoFix",
};

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Suspense fallback={<SectionSkeleton />}>
          <Services />
        </Suspense>
        <Suspense fallback={<SectionSkeleton />}>
          <DemoSection />
        </Suspense>
        <Suspense fallback={<SectionSkeleton />}>
          <WhyUs />
        </Suspense>
        <Suspense fallback={<SectionSkeleton />}>
          <FAQ />
        </Suspense>
        <Suspense fallback={<SectionSkeleton />}>
          <FinalCTA />
        </Suspense>
      </main>
      <Suspense fallback={null}>
        <Footer />
      </Suspense>
    </>
  );
}