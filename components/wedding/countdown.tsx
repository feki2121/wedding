"use client"

import { useEffect, useState } from "react"
import { Reveal, RevealGroup, RevealItem } from "@/components/wedding/reveal"
import { wedding } from "@/lib/wedding-data"

function getTimeLeft() {
  const diff = wedding.date.getTime() - Date.now()
  const clamped = Math.max(diff, 0)
  return {
    days: Math.floor(clamped / (1000 * 60 * 60 * 24)),
    hours: Math.floor((clamped / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((clamped / (1000 * 60)) % 60),
    seconds: Math.floor((clamped / 1000) % 60),
  }
}

export function Countdown() {
  const [time, setTime] = useState<ReturnType<typeof getTimeLeft> | null>(null)

  useEffect(() => {
    setTime(getTimeLeft())
    const id = setInterval(() => setTime(getTimeLeft()), 1000)
    return () => clearInterval(id)
  }, [])

  const units = [
    { label: "يوم", value: time?.days },
    { label: "ساعة", value: time?.hours },
    { label: "دقيقة", value: time?.minutes },
    { label: "ثانية", value: time?.seconds },
  ]

  return (
    <section className="relative px-6 py-24 sm:py-32">
      <Reveal className="mb-14 text-center">
        <p className="font-serif text-xs tracking-[0.3em] text-muted-foreground">العد التنازلي إلى</p>
        <h2 className="mt-3 text-balance font-serif text-3xl text-foreground sm:text-4xl">يوم زفافنا</h2>
      </Reveal>

      <RevealGroup className="mx-auto grid max-w-2xl grid-cols-4 gap-3 sm:gap-6" stagger={0.1}>
        {units.map((unit) => (
          <RevealItem key={unit.label}>
            <div className="flex flex-col items-center justify-center rounded-xl border border-border bg-card px-2 py-6 shadow-sm sm:px-4 sm:py-8">
              <span className="font-serif text-3xl tabular-nums text-foreground sm:text-5xl" aria-live="polite">
                {unit.value !== undefined ? String(unit.value).padStart(2, "0") : "--"}
              </span>
              <span className="mt-2 text-[10px] tracking-[0.2em] text-muted-foreground sm:text-xs">
                {unit.label}
              </span>
            </div>
          </RevealItem>
        ))}
      </RevealGroup>
    </section>
  )
}
