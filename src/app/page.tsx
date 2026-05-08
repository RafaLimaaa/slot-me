import Link from "next/link";
import { Calendar, Zap, Shield, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Nav */}
      <header className="border-b border-[#f1f5f9] sticky top-0 bg-white/90 backdrop-blur-sm z-10">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <span className="text-xl font-bold text-[#09090b] tracking-tight">SlotMe</span>
          <div className="flex items-center gap-3">
            <Link href="/auth/login" className="text-sm text-[#6b7280] hover:text-[#09090b] transition-colors">
              Entrar
            </Link>
            <Link href="/auth/login">
              <Button size="sm">Começar grátis</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="max-w-5xl mx-auto px-4 py-20 text-center">
        <h1 className="text-5xl md:text-6xl font-bold text-[#09090b] tracking-tight leading-none mb-6">
          Agendamento online<br />
          <span className="text-[#2563EB]">sem complicação</span>
        </h1>
        <p className="text-lg text-[#6b7280] max-w-xl mx-auto mb-8">
          Crie sua página de agendamentos em minutos. Seus clientes escolhem o
          serviço, o profissional e o horário — sem precisar criar conta.
        </p>
        <Link href="/auth/login">
          <Button size="lg">
            Criar minha página <ArrowRight size={18} />
          </Button>
        </Link>
        <p className="text-xs text-[#a1a1aa] mt-3">Grátis para começar. Sem cartão de crédito.</p>
      </section>

      {/* Features */}
      <section className="max-w-5xl mx-auto px-4 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              icon: Calendar,
              title: "Agenda inteligente",
              desc: "Horários de funcionamento, almoço e bloqueios gerenciados automaticamente.",
            },
            {
              icon: Zap,
              title: "Agendamento em segundos",
              desc: "Seus clientes agendam diretamente na sua página pública, sem fricção.",
            },
            {
              icon: Shield,
              title: "Confirmação por email",
              desc: "Clientes recebem confirmação, lembrete 24h antes e links de cancelamento.",
            },
          ].map(({ icon: Icon, title, desc }) => (
            <div
              key={title}
              className="border border-[#f1f5f9] rounded-[20px] p-6 hover:shadow-[0_0_0_1px_#2563EB,0_0_16px_rgba(37,99,235,0.08)] transition-shadow duration-200"
            >
              <div className="w-10 h-10 bg-[#eff6ff] rounded-[10px] flex items-center justify-center mb-4">
                <Icon size={20} className="text-[#2563EB]" />
              </div>
              <h3 className="font-semibold text-[#09090b] mb-1">{title}</h3>
              <p className="text-sm text-[#6b7280]">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[#09090b] py-16">
        <div className="max-w-xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-[#fafafa] mb-3">
            Pronto para começar?
          </h2>
          <p className="text-[#a1a1aa] text-sm mb-6">
            Configure seu negócio e comece a receber agendamentos hoje.
          </p>
          <Link href="/auth/login">
            <Button size="lg">
              Criar minha página <ArrowRight size={18} />
            </Button>
          </Link>
        </div>
      </section>

      <footer className="border-t border-[#f1f5f9] py-6">
        <div className="max-w-5xl mx-auto px-4 flex items-center justify-between text-xs text-[#a1a1aa]">
          <span>SlotMe</span>
          <span>Agendamento online para negócios de serviços</span>
        </div>
      </footer>
    </div>
  );
}
