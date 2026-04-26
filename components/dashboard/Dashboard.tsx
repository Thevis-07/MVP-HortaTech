"use client";

import { Droplets, Thermometer, CloudRain, Sprout, Wind } from "lucide-react";
import { useFirebaseData } from "@/lib/useFirebaseData";
import Header from "./Header";
import StatCard from "./StatCard";
import SoloUmidadeChart from "@/components/charts/SoloUmidadeChart";
import ArChart from "@/components/charts/ArChart";
import HistoryTable from "@/components/history/HistoryTable";
import LoadingScreen from "@/components/ui/LoadingScreen";
import ErrorScreen from "@/components/ui/ErrorScreen";
import WeatherWidget from "./WeatherWidget";
import { DASHBOARD_HISTORY_PREVIEW } from "@/lib/constants";

function avg(values: number[]): number {
  return values.length > 0 ? values.reduce((a, b) => a + b, 0) / values.length : 0;
}

export default function Dashboard() {
  const { sensor1, sensor2, sensorAr, loading, error, authenticated } = useFirebaseData();

  if (loading) return <LoadingScreen />;
  if (error) return <ErrorScreen message={error} />;

  const latestS1 = sensor1[sensor1.length - 1];
  const latestS2 = sensor2[sensor2.length - 1];
  const latestAr = sensorAr[sensorAr.length - 1];

  const avgS1 = avg(sensor1.map((d) => d.umidade));
  const avgS2 = avg(sensor2.map((d) => d.umidade));
  const avgTemp = avg(sensorAr.map((d) => d.temperatura));
  const avgUmAr = avg(sensorAr.map((d) => d.umidade));

  return (
    <div className="min-h-screen bg-[#dce5dc]">

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Header authenticated={authenticated} />
        <WeatherWidget />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard
            label="Solo — Sensor 1"
            value={latestS1?.umidade ?? 0}
            unit="%"
            avg={avgS1}
            count={sensor1.length}
            icon={<Droplets size={22} />}
            color="emerald"
            description="Umidade do solo"
          />
          <StatCard
            label="Solo — Sensor 2"
            value={latestS2?.umidade ?? 0}
            unit="%"
            avg={avgS2}
            count={sensor2.length}
            icon={<Sprout size={22} />}
            color="green"
            description="Umidade do solo"
          />
          <StatCard
            label="Temperatura do Ar"
            value={latestAr?.temperatura ?? 0}
            unit="°C"
            avg={avgTemp}
            count={sensorAr.length}
            icon={<Thermometer size={22} />}
            color="teal"
            description="Temperatura ambiente"
          />
          <StatCard
            label="Umidade do Ar"
            value={latestAr?.umidade ?? 0}
            unit="%"
            avg={avgUmAr}
            count={sensorAr.length}
            icon={<CloudRain size={22} />}
            color="cyan"
            description="Umidade relativa do ar"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <SoloUmidadeChart sensor1={sensor1} sensor2={sensor2} />
          <ArChart data={sensorAr} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <HistoryTable
            title="Histórico — Solo Sensor 1"
            data={sensor1
              .slice()
              .reverse()
              .slice(0, DASHBOARD_HISTORY_PREVIEW)
              .map((d) => ({ timestamp: d.timestamp, values: [{ label: "Umidade", value: d.umidade, unit: "%" }] }))}
            icon={<Droplets size={16} />}
            detailHref="/historico/solo-1"
          />
          <HistoryTable
            title="Histórico — Solo Sensor 2"
            data={sensor2
              .slice()
              .reverse()
              .slice(0, DASHBOARD_HISTORY_PREVIEW)
              .map((d) => ({ timestamp: d.timestamp, values: [{ label: "Umidade", value: d.umidade, unit: "%" }] }))}
            icon={<Sprout size={16} />}
            detailHref="/historico/solo-2"
          />
          <HistoryTable
            title="Histórico — Sensor de Ar"
            data={sensorAr
              .slice()
              .reverse()
              .slice(0, DASHBOARD_HISTORY_PREVIEW)
              .map((d) => ({
                timestamp: d.horario,
                values: [
                  { label: "Temp", value: d.temperatura, unit: "°C" },
                  { label: "Umid", value: d.umidade, unit: "%" },
                ],
              }))}
            icon={<Wind size={16} />}
            detailHref="/historico/ar"
          />
        </div>

        <div className="mt-10 text-center">
          <p className="text-green-700 text-sm font-body opacity-60">
            Atualização em tempo real via Firebase Realtime Database • ESP32
          </p>
        </div>
      </div>
    </div>
  );
}
