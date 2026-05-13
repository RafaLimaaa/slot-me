"use client";

import { Copy, Check, ChevronRight } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Business } from "@/types";

interface Props {
  business: Business;
  serviceCount: number;
  professionalCount: number;
}

const CHECKLIST = [
  { label: "Adicionar foto de capa", key: "cover" },
  { label: "Cadastrar primeiro serviço", key: "service" },
  { label: "Adicionar primeiro profissional", key: "professional" },
  { label: "Compartilhar link público", key: "share" },
] as const;

type ChecklistKey = (typeof CHECKLIST)[number]["key"];

export function EmptyState({ business, serviceCount, professionalCount }: Props) {
  const [copied, setCopied] = useState(false);
  const [shared, setShared] = useState(() => {
    if (typeof window === "undefined") return false;
    return localStorage.getItem(`slotme_shared_${business.id}`) === "1";
  });
  const router = useRouter();
  const publicUrl = `${process.env.NEXT_PUBLIC_APP_URL ?? "https://slotme.vercel.app"}/${business.slug}`;

  const completed: Record<ChecklistKey, boolean> = {
    cover: !!business.cover_url,
    service: serviceCount > 0,
    professional: professionalCount > 0,
    share: shared,
  };

  const doneCount = Object.values(completed).filter(Boolean).length;

  if (doneCount === CHECKLIST.length) return null;

  async function copy() {
    await navigator.clipboard.writeText(publicUrl);
    setCopied(true);
    if (!shared) {
      setShared(true);
      localStorage.setItem(`slotme_shared_${business.id}`, "1");
    }
    setTimeout(() => setCopied(false), 2000);
  }

  function handleItemClick(key: ChecklistKey) {
    if (key === "share") {
      copy();
    } else {
      router.push("/dashboard/configuracoes");
    }
  }

  return (
    <div className="relative bg-[#18181b] border border-[#27272a] rounded-[20px] p-6 flex flex-col gap-5">
      {copied && (
        <div className="absolute top-4 right-4 bg-[#16a34a] text-white text-xs px-3 py-1.5 rounded-[8px] flex items-center gap-1.5">
          <Check size={12} />
          Link copiado!
        </div>
      )}

      <div>
        <h3 className="text-[#fafafa] font-semibold mb-1">Primeiros passos</h3>
        <div className="w-full h-1.5 bg-[#27272a] rounded-full overflow-hidden">
          <div
            className="h-full bg-[#C2410C] rounded-full transition-all duration-300"
            style={{ width: `${(doneCount / CHECKLIST.length) * 100}%` }}
          />
        </div>
        <p className="text-xs text-[#a1a1aa] mt-1.5">{doneCount} de {CHECKLIST.length} concluídos</p>
      </div>

      <ul className="flex flex-col gap-2">
        {CHECKLIST.map(({ label, key }) => (
          <li key={key}>
            <button
              onClick={() => handleItemClick(key)}
              className="w-full flex items-center gap-3 text-sm group hover:opacity-80 transition-opacity text-left"
            >
              <span className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${
                completed[key] ? "bg-[#16a34a]" : "border border-[#27272a]"
              }`}>
                {completed[key] && <Check size={12} className="text-white" />}
              </span>
              <span className={`flex-1 ${completed[key] ? "text-[#a1a1aa] line-through" : "text-[#fafafa]"}`}>
                {label}
              </span>
              {!completed[key] && (
                <ChevronRight size={14} className="text-[#a1a1aa] group-hover:text-[#C2410C] transition-colors shrink-0" />
              )}
            </button>
          </li>
        ))}
      </ul>

      <div className="flex items-center gap-2 bg-[#09090b] rounded-[12px] px-3 py-2.5">
        <span className="text-[#a1a1aa] text-xs truncate flex-1">{publicUrl}</span>
        <button
          onClick={copy}
          className="text-[#a1a1aa] hover:text-[#C2410C] transition-colors shrink-0"
        >
          {copied ? <Check size={15} className="text-[#16a34a]" /> : <Copy size={15} />}
        </button>
      </div>
    </div>
  );
}
