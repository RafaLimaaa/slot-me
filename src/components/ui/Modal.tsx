"use client";

import { useEffect, type ReactNode } from "react";
import { X } from "lucide-react";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
}

export function Modal({ open, onClose, title, children }: ModalProps) {
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70" onClick={onClose} />
      <div
        className="relative w-full max-w-lg rounded-[16px] bg-[#161616] border border-[#2A2A2A] p-6"
        style={{
          boxShadow: "0 0 0 1px rgba(194,65,12,0.25), 0 0 40px rgba(194,65,12,0.12)",
        }}
      >
        <div className="flex items-center justify-between mb-5">
          {title && (
            <h2 className="text-base font-semibold text-[#fafafa]">{title}</h2>
          )}
          <button
            onClick={onClose}
            className="ml-auto text-[#6B7280] hover:text-[#fafafa] transition-colors"
          >
            <X size={18} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
