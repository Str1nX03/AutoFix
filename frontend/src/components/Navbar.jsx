"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowUpRight, Bot, Menu, X } from "lucide-react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { name: "Product", href: "/product" },
    { name: "Why AutoFix", href: "/why-autofix" },
    { name: "Demo", href: "/demo" },
    { name: "Pricing", href: "/pricing" },
    { name: "FAQ", href: "/faq" },
  ];

  return (
    <header className="w-full px-4 md:px-6 py-4 bg-[#f5f0e9]">
      <nav className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-orange-600 flex items-center justify-center">
            <Bot className="w-4 h-4 text-white" />
          </div>

          <span className="text-2xl md:text-3xl font-bold text-black">
            AutoFix
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center bg-[#f8f5f0] border border-gray-300 rounded-full p-1 gap-1 shadow-sm">
          {navLinks.map((link, index) => (
            <Link
              key={link.name}
              href={link.href}
              className={`px-5 py-2 rounded-full transition ${
                index === 0
                  ? "bg-black text-white font-medium"
                  : "hover:bg-gray-100"
              }`}
            >
              {link.name}
            </Link>
          ))}
        </div>

        {/* Right Side */}
        <div className="flex items-center gap-2 md:gap-4">
          {/* Book a Demo - Always Visible */}
          <Link
            href="/book-demo"
            className="flex items-center gap-1 md:gap-2 bg-black text-white px-3 py-2 md:px-5 md:py-3 rounded-full font-medium hover:opacity-90 transition text-sm md:text-base whitespace-nowrap"
          >
            <span className="hidden sm:inline">
              Book a demo
            </span>

            <span className="sm:hidden">
              Demo
            </span>

            <ArrowUpRight className="w-4 h-4" />
          </Link>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? (
              <X className="w-7 h-7" />
            ) : (
              <Menu className="w-7 h-7" />
            )}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="lg:hidden mt-4 bg-white rounded-2xl shadow-md border p-4">
          <div className="flex flex-col gap-2">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="px-4 py-3 rounded-xl hover:bg-gray-100 transition"
                onClick={() => setIsOpen(false)}
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