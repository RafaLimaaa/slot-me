import { notFound, redirect } from "next/navigation";
import { createServerSupabaseClient } from "@/lib/supabase-server";

interface Props {
  params: { token: string };
}

export default async function RescheduleRedirectPage({ params }: Props) {
  const supabase = createServerSupabaseClient();

  const { data } = await supabase
    .from("appointments")
    .select("id, business_id, businesses(slug)")
    .eq("reschedule_token", params.token)
    .single();

  if (!data) notFound();

  const biz = data.businesses as { slug: string } | null;
  if (!biz) notFound();

  redirect(`/${biz.slug}/agendar`);
}
