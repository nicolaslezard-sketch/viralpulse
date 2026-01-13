"use client";

import { useState, DragEvent } from "react";
import { useRouter } from "next/navigation";
import LoadingSteps from "./LoadingSteps";

const ALLOWED_TYPES = [
  "audio/mpeg",
  "audio/wav",
  "audio/mp4",
  "video/mp4",
  "video/quicktime",
];

export default function UploadBox() {
  const router = useRouter();

  const [file, setFile] = useState<File | null>(null);
  const [dragging, setDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [step, setStep] = useState(0);

  function handleFile(f: File) {
    setError(null);

    if (!ALLOWED_TYPES.includes(f.type)) {
      setError("Unsupported file format. Please upload audio or video files.");
      return;
    }

    setFile(f);
  }

  function onDrop(e: DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setDragging(false);

    const dropped = e.dataTransfer.files?.[0];
    if (dropped) handleFile(dropped);
  }

  

    function simulateProgress() {
  setStep(0);
  setTimeout(() => setStep(1), 800);   // Uploading
  setTimeout(() => setStep(2), 1800);  // Transcribing
  setTimeout(() => setStep(3), 3200);  // Analyzing
  
}
async function redirectToStripe() {
    const setup = await fetch("/api/stripe/setup-checkout", {
      method: "POST",
    });

    const data = await setup.json();
    if (data?.url) {
      window.location.href = data.url;
    } else {
      setError("Unable to start upgrade process. Try again.");
    }
  }

  async function handleAnalyze() {
    if (!file) return;

    setLoading(true);
    setError(null);
    simulateProgress();


    try {
      const form = new FormData();
      form.append("file", file);

      const res = await fetch("/api/analyze-upload", {
        method: "POST",
        body: form,
      });

      if (!res.ok) {
        const data = await res.json();

        switch (data?.error) {
          case "CARD_REQUIRED":
            await redirectToStripe();
            return;

          case "FREE_LIMIT_REACHED":
            setError(
              "You’ve reached the free daily limit. Upgrade to Pro to continue."
            );
            return;

          case "DURATION_LIMIT_EXCEEDED":
            setError(
              `This file is too long. Max allowed: ${
                data.maxAllowed / 60
              } minutes.`
            );
            return;

          default:
            setError("Analysis failed. Please try again.");
            return;
        }
      }

      const result = await res.json();

      const reportId = crypto.randomUUID();
      sessionStorage.setItem(
        `report:${reportId}`,
        JSON.stringify(result)
      );

      router.push(`/report/${reportId}`);
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rounded-2xl border border-zinc-800 p-6 bg-zinc-950 text-white shadow-lg">
      {/* DROP ZONE */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        className={`flex flex-col items-center justify-center rounded-xl border-2 border-dashed p-10 text-center transition
          ${
            dragging
              ? "border-white bg-zinc-900"
              : "border-zinc-700"
          }`}
      >
        <p className="font-medium">
          Drag & drop your file here
        </p>
        <p className="mt-1 text-sm text-zinc-400">
          or click to upload
        </p>

        <input
          type="file"
          accept="audio/*,video/*"
          onChange={(e) =>
            e.target.files && handleFile(e.target.files[0])
          }
          className="hidden"
          id="fileInput"
        />

        <label
          htmlFor="fileInput"
          className="mt-4 cursor-pointer rounded-lg border border-zinc-700 px-4 py-2 text-sm hover:bg-zinc-800"
        >
          Choose file
        </label>
      </div>

      {/* FILE INFO */}
      {file && (
        <div className="mt-4 text-sm text-zinc-400">
          Selected file:{" "}
          <span className="font-medium text-white">
            {file.name}
          </span>
        </div>
      )}

      {/* LIMITS */}
      <div className="mt-4 text-sm text-zinc-500">
        Supported formats: mp3, mp4, wav, mov
        <br />
        Free: up to <b>3 minutes</b> • Pro: up to{" "}
        <b>20 minutes</b>
      </div>

      {/* ERROR */}
      {error && (
        <div className="mt-4 rounded-lg border border-red-800 bg-red-950 px-4 py-3 text-sm text-red-400">
          {error}
          {error.includes("Upgrade") && (
            <button
              onClick={redirectToStripe}
              className="mt-3 block w-full rounded-lg bg-white px-4 py-2 text-black font-medium hover:bg-zinc-200"
            >
              Upgrade to Pro
            </button>
          )}
        </div>
      )}

      {/* CTA */}
      <button
        onClick={handleAnalyze}
        disabled={!file || loading}
        className="mt-6 w-full rounded-xl bg-white px-6 py-4 text-black font-medium hover:bg-zinc-200 transition disabled:opacity-50"
      >
        {loading ? "Analyzing…" : "Analyze now"}
      </button>
      {loading && <LoadingSteps step={step} />}
    </div>
  );
}
