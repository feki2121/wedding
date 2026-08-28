import Image from "next/image"
import { Reveal, RevealGroup, RevealItem } from "@/components/wedding/reveal"
import { gallery } from "@/lib/wedding-data"

export function PhotoGallery() {
  return (
    <section className="relative px-6 py-24 sm:py-32">
      <Reveal className="mb-14 text-center">
        <p className="font-serif text-xs tracking-[0.3em] text-muted-foreground">لحظاتنا</p>
        <h2 className="mt-3 text-balance font-serif text-3xl text-foreground sm:text-4xl">نظرة على قصتنا</h2>
      </Reveal>

      <RevealGroup className="mx-auto grid max-w-5xl grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-5" stagger={0.08}>
        {gallery.map((photo) => (
          <RevealItem key={photo.src}>
            <div className="group relative aspect-[3/4] overflow-hidden rounded-xl border border-border shadow-sm">
              <Image
                src={photo.src || "/placeholder.svg"}
                alt={photo.alt}
                fill
                sizes="(max-width: 640px) 50vw, 33vw"
                className="object-cover transition duration-700 ease-out group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-foreground/10 via-transparent to-transparent opacity-0 transition group-hover:opacity-100" />
            </div>
          </RevealItem>
        ))}
      </RevealGroup>
    </section>
  )
}
