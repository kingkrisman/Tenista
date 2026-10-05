import { useCallback, useRef } from 'react'
import { motion, useMotionValue, useSpring, useReducedMotion } from 'framer-motion'
import { useHasPointer } from '../../hooks/useMediaQuery'

/**
 * Pulls its child toward the cursor while the pointer is inside an invisible
 * padded hit area, then springs it home on leave.
 *
 * The rect is measured once on enter rather than on every mousemove. That
 * avoids a forced layout per pointer event, and it also fixes a feedback
 * loop: this element is the one being translated, so re-measuring it mid-move
 * returned a centre that had already shifted toward the cursor.
 */
export function Magnetic({ children, strength = 0.35, radius = 0, className = '', ...rest }) {
  const ref = useRef(null)
  const rect = useRef(null)
  const hasPointer = useHasPointer()
  const reduced = useReducedMotion()

  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const sx = useSpring(x, { stiffness: 260, damping: 18, mass: 0.6 })
  const sy = useSpring(y, { stiffness: 260, damping: 18, mass: 0.6 })

  const active = hasPointer && !reduced

  const handleEnter = useCallback(() => {
    if (!active || !ref.current) return
    rect.current = ref.current.getBoundingClientRect()
  }, [active])

  const handleMove = (e) => {
    if (!active) return
    const r = rect.current
    if (!r) return
    x.set((e.clientX - (r.left + r.width / 2)) * strength)
    y.set((e.clientY - (r.top + r.height / 2)) * strength)
  }

  const reset = () => {
    rect.current = null
    x.set(0)
    y.set(0)
  }

  return (
    <motion.div
      ref={ref}
      onMouseEnter={handleEnter}
      onMouseMove={handleMove}
      onMouseLeave={reset}
      style={{ x: active ? sx : 0, y: active ? sy : 0, padding: radius || undefined }}
      className={className}
      {...rest}
    >
      {children}
    </motion.div>
  )
}
