"use client";

import { useState } from "react";
import { Droplets, Thermometer, Wind, Radio, ArrowRight } from "lucide-react";

type Status = "ok" | "warning" | "critical";
type BedId = "A" | "B" | "C" | "D";
type RowId = "A" | "B";

interface SoilSensor {
  id: string;
  bed: BedId;
  row: RowId;
  position: 1 | 2 | 3;
  moisture: number;
  soilTemp: number;
  mStatus: Status;
  tStatus: Status;
}

const SEED: Record<string, [number, number]> = {
  "A-A-1": [67.5, 22.3], "A-B-1": [54.2, 20.8],
  "A-A-2": [71.0, 21.5], "A-B-2": [38.0, 23.1],
  "A-A-3": [82.0, 19.7], "A-B-3": [45.0, 24.2],
  "B-A-1": [62.0, 21.0], "B-B-1": [55.5, 22.5],
  "B-A-2": [25.0, 20.0], "B-B-2": [70.0, 23.5],
  "B-A-3": [74.0, 18.5], "B-B-3": [77.0, 21.8],
  "C-A-1": [58.0, 22.0], "C-B-1": [64.5, 21.3],
  "C-A-2": [72.0, 31.5], "C-B-2": [50.0, 24.0],
  "C-A-3": [68.0, 19.8], "C-B-3": [42.0, 22.7],
  "D-A-1": [60.0, 21.5], "D-B-1": [73.0, 20.3],
  "D-A-2": [55.0, 23.0], "D-B-2": [66.0, 21.8],
  "D-A-3": [88.0, 25.0], "D-B-3": [48.0, 22.2],
};

const AIR_DATA = { temperature: 23.4, humidity: 68 };

function mStat(v: number): Status {
  if (v < 30 || v > 85) return "critical";
  if (v < 45 || v > 80) return "warning";
  return "ok";
}
function tStat(v: number): Status {
  if (v < 12 || v > 34) return "critical";
  if (v < 16 || v > 30) return "warning";
  return "ok";
}

const BEDS: BedId[] = ["A", "B", "C", "D"];
const ROWS: RowId[] = ["A", "B"];

const SENSORS: SoilSensor[] = BEDS.flatMap((bed) =>
  ROWS.flatMap((row) =>
    ([1, 2, 3] as const).map((position) => {
      const id = `${bed}-${row}-${position}`;
      const [moisture, soilTemp] = SEED[id] ?? [60, 22];
      return { id, bed, row, position, moisture, soilTemp, mStatus: mStat(moisture), tStatus: tStat(soilTemp) };
    })
  )
);

const DOT_CLS: Record<Status, string> = {
  ok: "bg-emerald-400",
  warning: "bg-amber-400",
  critical: "bg-red-500",
};
const TEXT_CLS: Record<Status, string> = {
  ok: "text-emerald-700",
  warning: "text-amber-700",
  critical: "text-red-700",
};
const BADGE_CLS: Record<Status, string> = {
  ok: "bg-emerald-100 text-emerald-700",
  warning: "bg-amber-100 text-amber-700",
  critical: "bg-red-100 text-red-700",
};
const STATUS_LABEL: Record<Status, string> = {
  ok: "Normal",
  warning: "Atenção",
  critical: "Crítico",
};

type Hovered = SoilSensor | "air" | null;

function overallStatus(s: SoilSensor): Status {
  if (s.mStatus === "critical" || s.tStatus === "critical") return "critical";
  if (s.mStatus === "warning" || s.tStatus === "warning") return "warning";
  return "ok";
}

