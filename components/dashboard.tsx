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
    <div className="grid grid-cols-1 md:grid-cols-[380px_1fr] gap-6">
      <div className="md:sticky md:top-8 md:self-start">
        <AssumptionsPanel inputs={inputs} onChange={setInputs} />
      </div>
      <ResultsPanel results={results} />
    </div>
  );
}
