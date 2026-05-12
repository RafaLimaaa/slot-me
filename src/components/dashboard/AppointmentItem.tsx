"use client";

import { useState } from "react";
import { Phone, CheckCircle, X, UserX } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { notifyClientOfCancellation } from "@/app/actions";
import type { AppointmentWithDetails, AppointmentStatus } from "@/types";

interface Props {
  appointment: AppointmentWithDetails;
  onUpdateStatus: (id: string, status: AppointmentStatus) => Promise<void>;
}

const STATUS_BADGE: Record<AppointmentStatus, { label: string; variant: "success" | "default" | "danger" | "orange" }> = {
  scheduled: { label: "Agendado", variant: "default" },
  completed: { label: "Concluído", variant: "success" },
  cancelled: { label: "Cancelado", variant: "danger" },
  no_show: { label: "Não compareceu", variant: "orange" },
};

const MODAL_CONFIG = {
  complete: { title: "Marcar como concluído?", variant: "primary" as const },
  cancel: { title: "Cancelar agendamento?", variant: "danger" as const },
  no_show: { title: "Não compareceu?", variant: "primary" as const },
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
      confirmModal === "cancel" ? "cancelled" : "no_show";
    await onUpdateStatus(a.id, nextStatus);
    if (nextStatus === "cancelled") {
      notifyClientOfCancellation(a.id).catch((e) =>
        console.error("[AppointmentItem] cancel email:", e)
      );
    }
    setLoading(false);
    setConfirmModal(null);
  }

  const badge = STATUS_BADGE[a.status];
  const modal = confirmModal ? MODAL_CONFIG[confirmModal] : null;

  return (
    <>
      <div className={`flex items-center gap-4 bg-[#18181b] border border-[#27272a] rounded-[12px] p-4 transition-opacity ${isPast && a.status === "scheduled" ? "opacity-60" : ""}`}>
        <div className="text-[#a1a1aa] text-sm font-mono w-12 shrink-0">
          {a.start_time.slice(0, 5)}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[#fafafa] font-medium text-sm truncate">{a.client_name}</p>
          <p className="text-[#a1a1aa] text-xs truncate">
            {a.service.name} · {a.professional.name}
          </p>
        </div>
        <a href={`tel:${a.client_phone}`} className="text-[#a1a1aa] hover:text-[#2563EB] transition-colors shrink-0">
          <Phone size={15} />
        </a>
        <Badge variant={badge.variant}>{badge.label}</Badge>
        {a.status === "scheduled" && (
          <div className="flex gap-2 shrink-0">
            <button onClick={() => setConfirmModal("complete")} className="text-[#a1a1aa] hover:text-[#16a34a] transition-colors">
              <CheckCircle size={16} />
            </button>
            {isPast && (
              <button onClick={() => setConfirmModal("no_show")} className="text-[#a1a1aa] hover:text-[#ea580c] transition-colors">
                <UserX size={16} />
              </button>
            )}
            <button onClick={() => setConfirmModal("cancel")} className="text-[#a1a1aa] hover:text-[#DC2626] transition-colors">
              <X size={16} />
            </button>
          </div>
        )}
      </div>

      {modal && (
        <Modal open onClose={() => setConfirmModal(null)} title={modal.title}>
          <p className="text-sm text-[#6b7280] mb-4">
            {confirmModal === "complete" && `Confirmar que o atendimento de ${a.client_name} foi concluído?`}
            {confirmModal === "cancel" && `Cancelar o agendamento de ${a.client_name}? Esta ação não pode ser desfeita.`}
            {confirmModal === "no_show" && `Marcar que ${a.client_name} não compareceu ao agendamento?`}
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
