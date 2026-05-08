"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Progress } from "@/components/ui/Progress";
import { StepBusiness } from "./StepBusiness";
import { StepHours } from "./StepHours";
import { StepServices } from "./StepServices";
import { StepProfessionals } from "./StepProfessionals";
import { createClient } from "@/lib/supabase";
import type {
  BusinessFormData,
  WorkingHoursFormData,
  ServiceFormData,
  ProfessionalFormData,
} from "@/types";

const STEP_TITLES = [
  "Dados do negócio",
  "Horários de funcionamento",
  "Serviços",
  "Profissionais",
];

export function OnboardingFlow({ userId }: { userId: string }) {
  const [step, setStep] = useState(0);
  const [saving, setSaving] = useState(false);
  const [businessData, setBusinessData] = useState<BusinessFormData | null>(null);
  const [hoursData, setHoursData] = useState<WorkingHoursFormData[]>([]);
  const [servicesData, setServicesData] = useState<ServiceFormData[]>([]);
  const router = useRouter();
  const supabase = createClient();

  async function handleFinish(professionals: ProfessionalFormData[]) {
    if (!businessData) return;
    setSaving(true);

    const { data: business, error: bizError } = await supabase
      .from("businesses")
      .insert({
        owner_id: userId,
        name: businessData.name,
        slug: businessData.slug,
        description: businessData.description || null,
        address: businessData.address || null,
        city: businessData.city || null,
        phone: businessData.phone || null,
        maps_embed_url: businessData.maps_embed_url || null,
      })
      .select()
      .single();

    if (bizError || !business) { setSaving(false); return; }

    const { data: insertedServices } = await supabase
      .from("services")
      .insert(
        servicesData.map((s) => ({
          business_id: business.id,
          name: s.name,
          price: parseFloat(s.price.replace(/\./g, "").replace(",", ".")),
          duration_minutes: s.duration_minutes,
        }))
      )
      .select();

    if (!insertedServices) { setSaving(false); return; }

    const activeHours = hoursData.filter((h) => h.enabled);
    const { data: insertedProfs } = await supabase
      .from("professionals")
      .insert(
        professionals.map((p) => ({
          business_id: business.id,
          name: p.name,
          specialty: p.specialty || null,
        }))
      )
      .select();

    if (!insertedProfs) { setSaving(false); return; }

    const whRows = insertedProfs.flatMap((prof, pi) => {
      const profData = professionals[pi];
      return activeHours.map((h) => ({
        professional_id: prof.id,
        day_of_week: h.day_of_week,
        start_time: h.start_time,
        end_time: h.end_time,
        lunch_start: h.lunch_start || null,
        lunch_end: h.lunch_end || null,
      }));
    });

    if (whRows.length) await supabase.from("working_hours").insert(whRows);

    const psRows = insertedProfs.flatMap((prof, pi) => {
      const profData = professionals[pi];
      return profData.service_ids
        .map((key) => {
          const idx = parseInt(key.replace("svc-", ""), 10);
          return insertedServices[idx]
            ? { professional_id: prof.id, service_id: insertedServices[idx].id }
            : null;
        })
        .filter(Boolean);
    });

    if (psRows.length) await supabase.from("professional_services").insert(psRows as { professional_id: string; service_id: string }[]);

    router.push("/dashboard");
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-white rounded-[20px] shadow-[0_4px_24px_rgba(37,99,235,0.08)] p-8">
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xl font-bold text-[#09090b]">Configurar negócio</span>
            <span className="text-sm text-[#6b7280]">{step + 1} / {STEP_TITLES.length}</span>
          </div>
          <p className="text-sm text-[#6b7280] mb-3">{STEP_TITLES[step]}</p>
          <Progress value={((step + 1) / STEP_TITLES.length) * 100} />
        </div>

        {step === 0 && (
          <StepBusiness
            initial={businessData ?? {}}
            onNext={(d) => { setBusinessData(d); setStep(1); }}
          />
        )}
        {step === 1 && (
          <StepHours
            initial={hoursData}
            onNext={(d) => { setHoursData(d); setStep(2); }}
            onBack={() => setStep(0)}
          />
        )}
        {step === 2 && (
          <StepServices
            initial={servicesData}
            onNext={(d) => { setServicesData(d); setStep(3); }}
            onBack={() => setStep(1)}
          />
        )}
        {step === 3 && (
          <StepProfessionals
            services={servicesData}
            initial={[]}
            onFinish={handleFinish}
            onBack={() => setStep(2)}
            loading={saving}
          />
        )}
      </div>
    </div>
  );
}
