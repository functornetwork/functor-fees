export interface MarketData {
  totalAgents: number;
  txPerMonth: number;
  volumePerMonth: number;
  totalProjects: number;
  agentsByChain: { chain: string; count: number }[];
}

export async function fetchMarketData(): Promise<MarketData> {
  const [agentData, stackData] = await Promise.allSettled([
    fetch8004Agents(),
    fetchStackProjects(),
  ]);

  const agents = agentData.status === "fulfilled" ? agentData.value : { total: 119_000, byChain: [] };
  const projects = stackData.status === "fulfilled" ? stackData.value : 137;

  return {
    totalAgents: agents.total,
    txPerMonth: 75_410_000,
    volumePerMonth: 24_240_000,
    totalProjects: projects,
    agentsByChain: agents.byChain,
  };
}

async function fetch8004Agents(): Promise<{ total: number; byChain: { chain: string; count: number }[] }> {
  try {
    const res = await fetch("https://8004scan.io/networks", { next: { revalidate: 3600 } });
    const html = await res.text();
    const counts: { chain: string; count: number }[] = [];
    const regex = /(\w[\w\s]*?):\s*([\d,]+)\s*agents/gi;
    let match;
    while ((match = regex.exec(html)) !== null) {
      counts.push({ chain: match[1].trim(), count: parseInt(match[2].replace(/,/g, "")) });
    }
    const total = counts.reduce((sum, c) => sum + c.count, 0);
    return { total: total || 119_000, byChain: counts };
  } catch {
    return { total: 119_000, byChain: [] };
  }
}

async function fetchStackProjects(): Promise<number> {
  try {
    const res = await fetch("https://agentpaymentsstack.com/data.json", { next: { revalidate: 3600 } });
    const data = await res.json();
    return Array.isArray(data) ? data.length : 137;
  } catch {
    return 137;
  }
}
