"use client";

import { useState } from "react";
import { Plus, Trash2, Loader2 } from "lucide-react";
import type { ProfessionalFormData, ServiceFormData } from "@/types";

interface Props {
  services: ServiceFormData[];
  initial: ProfessionalFormData[];
  onFinish: (data: ProfessionalFormData[]) => void;
  onBack: () => void;
  loading: boolean;
}

const EMPTY = (): ProfessionalFormData => ({ name: "", specialty: "", phone: "", service_ids: [] });

function formatPhone(value: string): string {
  const d = value.replace(/\D/g, "").slice(0, 11);
  if (d.length <= 2) return d.length ? `(${d}` : "";
  if (d.length <= 7) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
  return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
}

const NUMERIC_KEYS = ["Backspace", "Delete", "Tab", "ArrowLeft", "ArrowRight"];
function onlyDigits(e: React.KeyboardEvent) {
  if (NUMERIC_KEYS.includes(e.key)) return;
  if (!/^\d$/.test(e.key)) e.preventDefault();
}

const inputCls =
  "w-full bg-[#FAF7F2] border border-[#E8E0D5] rounded-[10px] px-[14px] py-[11px] text-[14px] text-[#1A1A1A] outline-none " +
  "placeholder:text-[#C4BAB0] transition-[border-color,box-shadow] duration-200 " +
  "focus:border-[#C2410C] focus:ring-[3px] focus:ring-[rgba(194,65,12,0.10)] focus:ring-offset-0";

const labelCls = "block text-[12px] font-medium text-[#6B7280] tracking-[0.04em] uppercase mb-1.5";

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
        <div
          key={i}
          style={{
            background: "#FAF7F2",
            border: "1px solid #E8E0D5",
            borderRadius: 12,
            padding: 16,
            display: "flex",
            flexDirection: "column",
            gap: 12,
          }}
        >
          <div className="flex items-center justify-between">
            <span className="text-[13px] font-medium text-[#6B7280] uppercase tracking-[0.04em]">
              Profissional {i + 1}
            </span>
            {professionals.length > 1 && (
              <button
                type="button"
                onClick={() => remove(i)}
                className="text-[#DC2626] hover:opacity-70 transition-opacity"
              >
                <Trash2 size={16} />
              </button>
            )}
          </div>

          <div>
            <label className={labelCls}>Nome</label>
            <input
              className={inputCls}
              placeholder="Nome do profissional"
              value={p.name}
              onChange={(e) => update(i, "name", e.target.value)}
            />
          </div>

          <div>
            <label className={labelCls}>Especialidade (opcional)</label>
            <input
              className={inputCls}
              placeholder="Ex: Barbeiro, Cabeleireiro"
              value={p.specialty}
              onChange={(e) => update(i, "specialty", e.target.value)}
            />
          </div>

          <div>
            <label className={labelCls}>Telefone (opcional)</label>
            <input
              className={inputCls}
              placeholder="(00) 00000-0000"
              inputMode="numeric"
              maxLength={15}
              value={p.phone}
              onKeyDown={onlyDigits}
              onChange={(e) => update(i, "phone", formatPhone(e.target.value))}
            />
          </div>

          <div>
            <p className={labelCls}>Serviços que realiza</p>
            <div className="flex flex-wrap gap-2">
              {services.map((s, si) => {
                const key = `svc-${si}`;
                const checked = p.service_ids.includes(key);
                return (
                  <label
                    key={si}
                    className={[
                      "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[12px] border cursor-pointer transition-all",
                      checked
                        ? "bg-[#C2410C] text-white border-[#C2410C]"
                        : "border-[#E8E0D5] text-[#6B7280] hover:border-[#C2410C] hover:text-[#C2410C]",
                    ].join(" ")}
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
        type="button"
        onClick={add}
        className="flex items-center gap-2 text-[13px] font-medium text-[#C2410C] hover:opacity-70 transition-opacity"
      >
        <Plus size={16} /> Adicionar profissional
      </button>

      <div className="flex gap-3 mt-2">
        <button
          type="button"
          onClick={onBack}
          disabled={loading}
          className={[
            "flex-1 py-[14px] px-[14px] text-[15px] font-medium text-[#6B7280]",
            "rounded-[12px] border border-[#E8E0D5] bg-transparent",
            "hover:border-[#C2410C] hover:text-[#C2410C]",
            "disabled:opacity-50 disabled:cursor-not-allowed",
            "transition-all duration-200",
          ].join(" ")}
        >
          Voltar
        </button>
        <button
          type="button"
          disabled={!canFinish || loading}
          onClick={() => onFinish(professionals)}
          className={[
            "flex-1 flex items-center justify-center gap-2",
            "text-[15px] font-medium text-[#F5F0E8] rounded-[12px] py-[14px] px-[14px]",
            "bg-[radial-gradient(ellipse_at_50%_40%,#D95518_0%,#9A3412_60%,#7C2A10_100%)]",
            "border border-[rgba(120,30,5,0.6)]",
            "shadow-[0_2px_8px_rgba(120,30,5,0.35),inset_0_1px_0_rgba(255,200,150,0.20),inset_0_-1px_0_rgba(0,0,0,0.20)]",
            "hover:shadow-[0_6px_24px_rgba(120,30,5,0.50),inset_0_1px_0_rgba(255,200,150,0.25)]",
            "hover:-translate-y-px active:translate-y-0",
            "disabled:opacity-50 disabled:cursor-not-allowed",
            "transition-all duration-200",
          ].join(" ")}
        >
          {loading && <Loader2 size={16} className="animate-spin" />}
          {loading ? "Salvando..." : "Concluir"}
        </button>
      </div>
    </div>
  );
}
