"use client";

import { signOut, useSession } from "next-auth/react";
import { useState, useRef, useEffect } from "react";
import { useUserPlan } from "@/lib/useUserPlan";
import Link from "next/link";

function getInitials(name?: string | null, email?: string | null) {
  const source = (name || email || "U").trim();
  const parts = source.split(" ").filter(Boolean);

  if (parts.length >= 2) {
    return `${parts[0][0] ?? ""}${parts[1][0] ?? ""}`.toUpperCase();
  }

  return source.slice(0, 2).toUpperCase();
}

function getPlanLabel(plan: string) {
  if (plan === "free") return "Free";
  if (plan === "plus") return "Plus";
  return "Pro";
}

export default function UserMenu() {
  const { data: session } = useSession();
  const { plan, isLoading } = useUserPlan();

  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!session?.user) return null;

  const { name, email, image } = session.user;
  const initials = getInitials(name, email);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="
          flex items-center gap-2 rounded-full border border-white/10
          bg-black/40 px-2 py-1.5 text-sm text-white transition hover:bg-white/5
        "
      >
        {image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={image}
            alt={name ?? "User"}
            className="h-8 w-8 rounded-full object-cover"
            referrerPolicy="no-referrer"
          />
        ) : (
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-500/20 text-[11px] font-semibold text-indigo-200">
            {initials}
          </div>
        )}

        <span className="hidden max-w-40 truncate text-white/80 sm:block">
          {email}
        </span>

        <span className="text-xs text-zinc-500">▾</span>
      </button>

      {open && (
        <div
          className="
            absolute right-0 z-50 mt-2 w-[min(18rem,calc(100vw-2rem))]
            overflow-hidden rounded-2xl border border-white/10
            bg-zinc-950 shadow-xl
          "
        >
          <div className="px-4 py-4">
            <div className="flex items-center gap-3">
              {image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={image}
                  alt={name ?? "User"}
                  className="h-10 w-10 rounded-full object-cover"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-500/20 text-xs font-semibold text-indigo-200">
                  {initials}
                </div>
              )}

              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-white">
                  {name ?? "Account"}
                </p>
                <p className="truncate text-xs text-zinc-400">{email}</p>
              </div>
            </div>
          </div>

          <div className="h-px bg-white/10" />

          <div className="px-4 py-3 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-zinc-400">Plan</span>
              <span className="font-medium text-white">
                {isLoading ? "…" : getPlanLabel(plan)}
              </span>
            </div>

            <div className="mt-1 text-xs text-zinc-500">
              Access is based on your current plan.
            </div>

            {!isLoading && plan === "free" && (
              <Link
                href="/#pricing"
                className="mt-3 block rounded-xl bg-indigo-500 px-3 py-2 text-center text-xs font-semibold text-white transition hover:bg-indigo-400"
                onClick={() => setOpen(false)}
              >
                Unlock full access
              </Link>
            )}
          </div>

          <div className="h-px bg-white/10" />

          <div className="py-1">
            <Link
              href="/history"
              className="block px-4 py-2.5 text-sm text-white/80 transition hover:bg-white/5 hover:text-white"
              onClick={() => setOpen(false)}
            >
              History
            </Link>

            <Link
              href="/account"
              className="block px-4 py-2.5 text-sm text-white/80 transition hover:bg-white/5 hover:text-white"
              onClick={() => setOpen(false)}
            >
              Account
            </Link>

            <Link
              href="/#pricing"
              className="block px-4 py-2.5 text-sm text-white/80 transition hover:bg-white/5 hover:text-white"
              onClick={() => setOpen(false)}
            >
              Compare plans
            </Link>

            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="w-full px-4 py-2.5 text-left text-sm text-red-400 transition hover:bg-white/5"
            >
              Log out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
