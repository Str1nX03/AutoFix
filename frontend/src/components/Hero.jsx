"use client";

import { ArrowUpRight } from "lucide-react";

export default function Hero() {
  
  return (
    <section id="product" className="scroll-mt-20 px-4 md:px-6 py-4">
      {" "}
      <div className="max-w-7xl mx-auto">
        {" "}
        <div className="relative overflow-hidden rounded-[28px] bg-[#EF4D00]">
          {/* Glow */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.18),transparent_45%)]" />

          {/* Noise */}
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage:
                "radial-gradient(circle, rgba(255,255,255,0.6) 1px, transparent 1px)",
              backgroundSize: "22px 22px",
            }}
          />

          <div className="relative z-10 flex flex-col items-center justify-center min-h-[520px] px-6 py-16 text-center">
            {/* Label */}
            <p className="mb-8 text-[10px] font-medium uppercase tracking-[0.35em] text-white/75">
              ✺ AI SUPPORT FOR MODERN BUSINESSES
            </p>

            {/* Heading */}
            <h1 className="max-w-5xl font-black leading-[0.9] text-white text-5xl md:text-7xl lg:text-[5.3rem]">
              The AI employee
              <br />
              that{" "}
              <span className="inline-block bg-[#F4D21F] px-3 py-1 text-black italic rotate-[-1deg]">
                knows
              </span>{" "}
              your
              <br />
              business.
            </h1>

            {/* Description */}
            <p className="mt-8 max-w-2xl text-[15px] leading-relaxed text-white/85">
              AutoFix is an AI chat assistant powered by your business data. It
              securely connects to your database, retrieves relevant information
              using RAG, and answers customer questions instantly. Currently
              available as an MVP.
            </p>

            {/* Buttons */}
            <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
              <button
              onClick={() => {
                document.getElementById("demo")?.scrollIntoView({behavior: "smooth"})
              }}
              className="group flex items-center gap-2 rounded-full bg-black px-6 py-3 text-sm font-semibold text-white transition hover:scale-[1.02]">
                Try the live agent
                <ArrowUpRight
                  size={16}
                  className="transition-transform group-hover:translate-x-0.5"
                />
              </button>

              <button 
              onClick={() => {
                document.getElementById("FinalCTA")?.scrollIntoView({behavior: "smooth"})
              }}
              className="rounded-full border border-white/30 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10">
                Give Your Feedback.
              </button>
            </div>

            {/* Stats */}
            <div className="mt-20 w-full max-w-6xl border-t border-white/20 pt-8">
              <div className="grid grid-cols-3 gap-6">
                <div>
                  <h3 className="text-4xl md:text-5xl font-bold text-white">
                    100%
                  </h3>

                  <p className="mt-2 text-[10px] uppercase tracking-[0.18em] text-white/70">
                    PRIVATE KNOWLEDGE
                  </p>
                </div>

                <div>
                  <h3 className="text-4xl md:text-5xl font-bold text-white">
                    3s
                  </h3>

                  <p className="mt-2 text-[10px] uppercase tracking-[0.18em] text-white/70">
                    Median First Response
                  </p>
                </div>

                <div>
                  <h3 className="text-4xl md:text-5xl font-bold text-white">
                    24/7
                  </h3>

                  <p className="mt-2 text-[10px] uppercase tracking-[0.18em] text-white/70">
                    ALWAYS AVAILABLE
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Ticker */}
          <div className="overflow-hidden rounded-b-xl bg-[#10220F] py-2">
            <div className="flex w-max animate-[ticker_50s_linear_infinite]">
              {/* First Set */}
              <div className="flex gap-10 px-5 whitespace-nowrap text-[10px] uppercase tracking-widest text-[#8DD08D]">
                <span>● AI Employee for Your Business</span>
                <span>● Connects to Your Database</span>
                <span>● Instant Customer Replies</span>
                <span>● Private & Secure</span>
                <span>● 24/7 Customer Support</span>
                <span>● No Coding Required</span>
                <span>● Context-Aware Responses</span>
              </div>

              {/* Duplicate Set */}
              <div className="flex gap-10 px-5 whitespace-nowrap text-[10px] uppercase tracking-widest text-[#8DD08D]">
                <span>● AI Employee for Your Business</span>
                <span>● Connects to Your Database</span>
                <span>● Instant Customer Replies</span>
                <span>● Private & Secure</span>
                <span>● 24/7 Customer Support</span>
                <span>● No Coding Required</span>
                <span>● Context-Aware Responses</span>
              </div>
            </div>
          </div>
          <style jsx>{`
            @keyframes ticker {
              from {
                transform: translateX(0);
              }
              to {
                transform: translateX(-50%);
              }
            }
          `}</style>
        </div>
      </div>
    </section>
  );
}
