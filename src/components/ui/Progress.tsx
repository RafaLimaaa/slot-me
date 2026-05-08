interface ProgressProps {
  value: number; // 0-100
  className?: string;
}

export function Progress({ value, className = "" }: ProgressProps) {
  return (
    <div className={`w-full h-1.5 bg-[#e2e8f0] dark:bg-[#27272a] rounded-full overflow-hidden ${className}`}>
      <div
        className="h-full bg-[#2563EB] rounded-full transition-all duration-300 ease-out"
        style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
      />
    </div>
  );
}
