"use client";

import { TrendingUp, TrendingDown, Minus } from "lucide-react";

interface Props {
  label: string;
  value: number;
  unit: string;
  avg: number;
  count: number;
  icon: React.ReactNode;
  color: "emerald" | "green" | "teal" | "cyan";
  description: string;
}

const colorMap = {
  emerald: {
    border: "border-emerald-200",
    icon: "bg-emerald-100 text-emerald-700",
    value: "text-emerald-700",
    badge: "bg-emerald-100 text-emerald-700 font-medium",
    bar: "bg-emerald-500",
    barBg: "bg-emerald-100",
  },
  green: {
    border: "border-green-200",
    icon: "bg-green-100 text-green-700",
    value: "text-green-700",
    badge: "bg-green-100 text-green-700 font-medium",
    bar: "bg-green-500",
    barBg: "bg-green-100",
  },
  teal: {
    border: "border-teal-200",
    icon: "bg-teal-100 text-teal-700",
    value: "text-teal-700",
    badge: "bg-teal-100 text-teal-700 font-medium",
    bar: "bg-teal-500",
    barBg: "bg-teal-100",
  },
  cyan: {
    border: "border-cyan-200",
    icon: "bg-cyan-100 text-cyan-700",
    value: "text-cyan-700",
    badge: "bg-cyan-100 text-cyan-700 font-medium",
    bar: "bg-cyan-500",
    barBg: "bg-cyan-100",
  },
};

function getBarWidth(value: number, unit: string): number {
  if (unit === "°C") return Math.min((value / 50) * 100, 100);
  return Math.min(value, 100);
}

export default function StatCard({ label, value, unit, avg, count, icon, color, description }: Props) {
  const c = colorMap[color];
  const diff = value - avg;
  const barW = getBarWidth(value, unit);

  return (
    <div className={`bg-white border ${c.border} rounded-2xl p-5 shadow-md hover:shadow-lg transition-shadow animate-slide-up`}>
      <div className="flex items-start justify-between mb-4">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${c.icon}`}>
          {icon}
        </div>
        <span className={`text-xs font-body px-2 py-1 rounded-full ${c.badge}`}>
          {count} leituras
        </span>
      </div>

      <p className="text-xs text-gray-500 font-body uppercase tracking-wider mb-1">{description}</p>
      <p className="text-sm text-gray-600 font-body mb-2">{label}</p>

      <div className={`text-4xl font-display font-bold ${c.value} mb-1`}>
        {value.toFixed(1)}
        <span className="text-lg font-body font-normal text-gray-400 ml-1">{unit}</span>
      </div>

      <div className="flex items-center gap-1 mb-4">
        {Math.abs(diff) < 0.5 ? (
          <Minus size={12} className="text-gray-400" />
        ) : diff > 0 ? (
          <TrendingUp size={12} className="text-green-500" />
        ) : (
          <TrendingDown size={12} className="text-amber-500" />
        )}
        <span className="text-xs text-gray-400 font-body">
          Média: {avg.toFixed(1)}{unit}
        </span>
      </div>

      <div className={`w-full h-1.5 rounded-full ${c.barBg}`}>
        <div
          className={`h-full rounded-full ${c.bar} transition-all duration-700`}
          style={{ width: `${barW}%` }}
        />
      </div>
    </div>
  );
}
