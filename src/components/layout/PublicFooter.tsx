import Link from "next/link";
import { Logo } from "@/components/ui/Logo";

export function PublicFooter() {
  return (
    <footer className="border-t border-[#f1f5f9] py-8 mt-12">
      <div className="max-w-3xl mx-auto px-4 flex flex-col items-center gap-2">
        <Link href="/" aria-label="SlotMe">
          <Logo size="sm" />
        </Link>
        <p className="text-xs text-[#94a3b8]">Agendamento online profissional</p>
      </div>
    </footer>
  );
}
