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
        <span className="text-base text-subdued">{label}</span>
        <span className="text-base font-semibold text-fg">{display}</span>
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
