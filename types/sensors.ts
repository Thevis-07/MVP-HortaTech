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

export type SensorKind = "solo-1" | "solo-2" | "ar";
