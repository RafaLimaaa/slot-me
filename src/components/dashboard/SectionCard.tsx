import { type ReactNode, type ElementType } from "react";

interface Props {
  icon: ElementType;
  title: string;
  complete?: boolean | null;
  children: ReactNode;
}

export function SectionCard({ icon: Icon, title, complete, children }: Props) {
  return (
    <div className="bg-[#161616] border border-[#2A2A2A] rounded-[16px] overflow-hidden transition-shadow duration-200 hover:shadow-[0_0_0_1px_#3A3A3A,0_8px_32px_rgba(0,0,0,0.5)]">
      <div className="flex items-center gap-4 px-6 py-4 border-b border-[#2A2A2A]">
        <div className="w-9 h-9 rounded-[10px] bg-[#1E1E1E] flex items-center justify-center shrink-0">
          <Icon size={18} className="text-[#C2410C]" />
        </div>
        <span className="flex-1 text-[#fafafa] font-semibold text-sm">{title}</span>
        {complete === true && (
          <span
            className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border"
            style={{ background: "#1A3D2B", borderColor: "#3D6B4F", color: "#4ADE80" }}
          >
            Completo
          </span>
        )}
        {complete === false && (
          <span
            className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border"
            style={{ background: "#3D2000", borderColor: "#92400E", color: "#FDBA74" }}
          >
            Pendente
          </span>
        )}
      </div>
      <div className="px-6 py-6">{children}</div>
    </div>
  );
}
