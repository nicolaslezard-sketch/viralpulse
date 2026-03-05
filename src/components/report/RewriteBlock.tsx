type Props = {
  rewrite: {
    hookRewrite: string;
    optimizedScript: string;
    titles: string[];
    thumbnailIdea: string;
  };
};

export function RewriteBlock({ rewrite }: Props) {
  return (
    <div className="mb-10">
      <h2 className="text-xl font-bold mb-4">✨ Viral Rewrite</h2>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="card">
          <h3>Hook Rewrite</h3>
          <p>{rewrite.hookRewrite}</p>
        </div>

        <div className="card">
          <h3>Thumbnail Idea</h3>
          <p>{rewrite.thumbnailIdea}</p>
        </div>

        <div className="card md:col-span-2">
          <h3>Optimized Script</h3>
          <p className="whitespace-pre-line">{rewrite.optimizedScript}</p>
        </div>

        <div className="card md:col-span-2">
          <h3>Title Ideas</h3>
          <ul>
            {rewrite.titles.map((t) => (
              <li key={t}>{t}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
