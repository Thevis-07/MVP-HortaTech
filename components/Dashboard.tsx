"use client";

import { useFirebaseData } from "@/lib/useFirebaseData";
import Header from "./Header";
import StatCard from "./StatCard";
import SoloUmidadeChart from "./SoloUmidadeChart";
import ArChart from "./ArChart";
import HistoryTable from "./HistoryTable";
import LoadingScreen from "./LoadingScreen";
import {
  Droplets,
  Thermometer,
  Wind,
  Sprout,
  CloudRain,
} from "lucide-react";

export default function Dashboard() {
  const { sensor1, sensor2, sensorAr, loading, error, authenticated } =
    useFirebaseData();

  if (loading) return <LoadingScreen />;

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8fdf8]">
        <div className="text-center p-8 bg-white rounded-2xl shadow-lg border border-red-100">
          <p className="text-red-500 font-body text-lg mb-2">Erro de conexão</p>
          <p className="text-gray-500 text-sm">{error}</p>
        </div>
      </div>
    );
  }

  // Latest readings
  const latestS1 = sensor1[sensor1.length - 1];
  const latestS2 = sensor2[sensor2.length - 1];
  const latestAr = sensorAr[sensorAr.length - 1];

  // Averages
  const avgS1 =
    sensor1.length > 0
      ? sensor1.reduce((a, b) => a + b.umidade, 0) / sensor1.length
      : 0;
  const avgS2 =
    sensor2.length > 0
      ? sensor2.reduce((a, b) => a + b.umidade, 0) / sensor2.length
      : 0;
  const avgTemp =
    sensorAr.length > 0
      ? sensorAr.reduce((a, b) => a + b.temperatura, 0) / sensorAr.length
      : 0;
  const avgUmAr =
    sensorAr.length > 0
      ? sensorAr.reduce((a, b) => a + b.umidade, 0) / sensorAr.length
      : 0;

  return (
    <div className="min-h-screen bg-[#f8fdf8]">
      {/* Background decorative elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-green-100 opacity-40 blur-3xl" />
        <div className="absolute top-1/2 -left-24 w-64 h-64 rounded-full bg-green-200 opacity-20 blur-3xl" />
        <div className="absolute bottom-0 right-1/3 w-80 h-80 rounded-full bg-emerald-100 opacity-30 blur-3xl" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Header authenticated={authenticated} />

        {/* Stat Cards */}
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

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <SoloUmidadeChart sensor1={sensor1} sensor2={sensor2} />
          <ArChart data={sensorAr} />
        </div>

        {/* History Tables */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <HistoryTable
            title="Histórico — Solo Sensor 1"
            data={sensor1.slice().reverse().slice(0, 20).map((d) => ({
              timestamp: d.timestamp,
              values: [{ label: "Umidade", value: d.umidade, unit: "%" }],
            }))}
            icon={<Droplets size={16} />}
            detailHref="/historico/solo-1"
          />
          <HistoryTable
            title="Histórico — Solo Sensor 2"
            data={sensor2.slice().reverse().slice(0, 20).map((d) => ({
              timestamp: d.timestamp,
              values: [{ label: "Umidade", value: d.umidade, unit: "%" }],
            }))}
            icon={<Sprout size={16} />}
            detailHref="/historico/solo-2"
          />
          <HistoryTable
            title="Histórico — Sensor de Ar"
            data={sensorAr
              .slice()
              .reverse()
              .slice(0, 20)
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

        {/* Footer */}
        <div className="mt-10 text-center">
          <p className="text-green-700 text-sm font-body opacity-60">
            Atualização em tempo real via Firebase Realtime Database • ESP32
          </p>
        </div>
      </div>
    </div>
  );
}
