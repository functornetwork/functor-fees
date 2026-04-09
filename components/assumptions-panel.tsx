"use client";

import { Slider } from "./slider";
import { ModelInputs } from "@/lib/model";
import { SLIDER_RANGES } from "@/lib/constants";

interface AssumptionsPanelProps {
  inputs: ModelInputs;
  onChange: (inputs: ModelInputs) => void;
  marketAgents: number;
  marketTxPerMonth: number;
}

export function AssumptionsPanel({ inputs, onChange, marketAgents, marketTxPerMonth }: AssumptionsPanelProps) {
  const update = (key: keyof ModelInputs, value: number) => {
    onChange({ ...inputs, [key]: value });
  };

  const functorAccounts = Math.round(marketAgents * (inputs.marketPenetration / 100));
  const txPerAgent = marketAgents > 0 ? Math.round(marketTxPerMonth / marketAgents) : 500;
  const totalTx = functorAccounts * txPerAgent;
  const checkedTx = Math.round(totalTx * (inputs.policyCheckRate / 100));

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-semibold uppercase tracking-wider text-brand-blue-400 mb-2">
          Market Penetration
        </h3>
        <p className="text-sm text-subdued mb-4">
          {marketAgents.toLocaleString()} agents onchain today. At {inputs.marketPenetration}%, Functor protects{" "}
          <span className="text-fg font-semibold">{functorAccounts.toLocaleString()}</span> accounts
          doing <span className="text-fg font-semibold">{totalTx.toLocaleString()}</span> tx/month.
        </p>
        <Slider
          label="Market penetration"
          value={inputs.marketPenetration}
          {...SLIDER_RANGES.marketPenetration}
          onChange={(v) => update("marketPenetration", v)}
          format={(v) => `${v}%`}
        />
      </div>

      <div>
        <h3 className="text-sm font-semibold uppercase tracking-wider text-brand-blue-400 mb-2">
          Policy-Checked Transactions
        </h3>
        <p className="text-sm text-subdued mb-4">
          Of those {totalTx.toLocaleString()} tx/month, {inputs.policyCheckRate}% run through Functor&apos;s policy hook.
          That&apos;s <span className="text-fg font-semibold">{checkedTx.toLocaleString()}</span> policy checks/month.
        </p>
        <Slider
          label="Transactions checked by policy"
          value={inputs.policyCheckRate}
          {...SLIDER_RANGES.policyCheckRate}
          onChange={(v) => update("policyCheckRate", v)}
          format={(v) => `${v}%`}
        />
      </div>

      <div>
        <h3 className="text-sm font-semibold uppercase tracking-wider text-brand-blue-400 mb-2">
          Fee Structure
        </h3>
        <Slider
          label="Fee per policy check"
          value={inputs.feePerPolicyCheck}
          {...SLIDER_RANGES.feePerPolicyCheck}
          onChange={(v) => update("feePerPolicyCheck", v)}
          format={(v) => `$${v.toFixed(3)}`}
        />
        <Slider
          label="Key registration fee"
          value={inputs.feePerKeyRegistration}
          {...SLIDER_RANGES.feePerKeyRegistration}
          onChange={(v) => update("feePerKeyRegistration", v)}
          format={(v) => `$${v.toFixed(2)}`}
        />
        <Slider
          label="Keys per account"
          value={inputs.keysPerAccount}
          {...SLIDER_RANGES.keysPerAccount}
          onChange={(v) => update("keysPerAccount", v)}
        />
      </div>
    </div>
  );
}
