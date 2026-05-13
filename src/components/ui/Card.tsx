import { type HTMLAttributes } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  hoverable?: boolean;
}

export function Card({ hoverable, className = "", children, ...props }: CardProps) {
  const base = "rounded-[12px] border border-transparent transition-shadow duration-200";
  const hover = hoverable
    ? "cursor-pointer hover:shadow-[0_0_0_1px_#C2410C,0_0_16px_rgba(194,65,12,0.2)]"
    : "";

  return (
    <div className={`${base} ${hover} ${className}`} {...props}>
      {children}
    </div>
  );
}
