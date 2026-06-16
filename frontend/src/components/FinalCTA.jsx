"use client";

import { useState } from "react";

export default function FinalCTA() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const email = e.target.email.value;

    try {
      setLoading(true);

      const response = await fetch("/api/lead", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        throw new Error("Failed");
      }

      setSuccess(true);

      e.target.reset();
    } catch (error) {
      console.error(error);
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section
      id="final-cta"
      aria-labelledby="final-cta-heading"
      className="bg-[#f5f0e9] pb-16 sm:pb-24"
    >
      <div className="mx-auto max-w-5xl px-6">
        <div className="overflow-hidden rounded-[24px] bg-[#120905] p-6 shadow-xl sm:p-8 lg:p-10">
          <div className="grid items-center gap-8 md:grid-cols-[1.2fr_1fr]">
            {/* Content */}
            <div>
              <h2
                id="final-cta-heading"
                className="text-3xl font-serif font-bold leading-[1.1] tracking-tight text-white sm:text-4xl lg:text-[2.75rem]"
              >
                Hire your first AI{" "}
                <span className="my-1 inline-block -skew-x-2 bg-[#f4d21f] px-2 py-0.5 text-black">
                  employee
                </span>{" "}
                this week.
              </h2>

              <p className="mt-4 max-w-lg text-sm leading-relaxed text-white/60">
                Get the rollout checklist, agent training brief, and ROI model
                we use with every Growth customer.
              </p>
            </div>

            {/* Form */}
            <form
              onSubmit={handleSubmit}
              className="flex w-full flex-col gap-3 sm:flex-row"
            >
              <label htmlFor="email" className="sr-only">
                Work email
              </label>

              <input
                id="email"
                name="email"
                type="email"
                required
                autoComplete="email"
                placeholder="you@company.com"
                className="
                  flex-1
                  rounded-full
                  border border-white/20
                  bg-white/5
                  px-5 py-3
                  text-sm text-white
                  placeholder:text-white/40
                  outline-none
                  transition-colors
                  focus:border-[#ef4d00]
                "
              />

              <button
                type="submit"
                disabled={loading}
                className="
    shrink-0
    rounded-full
    bg-[#ef4d00]
    px-6 py-3
    text-sm
    font-semibold
    text-white
    transition-all
    disabled:opacity-50
  "
              >
                {loading ? "Sending..." : "Get the deploy guide"}
              </button>
            </form>

            {success && (
              <p className="text-sm text-green-400">
                Thanks! Check your inbox shortly.
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
