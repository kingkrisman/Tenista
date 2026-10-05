import { useEffect, useRef, useState } from 'react'
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import { SplitText } from '../components/ui/SplitText'
import { Reveal } from '../components/ui/Reveal'
import { Magnetic } from '../components/ui/Magnetic'
import { Flower } from '../components/ui/Logo'
import { scrollTo } from '../lib/scroll'

const EASE = [0.16, 1, 0.3, 1]

const FOOTER_LINKS = [
  {
    title: 'Club',
    links: ['Coaching', 'Facilities', 'Programs', 'Membership'],
  },
  {
    title: 'Play',
    links: ['Book a court', 'Match ladder', 'Junior academy', 'Events'],
  },
  {
    title: 'More',
    links: ['Shop', 'Careers', 'Press', 'Privacy'],
  },
]

export function Contact() {
  const ref = useRef(null)
  const reduced = useReducedMotion()
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)

  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end end'] })
  const markScale = useTransform(scrollYProgress, [0, 1], [0.86, 1])
  const markOpacity = useTransform(scrollYProgress, [0.2, 0.8], [0.35, 1])

  const submit = (e) => {
    e.preventDefault()
    if (!email.trim()) return
    setSent(true)
    setTimeout(() => setSent(false), 3600)
  }

  return (
    <footer id="contact" ref={ref} className="relative overflow-hidden bg-ink text-smoke">
      {/* ---- Call to action ------------------------------------------- */}
      <div className="edge pb-16 pt-24 md:pb-24 md:pt-32">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] lg:gap-20">
          <div>
            <Reveal y={16}>
              <span className="eyebrow text-ball">Ready when you are</span>
            </Reveal>
            <SplitText
              as="h2"
              text="Game On, Play Hard."
              className="display mt-4 text-[clamp(44px,9vw,120px)]"
              stagger={0.06}
            />
            <Reveal delay={0.2} y={20}>
              <p className="mt-6 max-w-[42ch] text-[15px] leading-relaxed text-white/55">
                Book a trial week. You get two squad sessions, one private hour and full run of the
                courts — no card, no commitment.
              </p>
            </Reveal>

            <Reveal delay={0.3} y={20} className="mt-10">
              <Magnetic strength={0.35}>
                <button
                  type="button"
                  onClick={() => scrollTo('#membership')}
                  data-cursor="view"
                  data-cursor-label="Go"
                  className="group inline-flex items-center gap-4 rounded-full bg-ball py-4 pl-8 pr-4 text-[15px] font-medium text-ink"
                >
                  Start a trial week
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-ink text-ball transition-transform duration-500 ease-swift group-hover:rotate-45">
                    <Arrow className="h-4 w-4" />
                  </span>
                </button>
              </Magnetic>
            </Reveal>
          </div>

          {/* ---- Signup + details -------------------------------------- */}
          <div className="flex flex-col justify-between gap-10">
            <Reveal delay={0.15} y={24}>
              <form onSubmit={submit} className="border-b border-white/20 pb-4">
                <label htmlFor="email" className="eyebrow block text-white/40">
                  Court updates, fixtures, drops
                </label>
                <div className="mt-3 flex items-center gap-3">
                  <input
                    id="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@email.com"
                    className="min-w-0 flex-1 bg-transparent py-2 text-[16px] text-white outline-none placeholder:text-white/30"
                  />
                  <button
                    type="submit"
                    data-cursor="link"
                    className="shrink-0 rounded-full bg-white/10 px-5 py-2.5 text-[12px] transition-colors duration-300 hover:bg-ball hover:text-ink"
                  >
                    {sent ? 'On the list' : 'Join'}
                  </button>
                </div>
                <motion.p
                  initial={false}
                  animate={{ opacity: sent ? 1 : 0, y: sent ? 0 : -6 }}
                  className="mt-2 text-[12px] text-ball"
                >
                  Nice. Check your inbox for a welcome from the club.
                </motion.p>
              </form>
            </Reveal>

            <Reveal delay={0.25} y={24}>
              <div className="grid grid-cols-2 gap-8 text-[13px] sm:grid-cols-3">
                {FOOTER_LINKS.map((col) => (
                  <div key={col.title}>
                    <p className="eyebrow mb-3 text-white/35">{col.title}</p>
                    <ul className="space-y-2">
                      {col.links.map((l) => (
                        <li key={l}>
                          <a
                            href="#top"
                            onClick={(e) => {
                              e.preventDefault()
                              scrollTo('#top')
                            }}
                            className="group inline-block text-white/65 transition-colors hover:text-white"
                          >
                            <span className="bg-[linear-gradient(#D8F24B,#D8F24B)] bg-[length:0%_1px] bg-left-bottom bg-no-repeat pb-[2px] transition-[background-size] duration-500 ease-swift group-hover:bg-[length:100%_1px]">
                              {l}
                            </span>
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </div>
      </div>

      {/* ---- Oversized wordmark ---------------------------------------- */}
      <motion.div
        style={{ scale: reduced ? 1 : markScale, opacity: reduced ? 1 : markOpacity }}
        className="edge origin-bottom select-none pb-6"
        aria-hidden="true"
      >
        <div className="flex items-center justify-between gap-4">
          <span className="display text-[19vw] leading-[0.8] tracking-supertight">TENISTA</span>
          <Flower className="h-[6vw] w-[6vw] shrink-0 text-ball" />
        </div>
      </motion.div>

      {/* ---- Base bar --------------------------------------------------- */}
      <div className="edge flex flex-col gap-4 border-t border-white/12 py-6 text-[11.5px] text-white/45 sm:flex-row sm:items-center sm:justify-between">
        <p>© {new Date().getFullYear()} Tenista Club. All rights reserved.</p>
        <Clock />
        <Magnetic strength={0.4}>
          <button
            type="button"
            onClick={() => scrollTo('#top')}
            data-cursor="link"
            className="group flex items-center gap-2 text-white/70 transition-colors hover:text-ball"
          >
            Back to top
            <span className="flex h-7 w-7 items-center justify-center rounded-full border border-white/25 transition-transform duration-500 ease-swift group-hover:-translate-y-1">
              <Arrow className="h-3 w-3 -rotate-45" />
            </span>
          </button>
        </Magnetic>
      </div>
    </footer>
  )
}

/* ------------------------------------------------------------------ */

function Clock() {
  const [now, setNow] = useState(() => new Date())

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(t)
  }, [])

  const time = new Intl.DateTimeFormat('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    timeZone: 'Africa/Lagos',
  }).format(now)

  return (
    <p className="tabular-nums">
      Lagos — <span className="text-white/70">{time}</span>
    </p>
  )
}

function Arrow({ className }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className}>
      <path d="M5 19L19 5M19 5H9M19 5v10" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}
