import { Reveal } from "@/components/wedding/reveal"
import { BotanicalDivider } from "@/components/wedding/botanical-divider"
import { wedding } from "@/lib/wedding-data"

function formatCalendarDate(date: Date) {
  return date.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z"
}

export function DateVenue() {
  const start = wedding.date
  const end = new Date(start.getTime() + 4 * 60 * 60 * 1000)
  const calendarUrl = `https://www.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
    `${wedding.groomName} & ${wedding.brideName}'s Wedding`,
  )}&dates=${formatCalendarDate(start)}/${formatCalendarDate(end)}&location=${encodeURIComponent(
    wedding.venueAddress,
  )}&details=${encodeURIComponent(wedding.greeting)}`

  const mapEmbedSrc = `https://maps.google.com/maps?q=${encodeURIComponent(
    wedding.mapsEmbedQuery,
  )}&z=13&output=embed`

  const day = start.getDate()
  const month = start.toLocaleDateString("ar", { month: "long" })
  const weekday = start.toLocaleDateString("ar", { weekday: "long" })
  const year = start.getFullYear()

  return (
    <section className="relative px-6 py-24 sm:py-32">
      <Reveal className="mb-14 text-center">
        <p className="font-serif text-xs tracking-[0.3em] text-muted-foreground">احفظوا الموعد</p>
        <h2 className="mt-3 text-balance font-serif text-3xl text-foreground sm:text-4xl">الزمان والمكان</h2>
      </Reveal>

      <div className="mx-auto grid max-w-4xl gap-8 sm:grid-cols-2">
        <Reveal className="flex flex-col items-center rounded-2xl border border-border bg-card px-8 py-10 text-center shadow-sm">
          <div className="w-full max-w-[220px] overflow-hidden rounded-xl border border-border shadow-sm">
            <div className="bg-primary px-4 py-2 text-center">
              <span className="text-xs font-medium uppercase tracking-[0.3em] text-primary-foreground">
                {month}
              </span>
            </div>
            <div className="flex flex-col items-center gap-1 bg-popover px-4 py-6">
              <span className="font-serif text-6xl text-foreground">{day}</span>
              <span className="text-sm uppercase tracking-[0.25em] text-muted-foreground">
                {weekday}
              </span>
              <span className="text-xs text-muted-foreground">{year}</span>
            </div>
          </div>
          <a
            href={calendarUrl}
            target="_blank"
            rel="noreferrer"
            className="mt-6 inline-flex items-center gap-2 rounded-full border border-border bg-secondary px-6 py-2.5 text-xs font-medium tracking-[0.15em] text-secondary-foreground transition hover:bg-accent"
          >
            إضافة إلى التقويم
          </a>
        </Reveal>

        <Reveal delay={0.15} className="flex flex-col rounded-2xl border border-border bg-card p-3 shadow-sm">
          <div className="aspect-[4/3] w-full overflow-hidden rounded-xl">
            <iframe
              title="خريطة موقع القاعة"
              src={mapEmbedSrc}
              className="h-full w-full border-0"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
          <div className="px-3 py-5 text-center">
            <p className="font-serif text-lg text-foreground">{wedding.venueName}</p>
            <p className="mt-1 text-sm text-muted-foreground">{wedding.venueAddress}</p>
            <BotanicalDivider className="mx-auto mt-4 h-5 w-24 text-muted-foreground/60" />
          </div>
        </Reveal>
      </div>
    </section>
  )
}
