import { Clock } from "lucide-react";
import type { Service } from "@/types";

export function ServiceList({ services }: { services: Service[] }) {
  return (
    <div>
      <h2 className="text-lg font-semibold text-[#09090b] mb-3">Serviços</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {services.map((s) => (
          <div
            key={s.id}
            className="border border-[#e2e8f0] rounded-[12px] p-4 flex items-center justify-between hover:shadow-[0_0_0_1px_#2563EB,0_0_16px_rgba(37,99,235,0.1)] transition-shadow duration-200"
          >
            <div>
              <p className="text-[#09090b] font-medium text-sm">{s.name}</p>
              <p className="flex items-center gap-1 text-xs text-[#6b7280] mt-0.5">
                <Clock size={11} /> {s.duration_minutes} min
              </p>
            </div>
            <span className="text-[#09090b] font-semibold text-sm">
              {s.price.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
