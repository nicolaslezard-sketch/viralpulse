"use client";

import { useState, DragEvent } from "react";
import { uploadToR2 } from "@/lib/uploadToR2";
import { useSession } from "next-auth/react";
import LoginCard from "./LoginCard";
import AnalyzingExperience from "./AnalyzingExperience";
import ResultsView from "./ResultsView";

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

export default function UploadBox() {
  const { data: session } = useSession();

  const [file, setFile] = useState<File | null>(null);
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showLogin, setShowLogin] = useState(false);

  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<any | null>(null);

  function handleFile(f: File | null) {
    setError(null);
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

    if (!session) {
      setShowLogin(true);
      return;
    }

    setError(null);
    setAnalyzing(true);
    setResult(null);

    try {
      // 1️⃣ pedir URL de upload
      const uploadRes = await fetch("/api/upload-url", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          filename: file.name,
          contentType: file.type,
          fileSize: file.size,
        }),
      });

      if (!uploadRes.ok) {
        const d = await uploadRes.json().catch(() => ({}));
        throw new Error(d?.error || "Upload failed");
      }

      const { uploadUrl, key } = await uploadRes.json();

      // 2️⃣ subir a R2
      await uploadToR2(uploadUrl, file);

      // 3️⃣ ANALYZE (todo en un solo endpoint)
      const analyzeRes = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key }),
      });

      const data = await analyzeRes.json();

      if (!analyzeRes.ok) {
        throw new Error(data?.error || "Analysis failed");
      }

      // 4️⃣ mostrar resultado en el mismo home
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
        <p className="mt-1 text-sm text-zinc-400">
          or choose a file to upload
        </p>

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

      {showLogin && !session && (
        <div className="mt-6">
          <LoginCard />
        </div>
      )}

      {error && (
        <div className="mt-5 rounded-2xl border border-red-800/60 bg-red-950/40 px-4 py-3 text-sm text-red-300">
          {error}
        </div>
      )}

      <button
        onClick={handleAnalyze}
        disabled={!file || analyzing}
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
        <div className="mt-10">
          <AnalyzingExperience />
        </div>
      )}
    </div>
  );
}
