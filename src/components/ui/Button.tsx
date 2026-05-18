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
      "inline-flex items-center justify-center gap-2 font-medium rounded-[12px] transition-all duration-[220ms] ease-out focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C2410C] focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";

    const variants = {
      primary: [
        "relative overflow-hidden",
        "text-[#F5F0E8]",
        "bg-[radial-gradient(ellipse_at_50%_40%,#D95518_0%,#9A3412_60%,#7C2A10_100%)]",
        "border border-[rgba(120,30,5,0.6)]",
        "shadow-[0_2px_8px_rgba(120,30,5,0.40),inset_0_1px_0_rgba(255,200,150,0.20),inset_0_-1px_0_rgba(0,0,0,0.20)]",
        "hover:bg-[radial-gradient(ellipse_at_50%_40%,#E8611E_0%,#B03D16_60%,#8C2A0E_100%)]",
        "hover:shadow-[0_6px_24px_rgba(120,30,5,0.55),inset_0_1px_0_rgba(255,200,150,0.25),inset_0_-1px_0_rgba(0,0,0,0.25)]",
        "hover:-translate-y-px active:translate-y-0",
        "before:content-[''] before:absolute before:inset-x-0 before:top-0 before:h-1/2",
        "before:bg-gradient-to-b before:from-white/[0.08] before:to-transparent before:pointer-events-none",
      ].join(" "),
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
