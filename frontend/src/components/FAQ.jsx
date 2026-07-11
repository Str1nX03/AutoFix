const FAQ_ITEMS = [
  {
    q: "What is AutoFix?",
    a: "AutoFix is an AI customer support assistant that securely connects to your business data. It understands your business using your own data and provides fast, accurate answers to customer questions through AI chat.",
  },
  {
    q: "How does AutoFix work?",
    a: "AutoFix connects to your existing database or business systems. When a customer asks a question, it searches your business data using RAG, retrieves the most relevant information, and generates an accurate, context-aware response.",
  },
  {
    q: "How long does deployment take?",
    a: "AutoFix is currently in the MVP stage. Deployment time depends on your existing infrastructure and how your business data is organized. During the MVP, setup is handled with our assistance to ensure AutoFix connects securely to your environment and retrieves information correctly.",
  },
  {
    q: "Can AutoFix answer customer questions accurately?",
    a: "Yes. Instead of relying on generic AI knowledge, AutoFix retrieves information directly from your connected business data. This helps ensure responses are accurate, relevant, and consistent with your business information.",
  },
  {
    q: "What happens if AutoFix can't answer a question?",
    a: "If a question falls outside the knowledge available to AutoFix, it will inform the user that the request is outside its scope rather than guessing or providing misleading information.",
  },
  {
    q: "Which platforms does AutoFix integrate with?",
    a: "AutoFix is designed to work with websites, live chat.",
  },
  {
    q: "Is my business data secure?",
    a: "Yes. AutoFix runs inside your own environment, so your business data never needs to leave your infrastructure. It securely retrieves only the information required to answer customer questions using RAG, giving you full control over your data and security.",
  },
  {
    q: "Can I test AutoFix before deploying it?",
    a: "Yes. As part of the MVP, you can request a live demo to see how AutoFix works, ask questions, and explore how it connects to your business data. We'll walk you through the setup process and discuss how it can fit your workflow.",
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
              Everything you need to know about how AutoFix connects to your
              business data, answers customer questions with AI, protects your
              information, and fits into your existing workflow.
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
