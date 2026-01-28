"use client";

import { signOut, useSession } from "next-auth/react";
import { useState, useRef, useEffect } from "react";

export default function UserMenu() {
  const { data: session } = useSession();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // cerrar dropdown al clickear afuera
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
      {/* Trigger */}
      <button
        onClick={() => setOpen(v => !v)}
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
          <img
            src={image}
            alt={name ?? "User"}
            className="h-7 w-7 rounded-full"
          />
        ) : (
          <div className="h-7 w-7 rounded-full bg-white/10" />
        )}

        <span className="hidden sm:block max-w-[120px] truncate text-white/80">
          {email}
        </span>
      </button>

      {/* Dropdown */}
      {open && (
        <div
          className="
            absolute right-0 z-50 mt-2 w-56
            rounded-2xl
            border border-white/10
            bg-black/80 backdrop-blur-xl
            shadow-xl
            overflow-hidden
          "
        >
          <div className="px-4 py-3">
            <p className="text-sm font-medium text-white truncate">
              {name ?? "Account"}
            </p>
            <p className="text-xs text-zinc-400 truncate">{email}</p>
          </div>

          <div className="h-px bg-white/10" />

          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="
              w-full px-4 py-2.5
              text-left text-sm text-red-400
              hover:bg-white/5
              transition
            "
          >
            Log out
          </button>
        </div>
      )}
    </div>
  );
}
