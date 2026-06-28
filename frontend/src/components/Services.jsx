"use client";

import { Sparkles } from "lucide-react";

const cards = [
  {
    id: "01",
    label: "Customer Support",
    title: "Resolve 70% of tickets, instantly.",
    body: "Trained on your help center, past tickets, and product docs. Answers in your voice, escalates cleanly to a human when needed.",
    metric: "70%+",
    metricLabel: "Auto Resolved",
    featured: false,
  },
  {
    id: "02",
    label: "Sales & Onboarding",
    title: "Qualify leads and onboard 24/7.",
    body: "Greets visitors, books demos, captures intent, and walks new users through your product the same way your best CSM would.",
    metric: "3.4×",
    metricLabel: "Conversion Lift",
    featured: true,
  },
  {
    id: "03",
    label: "Internal Operations",
    title: "Answer your team, not just customers.",
    body: "Plug AutoFix into Slack. It searches your docs, SOPs, wikis, and internal knowledge so your team gets answers instantly.",
    metric: "24/7",
    metricLabel: "INTERNAL ASSISTANCE",
    featured: false,
  },
];

export default function Services() {
  return (
    <section className="bg-[#f6f0e8] py-24">
      {" "}
      <div className="max-w-7xl mx-auto px-6">
        {/* Top Content */}

        <div className="grid lg:grid-cols-2 gap-12 items-end">
          <div>
            <h2
              className="
            text-[4rem]
            md:text-[5.5rem]
            font-black
            leading-[0.9]
            tracking-tight
            text-black
          "
            >
              Three jobs.
              <br />
              One{" "}
              <span className="bg-[#f4d21f] px-4 inline-block">employee.</span>
            </h2>
          </div>

          <div>
            <p className="max-w-xl text-[18px] leading-relaxed text-[#5e554d]">
              AutoFix isn't a chat widget. It's a single AI teammate that learns
              your business once and shows up wherever your customers and team
              need it — support, sales, ops.
            </p>
          </div>
        </div>

        {/* Cards */}

        <div className="mt-16 grid md:grid-cols-3 gap-5">
          {cards.map((card) => (
            <div
              key={card.id}
              className={`rounded-[24px] p-7 flex flex-col justify-between min-h-[360px]
          ${
            card.featured
              ? "bg-[#ef4d00] text-white"
              : "bg-[#f8f5f0] border border-[#ddd3c8] text-black"
          }`}
            >
              <div>
                <div
                  className={`flex justify-between items-center text-[10px] uppercase tracking-[0.25em]
              ${card.featured ? "text-white/80" : "text-[#8a7f75]"}`}
                >
                  <span>
                    {card.id} — {card.label}
                  </span>

                  {/* <Sparkles size={14} /> */}
                </div>

                <h3
                  className="
                mt-8
                text-[2rem]
                font-black
                leading-tight
              "
                >
                  {card.title}
                </h3>

                <p
                  className={`mt-5 text-[15px] leading-7
              ${card.featured ? "text-white/85" : "text-[#5e554d]"}`}
                >
                  {card.body}
                </p>
              </div>

              <div
                className={`mt-10 pt-6 border-t
            ${card.featured ? "border-white/20" : "border-[#ddd3c8]"}`}
              >
                <div className="flex justify-between items-end">
                  <h4 className="text-5xl font-black">{card.metric}</h4>

                  <span
                    className={`text-[10px] uppercase tracking-[0.2em]
                ${card.featured ? "text-white/70" : "text-[#8a7f75]"}`}
                  >
                    {card.metricLabel}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
