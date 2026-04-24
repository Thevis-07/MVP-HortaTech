"use client";

import {
  ComposedChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { ArTemperaturaUmidadeEntry } from "@/lib/useFirebaseData";

interface Props {
  data: ArTemperaturaUmidadeEntry[];
}

function formatHorario(h: string): string {
  // Format: "23/04/2026 20:41:05"
  try {
    const parts = h.split(" ");
    return parts[1]?.slice(0, 5) || h;
  } catch {
    return h;
  }
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-green-100 rounded-xl p-3 shadow-lg text-sm font-body">
        <p className="text-green-800 font-medium mb-1">{label}</p>
        {payload.map((p: any) => (
          <p key={p.name} style={{ color: p.color }}>
            {p.name === "temperatura" ? "Temperatura" : "Umidade"}:{" "}
            <strong>
              {p.value?.toFixed(1)}
              {p.name === "temperatura" ? "°C" : "%"}
            </strong>
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export default function ArChart({ data }: Props) {
  const chartData = data.slice(-20).map((d) => ({
    time: formatHorario(d.horario),
    temperatura: d.temperatura,
    umidade: d.umidade,
  }));

  return (
    <div className="bg-white border border-green-50 rounded-2xl p-6 shadow-sm">
      <div className="mb-4">
        <h2 className="font-display font-semibold text-green-900 text-xl">
          Temperatura & Umidade do Ar
        </h2>
        <p className="text-green-500 text-sm font-body">
          Sensor de ambiente da estufa
        </p>
      </div>

      {chartData.length === 0 ? (
        <div className="h-48 flex items-center justify-center text-green-300 font-body">
          Sem dados disponíveis
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={240}>
          <ComposedChart
            data={chartData}
            margin={{ top: 5, right: 10, left: -20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e8f5e8" />
            <XAxis
              dataKey="time"
              tick={{ fontSize: 11, fill: "#6b7280", fontFamily: "DM Sans" }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              yAxisId="temp"
              tick={{ fontSize: 11, fill: "#6b7280", fontFamily: "DM Sans" }}
              axisLine={false}
              tickLine={false}
              unit="°"
              domain={[0, 50]}
            />
            <YAxis
              yAxisId="umid"
              orientation="right"
              tick={{ fontSize: 11, fill: "#6b7280", fontFamily: "DM Sans" }}
              axisLine={false}
              tickLine={false}
              unit="%"
              domain={[0, 100]}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              formatter={(v) =>
                v === "temperatura" ? "Temperatura (°C)" : "Umidade (%)"
              }
              wrapperStyle={{ fontSize: "12px", fontFamily: "DM Sans" }}
            />
            <Bar
              yAxisId="umid"
              dataKey="umidade"
              fill="#86d986"
              opacity={0.4}
              radius={[3, 3, 0, 0]}
            />
            <Line
              yAxisId="temp"
              type="monotone"
              dataKey="temperatura"
              stroke="#f59e0b"
              strokeWidth={2.5}
              dot={{ fill: "#f59e0b", r: 3 }}
              activeDot={{ r: 5 }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
