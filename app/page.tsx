import Image from "next/image";
import { fetchMarketData } from "@/lib/market-data";
import { MarketContext } from "@/components/market-context";
import { Dashboard } from "@/components/dashboard";

export default async function Home() {
  const marketData = await fetchMarketData();

  return (
    <main className="min-h-screen bg-bg">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex items-center gap-3 mb-1">
          <Image src="/functor-white.svg" alt="Functor" width={140} height={36} />
        </div>
        <p className="text-subdued text-sm mb-8">Protocol Fee Simulator</p>
        <MarketContext data={marketData} />
        <Dashboard />
        <div className="text-center text-[10px] text-white/20 mt-8">
          Sources: 8004scan.io, x402.org, agentpaymentsstack.com, GlobeNewsWire
        </div>
      </div>
    </main>
  );
}
