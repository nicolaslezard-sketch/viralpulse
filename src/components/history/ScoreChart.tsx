"use client";

type Point = {
  date: string;
  score: number;
};

type Props = {
  data: Point[];
};

export default function ScoreChart({ data }: Props) {
  if (!data.length) return null;

  const width = 600;
  const height = 200;
  const padding = 30;

  const scores = data.map((d) => d.score);
  const max = Math.max(...scores);
  const min = Math.min(...scores);

  const normalizeY = (value: number) => {
    if (max === min) return height / 2;
    return (
      height - padding - ((value - min) / (max - min)) * (height - padding * 2)
    );
  };

  const normalizeX = (index: number) =>
    padding + (index / (data.length - 1 || 1)) * (width - padding * 2);

  const points = data
    .map((d, i) => `${normalizeX(i)},${normalizeY(d.score)}`)
    .join(" ");

  return (
    <div className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-4">
      <div className="text-xs text-zinc-400 mb-3">Score evolution</div>

      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-48">
        {/* Línea */}
        <polyline
          fill="none"
          stroke="#6366f1"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          points={points}
        />

        {/* Puntos */}
        {data.map((d, i) => (
          <circle
            key={i}
            cx={normalizeX(i)}
            cy={normalizeY(d.score)}
            r="4"
            fill="#6366f1"
          />
        ))}
      </svg>
    </div>
  );
}
