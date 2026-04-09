"use client";

import { useState, useEffect } from "react";
import { AssumptionsPanel } from "./assumptions-panel";
import { ResultsPanel } from "./results-panel";
import { MarketContext } from "./market-context";
import { calculateModel, ModelInputs } from "@/lib/model";
import { fetchMarketData, MarketData } from "@/lib/market-data";
import { DEFAULTS } from "@/lib/constants";

const INITIAL_MARKET: MarketData = {
  totalAgents: 119_000,
  txPerMonth: 75_410_000,
  volumePerMonth: 24_240_000,
  totalProjects: 137,
};

export function Dashboard() {
  const [inputs, setInputs] = useState<ModelInputs>({ ...DEFAULTS });
  const [market, setMarket] = useState<MarketData>(INITIAL_MARKET);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMarketData()
      .then((data) => { setMarket(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const results = calculateModel(inputs, market);

  return (
    <>
      <MarketContext data={market} />
      {loading && (
        <div className="text-xs text-subdued mb-4">Fetching live market data...</div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-[380px_1fr] gap-6">
        <div className="md:sticky md:top-8 md:self-start">
          <AssumptionsPanel
            inputs={inputs}
            onChange={setInputs}
            marketAgents={market.totalAgents}
            marketTxPerMonth={market.txPerMonth}
          />
        </div>
        <ResultsPanel results={results} />
      </div>
    </>
  );
}
