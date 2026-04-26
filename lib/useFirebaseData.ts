"use client";

import { useEffect, useState } from "react";
import { ref, onValue, off } from "firebase/database";
import { database, signIn } from "./firebase";
import { FIREBASE_PATHS } from "./constants";
import type {
  SoloUmidadeEntry,
  ArTemperaturaUmidadeEntry,
  DashboardData,
} from "@/types/sensors";

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

        const rootRef = ref(database, FIREBASE_PATHS.root);
        refs.push(rootRef);

        onValue(rootRef, (snapshot) => {
          if (!mounted) return;
          const val = snapshot.val() as Record<string, unknown>;

          setData({
            sensor1: parseSoloSensor(val?.[FIREBASE_PATHS.solo1] as Record<string, unknown>),
            sensor2: parseSoloSensor(val?.[FIREBASE_PATHS.solo2] as Record<string, unknown>),
            sensorAr: parseArSensor(val?.[FIREBASE_PATHS.ar] as Record<string, unknown>),
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
