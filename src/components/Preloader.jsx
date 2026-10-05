import { useEffect, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { startScroll, stopScroll } from '../lib/scroll'

const WORDS = ['Serve', 'Rally', 'Volley', 'Match']
const EASE = [0.76, 0, 0.24, 1]

export function Preloader({ onDone }) {
  const reduced = useReducedMotion()
  const [count, setCount] = useState(0)
  const [word, setWord] = useState(0)
  const [leaving, setLeaving] = useState(false)

  const DURATION = reduced ? 400 : 2200

  useEffect(() => {
    stopScroll()
    window.scrollTo(0, 0)

    let frame = 0
    let start = null
    const ease = (t) => 1 - Math.pow(1 - t, 3)

    const tick = (now) => {
      if (start === null) start = now
      const p = Math.min((now - start) / DURATION, 1)
      setCount(Math.round(ease(p) * 100))
      setWord(Math.min(WORDS.length - 1, Math.floor(ease(p) * WORDS.length)))
      if (p < 1) frame = requestAnimationFrame(tick)
      else setLeaving(true)
    }

    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [DURATION])

  useEffect(() => {
    if (!leaving) return undefined
    const t = setTimeout(
      () => {
        startScroll()
        onDone?.()
      },
      reduced ? 60 : 1100,
    )
    return () => clearTimeout(t)
  }, [leaving, onDone, reduced])

  return (
    <AnimatePresence>
      {!leaving || reduced ? (
        <motion.div
          key="preloader"
          className="fixed inset-0 z-[100] flex flex-col justify-between overflow-hidden bg-ink edge py-8 text-smoke"
          exit={{ opacity: 0 }}
        >
          <PreloaderBody count={count} word={word} />
        </motion.div>
      ) : (
        <motion.div
          key="curtain"
          className="fixed inset-0 z-[100] flex flex-col justify-between overflow-hidden bg-ink edge py-8 text-smoke"
          initial={{ clipPath: 'inset(0% 0% 0% 0%)' }}
          animate={{ clipPath: 'inset(0% 0% 100% 0%)' }}
          transition={{ duration: 1.05, ease: EASE }}
          onAnimationComplete={() => undefined}
        >
          <motion.div
            animate={{ y: -60, opacity: 0 }}
            transition={{ duration: 0.8, ease: EASE }}
            className="flex h-full flex-col justify-between"
          >
            <PreloaderBody count={100} word={WORDS.length - 1} />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

function PreloaderBody({ count, word }) {
  return (
    <>
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2">
          <Flower className="h-5 w-5 text-ball" />
          <span className="font-display text-sm font-semibold tracking-[0.16em]">TENISTA</span>
        </div>
        <span className="eyebrow text-white/45">Est. 2004 — Members Only</span>
      </div>

      <div className="relative flex flex-1 items-center">
        {/* Ball rolling the width of the loader, squashing on each bounce. */}
        <motion.div
          className="absolute bottom-10 left-0 h-9 w-9 rounded-full bg-ball shadow-[0_0_40px_rgba(216,242,75,0.5)]"
          initial={{ x: '0vw' }}
          animate={{ x: ['0vw', '84vw'], y: [0, -70, 0, -34, 0, -12, 0] }}
          transition={{
            x: { duration: 2.2, ease: 'linear' },
            y: { duration: 2.2, times: [0, 0.18, 0.36, 0.54, 0.72, 0.86, 1], ease: 'easeOut' },
          }}
        >
          <div className="absolute inset-0 rounded-full border-t-2 border-white/50" />
        </motion.div>

        <div className="overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.h2
              key={word}
              initial={{ y: '100%', opacity: 0 }}
              animate={{ y: '0%', opacity: 1 }}
              exit={{ y: '-100%', opacity: 0 }}
              transition={{ duration: 0.5, ease: EASE }}
              className="display text-[16vw] leading-none md:text-[11vw]"
            >
              {WORDS[word]}
            </motion.h2>
          </AnimatePresence>
        </div>
      </div>

      <div className="flex items-end justify-between">
        <div className="h-[2px] w-1/2 max-w-md overflow-hidden bg-white/15">
          <motion.div
            className="h-full bg-ball"
            style={{ width: `${count}%` }}
            transition={{ duration: 0 }}
          />
        </div>
        <span className="display text-[14vw] leading-none md:text-[7vw]">
          {String(count).padStart(3, '0')}
        </span>
      </div>
    </>
  )
}

function Flower({ className }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M12 2c1.6 0 2.9 1.3 2.9 2.9 0 .5-.1.9-.3 1.3 .4-.2.8-.3 1.3-.3 1.6 0 2.9 1.3 2.9 2.9S17.5 11.7 15.9 11.7c-.5 0-.9-.1-1.3-.3 .2.4.3.8.3 1.3 0 1.6-1.3 2.9-2.9 2.9s-2.9-1.3-2.9-2.9c0-.5.1-.9.3-1.3-.4.2-.8.3-1.3.3C6.5 11.7 5.2 10.4 5.2 8.8S6.5 5.9 8.1 5.9c.5 0 .9.1 1.3.3-.2-.4-.3-.8-.3-1.3C9.1 3.3 10.4 2 12 2z" />
      <path d="M11 15h2l.6 7h-3.2L11 15z" />
    </svg>
  )
}
