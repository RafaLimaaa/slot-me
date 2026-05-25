"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Building2, Clock, Scissors, Users, Check } from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import { StepBusiness } from "./StepBusiness";
import { StepHours } from "./StepHours";
import { StepServices } from "./StepServices";
import { StepProfessionals } from "./StepProfessionals";
import { createClient } from "@/lib/supabase";
import type {
  BusinessFormData,
  WorkingHoursFormData,
  ServiceFormData,
  ProfessionalFormData,
} from "@/types";

const STEPS = [
  { label: "Negócio",  Icon: Building2, title: "Dados do negócio",          subtitle: "Conte-nos sobre seu estabelecimento" },
  { label: "Horários", Icon: Clock,     title: "Horários de funcionamento",  subtitle: "Quando você atende seus clientes?" },
  { label: "Serviços", Icon: Scissors,  title: "Seus serviços",              subtitle: "O que você oferece aos clientes?" },
  { label: "Equipe",   Icon: Users,     title: "Sua equipe",                 subtitle: "Quem trabalha com você?" },
];

const CONFETTI: { color: string; size: number; shape: "sq" | "circle" | "rect"; x: number; delay: number }[] = [
  { color: "#C2410C", size: 6, shape: "sq",     x: 15, delay: 0   },
  { color: "#D97706", size: 4, shape: "circle", x: 30, delay: 50  },
  { color: "#22C55E", size: 8, shape: "rect",   x: 50, delay: 100 },
  { color: "#C2410C", size: 5, shape: "circle", x: 65, delay: 30  },
  { color: "#D97706", size: 7, shape: "sq",     x: 80, delay: 80  },
  { color: "#22C55E", size: 4, shape: "rect",   x: 20, delay: 120 },
  { color: "#C2410C", size: 6, shape: "sq",     x: 70, delay: 60  },
  { color: "#D97706", size: 5, shape: "circle", x: 45, delay: 140 },
];

