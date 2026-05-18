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
  street: string; street_number: string; neighborhood: string;
  city: string; zip_code: string; phone: string; maps_embed_url: string;
};

function formatPhone(value: string): string {
  const d = value.replace(/\D/g, "").slice(0, 11);
  if (d.length <= 2) return d.length ? `(${d}` : "";
  if (d.length <= 7) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
  return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
}

function formatZipCode(value: string): string {
  const d = value.replace(/\D/g, "").slice(0, 8);
  if (d.length <= 5) return d;
  return `${d.slice(0, 5)}-${d.slice(5)}`;
}

export function BusinessSection({ business, onRefetch }: Props) {
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [phoneError, setPhoneError] = useState<string | undefined>();
  const [zipError, setZipError] = useState<string | undefined>();
  const [form, setForm] = useState<Form>({
    name: "", slug: "", description: "",
    street: "", street_number: "", neighborhood: "", city: "", zip_code: "",
    phone: "", maps_embed_url: "",
  });
  const supabase = createClient();

  function startEdit() {
    setForm({
      name: business.name, slug: business.slug, description: business.description ?? "",
      street: business.address ?? "", street_number: business.street_number ?? "",
      neighborhood: business.neighborhood ?? "", city: business.city ?? "",
      zip_code: formatZipCode(business.zip_code ?? ""),
      phone: formatPhone(business.phone ?? ""), maps_embed_url: business.maps_embed_url ?? "",
    });
    setPhoneError(undefined);
    setZipError(undefined);
    setSaveError(null);
    setEditing(true);
  }

  async function save() {
    const phoneDigits = form.phone.replace(/\D/g, "");
    if (form.phone && phoneDigits.length < 10) {
      setPhoneError("Informe um telefone válido com 10 ou 11 dígitos.");
      return;
    }
    const zipDigits = form.zip_code.replace(/\D/g, "");
    if (form.zip_code && zipDigits.length !== 8) {
      setZipError("CEP deve ter 8 dígitos.");
      return;
    }
    setSaving(true);
    setSaveError(null);
    const { error } = await supabase.from("businesses").update({
      name: form.name,
      slug: form.slug.toLowerCase().replace(/\s+/g, "-"),
      description: form.description || null,
      address: form.street || null,
      street_number: form.street_number || null,
      neighborhood: form.neighborhood || null,
      city: form.city || null,
      zip_code: zipDigits || null,
      phone: form.phone || null,
      maps_embed_url: form.maps_embed_url || null,
    }).eq("id", business.id);
    setSaving(false);
    if (error) {
      setSaveError(`Erro ao salvar: ${error.message}`);
      return;
    }
    await onRefetch();
    setEditing(false);
  }

  const upd = (k: keyof Form) => (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;
    if (k === "phone") { value = formatPhone(value); setPhoneError(undefined); }
    if (k === "zip_code") { value = formatZipCode(value); setZipError(undefined); }
    setForm((f) => ({ ...f, [k]: value }));
  };

  const fullAddress = [
    business.address && `${business.address}${business.street_number ? `, ${business.street_number}` : ""}`,
    business.neighborhood,
    business.city,
    business.zip_code && `CEP ${business.zip_code}`,
  ].filter(Boolean).join(" — ") || "—";

  return (
    <div>
      {!editing && (
        <div className="flex justify-end mb-4">
          <button onClick={startEdit} className="flex items-center gap-1.5 text-xs text-[#C2410C] hover:opacity-70 transition-opacity">
            <Pencil size={13} /> Editar
          </button>
        </div>
      )}

      {editing ? (
        <div className="flex flex-col gap-3">
          <Input label="Nome" value={form.name} onChange={upd("name")} />
          <Input label="Slug" value={form.slug} onChange={upd("slug")} />
          <Input label="Descrição" value={form.description} onChange={upd("description")} />
          <Input label="Telefone" value={form.phone} onChange={upd("phone")}
            inputMode="numeric" placeholder="(00) 00000-0000" error={phoneError} />
          <Input label="Rua" value={form.street} onChange={upd("street")} />
          <div className="grid grid-cols-3 gap-3">
            <div className="col-span-2"><Input label="Bairro" value={form.neighborhood} onChange={upd("neighborhood")} /></div>
            <Input label="Número" value={form.street_number} onChange={upd("street_number")} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Input label="Cidade" value={form.city} onChange={upd("city")} />
            <Input label="CEP" value={form.zip_code} onChange={upd("zip_code")}
              inputMode="numeric" placeholder="00000-000" error={zipError} />
          </div>
          <Input label="Link Google Maps" value={form.maps_embed_url} onChange={upd("maps_embed_url")} />
          {saveError && (
            <p className="text-xs text-[#fca5a5] bg-[#450a0a] rounded-[8px] px-3 py-2">{saveError}</p>
          )}
          <div className="flex gap-2 mt-1">
            <Button type="button" variant="secondary" className="flex-1" onClick={() => setEditing(false)}>Cancelar</Button>
            <Button type="button" loading={saving} className="flex-1" onClick={save}>Salvar</Button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
          {[
            ["Nome", business.name],
            ["Slug", business.slug],
            ["Telefone", business.phone ? formatPhone(business.phone) : "—"],
            ["Endereço", fullAddress],
            ["Descrição", business.description ?? "—"],
          ].map(([k, v]) => (
            <div key={k}>
              <p className="text-[#a1a1aa] text-xs mb-0.5">{k}</p>
              <p className="text-[#fafafa]">{v}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
