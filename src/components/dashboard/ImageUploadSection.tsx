"use client";

import { useRef, useState } from "react";
import { ImagePlus } from "lucide-react";
import { createClient } from "@/lib/supabase";
import type { Business } from "@/types";

interface Props {
  business: Business;
  onRefetch: () => Promise<void>;
}

type UploadType = "cover" | "logo";

export function ImageUploadSection({ business, onRefetch }: Props) {
  const [uploading, setUploading] = useState<UploadType | null>(null);
  const coverRef = useRef<HTMLInputElement>(null);
  const logoRef = useRef<HTMLInputElement>(null);
  const supabase = createClient();

  async function upload(type: UploadType, file: File) {
    setUploading(type);
    const path = `${business.id}/${type}`;
    const { error } = await supabase.storage.from("business-images").upload(path, file, { upsert: true });
    if (!error) {
      const { data } = supabase.storage.from("business-images").getPublicUrl(path);
      const url = `${data.publicUrl}?t=${Date.now()}`;
      const updatePayload = type === "cover" ? { cover_url: url } : { logo_url: url };
      await supabase.from("businesses").update(updatePayload).eq("id", business.id);
      await onRefetch();
    }
    setUploading(null);
  }

  const uploads: { type: UploadType; label: string; currentUrl: string | null; ref: React.RefObject<HTMLInputElement> }[] = [
    { type: "cover", label: "Foto de capa", currentUrl: business.cover_url, ref: coverRef },
    { type: "logo", label: "Logo", currentUrl: business.logo_url, ref: logoRef },
  ];

  return (
    <section className="bg-[#18181b] border border-[#27272a] rounded-[12px] p-5">
      <h2 className="text-[#fafafa] font-semibold mb-4">Fotos</h2>
      <div className="grid grid-cols-2 gap-4">
        {uploads.map(({ type, label, currentUrl, ref }) => (
          <div key={type} className="flex flex-col gap-2">
            <p className="text-xs text-[#a1a1aa]">{label}</p>
            <div
              onClick={() => ref.current?.click()}
              className="relative flex items-center justify-center border border-dashed border-[#27272a] rounded-[10px] h-28 cursor-pointer hover:border-[#2563EB] transition-colors overflow-hidden group"
            >
              {currentUrl ? (
                <img src={currentUrl} alt={label} className="w-full h-full object-cover" />
              ) : (
                <ImagePlus size={24} className="text-[#a1a1aa] group-hover:text-[#2563EB] transition-colors" />
              )}
              {uploading === type && (
                <div className="absolute inset-0 bg-[#09090b]/80 flex items-center justify-center">
                  <span className="text-xs text-[#fafafa]">Enviando...</span>
                </div>
              )}
              {currentUrl && (
                <div className="absolute inset-0 bg-[#09090b]/0 group-hover:bg-[#09090b]/50 transition-all flex items-center justify-center">
                  <span className="text-xs text-white opacity-0 group-hover:opacity-100 transition-opacity">Trocar foto</span>
                </div>
              )}
            </div>
            <input ref={ref} type="file" accept="image/*" className="sr-only"
              onChange={(e) => { const f = e.target.files?.[0]; if (f) upload(type, f); e.target.value = ""; }} />
          </div>
        ))}
      </div>
    </section>
  );
}
