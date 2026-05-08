import { type ReactNode } from "react";
import { DashboardNav } from "@/components/layout/DashboardNav";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen bg-[#09090b]">
      <DashboardNav />
      <main className="flex-1 p-8 overflow-auto">{children}</main>
    </div>
  );
}
