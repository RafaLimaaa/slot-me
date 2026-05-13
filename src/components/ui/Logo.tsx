interface LogoProps {
  size?: "sm" | "md" | "lg";
  inverted?: boolean;
}

const SIZES = {
  sm: { h: 14, text: "text-base" },
  md: { h: 18, text: "text-xl" },
  lg: { h: 22, text: "text-2xl" },
};

export function Logo({ size = "md", inverted = false }: LogoProps) {
  const { h, text } = SIZES[size];
  const w = Math.round(h * 0.9);
  const ink = inverted ? "#fafafa" : "#1A1A1A";

  return (
    <span className={`inline-flex items-center gap-2 font-bold tracking-tight select-none ${text}`}>
      <svg width={w} height={h} viewBox="0 0 18 22" fill="none" aria-hidden="true">
        {/* Top block — left-aligned, 12 wide */}
        <rect x="0" y="0" width="12" height="6" rx="1.5" fill="#C2410C" />
        {/* Bottom block — right-aligned, offset by 6 */}
        <rect x="6" y="16" width="12" height="6" rx="1.5" fill="#C2410C" />
        {/* Connector — thin middle stroke linking the two */}
        <rect x="5" y="7" width="2" height="8" rx="1" fill={ink} fillOpacity="0.18" />
      </svg>
      <span style={{ color: ink }}>SlotMe</span>
    </span>
  );
}
