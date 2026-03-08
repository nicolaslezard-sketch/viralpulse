"use client";

import { useState, DragEvent } from "react";
import { uploadToR2 } from "@/lib/uploadToR2";
import { apiUrl } from "@/lib/clientBaseUrl";
import { withRetry } from "@/lib/retry";
import { useSession } from "next-auth/react";
import { useUserPlan } from "@/lib/useUserPlan";
import { limitsByPlan } from "@/lib/limits";

import LoginCard from "./LoginCard";
import AnalyzingExperience from "./AnalyzingExperience";
import ReportReady from "./ReportReady";
import PlanBadge from "@/components/analysis/PlanBadge";
import LimitReachedPanel, {
  type LimitReason,
} from "@/components/analysis/LimitReachedPanel";

type AnalyzeResult = {
  id: string;
};

const ALLOWED_TYPES = [
  "audio/mpeg",
  "audio/wav",
  "audio/mp4",
  "audio/x-m4a",
  "video/mp4",
  "video/quicktime",
  "video/x-m4v",
];

const EXT_OK = [".mp3", ".wav", ".m4a", ".mp4", ".mov", ".m4v"];

const MIN_MEDIA_SECONDS = Number(
  process.env.NEXT_PUBLIC_MIN_AUDIO_SECONDS ?? 8,
);

function getSourceType(file: File): "audio" | "video" {
  return file.type.startsWith("video/") ? "video" : "audio";
}

function bytesToMb(bytes: number) {
  return Math.round(bytes / (1024 * 1024));
}

function getPlanLabel(plan: "free" | "plus" | "pro") {
  if (plan === "free") return "Free";
  if (plan === "plus") return "Plus";
  return "Pro";
}

function getPlanLimitsCopy(plan: "free" | "plus" | "pro") {
  const limits = limitsByPlan[plan];
  return {
    maxMinutes: Math.round(limits.maxSeconds / 60),
    maxMb: bytesToMb(limits.maxBytes),
  };
}

