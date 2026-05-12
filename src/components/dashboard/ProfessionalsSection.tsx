"use client";

import { useState } from "react";
import { Pencil, Trash2, Plus } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { ProfAvatar } from "@/components/dashboard/ProfAvatar";
import { createClient } from "@/lib/supabase";
import type { Service, ProfessionalWithServices } from "@/types";

interface Props {
  businessId: string;
  services: Service[];
  professionals: ProfessionalWithServices[];
  onRefetch: () => Promise<void>;
}

type Form = { name: string; specialty: string; phone: string; service_ids: string[] };
const EMPTY: Form = { name: "", specialty: "", phone: "", service_ids: [] };

function formatPhone(value: string): string {
  const d = value.replace(/\D/g, "").slice(0, 11);
  if (d.length <= 2) return d.length ? `(${d}` : "";
  if (d.length <= 7) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
  return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
}

const inputCls = "w-full rounded-[10px] border border-[#27272a] bg-[#09090b] px-3 py-2 text-sm text-[#fafafa] outline-none focus:border-[#2563EB] placeholder:text-[#6b7280]";

function toggle(ids: string[], id: string) {
  return ids.includes(id) ? ids.filter((x) => x !== id) : [...ids, id];
}

function ServiceCheckboxes({ services, selectedIds, onChange }: {
  services: Service[]; selectedIds: string[]; onChange: (ids: string[]) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {services.map((s) => {
        const checked = selectedIds.includes(s.id);
        return (
          <label key={s.id} className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs border cursor-pointer transition-all
            ${checked ? "bg-[#2563EB] text-white border-[#2563EB]" : "border-[#27272a] text-[#a1a1aa] hover:border-[#2563EB]"}`}>
            <input type="checkbox" className="sr-only" checked={checked}
              onChange={() => onChange(toggle(selectedIds, s.id))} />
            {s.name}
          </label>
        );
      })}
    </div>
  );
}

function ProfForm({ form, services, onChange, onSave, onCancel, saving }: {
  form: Form; services: Service[]; onChange: (f: Form) => void;
  onSave: () => void; onCancel: () => void; saving: boolean;
}) {
  return (
    <div className="bg-[#09090b] rounded-[10px] p-3 flex flex-col gap-2">
      <input className={inputCls} placeholder="Nome" value={form.name}
        onChange={(e) => onChange({ ...form, name: e.target.value })} />
      <input className={inputCls} placeholder="Especialidade (opcional)" value={form.specialty}
        onChange={(e) => onChange({ ...form, specialty: e.target.value })} />
      <input className={inputCls} placeholder="Telefone (opcional)" value={form.phone}
        inputMode="numeric" onChange={(e) => onChange({ ...form, phone: formatPhone(e.target.value) })} />
      {services.length > 0 && (
        <>
          <p className="text-xs text-[#a1a1aa]">Serviços</p>
          <ServiceCheckboxes services={services} selectedIds={form.service_ids}
            onChange={(ids) => onChange({ ...form, service_ids: ids })} />
        </>
      )}
      <div className="flex gap-2 mt-1">
        <Button type="button" variant="secondary" className="flex-1" onClick={onCancel}>Cancelar</Button>
        <Button type="button" loading={saving} disabled={!form.name} className="flex-1" onClick={onSave}>Salvar</Button>
      </div>
    </div>
  );
}

export function ProfessionalsSection({ businessId, services, professionals, onRefetch }: Props) {
  const [adding, setAdding] = useState(false);
  const [addForm, setAddForm] = useState<Form>(EMPTY);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Form>(EMPTY);
  const [confirmId, setConfirmId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const supabase = createClient();

  async function handleAdd() {
    setSaving(true);
    const { data: prof } = await supabase.from("professionals")
      .insert({ business_id: businessId, name: addForm.name, specialty: addForm.specialty || null, phone: addForm.phone || null })
      .select().single();
    if (prof && addForm.service_ids.length > 0) {
      await supabase.from("professional_services").insert(
        addForm.service_ids.map((id) => ({ professional_id: prof.id, service_id: id }))
      );
    }
    setAddForm(EMPTY); setAdding(false);
    await onRefetch(); setSaving(false);
  }

  function startEdit(p: ProfessionalWithServices) {
    setEditingId(p.id);
    setEditForm({ name: p.name, specialty: p.specialty ?? "", phone: p.phone ?? "", service_ids: p.services.map((s) => s.id) });
  }

  async function handleEdit() {
    if (!editingId) return;
    setSaving(true);
    await supabase.from("professionals").update({ name: editForm.name, specialty: editForm.specialty || null, phone: editForm.phone || null }).eq("id", editingId);
    await supabase.from("professional_services").delete().eq("professional_id", editingId);
    if (editForm.service_ids.length > 0) {
      await supabase.from("professional_services").insert(
        editForm.service_ids.map((id) => ({ professional_id: editingId, service_id: id }))
      );
    }
    setEditingId(null);
    await onRefetch(); setSaving(false);
  }

  async function handleRemove(id: string) {
    await supabase.from("professional_services").delete().eq("professional_id", id);
    await supabase.from("professionals").delete().eq("id", id);
    setConfirmId(null); await onRefetch();
  }

  return (
    <section className="bg-[#18181b] border border-[#27272a] rounded-[12px] p-5">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-[#fafafa] font-semibold">Profissionais</h2>
        <button onClick={() => { setAdding((v) => !v); setAddForm(EMPTY); }}
          className="flex items-center gap-1.5 text-xs text-[#2563EB] hover:opacity-70 transition-opacity">
          <Plus size={13} /> Adicionar profissional
        </button>
      </div>
      <div className="flex flex-col gap-3">
        {adding && (
          <ProfForm form={addForm} services={services} onChange={setAddForm} saving={saving}
            onSave={handleAdd} onCancel={() => setAdding(false)} />
        )}
        {professionals.map((p) => (
          <div key={p.id}>
            {editingId === p.id ? (
              <ProfForm form={editForm} services={services} onChange={setEditForm} saving={saving}
                onSave={handleEdit} onCancel={() => setEditingId(null)} />
            ) : confirmId === p.id ? (
              <div className="flex items-center justify-between text-sm bg-[#450a0a] rounded-[8px] px-3 py-2">
                <span className="text-[#fca5a5]">Remover &ldquo;{p.name}&rdquo;?</span>
                <div className="flex gap-3">
                  <button className="text-xs text-[#a1a1aa] hover:text-white" onClick={() => setConfirmId(null)}>Não</button>
                  <button className="text-xs text-[#fca5a5] hover:text-white font-medium" onClick={() => handleRemove(p.id)}>Sim, remover</button>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3 text-sm">
                <ProfAvatar profId={p.id} name={p.name} photoUrl={p.photo_url} onRefetch={onRefetch} />
                <div className="flex-1 min-w-0">
                  <p className="text-[#fafafa]">{p.name}{p.specialty ? ` — ${p.specialty}` : ""}</p>
                  {p.services.length > 0 && (
                    <p className="text-xs text-[#a1a1aa] mt-0.5 truncate">{p.services.map((s) => s.name).join(", ")}</p>
                  )}
                  {p.phone && (
                    <a href={`tel:${p.phone.replace(/\D/g, "")}`} className="text-xs text-[#2563EB] hover:underline mt-0.5 block">
                      {formatPhone(p.phone)}
                    </a>
                  )}
                </div>
                <div className="flex gap-2 shrink-0">
                  <button onClick={() => startEdit(p)} className="text-[#a1a1aa] hover:text-[#2563EB] transition-colors"><Pencil size={13} /></button>
                  <button onClick={() => setConfirmId(p.id)} className="text-[#a1a1aa] hover:text-[#dc2626] transition-colors"><Trash2 size={13} /></button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
