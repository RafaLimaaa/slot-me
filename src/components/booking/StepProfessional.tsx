import Image from "next/image";
import { Check } from "lucide-react";
import type { ProfessionalWithServices } from "@/types";

interface Props {
  professionals: ProfessionalWithServices[];
  selectedServiceId: string;
  selected: ProfessionalWithServices | null;
  onSelect: (p: ProfessionalWithServices) => void;
}

export function StepProfessional({ professionals, selectedServiceId, selected, onSelect }: Props) {
  const eligible = professionals.filter((p) =>
    p.services.some((s) => s.id === selectedServiceId)
  );

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {eligible.map((p) => {
        const active = selected?.id === p.id;
        return (
          <button
            key={p.id}
            onClick={() => onSelect(p)}
            className={`relative text-left bg-white rounded-[12px] p-4 flex items-center gap-3 transition-all duration-150 cursor-pointer
              ${active
                ? "border-2 border-[#C2410C] bg-[rgba(194,65,12,0.04)]"
                : "border border-[#E8E0D5] hover:border-[#C2410C] hover:shadow-[0_0_0_2px_rgba(194,65,12,0.08)]"
              }`}
          >
            {active && (
              <div className="absolute top-3 right-3">
                <Check size={16} className="text-[#C2410C]" />
              </div>
            )}
            <div className="w-12 h-12 rounded-full bg-[#E8E0D5] border-2 border-[#E8E0D5] overflow-hidden flex items-center justify-center shrink-0">
              {p.photo_url ? (
                <Image
                  src={p.photo_url}
                  alt={p.name}
                  width={48}
                  height={48}
                  className="object-cover w-full h-full"
                />
              ) : (
                <span className="text-[#6B7280] font-semibold text-lg">
                  {p.name.charAt(0).toUpperCase()}
                </span>
              )}
            </div>
            <div className="min-w-0 pr-6">
              <p className="font-medium text-[#1A1A1A] text-sm truncate">{p.name}</p>
              {p.specialty && (
                <p className="text-[#6B7280] text-xs">{p.specialty}</p>
              )}
            </div>
          </button>
        );
      })}
    </div>
  );
}
