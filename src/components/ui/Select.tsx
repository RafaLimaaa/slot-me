import { type SelectHTMLAttributes, forwardRef } from "react";

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
        <select
          ref={ref}
          id={selectId}
          className={`w-full rounded-[12px] border px-3 py-2.5 text-sm outline-none transition-all
            border-[#e2e8f0] bg-white text-[#09090b]
            focus:border-[#C2410C] focus:ring-2 focus:ring-[#C2410C]/20
            dark:border-[#27272a] dark:bg-[#18181b] dark:text-[#fafafa]
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
        {error && <p className="text-xs text-[#DC2626]">{error}</p>}
      </div>
    );
  }
);

Select.displayName = "Select";
