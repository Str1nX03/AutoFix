import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata = {
  metadataBase: new URL("https://yourdomain.com"),

  title: {
    default: "AI Chatbot Solutions | AutoFix",
    template: "%s | AutoFix",
  },

  description:
    "Build intelligent AI chatbots for customer support, lead generation, and business automation.",

  keywords: [
    "AI chatbot",
    "chatbot development",
    "customer support chatbot",
    "business automation",
    "AI assistant",
    "conversational AI",
  ],

  authors: [{ name: "AutoFix" }],
  creator: "AutoFix",
  publisher: "AutoFix",

  robots: {
    index: true,
    follow: true,
  },

  openGraph: {
    title: "AI Chatbot Solutions | AutoFix",
    description:
      "Transform customer engagement with AI-powered chatbot solutions.",
    url: "https://yourdomain.com",
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
        {children}
      </body>
    </html>
  );
}