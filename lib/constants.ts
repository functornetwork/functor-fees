export const DEFAULTS = {
  marketPenetration: 2,
  feePerPolicyCheck: 0.03,
  feePerKeyRegistration: 0.50,
  keysPerAccount: 2,
} as const;

export const SLIDER_RANGES = {
  marketPenetration: { min: 0, max: 20, step: 0.5 },
  feePerPolicyCheck: { min: 0, max: 0.10, step: 0.005 },
  feePerKeyRegistration: { min: 0, max: 5.00, step: 0.10 },
  keysPerAccount: { min: 0, max: 10, step: 1 },
} as const;

export const SAFE_BENCHMARK = {
  arrUsd: 10_000_000,
  txPerYear: 326_000_000,
  source: "GlobeNewsWire, Feb 2026",
} as const;
