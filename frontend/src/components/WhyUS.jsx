"use client";

import React from "react";
import { Zap, MessageSquare, Star } from "lucide-react";

export default function WhyUs() {
  const reasons = [
    {
      icon: Zap,
      title: "Context-aware answers.",
      body: "Securely connects to your database and retrieves the most relevant information using RAG, so every response is based on your business data.",
    },
    {
      icon: MessageSquare,
      title: "Quick to integrate.",
      body: "Designed to integrate with your existing infrastructure, AutoFix connects to your business data and starts answering questions with minimal setup.",
    },
    {
      icon: Star,
      title: "Fast AI responses.",
      body: "Built on modern LLM technology, AutoFix delivers accurate, human-like responses in seconds while staying grounded in your business knowledge.",
    },
  ];

  return (
    <section id="why-autofix" className="bg-[#f5f0e9] py-24 sm:py-32 font-sans">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid gap-16 md:grid-cols-[0.9fr_1.1fr] items-start">
          {/* Left Column */}
          <div>
            <h2 className="text-4xl sm:text-5xl lg:text-[3.5rem] font-serif font-bold leading-[1.1] tracking-tight text-black">
              Why your business should switch to —
              <span className="italic underline decoration-[#ef4d00] decoration-4 underline-offset-[6px]">
                AutoFix.
              </span>{" "}
            </h2>
            <p className="mt-6 max-w-md text-[15px] leading-relaxed text-neutral-600">
              AutoFix securely connects to your business data and uses RAG to
              deliver fast, accurate, and context-aware customer support. Here's
              why businesses are making the switch.
            </p>
          </div>

          {/* Right Column */}
          <div className="space-y-4">
            {reasons.map((r, idx) => (
              <div
                key={idx}
                className="flex items-start gap-5 rounded-2xl border border-[#d8d0c5] bg-white p-6 shadow-sm"
              >
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-[#feeee6] text-[#ef4d00]">
                  <r.icon className="h-5 w-5" strokeWidth={2.5} />
                </span>
                <div>
                  <h3 className="text-xl font-bold font-serif text-black">
                    {r.title}
                  </h3>
                  <p className="mt-1.5 text-[14.5px] leading-relaxed text-neutral-600">
                    {r.body}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
