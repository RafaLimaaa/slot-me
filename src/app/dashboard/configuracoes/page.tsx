"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Spinner } from "@/components/ui/Spinner";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { BusinessSection } from "@/components/dashboard/BusinessSection";
import { ServicesSection } from "@/components/dashboard/ServicesSection";
import { ProfessionalsSection } from "@/components/dashboard/ProfessionalsSection";
import { ImageUploadSection } from "@/components/dashboard/ImageUploadSection";
import { WorkingHoursSection } from "@/components/dashboard/WorkingHoursSection";
import { useAuth } from "@/hooks/useAuth";
import { useBusiness } from "@/hooks/useBusiness";
import { createClient } from "@/lib/supabase";

export default function ConfiguracoesPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const { business, services, professionals, workingHours, loading, refetch } = useBusiness(user?.id);
  const [blockForm, setBlockForm] = useState({
    professional_id: "", date: "", start_time: "", end_time: "", reason: "",
  });
  const [blocking, setBlocking] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    if (!authLoading && !loading && !business) router.replace("/dashboard/onboarding");
  }, [authLoading, loading, business, router]);

  if (authLoading || (loading && !business)) return (
    <div className="flex items-center justify-center h-64"><Spinner size={32} /></div>
  );
  if (!business) return null;

  async function handleBlock(e: React.FormEvent) {
    e.preventDefault();
    if (!blockForm.professional_id || !blockForm.date || !blockForm.start_time || !blockForm.end_time) return;
    setBlocking(true);
    await supabase.from("blocked_periods").insert({
      professional_id: blockForm.professional_id, date: blockForm.date,
      start_time: blockForm.start_time, end_time: blockForm.end_time,
      reason: blockForm.reason || null,
    });
    setBlocking(false);
    setBlockForm({ professional_id: "", date: "", start_time: "", end_time: "", reason: "" });
  }

  return (
    <div className="max-w-2xl flex flex-col gap-8">
      <h1 className="text-2xl font-bold text-[#fafafa]">Configurações</h1>

      <ImageUploadSection business={business} onRefetch={refetch} />
      <BusinessSection business={business} onRefetch={refetch} />
      <ServicesSection businessId={business.id} services={services} onRefetch={refetch} />
      <ProfessionalsSection
        businessId={business.id}
        services={services}
        professionals={professionals}
        onRefetch={refetch}
      />
      <WorkingHoursSection
        professionals={professionals}
        workingHours={workingHours}
        onRefetch={refetch}
      />

      <section className="bg-[#18181b] border border-[#27272a] rounded-[12px] p-5">
        <h2 className="text-[#fafafa] font-semibold mb-4">Bloquear horário</h2>
        <form onSubmit={handleBlock} className="flex flex-col gap-3">
          <Select
            label="Profissional"
            value={blockForm.professional_id}
            options={[{ value: "", label: "Selecione..." }, ...professionals.map((p) => ({ value: p.id, label: p.name }))]}
            onChange={(e) => setBlockForm((f) => ({ ...f, professional_id: e.target.value }))}
          />
          <Input label="Data" type="date" value={blockForm.date}
            onChange={(e) => setBlockForm((f) => ({ ...f, date: e.target.value }))} />
          <div className="grid grid-cols-2 gap-3">
            <Input label="Início" type="time" value={blockForm.start_time}
              onChange={(e) => setBlockForm((f) => ({ ...f, start_time: e.target.value }))} />
            <Input label="Fim" type="time" value={blockForm.end_time}
              onChange={(e) => setBlockForm((f) => ({ ...f, end_time: e.target.value }))} />
          </div>
          <Input label="Motivo (opcional)" value={blockForm.reason}
            onChange={(e) => setBlockForm((f) => ({ ...f, reason: e.target.value }))} />
          <Button type="submit" loading={blocking} className="w-full">Bloquear horário</Button>
        </form>
      </section>
    </div>
  );
}
