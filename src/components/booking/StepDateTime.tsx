"use client";

import { Calendar } from "@/components/ui/Calendar";
import { Spinner } from "@/components/ui/Spinner";
import { useAvailability } from "@/hooks/useAvailability";

interface Props {
  professionalId: string;
  serviceDuration: number;
  selectedDate: string | null;
  selectedTime: string | null;
  onSelectDate: (date: string) => void;
  onSelectTime: (time: string) => void;
}

export function StepDateTime({
  professionalId,
  serviceDuration,
  selectedDate,
  selectedTime,
  onSelectDate,
  onSelectTime,
}: Props) {
  const { slots, loading } = useAvailability(professionalId, selectedDate, serviceDuration);

  return (
    <div className="flex flex-col gap-6">
      <Calendar
        selected={selectedDate}
        onSelect={onSelectDate}
      />

      {selectedDate && (
        <div>
          <p className="text-sm font-medium text-[#09090b] mb-3">Horários disponíveis</p>
          {loading ? (
            <div className="flex justify-center py-4"><Spinner size={20} /></div>
          ) : slots.length === 0 ? (
            <p className="text-sm text-[#6b7280] text-center py-4">
              Sem horários disponíveis neste dia.
            </p>
          ) : (
            <div className="grid grid-cols-3 md:grid-cols-4 gap-2">
              {slots.map((slot) => (
                <button
                  key={slot}
                  onClick={() => onSelectTime(slot)}
                  className={`py-2 rounded-[10px] text-sm font-medium transition-all duration-150
                    ${selectedTime === slot
                      ? "bg-[#C2410C] text-white shadow-[0_0_0_1px_#C2410C]"
                      : "border border-[#e2e8f0] text-[#09090b] hover:border-[#C2410C] hover:text-[#C2410C]"
                    }`}
                >
                  {slot}
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
