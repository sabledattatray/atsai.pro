import type { Metadata } from "next";
import { Inter, Outfit, JetBrains_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Resume Copilot AI — ATS Resume Checker & Optimizer",
    template: "%s | Resume Copilot AI",
  },
  description:
    "The world's fastest AI-powered ATS resume optimization platform. Get your resume scored, optimized, and matched to any job description in seconds.",
  keywords: [
    "ATS resume checker",
    "resume optimizer",
    "AI resume builder",
    "cover letter generator",
    "resume score",
    "job application",
  ],
  authors: [{ name: "Datta Sable", url: "https://dattasable.com" }],
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "https://www.atsai.pro"),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: process.env.NEXT_PUBLIC_APP_URL || "https://www.atsai.pro",
    siteName: "Resume Copilot AI",
    title: "Resume Copilot AI — ATS Resume Checker & Optimizer",
    description:
      "The world's fastest AI-powered ATS resume optimization platform. Score, optimize, and match your resume to any job in seconds.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Resume Copilot AI",
    description: "AI-powered ATS resume optimization platform.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${outfit.variable} ${jetbrainsMono.variable}`}
    >
      <body className="antialiased">
        <Script
          id="razorpay-checkout"
          src="https://checkout.razorpay.com/v1/checkout.js"
          strategy="lazyOnload"
        />
        {children}
      </body>
    </html>
  );
}
