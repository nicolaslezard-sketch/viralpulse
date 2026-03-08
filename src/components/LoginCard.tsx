"use client";

import { signIn } from "next-auth/react";
import GoogleIcon from "@/components/icons/GoogleIcon";
import GitHubIcon from "@/components/icons/GitHubIcon";

export default function LoginCard({ onClose }: { onClose?: () => void }) {
  return (
    <div className="flex justify-center">
      <div
        className="
          relative
          w-full max-w-md
          rounded-3xl
          border border-white/10
          bg-black/50 p-6 shadow-[0_20px_70px_rgba(0,0,0,0.65)] backdrop-blur-xl
          sm:p-8
        "
      >
        {onClose && (
          <button
            onClick={onClose}
            className="
              absolute right-4 top-4 rounded-lg p-1 text-zinc-400 transition
              hover:bg-white/5 hover:text-white
              sm:right-5 sm:top-5
            "
            aria-label="Close"
          >
            ✕
          </button>
        )}

        <h2 className="text-center text-2xl font-semibold text-white">
          Start your analysis
        </h2>

        <p className="mt-2 text-center text-sm text-zinc-400">
          Upload a video or audio file and get score, transcript, rewrite and
          strategy insights.
        </p>

        <div className="mt-6 space-y-3 sm:mt-8">
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
              border border-white/10 bg-black/60 px-4 py-3 text-sm font-semibold
              text-white transition hover:bg-black/80 active:scale-[0.99]
            "
          >
            <GitHubIcon className="h-5 w-5" />
            Continue with GitHub
          </button>
        </div>

        <div className="mt-5 space-y-1 text-center text-xs text-zinc-500 sm:mt-6">
          <p>✓ Free plan includes real report previews</p>
          <p>✓ Paid plans unlock transcript, rewrite and deeper insights</p>
          <p>✓ Video and audio uploads supported</p>
          <p>✓ Your content is private and never published by us</p>
        </div>
      </div>
    </div>
  );
}
