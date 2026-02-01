import "./globals.css";
import Providers from "./providers";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    default: "ViralPulse – AI Audio Virality Analysis for Creators",
    template: "%s | ViralPulse",
  },
  description:
    "ViralPulse is an AI-powered platform that analyzes audio to find viral moments, hooks and clip ideas for TikTok, Reels and YouTube Shorts.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="relative min-h-screen overflow-x-hidden bg-black text-white">
        {/* ===== BACKGROUND ===== */}
        <div className="fixed inset-0 -z-10 animated-bg" />
        <div className="fixed inset-0 -z-10 opacity-[0.04] bg-[url('/noise.png')] bg-repeat" />

        {/* ===== CLIENT PROVIDERS ===== */}
        <Providers>
          <div className="relative z-10">{children}</div>
        </Providers>
      </body>
    </html>
  );
}
