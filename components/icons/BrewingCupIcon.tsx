export default function BrewingCupIcon({
  fillLevel = 50,
  className = 'w-24 h-24',
}: {
  fillLevel?: number;
  className?: string;
}) {
  // Ensure fill level is between 0 and 100
  const level = Math.max(0, Math.min(100, fillLevel));
  // Convert to y-position (inverted because SVG y goes down)
  const fillY = 4 + ((100 - level) / 100) * 16; // Cup starts at y=4, goes to y=20

  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Cup outline */}
      <path
        d="M7 4L6 20C6 21.1046 6.89543 22 8 22H16C17.1046 22 18 21.1046 18 20L17 4H7Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />

      {/* Liquid fill (gradient from taro to matcha) */}
      <defs>
        <linearGradient id={`liquid-gradient-${level}`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#A78BFA" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#84CC16" stopOpacity="0.2" />
        </linearGradient>
      </defs>
      <path
        d={`M7 ${fillY}L6 20C6 21.1046 6.89543 22 8 22H16C17.1046 22 18 21.1046 18 20L17 ${fillY}Z`}
        fill={`url(#liquid-gradient-${level})`}
      />

      {/* Lid */}
      <path d="M5 4H19" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />

      {/* Straw */}
      <path
        d="M13 2L12.5 ${fillY - 2}"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />

      {/* Pearls at bottom (only show if fill > 20%) */}
      {level > 20 && (
        <>
          <circle cx="9" cy="19" r="1.5" fill="currentColor" opacity="0.4" />
          <circle cx="12" cy="20" r="1.5" fill="currentColor" opacity="0.4" />
          <circle cx="15" cy="19" r="1.5" fill="currentColor" opacity="0.4" />
        </>
      )}

      {/* Bubbles rising (only show if fill > 30%) */}
      {level > 30 && (
        <>
          <circle cx="10" cy={fillY + 3} r="1" fill="currentColor" opacity="0.25" />
          <circle cx="14" cy={fillY + 4} r="0.8" fill="currentColor" opacity="0.2" />
        </>
      )}
    </svg>
  );
}
