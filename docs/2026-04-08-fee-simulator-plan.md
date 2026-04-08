# Functor Protocol Fee Simulator - Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build an interactive fee simulator at fees.functor.sh where investors adjust market assumptions and see Functor's protocol revenue model update in real time.

**Architecture:** Next.js single-page app with client-side computation. Dashboard layout: market context at top, assumptions panel on the left, live-updating charts and metrics on the right. Pulls real agent data from 8004scan.io and agentpaymentsstack.com APIs on page load.

**Tech Stack:** Next.js 14 (App Router), Tailwind CSS, Recharts, Inter Tight font, Vercel deployment

---

## File Structure

```
functor-fees/
├── app/
│   ├── layout.tsx              # Root layout, Inter Tight font, metadata
│   ├── page.tsx                # Main page, assembles all sections
│   └── globals.css             # Tailwind + brand colors
├── components/
│   ├── market-context.tsx      # Top banner with live market data
│   ├── assumptions-panel.tsx   # Left panel: sliders and fee inputs
│   ├── results-panel.tsx       # Right panel: assembles metrics + charts
│   ├── metric-card.tsx         # Single metric display card
│   ├── revenue-chart.tsx       # 12-month projection line chart
│   ├── revenue-split.tsx       # Pie chart for PolicyHook vs KeyStore
│   ├── safe-benchmark.tsx      # Safe comparison section
│   └── slider.tsx              # Reusable branded slider component
├── lib/
│   ├── model.ts                # Fee calculation math (pure functions)
│   ├── market-data.ts          # API fetchers for 8004scan + agentpaymentsstack
│   └── constants.ts            # Default values, Safe benchmark data, x402 data
├── public/
│   └── functor-white.svg       # Logo
├── package.json
├── tailwind.config.ts
├── tsconfig.json
├── next.config.js
└── docs/
    ├── 2026-04-08-fee-simulator-design.md
    └── 2026-04-08-fee-simulator-plan.md
```

---

### Task 1: Scaffold Next.js project

**Files:**
- Create: `package.json`, `tsconfig.json`, `next.config.js`, `tailwind.config.ts`, `app/layout.tsx`, `app/page.tsx`, `app/globals.css`, `public/functor-white.svg`

- [ ] **Step 1: Initialize Next.js project**

```bash
cd /Users/dor1s/Documents/functor-fees
npx create-next-app@latest . --typescript --tailwind --app --no-src-dir --no-eslint --import-alias "@/*"
```

Accept defaults. This creates the scaffold.

- [ ] **Step 2: Install dependencies**

```bash
npm install recharts
```

- [ ] **Step 3: Copy logo**

```bash
cp "/Users/dor1s/Documents/FunctorLogos/1. FunctorLogos/functor-white.svg" public/functor-white.svg
```

- [ ] **Step 4: Configure Tailwind with brand colors**

Replace `tailwind.config.ts`:

```typescript
import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: "#0a0a14",
        fg: "#f8f8f8",
        accent: "#90C8FF",
        "brand-blue": {
          600: "#1d4ed8",
          500: "#3b82f6",
          400: "#60a5fa",
          300: "#93c5fd",
        },
        muted: "rgba(255,255,255,0.7)",
        subdued: "rgba(255,255,255,0.45)",
      },
      fontFamily: {
        sans: ["Inter Tight", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;
```

- [ ] **Step 5: Set up globals.css**

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@import url('https://fonts.googleapis.com/css2?family=Inter+Tight:wght@300;400;500;600;700&display=swap');

