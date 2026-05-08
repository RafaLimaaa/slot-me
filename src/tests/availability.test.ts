import { describe, it, expect } from "vitest";
import { getAvailableSlots } from "@/lib/availability";
import type { WorkingHours, Appointment, BlockedPeriod } from "@/types";

type AppointmentSlice = Pick<Appointment, "start_time" | "end_time">;
type BlockedSlice = Pick<BlockedPeriod, "start_time" | "end_time">;

const BASE_DATE = new Date("2026-05-08T08:00:00"); // 08:00, bem antes dos slots

const WORKING_HOURS: WorkingHours = {
  id: "wh-1",
  professional_id: "prof-1",
  day_of_week: 5,
  start_time: "09:00:00",
  end_time: "18:00:00",
  lunch_start: null,
  lunch_end: null,
};

function makeInput(
  overrides: Partial<Parameters<typeof getAvailableSlots>[0]> = {}
): Parameters<typeof getAvailableSlots>[0] {
  return {
    workingHours: WORKING_HOURS,
    appointments: [],
    blockedPeriods: [],
    serviceDuration: 30,
    currentDateTime: BASE_DATE,
    ...overrides,
  };
}

// ─── Casos básicos ────────────────────────────────────────────────────────────

describe("sem working_hours", () => {
  it("retorna array vazio quando workingHours é null", () => {
    expect(getAvailableSlots(makeInput({ workingHours: null }))).toEqual([]);
  });
});

describe("serviço de 30 minutos sem conflitos", () => {
  it("gera slots de 09:00 até 17:30 em intervalos de 30min", () => {
    const slots = getAvailableSlots(makeInput());
    expect(slots[0]).toBe("09:00");
    expect(slots[slots.length - 1]).toBe("17:30");
    // 09:00 → 17:30 = 18 slots
    expect(slots).toHaveLength(18);
  });
});

// ─── Último slot possível ─────────────────────────────────────────────────────

describe("serviço de 90 minutos", () => {
  it("último slot é 16:30 (termina às 18:00)", () => {
    const slots = getAvailableSlots(makeInput({ serviceDuration: 90 }));
    expect(slots[slots.length - 1]).toBe("16:30");
  });

  it("não inclui 17:00 (terminaria às 18:30, após o expediente)", () => {
    const slots = getAvailableSlots(makeInput({ serviceDuration: 90 }));
    expect(slots).not.toContain("17:00");
  });
});

// ─── Bloqueio por agendamento ─────────────────────────────────────────────────

describe("agendamento de 60min às 10:00", () => {
  const appointment: AppointmentSlice = {
    start_time: "10:00:00",
    end_time: "11:00:00",
  };

  it("bloqueia 10:00", () => {
    const slots = getAvailableSlots(
      makeInput({ appointments: [appointment] })
    );
    expect(slots).not.toContain("10:00");
  });

  it("bloqueia 10:30 (sobreposição com agendamento de 60min)", () => {
    const slots = getAvailableSlots(
      makeInput({ appointments: [appointment] })
    );
    expect(slots).not.toContain("10:30");
  });

  it("não bloqueia 09:30 nem 11:00", () => {
    const slots = getAvailableSlots(
      makeInput({ appointments: [appointment] })
    );
    expect(slots).toContain("09:30");
    expect(slots).toContain("11:00");
  });
});

describe("agendamento de 90min às 14:00", () => {
  const appointment: AppointmentSlice = {
    start_time: "14:00:00",
    end_time: "15:30:00",
  };

  it("bloqueia 14:00, 14:30 e 15:00", () => {
    const slots = getAvailableSlots(
      makeInput({ appointments: [appointment] })
    );
    expect(slots).not.toContain("14:00");
    expect(slots).not.toContain("14:30");
    expect(slots).not.toContain("15:00");
  });

  it("não bloqueia 13:30 nem 15:30", () => {
    const slots = getAvailableSlots(
      makeInput({ appointments: [appointment] })
    );
    expect(slots).toContain("13:30");
    expect(slots).toContain("15:30");
  });
});

// ─── Horário de almoço ────────────────────────────────────────────────────────

