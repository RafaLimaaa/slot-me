"use server";

import { createClient } from "@supabase/supabase-js";
import {
  sendConfirmationToClient,
  sendNewAppointmentToOwner,
  sendCancellationToOwner,
  sendCancellationToClient,
} from "@/lib/resend";
import type { AppointmentWithDetails, Business } from "@/types";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://slotme.vercel.app";

function adminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

async function fetchAppointmentWithBusiness(appointmentId: string): Promise<{
  appt: AppointmentWithDetails;
  business: Business;
  ownerEmail: string | null;
} | null> {
  const supabase = adminClient();

  const { data: appt } = await supabase
    .from("appointments")
    .select("*, professional:professionals(id,name,photo_url,specialty), service:services(id,name,price,duration_minutes)")
    .eq("id", appointmentId)
    .single();

  if (!appt) return null;

  const { data: business } = await supabase
    .from("businesses")
    .select("*")
    .eq("id", appt.business_id)
    .single();

  if (!business) return null;

  const { data: { user } } = await supabase.auth.admin.getUserById(business.owner_id);

  return {
    appt: appt as AppointmentWithDetails,
    business: business as Business,
    ownerEmail: user?.email ?? null,
  };
}

// Called when the CLIENT cancels via cancel link — notifies the OWNER.
export async function notifyOwnerOfCancellation(appointmentId: string): Promise<void> {
  console.log("[notifyOwnerOfCancellation] appointmentId:", appointmentId);
  const result = await fetchAppointmentWithBusiness(appointmentId);
  if (!result) { console.error("[notifyOwnerOfCancellation] appointment not found"); return; }
  const { appt, business, ownerEmail } = result;
  if (!ownerEmail) { console.warn("[notifyOwnerOfCancellation] owner email not found"); return; }
  const { error } = await sendCancellationToOwner(appt, business, ownerEmail);
  if (error) console.error("[notifyOwnerOfCancellation]", error);
}

// Called when the OWNER cancels via dashboard — notifies the CLIENT.
export async function notifyClientOfCancellation(appointmentId: string): Promise<void> {
  console.log("[notifyClientOfCancellation] appointmentId:", appointmentId);
  const result = await fetchAppointmentWithBusiness(appointmentId);
  if (!result) { console.error("[notifyClientOfCancellation] appointment not found"); return; }
  const { appt, business } = result;
  const { error } = await sendCancellationToClient(appt, business, APP_URL);
  if (error) console.error("[notifyClientOfCancellation]", error);
}

export async function sendBookingEmails(
  appt: AppointmentWithDetails,
  business: Business
): Promise<{ error?: string }> {
  console.log("[sendBookingEmails] called — client:", appt.client_email, "business:", business.name);

  const [clientResult] = await Promise.allSettled([
    sendConfirmationToClient(appt, business, APP_URL),
    (async () => {
      const supabase = adminClient();
      const { data: { user } } = await supabase.auth.admin.getUserById(business.owner_id);
      if (user?.email) {
        const result = await sendNewAppointmentToOwner(appt, business, user.email);
        if (result.error) console.error("[sendBookingEmails] owner notification failed:", result.error);
      } else {
        console.warn("[sendBookingEmails] owner email not found for business:", business.id);
      }
    })(),
  ]);

  if (clientResult.status === "rejected") {
    console.error("[sendBookingEmails] client confirmation rejected:", clientResult.reason);
    return { error: "Agendamento criado, mas não foi possível enviar o email de confirmação." };
  }
  if (clientResult.value.error) {
    console.error("[sendBookingEmails] client confirmation error:", clientResult.value.error);
    return { error: "Agendamento criado, mas não foi possível enviar o email de confirmação." };
  }

  console.log("[sendBookingEmails] success — emails dispatched");
  return {};
}
