// lib/useFirebaseData.ts
"use client";

import { useEffect, useState } from "react";
import { ref, onValue, off } from "firebase/database";
import { database, signIn } from "./firebase";

export interface SoloUmidadeEntry {
  timestamp: string;
  umidade: number;
}

export interface ArTemperaturaUmidadeEntry {
  id: string;
  horario: string;
  temperatura: number;
  umidade: number;
}

export interface DashboardData {
  sensor1: SoloUmidadeEntry[];
  sensor2: SoloUmidadeEntry[];
  sensorAr: ArTemperaturaUmidadeEntry[];
  loading: boolean;
  error: string | null;
  authenticated: boolean;
}

function parseSoloSensor(raw: Record<string, unknown>): SoloUmidadeEntry[] {
  if (!raw) return [];
  return Object.entries(raw)
    .map(([timestamp, val]) => {
      const value = val as Record<string, unknown>;
      return {
        timestamp: String(timestamp),
        umidade: Number(value?.umidade ?? value ?? 0),
      };
    })
    .sort((a, b) => a.timestamp.localeCompare(b.timestamp));
}

function parseArSensor(raw: Record<string, unknown>): ArTemperaturaUmidadeEntry[] {
  if (!raw) return [];
  return Object.entries(raw)
    .map(([id, val]) => {
      const value = val as Record<string, unknown>;
      return {
        id,
        horario: String(value?.horario ?? ""),
        temperatura: Number(value?.temperatura ?? 0),
        umidade: Number(value?.umidade ?? 0),
      };
    })
    .sort((a, b) => a.horario.localeCompare(b.horario));
}

export function useFirebaseData(): DashboardData {
  const [data, setData] = useState<DashboardData>({
    sensor1: [],
    sensor2: [],
    sensorAr: [],
    loading: true,
    error: null,
    authenticated: false,
  });

  useEffect(() => {
    let mounted = true;
    const refs: ReturnType<typeof ref>[] = [];

    async function init() {
      try {
        await signIn();

        if (!mounted) return;

        setData((d) => ({ ...d, authenticated: true }));

        const sensorPath = ref(database, "Sensores");

        refs.push(sensorPath);
        onValue(sensorPath, (snapshot) => {
          if (!mounted) return;
          const val = snapshot.val() as Record<string, unknown>;

          const sensor1Raw = val?.sensor_1_solo_umidade as Record<string, unknown>;
          const sensor2Raw = val?.sensor_2_solo_umidade as Record<string, unknown>;
          const arRaw = val?.sensor_ar_temperatura_umidade as Record<string, unknown>;

          setData({
            sensor1: parseSoloSensor(sensor1Raw),
            sensor2: parseSoloSensor(sensor2Raw),
            sensorAr: parseArSensor(arRaw),
            loading: false,
            error: null,
            authenticated: true,
          });
        });
      } catch (err) {
        if (!mounted) return;
        setData((d) => ({
          ...d,
          loading: false,
          error: err instanceof Error ? err.message : "Erro ao conectar ao Firebase",
        }));
      }
    }

    init();

    return () => {
      mounted = false;
      refs.forEach((r) => off(r));
    };
  }, []);

  return data;
}
