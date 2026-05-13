"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import { Button } from "@/components/ui/Button";

const NAV = [
  { href: "#funcionalidades", label: "Funcionalidades" },
  { href: "#como-funciona", label: "Como funciona" },
  { href: "#para-quem", label: "Para quem é" },
];

export function LandingHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header
      className="fixed inset-x-0 top-0 z-50"
      style={{
        background: "#09090B",
        borderBottom: "1px solid #ffffff10",
      }}
    >
      {/* Subtle grid overlay */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: "linear-gradient(rgba(255,255,255,0.022) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.022) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
        }}
      />
      {/* Very subtle terracotta glow */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse 60% 120% at 50% 50%, rgba(194,65,12,0.07), transparent)",
        }}
      />

      <div className="relative max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" aria-label="SlotMe">
          <Logo inverted />
        </Link>

        <nav className="hidden md:flex items-center gap-7">
          {NAV.map(({ href, label }) => (
            <a
              key={href}
              href={href}
              className="text-sm font-medium text-[#A1A1AA] hover:text-white transition-colors"
            >
              {label}
            </a>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-3">
          <Link
            href="/auth/login"
            className="text-sm font-medium text-[#A1A1AA] hover:text-white px-4 py-2 rounded-[10px] hover:bg-white/5 transition-all"
          >
            Entrar
          </Link>
          <Button href="/auth/login" size="sm">Começar grátis</Button>
        </div>

        <button
          onClick={() => setOpen((v) => !v)}
          className="md:hidden p-2 rounded-[10px] text-[#A1A1AA] hover:text-white hover:bg-white/5 transition-colors"
          aria-label="Menu"
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {open && (
        <div
          className="relative md:hidden border-t px-6 py-5 flex flex-col gap-1"
          style={{
            background: "#09090B",
            borderColor: "#ffffff10",
          }}
        >
          {NAV.map(({ href, label }) => (
            <a
              key={href}
              href={href}
              onClick={() => setOpen(false)}
              className="text-sm font-medium text-[#A1A1AA] py-2.5 hover:text-white transition-colors"
            >
              {label}
            </a>
          ))}
          <div className="flex gap-3 mt-3 pt-3" style={{ borderTop: "1px solid #ffffff10" }}>
            <Button href="/auth/login" variant="secondary" size="sm" className="flex-1">Entrar</Button>
            <Button href="/auth/login" size="sm" className="flex-1">Começar grátis</Button>
          </div>
        </div>
      )}
    </header>
  );
}
