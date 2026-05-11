import { notFound } from "next/navigation";
import { createServerSupabaseClient } from "@/lib/supabase-server";
import { BookingFlow } from "@/components/booking/BookingFlow";
import type { Professional, ProfessionalWithServices, Service } from "@/types";

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

  const [{ data: services }, { data: professionals }] = await Promise.all([
    supabase.from("services").select("*").eq("business_id", business.id),
    supabase
      .from("professionals")
      .select("*, professional_services(service_id)")
      .eq("business_id", business.id),
  ]);

  const svcMap = new Map((services ?? []).map((s: Service) => [s.id, s]));

  const enriched: ProfessionalWithServices[] = (professionals ?? []).map(
    (p: Professional & { professional_services: { service_id: string }[] }) => ({
      ...p,
      services: (p.professional_services ?? [])
        .map(({ service_id }) => svcMap.get(service_id))
        .filter(Boolean) as Service[],
    })
  );

  return (
    <BookingFlow
      business={business}
      services={services ?? []}
      professionals={enriched}
    />
  );
}
