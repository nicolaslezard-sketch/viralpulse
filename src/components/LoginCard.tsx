"use client";

import { signIn } from "next-auth/react";
import GoogleIcon from "@/components/icons/GoogleIcon";
import GitHubIcon from "@/components/icons/GitHubIcon";

export default function LoginCard({ onClose }: { onClose?: () => void }) {
  return (
    <div className="flex justify-center">
      <div
        className="
          relative w-full max-w-lg rounded-3xl border border-white/10
          bg-black/55 p-6 shadow-[0_20px_70px_rgba(0,0,0,0.65)]
          backdrop-blur-xl sm:p-8
        "
      >
        {onClose && (
          <button
            onClick={onClose}
            className="
              absolute right-4 top-4 rounded-lg p-1 text-zinc-400 transition
              hover:bg-white/5 hover:text-white sm:right-5 sm:top-5
            "
            aria-label="Close"
          >
            ✕
          </button>
        )}

        <div className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-2xl border border-indigo-400/20 bg-indigo-500/15 text-xl">
          ⚡
        </div>

        <h2 className="text-center text-2xl font-bold tracking-tight text-white">
          Sign in to analyze your content
        </h2>

        <p className="mx-auto mt-3 max-w-sm text-center text-sm leading-relaxed text-zinc-400">
          Create a free account to upload audio/video, save your reports and get
          your first full analysis unlocked.
        </p>

        <div className="mt-6 rounded-2xl border border-indigo-400/20 bg-indigo-500/10 p-4">
          <p className="text-sm font-semibold text-indigo-100">
            Free account includes:
          </p>

          <ul className="mt-3 space-y-2 text-sm text-zinc-300">
            <li>✓ Free script hook analyzer</li>
            <li>✓ Audio/video upload</li>
            <li>✓ Viral score and report preview</li>
            <li>✓ First full report unlocked</li>
            <li>✓ No credit card required</li>
          </ul>
        </div>

        <div className="mt-6 space-y-3 sm:mt-7">
          <button
            onClick={() => signIn("google")}
            className="
              flex w-full items-center justify-center gap-3 rounded-2xl bg-white
              px-4 py-3 text-sm font-semibold text-black transition
              hover:bg-zinc-200 active:scale-[0.99]
            "
          >
            <GoogleIcon className="h-5 w-5" />
            Continue with Google
          </button>

          <button
            onClick={() => signIn("github")}
            className="
              flex w-full items-center justify-center gap-3 rounded-2xl
              border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold
              text-white transition hover:bg-white/10 active:scale-[0.99]
            "
          >
            <GitHubIcon className="h-5 w-5" />
            Continue with GitHub
          </button>
        </div>

        <p className="mt-5 text-center text-xs leading-relaxed text-zinc-500">
          Your content stays private. Upgrade only when you need full reports,
          longer uploads, transcripts and history.
        </p>
      </div>
    </div>
  );
}
