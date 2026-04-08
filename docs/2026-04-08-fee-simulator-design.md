# Functor Protocol Fee Simulator - Design Spec

## Overview

Interactive web app at fees.functor.sh where investors adjust market assumptions and see Functor's protocol revenue model update in real time. Dashboard layout: assumptions on the left, live results on the right. Real market data as context at the top.

Deployed on Vercel. Public URL.

## Layout

### Top: Market Context (live data, read-only)

Four metric cards showing real market data:
- Total onchain agents (8004scan.io)
- Monthly transactions (x402.org)
- Monthly volume (x402.org)
- Projects in ecosystem (agentpaymentsstack.com)

Sources cited below the cards.

### Left Panel: Assumptions

**Demand Assumptions (sliders):**
- Capture rate: 1-20%, default 5%
- Agent platforms: 1-50, default 5
- Agents per platform: 10-5,000, default 200
- Transactions per agent per month: 10-10,000, default 500
- Average TVS per agent: $1K-$1M, default $50K

**Fee Structure (inputs):**
- Key registration fee: default $0.50
- Per-transaction policy fee: default $0.03

### Right Panel: Results

**Derived Metrics (cards):**
- Total TVS
- Total agents
- Monthly transactions
- Monthly revenue (highlighted)
- Annual revenue

**12-Month Revenue Projection (line chart):**
- X axis: months 1-12
- Y axis: cumulative or monthly revenue
- Shows growth assuming linear agent onboarding

**Revenue Split (pie chart):**
- PolicyHook fees vs KeyStore fees
- Shows percentage and dollar amounts

**Safe Benchmark:**
- Compare modeled tx volume against Safe's $10M ARR on 326M tx/year
- Reality anchor for the investor

## Data Sources

| Source | Data | Method |
|---|---|---|
| 8004scan.io/networks | Agent count per chain | Fetch on load, cache 1hr |
| agentpaymentsstack.com/data.json | Project count, layer breakdown | Fetch on load, cache 1hr |
| x402.org | 75M tx/mo, $24M vol/mo | Hardcoded with citation (no API) |
| GlobeNewsWire (Safe) | $10M ARR, 326M tx, $600B vol | Hardcoded with citation |

## Math Model

```
Inputs:
  capture_rate        (1-20%, default 5%)
  platforms           (1-50, default 5)
  agents_per_platform (10-5000, default 200)
  tx_per_agent_month  (10-10000, default 500)
  tvs_per_agent       ($1K-$1M, default $50K)
  key_fee             (default $0.50)
  tx_fee              (default $0.03)

Derived:
  total_agents        = platforms * agents_per_platform
  total_tvs           = total_agents * tvs_per_agent
  total_tx_month      = total_agents * tx_per_agent_month
  keystore_rev_month  = total_agents * key_fee (one-time, amortized monthly via churn/growth)
  hook_rev_month      = total_tx_month * tx_fee
  total_rev_month     = keystore_rev_month + hook_rev_month
  total_rev_annual    = total_rev_month * 12
```

12-month projection assumes linear agent onboarding from 0 to total_agents over 12 months, so month 1 has 1/12 of total agents, month 12 has full capacity.

## Brand

- Background: #0a0a14
- Foreground: #f8f8f8
- Muted text: white/70
- Subdued text: white/40-50
- Accent: #90C8FF
- Primary CTA: #1d4ed8 (blue-600)
- Hover: #3b82f6 (blue-500)
- Gradient end / focus: #60a5fa (blue-400)
- Font: Inter Tight
- Logo: functor-white.svg (white version for dark background)

## Tech Stack

- Next.js (React)
- Tailwind CSS (dark theme)
- Recharts for charts
- Deployed on Vercel at fees.functor.sh
- No backend - all computation client-side
- API calls from browser to 8004scan and agentpaymentsstack

## Scope

V1 ships with:
- Dashboard layout with real market data
- Adjustable sliders for all assumptions
- Live-updating derived metrics, line chart, pie chart
- Safe benchmark comparison
- Responsive (works on laptop screens for investor meetings)
- Functor branding (dark theme, Inter Tight, white logo)

V1 does NOT include:
- Scenario presets (conservative/base/bull)
- Downloadable reports
- Multiple fee tier modeling
- Historical data tracking