body {
  background-color: #0a0a14;
  color: #f8f8f8;
}
```

- [ ] **Step 6: Set up root layout**

```typescript
// app/layout.tsx
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Functor Protocol Fee Simulator",
  description: "Model protocol fees for the Functor authorization layer",
  openGraph: {
    title: "Functor Protocol Fee Simulator",
    description: "Model protocol fees for the Functor authorization layer",
    siteName: "Functor",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
```

- [ ] **Step 7: Placeholder page**

```typescript
// app/page.tsx
import Image from "next/image";

export default function Home() {
  return (
    <main className="min-h-screen bg-bg p-8">
      <div className="flex items-center gap-3 mb-2">
        <Image src="/functor-white.svg" alt="Functor" width={140} height={36} />
      </div>
      <p className="text-subdued text-sm">Protocol Fee Simulator</p>
    </main>
  );
}
```

- [ ] **Step 8: Verify it runs**

```bash
npm run dev
```

Open http://localhost:3000. Should see Functor logo on dark background.

- [ ] **Step 9: Commit**

```bash
git init && git add -A && git commit -m "feat: scaffold Next.js project with brand config"
```

---

### Task 2: Constants and fee model

**Files:**
- Create: `lib/constants.ts`, `lib/model.ts`

- [ ] **Step 1: Create constants**

```typescript
// lib/constants.ts
export const DEFAULTS = {
  captureRate: 5,        // percent
  platforms: 5,
  agentsPerPlatform: 200,
  txPerAgentMonth: 500,
  tvsPerAgent: 50_000,   // USD
  keyFee: 0.50,          // USD
  txFee: 0.03,           // USD
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
```

- [ ] **Step 2: Create fee model (pure functions)**

```typescript
// lib/model.ts
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

  // KeyStore: new agents registering keys each month
  // Assume linear onboarding over 12 months
  const newAgentsPerMonth = totalAgents / 12;
  const keystoreRevMonth = newAgentsPerMonth * inputs.keyFee;

  const hookRevMonth = totalTxMonth * inputs.txFee;
  const totalRevMonth = keystoreRevMonth + hookRevMonth;
  const totalRevAnnual = totalRevMonth * 12;

  const hookPercent = totalRevMonth > 0 ? (hookRevMonth / totalRevMonth) * 100 : 0;
  const keystorePercent = totalRevMonth > 0 ? (keystoreRevMonth / totalRevMonth) * 100 : 0;

  // 12-month projection with linear agent onboarding
  const monthlyProjection = Array.from({ length: 12 }, (_, i) => {
    const month = i + 1;
    const agentsThisMonth = Math.round((totalAgents / 12) * month);
    const txThisMonth = agentsThisMonth * inputs.txPerAgentMonth;
    const hookRev = txThisMonth * inputs.txFee;
    const keystoreRev = newAgentsPerMonth * inputs.keyFee;
    return {
      month,
      revenue: hookRev + keystoreRev,
      agents: agentsThisMonth,
    };
  });

  return {
    totalAgents,
    totalTvs,
    totalTxMonth,
    keystoreRevMonth,
    hookRevMonth,
    totalRevMonth,
    totalRevAnnual,
    monthlyProjection,
    hookPercent,
    keystorePercent,
  };
}
```

- [ ] **Step 3: Commit**

```bash
git add lib/ && git commit -m "feat: add constants and fee calculation model"
```

---

### Task 3: Market data fetchers

**Files:**
- Create: `lib/market-data.ts`

- [ ] **Step 1: Create API fetchers**

```typescript
// lib/market-data.ts
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
    txPerMonth: 75_410_000,       // x402.org hardcoded
    volumePerMonth: 24_240_000,   // x402.org hardcoded
    totalProjects: projects,
    agentsByChain: agents.byChain,
  };
}

