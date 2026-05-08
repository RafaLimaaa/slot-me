import { type HTMLAttributes } from "react";

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "success" | "warning" | "danger";
}

export function Badge({ variant = "default", className = "", children, ...props }: BadgeProps) {
  const variants = {
    default: "bg-[#f1f5f9] text-[#6b7280] dark:bg-[#27272a] dark:text-[#a1a1aa]",
    success: "bg-[#dcfce7] text-[#16a34a]",
    warning: "bg-[#fef9c3] text-[#ca8a04]",
    danger: "bg-[#fee2e2] text-[#DC2626]",
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </span>
  );
}
