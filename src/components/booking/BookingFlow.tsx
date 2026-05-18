"use client";

import { Fragment, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Check,
  ChevronLeft,
  Scissors,
  User,
  CalendarDays,
  ClipboardList,
  Clock,
} from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { StepService } from "./StepService";
import { StepProfessional } from "./StepProfessional";
import { StepDateTime } from "./StepDateTime";
import { StepConfirmation } from "./StepConfirmation";
import { createClient } from "@/lib/supabase";
import { sendBookingEmails } from "@/app/actions";
import type {
  Business,
  Service,
  ProfessionalWithServices,
  BookingFormData,
  AppointmentWithDetails,
} from "@/types";

const STEPS = [
  { label: "Serviço", icon: Scissors },
  { label: "Profissional", icon: User },
  { label: "Data e horário", icon: CalendarDays },
  { label: "Confirmação", icon: ClipboardList },
];

interface Props {
  business: Business;
  services: Service[];
  professionals: ProfessionalWithServices[];
  initialServiceId?: string;
  initialProfessionalId?: string;
}

export function BookingFlow({
  business,
  services,
  professionals,
  initialServiceId,
  initialProfessionalId,
}: Props) {
  const preService = initialServiceId
    ? (services.find((s) => s.id === initialServiceId) ?? null)
    : null;
  const preProf = initialProfessionalId
    ? (professionals.find((p) => p.id === initialProfessionalId) ?? null)
    : null;
  const [step, setStep] = useState(preService && preProf ? 2 : preService ? 1 : 0);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<BookingFormData>({
    service: preService,
    professional: preProf,
    date: null,
    time: null,
    clientName: "",
    clientPhone: "",
    clientEmail: "",
  });
  const router = useRouter();
  const supabase = createClient();

  function canAdvance() {
    if (step === 0) return !!form.service;
    if (step === 1) return !!form.professional;
    if (step === 2) return !!(form.date && form.time);
    return false;
  }

  async function handleConfirm() {
    if (!form.service || !form.professional || !form.date || !form.time) return;
    setSaving(true);

    const [h, m] = form.time.split(":").map(Number);
    const endMinutes = h * 60 + m + form.service.duration_minutes;
    const endTime = `${String(Math.floor(endMinutes / 60)).padStart(2, "0")}:${String(endMinutes % 60).padStart(2, "0")}`;

    const { data, error } = await supabase
      .from("appointments")
      .insert({
        business_id: business.id,
        professional_id: form.professional.id,
        service_id: form.service.id,
        client_name: form.clientName,
        client_phone: form.clientPhone,
        client_email: form.clientEmail,
        date: form.date,
        start_time: form.time,
        end_time: endTime,
        status: "scheduled",
      })
      .select()
      .single();

    if (error || !data) {
      setSaving(false);
      return;
    }

    const apptWithDetails: AppointmentWithDetails = {
      ...data,
      professional: {
        id: form.professional.id,
        name: form.professional.name,
        photo_url: form.professional.photo_url,
        specialty: form.professional.specialty,
      },
      service: {
        id: form.service.id,
        name: form.service.name,
        price: form.service.price,
        duration_minutes: form.service.duration_minutes,
      },
    };

    const { error: emailErr } = await sendBookingEmails(apptWithDetails, business);
    setSaving(false);
    router.push(
      `/${business.slug}/agendar/sucesso?id=${data.id}${emailErr ? "&email=erro" : ""}`
    );
  }

  const brl = (v: number) => v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
  const formatDate = (date: string) =>
    new Date(date + "T00:00:00").toLocaleDateString("pt-BR", {
      weekday: "short",
      day: "2-digit",
      month: "short",
    });

  const summaryItems = [
    {
      icon: Scissors,
      label: "Serviço",
      value: form.service ? `${form.service.name} — ${brl(form.service.price)}` : null,
    },
    { icon: User, label: "Profissional", value: form.professional?.name ?? null },
    { icon: CalendarDays, label: "Data", value: form.date ? formatDate(form.date) : null },
    { icon: Clock, label: "Horário", value: form.time ?? null },
  ];

  return (
    <div className="min-h-screen">
      {/* Left panel — fixed on desktop, block on mobile */}
      <div
        className="bg-[#0C0C0C] relative overflow-hidden
          lg:fixed lg:left-0 lg:top-0 lg:bottom-0 lg:w-[420px]
          lg:flex lg:flex-col lg:justify-center"
        style={{
          backgroundImage: `
            linear-gradient(rgba(194,65,12,0.07) 1px, transparent 1px),
            linear-gradient(90deg, rgba(194,65,12,0.07) 1px, transparent 1px)
          `,
          backgroundSize: "32px 32px",
        }}
      >
        {/* Glow radial — centrado verticalmente, ocupa 60% da altura */}
        <div
          className="absolute left-0 w-full pointer-events-none"
          style={{
            top: "20%",
            height: "60%",
            background:
              "radial-gradient(ellipse at center, rgba(194,65,12,0.18) 0%, transparent 65%)",
          }}
        />

        <div className="relative z-10 p-5 lg:p-10">
          {/* Mobile: compact row */}
          <div className="flex items-center gap-3 lg:hidden">
            {business.logo_url ? (
              <div className="relative w-10 h-10 rounded-[10px] overflow-hidden border border-white/10 shrink-0">
                <Image src={business.logo_url} alt="Logo" fill className="object-cover" />
              </div>
            ) : (
              <div className="w-10 h-10 rounded-[10px] bg-[#C2410C]/20 flex items-center justify-center text-[#C2410C] font-bold text-lg shrink-0">
                {business.name.charAt(0)}
              </div>
            )}
            <div className="min-w-0">
              <p className="text-white font-semibold text-sm truncate">{business.name}</p>
              {form.service && (
                <p className="text-[#9CA3AF] text-xs truncate">{form.service.name}</p>
              )}
            </div>
          </div>

          {/* Desktop: logo + name */}
          <div className="hidden lg:flex lg:flex-col lg:items-center lg:text-center">
            {business.logo_url ? (
              <div
                className="relative overflow-hidden"
                style={{
                  width: 64,
                  height: 64,
                  borderRadius: 12,
                  border: "2px solid rgba(255,255,255,0.10)",
                }}
              >
                <Image src={business.logo_url} alt="Logo" fill className="object-cover" />
              </div>
            ) : (
              <div
                className="flex items-center justify-center bg-[#C2410C]/20 text-[#C2410C] font-bold text-2xl"
                style={{
                  width: 64,
                  height: 64,
                  borderRadius: 12,
                  border: "2px solid rgba(255,255,255,0.10)",
                }}
              >
                {business.name.charAt(0)}
              </div>
            )}
            <p className="text-white font-semibold mt-4" style={{ fontSize: 20 }}>
              {business.name}
            </p>
          </div>

          {/* Desktop: summary */}
          <div className="hidden lg:block">
            <div className="border-t border-white/[0.08] my-5" />
            {summaryItems.map(({ icon: Icon, label, value }) => (
              <div key={label} className="flex items-start gap-3 py-2.5">
                <Icon
                  size={15}
                  className={`mt-0.5 shrink-0 ${value ? "text-[#C2410C]" : "text-[#4B5563]"}`}
                />
                <div className="flex-1 min-w-0 text-left">
                  <p className={`text-xs ${value ? "text-[#9CA3AF]" : "text-[#4B5563]"}`}>
                    {label}
                  </p>
                  <p
                    className={`text-sm font-medium truncate ${
                      value ? "text-white" : "text-[#4B5563]"
                    }`}
                  >
                    {value ?? "—"}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel — offset by left panel width on desktop */}
      <div className="bg-[#F5F0E8] min-h-screen lg:ml-[420px]">
        <div className="p-5 lg:p-10 pb-28 lg:pb-10">
          {/* Step progress bar */}
          <div className="flex items-start mb-8">
            {STEPS.map(({ label, icon: Icon }, i) => (
              <Fragment key={i}>
                <div className="flex flex-col items-center">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors duration-200
                      ${i <= step ? "bg-[#C2410C]" : "bg-[#E8E0D5]"}`}
                  >
                    {i < step ? (
                      <Check size={14} className="text-white" />
                    ) : i === step ? (
                      <Icon size={14} className="text-white" />
                    ) : (
                      <span className="text-xs font-medium text-[#9CA3AF]">{i + 1}</span>
                    )}
                  </div>
                  <span
                    className={`hidden sm:block text-xs mt-1 text-center leading-tight max-w-[60px]
                      ${i <= step ? "text-[#C2410C]" : "text-[#9CA3AF]"}`}
                  >
                    {label}
                  </span>
                </div>
                {i < STEPS.length - 1 && (
                  <div
                    className="flex-1 h-px mx-2 mt-4 transition-colors duration-200"
                    style={{ background: i < step ? "#C2410C" : "#E8E0D5" }}
                  />
                )}
              </Fragment>
            ))}
          </div>

          {/* Step title + back button */}
          <div className="flex items-center gap-2 mb-5">
            {step > 0 && (
              <button
                onClick={() => setStep((s) => s - 1)}
                className="text-[#6B7280] hover:text-[#1A1A1A] transition-colors hidden md:block"
              >
                <ChevronLeft size={20} />
              </button>
            )}
            <h2 className="text-lg font-semibold text-[#1A1A1A]">{STEPS[step].label}</h2>
          </div>

          {/* Step content */}
          {step === 0 && (
            <StepService
              services={services}
              selected={form.service}
              onSelect={(s) =>
                setForm((f) => ({ ...f, service: s, professional: null, date: null, time: null }))
              }
            />
          )}
          {step === 1 && form.service && (
            <StepProfessional
              professionals={professionals}
              selectedServiceId={form.service.id}
              selected={form.professional}
              onSelect={(p) => setForm((f) => ({ ...f, professional: p, date: null, time: null }))}
            />
          )}
          {step === 2 && form.professional && form.service && (
            <StepDateTime
              professionalId={form.professional.id}
              serviceDuration={form.service.duration_minutes}
              selectedDate={form.date}
              selectedTime={form.time}
              onSelectDate={(d) => setForm((f) => ({ ...f, date: d, time: null }))}
              onSelectTime={(t) => setForm((f) => ({ ...f, time: t }))}
            />
          )}
          {step === 3 && (
            <StepConfirmation
              form={form}
              onChangeClient={(field, value) => setForm((f) => ({ ...f, [field]: value }))}
              onConfirm={handleConfirm}
              loading={saving}
            />
          )}

          {/* Desktop: next button */}
          {step < 3 && (
            <div className="mt-6 hidden md:block">
              <Button
                className="w-full"
                disabled={!canAdvance()}
                onClick={() => setStep((s) => s + 1)}
              >
                Próximo
              </Button>
            </div>
          )}
        </div>

        {/* Mobile bottom nav */}
        {step < 3 && (
          <div className="fixed bottom-0 left-0 right-0 md:hidden z-10 bg-[#F5F0E8] border-t border-[#E8E0D5] p-4 flex gap-3">
            {step > 0 && (
              <Button
                variant="secondary"
                className="flex-1"
                onClick={() => setStep((s) => s - 1)}
              >
                Voltar
              </Button>
            )}
            <Button
              className="flex-1"
              disabled={!canAdvance()}
              onClick={() => setStep((s) => s + 1)}
            >
              Próximo
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
