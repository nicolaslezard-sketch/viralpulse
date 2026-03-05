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

export default function ScoreChart({ data }: { data: ChartPoint[] }) {
  return (
    <div className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-6">
      <h3 className="text-sm text-zinc-400 mb-4">Score evolution</h3>

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
              contentStyle={{
                background: "#020617",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "10px",
              }}
            />

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
