"use client";

import React from "react";

export default function FinalCTA() {
  return (
    <section id="FinalCTA" className="bg-[#f5f0e9] pb-16 font-sans">
      {/* Reduced max-width from 7xl to 5xl for a tighter layout */}
      <div className="mx-auto max-w-5xl px-6">
        {/* Reduced border radius and padding (p-6/p-8 instead of p-10/p-14) */}
        <div className="bg-[#120905] overflow-hidden rounded-[24px] p-6 sm:p-8 lg:p-10 shadow-xl">
          
          <div className="grid items-center gap-6 md:grid-cols-[1.2fr_1fr]">
            
            {/* Left Side: Heading & Subtext */}
            <div>
              {/* Scaled down heading sizes (3rem instead of 4rem) */}
              <h2 className="text-3xl sm:text-4xl lg:text-[2.75rem] font-serif font-bold leading-[1.1] tracking-tight text-white">
                Hire your first AI{" "}
                <span className="bg-[#f4d21f] text-black px-2 py-0.5 inline-block -skew-x-2 transform my-1">
                  employee
                </span>{" "}
                this week.
              </h2>
              {/* Reduced margin and text size */}
              <p className="mt-4 text-[12px] sm:text-[13px] leading-relaxed text-white/60 max-w-lg">
                A 12-page PDF with the rollout checklist, agent training brief, and ROI model we use
                with every Growth customer.
              </p>
            </div>

            {/* Right Side: Form */}
            <form
              onSubmit={(e) => e.preventDefault()}
              className="flex flex-col gap-2.5 sm:flex-row items-stretch sm:items-center w-full"
            >
              <input
                type="email"
                required
                placeholder="you@company.com"
                className="
                  flex-1 
                  rounded-full 
                  border border-white/20 
                  bg-white/5 
                  px-4 py-3 
                  text-[14px] text-white 
                  placeholder:text-white/40 
                  outline-none 
                  focus:border-[#ef4d00] 
                  transition-colors
                "
              />
              <button
                type="submit"
                className="
                  rounded-full 
                  bg-[#ef4d00] 
                  px-6 py-3 
                  text-[14px] font-semibold text-white 
                  hover:bg-[#d54400] 
                  transition-colors 
                  shrink-0
                "
              >
                Get the deploy guide
              </button>
            </form>
            
          </div>
          
        </div>
      </div>
    </section>
  );
}