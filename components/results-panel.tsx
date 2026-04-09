import { MetricCard } from "./metric-card";
import { RevenueChart } from "./revenue-chart";
import { RevenueSplit } from "./revenue-split";
import { SafeBenchmark } from "./safe-benchmark";
import { ModelResults } from "@/lib/model";

interface ResultsPanelProps {
  results: ModelResults;
}

function fmt(v: number) {
  if (v >= 1_000_000_000) return `${(v / 1_000_000_000).toFixed(1)}B`;
  if (v >= 1_000_000) return `${(v / 1_000_000).toFixed(1)}M`;
  if (v >= 1_000) return `${(v / 1_000).toFixed(1)}K`;
  return v.toFixed(0);
}

function fmtUsd(v: number) {
  if (v >= 1_000_000) return `$${(v / 1_000_000).toFixed(1)}M`;
  if (v >= 1_000) return `$${(v / 1_000).toFixed(1)}K`;
  return `$${v.toFixed(0)}`;
}

export function ResultsPanel({ results }: ResultsPanelProps) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <MetricCard label="Functor Accounts" value={fmt(results.functorAccounts)} />
        <MetricCard label="Policy Checks / Month" value={fmt(results.policyChecksPerMonth)} />
        <MetricCard label="Keys Registered" value={fmt(results.totalKeys)} />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <MetricCard label="Monthly Revenue" value={fmtUsd(results.totalRevMonth)} highlight />
        <MetricCard label="Annual Revenue" value={fmtUsd(results.totalRevAnnual)} highlight />
      </div>
      <RevenueChart results={results} />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <RevenueSplit results={results} />
        <SafeBenchmark results={results} />
      </div>
    </div>
  );
}
