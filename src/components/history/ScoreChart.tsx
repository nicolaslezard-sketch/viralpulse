"use client";

import { useMemo } from "react";
import {
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
  ReferenceLine,
} from "recharts";

type ChartPoint = {
  id: string;
  createdAt: string;
  dateLabel: string;
  shortDateLabel: string;
  score: number;
  name: string;
};

function truncate(text: string, max = 68) {
  if (text.length <= max) return text;
  return `${text.slice(0, max).trim()}…`;
}

function getTickInterval(length: number) {
  if (length <= 8) return 0;
  if (length <= 16) return 1;
  if (length <= 24) return 2;
  if (length <= 40) return 4;
  return 6;
}

export default function ScoreChart({ data }: { data: ChartPoint[] }) {
  const tickInterval = useMemo(
    () => getTickInterval(data.length),
    [data.length],
  );

  return (
    <div className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-6">
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-sm text-zinc-300">Score evolution</h3>
          <p className="mt-1 text-xs text-zinc-500">
            Click any point to open that analysis.
          </p>
        </div>

        <div className="flex items-center gap-4 text-xs text-zinc-400">
          <div className="flex items-center gap-2">
            <div className="h-0.5 w-3 bg-indigo-400" />
            <span>Content score</span>
          </div>

          <div className="flex items-center gap-2">
            <div className="h-0.5 w-3 border-t border-dashed border-emerald-400" />
            <span>Viral threshold (80)</span>
          </div>
        </div>
      </div>

      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{ top: 10, right: 12, left: -12, bottom: 0 }}
            onClick={(state) => {
              const payload = (
                state as
                  | {
                      activePayload?: Array<{ payload?: ChartPoint }>;
                    }
                  | undefined
              )?.activePayload;

              const point = payload?.[0]?.payload;

              if (point?.id) {
                window.location.href = `/report/${point.id}`;
              }
            }}
          >
            <defs>
              <linearGradient id="scoreGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
              </linearGradient>
            </defs>

            <XAxis
              dataKey="shortDateLabel"
              interval={tickInterval}
              minTickGap={24}
              tick={{ fill: "#9ca3af", fontSize: 12 }}
              axisLine={false}
              tickLine={false}
            />

            <YAxis
              domain={[0, 100]}
              tick={{ fill: "#9ca3af", fontSize: 12 }}
              axisLine={false}
              tickLine={false}
              width={40}
            />

            <Tooltip
              cursor={{ stroke: "#ffffff40", strokeWidth: 1 }}
              content={({ active, payload }) => {
                if (!active || !payload || !payload.length) return null;

                const d = payload[0].payload as ChartPoint;

                return (
                  <div className="max-w-sm rounded-xl border border-white/10 bg-black/90 px-4 py-3 text-sm shadow-xl">
                    <div className="mb-1 font-medium text-white">
                      {truncate(d.name)}
                    </div>
                    <div className="text-indigo-400">Score: {d.score}</div>
                    <div className="mt-1 text-xs text-zinc-400">
                      {d.dateLabel}
                    </div>
                    <div className="mt-2 text-xs font-medium text-emerald-400">
                      Open report →
                    </div>
                  </div>
                );
              }}
            />

            <ReferenceLine y={80} stroke="#22c55e" strokeDasharray="4 4" />

            <Area
              type="monotone"
              dataKey="score"
              stroke="#818cf8"
              strokeWidth={3}
              fill="url(#scoreGradient)"
              style={{ filter: "drop-shadow(0 0 6px #6366f1)" }}
              dot={{
                r: 4,
                strokeWidth: 2,
                stroke: "#a5b4fc",
                fill: "#6366f1",
                cursor: "pointer",
              }}
              activeDot={{
                r: 7,
                strokeWidth: 2,
                stroke: "#fff",
                fill: "#818cf8",
                cursor: "pointer",
              }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
