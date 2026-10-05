import { useEffect, useRef, useState } from 'react'
import { useInView, useReducedMotion } from 'framer-motion'

/** Counts up to `value` the first time it scrolls into view. */
export function Counter({ value, duration = 1.8, className = '', suffix = '', prefix = '' }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, amount: 0.5 })
  const reduced = useReducedMotion()
  const [display, setDisplay] = useState(0)

  useEffect(() => {
    if (!inView) return undefined
    if (reduced) {
      setDisplay(value)
      return undefined
    }

    let frame = 0
    let start = null
    const ease = (t) => 1 - Math.pow(1 - t, 4)

    const tick = (now) => {
      if (start === null) start = now
      const progress = Math.min((now - start) / (duration * 1000), 1)
      setDisplay(Math.round(ease(progress) * value))
      if (progress < 1) frame = requestAnimationFrame(tick)
    }

    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [inView, value, duration, reduced])

  return (
    <span ref={ref} className={className}>
      {prefix}
      {display}
      {suffix}
    </span>
  )
}
