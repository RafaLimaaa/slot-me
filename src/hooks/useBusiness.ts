"use client";

import { useEffect, useState, useCallback } from "react";
import { createClient } from "@/lib/supabase";
import type { Business, Professional, Service, WorkingHours, ProfessionalWithServices } from "@/types";

export function useBusiness(ownerId: string | undefined) {
  const [business, setBusiness] = useState<Business | null>(null);
  const [professionals, setProfessionals] = useState<ProfessionalWithServices[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [workingHours, setWorkingHours] = useState<WorkingHours[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  const fetch = useCallback(async () => {
    if (!ownerId) return;
    setLoading(true);

    const { data: biz } = await supabase
      .from("businesses")
      .select("*")
      .eq("owner_id", ownerId)
      .single();

    if (!biz) {
      setLoading(false);
      return;
    }

    setBusiness(biz);

    const [{ data: svcs }, { data: profs }] = await Promise.all([
      supabase.from("services").select("*").eq("business_id", biz.id),
      supabase
        .from("professionals")
        .select("*, professional_services(service_id)")
        .eq("business_id", biz.id),
    ]);

    const profIds = (profs ?? []).map((p: Professional) => p.id);
    const { data: wh } = profIds.length > 0
      ? await supabase.from("working_hours").select("*").in("professional_id", profIds)
      : { data: [] };

    setServices(svcs ?? []);
    setWorkingHours(wh ?? []);

    const svcMap = new Map((svcs ?? []).map((s: Service) => [s.id, s]));
    const enriched: ProfessionalWithServices[] = (profs ?? []).map(
      (p: Professional & { professional_services: { service_id: string }[] }) => ({
        ...p,
        services: (p.professional_services ?? [])
          .map(({ service_id }) => svcMap.get(service_id))
          .filter(Boolean) as Service[],
      })
    );
    setProfessionals(enriched);
    setLoading(false);
  }, [ownerId]);

  useEffect(() => { fetch(); }, [fetch]);

  return { business, professionals, services, workingHours, loading, refetch: fetch };
}
