export interface MarketData {
  totalAgents: number;
  txPerMonth: number;
  volumePerMonth: number;
  totalProjects: number;
}

const FALLBACK: MarketData = {
  totalAgents: 127_300,
  txPerMonth: 75_410_000,
  volumePerMonth: 24_240_000,
  totalProjects: 137,
};

export async function fetchMarketData(): Promise<MarketData> {
  const [agents, projects] = await Promise.allSettled([
    fetchAgentCount(),
    fetchProjectCount(),
  ]);

  return {
    totalAgents: agents.status === "fulfilled" ? agents.value : FALLBACK.totalAgents,
    txPerMonth: FALLBACK.txPerMonth,       // x402.org (no API)
    volumePerMonth: FALLBACK.volumePerMonth, // x402.org (no API)
    totalProjects: projects.status === "fulfilled" ? projects.value : FALLBACK.totalProjects,
  };
}

async function fetchAgentCount(): Promise<number> {
  const res = await fetch("https://8004scan.io/networks", { cache: "no-store" });
  const html = await res.text();
  const matches = html.matchAll(/([\d,]+)\s*agents/gi);
  let total = 0;
  for (const m of matches) {
    total += parseInt(m[1].replace(/,/g, ""));
  }
  return total || FALLBACK.totalAgents;
}

async function fetchProjectCount(): Promise<number> {
  const res = await fetch("https://agentpaymentsstack.com/data.json", { cache: "no-store" });
  const data = await res.json();
  return Array.isArray(data) ? data.length : FALLBACK.totalProjects;
}
