"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import { Button } from "@/components/ui/Button";

const NAV = [
  { href: "#funcionalidades", label: "Funcionalidades" },
  { href: "#como-funciona", label: "Como funciona" },
  { href: "#para-quem", label: "Para quem é" },
];

export function LandingHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", fn, { passive: true });
    fn();
    return () => window.removeEventListener("scroll", fn);
  }, []);

  return (
    <header
      className="fixed inset-x-0 top-0 z-50 transition-all duration-300"
      style={{
        background: scrolled ? "rgba(245,240,232,0.9)" : "transparent",
        backdropFilter: scrolled ? "blur(14px)" : "none",
        WebkitBackdropFilter: scrolled ? "blur(14px)" : "none",
        borderBottom: scrolled ? "1px solid #E7E0D5" : "1px solid transparent",
      }}
    >
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" aria-label="SlotMe">
          <Logo />
        </Link>

        <nav className="hidden md:flex items-center gap-7">
          {NAV.map(({ href, label }) => (
            <a
              key={href}
              href={href}
              className="text-sm font-medium text-[#4A4035] hover:text-[#1A1A1A] transition-colors"
            >
              {label}
            </a>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-3">
          <Link
            href="/auth/login"
            className="text-sm font-medium text-[#4A4035] hover:text-[#1A1A1A] px-4 py-2 rounded-[10px] hover:bg-[#EBE5D8] transition-all"
          >
            Entrar
          </Link>
          <Button href="/auth/login" size="sm">Começar grátis</Button>
        </div>

        <button
          onClick={() => setOpen((v) => !v)}
          className="md:hidden p-2 rounded-[10px] text-[#1A1A1A] hover:bg-[#EBE5D8] transition-colors"
          aria-label="Menu"
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {open && (
        <div className="md:hidden bg-[#F5F0E8] border-t border-[#E7E0D5] px-6 py-5 flex flex-col gap-1">
          {NAV.map(({ href, label }) => (
            <a
              key={href}
              href={href}
              onClick={() => setOpen(false)}
              className="text-sm font-medium text-[#4A4035] py-2.5 hover:text-[#1A1A1A] transition-colors"
            >
              {label}
            </a>
          ))}
          <div className="flex gap-3 mt-3 pt-3 border-t border-[#E7E0D5]">
            <Button href="/auth/login" variant="secondary" size="sm" className="flex-1">Entrar</Button>
            <Button href="/auth/login" size="sm" className="flex-1">Começar grátis</Button>
          </div>
        </div>
      )}
    </header>
  );
}
