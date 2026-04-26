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
import type { ArTemperaturaUmidadeEntry } from "@/types/sensors";
import { CHART_COLORS, CHART_AXIS_STYLE, AR_CHART_POINTS } from "@/lib/constants";
import { formatTimestamp } from "@/lib/formatters";
import ChartTooltip from "./ChartTooltip";

interface Props {
  data: ArTemperaturaUmidadeEntry[];
}

const LABEL_MAP = { temperatura: "Temperatura", umidade: "Umidade" };
const UNIT_MAP = { temperatura: "°C", umidade: "%" };

export default function ArChart({ data }: Props) {
  const chartData = data.slice(-AR_CHART_POINTS).map((d) => ({
    time: formatTimestamp(d.horario, true),
    temperatura: d.temperatura,
    umidade: d.umidade,
  }));

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-md">
      <div className="mb-4">
        <h2 className="font-display font-semibold text-green-900 text-xl">
          Temperatura & Umidade do Ar
        </h2>
        <p className="text-green-500 text-sm font-body">Sensor de ambiente da estufa</p>
      </div>

      {chartData.length === 0 ? (
        <div className="h-48 flex items-center justify-center text-green-300 font-body">
          Sem dados disponíveis
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={240}>
          <ComposedChart data={chartData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={CHART_COLORS.grid} />
            <XAxis dataKey="time" tick={CHART_AXIS_STYLE} axisLine={false} tickLine={false} />
            <YAxis
              yAxisId="temp"
              tick={CHART_AXIS_STYLE}
              axisLine={false}
              tickLine={false}
              unit="°"
              domain={[0, 50]}
            />
            <YAxis
              yAxisId="umid"
              orientation="right"
              tick={CHART_AXIS_STYLE}
              axisLine={false}
              tickLine={false}
              unit="%"
              domain={[0, 100]}
            />
            <Tooltip content={<ChartTooltip labelMap={LABEL_MAP} unitMap={UNIT_MAP} />} />
            <Legend
              formatter={(v) => LABEL_MAP[v as keyof typeof LABEL_MAP] ?? v}
              wrapperStyle={{ fontSize: "12px", fontFamily: "DM Sans" }}
            />
            <Bar
              yAxisId="umid"
              dataKey="umidade"
              fill={CHART_COLORS.umidade}
              opacity={0.4}
              radius={[3, 3, 0, 0]}
            />
            <Line
              yAxisId="temp"
              type="monotone"
              dataKey="temperatura"
              stroke={CHART_COLORS.temperatura}
              strokeWidth={2.5}
              dot={{ fill: CHART_COLORS.temperatura, r: 3 }}
              activeDot={{ r: 5 }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
