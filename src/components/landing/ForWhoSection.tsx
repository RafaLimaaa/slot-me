import { Scissors, Sparkles, Stethoscope } from "lucide-react";
import { FadeIn } from "@/components/ui/FadeIn";

const SEGMENTS = [
  {
    icon: Scissors,
    title: "Barbearias",
    desc: "Gerencie cortes, barbas e múltiplos profissionais em uma única agenda organizada.",
  },
  {
    icon: Sparkles,
    title: "Salões de beleza",
    desc: "Múltiplos serviços e especialistas, cada um com sua própria agenda.",
  },
  {
    icon: Stethoscope,
    title: "Clínicas e consultórios",
    desc: "Agendamentos automáticos sem precisar de recepcionista ou telefonemas.",
  },
];

export function ForWhoSection() {
  return (
    <section id="para-quem" className="bg-[#FDFAF5] py-24">
      <div className="max-w-6xl mx-auto px-6">
        <FadeIn className="text-center mb-16">
          <p className="text-[#C2410C] text-[11px] font-bold uppercase tracking-[0.16em] mb-3">
            Para quem é
          </p>
          <h2 className="text-3xl lg:text-4xl font-bold text-[#1A1A1A] tracking-tight">
            Para qualquer negócio de serviços
          </h2>
        </FadeIn>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {SEGMENTS.map(({ icon: Icon, title, desc }, i) => (
            <FadeIn key={title} delay={i * 100}>
              <div className="rounded-[20px] border border-[#D4CAB8] bg-[#EBE5D8] p-8 h-full hover:shadow-[0_4px_28px_rgba(194,65,12,0.1)] transition-all duration-200">
                <div className="w-12 h-12 rounded-[12px] bg-white/60 flex items-center justify-center mb-5">
                  <Icon size={24} className="text-[#C2410C]" />
                </div>
                <h3 className="font-bold text-[#1A1A1A] text-lg mb-2">{title}</h3>
                <p className="text-[#78716C] text-sm leading-relaxed">{desc}</p>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
