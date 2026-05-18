"use client";

import { useState, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { notifyClientOfCancellation } from "@/app/actions";
import type { AppointmentWithDetails, AppointmentStatus, Professional } from "@/types";

const DAY_LABELS = ["DOM", "SEG", "TER", "QUA", "QUI", "SEX", "SÁB"];
const START_HOUR = 8;
const END_HOUR = 20;
const HOUR_HEIGHT = 48;
const HALF_HEIGHT = HOUR_HEIGHT / 2;
const TOTAL_HEIGHT = (END_HOUR - START_HOUR) * HOUR_HEIGHT;
const HOURS = Array.from({ length: END_HOUR - START_HOUR }, (_, i) => START_HOUR + i);

const STATUS: Record<AppointmentStatus, { bg: string; border: string; color: string }> = {
  scheduled: { bg: "#1a2744", border: "#3B82F6", color: "#93c5fd" },
  completed: { bg: "#142a1e", border: "#22C55E", color: "#86efac" },
  cancelled: { bg: "#2a1414", border: "#EF4444", color: "#fca5a5" },
  no_show:   { bg: "#2a1f00", border: "#F59E0B", color: "#fde68a" },
};

const LEGEND = [
  { label: "Agendado",       s: "scheduled" as AppointmentStatus },
  { label: "Concluído",      s: "completed"  as AppointmentStatus },
  { label: "Cancelado",      s: "cancelled"  as AppointmentStatus },
  { label: "Não compareceu", s: "no_show"    as AppointmentStatus },
];

interface Props {
  appointments: AppointmentWithDetails[];
  professionals: Pick<Professional, "id" | "name" | "photo_url">[];
  onUpdateStatus: (id: string, status: AppointmentStatus) => Promise<void>;
}

function toISO(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function weekDays(offset: number): Date[] {
  const now = new Date();
  const start = new Date(now);
  start.setDate(now.getDate() - now.getDay() + offset * 7);
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    return d;
  });
}

function toMin(t: string): number {
  const [h, m] = t.split(":").map(Number);
  return h * 60 + m;
}

