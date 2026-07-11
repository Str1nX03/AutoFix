"use client";

import { useState } from "react";

export default function FinalCTA() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const form = e.target;

    const data = {
      subject: form.subject.value,
      email: form.email.value,
      message: form.message.value,
    };

    try {
      setLoading(true);

      const response = await fetch("/api/lead", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error();

      setSuccess(true);
      form.reset();
    } catch (err) {
      alert("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section
      id="FinalCTA"
      aria-labelledby="final-cta-heading"
      className="scroll-mt-40 bg-[#f5f0e9] pb-16 sm:pb-24"
    >
      <div className="mx-auto max-w-5xl px-6">
        <div className="overflow-hidden rounded-[24px] bg-[#120905] px-8 py-8 shadow-xl lg:px-10 lg:py-8">
          <div className="grid items-center gap-10 lg:grid-cols-[0.95fr_1.05fr]">
            {/* Content */}
            <div>
              <h2
                id="final-cta-heading"
                className="text-3xl font-serif font-bold leading-[1.1] tracking-tight text-white sm:text-4xl lg:text-[2.75rem]"
              >
                Help shape the future of{" "}
                <span className="my-1 inline-block -skew-x-2 bg-[#f4d21f] px-2 py-0.5 text-black">
                  AutoFix.
                </span>{" "}
              </h2>

              <p className="mt-4 max-w-lg text-sm leading-relaxed text-white/60">
                AutoFix is currently in MVP. We'd love your feedback, ideas, and
                suggestions to help us build a better AI support assistant.
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                name="subject"
                placeholder="Feedback topic"
                className="w-full rounded-xl border border-white/20 bg-white/5 px-5 py-3 text-white placeholder:text-white/40"
              />

              <input
                type="email"
                name="email"
                placeholder="Your email"
                required
                className="w-full rounded-xl border border-white/20 bg-white/5 px-5 py-3 text-white placeholder:text-white/40"
              />

              <textarea
                name="message"
                rows={5}
                required
                placeholder="Share your feedback, ideas, feature requests, or report a bug..."
                className="w-full rounded-xl border border-white/20 bg-white/5 px-5 py-3 text-white placeholder:text-white/40 resize-none"
              />

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl bg-[#ef4d00] py-3 font-semibold text-white"
              >
                {loading ? "Sending..." : "Send FeedBack"}
              </button>
            </form>

            {success && (
              <p className="text-sm text-green-400">
                Thanks! We Contact You Soon.
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
