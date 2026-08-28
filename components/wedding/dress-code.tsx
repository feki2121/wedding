import { Reveal, RevealGroup, RevealItem } from "@/components/wedding/reveal"
import { BotanicalDivider } from "@/components/wedding/botanical-divider"
import { dressCodePalette } from "@/lib/wedding-data"

export function DressCode() {
  return (
    <section className="relative px-6 py-24 sm:py-32">
      <Reveal className="mx-auto max-w-lg text-center">
        <p className="font-serif text-xs tracking-[0.3em] text-muted-foreground">قواعد اللباس</p>
        <h2 className="mt-3 text-balance font-serif text-3xl text-foreground sm:text-4xl">أناقة راقية</h2>
        <p className="mt-6 text-base leading-relaxed text-muted-foreground">
          نتشرف بدعوتكم لارتداء ألوان ناعمة ودافئة تحاكي حديقة في نهاية الصيف. نقترح أقمشة
          متدفقة وبدلات أنيقة وأزياء راقية تناسب سهرة في الهواء الطلق.
        </p>
        <BotanicalDivider className="mx-auto mt-8 h-6 w-32 text-muted-foreground/60" />
      </Reveal>

      <RevealGroup className="mx-auto mt-10 flex max-w-md flex-wrap items-center justify-center gap-6" stagger={0.08}>
        {dressCodePalette.map((color) => (
          <RevealItem key={color.hex} className="flex flex-col items-center gap-2">
            <span
              className="h-12 w-12 rounded-full border border-border shadow-sm"
              style={{ backgroundColor: color.hex }}
              aria-hidden="true"
            />
            <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
              {color.name}
            </span>
          </RevealItem>
        ))}
      </RevealGroup>
    </section>
  )
}
