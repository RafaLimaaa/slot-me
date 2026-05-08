import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import type { BookingFormData } from "@/types";

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
        <Input
          label="Telefone"
          type="tel"
          required
          value={form.clientPhone}
          onChange={(e) => onChangeClient("clientPhone", e.target.value)}
        />
        <Input
          label="Email"
          type="email"
          required
          value={form.clientEmail}
          onChange={(e) => onChangeClient("clientEmail", e.target.value)}
        />
        <Button
          className="w-full mt-2"
          loading={loading}
          disabled={!form.clientName || !form.clientPhone || !form.clientEmail}
          onClick={onConfirm}
        >
          Confirmar agendamento
        </Button>
      </div>
    </div>
  );
}
