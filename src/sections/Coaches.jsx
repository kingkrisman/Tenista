import { useCallback, useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import { COACHES } from '../lib/content'
import { Magnetic } from '../components/ui/Magnetic'

const EASE = [0.16, 1, 0.3, 1]
const N = COACHES.length

export function Coaches() {
  const ref = useRef(null)
  const reduced = useReducedMotion()
  const [index, setIndex] = useState(0)
  const [dir, setDir] = useState(1)

  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const xBack = useTransform(scrollYProgress, [0, 1], ['-8%', '6%'])
  const xFront = useTransform(scrollYProgress, [0, 1], ['6%', '-9%'])

  const paginate = useCallback((d) => {
    setDir(d)
    setIndex((v) => (v + d + N) % N)
  }, [])

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'ArrowRight') paginate(1)
      if (e.key === 'ArrowLeft') paginate(-1)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [paginate])

  const active = COACHES[index]

  return (
    <section
      id="coaches"
      ref={ref}
      className="relative overflow-hidden bg-smoke py-24 md:py-32"
      aria-roledescription="carousel"
      aria-label="Our coaches"
    >
      {/* ---- Kinetic type running behind the deck --------------------- */}
      <div className="pointer-events-none absolute inset-0 flex flex-col justify-center gap-[1vh]">
        <motion.div
          style={{ x: reduced ? 0 : xBack }}
          className="display whitespace-nowrap text-[15vw] leading-[0.9] text-ink/20"
          aria-hidden="true"
        >
          Skilled — Quality — Skilled — Quality —
        </motion.div>
        <motion.div
          style={{ x: reduced ? 0 : xFront }}
          className="display whitespace-nowrap text-[15vw] leading-[0.9] text-ink"
          aria-hidden="true"
        >
          Focused — Instructors — Focused — Instructors —
        </motion.div>
      </div>

      <div className="relative z-10 edge">
        {/* Extra side room on phones so the rotated plate never touches the edge. */}
        <div className="mx-auto flex max-w-[420px] flex-col items-center px-5 sm:px-0">
          {/* ---- Card deck --------------------------------------------- */}
          <div
            className="relative h-[430px] w-full sm:h-[500px]"
            style={{ perspective: 1400 }}
            data-cursor="drag"
            data-cursor-label="Drag"
          >
            {/* Blue plate peeking out from behind the deck */}
            <motion.div
              className="absolute -inset-4 rounded-[30px] bg-court-600"
              initial={{ rotate: -12, opacity: 0, scale: 0.9 }}
              whileInView={{ rotate: -9, opacity: 1, scale: 1 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 1.1, ease: EASE }}
              aria-hidden="true"
            />

            {COACHES.map((coach, i) => {
              const pos = (i - index + N) % N
              if (pos > 2) return null
              return (
                <DeckCard
                  key={coach.name}
                  coach={coach}
                  pos={pos}
                  isTop={pos === 0}
                  dir={dir}
                  reduced={reduced}
                  onSwipe={paginate}
                />
              )
            })}
          </div>

          {/* ---- Name tag ---------------------------------------------- */}
          <div className="relative mt-6 h-[52px] w-full max-w-[300px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={active.name}
                initial={{ opacity: 0, y: 16, filter: 'blur(6px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                exit={{ opacity: 0, y: -16, filter: 'blur(6px)' }}
                transition={{ duration: 0.45, ease: EASE }}
                className="absolute inset-0 flex items-center justify-between rounded-full bg-white/95 px-5 py-3"
              >
                <div>
                  <p className="text-[11px] uppercase tracking-[0.12em] text-ink/40">Coaching</p>
                  <p className="text-[13px] font-semibold leading-tight">{active.spec}</p>
                </div>
                <div className="text-right">
                  <p className="text-[11px] uppercase tracking-[0.12em] text-ink/40">Experience</p>
                  <p className="text-[13px] font-semibold leading-tight">{active.years}</p>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* ---- Controls ---------------------------------------------- */}
          <div className="mt-7 flex w-full items-center justify-between">
            <Magnetic strength={0.45}>
              <button
                type="button"
                onClick={() => paginate(-1)}
                aria-label="Previous coach"
                className="flex h-12 w-12 items-center justify-center rounded-full border border-ink/25 text-ink transition-colors duration-300 hover:border-ink hover:bg-ink hover:text-smoke"
              >
                <Chevron className="h-4 w-4 rotate-180" />
              </button>
            </Magnetic>

            <div className="flex items-center gap-2" role="tablist">
              {COACHES.map((c, i) => (
                <button
                  key={c.name}
                  type="button"
                  role="tab"
                  aria-selected={i === index}
                  aria-label={`Show ${c.name}`}
                  onClick={() => {
                    setDir(i > index ? 1 : -1)
                    setIndex(i)
                  }}
                  className="p-1.5"
                >
                  <span
                    className={`block h-[6px] rounded-full transition-all duration-500 ease-swift ${
                      i === index ? 'w-6 bg-ink' : 'w-[6px] bg-ink/25'
                    }`}
                  />
                </button>
              ))}
            </div>

            <Magnetic strength={0.45}>
              <button
                type="button"
                onClick={() => paginate(1)}
                aria-label="Next coach"
                className="flex h-12 w-12 items-center justify-center rounded-full bg-ink text-smoke transition-transform duration-300 hover:scale-105"
              >
                <Chevron className="h-4 w-4" />
              </button>
            </Magnetic>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */

function DeckCard({ coach, pos, isTop, dir, reduced, onSwipe }) {
  return (
    <motion.div
      className="absolute inset-0 origin-bottom overflow-hidden rounded-[26px] bg-court-700 shadow-[0_40px_80px_-40px_rgba(11,11,13,0.55)]"
      style={{ zIndex: 10 - pos, cursor: isTop ? 'grab' : 'default' }}
      initial={reduced ? false : { opacity: 0, y: 60, scale: 0.92 }}
      animate={{
        opacity: 1,
        y: pos * -14,
        scale: 1 - pos * 0.055,
        rotate: pos === 0 ? -3 : pos * 2.5 - 3,
        x: pos * 10,
      }}
      transition={{ type: 'spring', stiffness: 220, damping: 28, mass: 0.9 }}
      drag={isTop && !reduced ? 'x' : false}
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.5}
      whileDrag={{ cursor: 'grabbing', scale: 1.02 }}
      onDragEnd={(_, info) => {
        if (info.offset.x < -70 || info.velocity.x < -450) onSwipe(1)
        else if (info.offset.x > 70 || info.velocity.x > 450) onSwipe(-1)
      }}
    >
      <img
        src={coach.image}
        alt={`${coach.name}, ${coach.role}`}
        draggable="false"
        className="pointer-events-none h-full w-full select-none object-cover"
      />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-court-900/70 via-transparent to-transparent" />

      {isTop && (
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15, ease: EASE }}
          className="absolute bottom-4 left-4 right-4 flex items-end justify-between"
        >
          <span className="glass-scrim rounded-full px-3.5 py-2 text-[11px] font-medium text-white">
            {coach.name}
            <span className="ml-2 text-white/60">{coach.role}</span>
          </span>
          <span className="glass-scrim rounded-full px-2.5 py-2 text-[10px] uppercase tracking-[0.1em] text-white/80">
            {String(dir === 1 ? '→' : '←')}
          </span>
        </motion.div>
      )}
    </motion.div>
  )
}

function Chevron({ className }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className}>
      <path d="M9 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}
