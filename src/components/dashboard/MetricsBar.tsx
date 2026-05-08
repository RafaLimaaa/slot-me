import { TrendingUp, Clock, Calendar, DollarSign } from "lucide-react";
import type { DashboardMetrics } from "@/types";

interface Props {
  metrics: DashboardMetrics;
}

export function MetricsBar({ metrics }: Props) {
  const brl = (v: number) =>
    v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

  const cards = [
    {
      label: "Agendamentos hoje",
      value: String(metrics.appointmentsToday),
      icon: Calendar,
    },
    {
      label: "Receita prevista",
      value: brl(metrics.revenueToday),
      icon: DollarSign,
    },
    {
      label: "Ocupação semanal",
      value: `${metrics.weeklyOccupancyRate}%`,
      icon: TrendingUp,
    },
    {
      label: "Próximo agendamento",
      value: metrics.nextAppointment
        ? `${metrics.nextAppointment.start_time.slice(0, 5)} — ${metrics.nextAppointment.client_name}`
        : "Nenhum hoje",
      icon: Clock,
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map(({ label, value, icon: Icon }) => (
        <div
          key={label}
          className="bg-[#18181b] border border-[#27272a] rounded-[12px] p-4 flex flex-col gap-2"
        >
          <div className="flex items-center gap-2 text-[#a1a1aa]">
            <Icon size={15} />
            <span className="text-xs">{label}</span>
          </div>
          <span className="text-[#fafafa] font-semibold text-lg leading-none">{value}</span>
        </div>
      ))}
    </div>
  );
}
