"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import type { AppointmentWithDetails } from "@/types";

function toISO(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

export function AppointmentChart({ appointments }: { appointments: AppointmentWithDetails[] }) {
  const todayISO = toISO(new Date());
  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - 6 + i);
    return d;
  });
  const data = days.map((d) => {
    const iso = toISO(d);
    return {
      day: d.toLocaleDateString("pt-BR", { weekday: "short" }).replace(".", ""),
      count: appointments.filter((a) => a.date === iso && a.status !== "cancelled").length,
      isToday: iso === todayISO,
    };
  });

  return (
    <div className="bg-[#161616] border border-[#2A2A2A] rounded-[12px] p-5">
      <p className="text-[#fafafa] text-sm font-semibold mb-4">
        Agendamentos nos últimos 7 dias
      </p>
      <ResponsiveContainer width="100%" height={140}>
        <BarChart data={data} barSize={28} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
          <CartesianGrid vertical={false} stroke="#2A2A2A" />
          <XAxis
            dataKey="day"
            tick={{ fill: "#6B7280", fontSize: 11 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            allowDecimals={false}
            tick={{ fill: "#6B7280", fontSize: 11 }}
            axisLine={false}
            tickLine={false}
            width={24}
          />
          <Tooltip
            cursor={{ fill: "rgba(194,65,12,0.06)" }}
            contentStyle={{
              background: "#1E1E1E",
              border: "1px solid #2A2A2A",
              borderRadius: 8,
              color: "#fafafa",
              fontSize: 12,
            }}
            itemStyle={{ color: "#fafafa" }}
            labelStyle={{ color: "#6B7280" }}
          />
          <Bar dataKey="count" name="Agendamentos" radius={[4, 4, 0, 0]}>
            {data.map((entry, i) => (
              <Cell key={i} fill="#C2410C" fillOpacity={entry.isToday ? 1 : 0.55} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
