"use client";

import React from "react";
import { Bot } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[#f5f0e9] border-t border-[#d8d0c5] font-sans">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-14 sm:grid-cols-2 md:grid-cols-4">
        
        {/* Brand Column */}
        <div>
          <div className="flex items-center gap-2 font-serif text-xl font-bold text-black">
            <span className="grid h-7 w-7 place-items-center rounded-md bg-[#ef4d00] text-white shrink-0">
              <Bot className="h-4 w-4" />
            </span>
            AutoFix
          </div>
          <p className="mt-4 max-w-xs text-[14px] leading-relaxed text-neutral-600">
            The AI employee that knows your business and supports your customers 24/7. Founded 2025.
          </p>
        </div>

        {/* Links Columns */}
        {[
          { h: "Product", l: ["Capabilities", "Live demo", "Integrations", "Changelog"] },
          { h: "Company", l: ["About", "Customers", "Careers", "Press"] },
          { h: "Resources", l: ["Docs", "Deploy guide", "Security", "Privacy"] },
        ].map((c) => (
          <div key={c.h}>
            <div className="text-[11px] font-semibold uppercase tracking-[0.15em] text-neutral-500">
              {c.h}
            </div>
            <ul className="mt-4 space-y-3 text-[14px] text-black">
              {c.l.map((x) => (
                <li key={x}>
                  <a href="#" className="hover:text-[#ef4d00] transition-colors">
                    {x}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
        
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-[#d8d0c5]">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-6 py-6 font-mono text-[10px] uppercase tracking-[0.2em] text-neutral-500">
          <span>© 2026 AutoFix Inc. · San Francisco</span>
          <span>Trained with care · Deployed in 48h</span>
        </div>
      </div>
    </footer>
  );
}