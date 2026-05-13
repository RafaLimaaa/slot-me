import Image from "next/image";
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
            className={`text-left border rounded-[12px] p-4 flex items-center gap-3 transition-all duration-150
              ${active
                ? "border-[#C2410C] shadow-[0_0_0_1px_#C2410C]"
                : "border-[#e2e8f0] hover:border-[#fdba74]"
              }`}
          >
            <div className="w-12 h-12 rounded-full bg-[#f1f5f9] overflow-hidden flex items-center justify-center shrink-0">
              {p.photo_url ? (
                <Image src={p.photo_url} alt={p.name} width={48} height={48} className="object-cover w-full h-full" />
              ) : (
                <span className="text-[#6b7280] font-semibold text-lg">
                  {p.name.charAt(0).toUpperCase()}
                </span>
              )}
            </div>
            <div>
              <p className="font-medium text-[#09090b] text-sm">{p.name}</p>
              {p.specialty && <p className="text-[#6b7280] text-xs">{p.specialty}</p>}
            </div>
          </button>
        );
      })}
    </div>
  );
}
