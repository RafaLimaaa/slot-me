"use client";

import { useState } from "react";
import { Phone, CheckCircle, X, UserX } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { notifyClientOfCancellation } from "@/app/actions";
import type { AppointmentWithDetails, AppointmentStatus } from "@/types";

interface Props {
  appointment: AppointmentWithDetails;
  onUpdateStatus: (id: string, status: AppointmentStatus) => Promise<void>;
}

const STATUS_STYLE: Record<AppointmentStatus, { label: string; bg: string; border: string; color: string }> = {
  scheduled:  { label: "Agendado",        bg: "#9A3412", border: "#C2410C", color: "#ffedd5" },
  completed:  { label: "Concluído",       bg: "#1A3D2B", border: "#3D6B4F", color: "#86efac" },
  cancelled:  { label: "Cancelado",       bg: "#3D0F0F", border: "#7F1D1D", color: "#fca5a5" },
  no_show:    { label: "Não compareceu",  bg: "#3D2000", border: "#92400E", color: "#fdba74" },
};

const MODAL_CONFIG = {
  complete: { title: "Marcar como concluído?", variant: "primary" as const },
  cancel:   { title: "Cancelar agendamento?",  variant: "danger"   as const },
  no_show:  { title: "Não compareceu?",        variant: "primary"  as const },
};

export function AppointmentItem({ appointment: a, onUpdateStatus }: Props) {
  const [confirmModal, setConfirmModal] = useState<"complete" | "cancel" | "no_show" | null>(null);
  const [loading, setLoading] = useState(false);

  const apptDateTime = new Date(`${a.date}T${a.start_time.slice(0, 5)}:00`);
  const isPast = apptDateTime < new Date();

  async function confirm() {
    if (!confirmModal) return;
    setLoading(true);
    const nextStatus: AppointmentStatus =
      confirmModal === "complete" ? "completed" :
      confirmModal === "cancel"   ? "cancelled" : "no_show";
    await onUpdateStatus(a.id, nextStatus);
    if (nextStatus === "cancelled") {
      notifyClientOfCancellation(a.id).catch((e) =>
        console.error("[AppointmentItem] cancel email:", e)
      );
    }
    setLoading(false);
    setConfirmModal(null);
  }

  const s = STATUS_STYLE[a.status];
  const modal = confirmModal ? MODAL_CONFIG[confirmModal] : null;

  return (
    <>
      <div
        className={`flex items-center gap-4 bg-[#161616] hover:bg-[#1E1E1E] border border-[#2A2A2A] rounded-[12px] p-4 transition-all ${
          isPast && a.status === "scheduled" ? "opacity-50" : ""
        }`}
      >
        <div className="text-[#6B7280] text-sm font-mono w-12 shrink-0">
          {a.start_time.slice(0, 5)}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[#fafafa] font-medium text-sm truncate">{a.client_name}</p>
          <p className="text-[#6B7280] text-xs truncate">
            {a.service.name} · {a.professional.name}
          </p>
        </div>
        <a
          href={`tel:${a.client_phone}`}
          className="text-[#6B7280] hover:text-[#C2410C] transition-colors shrink-0"
        >
          <Phone size={15} />
        </a>
        <span
          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border shrink-0"
          style={{ background: s.bg, borderColor: s.border, color: s.color }}
        >
          {s.label}
        </span>
        {a.status === "scheduled" && (
          <div className="flex gap-2 shrink-0">
            <button
              onClick={() => setConfirmModal("complete")}
              className="text-[#6B7280] hover:text-[#3D6B4F] transition-colors"
            >
              <CheckCircle size={16} />
            </button>
            {isPast && (
              <button
                onClick={() => setConfirmModal("no_show")}
                className="text-[#6B7280] hover:text-[#92400E] transition-colors"
              >
                <UserX size={16} />
              </button>
            )}
            <button
              onClick={() => setConfirmModal("cancel")}
              className="text-[#6B7280] hover:text-[#7F1D1D] transition-colors"
            >
              <X size={16} />
            </button>
          </div>
        )}
      </div>

      {modal && (
        <Modal open onClose={() => setConfirmModal(null)} title={modal.title}>
          <p className="text-sm text-[#6b7280] mb-4">
            {confirmModal === "complete" && `Confirmar que o atendimento de ${a.client_name} foi concluído?`}
            {confirmModal === "cancel"   && `Cancelar o agendamento de ${a.client_name}? Esta ação não pode ser desfeita.`}
            {confirmModal === "no_show"  && `Marcar que ${a.client_name} não compareceu ao agendamento?`}
          </p>
          <div className="flex gap-3">
            <Button variant="secondary" onClick={() => setConfirmModal(null)} className="flex-1">Voltar</Button>
            <Button variant={modal.variant} loading={loading} onClick={confirm} className="flex-1">Confirmar</Button>
          </div>
        </Modal>
      )}
    </>
  );
}
