"use client";

import Link from "next/link";
import { Check, Calendar, X } from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import type { AppointmentWithDetails, Business } from "@/types";

interface Props {
  appointment: AppointmentWithDetails;
  business: Business;
  slug: string;
  emailError?: boolean;
}

export function BookingSuccess({ appointment: a, business, slug, emailError }: Props) {
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

  const summaryRows = [
    ["Serviço", `${a.service.name} — ${brl(a.service.price)}`],
    ["Profissional", a.professional.name],
    ["Data", date],
    ["Horário", a.start_time.slice(0, 5)],
    business.address
      ? ["Endereço", `${business.address}${business.city ? `, ${business.city}` : ""}`]
      : null,
  ].filter((row): row is [string, string] => row !== null);

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4 py-12"
      style={{
        background: "#F5F0E8",
        backgroundImage: `
          linear-gradient(rgba(194,65,12,0.03) 1px, transparent 1px),
          linear-gradient(90deg, rgba(194,65,12,0.03) 1px, transparent 1px)
        `,
        backgroundSize: "32px 32px",
      }}
    >
      <div
        className="w-full text-center"
        style={{
          maxWidth: 480,
          background: "#FFFFFF",
          border: "1px solid #E8E0D5",
          borderRadius: 20,
          padding: 40,
        }}
      >
        {/* Ícone de sucesso */}
        <div className="flex justify-center mb-5">
          <div
            className="flex items-center justify-center"
            style={{
              width: 64,
              height: 64,
              borderRadius: "50%",
              background: "rgba(34,197,94,0.10)",
              border: "2px solid #22C55E",
            }}
          >
            <Check size={28} className="text-[#22C55E]" />
          </div>
        </div>

        <h1 className="font-semibold text-[#1A1A1A] mb-2" style={{ fontSize: 22 }}>
          Agendamento confirmado
        </h1>

        {emailError ? (
          <p className="text-sm mb-5 bg-[#fef3c7] text-[#b45309] rounded-[8px] px-3 py-2">
            Agendamento criado, mas não foi possível enviar o email de confirmação. Guarde as
            informações abaixo.
          </p>
        ) : (
          <p className="text-[#6B7280] text-sm mb-5">
            Um email de confirmação foi enviado para {a.client_email}.
          </p>
        )}

        {/* Resumo */}
        <div className="border-t border-[#E8E0D5] mb-1" />
        <div className="text-left">
          {summaryRows.map(([k, v]) => (
            <div
              key={k}
              className="flex justify-between text-sm py-2.5"
              style={{ borderBottom: "1px solid #F5F0E8" }}
            >
              <span className="text-[#9CA3AF] shrink-0">{k}</span>
              <span className="text-[#1A1A1A] font-medium text-right ml-4">{v}</span>
            </div>
          ))}
        </div>

        {/* Ações */}
        <div className="flex flex-col gap-3 mt-6">
          <a
            href={gcalUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 text-sm font-medium
              bg-white border border-[#E8E0D5] rounded-[12px] px-4 py-2.5
              text-[#1A1A1A] hover:border-[#C2410C] transition-colors duration-200"
          >
            <Calendar size={15} /> Adicionar ao Google Calendar
          </a>

          <Link
            href={`/cancelar/${a.cancel_token}`}
            className="inline-flex items-center justify-center gap-2 text-sm font-medium
              text-[#EF4444] hover:opacity-80 transition-opacity py-2"
          >
            <X size={15} /> Cancelar agendamento
          </Link>

          <Link
            href={`/${slug}`}
            className="inline-flex items-center justify-center text-sm font-medium
              text-[#C2410C] hover:underline py-2"
          >
            Voltar para a página do negócio
          </Link>
        </div>

        {/* Logo SlotMe */}
        <div className="mt-8 flex justify-center opacity-40">
          <Logo size="sm" />
        </div>
      </div>
    </div>
  );
}
