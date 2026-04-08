export const DEFAULTS = {
  captureRate: 5,
  platforms: 5,
  agentsPerPlatform: 200,
  txPerAgentMonth: 500,
  tvsPerAgent: 50_000,
  keyFee: 0.50,
  txFee: 0.03,
} as const;

export const SLIDER_RANGES = {
  captureRate: { min: 1, max: 20, step: 1 },
  platforms: { min: 1, max: 50, step: 1 },
  agentsPerPlatform: { min: 10, max: 5000, step: 10 },
  txPerAgentMonth: { min: 10, max: 10000, step: 10 },
  tvsPerAgent: { min: 1000, max: 1_000_000, step: 1000 },
  keyFee: { min: 0.01, max: 5.00, step: 0.01 },
  txFee: { min: 0.001, max: 0.50, step: 0.001 },
} as const;

export const SAFE_BENCHMARK = {
  arrUsd: 10_000_000,
  txPerYear: 326_000_000,
  volumePerYear: 600_000_000_000,
  source: "GlobeNewsWire, Feb 2026",
} as const;

export const X402_DATA = {
  txPerMonth: 75_410_000,
  volumePerMonth: 24_240_000,
  buyers: 94_060,
  sellers: 22_000,
  source: "x402.org, April 2026",
} as const;
