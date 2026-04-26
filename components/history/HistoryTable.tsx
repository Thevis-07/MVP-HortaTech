"use client";

import Link from "next/link";
import { formatTimestamp } from "@/lib/formatters";

interface ValueEntry {
  label: string;
  value: number;
  unit: string;
}

interface HistoryRow {
  timestamp: string;
  values: ValueEntry[];
}

interface Props {
  title: string;
  data: HistoryRow[];
  icon: React.ReactNode;
  detailHref?: string;
}

function getValueColor(value: number, unit: string): string {
  if (unit !== "%") return "text-amber-600";
  if (value < 30) return "text-red-500";
  if (value < 50) return "text-amber-500";
  if (value < 75) return "text-green-500";
  return "text-blue-500";
}

export default function HistoryTable({ title, data, icon, detailHref }: Props) {
  return (
    <div className="bg-white border border-gray-200 rounded-2xl shadow-md overflow-hidden">
      <div className="px-5 py-4 border-b border-green-50">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="text-green-600">{icon}</span>
            <h3 className="font-display font-semibold text-green-900 text-base">{title}</h3>
          </div>
          {detailHref && (
            <Link
              href={detailHref}
              className="text-[11px] font-body font-medium text-green-700/85 hover:text-green-900 transition-colors"
            >
              Ver completo
            </Link>
          )}
        </div>
      </div>

      <div className="overflow-y-auto max-h-72">
        {data.length === 0 ? (
          <div className="p-6 text-center text-green-300 font-body text-sm">Sem dados</div>
        ) : (
          <table className="w-full">
            <thead className="sticky top-0 bg-green-50/80 backdrop-blur-sm">
              <tr>
                <th className="px-4 py-2 text-left text-xs font-body font-medium text-green-600 uppercase tracking-wider">
                  Horário
                </th>
                {data[0].values.map((v) => (
                  <th
                    key={v.label}
                    className="px-3 py-2 text-right text-xs font-body font-medium text-green-600 uppercase tracking-wider"
                  >
                    {v.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.map((row, i) => (
                <tr key={i} className="border-t border-green-50 hover:bg-green-50/50 transition-colors">
                  <td className="px-4 py-2.5 text-xs font-mono text-gray-500">
                    {formatTimestamp(row.timestamp)}
                  </td>
                  {row.values.map((v) => (
                    <td
                      key={v.label}
                      className={`px-3 py-2.5 text-right text-sm font-body font-semibold ${getValueColor(v.value, v.unit)}`}
                    >
                      {v.value.toFixed(1)}
                      <span className="text-xs font-normal text-gray-400 ml-0.5">{v.unit}</span>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div className="px-4 py-2 border-t border-green-50 bg-green-50/40 text-xs font-body text-green-700">
        Exibindo {data.length} registros
      </div>
    </div>
  );
}
