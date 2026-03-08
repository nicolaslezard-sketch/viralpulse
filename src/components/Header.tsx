"use client";

import Link from "next/link";
import { useSession, signIn } from "next-auth/react";
import UserMenu from "@/components/UserMenu";

export default function Header() {
  const { data: session } = useSession();

  return (
    <header className="relative z-20 mx-auto max-w-6xl px-6 pt-6">
      <div
        className="
          flex items-center justify-between
          rounded-2xl border border-white/10 bg-black/30
          px-5 py-3 backdrop-blur-xl
        "
      >
        <Link
          href="/"
          className="
            bg-linear-to-r from-indigo-300 via-indigo-400 to-violet-300
            bg-clip-text text-sm font-semibold tracking-tight text-transparent
          "
        >
          ViralPulse
        </Link>

        <div className="flex items-center gap-4">
          <nav className="hidden items-center gap-5 sm:flex">
            <Link
              href="/#features"
              className="text-sm text-zinc-400 transition hover:text-white"
            >
              Features
            </Link>

            <Link
              href="/#pricing"
              className="text-sm text-zinc-400 transition hover:text-white"
            >
              Pricing
            </Link>

            <Link
              href="/#analyze"
              className="
                inline-flex items-center justify-center rounded-xl
                border border-indigo-400/30 bg-indigo-500/15
                px-3.5 py-2 text-sm font-semibold text-indigo-100
                transition hover:border-indigo-300/50 hover:bg-indigo-500/25 hover:text-white
              "
            >
              Analyze
            </Link>
          </nav>

          {!session ? (
            <button
              onClick={() => signIn()}
              className="
                inline-flex items-center justify-center rounded-xl
                bg-white px-4 py-2 text-sm font-semibold text-black
                transition hover:bg-zinc-200
              "
            >
              Sign in
            </button>
          ) : (
            <UserMenu />
          )}
        </div>
      </div>
    </header>
  );
}
