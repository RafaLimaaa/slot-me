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
  { label: "Adicionar foto de capa",          key: "cover"        },
  { label: "Cadastrar primeiro serviço",        key: "service"      },
  { label: "Adicionar primeiro profissional",   key: "professional" },
  { label: "Compartilhar link público",         key: "share"        },
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
    cover:        !!business.cover_url,
    service:      serviceCount > 0,
    professional: professionalCount > 0,
    share:        shared,
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
    if (key === "share") copy();
    else router.push("/dashboard/configuracoes");
  }

  return (
    <div className="relative bg-[#161616] border border-[#2A2A2A] rounded-[16px] p-6 flex flex-col gap-5 mt-4">
      {copied && (
        <div className="absolute top-4 right-4 bg-[#1A3D2B] border border-[#3D6B4F] text-[#4ADE80] text-xs px-3 py-1.5 rounded-[8px] flex items-center gap-1.5">
          <Check size={12} />
          Link copiado!
        </div>
      )}

      <div>
        <h3 className="text-[#fafafa] font-semibold mb-2">Primeiros passos</h3>
        <div className="w-full h-1.5 bg-[#2A2A2A] rounded-full overflow-hidden">
          <div
            className="h-full bg-[#C2410C] rounded-full transition-all duration-300"
            style={{ width: `${(doneCount / CHECKLIST.length) * 100}%` }}
          />
        </div>
        <p className="text-xs text-[#6B7280] mt-1.5">{doneCount} de {CHECKLIST.length} concluídos</p>
      </div>

      <ul className="flex flex-col gap-2">
        {CHECKLIST.map(({ label, key }) => (
          <li key={key}>
            <button
              onClick={() => handleItemClick(key)}
              className="w-full flex items-center gap-3 text-sm group hover:opacity-80 transition-opacity text-left"
            >
              <span className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${
                completed[key] ? "bg-[#1A3D2B] border border-[#3D6B4F]" : "border border-[#2A2A2A]"
              }`}>
                {completed[key] && <Check size={12} className="text-[#4ADE80]" />}
              </span>
              <span className={`flex-1 ${completed[key] ? "text-[#6B7280] line-through" : "text-[#fafafa]"}`}>
                {label}
              </span>
              {!completed[key] && (
                <ChevronRight size={14} className="text-[#6B7280] group-hover:text-[#C2410C] transition-colors shrink-0" />
              )}
            </button>
          </li>
        ))}
      </ul>

      <div className="flex items-center gap-2 bg-[#1E1E1E] border border-[#2A2A2A] rounded-[10px] px-3 py-2.5">
        <span className="text-[#6B7280] text-xs truncate flex-1">{publicUrl}</span>
        <button onClick={copy} className="text-[#6B7280] hover:text-[#C2410C] transition-colors shrink-0">
          {copied ? <Check size={15} className="text-[#4ADE80]" /> : <Copy size={15} />}
        </button>
      </div>
    </div>
  );
}
