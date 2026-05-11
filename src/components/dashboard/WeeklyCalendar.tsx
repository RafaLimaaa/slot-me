"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import type { AppointmentWithDetails, AppointmentStatus, Professional } from "@/types";

const DAY_LABELS = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

interface Props {
  appointments: AppointmentWithDetails[];
  professionals: Pick<Professional, "id" | "name">[];
  onUpdateStatus: (id: string, status: AppointmentStatus) => Promise<void>;
}

function weekDays(weekOffset: number): Date[] {
  const now = new Date();
  const start = new Date(now);
  start.setDate(now.getDate() - now.getDay() + weekOffset * 7);
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    return d;
  });
}

export function WeeklyCalendar({ appointments, professionals, onUpdateStatus }: Props) {
  const [weekOffset, setWeekOffset] = useState(0);
  const [filterProfId, setFilterProfId] = useState<string>("all");
  const [selected, setSelected] = useState<AppointmentWithDetails | null>(null);
  const [updating, setUpdating] = useState(false);

  const days = weekDays(weekOffset);
  const toISO = (d: Date) =>
    `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

  const filtered = appointments.filter(
    (a) =>
      (filterProfId === "all" || a.professional_id === filterProfId) &&
      days.some((d) => toISO(d) === a.date)
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <button onClick={() => setWeekOffset((w) => w - 1)} className="p-1.5 rounded-[8px] hover:bg-[#27272a] transition-colors">
            <ChevronLeft size={16} className="text-[#a1a1aa]" />
          </button>
          <span className="text-sm text-[#fafafa] font-medium">
            {days[0].toLocaleDateString("pt-BR", { day: "2-digit", month: "short" })} —{" "}
            {days[6].toLocaleDateString("pt-BR", { day: "2-digit", month: "short" })}
          </span>
          <button onClick={() => setWeekOffset((w) => w + 1)} className="p-1.5 rounded-[8px] hover:bg-[#27272a] transition-colors">
            <ChevronRight size={16} className="text-[#a1a1aa]" />
          </button>
        </div>
        <select
          value={filterProfId}
          onChange={(e) => setFilterProfId(e.target.value)}
          className="bg-[#18181b] border border-[#27272a] text-[#fafafa] text-sm rounded-[8px] px-3 py-1.5 outline-none"
        >
          <option value="all">Todos os profissionais</option>
          {professionals.map((p) => (
            <option key={p.id} value={p.id}>{p.name}</option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-7 gap-1">
        {days.map((day, i) => {
          const iso = toISO(day);
          const dayAppts = filtered.filter((a) => a.date === iso);
          const isToday = iso === toISO(new Date());

          return (
            <div key={i} className="min-h-[120px]">
              <div className={`text-center py-1 mb-1 rounded-[8px] text-xs ${isToday ? "bg-[#2563EB] text-white" : "text-[#a1a1aa]"}`}>
                <div className="font-medium">{DAY_LABELS[i]}</div>
                <div>{day.getDate()}</div>
              </div>
              <div className="flex flex-col gap-1">
                {dayAppts.map((a) => {
                  const cardStyle =
                    a.status === "completed"
                      ? "bg-[#14532d] text-[#86efac] hover:bg-[#16a34a] hover:text-white"
                      : a.status === "cancelled"
                      ? "bg-[#450a0a] text-[#fca5a5] hover:bg-[#dc2626] hover:text-white"
                      : "bg-[#1e3a5f] text-[#93c5fd] hover:bg-[#2563EB] hover:text-white";
                  return (
                    <button
                      key={a.id}
                      onClick={() => setSelected(a)}
                      className={`w-full text-left px-2 py-1 rounded-[6px] text-xs transition-colors ${cardStyle}`}
                    >
                      <div className="font-medium">{a.start_time.slice(0, 5)}</div>
                      <div className="truncate">{a.client_name}</div>
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {selected && (
        <Modal open onClose={() => setSelected(null)} title="Detalhes do agendamento">
          <div className="flex flex-col gap-3 text-sm">
            {[
              ["Cliente", selected.client_name],
              ["Telefone", selected.client_phone],
              ["Email", selected.client_email],
              ["Serviço", selected.service.name],
              ["Profissional", selected.professional.name],
              ["Data", new Date(selected.date + "T00:00:00").toLocaleDateString("pt-BR")],
              ["Horário", `${selected.start_time.slice(0, 5)} — ${selected.end_time.slice(0, 5)}`],
            ].map(([k, v]) => (
              <div key={k} className="flex justify-between">
                <span className="text-[#6b7280]">{k}</span>
                <span className="text-[#09090b] dark:text-[#fafafa] font-medium">{v}</span>
              </div>
            ))}
          </div>
          {selected.status === "scheduled" && (
            <div className="flex gap-2 mt-4">
              <Button
                variant="secondary"
                size="sm"
                className="flex-1"
                loading={updating}
                onClick={async () => {
                  setUpdating(true);
                  await onUpdateStatus(selected.id, "completed");
                  setUpdating(false);
                  setSelected(null);
                }}
              >
                Marcar concluído
              </Button>
              <Button
                variant="danger"
                size="sm"
                className="flex-1"
                loading={updating}
                onClick={async () => {
                  setUpdating(true);
                  await onUpdateStatus(selected.id, "cancelled");
                  setUpdating(false);
                  setSelected(null);
                }}
              >
                Cancelar
              </Button>
            </div>
          )}
          {selected.status !== "scheduled" && (
            <div className="mt-4">
              <Badge variant={selected.status === "completed" ? "success" : "danger"}>
                {selected.status === "completed" ? "Concluído" : "Cancelado"}
              </Badge>
            </div>
          )}
        </Modal>
      )}
    </div>
  );
}
