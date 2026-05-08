"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, CalendarDays, Settings, LogOut } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Painel", icon: LayoutDashboard },
  { href: "/dashboard/agenda", label: "Agenda", icon: CalendarDays },
  { href: "/dashboard/configuracoes", label: "Configurações", icon: Settings },
];

export function DashboardNav() {
  const pathname = usePathname();
  const { signOut } = useAuth();

  return (
    <aside className="w-56 shrink-0 bg-[#09090b] border-r border-[#27272a] flex flex-col h-screen sticky top-0">
      <div className="px-5 py-5 border-b border-[#27272a]">
        <span className="text-[#fafafa] font-bold text-lg tracking-tight">SlotMe</span>
      </div>

      <nav className="flex-1 p-3 flex flex-col gap-1">
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-[10px] text-sm transition-all duration-150
                ${active
                  ? "bg-[#27272a] text-[#fafafa] font-medium"
                  : "text-[#a1a1aa] hover:text-[#fafafa] hover:bg-[#18181b]"
                }`}
            >
              <Icon size={16} />
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="p-3 border-t border-[#27272a]">
        <button
          onClick={signOut}
          className="flex items-center gap-3 px-3 py-2.5 rounded-[10px] text-sm text-[#a1a1aa] hover:text-[#fafafa] hover:bg-[#18181b] w-full transition-all duration-150"
        >
          <LogOut size={16} /> Sair
        </button>
      </div>
    </aside>
  );
}
