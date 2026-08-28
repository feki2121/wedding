"use client"

import { useEffect, useState, useRef } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { SwanMotif } from "@/components/wedding/swan-motif"
import { InvitationMessage } from "@/components/wedding/invitation-message"

type Phase = "idle" | "sealBreak" | "unfold" | "reveal" | "float" | "fade" | "done"

const EASE = [0.22, 1, 0.36, 1] as const
const SEAL_Y = 42

// Nouveau timeline plus dramatique
const DURATIONS = {
  sealBreak: 600,
  unfold: 1800,
  reveal: 800,
  float: 1400,
  fade: 700,
}

export function EnvelopeGate({ onOpen }: { onOpen: () => void }) {
  const [phase, setPhase] = useState<Phase>("idle")
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number; angle: number; size: number }>>([])
  const [petals, setPetals] = useState<Array<{ id: number; x: number; delay: number; size: number; rotation: number }>>([])
  const audioRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = []

    if (phase === "sealBreak") {
      // Générer des particules pour l'éclatement du sceau
      const newParticles = Array.from({ length: 24 }, (_, i) => ({
        id: i,
        x: (Math.random() - 0.5) * 300,
        y: (Math.random() - 0.5) * 300 - 50,
        angle: Math.random() * 360,
        size: 4 + Math.random() * 8,
      }))
      setParticles(newParticles)

      timers.push(setTimeout(() => setPhase("unfold"), DURATIONS.sealBreak))
    }

    if (phase === "unfold") {
      timers.push(setTimeout(() => setPhase("reveal"), DURATIONS.unfold))
    }

    if (phase === "reveal") {
      // Générer des pétales pour la sortie de la carte
      const newPetals = Array.from({ length: 12 }, (_, i) => ({
        id: i,
        x: -20 + Math.random() * 40,
        delay: 0.1 + Math.random() * 0.6,
        size: 8 + Math.random() * 12,
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

  const handleClick = () => {
    if (phase !== "idle") return

    // Son d'ouverture
    if (!audioRef.current) {
      audioRef.current = new Audio("/sounds/envelope-open.mp3")
      audioRef.current.volume = 0.7
    }
    audioRef.current.currentTime = 0
    audioRef.current.play().catch(() => { })

    setPhase("sealBreak")
  }

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 overflow-hidden bg-background"
        style={{ perspective: 1800 }}
        animate={{
          opacity: fadingOut ? 0 : 1,
          filter: fadingOut ? "blur(12px)" : "blur(0px)",
          scale: fadingOut ? 1.05 : 1,
        }}
        transition={{ duration: DURATIONS.fade / 1000, ease: EASE }}
      >
        <div className="absolute inset-0">
          {/* Fond avec dégradé et texture */}
          <div
            className="absolute inset-0"
            style={{
              background: `
                radial-gradient(ellipse at 50% 50%, oklch(0.98 0.015 75) 0%, oklch(0.92 0.03 45) 60%, oklch(0.88 0.04 40) 100%)
              `,
            }}
          />

          {/* Texture papier avec grain */}
          <div
            className="absolute inset-0 opacity-30 mix-blend-multiply"
            style={{
              backgroundImage: `
                radial-gradient(circle at 20% 30%, oklch(0.85 0.02 50 / 30%) 0%, transparent 50%),
                radial-gradient(circle at 80% 70%, oklch(0.85 0.02 50 / 20%) 0%, transparent 40%),
                repeating-linear-gradient(45deg, transparent 0px, transparent 2px, oklch(0.75 0.02 60 / 8%) 2px, oklch(0.75 0.02 60 / 8%) 3px)
              `
            }}
          />

          {/* Motifs décoratifs */}
          <BranchFlourish className="absolute -left-10 bottom-[5%] h-[50%] w-auto text-foreground/[0.06] sm:left-0" />
          <BranchFlourish className="absolute -right-12 top-[3%] h-[42%] w-auto rotate-[140deg] text-foreground/[0.05] sm:right-0" />

          {/* Lignes de pliage décoratives */}
          <svg className="absolute inset-0 h-full w-full" preserveAspectRatio="none" aria-hidden="true">
            <line x1="0" y1="0" x2="50%" y2={`${SEAL_Y}%`} stroke="oklch(0.55 0.04 50 / 15%)" strokeWidth="1.5" strokeDasharray="4 6" />
            <line x1="100%" y1="0" x2="50%" y2={`${SEAL_Y}%`} stroke="oklch(0.55 0.04 50 / 15%)" strokeWidth="1.5" strokeDasharray="4 6" />
            <line x1="0" y1="100%" x2="50%" y2={`${SEAL_Y}%`} stroke="oklch(0.55 0.04 50 / 10%)" strokeWidth="1" strokeDasharray="3 5" />
            <line x1="100%" y1="100%" x2="50%" y2={`${SEAL_Y}%`} stroke="oklch(0.55 0.04 50 / 10%)" strokeWidth="1" strokeDasharray="3 5" />
          </svg>

          {/* ====== RABATS LATÉRAUX AVEC DÉPLIAGE EN ÉVENTAIL ====== */}

          {/* Rabat gauche - se déplie vers l'extérieur avec rotation */}
          <motion.div
            className="absolute inset-0"
            style={{
              clipPath: `polygon(0% 0%, 50% ${SEAL_Y}%, 0% 100%)`,
              transformOrigin: "0% 50%",
              background: "linear-gradient(135deg, oklch(0.96 0.02 70) 0%, oklch(0.90 0.035 45) 100%)",
              zIndex: 10,
            }}
            initial={{ rotateY: 0, x: 0 }}
            animate={isUnfold ? { rotateY: -75, x: -30 } : { rotateY: 0, x: 0 }}
            transition={{
              duration: DURATIONS.unfold / 1000,
              ease: [0.34, 1.56, 0.64, 1],
              delay: 0.1,
            }}
          >
            <div className="absolute inset-0 opacity-20 mix-blend-multiply" style={{
              backgroundImage: "repeating-linear-gradient(45deg, oklch(0.7 0.04 50 / 30%) 0px, oklch(0.7 0.04 50 / 30%) 1px, transparent 1px, transparent 8px)"
            }} />
          </motion.div>

          {/* Rabat droit - se déplie vers l'extérieur */}
          <motion.div
            className="absolute inset-0"
            style={{
              clipPath: `polygon(100% 0%, 50% ${SEAL_Y}%, 100% 100%)`,
              transformOrigin: "100% 50%",
              background: "linear-gradient(-135deg, oklch(0.96 0.02 70) 0%, oklch(0.90 0.035 45) 100%)",
              zIndex: 10,
            }}
            initial={{ rotateY: 0, x: 0 }}
            animate={isUnfold ? { rotateY: 75, x: 30 } : { rotateY: 0, x: 0 }}
            transition={{
              duration: DURATIONS.unfold / 1000,
              ease: [0.34, 1.56, 0.64, 1],
              delay: 0.2,
            }}
          >
            <div className="absolute inset-0 opacity-20 mix-blend-multiply" style={{
              backgroundImage: "repeating-linear-gradient(-45deg, oklch(0.7 0.04 50 / 30%) 0px, oklch(0.7 0.04 50 / 30%) 1px, transparent 1px, transparent 8px)"
            }} />
          </motion.div>

          {/* ====== RABAT SUPÉRIEUR - SE DÉPLIE VERS LE HAUT AVEC COURBURE ====== */}
          <motion.div
            className="absolute inset-0"
            style={{
              clipPath: `polygon(0% 0%, 100% 0%, 50% ${SEAL_Y}%)`,
              transformOrigin: "50% 0%",
              transformStyle: "preserve-3d",
              zIndex: 25,
              background: "linear-gradient(180deg, oklch(0.98 0.015 78) 0%, oklch(0.92 0.03 50) 60%, oklch(0.87 0.045 40) 100%)",
              boxShadow: "0 2px 20px -8px oklch(0.3 0.05 30 / 30%)",
            }}
            initial={{ rotateX: 0, y: 0 }}
            animate={isUnfold ? { rotateX: -140, y: -20 } : { rotateX: 0, y: 0 }}
            transition={{
              rotateX: { duration: DURATIONS.unfold / 1000, ease: [0.65, 0, 0.35, 1] },
              y: { duration: 0.6, ease: EASE },
            }}
          >
            {/* Texture sur le rabat */}
            <div className="absolute inset-0 opacity-15 mix-blend-multiply" style={{
              backgroundImage: "repeating-linear-gradient(45deg, oklch(0.7 0.04 50 / 40%) 0px, oklch(0.7 0.04 50 / 40%) 1px, transparent 1px, transparent 12px), repeating-linear-gradient(-45deg, oklch(0.7 0.04 50 / 40%) 0px, oklch(0.7 0.04 50 / 40%) 1px, transparent 1px, transparent 12px)"
            }} />

            {/* Effet de courbure - ombre sur le rabat qui s'ouvre */}
            <motion.div
              className="absolute inset-0"
              style={{
                background: "linear-gradient(180deg, oklch(0.3 0.04 30 / 0%) 0%, oklch(0.2 0.04 25 / 60%) 100%)",
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: isUnfold ? 1 : 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            />
          </motion.div>

          {/* ====== OMBRE INTÉRIEURE ====== */}
          <motion.div
            className="absolute inset-0"
            style={{
              clipPath: `polygon(0% 0%, 100% 0%, 50% ${SEAL_Y}%)`,
              zIndex: 15,
              background: "linear-gradient(180deg, oklch(0.45 0.04 35) 0%, oklch(0.6 0.035 40) 60%, oklch(0.7 0.03 45) 100%)",
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: isUnfold ? 1 : 0 }}
            transition={{ duration: 0.4, delay: 0.15 }}
          />

          {/* ====== RABAT INFÉRIEUR (poche) - avec détail doré ====== */}
          <div
            className="absolute inset-0"
            style={{
              clipPath: `polygon(0% 100%, 100% 100%, 50% ${SEAL_Y}%)`,
              zIndex: 5,
              background: "linear-gradient(0deg, oklch(0.92 0.04 45 / 60%) 0%, oklch(0.85 0.035 40 / 30%) 60%, transparent 100%)",
            }}
          />

          {/* ====== CARTE D'INVITATION AVEC EFFET DE LÉVITATION ====== */}
          <div
            className="absolute inset-x-0 pointer-events-none overflow-visible"
            style={{ top: "8%", bottom: 0, zIndex: 30 }}
          >
            <motion.div
              className="absolute inset-x-0 flex justify-center px-4 sm:px-6"
              style={{ bottom: "15%" }}
              initial={{ y: "120%", opacity: 0, rotateX: 10, scale: 0.95 }}
              animate={isReveal ? {
                y: isFloating ? "-8%" : "0%",
                opacity: 1,
                rotateX: isFloating ? -3 : 0,
                scale: isFloating ? 1.02 : 1,
              } : {
                y: "120%",
                opacity: 0,
                rotateX: 10,
                scale: 0.95,
              }}
              transition={{
                y: {
                  duration: isFloating ? DURATIONS.float / 1000 : DURATIONS.reveal / 1000,
                  ease: isFloating ? [0.22, 1, 0.36, 1] : [0.34, 1.56, 0.64, 1],
                },
                opacity: { duration: 0.5 },
                rotateX: { duration: 0.8, ease: EASE },
                scale: { duration: 0.6, ease: EASE },
              }}
            >
              <div className="w-full max-w-sm sm:max-w-md shadow-2xl shadow-foreground/10">
                <InvitationMessage />
              </div>
            </motion.div>
          </div>

          {/* ====== PARTICULES D'ÉCLATEMENT DU SCEAU ====== */}
          {particles.map((p) => (
            <motion.div
              key={p.id}
              className="absolute rounded-full bg-gradient-to-b from-amber-300 to-amber-600"
              style={{
                left: "50%",
                top: `${SEAL_Y}%`,
                width: p.size,
                height: p.size,
                boxShadow: "0 0 10px oklch(0.8 0.15 70 / 50%)",
              }}
              initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
              animate={{
                x: p.x,
                y: p.y,
                opacity: [1, 1, 0],
                scale: [1, 1.5, 0],
              }}
              transition={{
                duration: 0.8,
                delay: p.id * 0.02,
                ease: "easeOut",
              }}
            />
          ))}

          {/* ====== PÉTALES DE FLEURS ====== */}
          {petals.map((p) => (
            <motion.div
              key={p.id}
              className="absolute rounded-full"
              style={{
                left: "50%",
                top: "40%",
                width: p.size,
                height: p.size * 1.6,
                background: `linear-gradient(135deg, 
                  oklch(0.85 0.15 ${30 + p.id * 10}) 0%, 
                  oklch(0.7 0.12 ${40 + p.id * 10}) 100%
                )`,
                borderRadius: "50% 50% 50% 0",
                transform: `rotate(${p.rotation}deg)`,
              }}
              initial={{ x: 0, y: 0, opacity: 0, scale: 0.5 }}
              animate={{
                x: [0, p.x * 2, p.x * 4],
                y: [0, -50 - p.id * 5, -120 - p.id * 8],
                opacity: [0, 1, 0],
                scale: [0.5, 1.2, 0.8],
                rotate: [p.rotation, p.rotation + 180, p.rotation + 360],
              }}
              transition={{
                duration: 2 + p.id * 0.1,
                delay: p.delay,
                ease: "easeOut",
              }}
            />
          ))}

          {/* ====== SCEAU AVEC EFFET D'EXPLOSION ====== */}
          <motion.button
            type="button"
            aria-label="فتح الدعوة"
            onClick={handleClick}
            className="absolute left-1/2 z-40 flex h-20 w-20 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-amber-300/40 bg-gradient-to-br from-amber-400 to-amber-600 shadow-[0_8px_32px_-8px_oklch(0.6_0.15_60_/_60%)] disabled:cursor-default sm:h-24 sm:w-24"
            style={{ top: `${SEAL_Y}%` }}
            disabled={phase !== "idle"}
            initial={false}
            animate={phase === "idle" ? {
              scale: [1, 1.08, 1],
              boxShadow: [
                "0 8px 32px -8px oklch(0.6 0.15 60 / 60%)",
                "0 12px 48px -8px oklch(0.7 0.2 60 / 70%)",
                "0 8px 32px -8px oklch(0.6 0.15 60 / 60%)",
              ],
            } : phase === "sealBreak" ? {
              scale: [1, 1.4, 0],
              opacity: [1, 1, 0],
              rotate: [0, 10, -5, 20],
            } : {
              scale: 0,
              opacity: 0,
            }}
            transition={phase === "idle" ? {
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
            } : {
              duration: DURATIONS.sealBreak / 1000,
              ease: [0.34, 1.56, 0.64, 1],
            }}
          >
            <SwanMotif className="h-14 w-14 text-primary-foreground/90 drop-shadow-sm sm:h-16 sm:w-16" />
            {/* Anneau doré autour du sceau */}
            <motion.div
              className="absolute inset-[-4px] rounded-full border-2 border-amber-400/30"
              animate={phase === "idle" ? {
                scale: [1, 1.1, 1],
                opacity: [0.3, 0.6, 0.3],
              } : { scale: 0, opacity: 0 }}
              transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
            />
          </motion.button>

          {/* ====== LIGNE DORÉE DÉCORATIVE ====== */}
          <motion.div
            className="absolute left-1/2 z-20 h-px bg-gradient-to-r from-transparent via-amber-400/30 to-transparent"
            style={{ top: `${SEAL_Y}%`, width: "30%" }}
            initial={{ scaleX: 0, opacity: 0 }}
            animate={isUnfold ? { scaleX: 1, opacity: 1 } : { scaleX: 0, opacity: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: EASE }}
          />
        </div>

        {/* ====== PROMPT D'OUVERTURE ====== */}
        <AnimatePresence>
          {!isClicked && (
            <motion.div
              className="absolute inset-x-0 bottom-10 flex flex-col items-center gap-2 sm:bottom-14"
              initial={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.4 }}
            >
              <span className="font-serif text-sm tracking-[0.2em] text-muted-foreground/70">
                ✦ اضغط للفتح ✦
              </span>
              <motion.svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.5}
                className="text-muted-foreground/50"
                animate={{ y: [0, 6, 0], opacity: [0.5, 1, 0.5] }}
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

function BranchFlourish({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 320" fill="none" className={className} aria-hidden="true">
      <path
        d="M10 310C24 260 20 210 40 170C60 130 30 90 46 40C54 18 60 10 64 4"
        stroke="currentColor"
        strokeWidth={2.5}
        strokeLinecap="round"
      />
      <path d="M46 40c10-14 28-16 34-6" stroke="currentColor" strokeWidth={2} strokeLinecap="round" />
      <ellipse cx="82" cy="30" rx="12" ry="7" stroke="currentColor" strokeWidth={1.8} transform="rotate(30 82 30)" />
      <path d="M40 170c-16-8-30 0-34 14" stroke="currentColor" strokeWidth={2} strokeLinecap="round" />
      <ellipse cx="4" cy="188" rx="12" ry="7" stroke="currentColor" strokeWidth={1.8} transform="rotate(-10 4 188)" />
      <path d="M40 170c14-6 26 2 28 16" stroke="currentColor" strokeWidth={2} strokeLinecap="round" />
      <ellipse cx="70" cy="190" rx="11" ry="6.5" stroke="currentColor" strokeWidth={1.8} transform="rotate(50 70 190)" />
      <path d="M20 250c-14-4-26 4-28 18" stroke="currentColor" strokeWidth={2} strokeLinecap="round" />
      <ellipse cx="-8" cy="270" rx="11" ry="6.5" stroke="currentColor" strokeWidth={1.8} transform="rotate(-20 -8 270)" />
      <path d="M20 250c12-6 24 2 26 14" stroke="currentColor" strokeWidth={2} strokeLinecap="round" />
      <ellipse cx="48" cy="266" rx="10" ry="6" stroke="currentColor" strokeWidth={1.8} transform="rotate(40 48 266)" />
    </svg>
  )
}