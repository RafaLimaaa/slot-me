"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { Logo } from "@/components/ui/Logo";
import { AnimatedCalendarCard } from "@/components/ui/AnimatedCalendarCard";

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true">
      <path fill="#4285F4" d="M47.5 24.5c0-1.6-.1-3.1-.4-4.6H24v8.7h13.2c-.6 3-2.3 5.5-4.9 7.2v6h7.9c4.6-4.3 7.3-10.6 7.3-17.3z"/>
      <path fill="#34A853" d="M24 48c6.5 0 11.9-2.1 15.9-5.8l-7.9-6c-2.1 1.4-4.8 2.3-8 2.3-6.1 0-11.3-4.1-13.2-9.7H2.7v6.2C6.7 42.7 14.8 48 24 48z"/>
      <path fill="#FBBC05" d="M10.8 28.8A14.9 14.9 0 0 1 10 24c0-1.7.3-3.3.8-4.8v-6.2H2.7A24 24 0 0 0 0 24c0 3.9.9 7.5 2.7 10.8l8.1-6z"/>
      <path fill="#EA4335" d="M24 9.5c3.5 0 6.6 1.2 9 3.5l6.7-6.7C35.9 2.4 30.5 0 24 0 14.8 0 6.7 5.3 2.7 13.2l8.1 6.2C12.7 13.6 17.9 9.5 24 9.5z"/>
    </svg>
  );
}

export default function LoginPage() {
  const { signInWithGoogle, loading } = useAuth();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const t = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(t);
  }, []);

  return (
    <div className="min-h-screen flex">
      {/* Left panel — dark, decorative */}
      <div
        className="hidden lg:flex lg:w-[60%] flex-col bg-[#09090B] relative overflow-hidden"
        style={{
          opacity: mounted ? 1 : 0,
          transform: mounted ? "translateY(0)" : "translateY(12px)",
          transition: "opacity 600ms ease-out, transform 600ms ease-out",
        }}
      >
        {/* Terracotta radial glow */}
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none"
          style={{
            background: "radial-gradient(ellipse 70% 55% at 50% 45%, rgba(194,65,12,0.18), transparent)",
          }}
        />

        {/* Subtle grid */}
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: "linear-gradient(rgba(255,255,255,0.022) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.022) 1px, transparent 1px)",
            backgroundSize: "64px 64px",
          }}
        />

        {/* Content */}
        <div className="relative flex flex-col h-full px-12 py-10">
          {/* Logo top-left */}
          <div>
            <Link href="/" aria-label="SlotMe">
              <Logo size="md" inverted />
            </Link>
          </div>

          {/* Center content */}
          <div className="flex-1 flex flex-col items-center justify-center gap-10">
            <div className="text-center max-w-[340px]">
              <h2 className="text-2xl font-bold text-white tracking-tight leading-snug mb-3">
                Sua agenda profissional,
                <br />
                <span className="text-[#C2410C]">pronta agora.</span>
              </h2>
              <p className="text-[#71717A] text-sm leading-relaxed">
                Crie sua página de agendamentos em minutos e deixe seus clientes agendarem sozinhos.
              </p>
            </div>

            <div
              style={{ boxShadow: "0 0 40px rgba(194,65,12,0.2)" }}
              className="rounded-[24px]"
            >
              <AnimatedCalendarCard />
            </div>
          </div>

          {/* Footer */}
          <p className="text-[#3F3F46] text-xs text-center">
            © 2026 SlotMe. Todos os direitos reservados.
          </p>
        </div>
      </div>

      {/* Right panel — beige, auth */}
      <div
        className="flex-1 lg:w-[40%] min-h-screen flex items-center justify-center bg-[#F5F0E8] px-6 py-10"
        style={{
          opacity: mounted ? 1 : 0,
          transform: mounted ? "translateY(0)" : "translateY(12px)",
          transition: "opacity 600ms ease-out 200ms, transform 600ms ease-out 200ms",
        }}
      >
        <div className="w-full max-w-[360px] flex flex-col gap-6">
          {/* Mobile-only logo */}
          <div className="flex justify-center lg:hidden">
            <Link href="/" aria-label="SlotMe">
              <Logo size="lg" />
            </Link>
          </div>

          {/* Header */}
          <div className="flex flex-col gap-1.5">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium text-[#4A4035] bg-[#EBE5D8] border border-[#D4CAB8] w-fit mb-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#C2410C] shrink-0" />
              Acesso seguro via Google
            </div>
            <h1 className="text-2xl font-bold text-[#1A1A1A] tracking-tight">
              Bem-vindo de volta
            </h1>
            <p className="text-[#78716C] text-sm leading-relaxed">
              Faça login para acessar o painel do seu negócio.
            </p>
          </div>

          {/* Google button */}
          <button
            onClick={signInWithGoogle}
            disabled={loading}
            className="w-full h-12 rounded-[12px] flex items-center justify-center gap-3 text-sm font-semibold text-white transition-all duration-200 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
            style={{
              background: loading
                ? "#9a3412"
                : "linear-gradient(135deg, #9a3412, #C2410C, #ea580c)",
              boxShadow: "0 4px 16px rgba(194,65,12,0.3)",
            }}
            onMouseEnter={(e) => {
              if (!loading) (e.currentTarget as HTMLButtonElement).style.background = "#9a3412";
            }}
            onMouseLeave={(e) => {
              if (!loading) (e.currentTarget as HTMLButtonElement).style.background = "linear-gradient(135deg, #9a3412, #C2410C, #ea580c)";
            }}
          >
            {loading ? (
              <span className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
            ) : (
              <GoogleIcon />
            )}
            {loading ? "Entrando..." : "Continuar com Google"}
          </button>

          {/* Create account link */}
          <p className="text-center text-sm text-[#78716C]">
            Não tem conta ainda?{" "}
            <Link
              href="/"
              className="font-medium text-[#C2410C] hover:text-[#9a3412] transition-colors"
            >
              Criar minha página
            </Link>
          </p>

          {/* Privacy footer */}
          <p className="text-center text-[#A09080] text-xs leading-relaxed">
            Ao continuar, você concorda com nossos{" "}
            <span className="underline cursor-pointer hover:text-[#78716C] transition-colors">
              Termos de uso
            </span>{" "}
            e{" "}
            <span className="underline cursor-pointer hover:text-[#78716C] transition-colors">
              Política de privacidade
            </span>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
