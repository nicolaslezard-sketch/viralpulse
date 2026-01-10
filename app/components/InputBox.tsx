"use client";

import { useMemo, useState } from "react";
import LoadingSpinner from "./LoadingSpinner";
import ResultBlock from "./ResultBlock";

export default function InputBox() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<string>("");
  const [error, setError] = useState<string>("");

  const canAnalyze = useMemo(() => url.trim().length > 0 && !loading, [url, loading]);

  async function handleAnalyze() {
    setError("");
    setAnalysis("");

    const trimmed = url.trim();
    if (!trimmed) return;

    setLoading(true);
    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: trimmed }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data?.error || "Something went wrong.");
        return;
      }

      setAnalysis(data.analysis || "");
    } catch (e: any) {
      setError("Network error. Try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section
      style={{
        background: "rgba(255,255,255,0.04)",
        border: "1px solid rgba(255,255,255,0.10)",
        borderRadius: 16,
        padding: 16,
      }}
    >
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
        <input
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Paste a YouTube link (e.g. https://www.youtube.com/watch?v=...)"
          style={{
            flex: "1 1 520px",
            minWidth: 240,
            padding: "12px 12px",
            borderRadius: 12,
            border: "1px solid rgba(255,255,255,0.16)",
            background: "rgba(0,0,0,0.25)",
            color: "#fff",
            outline: "none",
          }}
        />

        <button
          onClick={handleAnalyze}
          disabled={!canAnalyze}
          style={{
            padding: "12px 14px",
            borderRadius: 12,
            border: "1px solid rgba(255,255,255,0.16)",
            background: canAnalyze ? "#ffffff" : "rgba(255,255,255,0.35)",
            color: "#0b0b0f",
            cursor: canAnalyze ? "pointer" : "not-allowed",
            fontWeight: 700,
          }}
        >
          Analyze
        </button>
      </div>

      <div style={{ marginTop: 12 }}>
        {loading && (
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <LoadingSpinner />
            <span style={{ color: "rgba(255,255,255,0.75)" }}>
              Analyzing… (YouTube transcript → AI report)
            </span>
          </div>
        )}

        {error && (
          <div
            style={{
              marginTop: 12,
              padding: 12,
              borderRadius: 12,
              border: "1px solid rgba(255,80,80,0.35)",
              background: "rgba(255,80,80,0.10)",
              color: "rgba(255,220,220,0.95)",
            }}
          >
            {error}
          </div>
        )}

        {analysis && (
          <div style={{ marginTop: 14 }}>
            <ResultBlock analysis={analysis} />
          </div>
        )}
      </div>
    </section>
  );
}
