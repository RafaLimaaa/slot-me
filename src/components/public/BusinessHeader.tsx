import Image from "next/image";
import { MapPin, Phone } from "lucide-react";
import type { Business } from "@/types";

function formatPhone(phone: string): string {
  const d = phone.replace(/\D/g, "");
  if (d.length <= 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`;
  return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
}

export function BusinessHeader({ business }: { business: Business }) {
  return (
    <div>
      {business.cover_url && (
        <div className="relative w-full h-48 rounded-[20px] overflow-hidden mb-4">
          <Image
            src={business.cover_url}
            alt={business.name}
            fill
            className="object-cover"
          />
        </div>
      )}
      <div className="flex items-start gap-4">
        {business.logo_url && (
          <div className="relative w-16 h-16 rounded-[12px] overflow-hidden border border-[#e2e8f0] shrink-0">
            <Image src={business.logo_url} alt="Logo" fill className="object-cover" />
          </div>
        )}
        <div>
          <h1 className="text-2xl font-bold text-[#09090b] tracking-tight">
            {business.name}
          </h1>
          {business.description && (
            <p className="text-[#6b7280] text-sm mt-1">{business.description}</p>
          )}
          <div className="flex items-center gap-4 mt-2">
            {(business.street || business.city) && (
              <span className="flex items-center gap-1 text-xs text-[#6b7280]">
                <MapPin size={12} />
                {[
                  business.street && `${business.street}${business.street_number ? `, ${business.street_number}` : ""}`,
                  business.neighborhood,
                  business.city,
                ].filter(Boolean).join(" — ")}
              </span>
            )}
            {business.phone && (
              <a
                href={`tel:${business.phone.replace(/\D/g, "")}`}
                className="flex items-center gap-1 text-xs text-[#6b7280] hover:text-[#2563EB] transition-colors"
              >
                <Phone size={12} /> {formatPhone(business.phone)}
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
