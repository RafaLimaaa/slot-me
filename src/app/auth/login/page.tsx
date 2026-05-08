"use client";

import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/Button";

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true">
      <path fill="#4285F4" d="M47.5 24.5c0-1.6-.1-3.1-.4-4.6H24v8.7h13.2c-.6 3-2.3 5.5-4.9 7.2v6h7.9c4.6-4.3 7.3-10.6 7.3-17.3z"/>
      <path fill="#34A853" d="M24 48c6.5 0 11.9-2.1 15.9-5.8l-7.9-6c-2.1 1.4-4.8 2.3-8 2.3-6.1 0-11.3-4.1-13.2-9.7H2.7v6.2C6.7 42.7 14.8 48 24 48z"/>
      <path fill="#FBBC05" d="M10.8 28.8A14.9 14.9 0 0 1 10 24c0-1.7.3-3.3.8-4.8v-6.2H2.7A24 24 0 0 0 0 24c0 3.9.9 7.5 2.7 10.8l8.1-6z"/>
      <path fill="#EA4335" d="M24 9.5c3.5 0 6.6 1.2 9 3.5l6.7-6.7C35.9 2.4 30.5 0 24 0 14.8 0 6.7 5.3 2.7 13.2l8.1 6.2C12.7 13.6 17.9 9.5 24 9.5z"/>
    </svg>
  );
}

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
          <GoogleIcon />
          Continuar com Google
        </Button>
      </div>
    </div>
  );
}
