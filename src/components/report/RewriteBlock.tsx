import Link from "next/link";

type Props = {
  rewrite: {
    hookRewrite: string;
    optimizedScript: string;
    titles: string[];
    thumbnailIdea: string;
  };
  isPro?: boolean;
};

function copy(text: string) {
  navigator.clipboard.writeText(text);
}

function previewText(text: string, maxChars = 180) {
  const clean = text.replace(/\s+/g, " ").trim();
  if (clean.length <= maxChars) return clean;
  return `${clean.slice(0, maxChars).trim()}…`;
}

function LockedRewriteCard({
  title,
  preview,
}: {
  title: string;
  preview: string;
}) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-[#020617] p-6">
      <h3 className="mb-3 text-sm font-semibold text-indigo-300">{title}</h3>

      <div className="relative min-h-[180px]">
        <div className="text-sm leading-relaxed text-zinc-200">{preview}</div>

        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#020617] via-[#020617]/95 to-transparent" />

        <div className="absolute inset-x-0 bottom-0 flex flex-col items-center gap-3 px-4 pb-4 text-center">
          <div className="text-sm font-semibold text-white">
            🔒 Unlock AI Rewrite
          </div>

          <p className="max-w-xs text-xs text-zinc-400">
            Get stronger hooks, cleaner wording, title ideas and a more
            retention-focused script.
          </p>

          <Link
            href="/pricing"
            className="rounded-xl bg-indigo-500 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-400"
          >
            Upgrade to Pro
          </Link>
        </div>
      </div>
    </div>
  );
}

export function RewriteBlock({ rewrite, isPro = false }: Props) {
  if (!isPro) {
    return (
      <div className="mt-8 grid gap-6 md:grid-cols-2">
        <LockedRewriteCard
          title="HOOK REWRITE"
          preview={previewText(rewrite.hookRewrite, 180)}
        />

        <LockedRewriteCard
          title="THUMBNAIL IDEA"
          preview={previewText(rewrite.thumbnailIdea, 180)}
        />

        <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-[#020617] p-6 md:col-span-2">
          <h3 className="mb-4 text-sm font-semibold text-indigo-300">
            OPTIMIZED SCRIPT
          </h3>

          <div className="relative min-h-[220px]">
            <div className="whitespace-pre-line text-sm leading-relaxed text-zinc-200">
              {previewText(rewrite.optimizedScript, 420)}
            </div>

            <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-[#020617] via-[#020617]/95 to-transparent" />

            <div className="absolute inset-x-0 bottom-0 flex flex-col items-center gap-3 px-4 pb-4 text-center">
              <div className="text-sm font-semibold text-white">
                🔒 Unlock the full rewrite
              </div>

              <p className="max-w-md text-xs text-zinc-400">
                Access the full rewritten script, better framing and stronger
                title ideas optimized for performance.
              </p>

              <Link
                href="/pricing"
                className="rounded-xl bg-indigo-500 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-400"
              >
                Upgrade to Pro
              </Link>
            </div>
          </div>
        </div>

        <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-[#020617] p-6 md:col-span-2">
          <h3 className="mb-4 text-sm font-semibold text-indigo-300">
            TITLE IDEAS
          </h3>

          <div className="relative min-h-[180px]">
            <ul className="space-y-3 text-sm text-zinc-200">
              {rewrite.titles.slice(0, 2).map((t, i) => (
                <li key={i}>
                  <span className="mr-2 text-indigo-400">{i + 1}.</span>
                  {previewText(t, 120)}
                </li>
              ))}
            </ul>

            <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#020617] via-[#020617]/95 to-transparent" />

            <div className="absolute inset-x-0 bottom-0 flex flex-col items-center gap-3 px-4 pb-4 text-center">
              <div className="text-sm font-semibold text-white">
                🔒 Unlock all title ideas
              </div>

              <Link
                href="/pricing"
                className="rounded-xl bg-indigo-500 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-400"
              >
                Upgrade to Pro
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-8 grid gap-6 md:grid-cols-2">
      <div className="relative rounded-2xl border border-white/10 bg-[#020617] p-6">
        <button
          onClick={() => copy(rewrite.hookRewrite)}
          className="absolute right-4 top-4 text-xs text-zinc-400 hover:text-white"
        >
          Copy
        </button>

        <h3 className="mb-3 text-sm font-semibold text-indigo-300">
          HOOK REWRITE
        </h3>

        <p className="text-sm leading-relaxed text-zinc-200">
          {rewrite.hookRewrite}
        </p>
      </div>

      <div className="relative rounded-2xl border border-white/10 bg-[#020617] p-6">
        <button
          onClick={() => copy(rewrite.thumbnailIdea)}
          className="absolute right-4 top-4 text-xs text-zinc-400 hover:text-white"
        >
          Copy
        </button>

        <h3 className="mb-3 text-sm font-semibold text-indigo-300">
          THUMBNAIL IDEA
        </h3>

        <p className="text-sm leading-relaxed text-zinc-200">
          {rewrite.thumbnailIdea}
        </p>
      </div>

      <div className="relative rounded-2xl border border-white/10 bg-[#020617] p-6 md:col-span-2">
        <button
          onClick={() => copy(rewrite.optimizedScript)}
          className="absolute right-4 top-4 text-xs text-zinc-400 hover:text-white"
        >
          Copy
        </button>

        <h3 className="mb-4 text-sm font-semibold text-indigo-300">
          OPTIMIZED SCRIPT
        </h3>

        <div className="whitespace-pre-line text-sm leading-relaxed text-zinc-200">
          {rewrite.optimizedScript}
        </div>
      </div>

      <div className="rounded-2xl border border-white/10 bg-[#020617] p-6 md:col-span-2">
        <h3 className="mb-4 text-sm font-semibold text-indigo-300">
          TITLE IDEAS
        </h3>

        <ul className="space-y-3">
          {rewrite.titles.map((t, i) => (
            <li key={i} className="flex items-start justify-between gap-4">
              <span className="text-sm text-zinc-200">
                <span className="mr-2 text-indigo-400">{i + 1}.</span>
                {t}
              </span>

              <button
                onClick={() => copy(t)}
                className="text-xs text-zinc-400 hover:text-white"
              >
                Copy
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
