import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { Reveal } from '../components/ui/Reveal'
import { SplitText } from '../components/ui/SplitText'
import { HighlightText } from '../components/ui/HighlightText'
import { Counter } from '../components/ui/Counter'

export function Trust() {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const ringRotate = useTransform(scrollYProgress, [0, 1], [0, 220])
  const badgeY = useTransform(scrollYProgress, [0, 1], [60, -60])

  return (
    <section id="trust" ref={ref} className="relative bg-smoke pb-24 pt-20 md:pb-32 md:pt-28">
      <div className="edge grid gap-12 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:items-start lg:gap-16">
        {/* --- 100% seal ------------------------------------------------ */}
        <motion.div style={{ y: badgeY }} className="flex justify-center lg:justify-start lg:pt-8">
          <div className="relative h-[210px] w-[210px] shrink-0 md:h-[250px] md:w-[250px]">
            <motion.div
              style={{ rotate: ringRotate }}
              className="absolute inset-0"
              aria-hidden="true"
            >
              <svg viewBox="0 0 250 250" className="h-full w-full">
                <defs>
                  <path
                    id="seal-ring"
                    d="M125,125 m-102,0 a102,102 0 1,1 204,0 a102,102 0 1,1 -204,0"
                    fill="none"
                  />
                </defs>
                <text className="fill-ink/45 text-[11.5px] uppercase tracking-[0.3em]">
                  <textPath href="#seal-ring" startOffset="0%">
                    Tenista Club · Certified Coaching · Since 2004 ·
                  </textPath>
                </text>
              </svg>
            </motion.div>

            <motion.div
              initial={{ scale: 0.82, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
              className="absolute inset-[26px] flex flex-col items-center justify-center rounded-full bg-white text-center shadow-[0_20px_50px_-24px_rgba(11,11,13,0.35)]"
            >
              <span className="display text-[42px] leading-none md:text-[48px]">
                <Counter value={100} suffix="%" />
              </span>
              <span className="mt-2 max-w-[120px] text-[11px] leading-snug text-ink/55">
                Train with the Best to Become Your Best
              </span>
            </motion.div>
          </div>
        </motion.div>

        {/* --- #01 trust card ------------------------------------------- */}
        <Reveal y={48} className="lg:pl-6">
          <div className="rounded-[28px] bg-white p-7 shadow-[0_30px_70px_-40px_rgba(11,11,13,0.3)] md:p-10">
            <div className="grid gap-6 md:grid-cols-[auto_minmax(0,1fr)] md:gap-10">
              <span className="display text-[44px] leading-none text-ink md:text-[54px]">#01</span>
              <div>
                <SplitText
                  as="h2"
                  text="It Is Also Highly Trusted"
                  className="font-display text-[26px] font-semibold tracking-tight md:text-[32px]"
                  stagger={0.05}
                />
                <HighlightText
                  className="mt-4 max-w-[46ch] text-[15px] leading-relaxed md:text-[16px]"
                  text="Join thousands who rely on our program, built with experience, backed by results, and trusted by players who came here to get measurably better."
                />
              </div>
            </div>

            <div className="mt-9 grid grid-cols-2 gap-px overflow-hidden rounded-2xl bg-ink/10 sm:grid-cols-4">
              {[
                ['09', 'Clubs'],
                ['42', 'Coaches'],
                ['31', 'Courts'],
                ['20', 'Years'],
              ].map(([v, l], i) => (
                <Reveal
                  key={l}
                  delay={i * 0.07}
                  y={20}
                  className="bg-white px-4 py-5 text-center sm:text-left"
                >
                  <p className="display text-[30px] leading-none">
                    <Counter value={Number(v)} />
                  </p>
                  <p className="mt-1 text-[11px] uppercase tracking-[0.12em] text-ink/45">{l}</p>
                </Reveal>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
