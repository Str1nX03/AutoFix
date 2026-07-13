"use client";

import { useEffect, useRef } from "react";

export default function Services() {
  const videoRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            videoRef.current?.play().catch((error) => {
              console.log("Autoplay prevented by browser:", error);
            });
          } else {
            videoRef.current?.pause();
          }
        });
      },
      { threshold: 0.5 }
    );

    if (videoRef.current) {
      observer.observe(videoRef.current);
    }

    return () => {
      if (videoRef.current) {
        // eslint-disable-next-line react-hooks/exhaustive-deps
        observer.unobserve(videoRef.current);
      }
    };
  }, []);

  return (
    <section className="bg-[#f6f0e8] py-24">
      <div className="max-w-7xl mx-auto px-6">

        {/* Header */}
        <div className="grid lg:grid-cols-2 gap-12 items-end">
          <div>
            <p className="mb-4 text-[10px] uppercase tracking-[0.3em] text-[#8a7f75]">
              ✺ PRODUCT WALKTHROUGH
            </p>

            <h2 className="text-[4rem] md:text-[5.5rem] font-black leading-[0.9] tracking-tight text-black">
              See AutoFix
              <br />
              <span className="bg-[#f4d21f] px-4 inline-block">
                in action.
              </span>
            </h2>
          </div>

          <div>
            <p className="max-w-xl text-[18px] leading-relaxed text-[#5e554d]">
              Watch how AutoFix connects to your business data, retrieves
              relevant information using RAG, and answers customer questions
              instantly through AI chat.
            </p>
          </div>
        </div>

        {/* Video Only */}
        {/* ADDED: max-w-5xl and mx-auto to constrain the overall size */}
        <div className="mt-16 mx-auto max-w-5xl relative w-full aspect-video overflow-hidden rounded-[30px] shadow-[0_30px_80px_rgba(0,0,0,0.15)] bg-black">
          <video
            ref={videoRef}
            className="h-full w-full object-cover"
            controls
            preload="none"
            playsInline
            loading="lazy"
            loop
            muted // Required for programmatic autoplay in modern browsers
          >
            <source src="/demo.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>

      </div>
    </section>
  );
}