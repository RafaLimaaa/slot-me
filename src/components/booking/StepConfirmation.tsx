import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import type { BookingFormData } from "@/types";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function formatPhone(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 11);
  if (digits.length <= 2) return digits.length ? `(${digits}` : "";
  if (digits.length <= 7) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
}

interface Props {
  form: BookingFormData;
  onChangeClient: (field: "clientName" | "clientPhone" | "clientEmail", value: string) => void;
  onConfirm: () => void;
  loading: boolean;
}

export function StepConfirmation({ form, onChangeClient, onConfirm, loading }: Props) {
  const brl = (v: number) =>
    v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

  const date = form.date
    ? new Date(form.date + "T00:00:00").toLocaleDateString("pt-BR", {
        weekday: "long",
        day: "2-digit",
        month: "long",
      })
    : "";

  const phoneDigits = form.clientPhone.replace(/\D/g, "");
  const isPhoneValid = phoneDigits.length >= 10 && phoneDigits.length <= 11;
  const isEmailValid = EMAIL_REGEX.test(form.clientEmail);

  const showPhoneError = form.clientPhone.length > 0 && !isPhoneValid;
  const showEmailError = form.clientEmail.length > 0 && !isEmailValid;

  const canConfirm = !!form.clientName && isPhoneValid && isEmailValid;

  return (
    <div className="flex flex-col md:flex-row gap-6">
      {/* Resumo */}
      <div className="flex-1 bg-[#f8fafc] rounded-[12px] p-4 self-start">
        <p className="text-sm font-semibold text-[#09090b] mb-3">Resumo</p>
        {[
          ["Serviço", `${form.service?.name} — ${form.service ? brl(form.service.price) : ""}`],
          ["Profissional", form.professional?.name],
          ["Data", date],
          ["Horário", form.time],
          ["Duração", `${form.service?.duration_minutes} min`],
        ].map(([k, v]) => v && (
          <div key={k} className="flex justify-between text-sm py-1.5 border-b border-[#e2e8f0] last:border-0">
            <span className="text-[#6b7280]">{k}</span>
            <span className="text-[#09090b] font-medium text-right">{v}</span>
          </div>
        ))}
      </div>

      {/* Formulário */}
      <div className="flex-1 flex flex-col gap-4">
        <Input
          label="Nome completo"
          required
          value={form.clientName}
          onChange={(e) => onChangeClient("clientName", e.target.value)}
        />
        <div className="flex flex-col gap-1">
          <Input
            label="Telefone"
            inputMode="numeric"
            required
            placeholder="(00) 00000-0000"
            value={form.clientPhone}
            onChange={(e) => onChangeClient("clientPhone", formatPhone(e.target.value))}
          />
          {showPhoneError && (
            <p className="text-xs text-[#DC2626]">Informe um telefone válido com 10 ou 11 dígitos.</p>
          )}
        </div>
        <div className="flex flex-col gap-1">
          <Input
            label="Email"
            type="email"
            required
            value={form.clientEmail}
            onChange={(e) => onChangeClient("clientEmail", e.target.value)}
          />
          {showEmailError && (
            <p className="text-xs text-[#DC2626]">Informe um email válido.</p>
          )}
        </div>
        <Button
          className="w-full mt-2"
          loading={loading}
          disabled={!canConfirm}
          onClick={onConfirm}
        >
          Confirmar agendamento
        </Button>
      </div>
    </div>
  );
}
