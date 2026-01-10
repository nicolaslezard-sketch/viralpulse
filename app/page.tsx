import InputBox from "./components/InputBox";

export default function HomePage() {
  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        padding: "48px 16px",
      }}
    >
      <div style={{ width: "100%", maxWidth: 920 }}>
        <header style={{ marginBottom: 24 }}>
          <h1 style={{ margin: 0, fontSize: 42, letterSpacing: -0.5 }}>
            ViralPulse
          </h1>
          <p style={{ marginTop: 10, color: "rgba(255,255,255,0.75)" }}>
            Paste a YouTube link and get a structured viral breakdown in seconds.
          </p>

          <p style={{ marginTop: 6, fontSize: 13, color: "rgba(255,255,255,0.5)" }}>
  Works best with videos that include spoken dialogue or captions.
</p>

        </header>

        <InputBox />

        <footer
          style={{
            marginTop: 28,
            color: "rgba(255,255,255,0.45)",
            fontSize: 12,
          }}
        >
          MVP v0 — YouTube only. No login. No database.
        </footer>
      </div>
    </main>
  );
}
