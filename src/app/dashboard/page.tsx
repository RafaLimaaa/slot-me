"use client";

import { redirect } from "next/navigation";
import { Spinner } from "@/components/ui/Spinner";
import { MetricsBar } from "@/components/dashboard/MetricsBar";
import { AppointmentList } from "@/components/dashboard/AppointmentList";
import { EmptyState } from "@/components/dashboard/EmptyState";
import { useAuth } from "@/hooks/useAuth";
import { useBusiness } from "@/hooks/useBusiness";
import { useAppointments } from "@/hooks/useAppointments";
import { useMetrics } from "@/hooks/useMetrics";

export default function DashboardPage() {
  const { user, loading: authLoading } = useAuth();
  const { business, loading: bizLoading } = useBusiness(user?.id);
  const today = new Date().toISOString().slice(0, 10);
  const { appointments, loading: apptLoading, updateStatus } = useAppointments(business?.id, today);
  const { metrics, loading: metricsLoading } = useMetrics(business?.id);

  if (authLoading || bizLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Spinner size={32} />
      </div>
    );
  }

  if (!business) {
    redirect("/dashboard/onboarding");
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-[#fafafa]">{business.name}</h1>
        <p className="text-[#a1a1aa] text-sm mt-1">
          {new Date().toLocaleDateString("pt-BR", { weekday: "long", day: "2-digit", month: "long" })}
        </p>
      </div>

      {!metricsLoading && metrics && <MetricsBar metrics={metrics} />}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <h2 className="text-[#fafafa] font-semibold mb-3">Agenda de hoje</h2>
          {apptLoading ? (
            <div className="flex justify-center py-8"><Spinner /></div>
          ) : (
            <AppointmentList appointments={appointments} onUpdateStatus={updateStatus} />
          )}
        </div>
        <div>
          {appointments.length === 0 && !apptLoading && (
            <EmptyState business={business} />
          )}
        </div>
      </div>
    </div>
  );
}