async function fetch8004Agents(): Promise<{ total: number; byChain: { chain: string; count: number }[] }> {
  try {
    const res = await fetch("https://8004scan.io/networks", { next: { revalidate: 3600 } });
    const html = await res.text();

    // Parse agent counts from the page
    // Fallback to known values if parsing fails
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
```

- [ ] **Step 2: Commit**

```bash
git add lib/market-data.ts && git commit -m "feat: add market data fetchers"
```

---

### Task 4: Reusable slider component

**Files:**
- Create: `components/slider.tsx`

- [ ] **Step 1: Create branded slider**

```typescript
// components/slider.tsx
"use client";

interface SliderProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (value: number) => void;
  format?: (value: number) => string;
}

export function Slider({ label, value, min, max, step, onChange, format }: SliderProps) {
  const percent = ((value - min) / (max - min)) * 100;
  const display = format ? format(value) : value.toLocaleString();

  return (
    <div className="mb-4">
      <div className="flex justify-between items-center mb-1.5">
        <span className="text-sm text-subdued">{label}</span>
        <span className="text-sm font-semibold text-fg">{display}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-1 rounded-full appearance-none cursor-pointer"
        style={{
          background: `linear-gradient(to right, #1d4ed8 0%, #60a5fa ${percent}%, rgba(255,255,255,0.1) ${percent}%)`,
        }}
      />
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add components/slider.tsx && git commit -m "feat: add reusable slider component"
```

---

### Task 5: Metric card component

**Files:**
- Create: `components/metric-card.tsx`

- [ ] **Step 1: Create metric card**

```typescript
// components/metric-card.tsx
interface MetricCardProps {
  label: string;
  value: string;
  source?: string;
  highlight?: boolean;
}

export function MetricCard({ label, value, source, highlight }: MetricCardProps) {
  return (
    <div className="bg-white/5 rounded-lg p-4 border border-white/10">
      <div className={`text-2xl font-bold ${highlight ? "text-brand-blue-400" : "text-fg"}`}>
        {value}
      </div>
      <div className="text-xs text-subdued mt-1">{label}</div>
      {source && <div className="text-[10px] text-white/30 mt-1">{source}</div>}
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add components/metric-card.tsx && git commit -m "feat: add metric card component"
```

---

### Task 6: Market context banner

**Files:**
- Create: `components/market-context.tsx`

- [ ] **Step 1: Create market context component**

```typescript
// components/market-context.tsx
import { MetricCard } from "./metric-card";
import { MarketData } from "@/lib/market-data";
import { X402_DATA } from "@/lib/constants";

interface MarketContextProps {
  data: MarketData;
}

export function MarketContext({ data }: MarketContextProps) {
  return (
    <div className="mb-8">
      <h2 className="text-xs font-semibold uppercase tracking-wider text-subdued mb-3">
        Market Today
      </h2>
      <div className="grid grid-cols-4 gap-3">
        <MetricCard
          label="Onchain Agents"
          value={data.totalAgents.toLocaleString()}
          source="8004scan.io"
        />
        <MetricCard
          label="Tx / Month"
          value={`${(data.txPerMonth / 1_000_000).toFixed(1)}M`}
          source={X402_DATA.source}
        />
        <MetricCard
          label="Volume / Month"
          value={`$${(data.volumePerMonth / 1_000_000).toFixed(1)}M`}
          source={X402_DATA.source}
        />
        <MetricCard
          label="Projects"
          value={data.totalProjects.toLocaleString()}
          source="agentpaymentsstack.com"
        />
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add components/market-context.tsx && git commit -m "feat: add market context banner"
```

---

### Task 7: Assumptions panel

**Files:**
- Create: `components/assumptions-panel.tsx`

- [ ] **Step 1: Create assumptions panel**

```typescript
// components/assumptions-panel.tsx
"use client";

import { Slider } from "./slider";
import { ModelInputs } from "@/lib/model";
import { SLIDER_RANGES } from "@/lib/constants";

interface AssumptionsPanelProps {
  inputs: ModelInputs;
  onChange: (inputs: ModelInputs) => void;
}

function formatUsd(v: number) {
  if (v >= 1_000_000) return `$${(v / 1_000_000).toFixed(1)}M`;
  if (v >= 1_000) return `$${(v / 1_000).toFixed(0)}K`;
  return `$${v.toFixed(2)}`;
}

export function AssumptionsPanel({ inputs, onChange }: AssumptionsPanelProps) {
  const update = (key: keyof ModelInputs, value: number) => {
    onChange({ ...inputs, [key]: value });
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xs font-semibold uppercase tracking-wider text-brand-blue-400 mb-4">
          Demand Assumptions
        </h3>
        <Slider
          label="Capture rate"
          value={inputs.captureRate}
          {...SLIDER_RANGES.captureRate}
          onChange={(v) => update("captureRate", v)}
          format={(v) => `${v}%`}
        />
        <Slider
          label="Agent platforms"
          value={inputs.platforms}
          {...SLIDER_RANGES.platforms}
          onChange={(v) => update("platforms", v)}
        />
        <Slider
          label="Agents per platform"
          value={inputs.agentsPerPlatform}
          {...SLIDER_RANGES.agentsPerPlatform}
          onChange={(v) => update("agentsPerPlatform", v)}
        />
        <Slider
          label="Tx per agent / month"
          value={inputs.txPerAgentMonth}
          {...SLIDER_RANGES.txPerAgentMonth}
          onChange={(v) => update("txPerAgentMonth", v)}
        />
        <Slider
          label="Avg TVS per agent"
          value={inputs.tvsPerAgent}
          {...SLIDER_RANGES.tvsPerAgent}
          onChange={(v) => update("tvsPerAgent", v)}
          format={formatUsd}
        />
      </div>
      <div>
        <h3 className="text-xs font-semibold uppercase tracking-wider text-brand-blue-400 mb-4">
          Fee Structure
        </h3>
        <Slider
          label="Key registration fee"
          value={inputs.keyFee}
          {...SLIDER_RANGES.keyFee}
          onChange={(v) => update("keyFee", v)}
          format={(v) => `$${v.toFixed(2)}`}
        />
        <Slider
          label="Per-tx policy fee"
          value={inputs.txFee}
          {...SLIDER_RANGES.txFee}
          onChange={(v) => update("txFee", v)}
          format={(v) => `$${v.toFixed(3)}`}
        />
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add components/assumptions-panel.tsx && git commit -m "feat: add assumptions panel with sliders"
```

---

### Task 8: Charts (revenue projection + pie)

**Files:**
- Create: `components/revenue-chart.tsx`, `components/revenue-split.tsx`

- [ ] **Step 1: Create 12-month line chart**

```typescript
// components/revenue-chart.tsx
"use client";

import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { ModelResults } from "@/lib/model";

interface RevenueChartProps {
  results: ModelResults;
}

export function RevenueChart({ results }: RevenueChartProps) {
  const data = results.monthlyProjection.map((m) => ({
    name: `M${m.month}`,
    revenue: Math.round(m.revenue),
  }));

  return (
    <div className="bg-white/5 rounded-lg p-4 border border-white/10">
      <h3 className="text-xs font-semibold uppercase tracking-wider text-subdued mb-3">
        12-Month Revenue Projection
      </h3>
      <ResponsiveContainer width="100%" height={200}>
        <AreaChart data={data}>
          <defs>
            <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#1d4ed8" stopOpacity={0.3} />
              <stop offset="100%" stopColor="#1d4ed8" stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis dataKey="name" tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 10 }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}K`} />
          <Tooltip
            contentStyle={{ background: "#161b22", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, color: "#f8f8f8", fontSize: 12 }}
            formatter={(value: number) => [`$${value.toLocaleString()}`, "Revenue"]}
          />
          <Area type="monotone" dataKey="revenue" stroke="#1d4ed8" fill="url(#revenueGrad)" strokeWidth={2} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
```

- [ ] **Step 2: Create pie chart**

```typescript
// components/revenue-split.tsx
"use client";

import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { ModelResults } from "@/lib/model";

interface RevenueSplitProps {
  results: ModelResults;
}

export function RevenueSplit({ results }: RevenueSplitProps) {
  const data = [
    { name: "PolicyHook", value: results.hookRevMonth, color: "#1d4ed8" },
    { name: "KeyStore", value: results.keystoreRevMonth, color: "#22c55e" },
  ];

  return (
    <div className="bg-white/5 rounded-lg p-4 border border-white/10">
      <h3 className="text-xs font-semibold uppercase tracking-wider text-subdued mb-3">
        Revenue Split
      </h3>
      <div className="flex items-center gap-4">
        <ResponsiveContainer width={100} height={100}>
          <PieChart>
            <Pie data={data} innerRadius={25} outerRadius={40} dataKey="value" strokeWidth={0}>
              {data.map((entry, i) => (
                <Cell key={i} fill={entry.color} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <div className="space-y-2">
          {data.map((d) => (
            <div key={d.name} className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full" style={{ background: d.color }} />
              <span className="text-xs text-subdued">{d.name}</span>
              <span className="text-xs font-semibold text-fg">
                ${d.value.toLocaleString(undefined, { maximumFractionDigits: 0 })}
              </span>
              <span className="text-[10px] text-white/30">
                ({d.name === "PolicyHook" ? results.hookPercent.toFixed(0) : results.keystorePercent.toFixed(0)}%)
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Commit**

```bash
git add components/revenue-chart.tsx components/revenue-split.tsx && git commit -m "feat: add revenue projection and split charts"
```

---

### Task 9: Safe benchmark and results panel

**Files:**
- Create: `components/safe-benchmark.tsx`, `components/results-panel.tsx`

- [ ] **Step 1: Create Safe benchmark**

```typescript
// components/safe-benchmark.tsx
import { ModelResults } from "@/lib/model";
import { SAFE_BENCHMARK } from "@/lib/constants";

interface SafeBenchmarkProps {
  results: ModelResults;
}

export function SafeBenchmark({ results }: SafeBenchmarkProps) {
  const functorTxYear = results.totalTxMonth * 12;
  const safeTxRatio = functorTxYear / SAFE_BENCHMARK.txPerYear;
  const safeRevEquivalent = SAFE_BENCHMARK.arrUsd * safeTxRatio;

  return (
    <div className="bg-white/5 rounded-lg p-4 border border-white/10">
      <h3 className="text-xs font-semibold uppercase tracking-wider text-subdued mb-3">
        Safe Benchmark
      </h3>
      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-subdued">Your modeled tx / year</span>
          <span className="font-semibold">{(functorTxYear / 1_000_000).toFixed(1)}M</span>
        </div>
        <div className="flex justify-between">
          <span className="text-subdued">Safe tx / year</span>
          <span className="font-semibold">{(SAFE_BENCHMARK.txPerYear / 1_000_000).toFixed(0)}M</span>
        </div>
        <div className="flex justify-between">
          <span className="text-subdued">Safe ARR</span>
          <span className="font-semibold">${(SAFE_BENCHMARK.arrUsd / 1_000_000).toFixed(0)}M</span>
        </div>
        <div className="h-px bg-white/10 my-2" />
        <div className="flex justify-between">
          <span className="text-subdued">Your modeled ARR</span>
          <span className="font-semibold text-brand-blue-400">${(results.totalRevAnnual).toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
        </div>
      </div>
      <div className="text-[10px] text-white/30 mt-2">{SAFE_BENCHMARK.source}</div>
    </div>
  );
}
```

- [ ] **Step 2: Create results panel**

```typescript
// components/results-panel.tsx
import { MetricCard } from "./metric-card";
import { RevenueChart } from "./revenue-chart";
import { RevenueSplit } from "./revenue-split";
import { SafeBenchmark } from "./safe-benchmark";
import { ModelResults } from "@/lib/model";

interface ResultsPanelProps {
  results: ModelResults;
}

function formatUsd(v: number) {
  if (v >= 1_000_000) return `$${(v / 1_000_000).toFixed(1)}M`;
  if (v >= 1_000) return `$${(v / 1_000).toFixed(1)}K`;
  return `$${v.toFixed(0)}`;
}

export function ResultsPanel({ results }: ResultsPanelProps) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-3">
        <MetricCard label="Total TVS" value={formatUsd(results.totalTvs)} />
        <MetricCard label="Total Agents" value={results.totalAgents.toLocaleString()} />
        <MetricCard label="Tx / Month" value={`${(results.totalTxMonth / 1_000_000).toFixed(1)}M`} />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <MetricCard label="Monthly Revenue" value={formatUsd(results.totalRevMonth)} highlight />
        <MetricCard label="Annual Revenue" value={formatUsd(results.totalRevAnnual)} highlight />
      </div>
      <RevenueChart results={results} />
      <div className="grid grid-cols-2 gap-3">
        <RevenueSplit results={results} />
        <SafeBenchmark results={results} />
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Commit**

```bash
git add components/safe-benchmark.tsx components/results-panel.tsx && git commit -m "feat: add Safe benchmark and results panel"
```

---

### Task 10: Assemble main page

**Files:**
- Modify: `app/page.tsx`

- [ ] **Step 1: Wire everything together**

```typescript
// app/page.tsx
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
```

- [ ] **Step 2: Create client-side dashboard wrapper**

```typescript
// components/dashboard.tsx
"use client";

import { useState } from "react";
import { AssumptionsPanel } from "./assumptions-panel";
import { ResultsPanel } from "./results-panel";
import { calculateModel, ModelInputs } from "@/lib/model";
import { DEFAULTS } from "@/lib/constants";

export function Dashboard() {
  const [inputs, setInputs] = useState<ModelInputs>({ ...DEFAULTS });
  const results = calculateModel(inputs);

  return (
    <div className="grid grid-cols-[380px_1fr] gap-6">
      <div className="sticky top-8 self-start">
        <AssumptionsPanel inputs={inputs} onChange={setInputs} />
      </div>
      <ResultsPanel results={results} />
    </div>
  );
}
```

- [ ] **Step 3: Verify it works**

```bash
npm run dev
```

Open http://localhost:3000. Should see full dashboard with market data, sliders, and charts.

- [ ] **Step 4: Commit**

```bash
git add -A && git commit -m "feat: assemble full dashboard page"
```

---

### Task 11: Deploy to Vercel

- [ ] **Step 1: Build check**

```bash
npm run build
```

Should complete without errors.

- [ ] **Step 2: Push to GitHub**

```bash
gh repo create functornetwork/functor-fees --public --source=. --push
```

- [ ] **Step 3: Deploy on Vercel**

```bash
npx vercel --prod
```

Or connect the repo to Vercel dashboard and configure fees.functor.sh domain.

- [ ] **Step 4: Commit any Vercel config**

```bash
git add -A && git commit -m "chore: add Vercel deployment config"
```