export function OnboardingFlow({ userId }: { userId: string }) {
  const [step, setStep] = useState(0);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [businessData, setBusinessData] = useState<BusinessFormData | null>(null);
  const [hoursData, setHoursData] = useState<WorkingHoursFormData[]>([]);
  const [servicesData, setServicesData] = useState<ServiceFormData[]>([]);
  const router = useRouter();
  const supabase = createClient();

  const [cardOpacity, setCardOpacity] = useState(1);
  const [cardTranslate, setCardTranslate] = useState(0);
  const [transitionOn, setTransitionOn] = useState(true);
  const [showConfetti, setShowConfetti] = useState(false);

  function navigateToStep(newStep: number, dir: "forward" | "back") {
    setTransitionOn(true);
    setCardOpacity(0);
    setCardTranslate(dir === "forward" ? -20 : 20);
    setTimeout(() => {
      setStep(newStep);
      setTransitionOn(false);
      setCardOpacity(0);
      setCardTranslate(dir === "forward" ? 20 : -20);
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setTransitionOn(true);
          setCardOpacity(1);
          setCardTranslate(0);
        });
      });
      if (dir === "forward") {
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 1000);
      }
    }, 150);
  }

  async function handleFinish(professionals: ProfessionalFormData[]) {
    if (!businessData) return;
    setSaving(true);
    setSaveError(null);

    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      const { data: refreshed } = await supabase.auth.refreshSession();
      if (!refreshed.session) {
        setSaveError("Sessão expirada. Faça login novamente.");
        setSaving(false);
        return;
      }
    }

    const { data: business, error: bizError } = await supabase
      .from("businesses")
      .insert({
        owner_id: userId,
        name: businessData.name,
        slug: businessData.slug,
        description: businessData.description || null,
        address: businessData.street || null,
        street_number: businessData.street_number || null,
        neighborhood: businessData.neighborhood || null,
        city: businessData.city || null,
        zip_code: businessData.zip_code || null,
        phone: businessData.phone || null,
        maps_embed_url: businessData.maps_embed_url || null,
      })
      .select()
      .single();

    if (bizError || !business) {
      setSaveError(`Erro ao salvar negócio: ${bizError?.message ?? "permissão negada"}`);
      setSaving(false);
      return;
    }

    const { data: insertedServices, error: svcError } = await supabase
      .from("services")
      .insert(
        servicesData.map((s) => ({
          business_id: business.id,
          name: s.name,
          price: parseFloat(s.price.replace(/\./g, "").replace(",", ".")),
          duration_minutes: s.duration_minutes,
        }))
      )
      .select();

    if (svcError || !insertedServices) {
      setSaveError(`Erro ao salvar serviços: ${svcError?.message ?? "permissão negada"}`);
      setSaving(false);
      return;
    }

    const { data: insertedProfs, error: profError } = await supabase
      .from("professionals")
      .insert(
        professionals.map((p) => ({
          business_id: business.id,
          name: p.name,
          specialty: p.specialty || null,
          phone: p.phone || null,
        }))
      )
      .select();

    if (profError || !insertedProfs) {
      setSaveError(`Erro ao salvar profissionais: ${profError?.message ?? "permissão negada"}`);
      setSaving(false);
      return;
    }

    const activeHours = hoursData.filter((h) => h.enabled);
    const whRows = insertedProfs.flatMap((prof) =>
      activeHours.map((h) => ({
        professional_id: prof.id,
        day_of_week: h.day_of_week,
        start_time: h.start_time,
        end_time: h.end_time,
        lunch_start: h.lunch_start || null,
        lunch_end: h.lunch_end || null,
      }))
    );

    if (whRows.length) {
      const { error: whError } = await supabase.from("working_hours").insert(whRows);
      if (whError) {
        setSaveError(`Erro ao salvar horários: ${whError.message}`);
        setSaving(false);
        return;
      }
    }

    const svcMap = new Map(insertedServices.map((s, i) => [`svc-${i}`, s.id]));
    const psRows = insertedProfs.flatMap((prof, pi) => {
      const profData = professionals[pi];
      return profData.service_ids
        .map((key) => {
          const svcId = svcMap.get(key);
          return svcId ? { professional_id: prof.id, service_id: svcId } : null;
        })
        .filter(Boolean);
    });

    if (psRows.length) {
      const { error: psError } = await supabase
        .from("professional_services")
        .insert(psRows as { professional_id: string; service_id: string }[]);
      if (psError) {
        setSaveError(`Erro ao vincular serviços: ${psError.message}`);
        setSaving(false);
        return;
      }
    }

    router.push("/dashboard");
  }

  const { Icon, title, subtitle } = STEPS[step];

  return (
    <>
      <style>{`
        @keyframes ob-confetti-fall {
          0%   { transform: translateY(-10px) rotate(0deg);   opacity: 1; }
          100% { transform: translateY(80px)  rotate(360deg); opacity: 0; }
        }
        .ob-confetti { animation: ob-confetti-fall 800ms ease-in forwards; }
      `}</style>

      <div
        style={{
          backgroundColor: "#F5F0E8",
          backgroundImage:
            "linear-gradient(rgba(194,65,12,0.05) 1px, transparent 1px)," +
            "linear-gradient(90deg, rgba(194,65,12,0.05) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "32px 16px",
          position: "relative",
        }}
      >
        {/* Radial glow */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: 300,
            background: "radial-gradient(ellipse at 50% 0%, rgba(194,65,12,0.14) 0%, transparent 60%)",
            pointerEvents: "none",
          }}
        />

        {/* Header: logo + steps + badge */}
        <div
          style={{
            width: "100%",
            maxWidth: 520,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            marginBottom: 24,
            position: "relative",
            zIndex: 1,
          }}
        >
          <div style={{ marginBottom: 24 }}>
            <Logo size="sm" />
          </div>

          {/* Step indicators */}
          <div style={{ display: "flex", alignItems: "flex-start", marginBottom: 12 }}>
            {STEPS.map((s, i) => (
              <div key={i} style={{ display: "flex", alignItems: "flex-start" }}>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
                  <div
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      background:
                        i <= step
                          ? "radial-gradient(ellipse at 50% 40%, #D95518 0%, #9A3412 60%, #7C2A10 100%)"
                          : "#EDE8E0",
                      border: i > step ? "1px solid #E8E0D5" : "none",
                      boxShadow:
                        i < step
                          ? "0 2px 12px rgba(194,65,12,0.40)"
                          : i === step
                          ? "0 0 0 4px rgba(194,65,12,0.15), 0 2px 12px rgba(194,65,12,0.40)"
                          : "none",
                      transition: "all 300ms ease",
                      flexShrink: 0,
                    }}
                  >
                    {i < step ? (
                      <Check size={16} color="#F5F0E8" strokeWidth={2.5} />
                    ) : (
                      <span style={{ fontSize: 13, fontWeight: 600, color: i <= step ? "#F5F0E8" : "#9CA3AF" }}>
                        {i + 1}
                      </span>
                    )}
                  </div>
                  <span
                    style={{
                      fontSize: 10,
                      color: i < step ? "#6B7280" : i === step ? "#C2410C" : "#9CA3AF",
                      textAlign: "center",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {s.label}
                  </span>
                </div>
                {i < STEPS.length - 1 && (
                  <div
                    style={{
                      width: 48,
                      height: 2,
                      background: i < step ? "#C2410C" : "#E8E0D5",
                      marginTop: 17,
                      flexShrink: 0,
                      transition: "background 300ms ease",
                    }}
                  />
                )}
              </div>
            ))}
          </div>

          {/* Badge */}
          <span
            style={{
              fontSize: 11,
              fontFamily: "monospace",
              color: "#C2410C",
              background: "rgba(194,65,12,0.08)",
              border: "1px solid rgba(194,65,12,0.15)",
              borderRadius: 20,
              padding: "3px 10px",
            }}
          >
            passo {step + 1} de 4
          </span>
        </div>

        {/* Card */}
        <div
          style={{
            maxWidth: 520,
            width: "100%",
            background: "rgba(255,255,255,0.85)",
            backdropFilter: "blur(8px)",
            WebkitBackdropFilter: "blur(8px)",
            border: "1px solid rgba(245,240,232,0.8)",
            borderRadius: 20,
            padding: 32,
            boxShadow: "0 4px 32px rgba(0,0,0,0.06), 0 1px 4px rgba(0,0,0,0.04)",
            position: "relative",
            overflow: "hidden",
            zIndex: 1,
            opacity: cardOpacity,
            transform: `translateX(${cardTranslate}px)`,
            transition: transitionOn ? "opacity 200ms ease, transform 200ms ease" : "none",
          }}
        >
          {/* Confetti */}
          {showConfetti &&
            CONFETTI.map((c, i) => (
              <div
                key={i}
                className="ob-confetti"
                style={{
                  position: "absolute",
                  top: 0,
                  left: `${c.x}%`,
                  width: c.shape === "rect" ? c.size * 2 : c.size,
                  height: c.size,
                  borderRadius: c.shape === "circle" ? "50%" : 2,
                  background: c.color,
                  animationDelay: `${c.delay}ms`,
                  pointerEvents: "none",
                  zIndex: 10,
                }}
              />
            ))}

          {/* Card header */}
          <div style={{ display: "flex", alignItems: "flex-start", gap: 14, marginBottom: 24 }}>
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: 10,
                background: "rgba(194,65,12,0.10)",
                border: "1px solid rgba(194,65,12,0.20)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <Icon size={20} color="#C2410C" />
            </div>
            <div>
              <p style={{ fontSize: 18, fontWeight: 600, color: "#1A1A1A", margin: 0, lineHeight: 1.3 }}>
                {title}
              </p>
              <p style={{ fontSize: 13, color: "#9CA3AF", margin: "2px 0 0 0" }}>{subtitle}</p>
            </div>
          </div>

          {saveError && (
            <div
              style={{
                marginBottom: 16,
                padding: "12px 14px",
                background: "#FEF2F2",
                border: "1px solid #FECACA",
                borderRadius: 10,
                fontSize: 13,
                color: "#DC2626",
              }}
            >
              {saveError}
            </div>
          )}

          {step === 0 && (
            <StepBusiness
              initial={businessData ?? {}}
              onNext={(d) => { setBusinessData(d); navigateToStep(1, "forward"); }}
            />
          )}
          {step === 1 && (
            <StepHours
              initial={hoursData}
              onNext={(d) => { setHoursData(d); navigateToStep(2, "forward"); }}
              onBack={() => navigateToStep(0, "back")}
            />
          )}
          {step === 2 && (
            <StepServices
              initial={servicesData}
              onNext={(d) => { setServicesData(d); navigateToStep(3, "forward"); }}
              onBack={() => navigateToStep(1, "back")}
            />
          )}
          {step === 3 && (
            <StepProfessionals
              services={servicesData}
              initial={[]}
              onFinish={handleFinish}
              onBack={() => navigateToStep(2, "back")}
              loading={saving}
            />
          )}
        </div>
      </div>
    </>
  );
}
