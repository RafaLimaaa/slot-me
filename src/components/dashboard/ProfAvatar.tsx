"use client";

import { useState } from "react";
import { Camera } from "lucide-react";
import { createClient } from "@/lib/supabase";

interface Props {
  profId: string;
  name: string;
  photoUrl: string | null;
  onRefetch: () => Promise<void>;
}

export function ProfAvatar({ profId, name, photoUrl, onRefetch }: Props) {
  const [uploading, setUploading] = useState(false);
  const supabase = createClient();

  async function upload(file: File) {
    setUploading(true);
    const path = `professionals/${profId}/photo`;
    const { error } = await supabase.storage
      .from("business-images")
      .upload(path, file, { upsert: true });
    if (!error) {
      const { data } = supabase.storage.from("business-images").getPublicUrl(path);
      await supabase
        .from("professionals")
        .update({ photo_url: `${data.publicUrl}?t=${Date.now()}` })
        .eq("id", profId);
      await onRefetch();
    }
    setUploading(false);
  }

  return (
    <label className="relative shrink-0 cursor-pointer group">
      <div className="w-10 h-10 rounded-full bg-[#27272a] overflow-hidden flex items-center justify-center">
        {photoUrl ? (
          <img src={photoUrl} alt={name} className="w-full h-full object-cover" />
        ) : (
          <span className="text-[#a1a1aa] font-semibold text-sm">
            {name.charAt(0).toUpperCase()}
          </span>
        )}
      </div>
      <div className={`absolute inset-0 rounded-full flex items-center justify-center transition-all
        ${uploading ? "bg-[#09090b]/80" : "bg-[#09090b]/0 group-hover:bg-[#09090b]/60"}`}>
        {uploading ? (
          <span className="text-[10px] text-white">...</span>
        ) : (
          <Camera size={12} className="text-white opacity-0 group-hover:opacity-100 transition-opacity" />
        )}
      </div>
      <input
        type="file"
        accept="image/*"
        className="sr-only"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) upload(f);
          e.target.value = "";
        }}
      />
    </label>
  );
}
