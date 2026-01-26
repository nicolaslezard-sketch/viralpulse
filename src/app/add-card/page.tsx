import { Suspense } from "react";
import AddCardClient from "./AddCardClient";

export default function AddCardPage() {
  return (
    <Suspense fallback={<Loading />}>
      <AddCardClient />
    </Suspense>
  );
}

function Loading() {
  return (
    <div className="mx-auto max-w-md px-6 py-24 text-center text-white">
      <p className="text-zinc-400">Loading secure checkout…</p>
    </div>
  );
}
