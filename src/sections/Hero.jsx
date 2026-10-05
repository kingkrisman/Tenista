import { useEffect, useRef, useState } from 'react'
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from 'framer-motion'
import { img } from '../lib/media'
import { AVATARS, COLLECTIONS, HERO_NAMES } from '../lib/content'
import { Counter } from '../components/ui/Counter'
import { Magnetic } from '../components/ui/Magnetic'
import { scrollTo } from '../lib/scroll'
import { useHasPointer } from '../hooks/useMediaQuery'

const EASE = [0.16, 1, 0.3, 1]
const HERO_IMG = img('bluePlayer', { w: 1600, h: 960, q: 78 })

/** Where the subject sits in the frame — drives the cut-out mask. */
const SUBJECT = { x: '52%', y: '52%', rx: '26%', ry: '54%' }
const SUBJECT_MASK = `radial-gradient(ellipse ${SUBJECT.rx} ${SUBJECT.ry} at ${SUBJECT.x} ${SUBJECT.y}, #000 42%, rgba(0,0,0,0.85) 58%, transparent 76%)`

export function Hero({ ready }) {
  const ref = useRef(null)
  const reduced = useReducedMotion()
  const hasPointer = useHasPointer()

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  })

  // Scroll choreography: the plate shrinks and rounds off, type outruns the image.
  const imgScale = useTransform(scrollYProgress, [0, 1], [1, 1.22])
  const imgY = useTransform(scrollYProgress, [0, 1], ['0%', '14%'])
  const titleY = useTransform(scrollYProgress, [0, 1], ['0%', '-140%'])
  const titleOpacity = useTransform(scrollYProgress, [0, 0.55], [1, 0])
  const chromeOpacity = useTransform(scrollYProgress, [0, 0.4], [1, 0])
  const radius = useTransform(scrollYProgress, [0, 1], [0, 56])
  const inset = useTransform(scrollYProgress, [0, 1], [0, 26])
  const insetPx = useTransform(inset, (v) => `${v}px`)

  // Pointer parallax for the floating chrome.
  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const pmx = useSpring(mx, { stiffness: 90, damping: 20 })
  const pmy = useSpring(my, { stiffness: 90, damping: 20 })
  const driftA = useTransform(pmx, [-1, 1], [-18, 18])
  const driftB = useTransform(pmx, [-1, 1], [14, -14])
  const driftAY = useTransform(pmy, [-1, 1], [-12, 12])

  // The hero fills the viewport, so normalise against the window instead of
  // measuring the section. Reading a rect here ran a forced layout on every
  // mousemove across the whole first screen.
  const onMove = (e) => {
    if (!hasPointer || reduced) return
    mx.set((e.clientX / window.innerWidth - 0.5) * 2)
    my.set((e.clientY / window.innerHeight - 0.5) * 2)
  }

  return (
    <section
      id="top"
      ref={ref}
      onMouseMove={onMove}
      className="relative h-[108svh] min-h-[620px] bg-smoke"
    >
      <motion.div
        style={{ left: insetPx, right: insetPx, borderRadius: radius }}
        className="sticky top-0 h-[100svh] min-h-[600px] overflow-hidden bg-court-900"
      >
        {/* ---- Base plate ---------------------------------------------- */}
        <motion.div className="absolute inset-0" style={{ scale: imgScale, y: imgY }}>
          <motion.img
            src={HERO_IMG}
            alt="A player on a floodlit blue hard court"
            fetchPriority="high"
            className="h-full w-full object-cover"
            initial={reduced ? false : { scale: 1.3, filter: 'blur(26px)' }}
            animate={ready ? { scale: 1, filter: 'blur(0px)' } : {}}
            transition={{ duration: 2.1, ease: EASE }}
          />
          {/* Grade the frame toward the deep court blue of the brand. */}
          <div className="absolute inset-0 bg-court-700/35 mix-blend-color" />
          <div className="absolute inset-0 bg-gradient-to-b from-court-900/60 via-court-700/10 to-court-900/75" />
          <div className="absolute inset-0 bg-gradient-to-r from-court-900/55 via-transparent to-court-900/45" />
        </motion.div>

        {/* ---- Speed streaks ------------------------------------------- */}
        {!reduced && <Streaks ready={ready} />}

        {/* ---- Headline ------------------------------------------------- */}
        <motion.div
          style={{ y: titleY, opacity: titleOpacity }}
          className="pointer-events-none absolute inset-x-0 top-[18%] z-10 edge"
        >
          <h1 className="display text-white" aria-label="Move Faster">
            {/* Two words pushed to the gutters — the player stands in the gap. */}
            <span className="flex justify-between text-[15vw] leading-[0.82] tracking-supertight">
              {['MOVE', 'FASTER'].map((word, w) => (
                <span key={word} className="flex">
                  {Array.from(word).map((ch, i) => (
                    <motion.span
                      key={i}
                      aria-hidden="true"
                      className="inline-block"
                      initial={reduced ? false : { y: '120%', opacity: 0, rotate: 5 }}
                      animate={ready ? { y: '0%', opacity: 1, rotate: 0 } : {}}
                      transition={{
                        duration: 1.15,
                        delay: 0.15 + (w * 4 + i) * 0.045,
                        ease: EASE,
                      }}
                    >
                      {ch}
                    </motion.span>
                  ))}
                </span>
              ))}
            </span>
          </h1>
        </motion.div>

        {/* ---- Subject cut-out: lifts the player in front of the type ---- */}
        <motion.div
          className="pointer-events-none absolute inset-0 z-20"
          style={{
            scale: imgScale,
            y: imgY,
            maskImage: SUBJECT_MASK,
            WebkitMaskImage: SUBJECT_MASK,
          }}
          initial={reduced ? false : { opacity: 0 }}
          animate={ready ? { opacity: 1 } : {}}
          transition={{ duration: 1.4, delay: 0.5, ease: EASE }}
        >
          {/* No blend layer here on purpose. A second full-viewport
              mix-blend-color inside a scroll-transformed container recomposites
              every frame, and the grade is barely readable through the mask
              anyway — dropping it also helps the subject read as nearer. */}
          <img src={HERO_IMG} alt="" aria-hidden="true" className="h-full w-full object-cover" />
        </motion.div>

        {/* ---- Floating chrome ------------------------------------------ */}
        <motion.div style={{ opacity: chromeOpacity }} className="absolute inset-0 z-30">
          {/* Roster names scattered across the mid-line */}
          <div className="absolute inset-x-0 top-[43%] hidden edge md:block">
            <div className="flex justify-between">
              {HERO_NAMES.map((p, i) => (
                <motion.div
                  key={p.surname}
                  initial={reduced ? false : { opacity: 0, y: 14 }}
                  animate={ready ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.8, delay: 1.05 + i * 0.12, ease: EASE }}
                  className="text-[11px] leading-tight text-white/80"
                >
                  <div>{p.name}</div>
                  <div className="text-white/50">{p.surname}</div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Bottom-left tagline */}
          <motion.div
            style={{ x: driftB }}
            className="absolute bottom-[8%] left-0 edge"
          >
            <h2 className="display text-[9vw] leading-[0.88] text-white/45 md:text-[4.6vw]">
              {['GAME ON,', 'PLAY HARD'].map((line, i) => (
                <span key={line} className="line-mask">
                  <motion.span
                    className="inline-block"
                    initial={reduced ? false : { y: '110%' }}
                    animate={ready ? { y: '0%' } : {}}
                    transition={{ duration: 1.1, delay: 0.9 + i * 0.1, ease: EASE }}
                  >
                    {line}
                  </motion.span>
                </span>
              ))}
            </h2>
          </motion.div>

          {/* Collections card */}
          <motion.div
            style={{ x: driftA, y: driftAY }}
            initial={reduced ? false : { opacity: 0, y: 40, scale: 0.94 }}
            animate={ready ? { opacity: 1, y: 0, scale: 1 } : {}}
            transition={{ duration: 1, delay: 1.2, ease: EASE }}
            className="absolute right-[6%] top-[52%] hidden w-[330px] lg:block"
          >
            <CollectionsCard />
          </motion.div>

          {/* Membership stat card */}
          <motion.div
            style={{ x: driftB }}
            initial={reduced ? false : { opacity: 0, y: 46, scale: 0.94 }}
            animate={ready ? { opacity: 1, y: 0, scale: 1 } : {}}
            transition={{ duration: 1, delay: 1.35, ease: EASE }}
            className="absolute bottom-[24%] right-[4%] w-[235px] sm:bottom-[7%] sm:w-[280px]"
          >
            <MembershipCard />
          </motion.div>

          {/* Scroll cue */}
          <motion.button
            type="button"
            onClick={() => scrollTo('#trust')}
            initial={reduced ? false : { opacity: 0 }}
            animate={ready ? { opacity: 1 } : {}}
            transition={{ duration: 0.8, delay: 1.6 }}
            className="absolute bottom-7 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 text-white/70 lg:flex"
            aria-label="Scroll to next section"
          >
            <span className="eyebrow">Scroll</span>
            <span className="relative block h-9 w-[1px] overflow-hidden bg-white/25">
              <motion.span
                className="absolute inset-x-0 top-0 h-3 bg-ball"
                animate={{ y: [-12, 36] }}
                transition={{ duration: 1.7, repeat: Infinity, ease: 'easeInOut' }}
              />
            </span>
          </motion.button>
        </motion.div>
      </motion.div>
    </section>
  )
}

