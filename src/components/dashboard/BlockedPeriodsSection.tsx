"use client";

import { useState, useEffect, useCallback } from "react";
import { Trash2 } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { createClient } from "@/lib/supabase";

interface Prof { id: string; name: string; }

interface BlockedPeriod {
  id: string;
  professional_id: string;
  date: string;
  start_time: string;
  end_time: string;
  reason: string | null;
  professional: { id: string; name: string } | null;
}

const EMPTY = { professional_id: "", date: "", start_time: "", end_time: "", reason: "" };

export function BlockedPeriodsSection({ professionals }: { professionals: Prof[] }) {
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [blocks, setBlocks] = useState<BlockedPeriod[]>([]);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const supabase = createClient();
  const today = new Date().toISOString().slice(0, 10);

  const fetchBlocks = useCallback(async () => {
    if (!professionals.length) return;
    const { data } = await supabase
      .from("blocked_periods")
      .select("*, professional:professionals(id,name)")
      .in("professional_id", professionals.map((p) => p.id))
      .gte("date", today)
      .order("date", { ascending: true })
      .order("start_time", { ascending: true });
    setBlocks((data as BlockedPeriod[]) ?? []);
  }, [professionals, today]);

  useEffect(() => { fetchBlocks(); }, [fetchBlocks]);

  async function handleBlock(e: React.FormEvent) {
    e.preventDefault();
    if (!form.professional_id || !form.date || !form.start_time || !form.end_time) return;
    if (form.start_time >= form.end_time) {
      setSaveError("O horário de início deve ser anterior ao horário de fim.");
      return;
    }
    setSaving(true);
    setSaveError(null);
    const { error } = await supabase.from("blocked_periods").insert({
      professional_id: form.professional_id,
      date: form.date,
      start_time: form.start_time,
      end_time: form.end_time,
      reason: form.reason || null,
    });
    setSaving(false);
    if (error) {
      setSaveError(`Erro ao bloquear: ${error.message}`);
      return;
    }
    setForm(EMPTY);
    await fetchBlocks();
  }

  async function handleDelete(id: string) {
    setDeletingId(id);
    await supabase.from("blocked_periods").delete().eq("id", id);
    setDeletingId(null);
    await fetchBlocks();
  }

  const upd = (k: keyof typeof EMPTY) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((f) => ({ ...f, [k]: e.target.value }));
    setSaveError(null);
  };

  return (
    <div>
      <form onSubmit={handleBlock} className="flex flex-col gap-3">
        <Select
          label="Profissional"
          value={form.professional_id}
          options={[{ value: "", label: "Selecione..." }, ...professionals.map((p) => ({ value: p.id, label: p.name }))]}
          onChange={(e) => { setForm((f) => ({ ...f, professional_id: e.target.value })); setSaveError(null); }}
        />
        <Input label="Data" type="date" value={form.date} onChange={upd("date")} />
        <div className="grid grid-cols-2 gap-3">
          <Input label="Início" type="time" value={form.start_time} onChange={upd("start_time")} />
          <Input label="Fim" type="time" value={form.end_time} onChange={upd("end_time")} />
        </div>
        <Input label="Motivo (opcional)" value={form.reason} onChange={upd("reason")} />
        {saveError && (
          <p className="text-xs text-[#fca5a5] bg-[#450a0a] rounded-[8px] px-3 py-2">{saveError}</p>
        )}
        <Button type="submit" loading={saving} className="w-full">Bloquear horário</Button>
      </form>

      {blocks.length > 0 && (
        <div className="mt-5 flex flex-col gap-2">
          <p className="text-xs text-[#a1a1aa] font-medium uppercase tracking-wide">Bloqueios cadastrados</p>
          {blocks.map((b) => (
            <div key={b.id} className="flex items-center justify-between bg-[#0C0C0C] rounded-[10px] px-3 py-2 text-sm">
              <div className="flex flex-col gap-0.5 min-w-0">
                <span className="text-[#fafafa] font-medium truncate">
                  {b.professional?.name} — {new Date(b.date + "T00:00:00").toLocaleDateString("pt-BR", { day: "2-digit", month: "short" })}
                </span>
                <span className="text-[#a1a1aa] text-xs">
                  {b.start_time.slice(0, 5)}–{b.end_time.slice(0, 5)}
                  {b.reason ? ` · ${b.reason}` : ""}
                </span>
              </div>
              <button
                onClick={() => handleDelete(b.id)}
                disabled={deletingId === b.id}
                className="text-[#a1a1aa] hover:text-[#dc2626] transition-colors shrink-0 ml-3 disabled:opacity-40"
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
