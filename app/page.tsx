"use client"

import { useEffect, useState, useRef } from "react"
import { AnimatePresence, motion, useReducedMotion } from "framer-motion"
import { EnvelopeGate } from "@/components/wedding/envelope-gate"
import { CoupleIntro } from "@/components/wedding/couple-intro"
import { InvitationMessage } from "@/components/wedding/invitation-message"
import { DateVenue } from "@/components/wedding/date-venue"
import { Countdown } from "@/components/wedding/countdown"
import { Closing } from "@/components/wedding/closing"

const EASE = [0.22, 1, 0.36, 1] as const

// Délais en cascade pour chaque section
const REVEAL_DELAYS = {
  coupleIntro: 0.9,
  invitation: 1.1,
  dateVenue: 1.3,
  countdown: 1.5,
  closing: 1.7,
}

export default function Page() {
  const [isOpened, setIsOpened] = useState(false)
  const [gateGone, setGateGone] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const shouldReduceMotion = useReducedMotion()

  // Blocage / libération du scroll
  useEffect(() => {
    document.body.style.overflow = gateGone ? "" : "hidden"
    return () => {
      document.body.style.overflow = ""
    }
  }, [gateGone])

  // Scroll auto vers la première section après ouverture
  useEffect(() => {
    if (isOpened && gateGone && containerRef.current) {
      // Laisse le temps au contenu de se monter puis scrolle doucement
      const timer = setTimeout(() => {
        containerRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })
      }, 200)
      return () => clearTimeout(timer)
    }
  }, [isOpened, gateGone])

  // Animation de base pour chaque section
  const sectionMotion = (delay: number) => ({
    initial: { opacity: 0, y: shouldReduceMotion ? 0 : 40, filter: "blur(8px)" },
    animate: isOpened
      ? { opacity: 1, y: 0, filter: "blur(0px)" }
      : { opacity: 0, y: shouldReduceMotion ? 0 : 40, filter: "blur(8px)" },
    transition: {
      duration: 0.9,
      delay: isOpened ? delay : 0,
      ease: EASE,
    },
  })

  return (
    <main ref={containerRef} className="relative">
      {/* ============================================================
          ENVELOPPE
          ============================================================ */}
      <AnimatePresence
        onExitComplete={() => {
          setGateGone(true)
        }}
      >
        {!isOpened && <EnvelopeGate key="envelope" onOpen={() => setIsOpened(true)} />}
      </AnimatePresence>

      {/* ============================================================
          CONTENU PRINCIPAL
          Chaque section apparaît en cascade après l'ouverture
          ============================================================ */}
      <div className="relative">
        {/* Section 1 : CoupleIntro */}
        <motion.div {...sectionMotion(REVEAL_DELAYS.coupleIntro)}>
          <CoupleIntro />
        </motion.div>

        {/* Section 2 : InvitationMessage */}
        <motion.div {...sectionMotion(REVEAL_DELAYS.invitation)}>
          <InvitationMessage />
        </motion.div>

        {/* Section 3 : Date & Venue */}
        <motion.div {...sectionMotion(REVEAL_DELAYS.dateVenue)}>
          <DateVenue />
        </motion.div>

        {/* Section 4 : Countdown */}
        <motion.div {...sectionMotion(REVEAL_DELAYS.countdown)}>
          <Countdown />
        </motion.div>

        {/* Section 5 : Closing */}
        <motion.div {...sectionMotion(REVEAL_DELAYS.closing)}>
          <Closing />
        </motion.div>
      </div>

      {/* ============================================================
          EFFET DE LUEUR EN HAUT DE PAGE (décoratif)
          ============================================================ */}
      <div
        className="pointer-events-none fixed inset-x-0 top-0 h-32 z-40"
        style={{
          background: `linear-gradient(
            180deg,
            oklch(0.97 0.015 85 / 60%) 0%,
            transparent 100%
          )`,
          opacity: gateGone ? 1 : 0,
          transition: "opacity 0.8s ease",
        }}
      />
    </main>
  )
}