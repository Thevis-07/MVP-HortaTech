"use client";

import { TrendingUp, TrendingDown, Minus } from "lucide-react";

interface StatCardProps {
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
    bg: "from-emerald-50 to-white",
    border: "border-emerald-100",
    icon: "bg-emerald-100 text-emerald-600",
    value: "text-emerald-800",
    badge: "bg-emerald-50 text-emerald-600",
    bar: "bg-emerald-400",
    barBg: "bg-emerald-100",
  },
  green: {
    bg: "from-green-50 to-white",
    border: "border-green-100",
    icon: "bg-green-100 text-green-600",
    value: "text-green-800",
    badge: "bg-green-50 text-green-600",
    bar: "bg-green-400",
    barBg: "bg-green-100",
  },
  teal: {
    bg: "from-teal-50 to-white",
    border: "border-teal-100",
    icon: "bg-teal-100 text-teal-600",
    value: "text-teal-800",
    badge: "bg-teal-50 text-teal-600",
    bar: "bg-teal-400",
    barBg: "bg-teal-100",
  },
  cyan: {
    bg: "from-cyan-50 to-white",
    border: "border-cyan-100",
    icon: "bg-cyan-100 text-cyan-600",
    value: "text-cyan-800",
    badge: "bg-cyan-50 text-cyan-600",
    bar: "bg-cyan-400",
    barBg: "bg-cyan-100",
  },
};

function getBarWidth(value: number, unit: string): number {
  if (unit === "°C") return Math.min((value / 50) * 100, 100);
  return Math.min(value, 100);
}

export default function StatCard({
  label,
  value,
  unit,
  avg,
  count,
  icon,
  color,
  description,
}: StatCardProps) {
  const c = colorMap[color];
  const diff = value - avg;
  const barW = getBarWidth(value, unit);

  return (
    <div
      className={`bg-gradient-to-b ${c.bg} border ${c.border} rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow animate-slide-up`}
    >
      <div className="flex items-start justify-between mb-4">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${c.icon}`}>
          {icon}
        </div>
        <span className={`text-xs font-body px-2 py-1 rounded-full ${c.badge}`}>
          {count} leituras
        </span>
      </div>

      <p className="text-xs text-gray-500 font-body uppercase tracking-wider mb-1">
        {description}
      </p>
      <p className="text-sm text-gray-600 font-body mb-2">{label}</p>

      <div className={`text-4xl font-display font-bold ${c.value} mb-1`}>
        {value.toFixed(1)}
        <span className="text-lg font-body font-normal text-gray-400 ml-1">
          {unit}
        </span>
      </div>

      {/* Trend */}
      <div className="flex items-center gap-1 mb-4">
        {Math.abs(diff) < 0.5 ? (
          <Minus size={12} className="text-gray-400" />
        ) : diff > 0 ? (
          <TrendingUp size={12} className="text-green-500" />
        ) : (
          <TrendingDown size={12} className="text-amber-500" />
        )}
        <span className="text-xs text-gray-400 font-body">
          Média: {avg.toFixed(1)}
          {unit}
        </span>
      </div>

      {/* Mini bar */}
      <div className={`w-full h-1.5 rounded-full ${c.barBg}`}>
        <div
          className={`h-full rounded-full ${c.bar} transition-all duration-700`}
          style={{ width: `${barW}%` }}
        />
      </div>
    </div>
  );
}
