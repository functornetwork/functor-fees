"use client";

import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { ModelResults } from "@/lib/model";

interface RevenueSplitProps {
  results: ModelResults;
}

export function RevenueSplit({ results }: RevenueSplitProps) {
  const data = [
    { name: "Policy Checks", value: results.policyRevMonth, color: "#1d4ed8" },
    { name: "Key Registration", value: results.keystoreRevMonth, color: "#22c55e" },
  ];

  return (
    <div className="bg-white/5 rounded-lg p-4 border border-white/10">
      <h3 className="text-xs font-semibold uppercase tracking-wider text-subdued mb-3">
        Monthly Revenue Split
      </h3>
      <div className="flex items-center gap-4">
        <ResponsiveContainer width={100} height={100}>
          <PieChart>
            <Pie data={data} innerRadius={25} outerRadius={40} dataKey="value" strokeWidth={0}>
              {data.map((entry, i) => (
                <Cell key={i} fill={entry.color} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <div className="space-y-2">
          {data.map((d) => (
            <div key={d.name} className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full" style={{ background: d.color }} />
              <span className="text-xs text-subdued">{d.name}</span>
              <span className="text-xs font-semibold text-fg">
                ${d.value.toLocaleString(undefined, { maximumFractionDigits: 0 })}
              </span>
              <span className="text-[10px] text-white/30">
                ({d.name === "Policy Checks" ? results.policyPercent.toFixed(0) : results.keystorePercent.toFixed(0)}%)
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
