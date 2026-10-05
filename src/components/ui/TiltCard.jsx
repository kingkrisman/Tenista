import { useRef } from 'react'
import { motion, useMotionTemplate, useMotionValue, useSpring, useReducedMotion } from 'framer-motion'
import { useHasPointer } from '../../hooks/useMediaQuery'

/** 3D tilt with a specular sheen that tracks the pointer. */
export function TiltCard({ children, className = '', max = 9, glare = true, ...rest }) {
  const ref = useRef(null)
  const rect = useRef(null)
  const hasPointer = useHasPointer()
  const reduced = useReducedMotion()
  const active = hasPointer && !reduced

  const rx = useMotionValue(0)
  const ry = useMotionValue(0)
  const gx = useMotionValue(50)
  const gy = useMotionValue(50)

  const springCfg = { stiffness: 220, damping: 20, mass: 0.5 }
  const rotateX = useSpring(rx, springCfg)
  const rotateY = useSpring(ry, springCfg)
  const glareX = useSpring(gx, springCfg)
  const glareY = useSpring(gy, springCfg)

  const sheen = useMotionTemplate`radial-gradient(420px circle at ${glareX}% ${glareY}%, rgba(255,255,255,0.28), transparent 62%)`

  // Measured on enter, not per move: the card is being rotated in 3D, so
  // re-reading its box mid-gesture both costs a layout and feeds back.
  const onEnter = () => {
    if (!active || !ref.current) return
    rect.current = ref.current.getBoundingClientRect()
  }

  const onMove = (e) => {
    if (!active || !rect.current) return
    const r = rect.current
    const px = (e.clientX - r.left) / r.width
    const py = (e.clientY - r.top) / r.height
    ry.set((px - 0.5) * max * 2)
    rx.set(-(py - 0.5) * max * 2)
    gx.set(px * 100)
    gy.set(py * 100)
  }

  const onLeave = () => {
    rect.current = null
    rx.set(0)
    ry.set(0)
    gx.set(50)
    gy.set(50)
  }

  return (
    <motion.div
      ref={ref}
      onMouseEnter={onEnter}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={{
        rotateX: active ? rotateX : 0,
        rotateY: active ? rotateY : 0,
        transformStyle: 'preserve-3d',
        transformPerspective: 1100,
      }}
      className={`relative ${className}`}
      {...rest}
    >
      {children}
      {glare && active && (
        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 rounded-[inherit] mix-blend-soft-light"
          style={{ backgroundImage: sheen }}
        />
      )}
    </motion.div>
  )
}
