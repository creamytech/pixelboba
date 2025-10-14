export default function BubbleMessageIcon({ className = 'w-6 h-6' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Message bubble */}
      <path
        d="M21 11.5C21 16.75 16.97 21 12 21C10.5 21 9.09 20.66 7.85 20.05L3 21L4.05 16.85C3.34 15.54 3 14.06 3 12.5C3 7.25 7.03 3 12 3C16.97 3 21 7.25 21 11.5Z"
        stroke="currentColor"
        strokeWidth="1.5"
        fill="currentColor"
        fillOpacity="0.05"
      />
      {/* Pearls/dots as message indicators */}
      <circle cx="9" cy="11.5" r="1.5" fill="currentColor" opacity="0.6" />
      <circle cx="12" cy="11.5" r="1.5" fill="currentColor" opacity="0.6" />
      <circle cx="15" cy="11.5" r="1.5" fill="currentColor" opacity="0.6" />
      {/* Small bubbles floating up */}
      <circle cx="18" cy="6" r="1" fill="currentColor" opacity="0.3" />
      <circle cx="16" cy="4" r="0.8" fill="currentColor" opacity="0.25" />
    </svg>
  );
}
