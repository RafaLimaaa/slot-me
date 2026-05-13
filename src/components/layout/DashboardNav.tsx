"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, CalendarDays, Settings, LogOut } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useBusiness } from "@/hooks/useBusiness";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Painel", icon: LayoutDashboard },
  { href: "/dashboard/agenda", label: "Agenda", icon: CalendarDays },
  { href: "/dashboard/configuracoes", label: "Configurações", icon: Settings },
];

export function DashboardNav() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, signOut } = useAuth();
  const { business } = useBusiness(user?.id);

  const avatarUrl = user?.user_metadata?.avatar_url as string | undefined;
  const fullName = (user?.user_metadata?.full_name as string | undefined) ?? user?.email ?? "";
  const email = user?.email ?? "";
  const initials = fullName
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  async function handleSignOut() {
    await signOut();
    router.push("/auth/login");
  }

  return (
    <aside className="w-[220px] shrink-0 bg-[#0C0C0C] border-r border-[#2A2A2A] flex flex-col h-screen sticky top-0">
      <div className="px-5 py-5 border-b border-[#2A2A2A]">
        <div className="flex flex-col items-center gap-2.5 text-center">
          <div className="relative w-12 h-12 rounded-full overflow-hidden bg-[#1E1E1E] flex items-center justify-center shrink-0">
            {avatarUrl ? (
              <Image src={avatarUrl} alt={fullName} width={48} height={48} className="object-cover" />
            ) : (
              <span className="text-[#C2410C] font-bold text-sm">{initials}</span>
            )}
          </div>
          <div className="min-w-0 w-full">
            <p className="text-[#fafafa] text-sm font-semibold truncate">{fullName}</p>
            <p className="text-[#6B7280] text-[11px] truncate">{email}</p>
          </div>
          {business && (
            <p className="text-[#C2410C] text-[11px] font-medium truncate w-full">
              {business.name}
            </p>
          )}
        </div>
      </div>

      <nav className="flex-1 p-3 flex flex-col gap-0.5">
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 py-2.5 text-sm transition-all duration-150 rounded-r-[8px]
                ${active
                  ? "bg-[#1E1E1E] text-[#fafafa] font-medium"
                  : "text-[#6B7280] hover:text-[#fafafa] hover:bg-[#161616] rounded-[8px]"
                }`}
              style={
                active
                  ? { borderLeft: "2px solid #C2410C", paddingLeft: "10px", paddingRight: "12px" }
                  : { paddingLeft: "12px", paddingRight: "12px" }
              }
            >
              <Icon size={16} />
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="p-3 border-t border-[#2A2A2A]">
        <button
          onClick={handleSignOut}
          className="flex items-center gap-3 px-3 py-2.5 rounded-[8px] text-sm text-[#6B7280] hover:text-[#fafafa] hover:bg-[#161616] w-full transition-all duration-150"
        >
          <LogOut size={16} />
          Sair
        </button>
      </div>
    </aside>
  );
}
