import { ModelResults } from "@/lib/model";
import { SAFE_BENCHMARK } from "@/lib/constants";

interface SafeBenchmarkProps {
  results: ModelResults;
}

export function SafeBenchmark({ results }: SafeBenchmarkProps) {
  const functorTxYear = results.totalTxMonth * 12;

  return (
    <div className="bg-white/5 rounded-lg p-4 border border-white/10">
      <h3 className="text-xs font-semibold uppercase tracking-wider text-subdued mb-3">Safe Benchmark</h3>
      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-subdued">Your modeled tx / year</span>
          <span className="font-semibold">{(functorTxYear / 1_000_000).toFixed(1)}M</span>
        </div>
        <div className="flex justify-between">
          <span className="text-subdued">Safe tx / year</span>
          <span className="font-semibold">{(SAFE_BENCHMARK.txPerYear / 1_000_000).toFixed(0)}M</span>
        </div>
        <div className="flex justify-between">
          <span className="text-subdued">Safe ARR</span>
          <span className="font-semibold">${(SAFE_BENCHMARK.arrUsd / 1_000_000).toFixed(0)}M</span>
        </div>
        <div className="h-px bg-white/10 my-2" />
        <div className="flex justify-between">
          <span className="text-subdued">Your modeled ARR</span>
          <span className="font-semibold text-brand-blue-400">${results.totalRevAnnual.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
        </div>
      </div>
      <div className="text-[10px] text-white/30 mt-2">{SAFE_BENCHMARK.source}</div>
    </div>
  );
}
