"use client"

import { useEffect, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { EnvelopeGate } from "@/components/wedding/envelope-gate"
import { CoupleIntro } from "@/components/wedding/couple-intro"
import { InvitationMessage } from "@/components/wedding/invitation-message"
import { DateVenue } from "@/components/wedding/date-venue"
import { Countdown } from "@/components/wedding/countdown"
import { PhotoGallery } from "@/components/wedding/photo-gallery"
// import { DressCode } from "@/components/wedding/dress-code"
import { Closing } from "@/components/wedding/closing"

export default function Page() {
  const [isOpened, setIsOpened] = useState(false)
  const [gateGone, setGateGone] = useState(false)

  useEffect(() => {
    document.body.style.overflow = gateGone ? "" : "hidden"
    return () => {
      document.body.style.overflow = ""
    }
  }, [gateGone])

  return (
    <main className="relative">
      <AnimatePresence
        onExitComplete={() => {
          // Unlock scroll only once the envelope has fully left and the intro has faded in.
          setGateGone(true)
        }}
      >
        {!isOpened && <EnvelopeGate key="envelope" onOpen={() => setIsOpened(true)} />}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={isOpened ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
        transition={{ duration: 0.9, delay: isOpened ? 0.25 : 0, ease: [0.22, 1, 0.36, 1] }}
      >
        <InvitationMessage />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={isOpened ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
        transition={{ duration: 0.9, delay: isOpened ? 1.0 : 0, ease: [0.22, 1, 0.36, 1] }}
      >
        <CoupleIntro />
        <DateVenue />
        <Countdown />
        <PhotoGallery />
        {/* <DressCode /> */}
        <Closing />
      </motion.div>
    </main>
  )
}
