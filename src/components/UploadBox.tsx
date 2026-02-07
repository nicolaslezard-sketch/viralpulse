"use client";

import { useState, DragEvent } from "react";
import { uploadToR2 } from "@/lib/uploadToR2";
import { apiUrl } from "@/lib/clientBaseUrl";
import { withRetry } from "@/lib/retry";
import { getAudioDurationSeconds } from "@/lib/audioDuration";
import { useSession } from "next-auth/react";
import { useUserPlan } from "@/lib/useUserPlan";

import LoginCard from "./LoginCard";
import AnalyzingExperience from "./AnalyzingExperience";
import ReportReady from "./ReportReady";
import PlanBadge from "@/components/analysis/PlanBadge";
import LimitReachedPanel, {
  type LimitReason,
} from "@/components/analysis/LimitReachedPanel";

/* =========================
   Types
========================= */

type AnalyzeResult = {
  id: string;
};

/* =========================
   Constants
========================= */

const ALLOWED_TYPES = [
  "audio/mpeg",
  "audio/wav",
  "audio/mp4",
  "audio/x-m4a",
  "audio/ogg",
  "audio/webm",
];

const EXT_OK = [".mp3", ".wav", ".m4a", ".ogg", ".webm"];

const MIN_AUDIO_SECONDS = Number(
  process.env.NEXT_PUBLIC_MIN_AUDIO_SECONDS ?? 8,
);

/* =========================
   Component
========================= */

