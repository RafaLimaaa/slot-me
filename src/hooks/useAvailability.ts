"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase";
import { getAvailableSlots } from "@/lib/availability";
import type { WorkingHours, Appointment, BlockedPeriod } from "@/types";

export function useAvailability(
  professionalId: string | null,
  date: string | null,
  serviceDuration: number
) {
  const [slots, setSlots] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    if (!professionalId || !date || !serviceDuration) {
      setSlots([]);
      return;
    }

    let cancelled = false;

    async function load() {
      setLoading(true);

      const dayOfWeek = new Date(date + "T00:00:00").getDay();

      const [{ data: wh }, { data: appts }, { data: blocked }] = await Promise.all([
        supabase
          .from("working_hours")
          .select("*")
          .eq("professional_id", professionalId)
          .eq("day_of_week", dayOfWeek)
          .maybeSingle(),
        supabase
          .from("appointments")
          .select("start_time,end_time")
          .eq("professional_id", professionalId)
          .eq("date", date)
          .eq("status", "scheduled"),
        supabase
          .from("blocked_periods")
          .select("start_time,end_time")
          .eq("professional_id", professionalId)
          .eq("date", date),
      ]);

      if (cancelled) return;

      const available = getAvailableSlots({
        workingHours: wh as WorkingHours | null,
        appointments: (appts ?? []) as Pick<Appointment, "start_time" | "end_time">[],
        blockedPeriods: (blocked ?? []) as Pick<BlockedPeriod, "start_time" | "end_time">[],
        serviceDuration,
        currentDateTime: new Date(),
      });

      setSlots(available);
      setLoading(false);
    }

    load();
    return () => { cancelled = true; };
  }, [professionalId, date, serviceDuration]);

  return { slots, loading };
}
