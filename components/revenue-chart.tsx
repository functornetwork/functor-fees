"use client";

import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { ModelResults } from "@/lib/model";

interface RevenueChartProps {
  results: ModelResults;
}

export function RevenueChart({ results }: RevenueChartProps) {
  const data = results.monthlyProjection.map((m) => ({
    name: `M${m.month}`,
    revenue: Math.round(m.totalRev),
  }));

  return (
    <div className="bg-white/5 rounded-lg p-4 border border-white/10">
      <h3 className="text-xs font-semibold uppercase tracking-wider text-subdued mb-3">
        12-Month Revenue Projection
      </h3>
      <ResponsiveContainer width="100%" height={200}>
        <AreaChart data={data}>
          <defs>
            <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#1d4ed8" stopOpacity={0.3} />
              <stop offset="100%" stopColor="#1d4ed8" stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis dataKey="name" tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 10 }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}K`} />
          <Tooltip
            contentStyle={{ background: "#161b22", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, color: "#f8f8f8", fontSize: 12 }}
            formatter={(value) => [`$${Number(value).toLocaleString()}`, "Revenue"]}
          />
          <Area type="monotone" dataKey="revenue" stroke="#1d4ed8" fill="url(#revenueGrad)" strokeWidth={2} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
