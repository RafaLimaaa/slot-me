"use client";

import { useState } from "react";
import type { WorkingHoursFormData } from "@/types";

const DAY_NAMES = ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"];

interface Props {
  initial: WorkingHoursFormData[];
  onNext: (data: WorkingHoursFormData[]) => void;
  onBack: () => void;
}

const DEFAULT_HOURS: WorkingHoursFormData[] = DAY_NAMES.map((_, i) => ({
  day_of_week: i,
  enabled: i >= 1 && i <= 6,
  start_time: "09:00",
  end_time: "18:00",
  lunch_start: "12:00",
  lunch_end: "13:00",
}));

const timeCls =
  "bg-[#FAF7F2] border border-[#E8E0D5] rounded-[8px] px-2 py-1.5 text-[13px] text-[#1A1A1A] outline-none " +
  "focus:border-[#C2410C] focus:ring-[2px] focus:ring-[rgba(194,65,12,0.10)] focus:ring-offset-0 " +
  "transition-[border-color,box-shadow] duration-200";

export function StepHours({ initial, onNext, onBack }: Props) {
  const [hours, setHours] = useState<WorkingHoursFormData[]>(
    initial.length ? initial : DEFAULT_HOURS
  );

  const hasEnabled = hours.some((h) => h.enabled);

  function update(index: number, field: keyof WorkingHoursFormData, value: string | boolean) {
    setHours((prev) =>
      prev.map((h, i) => (i === index ? { ...h, [field]: value } : h))
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {hours.map((h, i) => (
        <div
          key={h.day_of_week}
          style={{
            background: h.enabled ? "rgba(194,65,12,0.03)" : "transparent",
            border: h.enabled ? "1px solid rgba(194,65,12,0.10)" : "1px solid transparent",
            borderRadius: 10,
            padding: "10px 12px",
            transition: "all 200ms ease",
          }}
        >
          <div className="flex items-start gap-3 flex-wrap">
            <label className="flex items-center gap-2 w-[88px] shrink-0 pt-0.5 cursor-pointer">
              <input
                type="checkbox"
                checked={h.enabled}
                onChange={(e) => update(i, "enabled", e.target.checked)}
                className="accent-[#C2410C] w-4 h-4 cursor-pointer"
              />
              <span
                style={{
                  fontSize: 13,
                  fontWeight: 500,
                  color: h.enabled ? "#1A1A1A" : "#9CA3AF",
                  transition: "color 200ms",
                }}
              >
                {DAY_NAMES[h.day_of_week]}
              </span>
            </label>

            {h.enabled && (
              <div className="flex items-center gap-2 flex-wrap">
                <input
                  type="time"
                  value={h.start_time}
                  onChange={(e) => update(i, "start_time", e.target.value)}
                  className={timeCls}
                />
                <span className="text-[12px] text-[#9CA3AF]">até</span>
                <input
                  type="time"
                  value={h.end_time}
                  onChange={(e) => update(i, "end_time", e.target.value)}
                  className={timeCls}
                />
                <span className="text-[11px] text-[#C4BAB0] ml-1">almoço</span>
                <input
                  type="time"
                  value={h.lunch_start}
                  onChange={(e) => update(i, "lunch_start", e.target.value)}
                  className={timeCls}
                />
                <span className="text-[12px] text-[#9CA3AF]">-</span>
                <input
                  type="time"
                  value={h.lunch_end}
                  onChange={(e) => update(i, "lunch_end", e.target.value)}
                  className={timeCls}
                />
              </div>
            )}
          </div>
        </div>
      ))}

      {!hasEnabled && (
        <p className="text-[13px] text-[#DC2626] mt-1">
          Habilite pelo menos um dia de funcionamento.
        </p>
      )}

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
          disabled={!hasEnabled}
          onClick={() => onNext(hours)}
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
