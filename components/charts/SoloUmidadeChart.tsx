"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import type { SoloUmidadeEntry } from "@/types/sensors";
import { CHART_COLORS, CHART_AXIS_STYLE, DASHBOARD_CHART_POINTS } from "@/lib/constants";
import { formatTimestamp } from "@/lib/formatters";
import ChartTooltip from "./ChartTooltip";

interface Props {
  sensor1: SoloUmidadeEntry[];
  sensor2: SoloUmidadeEntry[];
}

function mergeData(s1: SoloUmidadeEntry[], s2: SoloUmidadeEntry[]) {
  const map = new Map<string, { sensor1?: number; sensor2?: number }>();

  s1.forEach((d) => {
    const key = formatTimestamp(d.timestamp, true);
    map.set(key, { ...map.get(key), sensor1: d.umidade });
  });
  s2.forEach((d) => {
    const key = formatTimestamp(d.timestamp, true);
    map.set(key, { ...map.get(key), sensor2: d.umidade });
  });

  return Array.from(map.entries())
    .map(([time, vals]) => ({ time, ...vals }))
    .slice(-DASHBOARD_CHART_POINTS);
}

const LABEL_MAP = { sensor1: "Sensor 1", sensor2: "Sensor 2" };
const UNIT_MAP = { sensor1: "%", sensor2: "%" };

export default function SoloUmidadeChart({ sensor1, sensor2 }: Props) {
  const merged = mergeData(sensor1, sensor2);

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-md">
      <div className="mb-4">
        <h2 className="font-display font-semibold text-green-900 text-xl">Umidade do Solo</h2>
        <p className="text-green-500 text-sm font-body">Comparativo Sensor 1 & 2</p>
      </div>

      {merged.length === 0 ? (
        <div className="h-48 flex items-center justify-center text-green-300 font-body">
          Sem dados disponíveis
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={240}>
          <LineChart data={merged} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={CHART_COLORS.grid} />
            <XAxis dataKey="time" tick={CHART_AXIS_STYLE} axisLine={false} tickLine={false} />
            <YAxis tick={CHART_AXIS_STYLE} axisLine={false} tickLine={false} unit="%" domain={[0, 100]} />
            <Tooltip content={<ChartTooltip labelMap={LABEL_MAP} unitMap={UNIT_MAP} />} />
            <Legend
              formatter={(v) => LABEL_MAP[v as keyof typeof LABEL_MAP] ?? v}
              wrapperStyle={{ fontSize: "12px", fontFamily: "DM Sans" }}
            />
            <Line
              type="monotone"
              dataKey="sensor1"
              stroke={CHART_COLORS.sensor1}
              strokeWidth={2.5}
              dot={{ fill: CHART_COLORS.sensor1, r: 3 }}
              activeDot={{ r: 5 }}
              connectNulls={false}
            />
            <Line
              type="monotone"
              dataKey="sensor2"
              stroke={CHART_COLORS.sensor2}
              strokeWidth={2.5}
              dot={{ fill: CHART_COLORS.sensor2, r: 3 }}
              activeDot={{ r: 5 }}
              connectNulls={false}
              strokeDasharray="5 3"
            />
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
