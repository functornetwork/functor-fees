import { MarketData } from "./market-data";

export interface ModelInputs {
  marketPenetration: number;
  feePerPolicyCheck: number;
  feePerKeyRegistration: number;
  keysPerAccount: number;
}

export interface ModelResults {
  marketAgents: number;
  marketTxPerMonth: number;
  txPerAgentMonth: number;

  functorAccounts: number;
  totalKeys: number;
  policyChecksPerMonth: number;

  policyRevMonth: number;
  keystoreRevMonth: number;
  totalRevMonth: number;
  totalRevAnnual: number;
  policyPercent: number;
  keystorePercent: number;

  monthlyProjection: {
    month: number;
    accounts: number;
    policyChecks: number;
    policyRev: number;
    keystoreRev: number;
    totalRev: number;
  }[];
}

export function calculateModel(inputs: ModelInputs, market: MarketData): ModelResults {
  const marketAgents = market.totalAgents;
  const marketTxPerMonth = market.txPerMonth;
  const txPerAgentMonth = marketAgents > 0
    ? Math.round(marketTxPerMonth / marketAgents)
    : 0;

  const functorAccounts = Math.round(marketAgents * (inputs.marketPenetration / 100));
  const totalKeys = functorAccounts * inputs.keysPerAccount;
  const policyChecksPerMonth = functorAccounts * txPerAgentMonth;

  const policyRevMonth = policyChecksPerMonth * inputs.feePerPolicyCheck;
  const newKeysPerMonth = totalKeys / 12;
  const keystoreRevMonth = newKeysPerMonth * inputs.feePerKeyRegistration;
  const totalRevMonth = policyRevMonth + keystoreRevMonth;
  const totalRevAnnual = totalRevMonth * 12;

  const policyPercent = totalRevMonth > 0 ? (policyRevMonth / totalRevMonth) * 100 : 0;
  const keystorePercent = totalRevMonth > 0 ? (keystoreRevMonth / totalRevMonth) * 100 : 0;

  const monthlyProjection = Array.from({ length: 12 }, (_, i) => {
    const month = i + 1;
    const accounts = Math.round((functorAccounts / 12) * month);
    const policyChecks = accounts * txPerAgentMonth;
    const policyRev = policyChecks * inputs.feePerPolicyCheck;
    const keystoreRev = newKeysPerMonth * inputs.feePerKeyRegistration;
    return { month, accounts, policyChecks, policyRev, keystoreRev, totalRev: policyRev + keystoreRev };
  });

  return {
    marketAgents, marketTxPerMonth, txPerAgentMonth,
    functorAccounts, totalKeys, policyChecksPerMonth,
    policyRevMonth, keystoreRevMonth, totalRevMonth, totalRevAnnual,
    policyPercent, keystorePercent, monthlyProjection,
  };
}
