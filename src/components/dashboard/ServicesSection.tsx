"use client";

import { useState } from "react";
import { Pencil, Trash2, Plus } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Select } from "@/components/ui/Select";
import { createClient } from "@/lib/supabase";
import type { Service } from "@/types";

const DURATION_OPTIONS = [
  { value: 30, label: "30 min" }, { value: 45, label: "45 min" },
  { value: 60, label: "1h" }, { value: 90, label: "1h30" }, { value: 120, label: "2h" },
];

function formatPrice(v: string) {
  const n = parseInt(v.replace(/\D/g, "") || "0", 10) / 100;
  return n.toLocaleString("pt-BR", { minimumFractionDigits: 2 });
}

function parsePrice(v: string) {
  return parseFloat(v.replace(/\./g, "").replace(",", ".")) || 0;
}

const inputCls = "w-full rounded-[10px] border border-[#27272a] bg-[#09090b] px-3 py-2 text-sm text-[#fafafa] outline-none focus:border-[#C2410C] placeholder:text-[#6b7280]";

interface Props { businessId: string; services: Service[]; onRefetch: () => Promise<void>; }
type Form = { name: string; price: string; duration_minutes: number };
const EMPTY: Form = { name: "", price: "", duration_minutes: 30 };

function ServiceForm({ form, onChange, onSave, onCancel, saving }: {
  form: Form; onChange: (f: Form) => void; onSave: () => void; onCancel: () => void; saving: boolean;
}) {
  return (
    <div className="bg-[#09090b] rounded-[10px] p-3 flex flex-col gap-2">
      <input className={inputCls} placeholder="Nome do serviço" value={form.name}
        onChange={(e) => onChange({ ...form, name: e.target.value })} />
      <div className="grid grid-cols-2 gap-2">
        <input className={inputCls} type="text" inputMode="numeric" placeholder="Preço (R$)"
          value={form.price}
          onChange={(e) => onChange({ ...form, price: formatPrice(e.target.value) })} />
        <Select label="" value={form.duration_minutes} options={DURATION_OPTIONS}
          onChange={(e) => onChange({ ...form, duration_minutes: Number(e.target.value) })} />
      </div>
      <div className="flex gap-2">
        <Button type="button" variant="secondary" className="flex-1" onClick={onCancel}>Cancelar</Button>
        <Button type="button" loading={saving} disabled={!form.name || !form.price} className="flex-1" onClick={onSave}>Salvar</Button>
      </div>
    </div>
  );
}

export function ServicesSection({ businessId, services, onRefetch }: Props) {
  const [adding, setAdding] = useState(false);
  const [addForm, setAddForm] = useState<Form>(EMPTY);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Form>(EMPTY);
  const [confirmId, setConfirmId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const supabase = createClient();

  async function handleAdd() {
    setSaving(true);
    await supabase.from("services").insert({
      business_id: businessId, name: addForm.name,
      price: parsePrice(addForm.price), duration_minutes: addForm.duration_minutes,
    });
    setAddForm(EMPTY); setAdding(false);
    await onRefetch(); setSaving(false);
  }

  function startEdit(s: Service) {
    setEditingId(s.id);
    setEditForm({ name: s.name, price: s.price.toLocaleString("pt-BR", { minimumFractionDigits: 2 }), duration_minutes: s.duration_minutes });
  }

  async function handleEdit() {
    if (!editingId) return;
    setSaving(true);
    await supabase.from("services").update({
      name: editForm.name, price: parsePrice(editForm.price), duration_minutes: editForm.duration_minutes,
    }).eq("id", editingId);
    setEditingId(null);
    await onRefetch(); setSaving(false);
  }

  async function handleRemove(id: string) {
    await supabase.from("professional_services").delete().eq("service_id", id);
    await supabase.from("services").delete().eq("id", id);
    setConfirmId(null); await onRefetch();
  }

  const brl = (v: number) => v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

  return (
    <section className="bg-[#18181b] border border-[#27272a] rounded-[12px] p-5">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-[#fafafa] font-semibold">Serviços</h2>
        <button onClick={() => { setAdding((v) => !v); setAddForm(EMPTY); }}
          className="flex items-center gap-1.5 text-xs text-[#C2410C] hover:opacity-70 transition-opacity">
          <Plus size={13} /> Adicionar serviço
        </button>
      </div>
      <div className="flex flex-col gap-2">
        {adding && (
          <ServiceForm form={addForm} onChange={setAddForm} saving={saving}
            onSave={handleAdd} onCancel={() => setAdding(false)} />
        )}
        {services.map((s) => (
          <div key={s.id}>
            {editingId === s.id ? (
              <ServiceForm form={editForm} onChange={setEditForm} saving={saving}
                onSave={handleEdit} onCancel={() => setEditingId(null)} />
            ) : confirmId === s.id ? (
              <div className="flex items-center justify-between text-sm bg-[#450a0a] rounded-[8px] px-3 py-2">
                <span className="text-[#fca5a5]">Remover &ldquo;{s.name}&rdquo;?</span>
                <div className="flex gap-3">
                  <button className="text-xs text-[#a1a1aa] hover:text-white" onClick={() => setConfirmId(null)}>Não</button>
                  <button className="text-xs text-[#fca5a5] hover:text-white font-medium" onClick={() => handleRemove(s.id)}>Sim, remover</button>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between text-sm py-0.5">
                <span className="text-[#fafafa]">{s.name}</span>
                <div className="flex items-center gap-3">
                  <span className="text-[#a1a1aa] text-xs">{brl(s.price)} · {s.duration_minutes} min</span>
                  <button onClick={() => startEdit(s)} className="text-[#a1a1aa] hover:text-[#C2410C] transition-colors"><Pencil size={13} /></button>
                  <button onClick={() => setConfirmId(s.id)} className="text-[#a1a1aa] hover:text-[#dc2626] transition-colors"><Trash2 size={13} /></button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
