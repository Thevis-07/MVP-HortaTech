"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowLeft, Droplets, Sprout, Wind } from "lucide-react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ComposedChart,
  Bar,
} from "recharts";
import { useFirebaseData } from "@/lib/useFirebaseData";
import { CHART_COLORS, CHART_AXIS_STYLE, HISTORY_PAGE_SIZE } from "@/lib/constants";
import { formatTimestamp } from "@/lib/formatters";
import type { SensorKind } from "@/types/sensors";
import LoadingScreen from "@/components/ui/LoadingScreen";
import ErrorScreen from "@/components/ui/ErrorScreen";

interface Props {
  sensor: SensorKind;
}

const SENSOR_META: Record<SensorKind, { title: string; subtitle: string; icon: React.ReactNode }> = {
  "solo-1": {
    title: "Histórico avançado — Solo Sensor 1",
    subtitle: "Umidade do solo com foco total no Sensor 1",
    icon: <Droplets size={18} className="text-green-700" />,
  },
  "solo-2": {
    title: "Histórico avançado — Solo Sensor 2",
    subtitle: "Umidade do solo com foco total no Sensor 2",
    icon: <Sprout size={18} className="text-green-700" />,
  },
  ar: {
    title: "Histórico avançado — Sensor de Ar",
    subtitle: "Temperatura e umidade em uma visão detalhada",
    icon: <Wind size={18} className="text-green-700" />,
  },
};

