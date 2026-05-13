"use client";

import { useState } from "react";
import Link from "next/link";
import { Copy, Check, ExternalLink, Link2, Calendar, CalendarOff, Plus } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import type { AppointmentWithDetails, Business } from "@/types";

function toISO(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function dayLabel(dateStr: string): string {
  const today = toISO(new Date());
  const tomorrow = toISO(new Date(Date.now() + 86400000));
  if (dateStr === today) return "Hoje";
  if (dateStr === tomorrow) return "Amanhã";
  return new Date(dateStr + "T00:00:00").toLocaleDateString("pt-BR", {
    weekday: "short",
    day: "2-digit",
    month: "short",
  });
}

interface Props {
  business: Business;
  appointments: AppointmentWithDetails[];
}

export function DashboardSidebar({ business, appointments }: Props) {
  const [copied, setCopied] = useState(false);
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
  const publicUrl = `${appUrl}/${business.slug}`;

  const today = toISO(new Date());
  const upcoming = appointments
    .filter((a) => a.date >= today && a.status === "scheduled")
    .sort((a, b) => a.date.localeCompare(b.date) || a.start_time.localeCompare(b.start_time))
    .slice(0, 5);

  const grouped = upcoming.reduce<Record<string, AppointmentWithDetails[]>>((acc, a) => {
    (acc[a.date] ??= []).push(a);
    return acc;
  }, {});

  async function copyLink() {
    await navigator.clipboard.writeText(publicUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="bg-[#161616] border border-[#2A2A2A] rounded-[12px] p-5">
        <div className="flex items-center gap-2 mb-4">
          <Link2 size={14} className="text-[#C2410C]" />
          <span className="text-[#fafafa] text-sm font-semibold">Seu link público</span>
        </div>
        <div className="flex justify-center mb-4">
          <div className="p-2 bg-white rounded-[8px]">
            <QRCodeSVG value={publicUrl} size={112} />
          </div>
        </div>
        <a
          href={publicUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 text-xs text-[#6B7280] hover:text-[#C2410C] transition-colors mb-3"
        >
          <ExternalLink size={11} className="shrink-0" />
          <span className="truncate">{publicUrl.replace(/^https?:\/\//, "")}</span>
        </a>
        <button
          onClick={copyLink}
          className="w-full flex items-center justify-center gap-2 py-2 rounded-[8px] text-sm font-medium border transition-all"
          style={{
            borderColor: copied ? "#3D6B4F" : "#C2410C",
            color: copied ? "#4ADE80" : "#C2410C",
          }}
        >
          {copied ? <Check size={14} /> : <Copy size={14} />}
          {copied ? "Link copiado!" : "Copiar link"}
        </button>
      </div>

      <div className="bg-[#161616] border border-[#2A2A2A] rounded-[12px] p-5">
        <div className="flex items-center gap-2 mb-4">
          <Calendar size={14} className="text-[#C2410C]" />
          <span className="text-[#fafafa] text-sm font-semibold">Próximos agendamentos</span>
        </div>
        {upcoming.length === 0 ? (
          <p className="text-[#6B7280] text-xs text-center py-2">Nenhum agendamento futuro.</p>
        ) : (
          <div className="flex flex-col gap-3">
            {Object.entries(grouped).map(([date, appts]) => (
              <div key={date}>
                <p className="text-[#6B7280] text-[10px] font-semibold uppercase tracking-wider mb-1.5">
                  {dayLabel(date)}
                </p>
                {appts.map((a) => (
                  <div key={a.id} className="flex items-start gap-2 mb-1.5">
                    <span className="text-[#9A3412] text-xs font-mono w-10 shrink-0 pt-0.5">
                      {a.start_time.slice(0, 5)}
                    </span>
                    <div className="min-w-0">
                      <p className="text-[#fafafa] text-xs font-medium truncate">{a.client_name}</p>
                      <p className="text-[#6B7280] text-[10px] truncate">{a.service.name}</p>
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="bg-[#161616] border border-[#2A2A2A] rounded-[12px] p-5">
        <p className="text-[#fafafa] text-sm font-semibold mb-4">Ações rápidas</p>
        <div className="flex flex-col gap-2">
          <Link
            href="/dashboard/configuracoes"
            className="flex items-center gap-2 px-3 py-2.5 rounded-[8px] text-sm font-medium border border-[#C2410C] text-[#C2410C] hover:bg-[#C2410C] hover:text-white transition-all"
          >
            <CalendarOff size={14} />
            Bloquear horário
          </Link>
          <Link
            href="/dashboard/configuracoes"
            className="flex items-center gap-2 px-3 py-2.5 rounded-[8px] text-sm font-medium border border-[#C2410C] text-[#C2410C] hover:bg-[#C2410C] hover:text-white transition-all"
          >
            <Plus size={14} />
            Adicionar serviço
          </Link>
        </div>
      </div>
    </div>
  );
}
