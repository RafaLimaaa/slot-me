import { notFound } from "next/navigation";
import { createServerSupabaseClient } from "@/lib/supabase-server";
import { BookingFlow } from "@/components/booking/BookingFlow";
import type { ProfessionalWithServices, Service } from "@/types";

interface Props {
  params: { slug: string };
}

export default async function BookingPage({ params }: Props) {
  const supabase = createServerSupabaseClient();

  const { data: business } = await supabase
    .from("businesses")
    .select("*")
    .eq("slug", params.slug)
    .single();

  if (!business) notFound();

  const [{ data: services }, { data: professionals }, { data: profServices }] = await Promise.all([
    supabase.from("services").select("*").eq("business_id", business.id),
    supabase.from("professionals").select("*").eq("business_id", business.id),
    supabase.from("professional_services").select("*"),
  ]);

  const svcMap = new Map((services ?? []).map((s: Service) => [s.id, s]));
  const enriched: ProfessionalWithServices[] = (professionals ?? []).map((p) => ({
    ...p,
    services: (profServices ?? [])
      .filter((ps) => ps.professional_id === p.id)
      .map((ps) => svcMap.get(ps.service_id))
      .filter(Boolean) as Service[],
  }));

  return (
    <BookingFlow
      business={business}
      services={services ?? []}
      professionals={enriched}
    />
  );
}
