"use client";

interface TooltipEntry {
  name: string;
  value: number;
  color: string;
}

interface Props {
  active?: boolean;
  payload?: TooltipEntry[];
  label?: string;
  labelMap?: Record<string, string>;
  unitMap?: Record<string, string>;
}

export default function ChartTooltip({ active, payload, label, labelMap = {}, unitMap = {} }: Props) {
  if (!active || !payload?.length) return null;

  return (
    <div className="bg-white border border-green-100 rounded-xl p-3 shadow-lg text-sm font-body">
      <p className="text-green-800 font-medium mb-1">{label}</p>
      {payload.map((p) => (
        <p key={p.name} style={{ color: p.color }}>
          {labelMap[p.name] ?? p.name}:{" "}
          <strong>
            {p.value?.toFixed(1)}{unitMap[p.name] ?? ""}
          </strong>
        </p>
      ))}
    </div>
  );
}
