"use client";

import Link from "next/link";
import { useSession, signIn } from "next-auth/react";
import UserMenu from "@/components/UserMenu";

export default function Header() {
  const { data: session } = useSession();

  return (
    <header className="relative z-20 mx-auto max-w-6xl px-4 pt-4 sm:px-6 sm:pt-6">
      <div
        className="
          rounded-2xl border border-white/10 bg-black/30
          px-4 py-3 backdrop-blur-xl sm:px-5
        "
      >
        {/* MOBILE */}
        <div className="flex flex-col gap-3 sm:hidden">
          <div className="flex items-center justify-between gap-3">
            <Link
              href="/"
              className="
                min-w-0 bg-linear-to-r from-indigo-300 via-indigo-400 to-violet-300
                bg-clip-text text-base font-semibold tracking-tight text-transparent
              "
            >
              ViralPulse
            </Link>

            {session ? (
              <UserMenu />
            ) : (
              <button
                onClick={() => signIn()}
                className="
                  inline-flex shrink-0 items-center justify-center rounded-xl
                  bg-white px-4 py-2 text-sm font-semibold text-black
                  transition hover:bg-zinc-200
                "
              >
                Sign in
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/tools/hook-analyzer"
              className="
                inline-flex flex-1 items-center justify-center rounded-xl
                border border-indigo-400/35 bg-indigo-500/20
                px-4 py-2.5 text-sm font-semibold text-white
                transition hover:border-indigo-300/50 hover:bg-indigo-500/30
              "
            >
              Hook Analyzer
            </Link>

            <Link
              href="/#pricing"
              className="
                inline-flex items-center justify-center rounded-xl
                border border-white/10 bg-white/5
                px-4 py-2.5 text-sm font-semibold text-zinc-200
                transition hover:bg-white/10 hover:text-white
              "
            >
              Pricing
            </Link>
          </div>
        </div>

        {/* DESKTOP */}
        <div className="hidden items-center justify-between sm:flex">
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
            <nav className="flex items-center gap-5">
              <Link
                href="/tools/hook-analyzer"
                className="text-sm font-medium text-indigo-200 transition hover:text-white"
              >
                Free Hook Analyzer
              </Link>

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
                Upload
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
      </div>
    </header>
  );
}
