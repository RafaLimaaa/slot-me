import { notFound, redirect } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import { createServerSupabaseClient } from "@/lib/supabase-server";

interface Props {
  params: { token: string };
}

export default async function RescheduleRedirectPage({ params }: Props) {
  const supabase = createServerSupabaseClient();

  const { data } = await supabase
    .from("appointments")
    .select("id, status, business_id, businesses(slug)")
    .eq("reschedule_token", params.token)
    .single();

  if (!data) notFound();

  const biz = data.businesses as { slug: string } | null;
  if (!biz) notFound();

  // Cancel the original appointment (requires service role to bypass RLS)
  if (data.status === "scheduled") {
    const admin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );
    await admin
      .from("appointments")
      .update({ status: "cancelled" })
      .eq("id", data.id);
  }

  redirect(`/${biz.slug}/agendar`);
}
