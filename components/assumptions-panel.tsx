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
        <Slider label="Capture rate" value={inputs.captureRate} {...SLIDER_RANGES.captureRate} onChange={(v) => update("captureRate", v)} format={(v) => `${v}%`} />
        <Slider label="Agent platforms" value={inputs.platforms} {...SLIDER_RANGES.platforms} onChange={(v) => update("platforms", v)} />
        <Slider label="Agents per platform" value={inputs.agentsPerPlatform} {...SLIDER_RANGES.agentsPerPlatform} onChange={(v) => update("agentsPerPlatform", v)} />
        <Slider label="Tx per agent / month" value={inputs.txPerAgentMonth} {...SLIDER_RANGES.txPerAgentMonth} onChange={(v) => update("txPerAgentMonth", v)} />
        <Slider label="Avg TVS per agent" value={inputs.tvsPerAgent} {...SLIDER_RANGES.tvsPerAgent} onChange={(v) => update("tvsPerAgent", v)} format={formatUsd} />
      </div>
      <div>
        <h3 className="text-xs font-semibold uppercase tracking-wider text-brand-blue-400 mb-4">
          Fee Structure
        </h3>
        <Slider label="Key registration fee" value={inputs.keyFee} {...SLIDER_RANGES.keyFee} onChange={(v) => update("keyFee", v)} format={(v) => `$${v.toFixed(2)}`} />
        <Slider label="Per-tx policy fee" value={inputs.txFee} {...SLIDER_RANGES.txFee} onChange={(v) => update("txFee", v)} format={(v) => `$${v.toFixed(3)}`} />
      </div>
    </div>
  );
}
