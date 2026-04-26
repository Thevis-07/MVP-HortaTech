"use client";

import { useEffect, useState } from "react";

export interface CurrentWeather {
  temperature: number;
  windspeed: number;
  weathercode: number;
}

export interface DailyForecast {
  date: string;
  weathercode: number;
  tempMax: number;
  tempMin: number;
  precipitation: number;
}

export interface WeatherData {
  current: CurrentWeather;
  daily: DailyForecast[];
  loading: boolean;
  error: string | null;
}

// WMO Weather interpretation codes → label + lucide icon name
export const WMO_CODES: Record<number, { label: string; icon: string }> = {
  0:  { label: "Céu limpo",        icon: "Sun" },
  1:  { label: "Predomin. limpo",  icon: "SunDim" },
  2:  { label: "Parcial. nublado", icon: "CloudSun" },
  3:  { label: "Nublado",          icon: "Cloud" },
  45: { label: "Névoa",            icon: "CloudFog" },
  48: { label: "Névoa gelada",     icon: "CloudFog" },
  51: { label: "Garoa leve",       icon: "CloudDrizzle" },
  53: { label: "Garoa moderada",   icon: "CloudDrizzle" },
  55: { label: "Garoa intensa",    icon: "CloudDrizzle" },
  61: { label: "Chuva leve",       icon: "CloudRain" },
  63: { label: "Chuva moderada",   icon: "CloudRain" },
  65: { label: "Chuva forte",      icon: "CloudRain" },
  71: { label: "Neve leve",        icon: "CloudSnow" },
  73: { label: "Neve moderada",    icon: "CloudSnow" },
  75: { label: "Neve forte",       icon: "CloudSnow" },
  80: { label: "Pancadas leves",   icon: "CloudRain" },
  81: { label: "Pancadas moderadas", icon: "CloudRain" },
  82: { label: "Pancadas fortes",  icon: "CloudRain" },
  95: { label: "Tempestade",       icon: "CloudLightning" },
  96: { label: "Tempestade c/ granizo", icon: "CloudLightning" },
  99: { label: "Tempestade c/ granizo", icon: "CloudLightning" },
};

export function getWmo(code: number) {
  return WMO_CODES[code] ?? { label: "—", icon: "Cloud" };
}

const LAT = -29.697655;
const LON = -53.519926;
const API_URL =
  `https://api.open-meteo.com/v1/forecast` +
  `?latitude=${LAT}&longitude=${LON}` +
  `&current_weather=true` +
  `&daily=weathercode,temperature_2m_max,temperature_2m_min,precipitation_sum` +
  `&timezone=America%2FSao_Paulo` +
  `&forecast_days=6`;

export function useWeather(): WeatherData {
  const [data, setData] = useState<WeatherData>({
    current: { temperature: 0, windspeed: 0, weathercode: 0 },
    daily: [],
    loading: true,
    error: null,
  });

  useEffect(() => {
    let mounted = true;

    fetch(API_URL)
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then((json) => {
        if (!mounted) return;
        const daily: DailyForecast[] = (json.daily.time as string[]).map(
          (date: string, i: number) => ({
            date,
            weathercode: json.daily.weathercode[i],
            tempMax: json.daily.temperature_2m_max[i],
            tempMin: json.daily.temperature_2m_min[i],
            precipitation: json.daily.precipitation_sum[i],
          })
        );
        setData({
          current: json.current_weather,
          daily,
          loading: false,
          error: null,
        });
      })
      .catch((err) => {
        if (!mounted) return;
        setData((d) => ({ ...d, loading: false, error: err.message }));
      });

    return () => { mounted = false; };
  }, []);

  return data;
}
