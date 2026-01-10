import "./globals.css";

export const metadata = {
  title: "ViralPulse",
  description: "Analyze viral videos with AI",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          fontFamily:
            'ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial',
          background: "#0b0b0f",
          color: "#ffffff",
        }}
      >
        {children}
      </body>
    </html>
  );
}
