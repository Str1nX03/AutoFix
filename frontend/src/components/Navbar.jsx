"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { ArrowUpRight, Bot, Menu, X } from "lucide-react";

// 1. Moved static data outside the component to prevent recreation on every render
const navLinks = [
  { name: "Product", href: "#product" },
  { name: "Demo", href: "#demo" },
  { name: "Why AutoFix", href: "#why-autofix" },
  // { name: "Pricing", href: "#pricing" },
  { name: "FAQ", href: "#faq" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("product");

  // 2. Use a ref instead of state to prevent unnecessary re-renders during smooth scroll
  const isScrollingRef = useRef(false);

  useEffect(() => {
    // 1. Combine navLink IDs with the IDs of sections where the highlight should turn off
    const observedIds = [
      ...navLinks.map((link) => link.href.replace("#", "")),
      "FinalCTA", // ID for your Contact section
      "feedback", // <-- IMPORTANT: Replace this with the actual ID of your Feedback section!
    ];

    // 2. Map the extended list of IDs to their DOM elements
    const sections = observedIds
      .map((id) => document.getElementById(id))
      .filter(Boolean);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          // Check the ref value directly
          if (entry.isIntersecting && !isScrollingRef.current) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { threshold: 0.1, rootMargin: "-100px 0px -20% 0px" },
    );

    sections.forEach((section) => {
      observer.observe(section);
    });

    return () => observer.disconnect();
  }, []);

  const handleScroll = (e, href) => {
    if (href.startsWith("#")) {
      e.preventDefault();
      const targetId = href.replace("#", "");
      const elem = document.getElementById(targetId);

      if (elem) {
        isScrollingRef.current = true;
        setActiveSection(targetId);

        elem.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });

        setTimeout(() => {
          isScrollingRef.current = false;
        }, 1200);
      }

      setIsOpen(false);
    }
  };

  return (
    <header className="w-full px-4 md:px-6 py-4 bg-[#f5f0e9] sticky top-0 z-50">
      <nav className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <Link
          href="/"
          onClick={() =>
            document
              .getElementById("product")
              ?.scrollIntoView({ behavior: "smooth" })
          }
          className="flex items-center gap-2"
        >
          <div className="w-8 h-8 rounded-full bg-[#ef4d00] flex items-center justify-center">
            <Bot className="w-4 h-4 text-white" />
          </div>
          <span className="text-2xl md:text-3xl font-serif font-bold text-black">
            AutoFix
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center bg-[#f8f5f0] border border-gray-300 rounded-full p-1 gap-1 shadow-sm font-sans text-[15px]">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              onClick={(e) => handleScroll(e, link.href)}
              className={`px-5 py-2 rounded-full transition ${
                activeSection === link.href.replace("#", "")
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
            onClick={(e) => handleScroll(e, "#FinalCTA")}
            className="flex items-center gap-1 md:gap-2 bg-black text-white px-4 py-2.5 md:px-5 md:py-3 rounded-full font-medium hover:bg-neutral-800 transition text-[13px] md:text-[15px] whitespace-nowrap"
          >
            <span className="hidden sm:inline">Contact</span>
            <span className="sm:hidden">Demo</span>
            <ArrowUpRight className="w-4 h-4" />
          </Link>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2 text-black"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
            aria-expanded={isOpen} // Added accessibility property
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
