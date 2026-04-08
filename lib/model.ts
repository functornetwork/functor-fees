export interface ModelInputs {
  captureRate: number;
  platforms: number;
  agentsPerPlatform: number;
  txPerAgentMonth: number;
  tvsPerAgent: number;
  keyFee: number;
  txFee: number;
}

export interface ModelResults {
  totalAgents: number;
  totalTvs: number;
  totalTxMonth: number;
  keystoreRevMonth: number;
  hookRevMonth: number;
  totalRevMonth: number;
  totalRevAnnual: number;
  monthlyProjection: { month: number; revenue: number; agents: number }[];
  hookPercent: number;
  keystorePercent: number;
}

export function calculateModel(inputs: ModelInputs): ModelResults {
  const totalAgents = inputs.platforms * inputs.agentsPerPlatform;
  const totalTvs = totalAgents * inputs.tvsPerAgent;
  const totalTxMonth = totalAgents * inputs.txPerAgentMonth;
  const newAgentsPerMonth = totalAgents / 12;
  const keystoreRevMonth = newAgentsPerMonth * inputs.keyFee;
  const hookRevMonth = totalTxMonth * inputs.txFee;
  const totalRevMonth = keystoreRevMonth + hookRevMonth;
  const totalRevAnnual = totalRevMonth * 12;
  const hookPercent = totalRevMonth > 0 ? (hookRevMonth / totalRevMonth) * 100 : 0;
  const keystorePercent = totalRevMonth > 0 ? (keystoreRevMonth / totalRevMonth) * 100 : 0;

  const monthlyProjection = Array.from({ length: 12 }, (_, i) => {
    const month = i + 1;
    const agentsThisMonth = Math.round((totalAgents / 12) * month);
    const txThisMonth = agentsThisMonth * inputs.txPerAgentMonth;
    const hookRev = txThisMonth * inputs.txFee;
    const keystoreRev = newAgentsPerMonth * inputs.keyFee;
    return { month, revenue: hookRev + keystoreRev, agents: agentsThisMonth };
  });

  return {
    totalAgents, totalTvs, totalTxMonth, keystoreRevMonth, hookRevMonth,
    totalRevMonth, totalRevAnnual, monthlyProjection, hookPercent, keystorePercent,
  };
}
