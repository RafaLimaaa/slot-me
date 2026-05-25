"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { LayoutDashboard } from "lucide-react";
import { Spinner } from "@/components/ui/Spinner";
import { MetricsBar } from "@/components/dashboard/MetricsBar";
import { AppointmentList } from "@/components/dashboard/AppointmentList";
import { AppointmentChart } from "@/components/dashboard/AppointmentChart";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import { EmptyState } from "@/components/dashboard/EmptyState";
import { useAuth } from "@/hooks/useAuth";
import { useBusiness } from "@/hooks/useBusiness";
import { useAppointments } from "@/hooks/useAppointments";
import { useMetrics } from "@/hooks/useMetrics";

export default function DashboardPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const { business, services, professionals, loading: bizLoading } = useBusiness(user?.id);
  const today = new Date().toISOString().slice(0, 10);
  const { appointments: todayAppts, loading: apptLoading, updateStatus } = useAppointments(business?.id, today);
  const { appointments: allAppts } = useAppointments(business?.id);
  const { metrics, loading: metricsLoading } = useMetrics(business?.id);

  useEffect(() => {
    if (!authLoading && !bizLoading && !business) {
      router.replace("/dashboard/onboarding");
    }
  }, [authLoading, bizLoading, business, router]);

  if (authLoading || bizLoading || !business) {
    return (
      <div className="flex items-center justify-center h-64">
        <Spinner size={32} />
      </div>
    );
  }

  return (
    <div
      className="flex flex-col lg:flex-row gap-6"
      style={{
        backgroundImage:
          "linear-gradient(rgba(194,65,12,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(194,65,12,0.05) 1px, transparent 1px)",
        backgroundSize: "32px 32px",
      }}
    >
      {/* Left column */}
      <div className="flex-1 min-w-0 flex flex-col gap-5">
        <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 24 }}>
          <div style={{
            width: 40, height: 40, borderRadius: 10,
            background: "rgba(194,65,12,0.15)",
            border: "1px solid rgba(194,65,12,0.30)",
            display: "flex", alignItems: "center", justifyContent: "center",
            flexShrink: 0,
          }}>
            <LayoutDashboard size={20} color="#C2410C" />
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <h1 style={{ fontSize: 20, fontWeight: 500, color: "#fff", margin: 0, lineHeight: 1.2 }}>
              Painel
            </h1>
            <p style={{ fontSize: 12, color: "#6B7280", margin: 0 }}>
              {business.name} / Painel
            </p>
          </div>
        </div>

        {!metricsLoading && metrics && (
          <div className="relative">
            <div
              className="absolute pointer-events-none"
              style={{
                width: 700,
                height: 240,
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                background: "radial-gradient(ellipse at center, rgba(194,65,12,0.20) 0%, transparent 70%)",
                zIndex: 0,
              }}
            />
            <div className="relative z-10">
              <MetricsBar metrics={metrics} />
            </div>
          </div>
        )}

        <AppointmentChart appointments={allAppts} />

        <div>
          <h2 className="text-[#fafafa] font-semibold text-sm mb-3">Agenda de hoje</h2>
          {apptLoading ? (
            <div className="flex justify-center py-8"><Spinner /></div>
          ) : (
            <AppointmentList appointments={todayAppts} onUpdateStatus={updateStatus} />
          )}
          {!apptLoading && todayAppts.length === 0 && (
            <EmptyState
              business={business}
              serviceCount={services.length}
              professionalCount={professionals.length}
            />
          )}
        </div>
      </div>

      {/* Right column */}
      <div className="w-full lg:w-80 shrink-0">
        <DashboardSidebar business={business} appointments={allAppts} />
      </div>
    </div>
  );
}
