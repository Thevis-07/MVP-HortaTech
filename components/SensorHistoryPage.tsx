"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
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
import { ArrowLeft, Droplets, Sprout, Wind } from "lucide-react";
import { useFirebaseData } from "@/lib/useFirebaseData";

type SensorKind = "solo-1" | "solo-2" | "ar";

interface Props {
  sensor: SensorKind;
}

interface SoloHistoryRow {
  timestamp: string;
  umidade: number;
}

interface AirHistoryRow {
  timestamp: string;
  temperatura: number;
  umidade: number;
}

const CHUNK_SIZE = 40;

function formatTimestamp(ts: string): string {
  try {
    if (ts.includes("T")) {
      const d = new Date(ts.replace("T", " "));
      return `${d.getDate().toString().padStart(2, "0")}/${(d.getMonth() + 1)
        .toString()
        .padStart(2, "0")} ${d.getHours().toString().padStart(2, "0")}:${d
        .getMinutes()
        .toString()
        .padStart(2, "0")}`;
    }

    const parts = ts.split(" ");
    const dateParts = parts[0].split("/");
    return `${dateParts[0]}/${dateParts[1]} ${parts[1]?.slice(0, 5) || ""}`;
  } catch {
    return ts.slice(0, 16);
  }
}

function getMeta(sensor: SensorKind) {
  if (sensor === "solo-1") {
    return {
      title: "Historico avancado - Solo Sensor 1",
      subtitle: "Umidade do solo com foco total no Sensor 1",
      icon: <Droplets size={18} className="text-green-700" />,
    };
  }

  if (sensor === "solo-2") {
    return {
      title: "Historico avancado - Solo Sensor 2",
      subtitle: "Umidade do solo com foco total no Sensor 2",
      icon: <Sprout size={18} className="text-green-700" />,
    };
  }

  return {
    title: "Historico avancado - Sensor de Ar",
    subtitle: "Temperatura e umidade em uma visao detalhada",
    icon: <Wind size={18} className="text-green-700" />,
  };
}

export default function SensorHistoryPage({ sensor }: Props) {
  const { sensor1, sensor2, sensorAr, loading, error } = useFirebaseData();
  const [visibleCount, setVisibleCount] = useState(CHUNK_SIZE);
  const isAirSensor = sensor === "ar";

  const meta = getMeta(sensor);

  const fullData = useMemo<(SoloHistoryRow | AirHistoryRow)[]>(() => {
    if (sensor === "solo-1") {
      return sensor1
        .slice()
        .reverse()
        .map((d) => ({
          timestamp: d.timestamp,
          umidade: d.umidade,
        }));
    }

    if (sensor === "solo-2") {
      return sensor2
        .slice()
        .reverse()
        .map((d) => ({
          timestamp: d.timestamp,
          umidade: d.umidade,
        }));
    }

    return sensorAr
      .slice()
      .reverse()
      .map((d) => ({
        timestamp: d.horario,
        temperatura: d.temperatura,
        umidade: d.umidade,
      }));
  }, [sensor, sensor1, sensor2, sensorAr]);

  const visibleRows = fullData.slice(0, visibleCount);
  const visibleSoloRows = visibleRows as SoloHistoryRow[];
  const visibleAirRows = visibleRows as AirHistoryRow[];
  const chartData = visibleRows.slice().reverse().map((r) => ({
    ...r,
    time: formatTimestamp(String(r.timestamp)).slice(-5),
  }));

  const hasMore = visibleRows.length < fullData.length;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8fdf8] text-green-700 font-body">
        Carregando historico...
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8fdf8]">
        <div className="text-center p-8 bg-white rounded-2xl shadow-lg border border-red-100">
          <p className="text-red-500 font-body text-lg mb-2">Erro de conexao</p>
          <p className="text-gray-500 text-sm">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fdf8]">
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

        <div className="bg-white border border-green-50 rounded-2xl p-6 shadow-sm mb-6">
          <div className="flex items-center gap-2 mb-1">
            {meta.icon}
            <h1 className="font-display font-semibold text-green-900 text-2xl">
              {meta.title}
            </h1>
          </div>
          <p className="text-green-600 text-sm font-body">{meta.subtitle}</p>
        </div>

        <div className="bg-white border border-green-50 rounded-2xl p-6 shadow-sm mb-6">
          {chartData.length === 0 ? (
            <div className="h-56 flex items-center justify-center text-green-300 font-body">
              Sem dados disponiveis
            </div>
          ) : isAirSensor ? (
            <ResponsiveContainer width="100%" height={300}>
              <ComposedChart data={chartData} margin={{ top: 5, right: 12, left: -20, bottom: 5 }}>
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
                <Tooltip />
                <Legend />
                <Bar yAxisId="umid" dataKey="umidade" fill="#86d986" opacity={0.4} radius={[3, 3, 0, 0]} />
                <Line
                  yAxisId="temp"
                  type="monotone"
                  dataKey="temperatura"
                  stroke="#f59e0b"
                  strokeWidth={2.5}
                  dot={false}
                />
              </ComposedChart>
            </ResponsiveContainer>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData} margin={{ top: 5, right: 12, left: -20, bottom: 5 }}>
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
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="umidade"
                  name="Umidade"
                  stroke={sensor === "solo-1" ? "#4ebe4e" : "#0891b2"}
                  strokeWidth={2.5}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>

        <div className="bg-white border border-green-50 rounded-2xl shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-green-50">
            <h2 className="font-display font-semibold text-green-900 text-lg">Tabela completa do historico</h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-green-50/80">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-body font-medium text-green-600 uppercase tracking-wider">
                    Horario
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
                  ? visibleAirRows.map((row, idx) => (
                      <tr
                        key={`${row.timestamp}-${idx}`}
                        className="border-t border-green-50 hover:bg-green-50/50 transition-colors"
                      >
                        <td className="px-4 py-2.5 text-xs font-mono text-gray-500">
                          {formatTimestamp(String(row.timestamp))}
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
                  : visibleSoloRows.map((row, idx) => (
                      <tr
                        key={`${row.timestamp}-${idx}`}
                        className="border-t border-green-50 hover:bg-green-50/50 transition-colors"
                      >
                        <td className="px-4 py-2.5 text-xs font-mono text-gray-500">
                          {formatTimestamp(String(row.timestamp))}
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

            {hasMore ? (
              <button
                type="button"
                onClick={() => setVisibleCount((prev) => prev + CHUNK_SIZE)}
                className="px-3 py-1.5 rounded-lg bg-green-700 text-white text-xs font-body font-semibold hover:bg-green-800 transition-colors"
              >
                Carregar mais embaixo
              </button>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
