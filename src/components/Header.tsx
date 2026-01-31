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
          rounded-2xl
          border border-white/10
          bg-black/30
          px-5 py-3
          backdrop-blur-xl
        "
      >
        {/* BRAND */}
        <Link
          href="/"
          className="
            cursor-pointer
            text-sm font-semibold tracking-tight
            bg-linear-to-r from-indigo-300 via-indigo-400 to-violet-300
            bg-clip-text text-transparent
          "
        >
          ViralPulse
        </Link>

        {/* ACTIONS */}
        <div className="flex items-center gap-4">
          {/* NAV (desktop only) */}
          <nav className="hidden items-center gap-5 sm:flex">
            <Link
              href="/#features"
              className="text-sm text-zinc-400 hover:text-white transition"
            >
              Features
            </Link>

            <button
              onClick={() => {
                document
                  .getElementById("pricing")
                  ?.scrollIntoView({ behavior: "smooth" });
              }}
              className="text-sm font-medium text-white/90 hover:text-white transition"
            >
              Pricing
            </button>

            <Link
              href="/#analyze"
              className="text-sm text-zinc-400 hover:text-white transition"
            >
              Analyze
            </Link>
          </nav>

          {/* AUTH */}
          {!session ? (
            <button
              onClick={() => signIn()}
              className="
                inline-flex items-center justify-center
                rounded-xl
                bg-white
                px-4 py-2
                text-sm font-semibold text-black
                transition
                hover:bg-zinc-200
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
