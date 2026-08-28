import { Reveal } from "@/components/wedding/reveal"
import { SwanMotif } from "@/components/wedding/swan-motif"
import { wedding } from "@/lib/wedding-data"

export function Closing() {
  return (
    <footer className="relative flex flex-col items-center justify-center overflow-hidden px-6 py-28 text-center sm:py-36">
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(circle at 50% 60%, oklch(0.9 0.03 70 / 60%), transparent 65%)",
        }}
      />

      <Reveal>
        <SwanMotif className="mx-auto h-16 w-16 text-primary/70" />
      </Reveal>

      <Reveal delay={0.15}>
        <p className="mt-8 text-balance font-serif text-2xl leading-relaxed text-foreground sm:text-3xl">
          نتشوق لمشاركتكم هذا اليوم الجميل معنا.
        </p>
      </Reveal>

      <Reveal delay={0.3}>
        <p className="mt-6 font-serif text-3xl text-foreground sm:text-4xl">
          {wedding.groomName} &amp; {wedding.brideName}
        </p>
      </Reveal>

      <Reveal delay={0.4} className="mt-3 text-xs tracking-[0.25em] text-muted-foreground">
        {wedding.dateLabel} &middot; {wedding.venueName}
      </Reveal>
    </footer>
  )
}
