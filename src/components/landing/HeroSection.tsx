import { ArrowRight, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { FadeIn } from "@/components/ui/FadeIn";
import { CalendarDemo } from "./CalendarDemo";

export function HeroSection() {
  return (
    <section className="min-h-screen bg-[#F5F0E8] flex items-center pt-16">
      <div className="max-w-6xl mx-auto px-6 py-20 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <FadeIn>
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-sm font-medium text-[#4A4035] bg-[#EBE5D8] border border-[#D4CAB8] mb-7">
                <span className="w-1.5 h-1.5 rounded-full bg-[#C2410C] shrink-0" />
                Agendamento online para negócios de serviços
              </div>
            </FadeIn>

            <FadeIn delay={80}>
              <h1 className="text-[2.7rem] lg:text-[3.4rem] font-bold text-[#1A1A1A] leading-[1.08] tracking-tight mb-5">
                Sua agenda profissional,{" "}
                <span className="text-[#C2410C]">pronta agora.</span>
              </h1>
            </FadeIn>

            <FadeIn delay={160}>
              <p className="text-[#78716C] text-lg leading-relaxed max-w-[420px] mb-8">
                Crie sua página de agendamentos em minutos. Seus clientes escolhem o
                serviço, o profissional e o horário.
              </p>
            </FadeIn>

            <FadeIn delay={240}>
              <div className="flex flex-wrap gap-3 items-center">
                <Button href="/auth/login" size="lg">
                  Começar grátis <ArrowRight size={18} />
                </Button>
                <a
                  href="#como-funciona"
                  className="inline-flex items-center gap-1.5 text-sm font-medium text-[#4A4035] hover:text-[#1A1A1A] transition-colors px-4 py-3"
                >
                  Ver como funciona <ChevronDown size={15} />
                </a>
              </div>
              <p className="text-[#A09080] text-xs mt-4">
                Grátis para começar. Sem cartão de crédito.
              </p>
            </FadeIn>
          </div>

          <FadeIn delay={100} className="flex justify-center lg:justify-end">
            <CalendarDemo />
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
