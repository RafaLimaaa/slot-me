import { Resend } from "resend";
import type { AppointmentWithDetails, Business } from "@/types";

const resend = new Resend(process.env.RESEND_API_KEY);
const FROM = "SlotMe <onboarding@resend.dev>";

console.log("[Resend] API key present:", !!process.env.RESEND_API_KEY);

// ─── Template base ────────────────────────────────────────────────────────────

function baseTemplate(content: string): string {
  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>SlotMe</title>
</head>
<body style="margin:0;padding:0;background:#f8fafc;font-family:Inter,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8fafc;padding:32px 0;">
    <tr>
      <td align="center">
        <table width="560" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 4px 24px rgba(194,65,12,0.08);">
          <tr>
            <td style="background:#C2410C;padding:24px 32px;">
              <span style="color:#ffffff;font-size:20px;font-weight:700;letter-spacing:-0.5px;">SlotMe</span>
            </td>
          </tr>
          <tr>
            <td style="padding:32px;">
              ${content}
            </td>
          </tr>
          <tr>
            <td style="padding:16px 32px 24px;border-top:1px solid #f1f5f9;">
              <p style="margin:0;color:#6b7280;font-size:13px;">SlotMe — agendamento online para negócios de serviços</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

function appointmentSummary(
  appt: AppointmentWithDetails,
  business: Business
): string {
  const date = new Date(appt.date + "T00:00:00").toLocaleDateString("pt-BR", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
  const price = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(appt.service.price);

  return `
    <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8fafc;border-radius:8px;padding:16px;margin-top:16px;">
      <tr><td style="padding:4px 0;color:#6b7280;font-size:14px;">Negócio</td><td style="padding:4px 0;color:#09090b;font-size:14px;font-weight:500;">${business.name}</td></tr>
      <tr><td style="padding:4px 0;color:#6b7280;font-size:14px;">Serviço</td><td style="padding:4px 0;color:#09090b;font-size:14px;font-weight:500;">${appt.service.name} — ${price}</td></tr>
      <tr><td style="padding:4px 0;color:#6b7280;font-size:14px;">Profissional</td><td style="padding:4px 0;color:#09090b;font-size:14px;font-weight:500;">${appt.professional.name}</td></tr>
      <tr><td style="padding:4px 0;color:#6b7280;font-size:14px;">Data</td><td style="padding:4px 0;color:#09090b;font-size:14px;font-weight:500;">${date}</td></tr>
      <tr><td style="padding:4px 0;color:#6b7280;font-size:14px;">Horário</td><td style="padding:4px 0;color:#09090b;font-size:14px;font-weight:500;">${appt.start_time.slice(0, 5)}</td></tr>
      ${business.address ? `<tr><td style="padding:4px 0;color:#6b7280;font-size:14px;">Endereço</td><td style="padding:4px 0;color:#09090b;font-size:14px;font-weight:500;">${business.address}${business.city ? `, ${business.city}` : ""}</td></tr>` : ""}
    </table>`;
}

function actionButton(label: string, url: string, variant: "primary" | "secondary" = "primary"): string {
  const bg = variant === "primary" ? "#C2410C" : "#f1f5f9";
  const color = variant === "primary" ? "#ffffff" : "#09090b";
  return `<a href="${url}" style="display:inline-block;margin-top:8px;margin-right:8px;padding:10px 20px;background:${bg};color:${color};text-decoration:none;border-radius:8px;font-size:14px;font-weight:500;">${label}</a>`;
}

// ─── Email de confirmação para o cliente ──────────────────────────────────────

export async function sendConfirmationToClient(
  appt: AppointmentWithDetails,
  business: Business,
  appUrl: string
): Promise<{ error?: string }> {
  const cancelUrl = `${appUrl}/cancelar/${appt.cancel_token}`;
  const rescheduleUrl = `${appUrl}/reagendar/${appt.reschedule_token}`;

  const content = `
    <h2 style="margin:0 0 8px;color:#09090b;font-size:22px;font-weight:700;">Agendamento confirmado</h2>
    <p style="margin:0;color:#6b7280;font-size:15px;">Seu agendamento em <strong style="color:#09090b;">${business.name}</strong> foi confirmado.</p>
    ${appointmentSummary(appt, business)}
    <div style="margin-top:24px;">
      ${actionButton("Reagendar", rescheduleUrl, "secondary")}
      ${actionButton("Cancelar agendamento", cancelUrl, "secondary")}
    </div>`;

  try {
    const { data, error } = await resend.emails.send({
      from: FROM,
      to: appt.client_email,
      subject: `Agendamento confirmado — ${business.name}`,
      html: baseTemplate(content),
    });
    console.log("[Resend] sendConfirmationToClient →", { data, error, to: appt.client_email });
    if (error) return { error: "Falha ao enviar email de confirmação." };
    return {};
  } catch (e) {
    console.error("[Resend] sendConfirmationToClient exception:", e);
    return { error: "Falha ao enviar email de confirmação." };
  }
}

// ─── Email de lembrete para o cliente ────────────────────────────────────────

export async function sendReminderToClient(
  appt: AppointmentWithDetails,
  business: Business,
  appUrl: string
): Promise<{ error?: string }> {
  const cancelUrl = `${appUrl}/cancelar/${appt.cancel_token}`;
  const rescheduleUrl = `${appUrl}/reagendar/${appt.reschedule_token}`;

  const content = `
    <h2 style="margin:0 0 8px;color:#09090b;font-size:22px;font-weight:700;">Lembrete de agendamento</h2>
    <p style="margin:0;color:#6b7280;font-size:15px;">Seu agendamento é <strong style="color:#09090b;">amanhã</strong>.</p>
    ${appointmentSummary(appt, business)}
    <div style="margin-top:24px;">
      ${actionButton("Reagendar", rescheduleUrl, "secondary")}
      ${actionButton("Cancelar agendamento", cancelUrl, "secondary")}
    </div>`;

  try {
    const { data, error } = await resend.emails.send({
      from: FROM,
      to: appt.client_email,
      subject: `Lembrete — seu agendamento é amanhã`,
      html: baseTemplate(content),
    });
    console.log("[Resend] sendReminderToClient →", { data, error, to: appt.client_email });
    if (error) return { error: "Falha ao enviar email de lembrete." };
    return {};
  } catch (e) {
    console.error("[Resend] sendReminderToClient exception:", e);
    return { error: "Falha ao enviar email de lembrete." };
  }
}

// ─── Email de novo agendamento para o dono ────────────────────────────────────

export async function sendNewAppointmentToOwner(
  appt: AppointmentWithDetails,
  business: Business,
  ownerEmail: string
): Promise<{ error?: string }> {
  const content = `
    <h2 style="margin:0 0 8px;color:#09090b;font-size:22px;font-weight:700;">Novo agendamento</h2>
    <p style="margin:0;color:#6b7280;font-size:15px;">Um novo agendamento foi realizado por <strong style="color:#09090b;">${appt.client_name}</strong>.</p>
    ${appointmentSummary(appt, business)}
    <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8fafc;border-radius:8px;padding:16px;margin-top:12px;">
      <tr><td style="padding:4px 0;color:#6b7280;font-size:14px;">Cliente</td><td style="padding:4px 0;color:#09090b;font-size:14px;font-weight:500;">${appt.client_name}</td></tr>
      <tr><td style="padding:4px 0;color:#6b7280;font-size:14px;">Telefone</td><td style="padding:4px 0;color:#09090b;font-size:14px;font-weight:500;">${appt.client_phone}</td></tr>
      <tr><td style="padding:4px 0;color:#6b7280;font-size:14px;">Email</td><td style="padding:4px 0;color:#09090b;font-size:14px;font-weight:500;">${appt.client_email}</td></tr>
    </table>`;

  try {
    const { data, error } = await resend.emails.send({
      from: FROM,
      to: ownerEmail,
      subject: `Novo agendamento — ${appt.client_name}`,
      html: baseTemplate(content),
    });
    console.log("[Resend] sendNewAppointmentToOwner →", { data, error, to: ownerEmail });
    if (error) return { error: "Falha ao notificar o dono do negócio." };
    return {};
  } catch (e) {
    console.error("[Resend] sendNewAppointmentToOwner exception:", e);
    return { error: "Falha ao notificar o dono do negócio." };
  }
}

// ─── Email de cancelamento para o cliente ────────────────────────────────────

export async function sendCancellationToClient(
  appt: AppointmentWithDetails,
  business: Business,
  appUrl: string
): Promise<{ error?: string }> {
  const rebookUrl = `${appUrl}/${business.slug}/agendar`;

  const content = `
    <h2 style="margin:0 0 8px;color:#09090b;font-size:22px;font-weight:700;">Agendamento cancelado</h2>
    <p style="margin:0;color:#6b7280;font-size:15px;">Seu agendamento em <strong style="color:#09090b;">${business.name}</strong> foi cancelado.</p>
    ${appointmentSummary(appt, business)}
    <div style="margin-top:24px;">
      ${actionButton("Agendar novamente", rebookUrl)}
    </div>`;

  try {
    const { data, error } = await resend.emails.send({
      from: FROM,
      to: appt.client_email,
      subject: `Agendamento cancelado — ${business.name}`,
      html: baseTemplate(content),
    });
    console.log("[Resend] sendCancellationToClient →", { data, error, to: appt.client_email });
    if (error) return { error: "Falha ao notificar o cliente sobre o cancelamento." };
    return {};
  } catch (e) {
    console.error("[Resend] sendCancellationToClient exception:", e);
    return { error: "Falha ao notificar o cliente sobre o cancelamento." };
  }
}

// ─── Email de cancelamento para o dono ───────────────────────────────────────

export async function sendCancellationToOwner(
  appt: AppointmentWithDetails,
  business: Business,
  ownerEmail: string
): Promise<{ error?: string }> {
  const content = `
    <h2 style="margin:0 0 8px;color:#09090b;font-size:22px;font-weight:700;">Agendamento cancelado</h2>
    <p style="margin:0;color:#6b7280;font-size:15px;"><strong style="color:#09090b;">${appt.client_name}</strong> cancelou o agendamento.</p>
    ${appointmentSummary(appt, business)}
    <table width="100%" cellpadding="0" cellspacing="0" style="background:#fef2f2;border-radius:8px;padding:16px;margin-top:12px;">
      <tr><td style="padding:4px 0;color:#6b7280;font-size:14px;">Cliente</td><td style="padding:4px 0;color:#09090b;font-size:14px;font-weight:500;">${appt.client_name}</td></tr>
      <tr><td style="padding:4px 0;color:#6b7280;font-size:14px;">Telefone</td><td style="padding:4px 0;color:#09090b;font-size:14px;font-weight:500;">${appt.client_phone}</td></tr>
    </table>`;

  try {
    const { data, error } = await resend.emails.send({
      from: FROM,
      to: ownerEmail,
      subject: `Agendamento cancelado — ${appt.client_name}`,
      html: baseTemplate(content),
    });
    console.log("[Resend] sendCancellationToOwner →", { data, error, to: ownerEmail });
    if (error) return { error: "Falha ao enviar notificação de cancelamento." };
    return {};
  } catch (e) {
    console.error("[Resend] sendCancellationToOwner exception:", e);
    return { error: "Falha ao enviar notificação de cancelamento." };
  }
}