export default function UploadBox() {
  const { data: session, status: sessionStatus } = useSession();
  const { plan, isLoading: planLoading } = useUserPlan();

  const [file, setFile] = useState<File | null>(null);
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [limitReason, setLimitReason] = useState<LimitReason | null>(null);
  const [showLogin, setShowLogin] = useState(false);

  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalyzeResult | null>(null);

  /* =========================
     Guards
  ========================= */

  if (sessionStatus === "loading" || planLoading) {
    return (
      <div className="rounded-2xl border border-white/10 bg-black/25 p-6 text-center text-sm text-zinc-400">
        Loading…
      </div>
    );
  }

  /* =========================
     Handlers
  ========================= */

  function handleFile(f: File | null) {
    setError(null);
    setLimitReason(null);
    if (!f) return;

    const ext = f.name.toLowerCase().slice(f.name.lastIndexOf("."));

    if (!ALLOWED_TYPES.includes(f.type) && !EXT_OK.includes(ext)) {
      setError(
        "Unsupported file format. Please upload MP3, WAV, M4A, OGG or WEBM.",
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

    if (!session) {
      setShowLogin(true);
      return;
    }

    const dur = await getAudioDurationSeconds(file);
    if (dur !== null && dur < MIN_AUDIO_SECONDS) {
      setError(
        `Audio too short (${Math.round(
          dur,
        )}s). Please upload at least ${MIN_AUDIO_SECONDS}s.`,
      );
      return;
    }

    setError(null);
    setLimitReason(null);
    setAnalyzing(true);
    setResult(null);

    setTimeout(() => {
      document.getElementById("analyzing")?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 100);

    try {
      /* 1️⃣ Upload URL */
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
        { retries: 2, baseDelayMs: 600 },
      );

      if (!uploadRes.ok) {
        const d = (await uploadRes.json().catch(() => ({}))) as {
          error?: string;
        };
        throw new Error(d.error || "Upload failed");
      }

      const { uploadUrl, key } = (await uploadRes.json()) as {
        uploadUrl: string;
        key: string;
      };

      /* 2️⃣ Upload to R2 */
      await uploadToR2(uploadUrl, file);

      /* 3️⃣ Analyze */
      const analyzeRes = await withRetry(
        () =>
          fetch(apiUrl("/api/analyze"), {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ key }),
          }),
        { retries: 2, baseDelayMs: 800 },
      );

      const data = (await analyzeRes.json().catch(() => ({}))) as Record<
        string,
        unknown
      >;

      if (!analyzeRes.ok) {
        const code = data.code as string | undefined;

        if (analyzeRes.status === 422 && code === "AUDIO_TOO_SHORT") {
          throw new Error((data.message as string) || "Audio too short.");
        }

        if (analyzeRes.status === 422 && code === "AUDIO_TOO_LONG") {
          setLimitReason({
            kind: "audio_too_long",
            plan,
            durationSec:
              typeof data.durationSec === "number"
                ? data.durationSec
                : undefined,
          });
          return;
        }

        if (analyzeRes.status === 429 && code === "DAILY_LIMIT_REACHED") {
          setLimitReason({ kind: "daily_limit_reached", plan });
          return;
        }

        if (analyzeRes.status === 429 && code === "MONTHLY_LIMIT_REACHED") {
          setLimitReason({
            kind: "monthly_limit_reached",
            plan,
            remainingMinutes:
              typeof data.remainingMinutes === "number"
                ? data.remainingMinutes
                : undefined,
          });
          return;
        }

        throw new Error(
          (data.error as string) ||
            (data.message as string) ||
            "Analysis failed",
        );
      }

      /* 4️⃣ Success */
      setResult({ id: data.id as string });
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Something went wrong");
      }
    } finally {
      setAnalyzing(false);
    }
  }

  /* =========================
     Render
  ========================= */

  return (
    <div className="text-white">
      <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <PlanBadge plan={plan} />
      </div>

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
          "rounded-2xl border p-6 sm:p-8 md:p-10 text-center transition",
          "bg-black/25 backdrop-blur",
          dragging
            ? "border-white/25 bg-white/5"
            : "border-white/10 hover:border-white/20",
        ].join(" ")}
      >
        <p className="text-base font-semibold text-white/90">
          Drag & drop your audio
        </p>

        <label
          htmlFor="fileInput"
          className="mt-4 inline-flex cursor-pointer rounded-2xl border border-white/25 bg-black/40 px-5 py-3 text-sm font-semibold transition hover:border-indigo-400/60"
        >
          Choose file
        </label>

        <input
          id="fileInput"
          type="file"
          accept={ALLOWED_TYPES.join(",")}
          className="hidden"
          onChange={(e) => handleFile(e.target.files?.[0] ?? null)}
        />
        {file && (
          <div className="mt-4 w-full max-w-lg rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-left text-sm">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="truncate font-medium text-white/90">
                  {file.name}
                </p>
                <p className="mt-0.5 text-xs text-zinc-400">
                  {(file.size / (1024 * 1024)).toFixed(2)} MB ·{" "}
                  {file.type || "audio"}
                </p>
              </div>

              <button
                onClick={() => setFile(null)}
                className="text-xs text-red-400 hover:text-red-300"
              >
                Remove
              </button>
            </div>
          </div>
        )}

        {limitReason && (
          <LimitReachedPanel
            reason={limitReason}
            onDismiss={() => setLimitReason(null)}
          />
        )}

        {error && (
          <div className="mt-4 rounded-2xl border border-red-800/60 bg-red-950/40 px-4 py-3 text-sm text-red-300">
            {error}
          </div>
        )}

        <button
          onClick={handleAnalyze}
          disabled={!file || analyzing}
          className="mt-5 w-full max-w-lg rounded-2xl bg-white px-6 py-3 text-sm font-semibold text-black disabled:bg-white/10 disabled:text-white/40"
        >
          {analyzing ? "Analyzing…" : "Analyze"}
        </button>
        <div className="mt-4 text-center text-xs text-zinc-500">
          <p className="leading-relaxed">
            <span className="text-zinc-400">Recommended:</span> MP3 or M4A ·{" "}
            <span className="hidden sm:inline">
              WAV files are much larger and won’t improve results ·{" "}
            </span>
            <span className="text-zinc-400">
              Free: <span className="font-medium text-zinc-300">10 MB</span>
            </span>{" "}
            ·{" "}
            <span className="font-semibold text-white">
              Plus / Pro: <span className="text-indigo-300">25 MB</span>
            </span>
          </p>

          {/* Mobile-only WAV disclaimer */}
          <p className="mt-1 sm:hidden">
            WAV files are much larger and won’t improve results.
          </p>
        </div>
      </div>

      {/* LOGIN */}
      {showLogin && (
        <div className="mt-6">
          <LoginCard onClose={() => setShowLogin(false)} />
        </div>
      )}

      {/* ANALYZING */}
      {analyzing && (
        <div id="analyzing" className="mt-8">
          <AnalyzingExperience />
        </div>
      )}

      {/* REPORT READY */}
      {result && (
        <div className="mt-8">
          <ReportReady reportId={result.id} isPro={plan !== "free"} />
        </div>
      )}
    </div>
  );
}
