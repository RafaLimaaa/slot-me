"use client";

import { Copy, Check } from "lucide-react";
import { useState } from "react";
import type { Business } from "@/types";

interface Props {
  business: Business;
}

const CHECKLIST = [
  { label: "Adicionar foto de capa", key: "cover" },
  { label: "Cadastrar primeiro serviço", key: "service" },
  { label: "Adicionar primeiro profissional", key: "professional" },
  { label: "Compartilhar link público", key: "share" },
] as const;

export function EmptyState({ business }: Props) {
  const [copied, setCopied] = useState(false);
  const publicUrl = `${process.env.NEXT_PUBLIC_APP_URL}/${business.slug}`;

  const completed = {
    cover: !!business.cover_url,
    service: false,
    professional: false,
    share: false,
  };

  const doneCount = Object.values(completed).filter(Boolean).length;

  async function copy() {
    await navigator.clipboard.writeText(publicUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="bg-[#18181b] border border-[#27272a] rounded-[20px] p-6 flex flex-col gap-5">
      <div>
        <h3 className="text-[#fafafa] font-semibold mb-1">
          Primeiros passos
        </h3>
        <div className="w-full h-1.5 bg-[#27272a] rounded-full overflow-hidden">
          <div
            className="h-full bg-[#2563EB] rounded-full transition-all duration-300"
            style={{ width: `${(doneCount / CHECKLIST.length) * 100}%` }}
          />
        </div>
        <p className="text-xs text-[#a1a1aa] mt-1.5">{doneCount} de {CHECKLIST.length} concluídos</p>
      </div>

      <ul className="flex flex-col gap-2">
        {CHECKLIST.map(({ label, key }) => (
          <li key={key} className="flex items-center gap-3 text-sm">
            <span className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${
              completed[key] ? "bg-[#16a34a]" : "border border-[#27272a]"
            }`}>
              {completed[key] && <Check size={12} className="text-white" />}
            </span>
            <span className={completed[key] ? "text-[#a1a1aa] line-through" : "text-[#fafafa]"}>
              {label}
            </span>
          </li>
        ))}
      </ul>

      <div className="flex items-center gap-2 bg-[#09090b] rounded-[12px] px-3 py-2.5">
        <span className="text-[#a1a1aa] text-xs truncate flex-1">{publicUrl}</span>
        <button
          onClick={copy}
          className="text-[#a1a1aa] hover:text-[#2563EB] transition-colors shrink-0"
        >
          {copied ? <Check size={15} className="text-[#16a34a]" /> : <Copy size={15} />}
        </button>
      </div>
    </div>
  );
}
