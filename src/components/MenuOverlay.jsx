import { useEffect, useState } from 'react'
import { AnimatePresence, motion, useMotionValue, useSpring } from 'framer-motion'
import { MENU } from '../lib/content'
import { scrollTo, startScroll, stopScroll } from '../lib/scroll'
import { useHasPointer } from '../hooks/useMediaQuery'

const EASE = [0.76, 0, 0.24, 1]

export function MenuOverlay({ open, onClose }) {
  const [active, setActive] = useState(null)
  const hasPointer = useHasPointer()

  const px = useMotionValue(0)
  const py = useMotionValue(0)
  const previewX = useSpring(px, { stiffness: 140, damping: 20, mass: 0.7 })
  const previewY = useSpring(py, { stiffness: 140, damping: 20, mass: 0.7 })

  useEffect(() => {
    if (open) stopScroll()
    else startScroll()

    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  useEffect(() => {
    if (!open) setActive(null)
  }, [open])

  const onMove = (e) => {
    px.set(e.clientX - 150)
    py.set(e.clientY - 190)
  }

  const handleGo = (e, href) => {
    e.preventDefault()
    onClose()
    setTimeout(() => scrollTo(href), 720)
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[70] bg-ink text-smoke"
          initial={{ clipPath: 'inset(0% 0% 100% 0%)' }}
          animate={{ clipPath: 'inset(0% 0% 0% 0%)' }}
          exit={{ clipPath: 'inset(0% 0% 100% 0%)' }}
          transition={{ duration: 0.85, ease: EASE }}
          onMouseMove={hasPointer ? onMove : undefined}
        >
          {/* Cursor-tracked preview of the hovered destination */}
          {hasPointer && (
            <motion.div
              className="pointer-events-none fixed left-0 top-0 z-10 h-[380px] w-[300px] overflow-hidden rounded-2xl"
              style={{ x: previewX, y: previewY }}
              animate={{ opacity: active === null ? 0 : 1, scale: active === null ? 0.9 : 1 }}
              transition={{ duration: 0.4, ease: EASE }}
            >
              <AnimatePresence mode="popLayout">
                {active !== null && (
                  <motion.img
                    key={MENU[active].label}
                    src={MENU[active].image}
                    alt=""
                    initial={{ opacity: 0, scale: 1.18 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5, ease: EASE }}
                    className="h-full w-full object-cover"
                  />
                )}
              </AnimatePresence>
              <div className="absolute inset-0 bg-court-900/25" />
            </motion.div>
          )}

          <div className="edge relative z-20 flex h-full flex-col justify-between pb-10 pt-[104px]">
            <motion.ul
              initial="hidden"
              animate="show"
              exit="hidden"
              variants={{
                hidden: {},
                show: { transition: { staggerChildren: 0.06, delayChildren: 0.28 } },
              }}
              className="flex flex-col"
              onMouseLeave={() => setActive(null)}
            >
              {MENU.map((item, i) => (
                <li key={item.label} className="overflow-hidden border-b border-white/10">
                  <motion.a
                    href={item.href}
                    onClick={(e) => handleGo(e, item.href)}
                    onMouseEnter={() => setActive(i)}
                    data-cursor="link"
                    variants={{
                      hidden: { y: '110%', opacity: 0 },
                      show: { y: '0%', opacity: 1, transition: { duration: 0.8, ease: EASE } },
                    }}
                    className="group flex items-baseline gap-4 py-[1.1vh] md:gap-8"
                    animate={{
                      opacity: active === null || active === i ? 1 : 0.32,
                    }}
                  >
                    <span className="w-8 shrink-0 text-[11px] tabular-nums text-white/40">
                      {item.meta}
                    </span>
                    <motion.span
                      className="display text-[11vw] leading-[1.02] md:text-[6.4vw]"
                      animate={{ x: active === i ? 22 : 0 }}
                      transition={{ duration: 0.5, ease: EASE }}
                    >
                      {item.label}
                    </motion.span>
                    <motion.span
                      className="ml-auto hidden text-ball md:block"
                      animate={{ opacity: active === i ? 1 : 0, x: active === i ? 0 : -16 }}
                      transition={{ duration: 0.4, ease: EASE }}
                      aria-hidden="true"
                    >
                      <Arrow className="h-7 w-7" />
                    </motion.span>
                  </motion.a>
                </li>
              ))}
            </motion.ul>

            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6, delay: 0.55, ease: EASE }}
              className="flex flex-col gap-6 text-[13px] text-white/60 md:flex-row md:items-end md:justify-between"
            >
              <div className="space-y-1">
                <p className="eyebrow text-white/35">Club</p>
                <p className="text-white">14 Baseline Avenue, Lagos</p>
                <p>Open 06:00 — 23:00, every day</p>
              </div>
              <div className="space-y-1">
                <p className="eyebrow text-white/35">Enquiries</p>
                <a href="mailto:play@tenista.club" className="block text-white hover:text-ball">
                  play@tenista.club
                </a>
                <a href="tel:+2348000000000" className="block hover:text-ball">
                  +234 800 000 0000
                </a>
              </div>
              <div className="flex gap-5">
                {['Instagram', 'X', 'YouTube'].map((s) => (
                  <a key={s} href="#contact" className="text-white/70 hover:text-ball">
                    {s}
                  </a>
                ))}
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

function Arrow({ className }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className={className}>
      <path d="M5 19L19 5M19 5H9M19 5v10" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}
