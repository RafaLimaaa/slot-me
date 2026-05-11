"use client";

import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import type { ServiceFormData } from "@/types";

const DURATION_OPTIONS = [
  { value: 30, label: "30 min" },
  { value: 45, label: "45 min" },
  { value: 60, label: "1h" },
  { value: 90, label: "1h30" },
  { value: 120, label: "2h" },
];

interface Props {
  initial: ServiceFormData[];
  onNext: (data: ServiceFormData[]) => void;
  onBack: () => void;
}

const EMPTY: ServiceFormData = { name: "", price: "", duration_minutes: 30 };

export function StepServices({ initial, onNext, onBack }: Props) {
  const [services, setServices] = useState<ServiceFormData[]>(
    initial.length ? initial : [{ ...EMPTY }]
  );

  function add() {
    setServices((prev) => [...prev, { ...EMPTY }]);
  }

  function remove(i: number) {
    setServices((prev) => prev.filter((_, idx) => idx !== i));
  }

  function update(i: number, field: keyof ServiceFormData, value: string | number) {
    setServices((prev) =>
      prev.map((s, idx) => (idx === i ? { ...s, [field]: value } : s))
    );
  }

  function formatPrice(value: string) {
    const digits = value.replace(/\D/g, "");
    const num = parseInt(digits || "0", 10) / 100;
    return num.toLocaleString("pt-BR", { minimumFractionDigits: 2 });
  }

  const canProceed = services.length > 0 && services.every((s) => s.name && s.price);

  return (
    <div className="flex flex-col gap-4">
      {services.map((s, i) => (
        <div key={i} className="bg-[#f8fafc] rounded-[12px] p-4 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-[#09090b]">Serviço {i + 1}</span>
            {services.length > 1 && (
              <button onClick={() => remove(i)} className="text-[#DC2626] hover:opacity-70 transition-opacity">
                <Trash2 size={16} />
              </button>
            )}
          </div>
          <Input
            placeholder="Nome do serviço"
            value={s.name}
            onChange={(e) => update(i, "name", e.target.value)}
          />
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-[#09090b]">Preço (R$)</label>
              <input
                type="text"
                inputMode="numeric"
                value={s.price}
                onChange={(e) => update(i, "price", formatPrice(e.target.value))}
                placeholder="0,00"
                className="w-full rounded-[12px] border border-[#e2e8f0] px-3 py-2.5 text-sm outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20"
              />
            </div>
            <Select
              label="Duração"
              value={s.duration_minutes}
              options={DURATION_OPTIONS}
              onChange={(e) => update(i, "duration_minutes", Number(e.target.value))}
            />
          </div>
        </div>
      ))}

      <button
        onClick={add}
        className="flex items-center gap-2 text-sm text-[#2563EB] hover:opacity-70 transition-opacity"
      >
        <Plus size={16} /> Adicionar serviço
      </button>

      <div className="flex gap-3 mt-2">
        <Button type="button" variant="secondary" onClick={onBack} className="flex-1">Voltar</Button>
        <Button type="button" disabled={!canProceed} onClick={() => onNext(services)} className="flex-1">Próximo</Button>
      </div>
    </div>
  );
}
