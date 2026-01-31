"use client";

import { signOut, useSession } from "next-auth/react";
import { useState, useRef, useEffect } from "react";
import { useUserPlan } from "@/lib/useUserPlan";
import Link from "next/link";

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

  return (
    <div ref={ref} className="relative">
      {/* AVATAR BUTTON */}
      <button
        onClick={() => setOpen((v) => !v)}
        className="
          flex items-center gap-2
          rounded-full
          border border-white/10
          bg-black/40
          px-2 py-1.5
          text-sm text-white
          hover:bg-white/5
          transition
        "
      >
        {image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={image}
            alt={name ?? "User"}
            className="h-7 w-7 rounded-full"
            referrerPolicy="no-referrer"
          />
        ) : (
          <div className="h-7 w-7 rounded-full bg-white/10" />
        )}

        <span className="hidden sm:block max-w-35 truncate text-white/80">
          {email}
        </span>
      </button>

      {/* DROPDOWN */}
      {open && (
        <div
          className="
            absolute right-0 z-50 mt-2 w-64
            rounded-2xl
            border border-white/10
            bg-black/80 backdrop-blur-xl
            shadow-xl
            overflow-hidden
          "
        >
          {/* USER INFO */}
          <div className="px-4 py-3">
            <p className="text-sm font-medium text-white truncate">
              {name ?? "Account"}
            </p>
            <p className="text-xs text-zinc-400 truncate">{email}</p>
          </div>

          <div className="h-px bg-white/10" />

          {/* PLAN INFO */}
          <div className="px-4 py-3 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-zinc-400">Plan</span>
              <span className="font-medium text-white capitalize">
                {isLoading ? "…" : plan}
              </span>
            </div>
            <div className="mt-1 text-xs text-zinc-500">
              Access is based on your plan.
            </div>
          </div>

          <div className="h-px bg-white/10" />

          {/* LINKS */}
          <div className="py-1">
            {plan !== "free" && (
              <Link
                href="/history"
                className="
                  block px-4 py-2.5 text-sm
                  text-white/80
                  hover:bg-white/5 hover:text-white
                  transition
                "
                onClick={() => setOpen(false)}
              >
                History
              </Link>
            )}

            <Link
              href="/account"
              className="
                block px-4 py-2.5 text-sm
                text-white/80
                hover:bg-white/5 hover:text-white
                transition
              "
              onClick={() => setOpen(false)}
            >
              Account
            </Link>

            <Link
              href="/#pricing"
              className="
                block px-4 py-2.5 text-sm
                text-white/80
                hover:bg-white/5 hover:text-white
                transition
              "
              onClick={() => setOpen(false)}
            >
              See pricing
            </Link>

            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="
                w-full px-4 py-2.5 text-left text-sm
                text-red-400
                hover:bg-white/5
                transition
              "
            >
              Log out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
