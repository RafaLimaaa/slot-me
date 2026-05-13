import { type InputHTMLAttributes, forwardRef } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className = "", id, ...props }, ref) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, "-");

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label htmlFor={inputId} className="text-sm font-medium text-[#09090b] dark:text-[#fafafa]">
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={`w-full rounded-[12px] border px-3 py-2.5 text-sm outline-none transition-all
            border-[#e2e8f0] bg-white text-[#09090b] placeholder:text-[#6b7280]
            focus:border-[#C2410C] focus:ring-2 focus:ring-[#C2410C]/20
            dark:border-[#27272a] dark:bg-[#18181b] dark:text-[#fafafa]
            disabled:opacity-50
            ${error ? "border-[#DC2626] focus:border-[#DC2626] focus:ring-[#DC2626]/20" : ""}
            ${className}`}
          {...props}
        />
        {error && <p className="text-xs text-[#DC2626]">{error}</p>}
      </div>
    );
  }
);

Input.displayName = "Input";
