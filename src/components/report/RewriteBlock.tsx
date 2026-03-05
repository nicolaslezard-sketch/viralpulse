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
    <div className="space-y-6">
      <h2 className="text-xl font-bold">✨ AI Viral Rewrite</h2>

      <div className="grid md:grid-cols-2 gap-4">
        {/* HOOK */}
        <div className="card relative">
          <button
            onClick={() => copy(rewrite.hookRewrite)}
            className="absolute top-3 right-3 text-xs text-zinc-400 hover:text-white"
          >
            Copy
          </button>

          <h3 className="font-semibold mb-2">Hook Rewrite</h3>
          <p className="text-sm text-zinc-300">{rewrite.hookRewrite}</p>
        </div>

        {/* THUMBNAIL */}
        <div className="card relative">
          <button
            onClick={() => copy(rewrite.thumbnailIdea)}
            className="absolute top-3 right-3 text-xs text-zinc-400 hover:text-white"
          >
            Copy
          </button>

          <h3 className="font-semibold mb-2">Thumbnail Idea</h3>
          <p className="text-sm text-zinc-300">{rewrite.thumbnailIdea}</p>
        </div>

        {/* SCRIPT */}
        <div className="card md:col-span-2 relative">
          <button
            onClick={() => copy(rewrite.optimizedScript)}
            className="absolute top-3 right-3 text-xs text-zinc-400 hover:text-white"
          >
            Copy
          </button>

          <h3 className="font-semibold mb-2">Optimized Script</h3>

          <p className="text-sm text-zinc-300 whitespace-pre-line">
            {rewrite.optimizedScript}
          </p>
        </div>

        {/* TITLES */}
        <div className="card md:col-span-2">
          <h3 className="font-semibold mb-3">Title Ideas</h3>

          <ul className="space-y-2 text-sm text-zinc-300">
            {rewrite.titles.map((t, i) => (
              <li key={i} className="flex justify-between gap-4">
                <span>{t}</span>

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
    </div>
  );
}
