"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
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

export function StepHours({ initial, onNext, onBack }: Props) {
  const [hours, setHours] = useState<WorkingHoursFormData[]>(
    initial.length ? initial : DEFAULT_HOURS
  );

  function update(index: number, field: keyof WorkingHoursFormData, value: string | boolean) {
    setHours((prev) =>
      prev.map((h, i) => (i === index ? { ...h, [field]: value } : h))
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {hours.map((h, i) => (
        <div key={h.day_of_week} className="flex items-center gap-3">
          <label className="flex items-center gap-2 w-24 shrink-0">
            <input
              type="checkbox"
              checked={h.enabled}
              onChange={(e) => update(i, "enabled", e.target.checked)}
              className="accent-[#2563EB] w-4 h-4"
            />
            <span className="text-sm text-[#09090b]">{DAY_NAMES[h.day_of_week]}</span>
          </label>

          {h.enabled && (
            <div className="flex items-center gap-2 flex-wrap text-sm text-[#6b7280]">
              <input
                type="time"
                value={h.start_time}
                onChange={(e) => update(i, "start_time", e.target.value)}
                className="border border-[#e2e8f0] rounded-[8px] px-2 py-1 text-[#09090b] text-sm"
              />
              <span>até</span>
              <input
                type="time"
                value={h.end_time}
                onChange={(e) => update(i, "end_time", e.target.value)}
                className="border border-[#e2e8f0] rounded-[8px] px-2 py-1 text-[#09090b] text-sm"
              />
              <span className="text-xs text-[#a1a1aa]">almoço</span>
              <input
                type="time"
                value={h.lunch_start}
                onChange={(e) => update(i, "lunch_start", e.target.value)}
                className="border border-[#e2e8f0] rounded-[8px] px-2 py-1 text-[#09090b] text-sm"
              />
              <span>-</span>
              <input
                type="time"
                value={h.lunch_end}
                onChange={(e) => update(i, "lunch_end", e.target.value)}
                className="border border-[#e2e8f0] rounded-[8px] px-2 py-1 text-[#09090b] text-sm"
              />
            </div>
          )}
        </div>
      ))}

      <div className="flex gap-3 mt-2">
        <Button variant="secondary" onClick={onBack} className="flex-1">Voltar</Button>
        <Button onClick={() => onNext(hours)} className="flex-1">Próximo</Button>
      </div>
    </div>
  );
}
