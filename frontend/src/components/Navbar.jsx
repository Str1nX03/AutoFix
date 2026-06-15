"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowUpRight, Bot, Menu, X } from "lucide-react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  // Updated hrefs to use hash links for sections on the same page
  const navLinks = [
    { name: "Product", href: "#product" },
    { name: "Why AutoFix", href: "#why-autofix" },
    { name: "Demo", href: "#demo" },
    // { name: "Pricing", href: "#pricing" },
    { name: "FAQ", href: "#faq" },
  ];

  // Smooth scroll handler
  const handleScroll = (e, href) => {
    if (href.startsWith("#")) {
      e.preventDefault();
      const targetId = href.replace("#", "");
      const elem = document.getElementById(targetId);
      if (elem) {
        elem.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
      // Close mobile menu after clicking
      setIsOpen(false);
    }
  };

  return (
    <header className="w-full px-4 md:px-6 py-4 bg-[#f5f0e9] sticky top-0 z-50">
      <nav className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-[#ef4d00] flex items-center justify-center">
            <Bot className="w-4 h-4 text-white" />
          </div>

          <span className="text-2xl md:text-3xl font-serif font-bold text-black">
            AutoFix
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center bg-[#f8f5f0] border border-gray-300 rounded-full p-1 gap-1 shadow-sm font-sans text-[15px]">
          {navLinks.map((link, index) => (
            <Link
              key={link.name}
              href={link.href}
              onClick={(e) => handleScroll(e, link.href)}
              className={`px-5 py-2 rounded-full transition ${
                index === 0
                  ? "bg-black text-white font-medium"
                  : "text-neutral-600 hover:bg-black/5 hover:text-black"
              }`}
            >
              {link.name}
            </Link>
          ))}
        </div>

        {/* Right Side */}
        <div className="flex items-center gap-2 md:gap-4 font-sans">
          {/* Book a Demo - Always Visible */}
          <Link
            href="#FinalCTA"
            // CHANGED: Passed "#FinalCTA" to handleScroll instead of "#demo"
            onClick={(e) => handleScroll(e, "#FinalCTA")}
            className="flex items-center gap-1 md:gap-2 bg-black text-white px-4 py-2.5 md:px-5 md:py-3 rounded-full font-medium hover:bg-neutral-800 transition text-[13px] md:text-[15px] whitespace-nowrap"
          >
            <span className="hidden sm:inline">Book a demo</span>
            <span className="sm:hidden">Demo</span>
            <ArrowUpRight className="w-4 h-4" />
          </Link>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2 text-black"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="lg:hidden mt-4 bg-white rounded-2xl shadow-md border border-[#d8d0c5] p-4 font-sans absolute left-4 right-4">
          <div className="flex flex-col gap-2">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="px-4 py-3 rounded-xl hover:bg-[#f5f0e9] text-black transition font-medium"
                onClick={(e) => handleScroll(e, link.href)}
              >
                {link.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}