"use client";

import Link from "next/link";
import { type ButtonHTMLAttributes, forwardRef } from "react";
import { Loader2 } from "lucide-react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger" | "ghost";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
  href?: string;
  target?: string;
  rel?: string;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "primary", size = "md", loading, disabled, children, className = "", href, target, rel, ...props }, ref) => {
    const base =
      "inline-flex items-center justify-center gap-2 font-medium rounded-[12px] transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C2410C] focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";

    const variants = {
      primary:
        "text-white bg-[linear-gradient(135deg,#9a3412,#C2410C,#ea580c)] bg-[length:200%] hover:shadow-[0_0_16px_rgba(194,65,12,0.4)] active:opacity-90",
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

    const cls = `${base} ${variants[variant]} ${sizes[size]} ${className}`;
    const inner = <>{loading && <Loader2 size={16} className="animate-spin" />}{children}</>;

    if (href) {
      if (/^https?:\/\//.test(href)) {
        return <a href={href} target={target} rel={rel} className={cls}>{inner}</a>;
      }
      return <Link href={href} target={target} rel={rel} className={cls}>{inner}</Link>;
    }

    return (
      <button ref={ref} disabled={disabled ?? loading} className={cls} {...props}>
        {inner}
      </button>
    );
  }
);

Button.displayName = "Button";
