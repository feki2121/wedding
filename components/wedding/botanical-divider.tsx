export function BotanicalDivider({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 240 32"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth={1}
      strokeLinecap="round"
      aria-hidden="true"
    >
      <line x1="0" y1="16" x2="95" y2="16" opacity={0.6} />
      <line x1="145" y1="16" x2="240" y2="16" opacity={0.6} />
      <g opacity={0.8}>
        <path d="M120 6c-3 4-3 8 0 10 3-2 3-6 0-10Z" />
        <path d="M108 10c4 1 7 4 8 6-3 1-7-1-9-4Z" />
        <path d="M132 10c-4 1-7 4-8 6 3 1 7-1 9-4Z" />
        <circle cx="120" cy="18" r="2" />
        <path d="M113 20c2 2 4 3 7 3M127 20c-2 2-4 3-7 3" />
      </g>
    </svg>
  )
}
