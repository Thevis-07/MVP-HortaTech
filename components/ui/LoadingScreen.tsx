"use client";

import { Leaf } from "lucide-react";

export default function LoadingScreen() {
  return (
    <div className="min-h-screen bg-[#dce5dc] flex items-center justify-center">
      <div className="text-center animate-fade-in">
        <div className="relative w-16 h-16 mx-auto mb-6">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center shadow-lg shadow-green-200 animate-pulse2">
            <Leaf size={28} className="text-white" />
          </div>
          <div className="absolute inset-0 rounded-2xl bg-green-300 opacity-30 scale-110 animate-ping" />
        </div>
        <h1 className="font-display text-2xl font-bold text-green-900 mb-2">
          Estufa Monitor
        </h1>
        <p className="text-green-500 font-body text-sm">Conectando ao Firebase...</p>
        <div className="mt-4 flex justify-center gap-1">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse2"
              style={{ animationDelay: `${i * 0.2}s` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
