import { notFound } from "next/navigation";
import { createServerSupabaseClient } from "@/lib/supabase-server";
import { BookingSuccess } from "@/components/booking/BookingSuccess";
import type { AppointmentWithDetails } from "@/types";

interface Props {
  params: { slug: string };
  searchParams: { id?: string };
}

export default async function SuccessPage({ params, searchParams }: Props) {
  if (!searchParams.id) notFound();

  const supabase = createServerSupabaseClient();

  const { data: appointment } = await supabase
    .from("appointments")
    .select(
      "*, professional:professionals(id,name,photo_url,specialty), service:services(id,name,price,duration_minutes)"
    )
    .eq("id", searchParams.id)
    .single();

  if (!appointment) notFound();

  const { data: business } = await supabase
    .from("businesses")
    .select("*")
    .eq("id", appointment.business_id)
    .single();

  if (!business) notFound();

  return (
    <BookingSuccess
      appointment={appointment as AppointmentWithDetails}
      business={business}
      slug={params.slug}
    />
  );
}
