'use client';

export default function PearlPattern({
  className = '',
  density = 'medium',
  opacity = 0.4,
}: {
  className?: string;
  density?: 'low' | 'medium' | 'high';
  opacity?: number;
}) {
  const densityMap = {
    low: 40,
    medium: 30,
    high: 20,
  };

  const spacing = densityMap[density];

  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern
            id="pearl-pattern"
            x="0"
            y="0"
            width={spacing}
            height={spacing}
            patternUnits="userSpaceOnUse"
          >
            {/* Main pearl */}
            <circle cx={spacing / 2} cy={spacing / 2} r="2" fill="currentColor" opacity={opacity} />
            {/* Smaller accent pearls */}
            <circle
              cx={spacing / 4}
              cy={spacing / 4}
              r="1"
              fill="currentColor"
              opacity={opacity * 0.5}
            />
            <circle
              cx={(spacing * 3) / 4}
              cy={(spacing * 3) / 4}
              r="1"
              fill="currentColor"
              opacity={opacity * 0.5}
            />
          </pattern>
        </defs>
        <rect x="0" y="0" width="100%" height="100%" fill="url(#pearl-pattern)" />
      </svg>
    </div>
  );
}
