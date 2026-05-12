"use client";

import Link from "next/link";
import { CheckCircle, CalendarPlus, X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import type { AppointmentWithDetails, Business } from "@/types";

interface Props {
  appointment: AppointmentWithDetails;
  business: Business;
  slug: string;
}

export function BookingSuccess({ appointment: a, business, slug }: Props) {
  const date = new Date(a.date + "T00:00:00").toLocaleDateString("pt-BR", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  const gcalDate = a.date.replace(/-/g, "");
  const [sh, sm] = a.start_time.split(":");
  const [eh, em] = a.end_time.split(":");
  const gcalStart = `${gcalDate}T${sh}${sm}00`;
  const gcalEnd = `${gcalDate}T${eh}${em}00`;
  const gcalUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(`${a.service.name} — ${business.name}`)}&dates=${gcalStart}/${gcalEnd}&location=${encodeURIComponent(business.address ?? business.city ?? "")}`;

  const brl = (v: number) => v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

  return (
    <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-[20px] shadow-[0_4px_24px_rgba(37,99,235,0.08)] p-8 text-center">
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 rounded-full bg-[#dcfce7] flex items-center justify-center">
            <CheckCircle size={32} className="text-[#16a34a]" />
          </div>
        </div>

        <h1 className="text-xl font-bold text-[#09090b] mb-1">Agendamento confirmado</h1>
        <p className="text-[#6b7280] text-sm mb-6">
          Um email de confirmação foi enviado para {a.client_email}.
        </p>

        <div className="bg-[#f8fafc] rounded-[12px] p-4 text-left mb-6">
          {[
            ["Serviço", `${a.service.name} — ${brl(a.service.price)}`],
            ["Profissional", a.professional.name],
            ["Data", date],
            ["Horário", a.start_time.slice(0, 5)],
            business.address ? ["Endereço", `${business.address}${business.city ? `, ${business.city}` : ""}`] : null,
          ].filter((row): row is [string, string] => row !== null).map(([k, v]) => (
            <div key={k} className="flex justify-between text-sm py-1.5 border-b border-[#f1f5f9] last:border-0">
              <span className="text-[#6b7280]">{k}</span>
              <span className="text-[#09090b] font-medium text-right">{v}</span>
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-2">
          <a href={gcalUrl} target="_blank" rel="noopener noreferrer">
            <Button variant="secondary" className="w-full" size="sm">
              <CalendarPlus size={15} /> Adicionar ao Google Calendar
            </Button>
          </a>
          <Link href={`/cancelar/${a.cancel_token}`}>
            <Button variant="ghost" className="w-full" size="sm">
              <X size={15} /> Cancelar agendamento
            </Button>
          </Link>
          <Link href={`/${slug}`}>
            <Button variant="ghost" className="w-full text-[#6b7280]" size="sm">
              Voltar para a página do negócio
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
