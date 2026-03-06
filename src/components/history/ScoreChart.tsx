"use client";

import {
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts";

type ChartPoint = {
  date: string;
  score: number;
};
import { ReferenceLine } from "recharts";

export default function ScoreChart({ data }: { data: ChartPoint[] }) {
  return (
    <div className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-6">
      <h3 className="text-sm text-zinc-400 mb-4">Score evolution</h3>
      <div className="flex items-center gap-4 mb-4 text-xs text-zinc-400">
        <div className="flex items-center gap-2">
          <div className="w-3 h-0.5 bg-indigo-400"></div>
          <span>Content score</span>
        </div>

        <div className="flex items-center gap-2">
          <div className="w-3 h-0.5 border-t border-dashed border-emerald-400"></div>
          <span>Viral threshold (80)</span>
        </div>
      </div>
      <div className="h-65">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="scoreGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
              </linearGradient>
            </defs>

            <XAxis
              dataKey="date"
              tick={{ fill: "#9ca3af", fontSize: 12 }}
              axisLine={false}
              tickLine={false}
            />

            <YAxis
              domain={[0, 100]}
              tick={{ fill: "#9ca3af", fontSize: 12 }}
              axisLine={false}
              tickLine={false}
            />

            <Tooltip
              content={({ active, payload }) => {
                if (!active || !payload || !payload.length) return null;

                const d = payload[0].payload;

                return (
                  <div className="bg-black/90 border border-white/10 rounded-lg px-4 py-3 text-sm">
                    <div className="font-medium text-white mb-1">{d.name}</div>
                    <div className="text-indigo-400">Score: {d.score}</div>
                    <div className="text-zinc-400 text-xs">
                      {new Date(d.date).toLocaleDateString()}
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
              style={{ filter: "drop-shadow(0 0 6px #6366f1)" }}
              strokeWidth={3}
              fill="url(#scoreGradient)"
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
