import { MetricCard } from "./metric-card";
import { MarketData } from "@/lib/market-data";

interface MarketContextProps {
  data: MarketData;
}

export function MarketContext({ data }: MarketContextProps) {
  return (
    <div className="mb-8">
      <h2 className="text-xs font-semibold uppercase tracking-wider text-subdued mb-3">
        Market Today
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <MetricCard
          label="Onchain Agents"
          value={data.totalAgents.toLocaleString()}
          source="8004scan.io"
          sourceUrl="https://8004scan.io/networks"
        />
        <MetricCard
          label="Tx / Month"
          value={`${(data.txPerMonth / 1_000_000).toFixed(1)}M`}
          source="x402.org"
          sourceUrl="https://x402.org"
        />
        <MetricCard
          label="Volume / Month"
          value={`$${(data.volumePerMonth / 1_000_000).toFixed(1)}M`}
          source="x402.org"
          sourceUrl="https://x402.org"
        />
        <MetricCard
          label="Avg Tx / Agent / Month"
          value={data.totalAgents > 0 ? Math.round(data.txPerMonth / data.totalAgents).toLocaleString() : "N/A"}
          source="derived"
        />
      </div>
    </div>
  );
}
