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
