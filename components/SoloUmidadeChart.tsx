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
import { SoloUmidadeEntry } from "@/lib/useFirebaseData";

interface Props {
  sensor1: SoloUmidadeEntry[];
  sensor2: SoloUmidadeEntry[];
}

function formatTimestamp(ts: string): string {
  // ISO timestamp like 2026-04-23T14:30:00
  try {
    const d = new Date(ts.replace("T", " "));
    return `${d.getHours().toString().padStart(2, "0")}:${d.getMinutes().toString().padStart(2, "0")}`;
  } catch {
    return ts.slice(-5);
  }
}

function mergeData(
  s1: SoloUmidadeEntry[],
  s2: SoloUmidadeEntry[]
): { time: string; sensor1?: number; sensor2?: number }[] {
  const map = new Map<string, { sensor1?: number; sensor2?: number }>();

  s1.forEach((d) => {
    const key = formatTimestamp(d.timestamp);
    map.set(key, { ...map.get(key), sensor1: d.umidade });
  });
  s2.forEach((d) => {
    const key = formatTimestamp(d.timestamp);
    map.set(key, { ...map.get(key), sensor2: d.umidade });
  });

  return Array.from(map.entries())
    .map(([time, vals]) => ({ time, ...vals }))
    .slice(-24); // Last 24 points
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-green-100 rounded-xl p-3 shadow-lg text-sm font-body">
        <p className="text-green-800 font-medium mb-1">{label}</p>
        {payload.map((p: any) => (
          <p key={p.name} style={{ color: p.color }}>
            {p.name === "sensor1" ? "Sensor 1" : "Sensor 2"}:{" "}
            <strong>{p.value?.toFixed(1)}%</strong>
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export default function SoloUmidadeChart({ sensor1, sensor2 }: Props) {
  const merged = mergeData(sensor1, sensor2);

  return (
    <div className="bg-white border border-green-50 rounded-2xl p-6 shadow-sm">
      <div className="mb-4">
        <h2 className="font-display font-semibold text-green-900 text-xl">
          Umidade do Solo
        </h2>
        <p className="text-green-500 text-sm font-body">
          Comparativo Sensor 1 & 2
        </p>
      </div>

      {merged.length === 0 ? (
        <div className="h-48 flex items-center justify-center text-green-300 font-body">
          Sem dados disponíveis
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={240}>
          <LineChart data={merged} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e8f5e8" />
            <XAxis
              dataKey="time"
              tick={{ fontSize: 11, fill: "#6b7280", fontFamily: "DM Sans" }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 11, fill: "#6b7280", fontFamily: "DM Sans" }}
              axisLine={false}
              tickLine={false}
              unit="%"
              domain={[0, 100]}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              formatter={(v) => (v === "sensor1" ? "Sensor 1" : "Sensor 2")}
              wrapperStyle={{ fontSize: "12px", fontFamily: "DM Sans" }}
            />
            <Line
              type="monotone"
              dataKey="sensor1"
              stroke="#4ebe4e"
              strokeWidth={2.5}
              dot={{ fill: "#4ebe4e", r: 3 }}
              activeDot={{ r: 5 }}
              connectNulls={false}
            />
            <Line
              type="monotone"
              dataKey="sensor2"
              stroke="#0891b2"
              strokeWidth={2.5}
              dot={{ fill: "#0891b2", r: 3 }}
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
