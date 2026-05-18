import Link from "next/link";
import { Clock } from "lucide-react";
import type { Service } from "@/types";

interface Props {
  services: Service[];
  slug: string;
}

export function ServiceList({ services, slug }: Props) {
  return (
    <div>
      <h2 className="text-lg font-semibold text-[#1A1A1A] mb-3">Serviços</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {services.map((s) => (
          <Link
            key={s.id}
            href={`/${slug}/agendar?service_id=${s.id}`}
            className="block bg-[#FAF7F2] border border-[#E8E0D5] rounded-[12px] p-4
              cursor-pointer transition-all duration-200
              hover:border-[#C2410C] hover:shadow-[0_0_0_2px_rgba(194,65,12,0.08)]"
          >
            <p className="text-[#1A1A1A] font-medium" style={{ fontSize: 15 }}>
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
          </Link>
        ))}
      </div>
    </div>
  );
}
