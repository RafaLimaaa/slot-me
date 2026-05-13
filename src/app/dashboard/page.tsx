"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { ExternalLink } from "lucide-react";
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

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

  return (
    <div className="flex flex-col lg:flex-row gap-6">
      {/* Left column */}
      <div className="flex-1 min-w-0 flex flex-col gap-5">
        <div>
          <h1 className="text-xl font-bold text-[#fafafa]">{business.name}</h1>
          <p className="text-[#6B7280] text-sm mt-0.5">
            {new Date().toLocaleDateString("pt-BR", { weekday: "long", day: "2-digit", month: "long" })}
          </p>
          <a
            href={`${appUrl}/${business.slug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-xs text-[#3F3F46] hover:text-[#6B7280] mt-1 transition-colors"
          >
            <ExternalLink size={11} />
            {`${appUrl.replace(/^https?:\/\//, "")}/${business.slug}`}
          </a>
        </div>

        {!metricsLoading && metrics && <MetricsBar metrics={metrics} />}

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
