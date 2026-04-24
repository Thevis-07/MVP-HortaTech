import SensorHistoryPage from "@/components/SensorHistoryPage";
import { notFound } from "next/navigation";

const allowed = ["solo-1", "solo-2", "ar"] as const;
type SensorKind = (typeof allowed)[number];

export default function HistoricoPage({ params }: { params: { sensor: string } }) {
  if (!allowed.includes(params.sensor as SensorKind)) {
    notFound();
  }

  return <SensorHistoryPage sensor={params.sensor as SensorKind} />;
}
