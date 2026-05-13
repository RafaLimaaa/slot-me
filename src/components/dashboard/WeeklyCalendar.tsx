"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { notifyClientOfCancellation } from "@/app/actions";
import type { AppointmentWithDetails, AppointmentStatus, Professional } from "@/types";

const DAY_LABELS = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

const STATUS_CARD: Record<AppointmentStatus, { bg: string; border: string; color: string }> = {
  scheduled: { bg: "#9A3412",  border: "#C2410C", color: "#ffedd5" },
  completed: { bg: "#1A3D2B",  border: "#3D6B4F", color: "#86efac" },
  cancelled: { bg: "#3D0F0F",  border: "#7F1D1D", color: "#fca5a5" },
  no_show:   { bg: "#3D2000",  border: "#92400E", color: "#fdba74" },
};

const LEGEND = [
  { label: "Agendado",       status: "scheduled" },
  { label: "Concluído",      status: "completed" },
  { label: "Cancelado",      status: "cancelled" },
  { label: "Não compareceu", status: "no_show"   },
] as const;

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

function toISO(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

export function WeeklyCalendar({ appointments, professionals, onUpdateStatus }: Props) {
  const [weekOffset, setWeekOffset] = useState(0);
  const [filterProfId, setFilterProfId] = useState<string>("all");
  const [selected, setSelected] = useState<AppointmentWithDetails | null>(null);
  const [updating, setUpdating] = useState(false);

  const days = weekDays(weekOffset);
  const filtered = appointments.filter(
    (a) =>
      (filterProfId === "all" || a.professional_id === filterProfId) &&
      days.some((d) => toISO(d) === a.date)
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <button onClick={() => setWeekOffset((w) => w - 1)} className="p-1.5 rounded-[8px] hover:bg-[#1E1E1E] transition-colors">
            <ChevronLeft size={16} className="text-[#6B7280]" />
          </button>
          <span className="text-sm text-[#fafafa] font-medium">
            {days[0].toLocaleDateString("pt-BR", { day: "2-digit", month: "short" })} —{" "}
            {days[6].toLocaleDateString("pt-BR", { day: "2-digit", month: "short" })}
          </span>
          <button onClick={() => setWeekOffset((w) => w + 1)} className="p-1.5 rounded-[8px] hover:bg-[#1E1E1E] transition-colors">
            <ChevronRight size={16} className="text-[#6B7280]" />
          </button>
        </div>
        <select
          value={filterProfId}
          onChange={(e) => setFilterProfId(e.target.value)}
          className="bg-[#1E1E1E] border border-[#2A2A2A] text-[#fafafa] text-sm rounded-[8px] px-3 py-1.5 outline-none"
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
              <div className={`text-center py-1 mb-1 rounded-[8px] text-xs ${isToday ? "bg-[#C2410C] text-white" : "text-[#6B7280]"}`}>
                <div className="font-medium">{DAY_LABELS[i]}</div>
                <div>{day.getDate()}</div>
              </div>
              <div className="flex flex-col gap-1">
                {dayAppts.map((a) => {
                  const cs = STATUS_CARD[a.status];
                  return (
                    <button
                      key={a.id}
                      onClick={() => setSelected(a)}
                      className="w-full text-left px-2 py-1 rounded-r-[6px] text-xs transition-opacity hover:opacity-75"
                      style={{ background: cs.bg, borderLeft: `2px solid ${cs.border}`, color: cs.color }}
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

      <div className="flex flex-wrap gap-4 mt-4 pt-4 border-t border-[#2A2A2A]">
        {LEGEND.map(({ label, status }) => {
          const cs = STATUS_CARD[status];
          return (
            <div key={status} className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-[3px]" style={{ background: cs.bg, border: `1px solid ${cs.border}` }} />
              <span className="text-[#6B7280] text-xs">{label}</span>
            </div>
          );
        })}
      </div>

      {selected && (
        <Modal open onClose={() => setSelected(null)} title="Detalhes do agendamento">
          <div className="flex flex-col gap-3 text-sm">
            {([ ["Cliente", selected.client_name], ["Telefone", selected.client_phone], ["Email", selected.client_email],
                ["Serviço", selected.service.name], ["Profissional", selected.professional.name],
                ["Data", new Date(selected.date + "T00:00:00").toLocaleDateString("pt-BR")],
                ["Horário", `${selected.start_time.slice(0, 5)} — ${selected.end_time.slice(0, 5)}`],
            ] as [string, string][]).map(([k, v]) => (
              <div key={k} className="flex justify-between">
                <span className="text-[#6b7280]">{k}</span>
                <span className="text-[#fafafa] font-medium">{v}</span>
              </div>
            ))}
          </div>
          {selected.status === "scheduled" && (
            <div className="flex gap-2 mt-4">
              <Button variant="secondary" size="sm" className="flex-1" loading={updating}
                onClick={async () => { setUpdating(true); await onUpdateStatus(selected.id, "completed"); setUpdating(false); setSelected(null); }}>
                Marcar concluído
              </Button>
              <Button variant="danger" size="sm" className="flex-1" loading={updating}
                onClick={async () => { setUpdating(true); await onUpdateStatus(selected.id, "cancelled"); notifyClientOfCancellation(selected.id).catch(console.error); setUpdating(false); setSelected(null); }}>
                Cancelar
              </Button>
            </div>
          )}
          {selected.status !== "scheduled" && (
            <div className="mt-4">
              <span
                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border"
                style={{ background: STATUS_CARD[selected.status].bg, borderColor: STATUS_CARD[selected.status].border, color: STATUS_CARD[selected.status].color }}
              >
                {selected.status === "completed" ? "Concluído" : selected.status === "no_show" ? "Não compareceu" : "Cancelado"}
              </span>
            </div>
          )}
        </Modal>
      )}
    </div>
  );
}
