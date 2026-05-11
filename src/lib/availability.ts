import type { GetAvailableSlotsInput } from "@/types";

const SLOT_INTERVAL = 30;
const MIN_ADVANCE_MINUTES = 60;

function timeToMinutes(time: string): number {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
}

function minutesToTime(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

function intervalsOverlap(
  aStart: number,
  aEnd: number,
  bStart: number,
  bEnd: number
): boolean {
  return aStart < bEnd && aEnd > bStart;
}

export function getAvailableSlots({
  workingHours,
  appointments,
  blockedPeriods,
  serviceDuration,
  currentDateTime,
}: GetAvailableSlotsInput): string[] {
  if (!workingHours) return [];

  const shiftStart = timeToMinutes(workingHours.start_time);
  const shiftEnd = timeToMinutes(workingHours.end_time);
  const lunchStart = workingHours.lunch_start
    ? timeToMinutes(workingHours.lunch_start)
    : null;
  const lunchEnd = workingHours.lunch_end
    ? timeToMinutes(workingHours.lunch_end)
    : null;

  const nowMinutes =
    currentDateTime.getHours() * 60 + currentDateTime.getMinutes();
  const cutoff = nowMinutes + MIN_ADVANCE_MINUTES;

  const busyIntervals = [
    ...appointments
      .filter((a) => !a.status || a.status === "scheduled")
      .map((a) => ({
        start: timeToMinutes(a.start_time),
        end: timeToMinutes(a.end_time),
      })),
    ...blockedPeriods.map((b) => ({
      start: timeToMinutes(b.start_time),
      end: timeToMinutes(b.end_time),
    })),
  ];

  const slots: string[] = [];

  for (
    let slot = shiftStart;
    slot + serviceDuration <= shiftEnd;
    slot += SLOT_INTERVAL
  ) {
    const slotEnd = slot + serviceDuration;

    // Antecedência mínima
    if (slot < cutoff) continue;

    // Sobreposição com almoço
    if (
      lunchStart !== null &&
      lunchEnd !== null &&
      intervalsOverlap(slot, slotEnd, lunchStart, lunchEnd)
    ) {
      continue;
    }

    // Sobreposição com agendamentos ou bloqueios
    const isBusy = busyIntervals.some(({ start, end }) =>
      intervalsOverlap(slot, slotEnd, start, end)
    );
    if (isBusy) continue;

    slots.push(minutesToTime(slot));
  }

  return slots;
}
