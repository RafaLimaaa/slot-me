import { Clock } from "lucide-react";
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
            className={`text-left border rounded-[12px] p-4 transition-all duration-150
              ${active
                ? "border-[#C2410C] shadow-[0_0_0_1px_#C2410C]"
                : "border-[#e2e8f0] hover:border-[#fdba74]"
              }`}
          >
            <p className="font-medium text-[#09090b] text-sm">{s.name}</p>
            <div className="flex items-center justify-between mt-2">
              <span className="flex items-center gap-1 text-xs text-[#6b7280]">
                <Clock size={11} /> {s.duration_minutes} min
              </span>
              <span className="font-semibold text-sm text-[#09090b]">
                {s.price.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
              </span>
            </div>
          </button>
        );
      })}
    </div>
  );
}
