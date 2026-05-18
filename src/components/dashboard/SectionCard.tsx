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
        <div className="relative w-9 h-9 rounded-[10px] bg-[#1E1E1E] flex items-center justify-center shrink-0">
          <Icon size={18} className="text-[#C2410C]" />
          {complete !== null && complete !== undefined && (
            <span style={{
              position: "absolute", top: -2, right: -2,
              width: 7, height: 7, borderRadius: "50%",
              background: complete ? "#22C55E" : "#4B5563",
              border: "1.5px solid #0C0C0C",
            }} />
          )}
        </div>
        <span className="flex-1 text-[#fafafa] font-semibold text-sm">{title}</span>
      </div>
      <div className="px-6 py-6">{children}</div>
    </div>
  );
}
