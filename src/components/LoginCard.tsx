"use client";

import { signIn } from "next-auth/react";
import GoogleIcon from "@/components/icons/GoogleIcon";
import GitHubIcon from "@/components/icons/GitHubIcon";

export default function LoginCard() {
  return (
    <div className="flex justify-center">
      <div
        className="
          w-full max-w-md
          rounded-3xl
          border border-white/10
          bg-black/50 backdrop-blur-xl
          p-8
          shadow-[0_20px_70px_rgba(0,0,0,0.65)]
        "
      >
        {/* Header */}
        <h2 className="text-2xl font-semibold text-white text-center">
          Analyze your audio
        </h2>

        <p className="mt-2 text-center text-sm text-zinc-400">
          Get viral hooks, titles, key moments and clip ideas in seconds.
        </p>

        {/* Auth buttons */}
        <div className="mt-8 space-y-3">
          <button
  onClick={() => signIn("google")}
  className="
    flex w-full items-center justify-center gap-3
    rounded-2xl
    bg-white
    px-4 py-3
    text-sm font-semibold text-black
    cursor-pointer
    transition
    hover:bg-zinc-200
    active:scale-[0.99]
  "
>
  <GoogleIcon className="h-5 w-5" />
  Continue with Google
</button>

          <button
  onClick={() => signIn("github")}
  className="
    flex w-full items-center justify-center gap-3
    rounded-2xl
    border border-white/10
    bg-black/60
    px-4 py-3
    text-sm font-semibold text-white
    cursor-pointer
    transition
    hover:bg-black/80
    active:scale-[0.99]
  "
>
  <GitHubIcon className="h-5 w-5" />
  Continue with GitHub
</button>

        </div>

        {/* Trust copy */}
        <div className="mt-6 space-y-1 text-center text-xs text-zinc-500">
          <p>✓ Card required only to prevent abuse</p>
          <p>✓ You’ll never be charged unless you upgrade</p>
          <p>✓ Free analysis up to 3 minutes</p>
          <p>✓ We never post or share your content</p>
        </div>
      </div>
    </div>
  );
}
