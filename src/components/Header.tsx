"use client";

import Link from "next/link";
import { useSession, signIn } from "next-auth/react";

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
          px-4 py-3
          backdrop-blur-xl
        "
      >
        {/* BRAND */}
        <Link
          href="/"
          className="
            cursor-pointer
            flex items-center gap-2
          "
        >
          {/* Optional logo placeholder */}
          <div className="h-8 w-8 rounded-xl bg-white/10 ring-1 ring-white/10" />

          <span
            className="
              text-sm font-semibold tracking-tight
              bg-gradient-to-r from-indigo-300 via-indigo-400 to-violet-300
              bg-clip-text text-transparent
            "
          >
            ViralPulse
          </span>
        </Link>

        {/* ACTIONS */}
        <div className="flex items-center gap-3">
          {!session ? (
            <button
              onClick={() => signIn()}
              className="
                cursor-pointer
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
            <img
              src={session.user?.image || ""}
              alt="User avatar"
              referrerPolicy="no-referrer"
              className="
                h-9 w-9
                cursor-pointer
                rounded-full
                border border-white/10
                transition
                hover:border-white/30
              "
            />
          )}
        </div>
      </div>
    </header>
  );
}