async function getMediaDurationSeconds(file: File): Promise<number | null> {
  return new Promise((resolve) => {
    const url = URL.createObjectURL(file);
    const isVideo = file.type.startsWith("video/");
    const media = document.createElement(isVideo ? "video" : "audio");

    media.preload = "metadata";

    media.onloadedmetadata = () => {
      const duration = media.duration;
      URL.revokeObjectURL(url);
      resolve(Number.isFinite(duration) ? duration : null);
    };

    media.onerror = () => {
      URL.revokeObjectURL(url);
      resolve(null);
    };

    media.src = url;
  });
}

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

  if (sessionStatus === "loading" || planLoading) {
    return (
      <div className="rounded-2xl border border-white/10 bg-black/25 p-5 text-center text-sm text-zinc-400 sm:p-6">
        Loading…
      </div>
    );
  }

  const currentPlan = plan as "free" | "plus" | "pro";
  const limits = limitsByPlan[currentPlan];
  const limitsCopy = getPlanLimitsCopy(currentPlan);

  function resetStateForNewFile() {
    setError(null);
    setLimitReason(null);
    setResult(null);
  }

  function handleFile(f: File | null) {
    resetStateForNewFile();

    if (!f) return;

    const lastDot = f.name.lastIndexOf(".");
    const ext = lastDot >= 0 ? f.name.toLowerCase().slice(lastDot) : "";

    if (!ALLOWED_TYPES.includes(f.type) && !EXT_OK.includes(ext)) {
      setError(
        "Unsupported file format. Please upload MP3, WAV, M4A, MP4, MOV or M4V.",
      );
      return;
    }

    if (f.size > limits.maxBytes) {
      setError(
        `${getPlanLabel(currentPlan)} supports files up to ${
          limitsCopy.maxMb
        } MB. Upgrade to upload larger files.`,
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

    if (file.size > limits.maxBytes) {
      setError(
        `${getPlanLabel(currentPlan)} supports files up to ${
          limitsCopy.maxMb
        } MB. Upgrade to upload larger files.`,
      );
      return;
    }

    const dur = await getMediaDurationSeconds(file);

    if (dur !== null && dur < MIN_MEDIA_SECONDS) {
      setError(
        `Content too short (${Math.round(
          dur,
        )}s). Please upload at least ${MIN_MEDIA_SECONDS}s.`,
      );
      return;
    }

    if (dur !== null && dur > limits.maxSeconds) {
      setLimitReason({
        kind: "audio_too_long",
        plan: currentPlan,
        durationSec: Math.round(dur),
      });
      return;
    }

    setError(null);
    setLimitReason(null);
    setAnalyzing(true);
    setResult(null);

    try {
      const sourceType = getSourceType(file);

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

      await uploadToR2(uploadUrl, file);

      const analyzeRes = await withRetry(
        () =>
          fetch(apiUrl("/api/analyze"), {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              key,
              mimeType: file.type,
              sourceType,
              fileSize: file.size,
              originalName: file.name,
            }),
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
          throw new Error((data.message as string) || "Content too short.");
        }

        if (
          analyzeRes.status === 422 &&
          (code === "AUDIO_TOO_LONG" || code === "VIDEO_TOO_LONG")
        ) {
          setLimitReason({
            kind: "audio_too_long",
            plan: currentPlan,
            durationSec:
              typeof data.durationSec === "number"
                ? data.durationSec
                : undefined,
          });
          return;
        }

        if (analyzeRes.status === 429 && code === "DAILY_LIMIT_REACHED") {
          setLimitReason({ kind: "daily_limit_reached", plan: currentPlan });
          return;
        }

        if (analyzeRes.status === 429 && code === "MONTHLY_LIMIT_REACHED") {
          setLimitReason({
            kind: "monthly_limit_reached",
            plan: currentPlan,
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

      setResult({ id: data.id as string });
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message);
      else setError("Something went wrong");
    } finally {
      setAnalyzing(false);
    }
  }

  const showInteractiveUpload = !analyzing && !result;

  return (
    <div className="text-white">
      <div className="mb-3 flex items-center justify-between">
        <PlanBadge plan={currentPlan} />
      </div>

      <div className="rounded-2xl border border-white/10 bg-black/20 p-3 sm:p-4 md:p-5">
        {showInteractiveUpload && (
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setDragging(true);
            }}
            onDragLeave={() => setDragging(false)}
            onDrop={onDrop}
            className={[
              "group relative flex flex-col items-center justify-center rounded-2xl border text-center transition",
              "p-5 sm:p-6 md:p-8",
              dragging
                ? "border-white/25 bg-white/5"
                : "border-white/10 bg-black/30 hover:border-white/20",
            ].join(" ")}
          >
            <p className="text-base font-semibold text-white/95 sm:text-lg">
              Drag & drop your audio or video
            </p>

            <p className="mt-2 max-w-md text-sm text-zinc-400">
              Upload one file to generate score, transcript, rewrite and
              strategy insights.
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
              accept="audio/*,video/mp4,video/quicktime,video/x-m4v"
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
                      {file.type || "media"}
                    </p>
                  </div>

                  <button
                    onClick={() => setFile(null)}
                    className="shrink-0 text-xs text-red-400 hover:text-red-300"
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
              <div className="mt-4 w-full max-w-lg rounded-2xl border border-red-800/60 bg-red-950/40 px-4 py-3 text-sm text-red-300">
                {error}
              </div>
            )}

            <button
              onClick={handleAnalyze}
              disabled={!file || analyzing}
              className="mt-4 w-full max-w-lg rounded-2xl bg-white px-6 py-3 text-sm font-semibold text-black disabled:bg-white/10 disabled:text-white/40"
            >
              Analyze
            </button>

            <div className="mt-4 text-center text-[11px] text-zinc-500 sm:text-xs">
              <p className="leading-relaxed">
                <span className="text-zinc-400">Supported:</span> MP3, WAV, M4A,
                MP4, MOV, M4V ·{" "}
                <span className="text-zinc-400">Your plan:</span>{" "}
                <span className="font-medium text-zinc-300">
                  up to {limitsCopy.maxMinutes} min and {limitsCopy.maxMb} MB
                </span>
              </p>

              <p className="mt-1">
                <span className="text-zinc-400">Recommended:</span> MP3, M4A or
                MP4
              </p>
            </div>
          </div>
        )}

        {showLogin && !analyzing && !result && (
          <div className="mt-5">
            <LoginCard onClose={() => setShowLogin(false)} />
          </div>
        )}

        {analyzing && (
          <div className="fade-up">
            <AnalyzingExperience />
          </div>
        )}

        {result && (
          <div className="fade-up">
            <ReportReady
              reportId={result.id}
              isPaid={currentPlan !== "free"}
            />{" "}
          </div>
        )}
      </div>
    </div>
  );
}
