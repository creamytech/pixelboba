export default function StrawEyeIcon({ className = 'w-6 h-6' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Straw */}
      <path d="M12 2L11 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      {/* Eye shape */}
      <path
        d="M12 14C14.5 14 17 15.5 17 17C17 18.5 14.5 20 12 20C9.5 20 7 18.5 7 17C7 15.5 9.5 14 12 14Z"
        stroke="currentColor"
        strokeWidth="1.5"
        fill="currentColor"
        fillOpacity="0.1"
      />
      {/* Pupil */}
      <circle cx="12" cy="17" r="2" fill="currentColor" />
      <circle cx="12.5" cy="16.5" r="0.8" fill="white" />
      {/* Pearls around straw */}
      <circle cx="9" cy="10" r="1" fill="currentColor" opacity="0.3" />
      <circle cx="15" cy="12" r="1" fill="currentColor" opacity="0.3" />
    </svg>
  );
}
