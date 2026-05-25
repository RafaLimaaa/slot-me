"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { CalendarDays } from "lucide-react";
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
      router.replace("/onboarding");
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
      <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 24 }}>
        <div style={{
          width: 40, height: 40, borderRadius: 10,
          background: "rgba(194,65,12,0.15)",
          border: "1px solid rgba(194,65,12,0.30)",
          display: "flex", alignItems: "center", justifyContent: "center",
          flexShrink: 0,
        }}>
          <CalendarDays size={20} color="#C2410C" />
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <h1 style={{ fontSize: 20, fontWeight: 500, color: "#fff", margin: 0, lineHeight: 1.2 }}>
            Agenda semanal
          </h1>
          <p style={{ fontSize: 12, color: "#6B7280", margin: 0 }}>
            {business.name} / Agenda
          </p>
        </div>
      </div>
      <WeeklyCalendar
        appointments={appointments}
        professionals={professionals}
        onUpdateStatus={updateStatus}
      />
    </div>
  );
}
