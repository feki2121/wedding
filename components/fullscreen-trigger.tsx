"use client"

import { useEffect } from "react"

/**
 * FullscreenTrigger
 *
 * Requests the Fullscreen API on the first user interaction (touch or click).
 * This satisfies browser security requirements (must be triggered by a gesture).
 *
 * Coverage:
 *  - Desktop Chrome/Edge/Firefox: full Fullscreen API support
 *  - Android Chrome: full Fullscreen API support
 *  - iOS Safari: Fullscreen API is NOT supported; the PWA manifest +
 *    apple-mobile-web-app-capable meta tags handle standalone mode instead.
 */
export function FullscreenTrigger() {
  useEffect(() => {
    // iOS does not support the Fullscreen API — skip silently.
    const isIOS =
      /iPad|iPhone|iPod/.test(navigator.userAgent) ||
      (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1)

    if (isIOS) return

    // Already fullscreen (e.g. PWA installed mode)
    if (document.fullscreenElement) return

    function requestFullscreen() {
      if (document.fullscreenElement) return
      document.documentElement.requestFullscreen({ navigationUI: "hide" }).catch(() => {
        // Silently ignore — user may have denied, or browser may not support it
      })
      // Only attempt once per session
      document.removeEventListener("click", requestFullscreen)
      document.removeEventListener("touchstart", requestFullscreen)
    }

    document.addEventListener("click", requestFullscreen, { once: true })
    document.addEventListener("touchstart", requestFullscreen, { once: true })

    return () => {
      document.removeEventListener("click", requestFullscreen)
      document.removeEventListener("touchstart", requestFullscreen)
    }
  }, [])

  return null
}
