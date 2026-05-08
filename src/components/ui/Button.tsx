"use client";

import { type ButtonHTMLAttributes, forwardRef } from "react";
import { Loader2 } from "lucide-react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger" | "ghost";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "primary", size = "md", loading, disabled, children, className = "", ...props }, ref) => {
    const base =
      "inline-flex items-center justify-center gap-2 font-medium rounded-[12px] transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB] focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";

    const variants = {
      primary:
        "text-white bg-[linear-gradient(135deg,#1d4ed8,#2563EB,#3b82f6)] bg-[length:200%] hover:shadow-[0_0_16px_rgba(37,99,235,0.4)] active:opacity-90",
      secondary:
        "text-[#09090b] bg-[#f1f5f9] hover:bg-[#e2e8f0] dark:text-[#fafafa] dark:bg-[#27272a] dark:hover:bg-[#3f3f46]",
      danger:
        "text-white bg-[#DC2626] hover:bg-[#b91c1c]",
      ghost:
        "text-[#6b7280] hover:text-[#09090b] hover:bg-[#f1f5f9] dark:hover:text-[#fafafa] dark:hover:bg-[#27272a]",
    };

    const sizes = {
      sm: "text-sm px-3 py-1.5",
      md: "text-sm px-4 py-2.5",
      lg: "text-base px-6 py-3",
    };

    return (
      <button
        ref={ref}
        disabled={disabled ?? loading}
        className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
        {...props}
      >
        {loading && <Loader2 size={16} className="animate-spin" />}
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