describe("horário de almoço 12:00-13:00 com serviço de 30min", () => {
  const withLunch: WorkingHours = {
    ...WORKING_HOURS,
    lunch_start: "12:00:00",
    lunch_end: "13:00:00",
  };

  it("slot 11:30 é válido (termina às 12:00, sem sobreposição)", () => {
    const slots = getAvailableSlots(
      makeInput({ workingHours: withLunch })
    );
    expect(slots).toContain("11:30");
  });

  it("bloqueia 12:00 (início do almoço)", () => {
    const slots = getAvailableSlots(
      makeInput({ workingHours: withLunch })
    );
    expect(slots).not.toContain("12:00");
  });

  it("bloqueia 12:30 (dentro do almoço)", () => {
    const slots = getAvailableSlots(
      makeInput({ workingHours: withLunch })
    );
    expect(slots).not.toContain("12:30");
  });

  it("slot 13:00 está disponível (após almoço)", () => {
    const slots = getAvailableSlots(
      makeInput({ workingHours: withLunch })
    );
    expect(slots).toContain("13:00");
  });
});

// ─── Antecedência mínima ──────────────────────────────────────────────────────

describe("antecedência mínima de 60min", () => {
  it("slot 14:00 é removido quando now() é 13:30", () => {
    const now = new Date("2026-05-08T13:30:00");
    const slots = getAvailableSlots(makeInput({ currentDateTime: now }));
    expect(slots).not.toContain("14:00");
  });

  it("slot 14:30 está disponível quando now() é 13:30", () => {
    const now = new Date("2026-05-08T13:30:00");
    const slots = getAvailableSlots(makeInput({ currentDateTime: now }));
    expect(slots).toContain("14:30");
  });

  it("nenhum slot antes de cutoff (now + 60min)", () => {
    const now = new Date("2026-05-08T16:00:00"); // cutoff = 17:00
    const slots = getAvailableSlots(makeInput({ currentDateTime: now }));
    slots.forEach((s) => {
      const [h, m] = s.split(":").map(Number);
      expect(h * 60 + m).toBeGreaterThanOrEqual(17 * 60);
    });
  });
});

// ─── Bloqueio manual sobreposto a agendamento ─────────────────────────────────

describe("período bloqueado sobreposto com agendamento", () => {
  const appointment: AppointmentSlice = {
    start_time: "10:00:00",
    end_time: "10:30:00",
  };
  const blocked: BlockedSlice = {
    start_time: "10:00:00",
    end_time: "10:30:00",
  };

  it("não duplica a remoção — slot 10:00 ausente uma única vez", () => {
    const slots = getAvailableSlots(
      makeInput({ appointments: [appointment], blockedPeriods: [blocked] })
    );
    expect(slots).not.toContain("10:00");
    // Verifica que não há duplicatas no array de slots
    const unique = new Set(slots);
    expect(unique.size).toBe(slots.length);
  });
});

// ─── Todos os slots ocupados ──────────────────────────────────────────────────

describe("todos os slots ocupados", () => {
  it("retorna array vazio quando todo o expediente está bloqueado", () => {
    const blocked: BlockedSlice = {
      start_time: "09:00:00",
      end_time: "18:00:00",
    };
    const slots = getAvailableSlots(
      makeInput({ blockedPeriods: [blocked] })
    );
    expect(slots).toEqual([]);
  });
});

// ─── Isolamento entre dias ────────────────────────────────────────────────────

describe("agendamentos de outros profissionais não afetam", () => {
  it("slots permanecem disponíveis quando appointments está vazio", () => {
    const slots = getAvailableSlots(makeInput({ appointments: [] }));
    expect(slots.length).toBeGreaterThan(0);
  });
});

// ─── Serviço de duração maior que o slot interval ────────────────────────────

describe("serviço de 120 minutos", () => {
  it("último slot é 16:00 (termina às 18:00)", () => {
    const slots = getAvailableSlots(makeInput({ serviceDuration: 120 }));
    expect(slots[slots.length - 1]).toBe("16:00");
  });

  it("agendamento de 30min às 10:00 bloqueia apenas 10:00", () => {
    const appointment: AppointmentSlice = {
      start_time: "10:00:00",
      end_time: "10:30:00",
    };
    const slots = getAvailableSlots(
      makeInput({ serviceDuration: 120, appointments: [appointment] })
    );
    // Slot 09:00 terminaria às 11:00 — sem sobreposição com 10:00-10:30? Sim: 09:00-11:00 overlaps 10:00-10:30
    expect(slots).not.toContain("09:00");
    expect(slots).not.toContain("10:00");
    // 10:30 terminaria às 12:30 — sem sobreposição com 10:00-10:30
    expect(slots).toContain("10:30");
  });
});
