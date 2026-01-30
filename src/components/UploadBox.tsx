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
import PlanBadge from "@/components/analysis/PlanBadge";
import UsageIndicator from "@/components/analysis/UsageIndicator";
import LimitReachedPanel, { type LimitReason } from "@/components/analysis/LimitReachedPanel";

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
  const { plan, usage, hasCard, isLoading: planLoading, refresh: refreshPlan } =
    useUserPlan();

  const [file, setFile] = useState<File | null>(null);
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [limitReason, setLimitReason] = useState<LimitReason | null>(null);
  const [showLogin, setShowLogin] = useState(false);

  const [notice, setNotice] = useState<string | null>(null);

  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<any | null>(null);

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
    setLimitReason(null);
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
        // Known guardrails (friendly inline panel instead of hard errors)
        const code = data?.code as string | undefined;

        if (analyzeRes.status === 422 && code === "AUDIO_TOO_SHORT") {
          const e: any = new Error(data?.message || "Audio too short.");
          e.noRetry = true;
          throw e;
        }

        // Audio too long (backend returns 422 with message in `error`)
        if (
          analyzeRes.status === 422 &&
          (code === undefined || code === null) &&
          String(data?.error || "").toLowerCase().includes("audio too long")
        ) {
          setLimitReason({
            kind: "audio_too_long",
            plan,
            durationSec:
              typeof data?.durationSec === "number" ? data.durationSec : undefined,
          });
          throw Object.assign(new Error(""), { silent: true });
        }

        if (analyzeRes.status === 429 && code === "DAILY_LIMIT_REACHED") {
          setLimitReason({ kind: "daily_limit_reached", plan });
          throw Object.assign(new Error(""), { silent: true });
        }

        if (analyzeRes.status === 429 && code === "MONTHLY_LIMIT_REACHED") {
          setLimitReason({
            kind: "monthly_limit_reached",
            plan,
            remainingMinutes:
              typeof data?.remainingMinutes === "number"
                ? data.remainingMinutes
                : undefined,
          });
          throw Object.assign(new Error(""), { silent: true });
        }

        throw new Error(data?.error || data?.message || "Analysis failed");
      }

      // 4️⃣ mostrar resultado
      setResult(data);
      // refresh plan + usage snapshot (minutes/daily remaining)
      refreshPlan();
    } catch (err: any) {
      if (err?.silent) return;
      setError(err?.message || "Something went wrong");
    } finally {
      setAnalyzing(false);
    }
  }

  return (
    <div className="text-white">
      <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <PlanBadge plan={plan} />
        {usage ? (
          <UsageIndicator
            usage={
              usage.plan === "free"
                ? {
                    plan: "free",
                    freeDailyUsed: usage.freeDailyUsed,
                    freeDailyRemaining: usage.freeDailyRemaining,
                  }
                : {
                    plan: usage.plan,
                    usedMinutesThisMonth: usage.usedMinutesThisMonth,
                  }
            }
          />
        ) : (
          <div className="text-xs text-white/50 sm:text-right">
            Limits update after sign in
          </div>
        )}
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
        <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-2xl bg-white/5 ring-1 ring-white/10 sm:mb-4 sm:h-11 sm:w-11">
          <span className="h-2 w-2 rounded-full bg-indigo-400" />
        </div>

        <p className="text-base font-semibold text-white/90">
          Drag & drop your audio
        </p>
        <p className="mt-1 text-sm text-zinc-400">or choose a file to upload (MP3, M4A, WAV)</p>

        <label
          htmlFor="fileInput"
          className="
            mt-4 inline-flex cursor-pointer items-center justify-center
            rounded-2xl
            border border-white/25
            bg-black/40
            px-5 py-3
            text-sm font-semibold text-white
            transition
            hover:border-indigo-400/60
            hover:shadow-[0_0_20px_rgba(99,102,241,0.35)]
            sm:mt-6 sm:px-6
          "
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
          <div className="mt-4 w-full max-w-lg rounded-2xl border border-white/10 bg-black/25 px-4 py-3 text-left text-sm text-white/80 sm:mt-5">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="truncate font-medium text-white/90">
                  {file.name}
                </div>
                <div className="mt-0.5 text-xs text-zinc-400">
                  {(file.size / (1024 * 1024)).toFixed(2)} MB
                </div>
              </div>

              <button
                onClick={() => setFile(null)}
                className="shrink-0 rounded-xl border border-white/10 px-3 py-1.5 text-xs text-white/70 transition hover:bg-white/5 hover:text-white/90"
              >
                Remove
              </button>
            </div>
          </div>
        )}

        {notice && (
          <div className="mt-4 rounded-2xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200 sm:mt-5">
            {notice}
          </div>
        )}

        {limitReason && (
          <LimitReachedPanel
            reason={limitReason}
            onDismiss={() => setLimitReason(null)}
          />
        )}

        {error && (
          <div className="mt-4 rounded-2xl border border-red-800/60 bg-red-950/40 px-4 py-3 text-sm text-red-300 sm:mt-5">
            {error}
          </div>
        )}

        <button
          onClick={handleAnalyze}
          disabled={!file || analyzing}
          className={[
            "mt-5 inline-flex w-full max-w-lg items-center justify-center rounded-2xl px-6 py-3 sm:mt-6",
            "text-sm font-semibold transition",
            !file || analyzing
              ? "bg-white/10 text-white/40"
              : "bg-white text-black hover:bg-zinc-200",
          ].join(" ")}
        >
          {analyzing ? "Analyzing…" : "Analyze"}
        </button>

        <div className="mt-3 text-center text-xs text-zinc-500">
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

  <p className="mt-1 sm:hidden">
    WAV files are much larger and won’t improve results.
  </p>
</div>


        </div>
      </div>

      {/* LOGIN MODAL */}
      {showLogin && (
        <div className="mt-6">
          <LoginCard onClose={() => setShowLogin(false)} />
        </div>
      )}

      {/* ANALYZING */}
      {analyzing && (
        <div id="analyzing" className="mt-8 sm:mt-10">
          <AnalyzingExperience />
        </div>
      )}

      {/* REPORT READY */}
      {result?.id && (
        <div className="mt-8 sm:mt-10">
          <ReportReady reportId={result.id} isPro={plan !== "free"} />
        </div>
      )}
    </div>
  );
}
