"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Spinner } from "@/components/ui/Spinner";
import { WeeklyCalendar } from "@/components/dashboard/WeeklyCalendar";
import { useAuth } from "@/hooks/useAuth";
import { useBusiness } from "@/hooks/useBusiness";
import { useAppointments } from "@/hooks/useAppointments";

export default function AgendaPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const { business, professionals, loading: bizLoading } = useBusiness(user?.id);
  const { appointments, loading: apptLoading, updateStatus } = useAppointments(business?.id);

  useEffect(() => {
    if (!authLoading && !bizLoading && !business) {
      router.replace("/dashboard/onboarding");
    }
  }, [authLoading, bizLoading, business, router]);

  if (authLoading || bizLoading || apptLoading || !business) {
    return (
      <div className="flex items-center justify-center h-64">
        <Spinner size={32} />
      </div>
    );
  }

  return (
    <div
      style={{
        backgroundImage:
          "linear-gradient(rgba(194,65,12,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(194,65,12,0.05) 1px, transparent 1px)",
        backgroundSize: "32px 32px",
      }}
    >
      <h1 className="text-xl font-bold text-[#fafafa] mb-5">Agenda semanal</h1>
      <div className="bg-[#161616] border border-[#2A2A2A] rounded-[16px] p-5">
        <WeeklyCalendar
          appointments={appointments}
          professionals={professionals}
          onUpdateStatus={updateStatus}
        />
      </div>
    </div>
  );
}
