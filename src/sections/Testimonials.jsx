import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { TESTIMONIALS } from '../lib/content'
import { SplitText } from '../components/ui/SplitText'

const EASE = [0.16, 1, 0.3, 1]

export function Testimonials() {
  const [i, setI] = useState(0)
  const [paused, setPaused] = useState(false)
  const item = TESTIMONIALS[i]

  useEffect(() => {
    if (paused) return undefined
    const t = setInterval(() => setI((v) => (v + 1) % TESTIMONIALS.length), 6000)
    return () => clearInterval(t)
  }, [paused])

  return (
    <section
      className="bg-smoke pb-24 md:pb-32"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="edge">
        <div className="rounded-[32px] bg-court-600 p-7 text-white md:rounded-[44px] md:p-14">
          <SplitText
            as="span"
            text="What members say"
            className="eyebrow block text-white/60"
            stagger={0.03}
          />

          <div className="relative mt-8 min-h-[190px] md:min-h-[230px]">
            <AnimatePresence mode="wait">
              <motion.blockquote
                key={item.name}
                initial={{ opacity: 0, y: 26, filter: 'blur(8px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                exit={{ opacity: 0, y: -26, filter: 'blur(8px)' }}
                transition={{ duration: 0.65, ease: EASE }}
                className="absolute inset-0"
              >
                <p className="font-display text-[22px] font-medium leading-[1.22] tracking-tight md:text-[38px] md:leading-[1.14]">
                  “{item.quote}”
                </p>
                <footer className="mt-7 flex items-center gap-3">
                  <img
                    src={item.avatar}
                    alt=""
                    className="h-11 w-11 rounded-full border-2 border-white/40 object-cover"
                  />
                  <div>
                    <p className="text-[13px] font-semibold">{item.name}</p>
                    <p className="text-[12px] text-white/60">{item.role}</p>
                  </div>
                </footer>
              </motion.blockquote>
            </AnimatePresence>
          </div>

          <div className="mt-8 flex items-center gap-3 border-t border-white/20 pt-6">
            {TESTIMONIALS.map((t, idx) => (
              <button
                key={t.name}
                type="button"
                onClick={() => setI(idx)}
                aria-label={`Read the quote from ${t.name}`}
                className="group relative h-[3px] flex-1 overflow-hidden rounded-full bg-white/25"
              >
                <motion.span
                  className="absolute inset-y-0 left-0 bg-ball"
                  initial={{ width: '0%' }}
                  animate={{ width: idx === i ? '100%' : '0%' }}
                  transition={{
                    duration: idx === i && !paused ? 6 : 0.4,
                    ease: idx === i && !paused ? 'linear' : EASE,
                  }}
                />
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
