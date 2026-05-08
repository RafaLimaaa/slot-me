"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { AlertCircle, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Spinner } from "@/components/ui/Spinner";
import { createClient } from "@/lib/supabase";
import type { AppointmentWithDetails } from "@/types";

export default function CancelPage() {
  const { token } = useParams<{ token: string }>();
  const [appt, setAppt] = useState<AppointmentWithDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");
  const supabase = createClient();

  useEffect(() => {
    async function load() {
      const { data } = await supabase
        .from("appointments")
        .select(
          "*, professional:professionals(id,name,photo_url,specialty), service:services(id,name,price,duration_minutes)"
        )
        .eq("cancel_token", token)
        .single();

      setAppt(data as AppointmentWithDetails | null);
      setLoading(false);
    }
    load();
  }, [token]);

  async function handleCancel() {
    if (!appt) return;
    setCancelling(true);
    const { error: err } = await supabase
      .from("appointments")
      .update({ status: "cancelled" })
      .eq("id", appt.id);

    if (err) { setError("Erro ao cancelar. Tente novamente."); }
    else { setDone(true); }
    setCancelling(false);
  }

  if (loading) return <div className="min-h-screen flex items-center justify-center"><Spinner size={32} /></div>;

  if (!appt) return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8fafc]">
      <div className="text-center">
        <AlertCircle size={40} className="text-[#DC2626] mx-auto mb-3" />
        <p className="text-[#09090b] font-semibold">Agendamento não encontrado</p>
        <p className="text-[#6b7280] text-sm mt-1">Este link é inválido ou já foi utilizado.</p>
      </div>
    </div>
  );

  if (appt.status === "cancelled") return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8fafc]">
      <div className="text-center">
        <p className="text-[#09090b] font-semibold">Este agendamento já foi cancelado.</p>
      </div>
    </div>
  );

  if (done) return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8fafc]">
      <div className="text-center">
        <CheckCircle size={40} className="text-[#16a34a] mx-auto mb-3" />
        <p className="text-[#09090b] font-semibold">Agendamento cancelado</p>
      </div>
    </div>
  );

  const date = new Date(appt.date + "T00:00:00").toLocaleDateString("pt-BR", {
    weekday: "long", day: "2-digit", month: "long",
  });

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8fafc] p-4">
      <div className="w-full max-w-sm bg-white rounded-[20px] shadow-[0_4px_24px_rgba(37,99,235,0.08)] p-8">
        <h1 className="text-lg font-bold text-[#09090b] mb-4">Cancelar agendamento</h1>
        <div className="bg-[#f8fafc] rounded-[12px] p-4 mb-6 text-sm flex flex-col gap-2">
          <div className="flex justify-between"><span className="text-[#6b7280]">Serviço</span><span className="font-medium">{appt.service.name}</span></div>
          <div className="flex justify-between"><span className="text-[#6b7280]">Profissional</span><span className="font-medium">{appt.professional.name}</span></div>
          <div className="flex justify-between"><span className="text-[#6b7280]">Data</span><span className="font-medium">{date}</span></div>
          <div className="flex justify-between"><span className="text-[#6b7280]">Horário</span><span className="font-medium">{appt.start_time.slice(0, 5)}</span></div>
        </div>
        <p className="text-[#6b7280] text-sm mb-4">Tem certeza que deseja cancelar?</p>
        {error && <p className="text-[#DC2626] text-xs mb-3">{error}</p>}
        <div className="flex gap-3">
          <Button variant="secondary" className="flex-1" onClick={() => history.back()}>Voltar</Button>
          <Button variant="danger" className="flex-1" loading={cancelling} onClick={handleCancel}>Cancelar</Button>
        </div>
      </div>
    </div>
  );
}
