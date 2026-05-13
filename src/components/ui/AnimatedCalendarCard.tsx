"use client";

import { useState, useEffect } from "react";
import { Check } from "lucide-react";

const SLOTS = [
  { time: "09:00", available: false },
  { time: "09:30", available: false },
  { time: "10:00", available: true },
  { time: "10:30", available: true },
  { time: "11:00", available: true },
  { time: "14:00", available: true },
  { time: "14:30", available: false },
  { time: "15:00", available: true },
];
const FREE = SLOTS.reduce<number[]>((a, s, i) => (s.available ? [...a, i] : a), []);

export function AnimatedCalendarCard() {
  const [step, setStep] = useState(0);
  const [confirming, setConfirming] = useState(false);

  useEffect(() => {
    const id = setInterval(() => {
      setConfirming(true);
      setTimeout(() => {
        setStep((s) => (s + 1) % FREE.length);
        setConfirming(false);
      }, 600);
    }, 2500);
    return () => clearInterval(id);
  }, []);

  const sel = FREE[step];

  return (
    <div className="relative w-full max-w-[320px] mx-auto">
      <div
        aria-hidden
        className="absolute inset-0 rounded-[28px] pointer-events-none"
        style={{
          background: "radial-gradient(ellipse 90% 70% at 50% 35%, rgba(194,65,12,0.38), transparent)",
          filter: "blur(36px)",
          transform: "scale(1.2)",
        }}
      />
      <div className="relative rounded-[20px] bg-[#110800] border border-[#1E0A00] overflow-hidden shadow-[0_24px_80px_rgba(0,0,0,0.65),0_0_0_1px_rgba(194,65,12,0.08)]">
        <div className="px-5 pt-5 pb-4 border-b border-[#1E0A00]">
          <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#7C3D12] mb-2">
            Quinta-feira, 15 mai
          </p>
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-full bg-[#1C0800] flex items-center justify-center text-[11px] font-bold text-[#C07850] shrink-0">
              C
            </div>
            <div>
              <p className="text-[#E2E8F0] text-sm font-semibold leading-tight">Carlos</p>
              <p className="text-[#7C3D12] text-[11px]">Corte + Barba · 50 min</p>
            </div>
          </div>
        </div>

        <div className="px-4 py-3 flex flex-col gap-1.5">
          {SLOTS.map((slot, idx) => {
            const isSel = idx === sel;
            if (!slot.available) {
              return (
                <div key={slot.time} className="flex items-center gap-3 px-3 py-1.5 opacity-20">
                  <span className="text-[#C07850] text-sm font-mono w-11">{slot.time}</span>
                  <div className="flex-1 h-px bg-[#1E0A00]" />
                  <span className="text-[#7C3D12] text-[10px]">ocupado</span>
                </div>
              );
            }
            return (
              <div
                key={slot.time}
                className="flex items-center gap-3 px-3 py-2.5 rounded-[10px] transition-all duration-500"
                style={{
                  background: isSel
                    ? confirming
                      ? "rgba(194,65,12,0.5)"
                      : "rgba(194,65,12,0.82)"
                    : "rgba(255,255,255,0.03)",
                  boxShadow: isSel ? "0 0 18px rgba(194,65,12,0.32)" : "none",
                  transform: isSel ? "scale(1.015)" : "scale(1)",
                }}
              >
                <span
                  className="text-sm font-mono w-11 transition-colors duration-300"
                  style={{ color: isSel ? "#ffffff" : "#92400E", fontWeight: isSel ? 700 : 400 }}
                >
                  {slot.time}
                </span>
                <span
                  className="flex-1 text-xs transition-colors duration-300"
                  style={{ color: isSel ? "rgba(255,255,255,0.85)" : "#5C2A0E", fontWeight: isSel ? 500 : 400 }}
                >
                  {isSel ? (confirming ? "Confirmando..." : "Selecionado") : "disponível"}
                </span>
                {isSel && !confirming && (
                  <span className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                    <Check size={11} className="text-white" strokeWidth={3} />
                  </span>
                )}
                {isSel && confirming && (
                  <span className="w-1.5 h-1.5 rounded-full bg-white/50 animate-pulse shrink-0" />
                )}
              </div>
            );
          })}
        </div>

        <div className="px-4 pb-5 pt-1">
          <div
            className="w-full py-3 rounded-[12px] text-center text-sm font-semibold transition-all duration-500 text-white"
            style={{
              background: "linear-gradient(135deg, #9a3412, #C2410C, #ea580c)",
              boxShadow: "0 4px 20px rgba(194,65,12,0.4)",
              opacity: confirming ? 0.75 : 1,
            }}
          >
            {confirming ? "Confirmando agendamento..." : "Confirmar horário"}
          </div>
        </div>
      </div>
    </div>
  );
}
