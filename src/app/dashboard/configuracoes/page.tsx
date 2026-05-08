"use client";

import { useState } from "react";
import { Spinner } from "@/components/ui/Spinner";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/hooks/useAuth";
import { useBusiness } from "@/hooks/useBusiness";
import { createClient } from "@/lib/supabase";
import type { ServiceFormData } from "@/types";

const DURATION_OPTIONS = [
  { value: 30, label: "30 min" },
  { value: 45, label: "45 min" },
  { value: 60, label: "1h" },
  { value: 90, label: "1h30" },
  { value: 120, label: "2h" },
];

export default function ConfiguracoesPage() {
  const { user, loading: authLoading } = useAuth();
  const { business, services, professionals, loading } = useBusiness(user?.id);
  const [blockForm, setBlockForm] = useState({
    professional_id: "",
    date: "",
    start_time: "",
    end_time: "",
    reason: "",
  });
  const [blocking, setBlocking] = useState(false);
  const supabase = createClient();

  if (authLoading || loading) return (
    <div className="flex items-center justify-center h-64"><Spinner size={32} /></div>
  );

  if (!business) return null;

  async function handleBlock(e: React.FormEvent) {
    e.preventDefault();
    if (!blockForm.professional_id || !blockForm.date || !blockForm.start_time || !blockForm.end_time) return;
    setBlocking(true);
    await supabase.from("blocked_periods").insert({
      professional_id: blockForm.professional_id,
      date: blockForm.date,
      start_time: blockForm.start_time,
      end_time: blockForm.end_time,
      reason: blockForm.reason || null,
    });
    setBlocking(false);
    setBlockForm({ professional_id: "", date: "", start_time: "", end_time: "", reason: "" });
  }

  return (
    <div className="max-w-2xl flex flex-col gap-8">
      <h1 className="text-2xl font-bold text-[#fafafa]">Configurações</h1>

      {/* Dados do negócio */}
      <section className="bg-[#18181b] border border-[#27272a] rounded-[12px] p-5">
        <h2 className="text-[#fafafa] font-semibold mb-4">Dados do negócio</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
          {[
            ["Nome", business.name],
            ["Slug", business.slug],
            ["Cidade", business.city ?? "—"],
            ["Telefone", business.phone ?? "—"],
          ].map(([k, v]) => (
            <div key={k}>
              <p className="text-[#a1a1aa] text-xs mb-0.5">{k}</p>
              <p className="text-[#fafafa]">{v}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Serviços */}
      <section className="bg-[#18181b] border border-[#27272a] rounded-[12px] p-5">
        <h2 className="text-[#fafafa] font-semibold mb-4">Serviços</h2>
        <div className="flex flex-col gap-2">
          {services.map((s) => (
            <div key={s.id} className="flex items-center justify-between text-sm">
              <span className="text-[#fafafa]">{s.name}</span>
              <span className="text-[#a1a1aa]">
                {s.price.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })} · {s.duration_minutes} min
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Profissionais */}
      <section className="bg-[#18181b] border border-[#27272a] rounded-[12px] p-5">
        <h2 className="text-[#fafafa] font-semibold mb-4">Profissionais</h2>
        <div className="flex flex-col gap-2">
          {professionals.map((p) => (
            <div key={p.id} className="text-sm text-[#fafafa]">
              {p.name}{p.specialty ? ` — ${p.specialty}` : ""}
            </div>
          ))}
        </div>
      </section>

      {/* Bloquear horário */}
      <section className="bg-[#18181b] border border-[#27272a] rounded-[12px] p-5">
        <h2 className="text-[#fafafa] font-semibold mb-4">Bloquear horário</h2>
        <form onSubmit={handleBlock} className="flex flex-col gap-3">
          <Select
            label="Profissional"
            value={blockForm.professional_id}
            options={[
              { value: "", label: "Selecione..." },
              ...professionals.map((p) => ({ value: p.id, label: p.name })),
            ]}
            onChange={(e) => setBlockForm((f) => ({ ...f, professional_id: e.target.value }))}
            className="dark:bg-[#09090b] dark:border-[#27272a] dark:text-[#fafafa]"
          />
          <Input
            label="Data"
            type="date"
            value={blockForm.date}
            onChange={(e) => setBlockForm((f) => ({ ...f, date: e.target.value }))}
          />
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Início"
              type="time"
              value={blockForm.start_time}
              onChange={(e) => setBlockForm((f) => ({ ...f, start_time: e.target.value }))}
            />
            <Input
              label="Fim"
              type="time"
              value={blockForm.end_time}
              onChange={(e) => setBlockForm((f) => ({ ...f, end_time: e.target.value }))}
            />
          </div>
          <Input
            label="Motivo (opcional)"
            value={blockForm.reason}
            onChange={(e) => setBlockForm((f) => ({ ...f, reason: e.target.value }))}
          />
          <Button type="submit" loading={blocking} className="w-full">
            Bloquear horário
          </Button>
        </form>
      </section>
    </div>
  );
}
