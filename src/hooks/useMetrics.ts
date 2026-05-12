"use client";

import { useEffect, useState, useCallback } from "react";
import { createClient } from "@/lib/supabase";
import type { DashboardMetrics, AppointmentWithDetails } from "@/types";

export function useMetrics(businessId: string | undefined) {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  const fetch = useCallback(async () => {
    if (!businessId) return;
    setLoading(true);

    const today = new Date().toISOString().slice(0, 10);
    const weekStart = new Date();
    weekStart.setDate(weekStart.getDate() - weekStart.getDay());
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);

    const [{ data: todayAppts }, { data: weekAppts }] = await Promise.all([
      supabase
        .from("appointments")
        .select(
          "*, professional:professionals(id,name,photo_url,specialty), service:services(id,name,price,duration_minutes)"
        )
        .eq("business_id", businessId)
        .eq("date", today)
        .eq("status", "scheduled")
        .order("start_time", { ascending: true }),
      supabase
        .from("appointments")
        .select("id,status")
        .eq("business_id", businessId)
        .gte("date", weekStart.toISOString().slice(0, 10))
        .lte("date", weekEnd.toISOString().slice(0, 10)),
    ]);

    const appts = (todayAppts as AppointmentWithDetails[]) ?? [];
    const revenueToday = appts.reduce((sum, a) => sum + a.service.price, 0);

    const totalWeek = (weekAppts ?? []).length;
    const completedOrScheduled = (weekAppts ?? []).filter(
      (a) => a.status !== "cancelled" && a.status !== "no_show"
    ).length;
    const weeklyOccupancyRate =
      totalWeek > 0 ? Math.round((completedOrScheduled / totalWeek) * 100) : 0;

    const now = new Date();
    const nextAppointment =
      appts.find((a) => {
        const [h, m] = a.start_time.split(":").map(Number);
        return h * 60 + m > now.getHours() * 60 + now.getMinutes();
      }) ?? null;

    setMetrics({
      appointmentsToday: appts.length,
      revenueToday,
      weeklyOccupancyRate,
      nextAppointment,
    });
    setLoading(false);
  }, [businessId]);

  useEffect(() => { fetch(); }, [fetch]);

  return { metrics, loading, refetch: fetch };
}
