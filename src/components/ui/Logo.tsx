interface LogoProps {
  size?: "sm" | "md" | "lg";
  inverted?: boolean;
}

const SIZES = {
  sm: { h: 14, text: "text-base" },
  md: { h: 17, text: "text-xl" },
  lg: { h: 21, text: "text-2xl" },
};

export function Logo({ size = "md", inverted = false }: LogoProps) {
  const { h, text } = SIZES[size];
  const w = (h * 20) / 16;
  const ink = inverted ? "#fafafa" : "#1A1A1A";

  return (
    <span className={`inline-flex items-center gap-2 font-bold tracking-tight select-none ${text}`}>
      <svg width={w} height={h} viewBox="0 0 20 16" fill="none" aria-hidden="true">
        <rect x="0" y="0" width="20" height="4" rx="2" fill={ink} fillOpacity="0.2" />
        <rect x="0" y="6" width="14" height="4" rx="2" fill="#2563EB" />
        <rect x="0" y="12" width="17" height="4" rx="2" fill={ink} fillOpacity="0.2" />
      </svg>
      <span style={{ color: ink }}>SlotMe</span>
    </span>
  );
}
