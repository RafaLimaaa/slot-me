"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { Select } from "@/components/ui/Select";
import { createClient } from "@/lib/supabase";
import type { WorkingHours, WorkingHoursFormData, ProfessionalWithServices } from "@/types";

const DAYS = ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"];

const DEFAULTS: WorkingHoursFormData[] = DAYS.map((_, i) => ({
  day_of_week: i,
  enabled: i >= 1 && i <= 6,
  start_time: "09:00",
  end_time: "18:00",
  lunch_start: "12:00",
  lunch_end: "13:00",
}));

function toFormData(wh: WorkingHours[]): WorkingHoursFormData[] {
  return DAYS.map((_, i) => {
    const row = wh.find((h) => h.day_of_week === i);
    if (!row) return { ...DEFAULTS[i], enabled: false };
    return {
      day_of_week: i,
      enabled: true,
      start_time: row.start_time.slice(0, 5),
      end_time: row.end_time.slice(0, 5),
      lunch_start: row.lunch_start?.slice(0, 5) ?? "",
      lunch_end: row.lunch_end?.slice(0, 5) ?? "",
    };
  });
}

interface Props {
  professionals: ProfessionalWithServices[];
  workingHours: WorkingHours[];
  onRefetch: () => void;
}

export function WorkingHoursSection({ professionals, workingHours, onRefetch }: Props) {
  const [selectedId, setSelectedId] = useState("");
  const [hours, setHours] = useState<WorkingHoursFormData[]>(DEFAULTS);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    if (!selectedId) return;
    const profHours = workingHours.filter((h) => h.professional_id === selectedId);
    setHours(toFormData(profHours));
    setSaved(false);
  }, [selectedId, workingHours]);

  function update(i: number, field: keyof WorkingHoursFormData, value: string | boolean) {
    setHours((prev) => prev.map((h, idx) => (idx === i ? { ...h, [field]: value } : h)));
    setSaved(false);
  }

  async function handleSave() {
    if (!selectedId) return;
    setSaving(true);
    await supabase.from("working_hours").delete().eq("professional_id", selectedId);
    const rows = hours
      .filter((h) => h.enabled)
      .map((h) => ({
        professional_id: selectedId,
        day_of_week: h.day_of_week,
        start_time: h.start_time,
        end_time: h.end_time,
        lunch_start: h.lunch_start || null,
        lunch_end: h.lunch_end || null,
      }));
    if (rows.length > 0) await supabase.from("working_hours").insert(rows);
    await onRefetch();
    setSaving(false);
    setSaved(true);
  }

  const hasEnabled = hours.some((h) => h.enabled);

  return (
    <div className="flex flex-col gap-4">
      <Select
        label="Profissional"
        value={selectedId}
        options={[
          { value: "", label: "Selecione um profissional..." },
          ...professionals.map((p) => ({ value: p.id, label: p.name })),
        ]}
        onChange={(e) => setSelectedId(e.target.value)}
      />

      {selectedId && (
        <>
          <div className="flex flex-col gap-3">
            {hours.map((h, i) => (
              <div key={h.day_of_week} className="flex items-center gap-3 flex-wrap">
                <label className="flex items-center gap-2 w-24 shrink-0 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={h.enabled}
                    onChange={(e) => update(i, "enabled", e.target.checked)}
                    className="accent-[#C2410C] w-4 h-4"
                  />
                  <span className="text-sm text-[#a1a1aa]">{DAYS[h.day_of_week]}</span>
                </label>

                {h.enabled && (
                  <div className="flex items-center gap-2 flex-wrap text-sm">
                    <TInput value={h.start_time} onChange={(v) => update(i, "start_time", v)} />
                    <span className="text-[#71717a]">até</span>
                    <TInput value={h.end_time} onChange={(v) => update(i, "end_time", v)} />
                    <span className="text-xs text-[#52525b]">almoço</span>
                    <TInput value={h.lunch_start} onChange={(v) => update(i, "lunch_start", v)} />
                    <span className="text-[#71717a]">–</span>
                    <TInput value={h.lunch_end} onChange={(v) => update(i, "lunch_end", v)} />
                  </div>
                )}
              </div>
            ))}
          </div>

          {!hasEnabled && (
            <p className="text-sm text-[#DC2626]">Habilite pelo menos um dia.</p>
          )}

          <Button onClick={handleSave} loading={saving} disabled={!hasEnabled} className="w-full">
            {saved ? "Salvo!" : "Salvar horários"}
          </Button>
        </>
      )}
    </div>
  );
}

function TInput({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <input
      type="time"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="bg-[#0C0C0C] border border-[#2A2A2A] rounded-[8px] px-2 py-1 text-[#fafafa] text-sm"
    />
  );
}
