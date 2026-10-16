export default function Logo({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={className} role="img" aria-label="Scuderia Ferrari">
      <rect width="64" height="64" rx="14" fill="#D00000" />
      <path d="M14 14h6v36h-6z" fill="#FFFFFF" opacity=".9" />
      <text
        x="40"
        y="43"
        textAnchor="middle"
        fontFamily="var(--font-montserrat), Montserrat, Arial Black, sans-serif"
        fontWeight="900"
        fontSize="26"
        fill="#FFFFFF"
        letterSpacing="-1"
      >
        SF
      </text>
    </svg>
  );
}
