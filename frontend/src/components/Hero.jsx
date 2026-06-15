"use client";

import { ArrowUpRight } from "lucide-react";

export default function Hero() {
  return (
    <section id="product" className="px-4 md:px-6 py-4">
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
              ✦ ISSUE 04 — SPRING 2026 RELEASE
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
              AutoFix is a private AI support agent trained on your docs,
              products, and policies — answering your customers 24/7 across
              chat, email.
            </p>

            {/* Buttons */}
            <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
              <button className="group flex items-center gap-2 rounded-full bg-black px-6 py-3 text-sm font-semibold text-white transition hover:scale-[1.02]">
                Try the live agent
                <ArrowUpRight
                  size={16}
                  className="transition-transform group-hover:translate-x-0.5"
                />
              </button>

              <button className="rounded-full border border-white/30 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10">
                Schedule a deploy call
              </button>
            </div>

            {/* Stats */}
            <div className="mt-20 w-full max-w-6xl border-t border-white/20 pt-8">
              <div className="grid grid-cols-3 gap-6">
                <div>
                  <h3 className="text-4xl md:text-5xl font-bold text-white">
                    71.4%
                  </h3>

                  <p className="mt-2 text-[10px] uppercase tracking-[0.18em] text-white/70">
                    Tickets Resolved Without A Human
                  </p>
                </div>

                <div>
                  <h3 className="text-4xl md:text-5xl font-bold text-white">
                    1.2s
                  </h3>

                  <p className="mt-2 text-[10px] uppercase tracking-[0.18em] text-white/70">
                    Median First Response
                  </p>
                </div>

                <div>
                  <h3 className="text-4xl md:text-5xl font-bold text-white">
                    412
                  </h3>

                  <p className="mt-2 text-[10px] uppercase tracking-[0.18em] text-white/70">
                    Businesses Already Deployed
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Bottom Ticker */}
        <div className="overflow-hidden rounded-b-xl bg-[#10220F] py-2">
          <div className="flex whitespace-nowrap animate-[ticker_30s_linear_infinite] gap-10 text-[10px] uppercase tracking-widest text-[#8DD08D]">
            <span>● CSAT 4.82 / 5 +0.02</span>
            <span>● Channels Live 8 +1</span>
            <span>● Languages 47 +2</span>
            <span>● Deployed In 1.6d -0.2d</span>
            <span>● Tickets Resolved 71.4% +0.3%</span>

            <span>● CSAT 4.82 / 5 +0.02</span>
            <span>● Channels Live 8 +1</span>
            <span>● Languages 47 +2</span>
            <span>● Deployed In 1.6d -0.2d</span>
            <span>● Tickets Resolved 71.4% +0.3%</span>
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
    </section>
  );
}
