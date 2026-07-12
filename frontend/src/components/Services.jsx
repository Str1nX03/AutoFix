"use client";

import { PlayCircle } from "lucide-react";

export default function Services() {
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

        {/* Video */}
        <div className="mt-16 overflow-hidden rounded-[30px] border border-[#ddd3c8] bg-[#120905] shadow-[0_30px_80px_rgba(0,0,0,0.15)]">

          {/* Top Bar */}
          <div className="flex items-center justify-between border-b border-white/10 px-6 py-4">
            <div className="flex items-center gap-3">
              <span className="h-3 w-3 rounded-full bg-red-400" />
              <span className="h-3 w-3 rounded-full bg-yellow-400" />
              <span className="h-3 w-3 rounded-full bg-green-400" />
            </div>

            <div className="text-[11px] uppercase tracking-[0.2em] text-white/50">
              PRODUCT DEMO
            </div>
          </div>

          {/* Video */}
          <div className="relative h-[150px] sm:h-[400px] lg:h-[520px] bg-black">

            <video
              className="h-full w-full object-cover"
              controls
              preload="none"
              playsInline
              poster="/demo-thumbnail.jpg"
              loading="lazy"
            >
              <source src="/demo.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>

            {/* Remove this overlay once you have a real video */}
            
            <div className="absolute inset-0 flex items-center justify-center">
              <button className="flex items-center gap-3 rounded-full bg-white px-6 py-3 font-semibold shadow-xl transition hover:scale-105">
                <PlayCircle size={24} />
                Product Video In Progress
              </button>
            </div>
           

          </div>

          {/* Footer */}
          <div className="flex flex-wrap items-center justify-between gap-4 border-t border-white/10 px-6 py-4 text-[11px] uppercase tracking-[0.2em] text-white/60">

            <span>AI CHAT</span>

            <span>RAG</span>

            <span>DATABASE CONNECTED</span>

            <span>MVP PREVIEW</span>

          </div>
        </div>

      </div>
    </section>
  );
}