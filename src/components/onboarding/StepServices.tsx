"use client";

import { useState } from "react";
import { Plus, Trash2, ChevronDown } from "lucide-react";
import type { ServiceFormData } from "@/types";

const DURATION_OPTIONS = [
  { value: 30,  label: "30 min" },
  { value: 45,  label: "45 min" },
  { value: 60,  label: "1h"     },
  { value: 90,  label: "1h30"   },
  { value: 120, label: "2h"     },
];

interface Props {
  initial: ServiceFormData[];
  onNext: (data: ServiceFormData[]) => void;
  onBack: () => void;
}

const EMPTY: ServiceFormData = { name: "", price: "", duration_minutes: 30 };

const inputCls =
  "w-full bg-[#FAF7F2] border border-[#E8E0D5] rounded-[10px] px-[14px] py-[11px] text-[14px] text-[#1A1A1A] outline-none " +
  "placeholder:text-[#C4BAB0] transition-[border-color,box-shadow] duration-200 " +
  "focus:border-[#C2410C] focus:ring-[3px] focus:ring-[rgba(194,65,12,0.10)] focus:ring-offset-0";

const labelCls = "block text-[12px] font-medium text-[#6B7280] tracking-[0.04em] uppercase mb-1.5";

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
              Serviço {i + 1}
            </span>
            {services.length > 1 && (
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
              placeholder="Ex: Corte masculino"
              value={s.name}
              onChange={(e) => update(i, "name", e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelCls}>Preço (R$)</label>
              <input
                type="text"
                inputMode="decimal"
                className={inputCls}
                value={s.price}
                onChange={(e) => update(i, "price", formatPrice(e.target.value))}
                placeholder="0,00"
              />
            </div>
            <div>
              <label className={labelCls}>Duração</label>
              <div className="relative">
                <select
                  value={s.duration_minutes}
                  onChange={(e) => update(i, "duration_minutes", Number(e.target.value))}
                  className={[
                    "w-full appearance-none bg-[#FAF7F2] border border-[#E8E0D5] rounded-[10px]",
                    "px-[14px] py-[11px] pr-9 text-[14px] text-[#1A1A1A] outline-none",
                    "focus:border-[#C2410C] focus:ring-[3px] focus:ring-[rgba(194,65,12,0.10)] focus:ring-offset-0",
                    "transition-[border-color,box-shadow] duration-200",
                  ].join(" ")}
                >
                  {DURATION_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
                <ChevronDown
                  size={14}
                  className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#9CA3AF]"
                />
              </div>
            </div>
          </div>
        </div>
      ))}

      <button
        type="button"
        onClick={add}
        className="flex items-center gap-2 text-[13px] font-medium text-[#C2410C] hover:opacity-70 transition-opacity"
      >
        <Plus size={16} /> Adicionar serviço
      </button>

      <div className="flex gap-3 mt-2">
        <button
          type="button"
          onClick={onBack}
          className={[
            "flex-1 py-[14px] px-[14px] text-[15px] font-medium text-[#6B7280]",
            "rounded-[12px] border border-[#E8E0D5] bg-transparent",
            "hover:border-[#C2410C] hover:text-[#C2410C]",
            "transition-all duration-200",
          ].join(" ")}
        >
          Voltar
        </button>
        <button
          type="button"
          disabled={!canProceed}
          onClick={() => onNext(services)}
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
          Próximo
        </button>
      </div>
    </div>
  );
}
