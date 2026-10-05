import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useMotionValue, useSpring } from 'framer-motion'
import { PROGRAMS } from '../lib/content'
import { SplitText } from '../components/ui/SplitText'
import { Reveal } from '../components/ui/Reveal'
import { useHasPointer } from '../hooks/useMediaQuery'

const EASE = [0.16, 1, 0.3, 1]

export function Programs() {
  const [active, setActive] = useState(null)
  const hasPointer = useHasPointer()
  const listRef = useRef(null)

  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const px = useSpring(x, { stiffness: 150, damping: 20, mass: 0.6 })
  const py = useSpring(y, { stiffness: 150, damping: 20, mass: 0.6 })

  // Cache the list box and only re-measure after a scroll or resize, rather
  // than forcing a layout on every pointer event over the list.
  const rectRef = useRef(null)
  const stale = useRef(true)

  useEffect(() => {
    const invalidate = () => {
      stale.current = true
    }
    window.addEventListener('scroll', invalidate, { passive: true })
    window.addEventListener('resize', invalidate)
    return () => {
      window.removeEventListener('scroll', invalidate)
      window.removeEventListener('resize', invalidate)
    }
  }, [])

  const onMove = (e) => {
    if (!hasPointer || !listRef.current) return
    if (stale.current || !rectRef.current) {
      rectRef.current = listRef.current.getBoundingClientRect()
      stale.current = false
    }
    const rect = rectRef.current
    x.set(e.clientX - rect.left - 130)
    y.set(e.clientY - rect.top - 155)
  }

  return (
    <section id="programs" className="relative overflow-hidden bg-ink py-24 text-smoke md:py-32">
      <div className="edge">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <Reveal y={16}>
              <span className="eyebrow text-ball">What you can join</span>
            </Reveal>
            <SplitText
              as="h2"
              text="Programs Built Around Progress"
              className="display mt-3 max-w-[16ch] text-[40px] md:text-[64px]"
              stagger={0.05}
            />
          </div>
          <Reveal delay={0.2} y={18}>
            <p className="max-w-[34ch] text-[14px] leading-relaxed text-white/50">
              Every track is levelled, capped and coached by the same people who run our
              performance squads. Pick one, or stack them.
            </p>
          </Reveal>
        </div>

        {/* ---- Expanding rows ------------------------------------------ */}
        <div
          ref={listRef}
          className="relative mt-14"
          onMouseMove={onMove}
          onMouseLeave={() => setActive(null)}
        >
          {/* Cursor-tracked preview — sits under the rows so the title
              you are actually hovering stays readable on top of it. */}
          {hasPointer && (
            <motion.div
              className="pointer-events-none absolute left-0 top-0 z-0 h-[310px] w-[260px] overflow-hidden rounded-2xl"
              style={{ x: px, y: py }}
              animate={{
                opacity: active === null ? 0 : 1,
                scale: active === null ? 0.85 : 1,
                rotate: active === null ? -8 : -4,
              }}
              transition={{ duration: 0.45, ease: EASE }}
              aria-hidden="true"
            >
              <AnimatePresence mode="popLayout">
                {active !== null && (
                  <motion.img
                    key={PROGRAMS[active].id}
                    src={PROGRAMS[active].image}
                    alt=""
                    initial={{ opacity: 0, scale: 1.2 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.45, ease: EASE }}
                    className="h-full w-full object-cover"
                  />
                )}
              </AnimatePresence>
              <div className="absolute inset-0 bg-ink/35" />
            </motion.div>
          )}

          <ul className="relative z-10 border-t border-white/12">
            {PROGRAMS.map((program, i) => (
              <li key={program.id} className="border-b border-white/12">
                <motion.a
                  href="#membership"
                  onMouseEnter={() => setActive(i)}
                  onFocus={() => setActive(i)}
                  onBlur={() => setActive(null)}
                  data-cursor="view"
                  data-cursor-label="Join"
                  className="group relative flex items-center gap-5 py-6 md:gap-10 md:py-8"
                  animate={{ opacity: active === null || active === i ? 1 : 0.35 }}
                  transition={{ duration: 0.4 }}
                >
                  {/* Wash that sweeps in behind the active row */}
                  <motion.span
                    className="absolute inset-x-[-2vw] inset-y-0 -z-10 rounded-xl bg-white/[0.04]"
                    initial={false}
                    animate={{ opacity: active === i ? 1 : 0 }}
                    transition={{ duration: 0.35 }}
                    aria-hidden="true"
                  />

                  <span className="w-8 shrink-0 text-[11px] tabular-nums text-white/35">
                    {program.id}
                  </span>

                  <motion.h3
                    className="font-display text-[26px] font-semibold tracking-tight md:text-[40px]"
                    animate={{ x: active === i ? 18 : 0 }}
                    transition={{ duration: 0.5, ease: EASE }}
                  >
                    {program.title}
                  </motion.h3>

                  <p className="ml-auto hidden max-w-[34ch] text-[13px] leading-snug text-white/45 lg:block">
                    {program.copy}
                  </p>

                  <span className="ml-auto shrink-0 text-[12px] text-white/70 lg:ml-8">
                    {program.price}
                  </span>

                  <motion.span
                    className="shrink-0 text-ball"
                    animate={{ opacity: active === i ? 1 : 0.2, rotate: active === i ? 0 : -45 }}
                    transition={{ duration: 0.45, ease: EASE }}
                    aria-hidden="true"
                  >
                    <Arrow className="h-5 w-5 md:h-6 md:w-6" />
                  </motion.span>
                </motion.a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}

function Arrow({ className }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className={className}>
      <path d="M5 19L19 5M19 5H9M19 5v10" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}
