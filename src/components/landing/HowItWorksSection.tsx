import { FadeIn } from "@/components/ui/FadeIn";

const STEPS = [
  {
    n: "01",
    title: "Cadastre seu negócio",
    desc: "Configure serviços, profissionais e horários de funcionamento em minutos.",
  },
  {
    n: "02",
    title: "Compartilhe seu link",
    desc: "Envie sua página personalizada para clientes ou divulgue nas redes sociais.",
  },
  {
    n: "03",
    title: "Receba agendamentos",
    desc: "Seus clientes agendam sozinhos, 24h por dia. Você só aparece para atender.",
  },
];

export function HowItWorksSection() {
  return (
    <section id="como-funciona" className="bg-[#FDFAF5] py-24">
      <div className="max-w-6xl mx-auto px-6">
        <FadeIn className="text-center mb-16">
          <p className="text-[#C2410C] text-[11px] font-bold uppercase tracking-[0.16em] mb-3">
            Como funciona
          </p>
          <h2 className="text-3xl lg:text-4xl font-bold text-[#1A1A1A] tracking-tight">
            Simples assim
          </h2>
        </FadeIn>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 relative">
          <div
            className="hidden md:block absolute h-px top-9 left-[20%] right-[20%]"
            style={{
              background:
                "linear-gradient(90deg, transparent, #D4CAB8 20%, #D4CAB8 80%, transparent)",
            }}
          />
          {STEPS.map(({ n, title, desc }, i) => (
            <FadeIn key={n} delay={i * 120} className="flex flex-col items-center text-center">
              <div className="w-[72px] h-[72px] rounded-full bg-[#F5F0E8] border-2 border-[#E7E0D5] flex items-center justify-center mb-6 relative z-10">
                <span className="text-xl font-bold text-[#C2410C]">{n}</span>
              </div>
              <h3 className="text-[1rem] font-bold text-[#1A1A1A] mb-2">{title}</h3>
              <p className="text-[#78716C] text-sm leading-relaxed">{desc}</p>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
