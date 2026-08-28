"use client"

import { motion } from "framer-motion"
import { Reveal } from "@/components/wedding/reveal"
import { BotanicalDivider } from "@/components/wedding/botanical-divider"
import { wedding } from "@/lib/wedding-data"

export function CoupleIntro() {
  return (
    <section className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 py-24 text-center">
      {/* background photograph */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url(/hero-background.png)" }}
        role="img"
        aria-label="قصر مزين بالنجف الكريستالي وأشجار النخيل عند الغسق"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-background/55 via-background/35 to-background/80" />
      <motion.div
        className="pointer-events-none absolute inset-0"
        style={{
          background: "radial-gradient(circle at 50% 35%, oklch(0.93 0.02 70 / 55%), transparent 65%)",
        }}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.6 }}
      />

      <div className="relative z-10 flex flex-col items-center">
        <Reveal>
          <p className="mb-6 font-serif text-xs tracking-[0.3em] text-muted-foreground text-shadow-soft">
            يسعدنا زفافنا
          </p>
        </Reveal>

        <Reveal delay={0.15}>
          <h1 className="flex flex-col items-center gap-1 text-balance font-serif leading-none text-foreground text-shadow-soft">
            <span className="text-6xl sm:text-8xl">{wedding.groomName}</span>
            <span className="my-2 text-xl text-accent-foreground/70 sm:text-2xl">&amp;</span>
            <span className="text-6xl sm:text-8xl">{wedding.brideName}</span>
          </h1>
        </Reveal>

        <Reveal delay={0.32} className="mt-10 flex flex-col items-center gap-4">
          <BotanicalDivider className="h-6 w-40 text-muted-foreground/70" />
          <p className="text-sm tracking-[0.25em] text-muted-foreground text-shadow-soft">{wedding.dateLabel}</p>
        </Reveal>
      </div>

      <motion.div
        className="absolute bottom-10 flex flex-col items-center gap-2 text-muted-foreground"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.8, duration: 1 }}
      >
        <span className="text-[10px] tracking-[0.25em]">مرر للأسفل</span>
        <motion.span
          className="h-8 w-px bg-border"
          animate={{ scaleY: [0.4, 1, 0.4] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
          style={{ transformOrigin: "top" }}
        />
      </motion.div>
    </section>
  )
}
