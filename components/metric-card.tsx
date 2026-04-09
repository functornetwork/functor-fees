interface MetricCardProps {
  label: string;
  value: string;
  source?: string;
  sourceUrl?: string;
  highlight?: boolean;
}

export function MetricCard({ label, value, source, sourceUrl, highlight }: MetricCardProps) {
  return (
    <div className="bg-white/5 rounded-lg p-4 border border-white/10">
      <div className={`text-2xl font-bold ${highlight ? "text-brand-blue-400" : "text-fg"}`}>
        {value}
      </div>
      <div className="text-sm text-subdued mt-1">{label}</div>
      {source && (
        <div className="text-xs text-white/40 mt-1">
          {sourceUrl ? (
            <a href={sourceUrl} target="_blank" rel="noopener noreferrer" className="hover:text-white/60 underline">
              {source}
            </a>
          ) : (
            source
          )}
        </div>
      )}
    </div>
  );
}
