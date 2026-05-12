import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { FadeIn } from "@/components/ui/FadeIn";

export function CtaSection() {
  return (
    <section className="relative bg-[#09090B] py-28 overflow-hidden">
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 70% 55% at 50% 50%, rgba(37,99,235,0.22) 0%, transparent 70%)",
        }}
      />
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.022) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.022) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
        }}
      />

      <div className="relative max-w-2xl mx-auto px-6 text-center">
        <FadeIn>
          <h2 className="text-3xl lg:text-4xl font-bold text-[#FAFAFA] tracking-tight leading-[1.12] mb-4">
            Pronto para profissionalizar
            <br className="hidden sm:block" /> seus agendamentos?
          </h2>
        </FadeIn>
        <FadeIn delay={80}>
          <p className="text-[#71717A] text-base mb-8">
            Grátis para começar. Sem cartão de crédito.
          </p>
        </FadeIn>
        <FadeIn delay={160}>
          <Button href="/auth/login" size="lg">
            Criar minha página agora <ArrowRight size={18} />
          </Button>
        </FadeIn>
      </div>
    </section>
  );
}
