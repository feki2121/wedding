export function SwanMotif({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 200 200"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {/* decorative ribbon border */}
      <circle cx="100" cy="100" r="92" strokeDasharray="1.5 5" opacity={0.55} />
      <circle cx="100" cy="100" r="80" opacity={0.4} />

      {/* left swan */}
      <path d="M60 118c-10-6-16-16-14-27 2-10 11-17 20-15 6 1 10 5 11 10 6-14 22-19 32-10 9 8 8 22-2 31-9 8-24 15-38 15-3 0-6-2-9-4Z" />
      <path d="M62 92c3-6 9-10 15-9" />
      <circle cx="66" cy="88" r="1.4" fill="currentColor" stroke="none" />

      {/* right swan (mirrored) */}
      <path d="M140 118c10-6 16-16 14-27-2-10-11-17-20-15-6 1-10 5-11 10-6-14-22-19-32-10-9 8-8 22 2 31 9 8 24 15 38 15 3 0 6-2 9-4Z" />
      <path d="M138 92c-3-6-9-10-15-9" />
      <circle cx="134" cy="88" r="1.4" fill="currentColor" stroke="none" />

      {/* heart formed between necks */}
      <path d="M100 128c-10-10-10-22-2-27 6-4 13-1 15 5 2-6 9-9 15-5 8 5 8 17-2 27l-13 12Z" opacity={0.75} />
    </svg>
  )
}
