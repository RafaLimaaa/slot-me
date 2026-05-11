"use server";

import { createClient } from "@supabase/supabase-js";
import { sendConfirmationToClient, sendNewAppointmentToOwner } from "@/lib/resend";
import type { AppointmentWithDetails, Business } from "@/types";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://slotme.vercel.app";

export async function sendBookingEmails(
  appt: AppointmentWithDetails,
  business: Business
): Promise<{ error?: string }> {
  const [clientResult] = await Promise.allSettled([
    sendConfirmationToClient(appt, business, APP_URL),
    (async () => {
      const supabaseAdmin = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
      );
      const { data: { user } } = await supabaseAdmin.auth.admin.getUserById(business.owner_id);
      if (user?.email) {
        const result = await sendNewAppointmentToOwner(appt, business, user.email);
        if (result.error) console.error("[Email] Notificação ao dono falhou:", result.error);
      }
    })(),
  ]);

  if (clientResult.status === "rejected") {
    console.error("[Email] Confirmação ao cliente falhou:", clientResult.reason);
    return { error: "Agendamento criado, mas não foi possível enviar o email de confirmação." };
  }
  if (clientResult.value.error) {
    return { error: "Agendamento criado, mas não foi possível enviar o email de confirmação." };
  }

  return {};
}
