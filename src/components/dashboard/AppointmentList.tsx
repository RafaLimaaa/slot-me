import { AppointmentItem } from "./AppointmentItem";
import type { AppointmentWithDetails, AppointmentStatus } from "@/types";

interface Props {
  appointments: AppointmentWithDetails[];
  onUpdateStatus: (id: string, status: AppointmentStatus) => Promise<void>;
}

export function AppointmentList({ appointments, onUpdateStatus }: Props) {
  if (appointments.length === 0) {
    return (
      <p className="text-[#a1a1aa] text-sm text-center py-8">
        Nenhum agendamento para hoje.
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      {appointments.map((a) => (
        <AppointmentItem key={a.id} appointment={a} onUpdateStatus={onUpdateStatus} />
      ))}
    </div>
  );
}
