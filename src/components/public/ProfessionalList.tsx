import Image from "next/image";
import type { Professional } from "@/types";

function formatPhone(phone: string): string {
  const d = phone.replace(/\D/g, "");
  if (d.length <= 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`;
  return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
}

export function ProfessionalList({ professionals }: { professionals: Professional[] }) {
  return (
    <div>
      <h2 className="text-lg font-semibold text-[#09090b] mb-3">Profissionais</h2>
      <div className="flex gap-4 overflow-x-auto pb-2">
        {professionals.map((p) => (
          <div key={p.id} className="flex flex-col items-center gap-2 shrink-0">
            <div className="w-16 h-16 rounded-full bg-[#f1f5f9] border border-[#e2e8f0] overflow-hidden flex items-center justify-center">
              {p.photo_url ? (
                <Image src={p.photo_url} alt={p.name} width={64} height={64} className="object-cover w-full h-full" />
              ) : (
                <span className="text-[#6b7280] font-semibold text-xl">
                  {p.name.charAt(0).toUpperCase()}
                </span>
              )}
            </div>
            <div className="text-center">
              <p className="text-[#09090b] font-medium text-sm">{p.name}</p>
              {p.specialty && (
                <p className="text-[#6b7280] text-xs">{p.specialty}</p>
              )}
              {p.phone && (
                <a
                  href={`tel:${p.phone.replace(/\D/g, "")}`}
                  className="text-[#C2410C] text-xs hover:underline"
                >
                  {formatPhone(p.phone)}
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
