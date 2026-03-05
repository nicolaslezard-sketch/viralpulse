type Props = {
  rewrite?: {
    hookRewrite: string;
    optimizedScript: string;
    titles: string[];
    thumbnailIdea: string;
  };
};

export function RewriteBlock({ rewrite }: Props) {
  if (!rewrite) return null;

  return (
    <div className="mb-12">
      <h2 className="text-lg font-semibold text-indigo-300 tracking-wide mb-4">
        ✨ AI Viral Rewrite
      </h2>

      <div className="grid md:grid-cols-2 gap-4">
        {/* Hook */}
        <div className="rounded-xl bg-linear-to-b from-[#0f172a] to-[#020617] p-6 border border-white/5">
          <h3 className="text-sm font-semibold text-white mb-3">
            Hook Rewrite
          </h3>

          <p className="text-sm text-white/80">{rewrite.hookRewrite}</p>
        </div>

        {/* Thumbnail */}
        <div className="rounded-xl bg-linear-to-b from-[#0f172a] to-[#020617] p-6 border border-white/5">
          <h3 className="text-sm font-semibold text-white mb-3">
            Thumbnail Idea
          </h3>

          <p className="text-sm text-white/80">{rewrite.thumbnailIdea}</p>
        </div>

        {/* Script */}
        <div className="rounded-xl bg-linear-to-b from-[#0f172a] to-[#020617] p-6 border border-white/5 md:col-span-2">
          <h3 className="text-sm font-semibold text-white mb-3">
            Optimized Script
          </h3>

          <p className="text-sm text-white/80 whitespace-pre-line">
            {rewrite.optimizedScript}
          </p>
        </div>

        {/* Titles */}
        <div className="rounded-xl bg-linear-to-b from-[#0f172a] to-[#020617] p-6 border border-white/5 md:col-span-2">
          <h3 className="text-sm font-semibold text-white mb-3">Title Ideas</h3>

          <ul className="space-y-2 text-sm text-white/80">
            {rewrite.titles.map((t, i) => (
              <li key={i} className="flex gap-2">
                <span className="text-indigo-400 font-semibold">{i + 1}.</span>
                <span>{t}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
