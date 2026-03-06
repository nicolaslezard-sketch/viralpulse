type Props = {
  rewrite: {
    hookRewrite: string;
    optimizedScript: string;
    titles: string[];
    thumbnailIdea: string;
  };
};

function copy(text: string) {
  navigator.clipboard.writeText(text);
}

export function RewriteBlock({ rewrite }: Props) {
  return (
    <div className="mt-8 grid md:grid-cols-2 gap-6">
      {/* HOOK */}
      <div className="rounded-2xl bg-[#020617] border border-white/10 p-6 relative">
        <button
          onClick={() => copy(rewrite.hookRewrite)}
          className="absolute top-4 right-4 text-xs text-zinc-400 hover:text-white"
        >
          Copy
        </button>

        <h3 className="text-sm font-semibold text-indigo-300 mb-3">
          HOOK REWRITE
        </h3>

        <p className="text-sm text-zinc-200 leading-relaxed">
          {rewrite.hookRewrite}
        </p>
      </div>

      {/* THUMBNAIL */}
      <div className="rounded-2xl bg-[#020617] border border-white/10 p-6 relative">
        <button
          onClick={() => copy(rewrite.thumbnailIdea)}
          className="absolute top-4 right-4 text-xs text-zinc-400 hover:text-white"
        >
          Copy
        </button>

        <h3 className="text-sm font-semibold text-indigo-300 mb-3">
          THUMBNAIL IDEA
        </h3>

        <p className="text-sm text-zinc-200 leading-relaxed">
          {rewrite.thumbnailIdea}
        </p>
      </div>

      {/* SCRIPT */}
      <div className="rounded-2xl bg-[#020617] border border-white/10 p-6 md:col-span-2 relative">
        <button
          onClick={() => copy(rewrite.optimizedScript)}
          className="absolute top-4 right-4 text-xs text-zinc-400 hover:text-white"
        >
          Copy
        </button>

        <h3 className="text-sm font-semibold text-indigo-300 mb-4">
          OPTIMIZED SCRIPT
        </h3>

        <div className="text-sm text-zinc-200 leading-relaxed whitespace-pre-line">
          {rewrite.optimizedScript}
        </div>
      </div>

      {/* TITLES */}
      <div className="rounded-2xl bg-[#020617] border border-white/10 p-6 md:col-span-2">
        <h3 className="text-sm font-semibold text-indigo-300 mb-4">
          TITLE IDEAS
        </h3>

        <ul className="space-y-3">
          {rewrite.titles.map((t, i) => (
            <li key={i} className="flex justify-between items-start gap-4">
              <span className="text-sm text-zinc-200">
                <span className="text-indigo-400 mr-2">{i + 1}.</span>
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
