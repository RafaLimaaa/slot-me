"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Spinner } from "@/components/ui/Spinner";
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

  if (authLoading || (loading && !business)) return (
    <div className="flex items-center justify-center h-64"><Spinner size={32} /></div>
  );
  if (!business) return null;

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
      <BlockedPeriodsSection professionals={professionals} />
    </div>
  );
}
