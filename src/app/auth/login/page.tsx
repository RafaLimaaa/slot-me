"use client";

import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/Button";
import { Chrome } from "lucide-react";

export default function LoginPage() {
  const { signInWithGoogle, loading } = useAuth();

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8fafc]">
      <div className="w-full max-w-sm bg-white rounded-[20px] shadow-[0_4px_24px_rgba(37,99,235,0.08)] p-8 flex flex-col items-center gap-6">
        <span className="text-2xl font-bold text-[#09090b] tracking-tight">SlotMe</span>
        <p className="text-[#6b7280] text-sm text-center">
          Faça login para acessar o painel do seu negócio.
        </p>
        <Button
          variant="primary"
          size="lg"
          className="w-full"
          loading={loading}
          onClick={signInWithGoogle}
        >
          <Chrome size={18} />
          Continuar com Google
        </Button>
      </div>
    </div>
  );
}
