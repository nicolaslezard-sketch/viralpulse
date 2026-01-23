import "./globals.css";
import Providers from "./providers";

export const metadata = {
  title: "ViralPulse",
  description: "Analyze viral audios with AI",
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
          <div className="relative z-10">
            {children}
          </div>
        </Providers>

      </body>
    </html>
  );
}
