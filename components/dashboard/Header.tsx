"use client";

import { Leaf, Wifi, WifiOff } from "lucide-react";

interface Props {
  authenticated: boolean;
}

export default function Header({ authenticated }: Props) {
  const formatted = new Date().toLocaleDateString("pt-BR", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="mb-8 animate-fade-in">
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center shadow-lg shadow-green-200">
            <Leaf size={24} className="text-white" />
          </div>
          <div>
            <h1 className="font-display text-3xl font-bold text-green-900 leading-tight">
              Estufa Monitor
            </h1>
            <p className="text-green-600 text-sm font-body capitalize">{formatted}</p>
          </div>
        </div>

        <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-gray-200 shadow-md">
          {authenticated ? (
            <>
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse2" />
              <Wifi size={14} className="text-green-600" />
              <span className="text-green-700 text-sm font-body font-medium">Conectado</span>
            </>
          ) : (
            <>
              <span className="w-2 h-2 rounded-full bg-red-400" />
              <WifiOff size={14} className="text-red-500" />
              <span className="text-red-600 text-sm font-body">Desconectado</span>
            </>
          )}
        </div>
      </div>

      <div className="mt-6 h-px bg-green-800/20" />
    </div>
  );
}
