export const DEFAULTS = {
  // What % of onchain agents use Functor
  marketPenetration: 2,
  // Average policies per account (spending limit, allowlist, rate limit, etc.)
  policiesPerAccount: 3,
  // Fee per policy check (each tx checks all policies on the account)
  feePerPolicyCheck: 0.03,
  // Fee per key registered in KeyStore
  feePerKeyRegistration: 0.50,
  // Average keys per account (owner + agent session keys)
  keysPerAccount: 2,
} as const;

export const SLIDER_RANGES = {
  marketPenetration: { min: 0.5, max: 20, step: 0.5 },
  policiesPerAccount: { min: 1, max: 10, step: 1 },
  feePerPolicyCheck: { min: 0.005, max: 0.10, step: 0.005 },
  feePerKeyRegistration: { min: 0.10, max: 5.00, step: 0.10 },
  keysPerAccount: { min: 1, max: 10, step: 1 },
} as const;

export const SAFE_BENCHMARK = {
  arrUsd: 10_000_000,
  txPerYear: 326_000_000,
  source: "GlobeNewsWire, Feb 2026",
} as const;
