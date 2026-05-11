"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { Progress } from "@/components/ui/Progress";
import { Button } from "@/components/ui/Button";
import { StepService } from "./StepService";
import { StepProfessional } from "./StepProfessional";
import { StepDateTime } from "./StepDateTime";
import { StepConfirmation } from "./StepConfirmation";
import { createClient } from "@/lib/supabase";
import { sendBookingEmails } from "@/app/actions";
import type { Business, Service, ProfessionalWithServices, BookingFormData, AppointmentWithDetails } from "@/types";

const STEPS = ["Serviço", "Profissional", "Data e horário", "Confirmação"];

interface Props {
  business: Business;
  services: Service[];
  professionals: ProfessionalWithServices[];
}

export function BookingFlow({ business, services, professionals }: Props) {
  const [step, setStep] = useState(0);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<BookingFormData>({
    service: null,
    professional: null,
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

    setSaving(false);
    if (!error && data) {
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
      sendBookingEmails(apptWithDetails, business).catch((e) =>
        console.error("[BookingFlow] sendBookingEmails:", e)
      );
      router.push(`/${business.slug}/agendar/sucesso?id=${data.id}`);
    }
  }

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          {step > 0 && (
            <button
              onClick={() => setStep((s) => s - 1)}
              className="text-[#6b7280] hover:text-[#09090b] transition-colors"
            >
              <ChevronLeft size={20} />
            </button>
          )}
          <div className="flex-1">
            <p className="text-xs text-[#6b7280] mb-1">{business.name}</p>
            <p className="text-sm font-semibold text-[#09090b]">{STEPS[step]}</p>
          </div>
          <span className="text-xs text-[#6b7280]">{step + 1}/{STEPS.length}</span>
        </div>
        <Progress value={((step + 1) / STEPS.length) * 100} className="mb-8" />

        {step === 0 && (
          <StepService
            services={services}
            selected={form.service}
            onSelect={(s) => setForm((f) => ({ ...f, service: s, professional: null, date: null, time: null }))}
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

        {step < 3 && (
          <div className="mt-6">
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
        <div className="fixed bottom-0 left-0 right-0 md:hidden bg-white border-t border-[#f1f5f9] p-4 flex gap-3">
          {step > 0 && (
            <Button variant="secondary" className="flex-1" onClick={() => setStep((s) => s - 1)}>
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
  );
}