export default function HortaMap() {
  const [hovered, setHovered] = useState<Hovered>(null);

  const byPos = (bed: BedId, row: RowId, pos: 1 | 2 | 3) =>
    SENSORS.find((s) => s.bed === bed && s.row === row && s.position === pos)!;

  const counts = SENSORS.reduce(
    (acc, s) => { acc[overallStatus(s)]++; return acc; },
    { ok: 0, warning: 0, critical: 0 }
  );

  const isHovered = (s: SoilSensor) =>
    hovered !== null && hovered !== "air" && (hovered as SoilSensor).id === s.id;

  return (
    <div className="bg-white border border-green-100 rounded-2xl shadow-md p-6 animate-slide-up">

      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-6">
        <div>
          <div className="flex items-center gap-2 mb-0.5">
            <div className="w-7 h-7 bg-leaf-100 rounded-lg flex items-center justify-center">
              <Radio size={14} className="text-leaf-600" />
            </div>
            <h2 className="text-lg font-display font-bold text-gray-800">Mapa da Estufa</h2>
          </div>
          <p className="text-xs text-gray-400 font-body ml-9">Visão superior · dados simulados</p>
        </div>
        <div className="flex flex-wrap gap-x-5 gap-y-1.5 ml-9 sm:ml-0">
          {[
            { color: "bg-emerald-400", label: `${counts.ok} normais` },
            { color: "bg-amber-400",   label: `${counts.warning} atenção` },
            { color: "bg-red-500",     label: `${counts.critical} críticos` },
          ].map(({ color, label }) => (
            <div key={label} className="flex items-center gap-1.5 text-xs font-body text-gray-500">
              <span className={`w-2.5 h-2.5 rounded-full ${color}`} />
              {label}
            </div>
          ))}
        </div>
      </div>

      {/* ── Greenhouse ── */}
      <div className="flex items-center gap-3 sm:gap-5">

        {/* Entrada */}
        <div className="flex flex-col items-center gap-1.5 shrink-0 w-12 sm:w-16">
          <div className="w-8 h-8 rounded-full bg-leaf-100 flex items-center justify-center">
            <ArrowRight size={16} className="text-leaf-600" />
          </div>
          <p className="text-[8px] sm:text-[9px] font-display font-bold text-soil-600 uppercase text-center leading-tight tracking-wide">
            Entrada<br />Principal
          </p>
        </div>

        {/* Greenhouse box */}
        <div className="flex-1 bg-soil-100 border-2 border-soil-300 rounded-xl p-3 sm:p-4">
          <p className="text-center text-[9px] font-display font-bold text-soil-500 uppercase tracking-[0.25em] mb-3">
            Estufa
          </p>

          {/* Air sensor row */}
          <div className="grid grid-cols-4 gap-2 sm:gap-3 mb-1">
            {BEDS.map((bed) => (
              <div key={bed} className="flex justify-center h-8 items-center">
                {bed === "B" && (
                  <button
                    type="button"
                    className={`
                      w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center
                      border-2 border-white shadow-lg cursor-pointer
                      transition-all duration-150 hover:scale-110
                      ${hovered === "air" ? "ring-2 ring-blue-300 ring-offset-1" : ""}
                    `}
                    onMouseEnter={() => setHovered("air")}
                    onMouseLeave={() => setHovered(null)}
                  >
                    <Wind size={14} className="text-white" />
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* Bed labels */}
          <div className="grid grid-cols-4 gap-2 sm:gap-3 mb-1.5">
            {BEDS.map((bed) => (
              <p key={bed} className="text-center text-xs font-display font-bold text-soil-600 tracking-wide">
                {bed}
              </p>
            ))}
          </div>

          {/* Beds */}
          <div className="grid grid-cols-4 gap-2 sm:gap-3">
            {BEDS.map((bed) => (
              <div key={bed} className="bg-soil-300 border border-soil-400/70 rounded-xl shadow-inner p-2">
                {/* Column headers */}
                <div className="grid grid-cols-2 gap-0.5 pb-1.5 mb-1.5 border-b border-soil-500/30">
                  {ROWS.map((row) => (
                    <p key={row} className="text-center text-[8px] font-display font-bold text-soil-700 uppercase">
                      {row}
                    </p>
                  ))}
                </div>

                {/* Sensor positions */}
                <div className="flex flex-col gap-2 sm:gap-3 py-0.5">
                  {([1, 2, 3] as const).map((pos) => (
                    <div key={pos} className="grid grid-cols-2 gap-0.5">
                      {ROWS.map((row) => {
                        const s = byPos(bed, row, pos);
                        return (
                          <div
                            key={row}
                            className={`
                              flex justify-center items-center gap-0.5 sm:gap-1 py-1 rounded-lg cursor-pointer
                              transition-all duration-150
                              ${isHovered(s) ? "bg-white/50 scale-105" : "hover:bg-white/25"}
                            `}
                            onMouseEnter={() => setHovered(s)}
                            onMouseLeave={() => setHovered(null)}
                          >
                            <div className={`w-4 h-4 sm:w-5 sm:h-5 rounded-full flex items-center justify-center shadow-md border border-white/50 ${DOT_CLS[s.mStatus]} ${s.mStatus === "critical" ? "animate-pulse" : ""}`}>
                              <span className="text-[5px] sm:text-[7px] text-white font-bold leading-none">S</span>
                            </div>
                            <div className={`w-4 h-4 sm:w-5 sm:h-5 rounded-full flex items-center justify-center shadow-md border border-white/50 ${DOT_CLS[s.tStatus]} ${s.tStatus === "critical" ? "animate-pulse" : ""}`}>
                              <span className="text-[5px] sm:text-[7px] text-white font-bold leading-none">T</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Saída */}
        <div className="flex flex-col items-center gap-1.5 shrink-0 w-12 sm:w-16">
          <div className="w-8 h-8 rounded-full bg-soil-200 flex items-center justify-center">
            <ArrowRight size={16} className="text-soil-500" />
          </div>
          <p className="text-[8px] sm:text-[9px] font-display font-bold text-soil-600 uppercase text-center leading-tight tracking-wide">
            Saída<br />dos Fundos
          </p>
        </div>

      </div>

      {/* ── Detail panel ── */}
      <div className="mt-4 min-h-[76px]">
        {hovered === null && (
          <div className="flex items-center justify-center h-[76px]">
            <p className="text-xs text-gray-300 font-body select-none">
              Passe o mouse sobre um sensor para ver os detalhes
            </p>
          </div>
        )}

        {hovered === "air" && (
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 bg-blue-50 border border-blue-100 rounded-xl px-4 py-3 animate-fade-in">
            <div>
              <p className="text-[10px] text-gray-400 font-body uppercase tracking-wider">Sensor de Ar · Canteiro B</p>
              <span className="mt-0.5 flex items-center gap-1 text-[10px] bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded-full font-medium w-fit">
                <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full inline-block animate-pulse2" />
                Simulado
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Thermometer size={14} className="text-orange-400" />
              <span className="text-xs text-gray-500 font-body">Temperatura:</span>
              <span className="text-sm font-display font-bold text-emerald-700">{AIR_DATA.temperature}°C</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-emerald-100 text-emerald-700">Normal</span>
            </div>
            <div className="flex items-center gap-2">
              <Wind size={14} className="text-blue-400" />
              <span className="text-xs text-gray-500 font-body">Umidade do ar:</span>
              <span className="text-sm font-display font-bold text-emerald-700">{AIR_DATA.humidity}%</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-emerald-100 text-emerald-700">Normal</span>
            </div>
          </div>
        )}

        {hovered !== null && hovered !== "air" && (() => {
          const s = hovered as SoilSensor;
          return (
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 animate-fade-in">
              <div>
                <p className="text-[10px] text-gray-400 font-body uppercase tracking-wider">
                  Canteiro {s.bed} · Fileira {s.row} · Posição {s.position}
                </p>
                <span className="mt-0.5 text-[10px] bg-gray-100 text-gray-400 px-2 py-0.5 rounded-full font-medium inline-block">
                  Dados simulados
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Droplets size={14} className="text-blue-400" />
                <span className="text-xs text-gray-500 font-body">Umidade solo:</span>
                <span className={`text-sm font-display font-bold ${TEXT_CLS[s.mStatus]}`}>{s.moisture.toFixed(1)}%</span>
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${BADGE_CLS[s.mStatus]}`}>{STATUS_LABEL[s.mStatus]}</span>
              </div>
              <div className="flex items-center gap-2">
                <Thermometer size={14} className="text-orange-400" />
                <span className="text-xs text-gray-500 font-body">Temp. solo:</span>
                <span className={`text-sm font-display font-bold ${TEXT_CLS[s.tStatus]}`}>{s.soilTemp.toFixed(1)}°C</span>
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${BADGE_CLS[s.tStatus]}`}>{STATUS_LABEL[s.tStatus]}</span>
              </div>
            </div>
          );
        })()}
      </div>

      {/* ── Legend ── */}
      <div className="mt-4 pt-4 border-t border-gray-100 flex flex-wrap gap-x-4 gap-y-2 items-center">
        <span className="text-[10px] font-body text-gray-400 uppercase tracking-wider font-semibold">Legenda</span>
        {[
          { dot: "bg-emerald-400", label: "Normal" },
          { dot: "bg-amber-400",   label: "Atenção" },
          { dot: "bg-red-500",     label: "Crítico" },
          { dot: "bg-blue-500",    label: "Sensor de Ar" },
        ].map(({ dot, label }) => (
          <div key={label} className="flex items-center gap-1.5">
            <span className={`w-3 h-3 rounded-full ${dot}`} />
            <span className="text-[11px] font-body text-gray-500">{label}</span>
          </div>
        ))}
        <span className="text-[11px] font-body text-gray-300 sm:ml-auto">
          S = Umidade do Solo · T = Temperatura do Solo
        </span>
      </div>
    </div>
  );
}
