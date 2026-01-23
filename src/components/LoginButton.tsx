"use client";

import { signIn } from "next-auth/react";

export default function LoginButton() {
  return (
    <button
      onClick={() => signIn()}
      className="
        w-full rounded-2xl
        bg-white text-black
        px-6 py-3 text-sm font-semibold
        hover:bg-zinc-200
      "
    >
      Sign in to continue
    </button>
  );
}
