"use client"

import { useEffect, useState, useRef } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { SwanMotif } from "@/components/wedding/swan-motif"
import { InvitationMessage } from "@/components/wedding/invitation-message"

type Phase = "idle" | "sealCrack" | "sealBreak" | "unfold" | "reveal" | "float" | "fade" | "done"

const EASE = [0.22, 1, 0.36, 1] as const
const SEAL_Y = 46

const DURATIONS = {
  sealCrack: 380,
  sealBreak: 700,
  unfold: 2100,
  reveal: 900,
  float: 1500,
  fade: 750,
}

export function EnvelopeGate({ onOpen }: { onOpen: () => void }) {
  const [phase, setPhase] = useState<Phase>("idle")
  const [particles, setParticles] = useState<
    Array<{ id: number; x: number; y: number; size: number; delay: number }>
  >([])
  const [petals, setPetals] = useState<
    Array<{ id: number; x: number; delay: number; size: number; rotation: number }>
  >([])
  const audioRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = []

    if (phase === "sealCrack") {
      timers.push(setTimeout(() => setPhase("sealBreak"), DURATIONS.sealCrack))
    }

    if (phase === "sealBreak") {
      const newParticles = Array.from({ length: 26 }, (_, i) => {
        const angle = (i / 26) * Math.PI * 2
        const radius = 45 + Math.random() * 150
        return {
          id: i,
          x: Math.cos(angle) * radius,
          y: Math.sin(angle) * radius * 0.6 - 15,
          size: 3.5 + Math.random() * 7,
          delay: i * 0.014,
        }
      })
      setParticles(newParticles)
      timers.push(setTimeout(() => setPhase("unfold"), DURATIONS.sealBreak))
    }

    if (phase === "unfold") {
      timers.push(setTimeout(() => setPhase("reveal"), DURATIONS.unfold))
    }

    if (phase === "reveal") {
      const newPetals = Array.from({ length: 12 }, (_, i) => ({
        id: i,
        x: -30 + Math.random() * 60,
        delay: 0.1 + Math.random() * 0.55,
        size: 7 + Math.random() * 11,
        rotation: Math.random() * 360,
      }))
      setPetals(newPetals)
      timers.push(setTimeout(() => setPhase("float"), DURATIONS.reveal))
    }

    if (phase === "float") {
      timers.push(setTimeout(() => setPhase("fade"), DURATIONS.float))
    }

    if (phase === "fade") {
      onOpen()
      timers.push(setTimeout(() => setPhase("done"), DURATIONS.fade))
    }

    return () => timers.forEach(clearTimeout)
  }, [phase, onOpen])

  if (phase === "done") return null

  const isClicked = phase !== "idle"
  const isUnfold = phase === "unfold" || phase === "reveal" || phase === "float" || phase === "fade"
  const isReveal = phase === "reveal" || phase === "float" || phase === "fade"
  const isFloating = phase === "float" || phase === "fade"
  const fadingOut = phase === "fade"
  const isCracking = phase === "sealCrack" || phase === "sealBreak"

  const handleClick = () => {
    if (phase !== "idle") return
    if (!audioRef.current) {
      audioRef.current = new Audio("/sounds/envelope-open.mp3")
      audioRef.current.volume = 0.7
    }
    audioRef.current.currentTime = 0
    audioRef.current.play().catch(() => {})
    setPhase("sealCrack")
  }

  // ===== COULEURS PLUS FONCÉES =====
  const paper = "oklch(0.91 0.028 38)"       // plus foncé
  const paperDark = "oklch(0.86 0.035 38)"   // encore plus foncé pour les ombres
  const emboss = "oklch(0.78 0.04 38)"       // motifs plus visibles

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 overflow-hidden"
        style={{ perspective: 1600, background: "oklch(0.94 0.018 38)" }}
        animate={{
          opacity: fadingOut ? 0 : 1,
          filter: fadingOut ? "blur(10px)" : "blur(0px)",
          scale: fadingOut ? 1.03 : 1,
        }}
        transition={{ duration: DURATIONS.fade / 1000, ease: EASE }}
      >
        <div className="absolute inset-0 flex items-center justify-center p-4">
          <div
            className="relative w-full max-w-[340px] sm:max-w-[380px]"
            style={{ aspectRatio: "3 / 5" }}
          >
            {/* Corps de l'enveloppe */}
            <div
              className="absolute inset-0 overflow-hidden"
              style={{
                background: paper,
                boxShadow: "0 20px 50px -12px oklch(0.4 0.04 38 / 32%)",
                borderRadius: "2px",
              }}
            >
              <FloralPattern className="absolute inset-0 opacity-[0.5]" />
            </div>

            {/* Rabat gauche */}
            <motion.div
              className="absolute inset-0 origin-left"
              style={{
                clipPath: `polygon(0% 0%, 50% ${SEAL_Y}%, 0% 100%)`,
                background: `linear-gradient(125deg, ${paper} 0%, ${paperDark} 100%)`,
                zIndex: 12,
                transformStyle: "preserve-3d",
              }}
              initial={{ rotateY: 0 }}
              animate={isUnfold ? { rotateY: -105 } : { rotateY: 0 }}
              transition={{
                duration: DURATIONS.unfold / 1000,
                ease: [0.32, 1.1, 0.48, 1],
                delay: 0.12,
              }}
            >
              <FloralPattern className="absolute inset-0 opacity-45" />
              <div
                className="absolute inset-0"
                style={{
                  background: "linear-gradient(to right, transparent 60%, oklch(0.6 0.04 38 / 30%) 100%)",
                }}
              />
            </motion.div>

            {/* Rabat droit */}
            <motion.div
              className="absolute inset-0 origin-right"
              style={{
                clipPath: `polygon(100% 0%, 50% ${SEAL_Y}%, 100% 100%)`,
                background: `linear-gradient(-125deg, ${paper} 0%, ${paperDark} 100%)`,
                zIndex: 12,
                transformStyle: "preserve-3d",
              }}
              initial={{ rotateY: 0 }}
              animate={isUnfold ? { rotateY: 105 } : { rotateY: 0 }}
              transition={{
                duration: DURATIONS.unfold / 1000,
                ease: [0.32, 1.1, 0.48, 1],
                delay: 0.2,
              }}
            >
              <FloralPattern className="absolute inset-0 opacity-45 scale-x-[-1]" />
              <div
                className="absolute inset-0"
                style={{
                  background: "linear-gradient(to left, transparent 60%, oklch(0.6 0.04 38 / 30%) 100%)",
                }}
              />
            </motion.div>

            {/* Rabat supérieur */}
            <motion.div
              className="absolute inset-0"
              style={{
                clipPath: `polygon(0% 0%, 100% 0%, 50% ${SEAL_Y}%)`,
                transformOrigin: "50% 0%",
                background: `linear-gradient(180deg, ${paper} 0%, ${paperDark} 100%)`,
                zIndex: 30,
                boxShadow: "0 6px 24px -8px oklch(0.35 0.04 38 / 40%)",
              }}
              initial={{ rotateX: 0 }}
              animate={isUnfold ? { rotateX: -160 } : { rotateX: 0 }}
              transition={{
                duration: DURATIONS.unfold / 1000,
                ease: [0.65, 0, 0.35, 1],
              }}
            >
              <FloralPattern className="absolute inset-0 opacity-[0.42]" />
              <motion.div
                className="absolute inset-0"
                style={{
                  background: "linear-gradient(to bottom, transparent 0%, oklch(0.3 0.04 38 / 50%) 100%)",
                }}
                initial={{ opacity: 0 }}
                animate={{ opacity: isUnfold ? 1 : 0 }}
                transition={{ duration: 0.55, delay: 0.25 }}
              />
            </motion.div>

            {/* Ombre sous le rabat supérieur */}
            <motion.div
              className="absolute inset-0 pointer-events-none"
              style={{
                clipPath: `polygon(0% 0%, 100% 0%, 50% ${SEAL_Y}%)`,
                background: "linear-gradient(180deg, oklch(0.5 0.035 38) 0%, oklch(0.72 0.025 38) 100%)",
                zIndex: 20,
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: isUnfold ? 0.9 : 0 }}
              transition={{ duration: 0.4, delay: 0.15 }}
            />

            {/* Rabat inférieur */}
            <div
              className="absolute inset-0"
              style={{
                clipPath: `polygon(0% 100%, 100% 100%, 50% ${SEAL_Y}%)`,
                background: `linear-gradient(0deg, ${paperDark} 0%, transparent 75%)`,
                zIndex: 8,
              }}
            >
              <FloralPattern className="absolute inset-0 opacity-30" />
            </div>

            {/* Lignes de pliure */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 25 }}>
              <line x1="0" y1="0" x2="50%" y2={`${SEAL_Y}%`} stroke="oklch(0.75 0.03 38 / 60%)" strokeWidth="1" />
              <line x1="100%" y1="0" x2="50%" y2={`${SEAL_Y}%`} stroke="oklch(0.75 0.03 38 / 60%)" strokeWidth="1" />
              <line x1="0" y1="100%" x2="50%" y2={`${SEAL_Y}%`} stroke="oklch(0.78 0.025 38 / 40%)" strokeWidth="0.8" />
              <line x1="100%" y1="100%" x2="50%" y2={`${SEAL_Y}%`} stroke="oklch(0.78 0.025 38 / 40%)" strokeWidth="0.8" />
            </svg>

            {/* Carte */}
            <div className="absolute inset-x-0 pointer-events-none overflow-visible" style={{ top: "5%", bottom: 0, zIndex: 35 }}>
              <motion.div
                className="absolute inset-x-0 flex justify-center px-5"
                style={{ bottom: "11%" }}
                initial={{ y: "135%", opacity: 0, scale: 0.94 }}
                animate={
                  isReveal
                    ? { y: isFloating ? "-6%" : "0%", opacity: 1, scale: isFloating ? 1.015 : 1 }
                    : { y: "135%", opacity: 0, scale: 0.94 }
                }
                transition={{
                  y: {
                    duration: isFloating ? DURATIONS.float / 1000 : DURATIONS.reveal / 1000,
                    ease: isFloating ? EASE : [0.34, 1.35, 0.5, 1],
                  },
                  opacity: { duration: 0.5 },
                  scale: { duration: 0.6 },
                }}
              >
                <div className="w-full max-w-[290px] shadow-[0_20px_40px_-10px_oklch(0.25_0.04_38_/_35%)]">
                  <InvitationMessage />
                </div>
              </motion.div>
            </div>

            {/* Particules */}
            {particles.map((p) => (
              <motion.div
                key={p.id}
                className="absolute rounded-full pointer-events-none"
                style={{
                  left: "50%",
                  top: `${SEAL_Y}%`,
                  width: p.size,
                  height: p.size,
                  background: "radial-gradient(circle at 30% 30%, oklch(0.93 0.03 38), oklch(0.8 0.05 38))",
                  boxShadow: "0 0 6px oklch(0.85 0.04 38 / 40%)",
                  zIndex: 50,
                }}
                initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
                animate={{ x: p.x, y: p.y, opacity: [1, 1, 0], scale: [1, 1.35, 0.15] }}
                transition={{ duration: 0.85, delay: p.delay, ease: "easeOut" }}
              />
            ))}

            {/* Pétales */}
            {petals.map((p) => (
              <motion.div
                key={p.id}
                className="absolute pointer-events-none"
                style={{
                  left: "50%",
                  top: "38%",
                  width: p.size,
                  height: p.size * 1.5,
                  background: `linear-gradient(135deg, oklch(0.9 0.06 35), oklch(0.75 0.08 35))`,
                  borderRadius: "50% 50% 50% 0",
                  zIndex: 45,
                }}
                initial={{ x: 0, y: 0, opacity: 0, scale: 0.4, rotate: p.rotation }}
                animate={{
                  x: [0, p.x * 2, p.x * 4],
                  y: [0, -45 - p.id * 4, -120 - p.id * 7],
                  opacity: [0, 1, 0],
                  scale: [0.4, 1.15, 0.65],
                  rotate: [p.rotation, p.rotation + 160, p.rotation + 340],
                }}
                transition={{ duration: 2, delay: p.delay, ease: "easeOut" }}
              />
            ))}

            {/* Sceau */}
            <motion.button
              type="button"
              aria-label="فتح الدعوة"
              onClick={handleClick}
              disabled={phase !== "idle"}
              className="absolute left-1/2 z-40 -translate-x-1/2 -translate-y-1/2 focus:outline-none"
              style={{ top: `${SEAL_Y}%` }}
              initial={false}
              animate={
                phase === "idle"
                  ? { scale: [1, 1.035, 1] }
                  : phase === "sealCrack"
                  ? { scale: [1, 1.07, 1.02], rotate: [0, -2.5, 1.5, 0] }
                  : phase === "sealBreak"
                  ? { scale: [1.02, 1.35, 0], opacity: [1, 1, 0], rotate: [0, 10, -6, 18] }
                  : { scale: 0, opacity: 0 }
              }
              transition={
                phase === "idle"
                  ? { duration: 3.6, repeat: Infinity, ease: "easeInOut" }
                  : phase === "sealCrack"
                  ? { duration: DURATIONS.sealCrack / 1000 }
                  : { duration: DURATIONS.sealBreak / 1000, ease: [0.34, 1.35, 0.5, 1] }
              }
            >
              <div className="relative h-[84px] w-[84px] sm:h-[96px] sm:w-[96px]">
                <div
                  className="absolute inset-0 rounded-full"
                  style={{
                    background: "oklch(0.65 0.04 38 / 35%)",
                    filter: "blur(5px)",
                    transform: "translateY(3px) scale(0.94)",
                  }}
                />
                <div
                  className="absolute inset-0 rounded-full"
                  style={{
                    background: `
                      radial-gradient(circle at 32% 28%,
                        oklch(0.95 0.015 38) 0%,
                        oklch(0.9 0.025 38) 45%,
                        oklch(0.84 0.035 38) 100%
                      )
                    `,
                    boxShadow: `
                      inset 0 2px 5px oklch(1 0 0 / 50%),
                      inset 0 -3px 7px oklch(0.6 0.04 38 / 40%),
                      0 3px 10px oklch(0.4 0.04 38 / 25%)
                    `,
                    border: "1px solid oklch(0.8 0.03 38 / 50%)",
                  }}
                />
                <div
                  className="absolute inset-[7px] rounded-full"
                  style={{ border: "1.5px solid oklch(0.75 0.035 38 / 45%)" }}
                />
                <div className="absolute inset-0 flex flex-col items-center justify-center pt-1">
                  <svg width="26" height="11" viewBox="0 0 26 11" className="mb-0.5 opacity-80">
                    <path
                      d="M3 7.5 C7 1.5, 11 1.5, 13 5.5 C15 1.5, 19 1.5, 23 7.5"
                      fill="none"
                      stroke="oklch(0.62 0.045 38)"
                      strokeWidth="1.3"
                      strokeLinecap="round"
                    />
                    <circle cx="13" cy="5.5" r="1.6" fill="oklch(0.62 0.045 38)" />
                  </svg>
                  <SwanMotif className="h-9 w-9 text-[oklch(0.58_0.055_38)] sm:h-10 sm:w-10" />
                </div>

                {isCracking && (
                  <motion.div className="absolute inset-0 rounded-full overflow-hidden" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <div className="absolute left-1/2 top-0 h-full w-[1.5px] -translate-x-1/2 origin-top" style={{ background: "oklch(0.55 0.05 38 / 50%)", transform: "rotate(20deg)" }} />
                    <div className="absolute left-1/2 top-0 h-full w-[1.5px] -translate-x-1/2 origin-top" style={{ background: "oklch(0.55 0.05 38 / 50%)", transform: "rotate(-16deg)" }} />
                  </motion.div>
                )}
              </div>
            </motion.button>
          </div>
        </div>

        <AnimatePresence>
          {!isClicked && (
            <motion.div
              className="absolute inset-x-0 bottom-10 flex flex-col items-center gap-2 sm:bottom-12"
              initial={{ opacity: 1 }}
              exit={{ opacity: 0, y: 16 }}
              transition={{ duration: 0.4 }}
            >
              <span className="font-serif text-sm tracking-[0.22em] text-[oklch(0.5_0.04_38)]">
                ✦ اضغط للفتح ✦
              </span>
              <motion.svg
                width="18"
                height="18"
                viewBox="0 0 20 20"
                fill="none"
                stroke="oklch(0.52 0.04 38)"
                strokeWidth={1.5}
                animate={{ y: [0, 5, 0], opacity: [0.45, 1, 0.45] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              >
                <path d="M4 7l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M4 11l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" opacity={0.3} />
              </motion.svg>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </AnimatePresence>
  )
}

function FloralPattern({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 420" fill="none" className={className} preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <path d="M28 400 C38 320, 22 270, 42 210 C62 150, 32 110, 52 55 C60 25, 66 12, 72 4" stroke="oklch(0.78 0.035 38)" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M52 55 C68 42, 88 48, 95 68" stroke="oklch(0.78 0.035 38)" strokeWidth="1.3" strokeLinecap="round" />
      <path d="M42 210 C25 198, 8 210, 2 235" stroke="oklch(0.78 0.035 38)" strokeWidth="1.3" strokeLinecap="round" />
      <path d="M42 210 C58 198, 78 212, 85 238" stroke="oklch(0.78 0.035 38)" strokeWidth="1.3" strokeLinecap="round" />
      <ellipse cx="52" cy="52" rx="17" ry="10" stroke="oklch(0.78 0.035 38)" strokeWidth="1.3" transform="rotate(28 52 52)" />
      <ellipse cx="70" cy="45" rx="9" ry="5.5" stroke="oklch(0.78 0.035 38)" strokeWidth="1.1" transform="rotate(42 70 45)" />
      <ellipse cx="45" cy="125" rx="15" ry="9" stroke="oklch(0.78 0.035 38)" strokeWidth="1.3" transform="rotate(-12 45 125)" />
      <ellipse cx="65" cy="140" rx="11" ry="6.5" stroke="oklch(0.78 0.035 38)" strokeWidth="1.1" transform="rotate(32 65 140)" />
      <ellipse cx="40" cy="215" rx="14" ry="8.5" stroke="oklch(0.78 0.035 38)" strokeWidth="1.3" transform="rotate(18 40 215)" />
      <ellipse cx="58" cy="232" rx="10" ry="6" stroke="oklch(0.78 0.035 38)" strokeWidth="1.1" transform="rotate(-28 58 232)" />
      <ellipse cx="36" cy="300" rx="13" ry="8" stroke="oklch(0.78 0.035 38)" strokeWidth="1.2" transform="rotate(8 36 300)" />
      <ellipse cx="52" cy="318" rx="9" ry="5.5" stroke="oklch(0.78 0.035 38)" strokeWidth="1.1" transform="rotate(38 52 318)" />
      <ellipse cx="32" cy="365" rx="11" ry="7" stroke="oklch(0.78 0.035 38)" strokeWidth="1.15" transform="rotate(-5 32 365)" />
    </svg>
  )
}