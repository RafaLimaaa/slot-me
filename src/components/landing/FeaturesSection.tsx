import { Calendar, Zap, Mail, RefreshCw, LayoutDashboard, Users } from "lucide-react";
import { FadeIn } from "@/components/ui/FadeIn";

const FEATURES = [
  {
    icon: Calendar,
    title: "Agenda inteligente",
    desc: "Horários, almoço e bloqueios gerenciados automaticamente. Zero conflito de horários.",
  },
  {
    icon: Zap,
    title: "Agendamento em segundos",
    desc: "Clientes agendam sem criar conta. Escolhem serviço, profissional, data e horário.",
  },
  {
    icon: Mail,
    title: "Confirmação por email",
    desc: "Confirmação imediata e lembrete 24h antes para reduzir faltas.",
  },
  {
    icon: RefreshCw,
    title: "Cancelamento fácil",
    desc: "Cliente cancela ou reagenda pelo link do email, sem precisar ligar.",
  },
  {
    icon: LayoutDashboard,
    title: "Painel do dono",
    desc: "Dashboard com métricas, agenda semanal e configurações completas.",
  },
  {
    icon: Users,
    title: "Múltiplos profissionais",
    desc: "Cada profissional com horários e serviços próprios.",
  },
];

export function FeaturesSection() {
  return (
    <section id="funcionalidades" className="bg-[#F5F0E8] py-24">
      <div className="max-w-6xl mx-auto px-6">
        <FadeIn className="text-center mb-16">
          <p className="text-[#C2410C] text-[11px] font-bold uppercase tracking-[0.16em] mb-3">
            Funcionalidades
          </p>
          <h2 className="text-3xl lg:text-4xl font-bold text-[#1A1A1A] tracking-tight">
            Tudo que você precisa
          </h2>
        </FadeIn>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {FEATURES.map(({ icon: Icon, title, desc }, i) => (
            <FadeIn key={title} delay={i * 65}>
              <div className="bg-[#FDFAF5] border border-[#E7E0D5] rounded-[20px] p-6 h-full group cursor-default hover:shadow-[0_0_0_1.5px_#C2410C,0_0_24px_rgba(194,65,12,0.08)] transition-all duration-200">
                <div className="w-10 h-10 rounded-[10px] bg-[#FFF7ED] flex items-center justify-center mb-4 group-hover:bg-[#FFEDD5] transition-colors duration-200">
                  <Icon size={20} className="text-[#C2410C]" />
                </div>
                <h3 className="font-bold text-[#1A1A1A] mb-1.5 text-[0.9rem]">{title}</h3>
                <p className="text-[#78716C] text-sm leading-relaxed">{desc}</p>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
