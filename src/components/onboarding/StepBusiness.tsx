"use client";

import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase";
import type { BusinessFormData } from "@/types";

interface Props {
  initial: Partial<BusinessFormData>;
  onNext: (data: BusinessFormData) => void;
}

function formatZipCode(value: string): string {
  const d = value.replace(/\D/g, "").slice(0, 8);
  if (d.length <= 5) return d;
  return `${d.slice(0, 5)}-${d.slice(5)}`;
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

const NUMERIC_KEYS = ["Backspace", "Delete", "Tab", "ArrowLeft", "ArrowRight"];
function onlyDigits(e: React.KeyboardEvent) {
  if (NUMERIC_KEYS.includes(e.key)) return;
  if (!/^\d$/.test(e.key)) e.preventDefault();
}

const inputCls =
  "w-full bg-[#FAF7F2] border border-[#E8E0D5] rounded-[10px] px-[14px] py-[11px] text-[14px] text-[#1A1A1A] outline-none " +
  "placeholder:text-[#C4BAB0] transition-[border-color,box-shadow] duration-200 " +
  "focus:border-[#C2410C] focus:ring-[3px] focus:ring-[rgba(194,65,12,0.10)] focus:ring-offset-0";

const inputErrCls =
  "w-full bg-[#FAF7F2] border border-[#DC2626] rounded-[10px] px-[14px] py-[11px] text-[14px] text-[#1A1A1A] outline-none " +
  "placeholder:text-[#C4BAB0] transition-[border-color,box-shadow] duration-200 " +
  "focus:border-[#DC2626] focus:ring-[3px] focus:ring-[rgba(220,38,38,0.10)] focus:ring-offset-0";

const labelCls = "block text-[12px] font-medium text-[#6B7280] tracking-[0.04em] uppercase mb-1.5";

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
  const [zipError, setZipError] = useState("");
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
    const zipDigits = form.zip_code.replace(/\D/g, "");
    if (form.zip_code && zipDigits.length !== 8) {
      setZipError("CEP deve ter 8 dígitos.");
      return;
    }
    setLoading(true);

    const taken = await checkSlug(form.slug);
    if (taken) {
      setSlugError("Este endereço já está em uso. Escolha outro.");
      setLoading(false);
      return;
    }

    setSlugError("");
    setLoading(false);
    onNext({ ...form, zip_code: zipDigits || "" });
  }

  const set = (key: keyof BusinessFormData) => (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;
    if (key === "zip_code") { value = formatZipCode(value); setZipError(""); }
    if (key === "slug") setSlugManual(true);
    setForm((f) => ({ ...f, [key]: value }));
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      {/* Nome */}
      <div>
        <label className={labelCls}>Nome do negócio <span className="text-[#DC2626]">*</span></label>
        <input required className={inputCls} value={form.name} onChange={set("name")} placeholder="Ex: Barbearia do João" />
      </div>

      {/* Slug */}
      <div>
        <label className={labelCls}>Endereço público</label>
        <input
          className={slugError ? inputErrCls : inputCls}
          value={form.slug}
          onChange={set("slug")}
          placeholder="meu-negocio"
        />
        {slugError ? (
          <p className="text-[12px] text-[#DC2626] mt-1">{slugError}</p>
        ) : (
          <p className="text-[12px] text-[#9CA3AF] mt-1">
            slotme.app/<strong className="text-[#6B7280]">{form.slug || "seu-negocio"}</strong>
          </p>
        )}
      </div>

      {/* Descrição */}
      <div>
        <label className={labelCls}>Descrição</label>
        <input className={inputCls} value={form.description} onChange={set("description")} placeholder="Descreva seu negócio" />
      </div>

      {/* Telefone */}
      <div>
        <label className={labelCls}>Telefone</label>
        <input
          className={inputCls}
          value={form.phone}
          onChange={set("phone")}
          inputMode="numeric"
          maxLength={15}
          onKeyDown={onlyDigits}
          placeholder="(00) 00000-0000"
        />
      </div>

      {/* Rua */}
      <div>
        <label className={labelCls}>Rua</label>
        <input className={inputCls} value={form.street} onChange={set("street")} placeholder="Nome da rua" />
      </div>

      {/* Bairro + Número */}
      <div className="grid grid-cols-3 gap-3">
        <div className="col-span-2">
          <label className={labelCls}>Bairro</label>
          <input className={inputCls} value={form.neighborhood} onChange={set("neighborhood")} placeholder="Bairro" />
        </div>
        <div>
          <label className={labelCls}>Número</label>
          <input className={inputCls} value={form.street_number} onChange={set("street_number")} placeholder="123" />
        </div>
      </div>

      {/* Cidade + CEP */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className={labelCls}>Cidade</label>
          <input className={inputCls} value={form.city} onChange={set("city")} placeholder="Cidade" />
        </div>
        <div>
          <label className={labelCls}>CEP</label>
          <input
            className={zipError ? inputErrCls : inputCls}
            value={form.zip_code}
            onChange={set("zip_code")}
            inputMode="numeric"
            maxLength={9}
            onKeyDown={onlyDigits}
            placeholder="00000-000"
          />
          {zipError && <p className="text-[12px] text-[#DC2626] mt-1">{zipError}</p>}
        </div>
      </div>

      {/* Maps embed */}
      <div>
        <label className={labelCls}>Link embed Google Maps (opcional)</label>
        <input className={inputCls} value={form.maps_embed_url} onChange={set("maps_embed_url")} placeholder="https://maps.google.com/..." />
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={loading}
        className={[
          "mt-2 w-full flex items-center justify-center gap-2",
          "text-[15px] font-medium text-[#F5F0E8] rounded-[12px] py-[14px] px-[14px]",
          "bg-[radial-gradient(ellipse_at_50%_40%,#D95518_0%,#9A3412_60%,#7C2A10_100%)]",
          "border border-[rgba(120,30,5,0.6)]",
          "shadow-[0_2px_8px_rgba(120,30,5,0.35),inset_0_1px_0_rgba(255,200,150,0.20),inset_0_-1px_0_rgba(0,0,0,0.20)]",
          "hover:shadow-[0_6px_24px_rgba(120,30,5,0.50),inset_0_1px_0_rgba(255,200,150,0.25)]",
          "hover:-translate-y-px active:translate-y-0",
          "disabled:opacity-50 disabled:cursor-not-allowed",
          "transition-all duration-200 relative overflow-hidden",
        ].join(" ")}
      >
        {loading && <Loader2 size={16} className="animate-spin" />}
        Próximo
      </button>
    </form>
  );
}