export default function SensorHistoryPage({ sensor }: Props) {
  const { sensor1, sensor2, sensorAr, loading, error } = useFirebaseData();
  const [visibleCount, setVisibleCount] = useState(HISTORY_PAGE_SIZE);

  const meta = SENSOR_META[sensor];
  const isAirSensor = sensor === "ar";

  const fullData = useMemo(() => {
    if (sensor === "solo-1") return sensor1.slice().reverse().map((d) => ({ timestamp: d.timestamp, umidade: d.umidade }));
    if (sensor === "solo-2") return sensor2.slice().reverse().map((d) => ({ timestamp: d.timestamp, umidade: d.umidade }));
    return sensorAr.slice().reverse().map((d) => ({ timestamp: d.horario, temperatura: d.temperatura, umidade: d.umidade }));
  }, [sensor, sensor1, sensor2, sensorAr]);

  if (loading) return <LoadingScreen />;
  if (error) return <ErrorScreen message={error} />;

  const visibleRows = fullData.slice(0, visibleCount);
  const chartData = visibleRows
    .slice()
    .reverse()
    .map((r) => ({ ...r, time: formatTimestamp(r.timestamp, true) })) as (typeof visibleRows[number] & { time: string })[];

  const hasMore = visibleCount < fullData.length;

  return (
    <div className="min-h-screen bg-[#dce5dc]">
      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-body font-semibold text-green-700 hover:text-green-900 transition-colors"
          >
            <ArrowLeft size={15} />
            Voltar ao dashboard
          </Link>
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-md mb-6">
          <div className="flex items-center gap-2 mb-1">
            {meta.icon}
            <h1 className="font-display font-semibold text-green-900 text-2xl">{meta.title}</h1>
          </div>
          <p className="text-green-600 text-sm font-body">{meta.subtitle}</p>
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-md mb-6">
          {chartData.length === 0 ? (
            <div className="h-56 flex items-center justify-center text-green-300 font-body">
              Sem dados disponíveis
            </div>
          ) : isAirSensor ? (
            <AirChart data={chartData as unknown as { time: string; temperatura: number; umidade: number }[]} />
          ) : (
            <SoloChart
              data={chartData as unknown as { time: string; umidade: number }[]}
              color={sensor === "solo-1" ? CHART_COLORS.sensor1 : CHART_COLORS.sensor2}
            />
          )}
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl shadow-md overflow-hidden">
          <div className="px-5 py-4 border-b border-green-50">
            <h2 className="font-display font-semibold text-green-900 text-lg">
              Tabela completa do histórico
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-green-50/80">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-body font-medium text-green-600 uppercase tracking-wider">
                    Horário
                  </th>
                  {isAirSensor ? (
                    <>
                      <th className="px-3 py-3 text-right text-xs font-body font-medium text-green-600 uppercase tracking-wider">
                        Temperatura
                      </th>
                      <th className="px-3 py-3 text-right text-xs font-body font-medium text-green-600 uppercase tracking-wider">
                        Umidade
                      </th>
                    </>
                  ) : (
                    <th className="px-3 py-3 text-right text-xs font-body font-medium text-green-600 uppercase tracking-wider">
                      Umidade
                    </th>
                  )}
                </tr>
              </thead>
              <tbody>
                {isAirSensor
                  ? (visibleRows as { timestamp: string; temperatura: number; umidade: number }[]).map((row, idx) => (
                      <tr key={`${row.timestamp}-${idx}`} className="border-t border-green-50 hover:bg-green-50/50 transition-colors">
                        <td className="px-4 py-2.5 text-xs font-mono text-gray-500">
                          {formatTimestamp(row.timestamp)}
                        </td>
                        <td className="px-3 py-2.5 text-right text-sm font-body font-semibold text-amber-600">
                          {row.temperatura.toFixed(1)}
                          <span className="text-xs font-normal text-gray-400 ml-0.5">°C</span>
                        </td>
                        <td className="px-3 py-2.5 text-right text-sm font-body font-semibold text-emerald-600">
                          {row.umidade.toFixed(1)}
                          <span className="text-xs font-normal text-gray-400 ml-0.5">%</span>
                        </td>
                      </tr>
                    ))
                  : (visibleRows as { timestamp: string; umidade: number }[]).map((row, idx) => (
                      <tr key={`${row.timestamp}-${idx}`} className="border-t border-green-50 hover:bg-green-50/50 transition-colors">
                        <td className="px-4 py-2.5 text-xs font-mono text-gray-500">
                          {formatTimestamp(row.timestamp)}
                        </td>
                        <td className="px-3 py-2.5 text-right text-sm font-body font-semibold text-emerald-600">
                          {row.umidade.toFixed(1)}
                          <span className="text-xs font-normal text-gray-400 ml-0.5">%</span>
                        </td>
                      </tr>
                    ))}
              </tbody>
            </table>
          </div>

          <div className="px-4 py-3 border-t border-green-50 bg-green-50/40 flex items-center justify-between gap-3">
            <p className="text-xs font-body text-green-700">
              Exibindo {visibleRows.length} de {fullData.length} registros
            </p>
            {hasMore && (
              <button
                type="button"
                onClick={() => setVisibleCount((n) => n + HISTORY_PAGE_SIZE)}
                className="px-3 py-1.5 rounded-lg bg-green-700 text-white text-xs font-body font-semibold hover:bg-green-800 transition-colors"
              >
                Carregar mais
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function SoloChart({ data, color }: { data: { time: string; umidade: number }[]; color: string }) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data} margin={{ top: 5, right: 12, left: -20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke={CHART_COLORS.grid} />
        <XAxis dataKey="time" tick={CHART_AXIS_STYLE} axisLine={false} tickLine={false} />
        <YAxis tick={CHART_AXIS_STYLE} axisLine={false} tickLine={false} unit="%" domain={[0, 100]} />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="umidade" name="Umidade" stroke={color} strokeWidth={2.5} dot={false} />
      </LineChart>
    </ResponsiveContainer>
  );
}

function AirChart({ data }: { data: { time: string; temperatura: number; umidade: number }[] }) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <ComposedChart data={data} margin={{ top: 5, right: 12, left: -20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke={CHART_COLORS.grid} />
        <XAxis dataKey="time" tick={CHART_AXIS_STYLE} axisLine={false} tickLine={false} />
        <YAxis yAxisId="temp" tick={CHART_AXIS_STYLE} axisLine={false} tickLine={false} unit="°" domain={[0, 50]} />
        <YAxis yAxisId="umid" orientation="right" tick={CHART_AXIS_STYLE} axisLine={false} tickLine={false} unit="%" domain={[0, 100]} />
        <Tooltip />
        <Legend />
        <Bar yAxisId="umid" dataKey="umidade" fill={CHART_COLORS.umidade} opacity={0.4} radius={[3, 3, 0, 0]} />
        <Line yAxisId="temp" type="monotone" dataKey="temperatura" stroke={CHART_COLORS.temperatura} strokeWidth={2.5} dot={false} />
      </ComposedChart>
    </ResponsiveContainer>
  );
}
