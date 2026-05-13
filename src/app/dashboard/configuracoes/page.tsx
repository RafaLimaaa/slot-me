"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Image as ImageIcon, Building2, Clock, Scissors, Users, CalendarOff } from "lucide-react";
import { Spinner } from "@/components/ui/Spinner";
import { SectionCard } from "@/components/dashboard/SectionCard";
import { BusinessSection } from "@/components/dashboard/BusinessSection";
import { ServicesSection } from "@/components/dashboard/ServicesSection";
import { ProfessionalsSection } from "@/components/dashboard/ProfessionalsSection";
import { ImageUploadSection } from "@/components/dashboard/ImageUploadSection";
import { WorkingHoursSection } from "@/components/dashboard/WorkingHoursSection";
import { BlockedPeriodsSection } from "@/components/dashboard/BlockedPeriodsSection";
import { useAuth } from "@/hooks/useAuth";
import { useBusiness } from "@/hooks/useBusiness";

export default function ConfiguracoesPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const { business, services, professionals, workingHours, loading, refetch } = useBusiness(user?.id);

  useEffect(() => {
    if (!authLoading && !loading && !business) router.replace("/dashboard/onboarding");
  }, [authLoading, loading, business, router]);

  if (authLoading || (loading && !business)) {
    return <div className="flex items-center justify-center h-64"><Spinner size={32} /></div>;
  }
  if (!business) return null;

  return (
    <div className="max-w-2xl flex flex-col gap-5">
      <h1 className="text-xl font-bold text-[#fafafa]">Configurações</h1>

      <SectionCard
        icon={ImageIcon}
        title="Fotos"
        complete={!!(business.cover_url || business.logo_url)}
      >
        <ImageUploadSection business={business} onRefetch={refetch} />
      </SectionCard>

      <SectionCard icon={Building2} title="Dados do negócio" complete={true}>
        <BusinessSection business={business} onRefetch={refetch} />
      </SectionCard>

      <SectionCard
        icon={Clock}
        title="Horários de funcionamento"
        complete={workingHours.length > 0}
      >
        <WorkingHoursSection
          professionals={professionals}
          workingHours={workingHours}
          onRefetch={refetch}
        />
      </SectionCard>

      <SectionCard icon={Scissors} title="Serviços" complete={services.length > 0}>
        <ServicesSection businessId={business.id} services={services} onRefetch={refetch} />
      </SectionCard>

      <SectionCard icon={Users} title="Profissionais" complete={professionals.length > 0}>
        <ProfessionalsSection
          businessId={business.id}
          services={services}
          professionals={professionals}
          onRefetch={refetch}
        />
      </SectionCard>

      <SectionCard icon={CalendarOff} title="Bloqueios de horário" complete={null}>
        <BlockedPeriodsSection professionals={professionals} />
      </SectionCard>
    </div>
  );
}
