"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function SuccessClient({
  sessionId,
}: {
  sessionId?: string;
}) {
  const { update } = useSession();
  const router = useRouter();

  useEffect(() => {
    async function refresh() {
      // 🔄 vuelve a leer la sesión desde el server (plan PRO)
      await update();

      // UX: pequeño delay para que el webhook termine
      setTimeout(() => {
        router.push("/");
      }, 600);
    }

    refresh();
  }, [update, router]);

  return (
    <div className="mx-auto max-w-xl px-6 py-24 text-center text-white">
      <h1 className="text-3xl font-semibold">✅ Payment successful</h1>

      <p className="mt-4 text-zinc-400">
        Your Pro subscription is now active.
      </p>

      <p className="mt-6 text-xs text-zinc-500">
        Unlocking Pro features…
      </p>

      {sessionId && (
        <p className="mt-4 text-[10px] text-zinc-600 break-all">
          Session ID: {sessionId}
        </p>
      )}
    </div>
  );
}