/* ------------------------------------------------------------------ */

function Streaks({ ready }) {
  const bars = [
    { top: '22%', w: 180, d: 0 },
    { top: '38%', w: 120, d: 0.5 },
    { top: '61%', w: 240, d: 1.1 },
    { top: '74%', w: 90, d: 1.8 },
  ]
  return (
    <div className="pointer-events-none absolute inset-0 z-[5] overflow-hidden" aria-hidden="true">
      {bars.map((b, i) => (
        <motion.span
          key={i}
          className="absolute h-[2px] rounded-full bg-gradient-to-r from-transparent via-white/45 to-transparent"
          style={{ top: b.top, width: b.w }}
          initial={{ x: '-30vw', opacity: 0 }}
          animate={ready ? { x: ['-30vw', '120vw'], opacity: [0, 0.9, 0] } : {}}
          transition={{
            duration: 2.4,
            delay: 1.6 + b.d,
            repeat: Infinity,
            repeatDelay: 4.5,
            ease: 'easeOut',
          }}
        />
      ))}
    </div>
  )
}

function CollectionsCard() {
  const [i, setI] = useState(0)
  const [paused, setPaused] = useState(false)
  const item = COLLECTIONS[i]

  useEffect(() => {
    if (paused) return undefined
    const t = setInterval(() => setI((v) => (v + 1) % COLLECTIONS.length), 4200)
    return () => clearInterval(t)
  }, [paused])

  return (
    <div
      className="glass glass-blur rounded-2xl p-3 text-white shadow-[0_24px_60px_-20px_rgba(4,20,52,0.6)]"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="flex gap-3">
        <div className="relative h-[72px] w-[72px] shrink-0 overflow-hidden rounded-xl">
          <AnimatePresence mode="popLayout">
            <motion.img
              key={item.image}
              src={item.image}
              alt=""
              initial={{ opacity: 0, scale: 1.2 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.94 }}
              transition={{ duration: 0.55, ease: EASE }}
              className="absolute inset-0 h-full w-full object-cover"
            />
          </AnimatePresence>
        </div>

        <div className="min-w-0 flex-1">
          <AnimatePresence mode="wait">
            <motion.div
              key={item.brand}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4, ease: EASE }}
            >
              <p className="text-[11px] font-semibold uppercase leading-tight tracking-[0.08em]">
                {item.brand}
              </p>
              <p className="text-[11px] uppercase leading-tight tracking-[0.08em] text-white/70">
                {item.title}
              </p>
              <p className="mt-1.5 line-clamp-2 text-[10.5px] leading-snug text-white/60">
                {item.copy}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      <div className="mt-3 flex items-center justify-between border-t border-white/15 pt-2.5">
        <a
          href="#facilities"
          onClick={(e) => {
            e.preventDefault()
            scrollTo('#facilities')
          }}
          className="group flex items-center gap-1.5 text-[10.5px] uppercase tracking-[0.1em]"
        >
          See Collections
          <span className="transition-transform duration-500 ease-swift group-hover:translate-x-1">
            →
          </span>
        </a>
        <div className="flex gap-1.5">
          {COLLECTIONS.map((c, idx) => (
            <button
              key={c.brand}
              type="button"
              onClick={() => setI(idx)}
              aria-label={`Show ${c.brand}`}
              className="p-1"
            >
              <span
                className={`block h-[5px] rounded-full transition-all duration-500 ${
                  idx === i ? 'w-4 bg-white' : 'w-[5px] bg-white/40'
                }`}
              />
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

function MembershipCard() {
  return (
    <div className="glass-dark flex gap-3 rounded-2xl p-3 text-white shadow-[0_24px_60px_-20px_rgba(4,20,52,0.7)]">
      <div className="flex flex-1 flex-col justify-between">
        <p className="display text-[34px] leading-none">
          <Counter value={18} suffix="K+" />
        </p>
        <div>
          <div className="flex -space-x-2">
            {AVATARS.map((a, i) => (
              <motion.img
                key={a}
                src={a}
                alt=""
                className="h-7 w-7 rounded-full border-2 border-white/70 object-cover"
                whileHover={{ y: -5, scale: 1.12, zIndex: 5 }}
                transition={{ type: 'spring', stiffness: 400, damping: 18 }}
              />
            ))}
            <span className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-white/70 bg-ball text-[9px] font-semibold text-ink">
              +9
            </span>
          </div>
          <p className="mt-2 text-[10.5px] text-white/70">12k+ Membership</p>
        </div>
      </div>

      <Magnetic strength={0.2} className="shrink-0">
        <div className="h-[96px] w-[86px] overflow-hidden rounded-xl">
          <img
            src={img('forehand', { w: 200, h: 240 })}
            alt=""
            className="h-full w-full object-cover transition-transform duration-700 ease-swift hover:scale-110"
          />
        </div>
      </Magnetic>
    </div>
  )
}
