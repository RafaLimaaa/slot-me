"use client";

import { useState } from "react";
import { Pencil } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { createClient } from "@/lib/supabase";
import type { Business } from "@/types";

interface Props {
  business: Business;
  onRefetch: () => Promise<void>;
}

type Form = {
  name: string; slug: string; description: string;
  address: string; city: string; phone: string; maps_embed_url: string;
};

const FIELDS: [keyof Form, string][] = [
  ["name", "Nome"], ["slug", "Slug"], ["city", "Cidade"], ["phone", "Telefone"],
  ["address", "Endereço"], ["description", "Descrição"], ["maps_embed_url", "Link Google Maps"],
];

export function BusinessSection({ business, onRefetch }: Props) {
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<Form>({
    name: "", slug: "", description: "", address: "", city: "", phone: "", maps_embed_url: "",
  });
  const supabase = createClient();

  function startEdit() {
    setForm({
      name: business.name, slug: business.slug, description: business.description ?? "",
      address: business.address ?? "", city: business.city ?? "",
      phone: business.phone ?? "", maps_embed_url: business.maps_embed_url ?? "",
    });
    setEditing(true);
  }

  async function save() {
    setSaving(true);
    await supabase.from("businesses").update({
      name: form.name,
      slug: form.slug.toLowerCase().replace(/\s+/g, "-"),
      description: form.description || null,
      address: form.address || null,
      city: form.city || null,
      phone: form.phone || null,
      maps_embed_url: form.maps_embed_url || null,
    }).eq("id", business.id);
    await onRefetch();
    setSaving(false);
    setEditing(false);
  }

  const upd = (k: keyof Form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  return (
    <section className="bg-[#18181b] border border-[#27272a] rounded-[12px] p-5">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-[#fafafa] font-semibold">Dados do negócio</h2>
        {!editing && (
          <button onClick={startEdit} className="flex items-center gap-1.5 text-xs text-[#2563EB] hover:opacity-70 transition-opacity">
            <Pencil size={13} /> Editar
          </button>
        )}
      </div>

      {editing ? (
        <div className="flex flex-col gap-3">
          {FIELDS.map(([key, label]) => (
            <Input key={key} label={label} value={form[key]} onChange={upd(key)} />
          ))}
          <div className="flex gap-2 mt-1">
            <Button type="button" variant="secondary" className="flex-1" onClick={() => setEditing(false)}>
              Cancelar
            </Button>
            <Button type="button" loading={saving} className="flex-1" onClick={save}>
              Salvar
            </Button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
          {[["Nome", business.name], ["Slug", business.slug], ["Cidade", business.city ?? "—"],
            ["Telefone", business.phone ?? "—"], ["Endereço", business.address ?? "—"],
            ["Descrição", business.description ?? "—"],
          ].map(([k, v]) => (
            <div key={k}>
              <p className="text-[#a1a1aa] text-xs mb-0.5">{k}</p>
              <p className="text-[#fafafa]">{v}</p>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
