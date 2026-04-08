import { MetricCard } from "./metric-card";
import { RevenueChart } from "./revenue-chart";
import { RevenueSplit } from "./revenue-split";
import { SafeBenchmark } from "./safe-benchmark";
import { ModelResults } from "@/lib/model";

interface ResultsPanelProps {
  results: ModelResults;
}

function formatUsd(v: number) {
  if (v >= 1_000_000) return `$${(v / 1_000_000).toFixed(1)}M`;
  if (v >= 1_000) return `$${(v / 1_000).toFixed(1)}K`;
  return `$${v.toFixed(0)}`;
}

export function ResultsPanel({ results }: ResultsPanelProps) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-3">
        <MetricCard label="Total TVS" value={formatUsd(results.totalTvs)} />
        <MetricCard label="Total Agents" value={results.totalAgents.toLocaleString()} />
        <MetricCard label="Tx / Month" value={`${(results.totalTxMonth / 1_000_000).toFixed(1)}M`} />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <MetricCard label="Monthly Revenue" value={formatUsd(results.totalRevMonth)} highlight />
        <MetricCard label="Annual Revenue" value={formatUsd(results.totalRevAnnual)} highlight />
      </div>
      <RevenueChart results={results} />
      <div className="grid grid-cols-2 gap-3">
        <RevenueSplit results={results} />
        <SafeBenchmark results={results} />
      </div>
    </div>
  );
}
