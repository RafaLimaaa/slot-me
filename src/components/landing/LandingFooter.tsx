import Link from "next/link";
import { Logo } from "@/components/ui/Logo";

export function LandingFooter() {
  return (
    <footer className="bg-[#09090B] border-t border-[#18181B]">
      <div className="max-w-6xl mx-auto px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <Link href="/" aria-label="SlotMe">
          <Logo inverted />
        </Link>

        <nav className="flex items-center gap-6 text-sm text-[#52525B]">
          <a href="#funcionalidades" className="hover:text-[#A1A1AA] transition-colors">
            Funcionalidades
          </a>
          <a href="#como-funciona" className="hover:text-[#A1A1AA] transition-colors">
            Como funciona
          </a>
          <Link href="/auth/login" className="hover:text-[#A1A1AA] transition-colors">
            Entrar
          </Link>
        </nav>

        <p className="text-[#3F3F46] text-xs">
          © {new Date().getFullYear()} SlotMe
        </p>
      </div>
    </footer>
  );
}
