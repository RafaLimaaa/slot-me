import { TrendingUp, Clock, Calendar, DollarSign } from "lucide-react";
import type { DashboardMetrics } from "@/types";

interface Props {
  metrics: DashboardMetrics;
}

const CARDS = [
  { key: "appointmentsToday", label: "Agendamentos hoje", icon: Calendar, color: "#C2410C" },
  { key: "revenueToday", label: "Receita prevista", icon: DollarSign, color: "#D97706" },
  { key: "weeklyOccupancyRate", label: "Ocupação semanal", icon: TrendingUp, color: "#3D6B4F" },
  { key: "nextAppointment", label: "Próximo agendamento", icon: Clock, color: "#6B7280" },
] as const;

export function MetricsBar({ metrics }: Props) {
  const brl = (v: number) =>
    v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

  function value(key: (typeof CARDS)[number]["key"]): string {
    if (key === "appointmentsToday") return String(metrics.appointmentsToday);
    if (key === "revenueToday") return brl(metrics.revenueToday);
    if (key === "weeklyOccupancyRate") return `${metrics.weeklyOccupancyRate}%`;
    return metrics.nextAppointment
      ? `${metrics.nextAppointment.start_time.slice(0, 5)} — ${metrics.nextAppointment.client_name}`
      : "Nenhum hoje";
  }

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      {CARDS.map(({ key, label, icon: Icon, color }) => (
        <div
          key={key}
          className="bg-[#161616] hover:bg-[#1E1E1E] border border-[#2A2A2A] rounded-[12px] p-4 flex flex-col gap-2.5 transition-colors duration-150"
        >
          <div className="flex items-center gap-2">
            <Icon size={15} style={{ color }} />
            <span className="text-[#6B7280] text-xs">{label}</span>
          </div>
          <span className="text-[#fafafa] font-semibold text-lg leading-none">{value(key)}</span>
        </div>
      ))}
    </div>
  );
}
