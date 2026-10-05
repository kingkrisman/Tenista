import { useEffect, useRef, useState } from 'react'
import { motion, useReducedMotion, useScroll, useSpring, useTransform } from 'framer-motion'
import { COURTS } from '../lib/content'
import { img } from '../lib/media'
import { SplitText } from '../components/ui/SplitText'
import { Reveal } from '../components/ui/Reveal'
import { Magnetic } from '../components/ui/Magnetic'
import { useMediaQuery } from '../hooks/useMediaQuery'
import { scrollTo } from '../lib/scroll'

export function Facilities() {
  const isDesktop = useMediaQuery('(min-width: 1024px)')
  const reduced = useReducedMotion()
  const pinned = isDesktop && !reduced

  const sectionRef = useRef(null)
  const viewportRef = useRef(null)
  const trackRef = useRef(null)
  const [travel, setTravel] = useState(0)

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end'],
  })

  useEffect(() => {
    if (!pinned) {
      setTravel(0)
      return undefined
    }
    const measure = () => {
      const track = trackRef.current
      const viewport = viewportRef.current
      if (!track || !viewport) return
      setTravel(Math.max(0, track.scrollWidth - viewport.clientWidth))
    }
    measure()
    const ro = new ResizeObserver(measure)
    if (trackRef.current) ro.observe(trackRef.current)
    if (viewportRef.current) ro.observe(viewportRef.current)
    window.addEventListener('resize', measure)
    return () => {
      ro.disconnect()
      window.removeEventListener('resize', measure)
    }
  }, [pinned])

  const rawX = useTransform(scrollYProgress, [0.05, 0.95], [0, -travel])
  const x = useSpring(rawX, { stiffness: 150, damping: 28, mass: 0.4 })
  const progress = useTransform(scrollYProgress, [0.05, 0.95], ['0%', '100%'])

  const panel = (
    <Panel
      pinned={pinned}
      viewportRef={viewportRef}
      trackRef={trackRef}
      x={x}
      progress={progress}
    />
  )

  return (
    <section id="facilities" className="bg-smoke pb-20 md:pb-28">
      {pinned ? (
        // The tall spacer drives the pin. Nothing between it and the sticky
        // child may clip overflow, or stickiness silently dies.
        <div
          ref={sectionRef}
          style={{ height: `calc(100svh + ${travel * 1.25}px)` }}
          className="relative"
        >
          <div className="sticky top-0 flex h-[100svh] items-center edge py-5">{panel}</div>
        </div>
      ) : (
        <div className="edge">{panel}</div>
      )}
    </section>
  )
}

/* ------------------------------------------------------------------ */

function Panel({ pinned, viewportRef, trackRef, x, progress }) {
  return (
    <div
      className={`flex w-full flex-col justify-center overflow-hidden rounded-[32px] bg-white md:rounded-[44px] ${
        pinned ? 'h-full py-10' : 'py-12'
      }`}
    >
      <div className="flex min-h-0 flex-col gap-10 lg:flex-row lg:items-center lg:gap-12">
        {/* ---- Heading column ---------------------------------------- */}
        <div className="shrink-0 px-6 md:px-10 lg:w-[320px] xl:w-[370px]">
          <Reveal y={24}>
            <div className="mb-6 h-14 w-14 overflow-hidden rounded-2xl bg-court-600">
              <img
                src={img('forehand', { w: 120, h: 120 })}
                alt=""
                className="h-full w-full object-cover opacity-80 mix-blend-luminosity"
              />
            </div>
          </Reveal>

          <SplitText
            as="h2"
            text="Take A Tour Of Our Facilities"
            className="display text-[38px] md:text-[48px]"
            stagger={0.055}
          />

          <Reveal delay={0.15} y={22}>
            <p className="mt-5 max-w-[38ch] text-[14.5px] leading-relaxed text-ink/60">
              Reserve a court for focused practice, team drills or private coaching sessions, and
              elevate your game to the next level.
            </p>
          </Reveal>

          <Reveal delay={0.25} y={22} className="mt-7">
            <Magnetic strength={0.3}>
              <button
                type="button"
                onClick={() => scrollTo('#membership')}
                data-cursor="link"
                className="group inline-flex items-center gap-3 rounded-full bg-ink py-3 pl-6 pr-3 text-[13px] text-smoke"
              >
                Book a court
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-ball text-ink transition-transform duration-500 ease-swift group-hover:rotate-45">
                  <Arrow className="h-3.5 w-3.5" />
                </span>
              </button>
            </Magnetic>
          </Reveal>

          {pinned && (
            <div className="mt-9 hidden max-w-[240px] lg:block">
              <div className="h-[3px] w-full overflow-hidden rounded-full bg-ink/10">
                <motion.div style={{ width: progress }} className="h-full bg-ink" />
              </div>
              <p className="mt-3 text-[11px] uppercase tracking-[0.14em] text-ink/40">
                Keep scrolling — {COURTS.length} courts
              </p>
            </div>
          )}
        </div>

        {/* ---- Court track -------------------------------------------- */}
        <div ref={viewportRef} className="min-w-0 flex-1 overflow-hidden">
          {pinned ? (
            <motion.div ref={trackRef} style={{ x }} className="flex w-max gap-5 pr-10">
              {COURTS.map((court, i) => (
                <CourtCard key={court.name} court={court} index={i} />
              ))}
            </motion.div>
          ) : (
            <div className="no-scrollbar flex snap-x snap-mandatory gap-4 overflow-x-auto px-6 pb-4 md:px-10">
              {COURTS.map((court, i) => (
                <div key={court.name} className="snap-start">
                  <CourtCard court={court} index={i} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function CourtCard({ court, index }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.8, delay: Math.min(index, 3) * 0.08, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -8 }}
      data-cursor="view"
      data-cursor-label="View"
      className="group relative h-[320px] w-[250px] shrink-0 overflow-hidden rounded-[22px] bg-ink sm:h-[380px] sm:w-[290px] lg:h-[420px] lg:w-[320px]"
    >
      <img
        src={court.image}
        alt={`${court.name}, a ${court.surface.toLowerCase()} court`}
        loading="lazy"
        className="h-full w-full object-cover transition-transform duration-[1.1s] ease-swift group-hover:scale-[1.07]"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-ink/75 via-ink/5 to-transparent" />

      <span className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.1em] text-ink">
        {court.surface}
      </span>

      <div className="absolute inset-x-3 bottom-3">
        <div className="glass-scrim rounded-2xl p-3.5 text-white">
          <h3 className="font-display text-[16px] font-semibold tracking-tight">{court.name}</h3>
          <p className="mt-1 text-[11.5px] leading-snug text-white/75">{court.copy}</p>
          <span className="mt-3 flex items-center gap-1.5 text-[10.5px] uppercase tracking-[0.1em] text-ball opacity-0 transition-opacity duration-500 group-hover:opacity-100">
            Reserve <Arrow className="h-3 w-3" />
          </span>
        </div>
      </div>
    </motion.article>
  )
}

function Arrow({ className }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
      <path d="M5 19L19 5M19 5H9M19 5v10" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}
