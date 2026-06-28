const FAQ_ITEMS = [
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

export default function FAQ() {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQ_ITEMS.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.a,
      },
    })),
  };

  return (
    <section
      id="faq"
      className="bg-[#f5f0e9] py-24 sm:py-32 font-sans"
      aria-labelledby="faq-heading"
    >
      {/* SEO FAQ Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqSchema),
        }}
      />

      <div className="mx-auto max-w-7xl px-6">
        {/* Header */}
        <div className="mb-16 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <h2
              id="faq-heading"
              className="max-w-3xl text-5xl lg:text-[4rem] font-serif font-bold leading-[1.05] tracking-tight text-[#120905]"
            >
              Questions worth answering
              <br />
              <span className="text-neutral-500">
                before you sign anything.
              </span>
            </h2>

            <p className="mt-5 max-w-xl text-base leading-relaxed text-neutral-600">
              Everything you need to know about AutoFix AI, deployment,
              integrations, security, support, and how it fits into your
              workflow.
            </p>
          </div>

          <div className="hidden md:block font-mono text-[10px] uppercase tracking-[0.2em] text-neutral-500">
            {String(FAQ_ITEMS.length).padStart(2, "0")} questions
          </div>
        </div>

        {/* FAQ List */}
        <div className="divide-y divide-[#d8d0c5] border-y border-[#d8d0c5]">
          {FAQ_ITEMS.map((item, index) => (
            <details
              key={item.q}
              className="group py-6 transition-all duration-300"
            >
              <summary
                aria-label={item.q}
                className="flex cursor-pointer list-none items-start justify-between gap-6 outline-none marker:content-none [&::-webkit-details-marker]:hidden"
              >
                <div className="flex items-start gap-6">
                  <span className="mt-1.5 shrink-0 font-mono text-[11px] text-neutral-500">
                    {String(index + 1).padStart(2, "0")}
                  </span>

                  <h3 className="text-xl sm:text-2xl font-serif font-bold text-[#120905]">
                    {item.q}
                  </h3>
                </div>

                <span className="mt-0.5 shrink-0 text-3xl leading-none font-light text-[#ef4d00] transition-transform duration-300 group-open:rotate-45">
                  +
                </span>
              </summary>

              <div className="overflow-hidden">
                <p className="ml-[3.25rem] mt-4 max-w-3xl text-[15px] leading-relaxed text-neutral-600">
                  {item.a}
                </p>
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}