import { Reveal } from "@/components/wedding/reveal"
import { SwanMotif } from "@/components/wedding/swan-motif"
import { BotanicalDivider } from "@/components/wedding/botanical-divider"
import { wedding } from "@/lib/wedding-data"

export function InvitationMessage() {
  return (
    <section className="relative flex flex-col items-center px-6 py-24 sm:py-32">
      <Reveal className="w-full max-w-xl">
        <div className="relative rounded-2xl border border-border bg-card px-8 py-14 text-center shadow-[0_30px_60px_-30px_oklch(0.4_0.03_50_/_30%)] sm:px-14">
          <SwanMotif className="mx-auto h-14 w-14 text-primary/70" />
          <p className="mt-8 font-serif text-2xl leading-relaxed text-foreground sm:text-3xl">
            {wedding.greeting}
          </p>
          <BotanicalDivider className="mx-auto mt-8 h-6 w-32 text-muted-foreground/60" />
          <p className="mt-8 text-base leading-relaxed text-muted-foreground">
            {wedding.welcomeMessage}
          </p>
        </div>
      </Reveal>
    </section>
  )
}
