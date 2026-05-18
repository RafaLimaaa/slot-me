import { Clock, Check } from "lucide-react";
import type { Service } from "@/types";

interface Props {
  services: Service[];
  selected: Service | null;
  onSelect: (s: Service) => void;
}

export function StepService({ services, selected, onSelect }: Props) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {services.map((s) => {
        const active = selected?.id === s.id;
        return (
          <button
            key={s.id}
            onClick={() => onSelect(s)}
            className={`relative text-left bg-white rounded-[12px] p-4 transition-all duration-150 cursor-pointer
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
            <p className="font-medium text-[#1A1A1A] pr-6" style={{ fontSize: 15 }}>
              {s.name}
            </p>
            <div className="flex items-center justify-between mt-2">
              <span className="flex items-center gap-1 text-[#6B7280]" style={{ fontSize: 12 }}>
                <Clock size={12} /> {s.duration_minutes} min
              </span>
              <span className="font-semibold text-[#C2410C]" style={{ fontSize: 16 }}>
                {s.price.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
              </span>
            </div>
          </button>
        );
      })}
    </div>
  );
}
