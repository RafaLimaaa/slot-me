import { type SelectHTMLAttributes, forwardRef } from "react";
import { ChevronDown } from "lucide-react";

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: { value: string | number; label: string }[];
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, options, className = "", id, ...props }, ref) => {
    const selectId = id ?? label?.toLowerCase().replace(/\s+/g, "-");

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label htmlFor={selectId} className="text-sm font-medium text-[#09090b] dark:text-[#fafafa]">
            {label}
          </label>
        )}
        <div className="relative">
          <select
            ref={ref}
            id={selectId}
            className={`w-full appearance-none rounded-[12px] border px-3 py-2.5 pr-8 text-sm outline-none transition-all
              border-[#e2e8f0] bg-white text-[#09090b]
              focus:border-[#C2410C] focus:ring-2 focus:ring-[#C2410C]/20
              dark:border-[#2A2A2A] dark:bg-[#1E1E1E] dark:text-[#F5F0E8]
              disabled:opacity-50
              ${error ? "border-[#DC2626]" : ""}
              ${className}`}
            {...props}
          >
            {options.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
          <ChevronDown
            size={14}
            className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-[#6b7280] dark:text-[#4B5563]"
          />
        </div>
        {error && <p className="text-xs text-[#DC2626]">{error}</p>}
      </div>
    );
  }
);

Select.displayName = "Select";
