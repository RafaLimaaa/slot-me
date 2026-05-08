"use client";

import { useEffect, useState, useCallback } from "react";
import { createClient } from "@/lib/supabase";
import type { AppointmentWithDetails, AppointmentStatus } from "@/types";

export function useAppointments(businessId: string | undefined, date?: string) {
  const [appointments, setAppointments] = useState<AppointmentWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  const fetch = useCallback(async () => {
    if (!businessId) return;
    setLoading(true);

    let query = supabase
      .from("appointments")
      .select(
        "*, professional:professionals(id,name,photo_url,specialty), service:services(id,name,price,duration_minutes)"
      )
      .eq("business_id", businessId)
      .order("start_time", { ascending: true });

    if (date) query = query.eq("date", date);

    const { data } = await query;
    setAppointments((data as AppointmentWithDetails[]) ?? []);
    setLoading(false);
  }, [businessId, date]);

  useEffect(() => { fetch(); }, [fetch]);

  async function updateStatus(id: string, status: AppointmentStatus) {
    await supabase.from("appointments").update({ status }).eq("id", id);
    await fetch();
  }

  return { appointments, loading, refetch: fetch, updateStatus };
}
