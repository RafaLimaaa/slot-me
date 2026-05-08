"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface CalendarProps {
  selected: string | null;
  onSelect: (date: string) => void;
  disabledDates?: string[];
  minDate?: string;
}

const DAYS = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
const MONTHS = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro",
];

export function Calendar({ selected, onSelect, disabledDates = [], minDate }: CalendarProps) {
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const min = minDate ?? today.toISOString().slice(0, 10);

  function prevMonth() {
    if (month === 0) { setYear(y => y - 1); setMonth(11); }
    else setMonth(m => m - 1);
  }

  function nextMonth() {
    if (month === 11) { setYear(y => y + 1); setMonth(0); }
    else setMonth(m => m + 1);
  }

  function toISO(day: number) {
    return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
  }

  return (
    <div className="w-full max-w-sm">
      <div className="flex items-center justify-between mb-4">
        <button onClick={prevMonth} className="p-1.5 rounded-[8px] hover:bg-[#f1f5f9] transition-colors">
          <ChevronLeft size={18} className="text-[#6b7280]" />
        </button>
        <span className="text-sm font-semibold text-[#09090b]">
          {MONTHS[month]} {year}
        </span>
        <button onClick={nextMonth} className="p-1.5 rounded-[8px] hover:bg-[#f1f5f9] transition-colors">
          <ChevronRight size={18} className="text-[#6b7280]" />
        </button>
      </div>

      <div className="grid grid-cols-7 mb-2">
        {DAYS.map((d) => (
          <div key={d} className="text-center text-xs font-medium text-[#6b7280] py-1">
            {d}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-y-1">
        {Array.from({ length: firstDay }).map((_, i) => <div key={`e-${i}`} />)}
        {Array.from({ length: daysInMonth }).map((_, i) => {
          const day = i + 1;
          const iso = toISO(day);
          const isSelected = iso === selected;
          const isDisabled = iso < min || disabledDates.includes(iso);

          return (
            <button
              key={day}
              disabled={isDisabled}
              onClick={() => onSelect(iso)}
              className={`mx-auto w-9 h-9 rounded-full text-sm transition-all duration-150
                ${isSelected
                  ? "bg-[#2563EB] text-white font-semibold"
                  : isDisabled
                    ? "text-[#d1d5db] cursor-not-allowed"
                    : "text-[#09090b] hover:bg-[#eff6ff] hover:text-[#2563EB]"
                }`}
            >
              {day}
            </button>
          );
        })}
      </div>
    </div>
  );
}
