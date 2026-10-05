import { useRef } from 'react'
import {
  motion,
  useAnimationFrame,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
  useReducedMotion,
} from 'framer-motion'

const wrap = (min, max, v) => {
  const range = max - min
  const mod = (((v - min) % range) + range) % range
  return mod + min
}

/**
 * Seamless ticker that reads scroll velocity: it speeds up as you scroll and
 * reverses direction when you scroll back up.
 */
export function Marquee({ children, baseVelocity = 4, className = '', itemClassName = '' }) {
  const baseX = useMotionValue(0)
  const direction = useRef(1)
  const reduced = useReducedMotion()

  const { scrollY } = useScroll()
  const scrollVelocity = useVelocity(scrollY)
  const smoothVelocity = useSpring(scrollVelocity, { damping: 50, stiffness: 380 })
  const velocityFactor = useTransform(smoothVelocity, [0, 1200], [0, 4], { clamp: false })

  const x = useTransform(baseX, (v) => `${v}%`)

  useAnimationFrame((_, delta) => {
    if (reduced) return
    const factor = velocityFactor.get()

    if (factor < 0) direction.current = -1
    else if (factor > 0) direction.current = 1

    // Base drift plus whatever the scroll is contributing.
    let moveBy = direction.current * baseVelocity * (delta / 1000)
    moveBy += moveBy * Math.abs(factor)

    // Track holds two identical copies, so -50% lands perfectly on the seam.
    baseX.set(wrap(-50, 0, baseX.get() + moveBy))
  })

  return (
    <div className={`relative overflow-hidden ${className}`}>
      <motion.div className="flex w-max flex-nowrap will-change-transform" style={{ x }}>
        {[0, 1].map((copy) => (
          <div key={copy} className="flex flex-nowrap" aria-hidden={copy === 1}>
            {children.map((item, i) => (
              <span key={i} className={itemClassName}>
                {item}
              </span>
            ))}
          </div>
        ))}
      </motion.div>
    </div>
  )
}
