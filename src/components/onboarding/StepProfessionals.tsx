"use client";

import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import type { ProfessionalFormData, ServiceFormData } from "@/types";

interface Props {
  services: ServiceFormData[];
  initial: ProfessionalFormData[];
  onFinish: (data: ProfessionalFormData[]) => void;
  onBack: () => void;
  loading: boolean;
}

const EMPTY = (): ProfessionalFormData => ({ name: "", specialty: "", service_ids: [] });

export function StepProfessionals({ services, initial, onFinish, onBack, loading }: Props) {
  const [professionals, setProfessionals] = useState<ProfessionalFormData[]>(
    initial.length ? initial : [EMPTY()]
  );

  function add() {
    setProfessionals((prev) => [...prev, EMPTY()]);
  }

  function remove(i: number) {
    setProfessionals((prev) => prev.filter((_, idx) => idx !== i));
  }

  function update(i: number, field: keyof ProfessionalFormData, value: string | string[]) {
    setProfessionals((prev) =>
      prev.map((p, idx) => (idx === i ? { ...p, [field]: value } : p))
    );
  }

  function toggleService(i: number, serviceKey: string) {
    setProfessionals((prev) =>
      prev.map((p, idx) => {
        if (idx !== i) return p;
        const ids = p.service_ids.includes(serviceKey)
          ? p.service_ids.filter((id) => id !== serviceKey)
          : [...p.service_ids, serviceKey];
        return { ...p, service_ids: ids };
      })
    );
  }

  const canFinish =
    professionals.length > 0 &&
    professionals.every((p) => p.name && p.service_ids.length > 0);

  return (
    <div className="flex flex-col gap-4">
      {professionals.map((p, i) => (
        <div key={i} className="bg-[#f8fafc] rounded-[12px] p-4 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-[#09090b]">Profissional {i + 1}</span>
            {professionals.length > 1 && (
              <button onClick={() => remove(i)} className="text-[#DC2626] hover:opacity-70 transition-opacity">
                <Trash2 size={16} />
              </button>
            )}
          </div>
          <Input
            placeholder="Nome"
            value={p.name}
            onChange={(e) => update(i, "name", e.target.value)}
          />
          <Input
            placeholder="Especialidade (opcional)"
            value={p.specialty}
            onChange={(e) => update(i, "specialty", e.target.value)}
          />
          <div>
            <p className="text-xs font-medium text-[#6b7280] mb-2">Serviços que realiza</p>
            <div className="flex flex-wrap gap-2">
              {services.map((s, si) => {
                const key = `svc-${si}`;
                const checked = p.service_ids.includes(key);
                return (
                  <label
                    key={si}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs border cursor-pointer transition-all
                      ${checked
                        ? "bg-[#2563EB] text-white border-[#2563EB]"
                        : "border-[#e2e8f0] text-[#6b7280] hover:border-[#2563EB] hover:text-[#2563EB]"
                      }`}
                  >
                    <input
                      type="checkbox"
                      className="sr-only"
                      checked={checked}
                      onChange={() => toggleService(i, key)}
                    />
                    {s.name || `Serviço ${si + 1}`}
                  </label>
                );
              })}
            </div>
          </div>
        </div>
      ))}

      <button
        onClick={add}
        className="flex items-center gap-2 text-sm text-[#2563EB] hover:opacity-70 transition-opacity"
      >
        <Plus size={16} /> Adicionar profissional
      </button>

      <div className="flex gap-3 mt-2">
        <Button variant="secondary" onClick={onBack} className="flex-1">Voltar</Button>
        <Button
          disabled={!canFinish}
          loading={loading}
          onClick={() => onFinish(professionals)}
          className="flex-1"
        >
          Concluir
        </Button>
      </div>
    </div>
  );
}
