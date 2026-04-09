import { MarketData } from "./market-data";

export interface ModelInputs {
  marketPenetration: number;      // % of market agents using Functor
  policiesPerAccount: number;     // avg policies configured per account
  feePerPolicyCheck: number;      // $ per policy check
  feePerKeyRegistration: number;  // $ per key stored in KeyStore
  keysPerAccount: number;         // avg keys per account
}

export interface ModelResults {
  // Market context
  marketAgents: number;
  marketTxPerMonth: number;

  // Functor metrics
  functorAccounts: number;
  totalKeys: number;
  totalPolicyChecksPerMonth: number;
  txPerMonth: number;

  // Revenue
  policyRevMonth: number;
  keystoreRevMonth: number;
  totalRevMonth: number;
  totalRevAnnual: number;
  policyPercent: number;
  keystorePercent: number;

  // 12-month projection (linear ramp from 0 to full penetration)
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

  // Functor's slice of the market
  const functorAccounts = Math.round(marketAgents * (inputs.marketPenetration / 100));
  const totalKeys = functorAccounts * inputs.keysPerAccount;

  // Each transaction checks ALL policies on the account
  // Tx per account/month derived from market average
  const txPerAccountMonth = marketAgents > 0
    ? marketTxPerMonth / marketAgents
    : 500;
  const txPerMonth = Math.round(functorAccounts * txPerAccountMonth);
  const totalPolicyChecksPerMonth = txPerMonth * inputs.policiesPerAccount;

  // Revenue at full capacity
  const policyRevMonth = totalPolicyChecksPerMonth * inputs.feePerPolicyCheck;
  const newKeysPerMonth = totalKeys / 12; // linear onboarding over 12mo
  const keystoreRevMonth = newKeysPerMonth * inputs.feePerKeyRegistration;
  const totalRevMonth = policyRevMonth + keystoreRevMonth;
  const totalRevAnnual = totalRevMonth * 12;

  const policyPercent = totalRevMonth > 0 ? (policyRevMonth / totalRevMonth) * 100 : 0;
  const keystorePercent = totalRevMonth > 0 ? (keystoreRevMonth / totalRevMonth) * 100 : 0;

  // 12-month projection: linear ramp from 0 to full penetration
  const monthlyProjection = Array.from({ length: 12 }, (_, i) => {
    const month = i + 1;
    const accounts = Math.round((functorAccounts / 12) * month);
    const keys = accounts * inputs.keysPerAccount;
    const monthTx = Math.round(accounts * txPerAccountMonth);
    const policyChecks = monthTx * inputs.policiesPerAccount;
    const policyRev = policyChecks * inputs.feePerPolicyCheck;
    const keystoreRev = (functorAccounts / 12) * inputs.keysPerAccount * inputs.feePerKeyRegistration;
    return {
      month,
      accounts,
      policyChecks,
      policyRev,
      keystoreRev,
      totalRev: policyRev + keystoreRev,
    };
  });

  return {
    marketAgents,
    marketTxPerMonth,
    functorAccounts,
    totalKeys,
    totalPolicyChecksPerMonth,
    txPerMonth,
    policyRevMonth,
    keystoreRevMonth,
    totalRevMonth,
    totalRevAnnual,
    policyPercent,
    keystorePercent,
    monthlyProjection,
  };
}