export function WeeklyCalendar({ appointments, professionals, onUpdateStatus }: Props) {
  const [weekOffset, setWeekOffset] = useState(0);
  const [filterProfId, setFilterProfId] = useState("all");
  const [selected, setSelected] = useState<AppointmentWithDetails | null>(null);
  const [updating, setUpdating] = useState(false);
  const [nowMin, setNowMin] = useState(() => {
    const n = new Date();
    return n.getHours() * 60 + n.getMinutes();
  });
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const id = setInterval(() => {
      const n = new Date();
      setNowMin(n.getHours() * 60 + n.getMinutes());
    }, 60000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    if (gridRef.current) {
      gridRef.current.scrollTop = HOUR_HEIGHT;
    }
  }, []);

  const days = weekDays(weekOffset);
  const todayISO = toISO(new Date());
  const isCurrentWeek = days.some(d => toISO(d) === todayISO);
  const nowTop = (nowMin - START_HOUR * 60) / 60 * HOUR_HEIGHT;
  const showNow = isCurrentWeek && nowTop >= 0 && nowTop <= TOTAL_HEIGHT;

  const filtered = appointments.filter(a =>
    (filterProfId === "all" || a.professional_id === filterProfId) &&
    days.some(d => toISO(d) === a.date)
  );

  return (
    <div style={{
      background: "#161616",
      border: "1px solid rgba(194,65,12,0.25)",
      boxShadow: "0 0 0 1px rgba(194,65,12,0.10), 0 0 32px rgba(194,65,12,0.08)",
      borderRadius: 12,
      padding: "20px 20px 16px",
    }}>
      <style>{`
        .agenda-grid::-webkit-scrollbar { width: 4px; }
        .agenda-grid::-webkit-scrollbar-track { background: transparent; }
        .agenda-grid::-webkit-scrollbar-thumb { background: rgba(194,65,12,0.3); border-radius: 4px; }
        .agenda-grid::-webkit-scrollbar-thumb:hover { background: rgba(194,65,12,0.6); }
      `}</style>

      {/* Week navigation */}
      <div className="flex items-center gap-2 mb-4">
        <button onClick={() => setWeekOffset(w => w - 1)} className="p-1.5 rounded-[8px] hover:bg-[#1E1E1E] transition-colors">
          <ChevronLeft size={16} className="text-[#6B7280]" />
        </button>
        <span className="text-sm text-[#fafafa] font-medium">
          {days[0].toLocaleDateString("pt-BR", { day: "2-digit", month: "short" })} —{" "}
          {days[6].toLocaleDateString("pt-BR", { day: "2-digit", month: "short" })}
        </span>
        <button onClick={() => setWeekOffset(w => w + 1)} className="p-1.5 rounded-[8px] hover:bg-[#1E1E1E] transition-colors">
          <ChevronRight size={16} className="text-[#6B7280]" />
        </button>
      </div>

      {/* Professional chips */}
      <div className="flex flex-wrap gap-2 mb-5">
        {[{ id: "all", name: "Todos", photo_url: null }, ...professionals].map(prof => {
          const active = filterProfId === prof.id;
          return (
            <button
              key={prof.id}
              onClick={() => setFilterProfId(prof.id)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-all"
              style={{
                borderColor: active ? "#C2410C" : "#2A2A2A",
                background:  active ? "#1E1E1E"  : "#161616",
                color:       active ? "#fafafa"  : "#6B7280",
                boxShadow:   active ? "0 0 0 1px rgba(194,65,12,0.30)" : "none",
              }}
            >
              {prof.photo_url ? (
                <img src={prof.photo_url} alt={prof.name} className="w-5 h-5 rounded-full object-cover shrink-0" />
              ) : prof.id !== "all" ? (
                <span className="w-5 h-5 rounded-full bg-[#2A2A2A] flex items-center justify-center text-[9px] font-bold shrink-0 text-[#6B7280]">
                  {prof.name[0].toUpperCase()}
                </span>
              ) : null}
              {prof.name}
            </button>
          );
        })}
      </div>

      {/* Day headers */}
      <div className="flex border-b border-[#2A2A2A]/20">
        <div className="w-14 shrink-0" />
        {days.map((day, i) => {
          const isToday = toISO(day) === todayISO;
          return (
            <div key={i} className="flex-1 text-center py-2">
              <div
                className="text-[10px] uppercase font-semibold mb-1"
                style={{ color: "#6B7280", letterSpacing: "0.08em" }}
              >
                {DAY_LABELS[i]}
              </div>
              <div
                className="w-7 h-7 rounded-full flex items-center justify-center text-sm font-semibold mx-auto transition-colors"
                style={{
                  background: isToday ? "#C2410C" : "transparent",
                  color: isToday ? "#F5F0E8" : "#fafafa",
                }}
              >
                {day.getDate()}
              </div>
            </div>
          );
        })}
      </div>

      {/* Scrollable time grid */}
      <div
        ref={gridRef}
        className="agenda-grid flex"
        style={{
          height: "calc(100vh - 260px)",
          overflowY: "auto",
          scrollbarWidth: "thin",
          scrollbarColor: "rgba(194,65,12,0.3) transparent",
        } as React.CSSProperties}
      >
        {/* Time column */}
        <div className="w-14 shrink-0 relative" style={{ height: TOTAL_HEIGHT }}>
          {HOURS.map(h => (
            <div
              key={h}
              className="absolute right-2"
              style={{ top: (h - START_HOUR) * HOUR_HEIGHT, paddingTop: 4 }}
            >
              <span style={{ fontFamily: "monospace", fontSize: 11, color: "#4B5563", lineHeight: 1, display: "block" }}>
                {String(h).padStart(2, "0")}:00
              </span>
            </div>
          ))}
        </div>

        {/* Day columns */}
        <div className="flex-1 grid grid-cols-7 relative" style={{ height: TOTAL_HEIGHT }}>
          {/* Hour grid lines */}
          {HOURS.map(h => (
            <div key={`h-${h}`} className="absolute left-0 right-0 pointer-events-none"
              style={{ top: (h - START_HOUR) * HOUR_HEIGHT, borderBottom: "1px solid rgba(255,255,255,0.06)" }} />
          ))}

          {/* Half-hour grid lines */}
          {HOURS.map(h => (
            <div key={`hh-${h}`} className="absolute left-0 right-0 pointer-events-none"
              style={{ top: (h - START_HOUR) * HOUR_HEIGHT + HALF_HEIGHT, borderBottom: "1px solid rgba(255,255,255,0.02)" }} />
          ))}

          {/* Now line */}
          {showNow && (
            <div className="absolute left-0 right-0 flex items-center pointer-events-none" style={{ top: nowTop, opacity: 0.7, zIndex: 1 }}>
              <span className="w-[7px] h-[7px] rounded-full bg-[#C2410C] shrink-0 -ml-[3.5px]" />
              <div className="flex-1" style={{ height: 1, background: "#C2410C" }} />
            </div>
          )}

          {/* Day columns */}
          {days.map((day, i) => {
            const iso = toISO(day);
            const dayAppts = filtered.filter(a => a.date === iso);
            return (
              <div
                key={i}
                className="relative"
                style={{
                  borderRight: i < 6 ? "1px solid rgba(255,255,255,0.04)" : "none",
                  background: i % 2 === 0 ? "rgba(255,255,255,0.01)" : "transparent",
                }}
              >
                {dayAppts.map(a => {
                  const cs = STATUS[a.status];
                  const startM = toMin(a.start_time);
                  const endM = toMin(a.end_time);
                  const top = (startM - START_HOUR * 60) / 60 * HOUR_HEIGHT;
                  const height = Math.max((endM - startM) / 60 * HOUR_HEIGHT, 24);
                  const borderHex = cs.border;
                  return (
                    <button
                      key={a.id}
                      onClick={() => setSelected(a)}
                      className="absolute left-0.5 right-0.5 rounded-[6px] text-left overflow-hidden"
                      style={{ top, height, background: cs.bg, borderLeft: `3px solid ${borderHex}`, zIndex: 2 }}
                      onMouseEnter={e => { e.currentTarget.style.boxShadow = `0 0 0 1px ${borderHex}99`; }}
                      onMouseLeave={e => { e.currentTarget.style.boxShadow = "none"; }}
                    >
                      <div className="px-1.5 py-0.5 h-full flex flex-col overflow-hidden">
                        <p className="leading-tight" style={{ color: "#ffffff", fontSize: 10, fontWeight: 500, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                          <span style={{ color: cs.border, fontFamily: "monospace" }}>{a.start_time.slice(0, 5)}</span>{" "}{a.client_name}
                        </p>
                        <p className="leading-tight" style={{ color: cs.border, opacity: 0.8, fontSize: 10, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                          {a.service.name}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>

      {/* Legend */}
      <div className="bg-[#161616] border border-[#2A2A2A] rounded-[8px] px-5 py-3 mt-4 flex flex-wrap gap-5">
        {LEGEND.map(({ label, s }) => (
          <div key={s} className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full" style={{ background: STATUS[s].border }} />
            <span style={{ color: "#9CA3AF", fontSize: 12 }}>{label}</span>
          </div>
        ))}
      </div>

      {/* Appointment detail modal */}
      {selected && (
        <Modal open onClose={() => setSelected(null)} title="Detalhes do agendamento">
          <div className="flex flex-col text-sm mb-4">
            {([
              ["Cliente",      selected.client_name],
              ["Telefone",     selected.client_phone],
              ["Email",        selected.client_email],
              ["Serviço",      selected.service.name],
              ["Profissional", selected.professional.name],
              ["Data",         new Date(selected.date + "T00:00:00").toLocaleDateString("pt-BR")],
              ["Horário",      `${selected.start_time.slice(0, 5)} — ${selected.end_time.slice(0, 5)}`],
            ] as [string, string][]).map(([k, v]) => (
              <div key={k} className="flex justify-between py-2 border-b last:border-0" style={{ borderColor: "rgba(255,255,255,0.05)" }}>
                <span style={{ color: "#6B7280", fontSize: 13 }}>{k}</span>
                <span style={{ color: "#fafafa", fontWeight: 500, fontSize: 13 }}>{v}</span>
              </div>
            ))}
          </div>
          {selected.status === "scheduled" && (
            <div className="flex gap-2">
              <button
                disabled={updating}
                className="flex-1 py-2 px-4 rounded-[10px] text-sm font-medium border transition-colors disabled:opacity-50"
                style={{ background: "#161616", borderColor: "#22C55E", color: "#22C55E" }}
                onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = "#142a1e"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = "#161616"; }}
                onClick={async () => { setUpdating(true); await onUpdateStatus(selected.id, "completed"); setUpdating(false); setSelected(null); }}
              >
                {updating ? "..." : "Marcar concluído"}
              </button>
              <button
                disabled={updating}
                className="flex-1 py-2 px-4 rounded-[10px] text-sm font-medium transition-colors disabled:opacity-50"
                style={{ background: "#C2410C", color: "#F5F0E8" }}
                onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = "#9A3412"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = "#C2410C"; }}
                onClick={async () => { setUpdating(true); await onUpdateStatus(selected.id, "cancelled"); notifyClientOfCancellation(selected.id).catch(console.error); setUpdating(false); setSelected(null); }}
              >
                {updating ? "..." : "Cancelar"}
              </button>
            </div>
          )}
          {selected.status !== "scheduled" && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border"
              style={{ background: STATUS[selected.status].bg, borderColor: STATUS[selected.status].border, color: STATUS[selected.status].color }}>
              {selected.status === "completed" ? "Concluído" : selected.status === "no_show" ? "Não compareceu" : "Cancelado"}
            </span>
          )}
        </Modal>
      )}
    </div>
  );
}
