import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import UniqueVisitorTracker from "@/components/UniqueVisitorTracker";
import { Suspense } from "react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
  preload: true,
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
  preload: true,
});

export const metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://yourdomain.com"),

  title: {
    default: "AI Chatbot Solutions | AutoFix",
    template: "%s | AutoFix",
  },

  description:
    "Build intelligent AI chatbots for customer support, lead generation, and business automation with AutoFix AI. Secure, fast, and powered by your business data.",

  keywords: [
    "AI chatbot",
    "chatbot development",
    "customer support chatbot",
    "business automation",
    "AI assistant",
    "conversational AI",
    "RAG chatbot",
    "database chatbot",
  ],

  authors: [{ name: "AutoFix" }],
  creator: "AutoFix",
  publisher: "AutoFix",

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-snippet": -1,
      "max-image-preview": "large",
      "max-video-preview": -1,
    },
  },

  openGraph: {
    title: "AI Chatbot Solutions | AutoFix",
    description:
      "Transform customer engagement with AI-powered chatbot solutions.",
    url: "https://yourdomain.com",
    siteName: "AutoFix",
    type: "website",
    siteName: "AutoFix",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Your Brand",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "AI Chatbot Solutions | AutoFix",
    description:
      "Transform customer engagement with AI-powered chatbot solutions.",
    images: ["/og-image.jpg"],
  },

  alternates: {
    canonical: "https://yourdomain.com",
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#000000",
};

export default function RootLayout({ children }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "AutoFix",
    url: "https://yourdomain.com",
    logo: "https://yourdomain.com/logo.png",
  };

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable}`}
    >
      <body className="min-h-screen antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(jsonLd),
          }}
        />
        <UniqueVisitorTracker />
        {children}
      </body>
    </html>
  );
}