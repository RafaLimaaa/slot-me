"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { createClient } from "@/lib/supabase";
import type { BusinessFormData } from "@/types";

interface Props {
  initial: Partial<BusinessFormData>;
  onNext: (data: BusinessFormData) => void;
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export function StepBusiness({ initial, onNext }: Props) {
  const [form, setForm] = useState<BusinessFormData>({
    name: initial.name ?? "",
    slug: initial.slug ?? "",
    description: initial.description ?? "",
    street: initial.street ?? "",
    street_number: initial.street_number ?? "",
    neighborhood: initial.neighborhood ?? "",
    city: initial.city ?? "",
    zip_code: initial.zip_code ?? "",
    phone: initial.phone ?? "",
    maps_embed_url: initial.maps_embed_url ?? "",
  });
  const [slugManual, setSlugManual] = useState(!!initial.slug);
  const [slugError, setSlugError] = useState("");
  const [loading, setLoading] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    if (!slugManual && form.name) {
      setForm((f) => ({ ...f, slug: slugify(form.name) }));
    }
  }, [form.name, slugManual]);

  async function checkSlug(slug: string) {
    const { data } = await supabase
      .from("businesses")
      .select("id")
      .eq("slug", slug)
      .maybeSingle();
    return !!data;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name || !form.slug) return;
    setLoading(true);

    const taken = await checkSlug(form.slug);
    if (taken) {
      setSlugError("Este endereço já está em uso. Escolha outro.");
      setLoading(false);
      return;
    }

    setSlugError("");
    setLoading(false);
    onNext(form);
  }

  const set = (key: keyof BusinessFormData) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((f) => ({ ...f, [key]: e.target.value }));
    if (key === "slug") setSlugManual(true);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <Input label="Nome do negócio" required value={form.name} onChange={set("name")} />
      <div>
        <Input
          label="Endereço público (slug)"
          value={form.slug}
          onChange={set("slug")}
          error={slugError}
          prefix="slotme.app/"
        />
        <p className="text-xs text-[#6b7280] mt-1">
          slotme.app/<strong>{form.slug || "seu-negocio"}</strong>
        </p>
      </div>
      <Input label="Descrição" value={form.description} onChange={set("description")} />
      <Input label="Telefone" value={form.phone} onChange={set("phone")} />
      <Input label="Rua" value={form.street} onChange={set("street")} />
      <div className="grid grid-cols-3 gap-3">
        <div className="col-span-2">
          <Input label="Bairro" value={form.neighborhood} onChange={set("neighborhood")} />
        </div>
        <Input label="Número" value={form.street_number} onChange={set("street_number")} />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <Input label="Cidade" value={form.city} onChange={set("city")} />
        <Input label="CEP" value={form.zip_code} onChange={set("zip_code")} />
      </div>
      <Input label="Link embed Google Maps (opcional)" value={form.maps_embed_url} onChange={set("maps_embed_url")} />
      <Button type="submit" loading={loading} className="w-full mt-2">
        Próximo
      </Button>
    </form>
  );
}
