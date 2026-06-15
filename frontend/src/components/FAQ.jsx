"use client";

import React from "react";

export default function FAQ() {
  const items = [
    {
      q: "How long does it take to deploy AutoFix on our site?",
      a: "Typical onboarding is 24–48 hours. You share your help docs, product pages, and policies. We train your agent, you review answers on a private playground, then we ship a snippet to your site.",
    },
    {
      q: "What happens when AutoFix doesn't know the answer?",
      a: "It says so — clearly. It then either escalates to a human in Slack, Zendesk, or Intercom with a full transcript and a one-line intent summary, or captures the customer's email and books a follow-up.",
    },
    {
      q: "Does it actually replace agents, or just frustrate customers?",
      a: "Across 412 deployments, AutoFix resolves 70%+ of conversations without human handoff and lifts CSAT by an average of 0.4 points. Your humans focus on the hard 30%.",
    },
    {
      q: "Where does our data go? Is it secure?",
      a: "Your training content and conversation logs live in an isolated workspace — never used to train shared models. SOC 2 Type II, GDPR, and DPA available on request.",
    },
    {
      q: "What does it integrate with?",
      a: "Slack, WhatsApp, Intercom, Zendesk, Shopify, HubSpot, Salesforce, Notion, Confluence, Gmail, and a public REST API for anything else.",
    },
    {
      q: "Can I see how it answers before going live?",
      a: "Yes. Every deployment ships with a private review console where your team can rate answers and refine the agent before a single customer talks to it.",
    },
  ];

  return (
    <section id="faq" className="bg-[#f5f0e9] py-24 sm:py-32 font-sans">
      <div className="mx-auto max-w-7xl px-6">
        
        {/* Header */}
        <div className="mb-16 flex items-end justify-between">
          <h2 className="max-w-3xl text-5xl lg:text-[4rem] font-serif font-bold leading-[1.05] tracking-tight text-[#120905]">
            Questions worth answering<br />
            <span className="text-neutral-500">before you sign anything.</span>
          </h2>
          <div className="hidden font-mono text-[10px] uppercase tracking-[0.2em] text-neutral-500 md:block pb-3">
            06 questions
          </div>
        </div>

        {/* Accordion List */}
        <div className="divide-y divide-[#d8d0c5] border-y border-[#d8d0c5]">
          {items.map((it, i) => (
            <details key={i} className="group py-6">
              {/* marker:content-none and [&::-webkit-details-marker]:hidden 
                are used to hide the default browser arrow on the summary tag 
              */}
              <summary className="flex cursor-pointer list-none items-start justify-between gap-6 outline-none marker:content-none [&::-webkit-details-marker]:hidden">
                
                <div className="flex gap-6 items-start">
                  <span className="font-mono text-[11px] text-neutral-500 mt-1.5 shrink-0">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="text-xl sm:text-2xl font-serif font-bold text-[#120905]">
                    {it.q}
                  </h3>
                </div>

                <span className="text-3xl font-light text-[#ef4d00] transition-transform duration-300 group-open:rotate-45 shrink-0 leading-none mt-0.5">
                  +
                </span>
              </summary>
              
              <p className="ml-[3.25rem] mt-4 max-w-3xl text-[15px] leading-relaxed text-neutral-600">
                {it.a}
              </p>
            </details>
          ))}
        </div>
        
      </div>
    </section>
  );
}