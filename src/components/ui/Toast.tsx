"use client";

import { useEffect, useState } from "react";
import { CheckCircle, XCircle, X } from "lucide-react";

export interface ToastData {
  id: string;
  message: string;
  type: "success" | "error";
}

interface ToastProps {
  toast: ToastData;
  onDismiss: (id: string) => void;
}

export function Toast({ toast, onDismiss }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(() => onDismiss(toast.id), 4000);
    return () => clearTimeout(timer);
  }, [toast.id, onDismiss]);

  const icon =
    toast.type === "success" ? (
      <CheckCircle size={16} className="text-[#16a34a] shrink-0" />
    ) : (
      <XCircle size={16} className="text-[#DC2626] shrink-0" />
    );

  return (
    <div className="flex items-center gap-3 bg-white dark:bg-[#18181b] border border-[#e2e8f0] dark:border-[#27272a] rounded-[12px] px-4 py-3 shadow-[0_4px_24px_rgba(194,65,12,0.08)] min-w-[280px] max-w-[360px]">
      {icon}
      <p className="text-sm text-[#09090b] dark:text-[#fafafa] flex-1">{toast.message}</p>
      <button onClick={() => onDismiss(toast.id)} className="text-[#6b7280] hover:text-[#09090b] dark:hover:text-[#fafafa]">
        <X size={14} />
      </button>
    </div>
  );
}

interface ToastContainerProps {
  toasts: ToastData[];
  onDismiss: (id: string) => void;
}

export function ToastContainer({ toasts, onDismiss }: ToastContainerProps) {
  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2">
      {toasts.map((t) => (
        <Toast key={t.id} toast={t} onDismiss={onDismiss} />
      ))}
    </div>
  );
}

export function useToast() {
  const [toasts, setToasts] = useState<ToastData[]>([]);

  function addToast(message: string, type: ToastData["type"] = "success") {
    const id = Math.random().toString(36).slice(2);
    setToasts((prev) => [...prev, { id, message, type }]);
  }

  function dismiss(id: string) {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }

  return { toasts, addToast, dismiss };
}
