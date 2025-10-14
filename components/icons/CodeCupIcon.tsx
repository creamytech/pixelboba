export default function CodeCupIcon({ className = 'w-6 h-6' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Cup outline */}
      <path
        d="M7 4L6 20C6 21.1046 6.89543 22 8 22H16C17.1046 22 18 21.1046 18 20L17 4H7Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="currentColor"
        fillOpacity="0.05"
      />
      {/* Code brackets inside cup */}
      <path
        d="M10 10L8.5 12L10 14"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M14 10L15.5 12L14 14"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Slash */}
      <path d="M13 10L11 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      {/* Lid */}
      <path d="M5 4H19" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      {/* Pearls at bottom */}
      <circle cx="9" cy="18" r="1" fill="currentColor" opacity="0.4" />
      <circle cx="12" cy="19" r="1" fill="currentColor" opacity="0.4" />
      <circle cx="15" cy="18" r="1" fill="currentColor" opacity="0.4" />
    </svg>
  );
}
