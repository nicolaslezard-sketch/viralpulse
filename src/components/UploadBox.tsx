"use client";

import { useEffect, useState, DragEvent } from "react";
import { uploadToR2 } from "@/lib/uploadToR2";
import { apiUrl } from "@/lib/clientBaseUrl";
import { withRetry } from "@/lib/retry";
import { getAudioDurationSeconds } from "@/lib/audioDuration";
import { useSession } from "next-auth/react";
import { useUserPlan } from "@/lib/useUserPlan";
import LoginCard from "./LoginCard";
import AnalyzingExperience from "./AnalyzingExperience";
import ReportReady from "./ReportReady";

// ⬅️ alineado con backend
const ALLOWED_TYPES = [
  "audio/mpeg",
  "audio/wav",
  "audio/mp4",
  "audio/x-m4a",
  "audio/ogg",
  "audio/webm",
];

const EXT_OK = [".mp3", ".wav", ".m4a", ".ogg", ".webm"];

const MIN_AUDIO_SECONDS = Number(process.env.NEXT_PUBLIC_MIN_AUDIO_SECONDS ?? 8);

export default function UploadBox() {
  const { data: session } = useSession();
  const { hasCard, isLoading: planLoading } = useUserPlan();

  const [file, setFile] = useState<File | null>(null);
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showLogin, setShowLogin] = useState(false);

  const [notice, setNotice] = useState<string | null>(null);

  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<any | null>(null);

  // Post-card UX: show a gentle “you’re all set” notice when returning from /add-card.
  useEffect(() => {
    if (typeof window === "undefined") return;
    const postCard = sessionStorage.getItem("vp_post_card");
    if (!postCard) return;

    sessionStorage.removeItem("vp_post_card");
    setNotice("Card saved — you're ready to analyze.");
  }, []);

  // Best-effort auto-retry: if the browser preserved the selected file (bfcache) and the user now has a card,
  // automatically start the analysis once.
  useEffect(() => {
    if (!notice) return;
    if (!session) return;
    if (!hasCard) return;
    if (!file) return;
    if (analyzing) return;

    // Only auto-run once per return.
    if (typeof window !== "undefined") {
      const ran = sessionStorage.getItem("vp_post_card_ran");
      if (ran) return;
      sessionStorage.setItem("vp_post_card_ran", "1");
    }

    void handleAnalyze();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [notice, session, hasCard, file]);

  // Esperar a que el plan esté cargado
  if (planLoading) {
    return (
      <div className="rounded-2xl border border-white/10 bg-black/25 p-6 text-center text-sm text-zinc-400">
        Loading…
      </div>
    );
  }

  function handleFile(f: File | null) {
    setError(null);
    setNotice(null);
    try {
      sessionStorage.removeItem("vp_post_card_ran");
    } catch {}
    if (!f) return;

    const ext = f.name.toLowerCase().slice(f.name.lastIndexOf("."));

    if (!ALLOWED_TYPES.includes(f.type) && !EXT_OK.includes(ext)) {
      setError(
        "Unsupported file format. Please upload MP3, WAV, M4A, OGG or WEBM."
      );
      return;
    }

    setFile(f);
  }

  function onDrop(e: DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setDragging(false);
    handleFile(e.dataTransfer.files?.[0] ?? null);
  }

  async function handleAnalyze() {
    if (!file || analyzing) return;

    // 🔐 LOGIN OBLIGATORIO
    if (!session) {
      setShowLogin(true);
      return;
    }

    // 💳 TARJETA OBLIGATORIA
    if (!hasCard) {
      setError(
        "A card is required for Plus or Pro analysis. You won’t be charged unless you upgrade."
      );
      return;
    }

    // Client-side guardrail for very short audios (best-effort)
    const dur = await getAudioDurationSeconds(file);
    if (dur !== null && dur < MIN_AUDIO_SECONDS) {
      setError(
        `Audio too short (${Math.round(dur)}s). Please upload at least ${MIN_AUDIO_SECONDS}s.`
      );
      return;
    }

    setError(null);
    setAnalyzing(true);
    setResult(null);

    setTimeout(() => {
      document.getElementById("analyzing")?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 100);

    try {
      // 1️⃣ pedir URL de upload
      const uploadRes = await withRetry(
        () =>
          fetch(apiUrl("/api/upload-url"), {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              filename: file.name,
              contentType: file.type,
              fileSize: file.size,
            }),
          }),
        {
          retries: 2,
          baseDelayMs: 600,
        }
      );

      if (!uploadRes.ok) {
        const d = await uploadRes.json().catch(() => ({}));
        throw new Error(d?.error || "Upload failed");
      }

      const { uploadUrl, key } = await uploadRes.json();

      // 2️⃣ subir a R2
      await uploadToR2(uploadUrl, file);

      // 3️⃣ ANALYZE
      const analyzeRes = await withRetry(
        () =>
          fetch(apiUrl("/api/analyze"), {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ key }),
          }),
        {
          retries: 2,
          baseDelayMs: 800,
          shouldRetry: (err) => !(err as any)?.noRetry,
        }
      );

      const data = await analyzeRes.json().catch(() => ({}));

      if (!analyzeRes.ok) {
        if (analyzeRes.status === 422 && data?.code === "AUDIO_TOO_SHORT") {
          const e: any = new Error(data?.message || "Audio too short.");
          e.noRetry = true;
          throw e;
        }
        throw new Error(data?.error || data?.message || "Analysis failed");
      }

      // 4️⃣ mostrar resultado
      setResult(data);
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setAnalyzing(false);
    }
  }

  return (
    <div className="text-white">
      {/* DROP ZONE */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        className={[
          "group relative flex flex-col items-center justify-center",
          "rounded-2xl border p-10 md:p-12 text-center transition",
          "bg-black/25 backdrop-blur",
          dragging
            ? "border-white/25 bg-white/5"
            : "border-white/10 hover:border-white/20",
        ].join(" ")}
      >
        <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-white/5 ring-1 ring-white/10">
          <span className="h-2 w-2 rounded-full bg-indigo-400" />
        </div>

        <p className="text-base font-semibold text-white/90">
          Drag & drop your audio
        </p>
        <p className="mt-1 text-sm text-zinc-400">or choose a file to upload</p>

        <label
          htmlFor="fileInput"
          className="
            mt-6 inline-flex cursor-pointer items-center justify-center
            rounded-2xl border border-white/10 bg-black/30
            px-5 py-2.5 text-sm font-semibold text-white
            transition hover:border-white/20 hover:bg-black/40
          "
        >
          Choose file
        </label>

        <input
          id="fileInput"
          type="file"
          accept="audio/*"
          onChange={(e) => handleFile(e.target.files?.[0] ?? null)}
          className="hidden"
        />

        <p className="mt-4 text-xs text-zinc-500">
          Supports: MP3, WAV, M4A, OGG, WEBM
        </p>
      </div>

      {file && (
        <div className="mt-4 rounded-2xl border border-white/10 bg-black/25 px-4 py-3 text-sm">
          <div className="text-zinc-400">Selected file</div>
          <div className="mt-0.5 break-all font-semibold text-white/90">
            {file.name}
          </div>
        </div>
      )}

      {/* LOGIN */}
      {showLogin && !session && (
        <div className="mt-6">
          <LoginCard />
        </div>
      )}

      {/* ADD CARD CTA */}
      {session && !hasCard && (
        <div className="mt-6 text-center">
          <a
            href="/add-card"
            onClick={() => {
              try {
                // Remember where to send the user back after saving a card.
                sessionStorage.setItem(
                  "vp_return_to",
                  window.location.pathname + window.location.search
                );
                // Allow best-effort auto-retry again after the user returns.
                sessionStorage.removeItem("vp_post_card_ran");
              } catch {}
            }}
            className="
              inline-flex cursor-pointer items-center justify-center
              rounded-2xl
              bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-500
              px-6 py-3
              text-sm font-semibold text-white
              shadow-lg shadow-indigo-500/30
              transition hover:brightness-110
            "
          >
            Add card to continue
          </a>

          <p className="mt-2 text-xs text-zinc-500">
            We won’t charge you unless you upgrade to Pro.
          </p>

          <p className="mt-1 text-[11px] text-zinc-500">
            Used for verification and future upgrades only.
          </p>
        </div>
      )}

      {notice && (
        <div className="mt-5 rounded-2xl border border-emerald-400/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-100">
          {notice}
        </div>
      )}

      {error && (
        <div className="mt-5 rounded-2xl border border-red-800/60 bg-red-950/40 px-4 py-3 text-sm text-red-300">
          {error}
        </div>
      )}

      <button
        onClick={handleAnalyze}
        disabled={!file || analyzing || !session || !hasCard}
        className={[
          "mt-6 w-full rounded-2xl px-6 py-4 text-sm font-semibold transition",
          "shadow-[0_18px_50px_rgba(0,0,0,0.35)]",
          analyzing
            ? "bg-indigo-500/70 text-white cursor-wait"
            : "bg-white text-black hover:bg-zinc-200",
        ].join(" ")}
      >
        {analyzing ? "Analyzing your content…" : "Analyze now"}
      </button>

      {analyzing && (
        <div id="analyzing" className="mt-10">
          <AnalyzingExperience />
        </div>
      )}

      {result && !analyzing && (
        <ReportReady reportId={result.id} isPro={result.isPro} />
      )}
    </div>
  );
}
