import { useEffect } from 'react'
import Lenis from 'lenis'
import { useReducedMotion } from 'framer-motion'
import { setLenis } from '../lib/scroll'

/**
 * Inertial scrolling for the whole document. Lenis still drives native scroll
 * position, so framer-motion's useScroll stays in sync for free.
 */
export function useSmoothScroll() {
  const reduced = useReducedMotion()

  useEffect(() => {
    if (reduced) return undefined

    const lenis = new Lenis({
      // Settle time, not frame rate. Long durations read as input lag even at
      // a solid 60fps, so this is deliberately on the short side — raise it
      // for more glide, drop smoothWheel entirely for native scrolling.
      duration: 0.9,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1.6,
    })

    setLenis(lenis)

    let frame = 0
    const raf = (time) => {
      lenis.raf(time)
      frame = requestAnimationFrame(raf)
    }
    frame = requestAnimationFrame(raf)

    return () => {
      cancelAnimationFrame(frame)
      lenis.destroy()
      setLenis(null)
    }
  }, [reduced])
}
