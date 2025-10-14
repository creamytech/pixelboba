export default function BobaCupIcon({ className = 'w-6 h-6' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Cup body */}
      <path
        d="M7 4L6 20C6 21.1046 6.89543 22 8 22H16C17.1046 22 18 21.1046 18 20L17 4H7Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="currentColor"
        fillOpacity="0.1"
      />
      {/* Cup top/lid */}
      <path d="M5 4H19" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      {/* Straw */}
      <path d="M13 2L12.5 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      {/* Pearls/bubbles */}
      <circle cx="10" cy="16" r="1.5" fill="currentColor" opacity="0.6" />
      <circle cx="14" cy="18" r="1.5" fill="currentColor" opacity="0.6" />
      <circle cx="10" cy="12" r="1.5" fill="currentColor" opacity="0.6" />
      <circle cx="14" cy="14" r="1.5" fill="currentColor" opacity="0.6" />
    </svg>
  );
}
