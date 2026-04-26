"use client";

import { useState } from "react";
import { Wind, Droplets, MapPin, ChevronDown } from "lucide-react";
import { useWeather, getWmo } from "@/lib/useWeather";

const LAT = -29.697655;
const LON = -53.519926;

const WINDY_URL =
  `https://embed.windy.com/embed2.html` +
  `?lat=${LAT}&lon=${LON}` +
  `&detailLat=${LAT}&detailLon=${LON}` +
  `&zoom=7&level=surface&overlay=clouds` +
  `&menu=&message=true&marker=true` +
  `&metricWind=km%2Fh&metricTemp=%C2%B0C` +
  `&type=map&location=coordinates`;

const WMO_EMOJI: Record<string, string> = {
  Sun:            "☀️",
  SunDim:         "🌤️",
  CloudSun:       "⛅",
  Cloud:          "☁️",
  CloudFog:       "🌫️",
  CloudDrizzle:   "🌦️",
  CloudRain:      "🌧️",
  CloudSnow:      "❄️",
  CloudLightning: "⛈️",
};

function WeatherEmoji({ code, className = "" }: { code: number; className?: string }) {
  const { icon } = getWmo(code);
  return <span className={className}>{WMO_EMOJI[icon] ?? "🌡️"}</span>;
}

function formatWeekday(dateStr: string, index: number): string {
  if (index === 0) return "Hoje";
  if (index === 1) return "Amanhã";
  const d = new Date(dateStr + "T12:00:00");
  return d.toLocaleDateString("pt-BR", { weekday: "short" }).replace(".", "");
}

export default function WeatherWidget() {
  const { current, daily, loading } = useWeather();
  const [expanded, setExpanded] = useState(false);

  if (loading) {
    return <div className="rounded-2xl mb-6 bg-white/60 border border-gray-200 animate-pulse h-24" />;
  }

  if (daily.length === 0) return null;

  const today = daily[0];
  const forecast = daily.slice(1);
  const { label: currentLabel } = getWmo(current.weathercode);

  return (
    <div className="rounded-2xl mb-6 overflow-hidden bg-white border border-gray-200 shadow-md">

      {/* Clickable summary bar */}
      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        className="w-full text-left flex items-center gap-0 divide-x divide-gray-100 hover:bg-gray-50/60 transition-colors"
      >
        {/* Current conditions */}
        <div className="flex items-center gap-4 px-5 py-4 min-w-[220px]">
          <WeatherEmoji code={current.weathercode} className="text-4xl leading-none" />
          <div>
            <div className="flex items-end gap-1 leading-none">
              <span className="font-display text-4xl font-bold text-gray-800">
                {Math.round(current.temperature)}
              </span>
              <span className="text-lg text-gray-400 font-body mb-0.5">°C</span>
            </div>
            <p className="text-xs text-gray-400 font-body mt-0.5">{currentLabel}</p>
          </div>
        </div>

        {/* Location + meta */}
        <div className="flex flex-col justify-center gap-1 px-5 py-4">
          <div className="flex items-center gap-1">
            <MapPin size={12} className="text-green-600 shrink-0" />
            <span className="text-sm font-body font-semibold text-gray-700">Recanto Maestro</span>
            <span className="text-xs text-gray-400 font-body">— RS</span>
          </div>
          <div className="flex items-center gap-3 text-xs text-gray-400 font-body">
            <span className="flex items-center gap-1">
              <Wind size={11} />
              {Math.round(current.windspeed)} km/h
            </span>
            <span className="flex items-center gap-1">
              <Droplets size={11} className="text-blue-400" />
              {today.precipitation.toFixed(1)} mm
            </span>
            <span className="text-blue-500 font-semibold">{Math.round(today.tempMin)}°</span>
            <span className="text-orange-400 font-semibold">{Math.round(today.tempMax)}°</span>
          </div>
        </div>

        {/* Forecast days */}
        <div className="flex flex-1 divide-x divide-gray-100">
          {forecast.map((day, i) => (
            <div
              key={day.date}
              className="flex flex-col items-center justify-center gap-1 py-3 flex-1"
            >
              <span className="text-[11px] font-body font-semibold text-gray-400 uppercase tracking-wide">
                {formatWeekday(day.date, i + 1)}
              </span>
              <WeatherEmoji code={day.weathercode} className="text-2xl leading-none" />
              <div className="flex items-center gap-1.5 text-xs font-body font-semibold">
                <span className="text-blue-400">{Math.round(day.tempMin)}°</span>
                <span className="text-gray-200">/</span>
                <span className="text-orange-400">{Math.round(day.tempMax)}°</span>
              </div>
              {day.precipitation > 0.1 && (
                <span className="text-[10px] text-blue-400 font-body">
                  {day.precipitation.toFixed(1)}mm
                </span>
              )}
            </div>
          ))}
        </div>

        {/* Expand hint */}
        <div className="px-4 py-4 flex items-center self-stretch border-l border-gray-100">
          <ChevronDown
            size={16}
            className={`text-gray-400 transition-transform duration-300 ${expanded ? "rotate-180" : ""}`}
          />
        </div>
      </button>

      {/* Windy map — expandable */}
      {expanded && (
        <div className="border-t border-gray-100">
          <iframe
            src={WINDY_URL}
            className="w-full"
            style={{ height: 420, border: "none" }}
            title="Mapa de nuvens — Recanto Maestro"
            loading="lazy"
            allowFullScreen
          />
        </div>
      )}

    </div>
  );
}
