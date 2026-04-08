import { MetricCard } from "./metric-card";
import { MarketData } from "@/lib/market-data";
import { X402_DATA } from "@/lib/constants";

interface MarketContextProps {
  data: MarketData;
}

export function MarketContext({ data }: MarketContextProps) {
  return (
    <div className="mb-8">
      <h2 className="text-xs font-semibold uppercase tracking-wider text-subdued mb-3">
        Market Today
      </h2>
      <div className="grid grid-cols-4 gap-3">
        <MetricCard
          label="Onchain Agents"
          value={data.totalAgents.toLocaleString()}
          source="8004scan.io"
        />
        <MetricCard
          label="Tx / Month"
          value={`${(data.txPerMonth / 1_000_000).toFixed(1)}M`}
          source={X402_DATA.source}
        />
        <MetricCard
          label="Volume / Month"
          value={`$${(data.volumePerMonth / 1_000_000).toFixed(1)}M`}
          source={X402_DATA.source}
        />
        <MetricCard
          label="Projects"
          value={data.totalProjects.toLocaleString()}
          source="agentpaymentsstack.com"
        />
      </div>
    </div>
  );
}
