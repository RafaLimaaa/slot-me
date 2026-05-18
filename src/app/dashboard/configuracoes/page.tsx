"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Image as ImageIcon, Building2, Clock, Scissors, Users, CalendarOff,
  Settings, CheckSquare, LayoutList, ChevronRight, Check, Minus,
} from "lucide-react";
import { Spinner } from "@/components/ui/Spinner";
import { SectionCard } from "@/components/dashboard/SectionCard";
import { BusinessSection } from "@/components/dashboard/BusinessSection";
import { ServicesSection } from "@/components/dashboard/ServicesSection";
import { ProfessionalsSection } from "@/components/dashboard/ProfessionalsSection";
import { ImageUploadSection } from "@/components/dashboard/ImageUploadSection";
import { WorkingHoursSection } from "@/components/dashboard/WorkingHoursSection";
import { BlockedPeriodsSection } from "@/components/dashboard/BlockedPeriodsSection";
import { useAuth } from "@/hooks/useAuth";
import { useBusiness } from "@/hooks/useBusiness";

export default function ConfiguracoesPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const { business, services, professionals, workingHours, loading, refetch } = useBusiness(user?.id);

  const fotoRef         = useRef<HTMLDivElement>(null);
  const dadosRef        = useRef<HTMLDivElement>(null);
  const horariosRef     = useRef<HTMLDivElement>(null);
  const servicosRef     = useRef<HTMLDivElement>(null);
  const profissionaisRef = useRef<HTMLDivElement>(null);
  const bloqueiosRef    = useRef<HTMLDivElement>(null);

  const [activeSection, setActiveSection] = useState("fotos");

  useEffect(() => {
    if (!authLoading && !loading && !business) router.replace("/dashboard/onboarding");
  }, [authLoading, loading, business, router]);

  useEffect(() => {
    const items = [
      { id: "fotos",         ref: fotoRef },
      { id: "dados",         ref: dadosRef },
      { id: "horarios",      ref: horariosRef },
      { id: "servicos",      ref: servicosRef },
      { id: "profissionais", ref: profissionaisRef },
      { id: "bloqueios",     ref: bloqueiosRef },
    ];
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible.length > 0)
          setActiveSection(visible[0].target.getAttribute("data-section") ?? "");
      },
      { threshold: 0.2, rootMargin: "0px 0px -60% 0px" }
    );
    items.forEach(({ id, ref }) => {
      if (ref.current) {
        ref.current.setAttribute("data-section", id);
        observer.observe(ref.current);
      }
    });
    return () => observer.disconnect();
  }, []);

  if (authLoading || (loading && !business)) {
    return <div className="flex items-center justify-center h-64"><Spinner size={32} /></div>;
  }
  if (!business) return null;

  const sections = [
    { id: "fotos",         icon: ImageIcon,   label: "Fotos",         complete: !!(business.cover_url || business.logo_url), ref: fotoRef },
    { id: "dados",         icon: Building2,   label: "Dados",         complete: true,                                        ref: dadosRef },
    { id: "horarios",      icon: Clock,       label: "Horários",      complete: workingHours.length > 0,                     ref: horariosRef },
    { id: "servicos",      icon: Scissors,    label: "Serviços",      complete: services.length > 0,                         ref: servicosRef },
    { id: "profissionais", icon: Users,       label: "Profissionais", complete: professionals.length > 0,                    ref: profissionaisRef },
    { id: "bloqueios",     icon: CalendarOff, label: "Bloqueios",     complete: null,                                        ref: bloqueiosRef },
  ] as const;

  const completedCount = sections.filter((s) => s.complete === true).length;

  return (
    <div
      style={{
        backgroundImage:
          "linear-gradient(rgba(194,65,12,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(194,65,12,0.05) 1px, transparent 1px)",
        backgroundSize: "32px 32px",
      }}
    >
      {/* Título */}
      <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 24 }}>
        <div style={{
          width: 40, height: 40, borderRadius: 10,
          background: "rgba(194,65,12,0.15)",
          border: "1px solid rgba(194,65,12,0.30)",
          display: "flex", alignItems: "center", justifyContent: "center",
          flexShrink: 0,
        }}>
          <Settings size={20} color="#C2410C" />
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <h1 style={{ fontSize: 20, fontWeight: 500, color: "#fff", margin: 0, lineHeight: 1.2 }}>
            Configurações
          </h1>
          <p style={{ fontSize: 12, color: "#6B7280", margin: 0 }}>
            {business.name} / Configurações
          </p>
        </div>
      </div>

      {/* Dois colunas */}
      <div className="flex flex-col lg:flex-row gap-6" style={{ alignItems: "flex-start" }}>

        {/* Coluna esquerda — seções */}
        <div className="flex-1 min-w-0 flex flex-col gap-5">
          <div ref={fotoRef}>
            <SectionCard icon={ImageIcon} title="Fotos" complete={!!(business.cover_url || business.logo_url)}>
              <ImageUploadSection business={business} onRefetch={refetch} />
            </SectionCard>
          </div>

          <div ref={dadosRef}>
            <SectionCard icon={Building2} title="Dados do negócio" complete={true}>
              <BusinessSection business={business} onRefetch={refetch} />
            </SectionCard>
          </div>

          <div ref={horariosRef}>
            <SectionCard icon={Clock} title="Horários de funcionamento" complete={workingHours.length > 0}>
              <WorkingHoursSection professionals={professionals} workingHours={workingHours} onRefetch={refetch} />
            </SectionCard>
          </div>

          <div ref={servicosRef}>
            <SectionCard icon={Scissors} title="Serviços" complete={services.length > 0}>
              <ServicesSection businessId={business.id} services={services} onRefetch={refetch} />
            </SectionCard>
          </div>

          <div ref={profissionaisRef}>
            <SectionCard icon={Users} title="Profissionais" complete={professionals.length > 0}>
              <ProfessionalsSection businessId={business.id} services={services} professionals={professionals} onRefetch={refetch} />
            </SectionCard>
          </div>

          <div ref={bloqueiosRef}>
            <SectionCard icon={CalendarOff} title="Bloqueios de horário" complete={null}>
              <BlockedPeriodsSection professionals={professionals} />
            </SectionCard>
          </div>
        </div>

        {/* Sidebar direita */}
        <div
          className="hidden lg:flex flex-col gap-3"
          style={{ width: 240, flexShrink: 0, position: "sticky", top: 24 }}
        >
          {/* Card 1 — Progresso */}
          <div style={{ background: "#161616", border: "1px solid #2A2A2A", borderRadius: 10, padding: 14 }}>
            <div className="flex items-center gap-2 mb-3">
              <CheckSquare size={14} color="#C2410C" />
              <span style={{ fontSize: 11, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                Configuração
              </span>
            </div>
            <div style={{ background: "#1E1E1E", height: 4, borderRadius: 4, marginBottom: 6 }}>
              <div style={{
                background: "#22C55E", height: 4, borderRadius: 4,
                width: `${(completedCount / 6) * 100}%`,
                transition: "width 300ms ease",
              }} />
            </div>
            <p style={{ fontSize: 10, color: "#6B7280", marginBottom: 12 }}>
              {completedCount} de 6 seções completas
            </p>
            <div className="flex flex-col gap-0.5">
              {sections.map((s) => (
                <div key={s.id} className="flex items-center justify-between py-1">
                  <div className="flex items-center gap-2">
                    <span style={{
                      width: 6, height: 6, borderRadius: "50%", flexShrink: 0, display: "block",
                      background: s.complete === true ? "#22C55E" : "#4B5563",
                    }} />
                    <span style={{ fontSize: 11, color: "#9CA3AF" }}>{s.label}</span>
                  </div>
                  {s.complete === true  && <Check  size={10} color="#22C55E" />}
                  {s.complete === false && <Minus  size={10} color="#4B5563" />}
                </div>
              ))}
            </div>
          </div>

          {/* Card 2 — Navegação rápida */}
          <div style={{ background: "#161616", border: "1px solid #2A2A2A", borderRadius: 10, padding: 14 }}>
            <div className="flex items-center gap-2 mb-3">
              <LayoutList size={14} color="#C2410C" />
              <span style={{ fontSize: 11, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                Ir para
              </span>
            </div>
            <div className="flex flex-col gap-0.5">
              {sections.map((s) => {
                const isActive = activeSection === s.id;
                return (
                  <button
                    key={s.id}
                    onClick={() => s.ref.current?.scrollIntoView({ behavior: "smooth" })}
                    className="w-full flex items-center gap-2 px-2 py-1.5 rounded-[6px] transition-colors text-left"
                    style={{
                      background: isActive ? "#1E1E1E" : "transparent",
                      borderLeft: isActive ? "2px solid #C2410C" : "2px solid transparent",
                    }}
                  >
                    <span style={{
                      width: 24, height: 24, borderRadius: 6,
                      background: "rgba(194,65,12,0.10)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      flexShrink: 0,
                    }}>
                      <s.icon size={12} color="#C2410C" />
                    </span>
                    <span style={{ flex: 1, fontSize: 12, color: isActive ? "#fff" : "#9CA3AF" }}>
                      {s.label}
                    </span>
                    <ChevronRight size={12} color="#4B5563" />
                  </button>
                );
              })}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
