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
      {/* Cover — full bleed */}
      <div className="relative w-full overflow-hidden" style={{ height: 280 }}>
        {business.cover_url ? (
          <Image
            src={business.cover_url}
            alt={business.name}
            fill
            className="object-cover"
            priority
          />
        ) : (
          <div className="w-full h-full bg-[#E8E0D5]" />
        )}
        <div
          className="absolute inset-0"
          style={{ background: "linear-gradient(to bottom, transparent 40%, #F5F0E8 100%)" }}
        />
      </div>

      {/* Info — centered, overlapping cover */}
      <div className="flex flex-col items-center px-4 -mt-10">
        {business.logo_url ? (
          <div
            className="relative overflow-hidden shrink-0"
            style={{
              width: 80,
              height: 80,
              borderRadius: 16,
              border: "3px solid #F5F0E8",
              boxShadow: "0 4px 24px rgba(0,0,0,0.12)",
            }}
          >
            <Image src={business.logo_url} alt="Logo" fill className="object-cover" />
          </div>
        ) : (
          <div
            className="flex items-center justify-center bg-[#E8E0D5] text-[#C2410C] font-bold text-2xl shrink-0"
            style={{
              width: 80,
              height: 80,
              borderRadius: 16,
              border: "3px solid #F5F0E8",
              boxShadow: "0 4px 24px rgba(0,0,0,0.12)",
            }}
          >
            {business.name.charAt(0).toUpperCase()}
          </div>
        )}

        <h1
          className="mt-3 font-semibold text-[#1A1A1A] text-center"
          style={{ fontSize: 24 }}
        >
          {business.name}
        </h1>

        {business.description && (
          <p
            className="text-[#6B7280] text-center mt-1"
            style={{ fontSize: 14, maxWidth: 480 }}
          >
            {business.description}
          </p>
        )}

        {(business.address || business.city || business.phone) && (
          <div className="flex items-center gap-4 mt-2 flex-wrap justify-center">
            {(business.address || business.city) && (
              <span className="flex items-center gap-1 text-[#6B7280]" style={{ fontSize: 13 }}>
                <MapPin size={14} className="text-[#C2410C] shrink-0" />
                {[
                  business.address &&
                    `${business.address}${business.street_number ? `, ${business.street_number}` : ""}`,
                  business.neighborhood,
                  business.city,
                ]
                  .filter(Boolean)
                  .join(" — ")}
              </span>
            )}
            {business.phone && (
              <a
                href={`tel:${business.phone.replace(/\D/g, "")}`}
                className="flex items-center gap-1 text-[#6B7280] hover:text-[#C2410C] transition-colors"
                style={{ fontSize: 13 }}
              >
                <Phone size={14} className="text-[#C2410C] shrink-0" />
                {formatPhone(business.phone)}
              </a>
            )}
          </div>
        )}
      </div>

      <div className="border-t border-[#E8E0D5] mx-4 mt-6" />
    </div>
  );
}
