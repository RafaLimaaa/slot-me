import Image from "next/image";
import type { Professional } from "@/types";

export function ProfessionalList({ professionals }: { professionals: Professional[] }) {
  return (
    <div>
      <h2 className="text-lg font-semibold text-[#1A1A1A] mb-3">Profissionais</h2>

      {/* Mobile: horizontal scroll */}
      <div className="flex gap-3 overflow-x-auto pb-2 md:hidden">
        {professionals.map((p) => (
          <div
            key={p.id}
            className="shrink-0 flex flex-col items-center gap-2 w-28
              p-3 bg-white border border-[#E8E0D5] rounded-[12px] text-center
              hover:border-[#C2410C] hover:shadow-[0_2px_12px_rgba(194,65,12,0.08)]
              transition-all duration-200"
          >
            <div className="w-16 h-16 rounded-full bg-[#E8E0D5] border-2 border-[#E8E0D5] overflow-hidden flex items-center justify-center">
              {p.photo_url ? (
                <Image
                  src={p.photo_url}
                  alt={p.name}
                  width={64}
                  height={64}
                  className="object-cover w-full h-full"
                />
              ) : (
                <span className="text-[#6B7280] font-semibold text-xl">
                  {p.name.charAt(0).toUpperCase()}
                </span>
              )}
            </div>
            <div>
              <p className="text-[#1A1A1A] font-medium leading-tight" style={{ fontSize: 13 }}>
                {p.name}
              </p>
              {p.specialty && (
                <p className="text-[#6B7280] mt-0.5" style={{ fontSize: 12 }}>
                  {p.specialty}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Desktop: grid */}
      <div className="hidden md:grid grid-cols-3 lg:grid-cols-4 gap-3">
        {professionals.map((p) => (
          <div
            key={p.id}
            className="flex flex-col items-center gap-2
              p-4 bg-white border border-[#E8E0D5] rounded-[12px] text-center
              hover:border-[#C2410C] hover:shadow-[0_2px_12px_rgba(194,65,12,0.08)]
              transition-all duration-200"
          >
            <div className="w-16 h-16 rounded-full bg-[#E8E0D5] border-2 border-[#E8E0D5] overflow-hidden flex items-center justify-center">
              {p.photo_url ? (
                <Image
                  src={p.photo_url}
                  alt={p.name}
                  width={64}
                  height={64}
                  className="object-cover w-full h-full"
                />
              ) : (
                <span className="text-[#6B7280] font-semibold text-xl">
                  {p.name.charAt(0).toUpperCase()}
                </span>
              )}
            </div>
            <div>
              <p className="text-[#1A1A1A] font-medium" style={{ fontSize: 13 }}>
                {p.name}
              </p>
              {p.specialty && (
                <p className="text-[#6B7280]" style={{ fontSize: 12 }}>
                  {p.specialty}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
