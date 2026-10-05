import { useRef } from 'react'
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion'
import { STATS } from '../lib/content'
import { img } from '../lib/media'
import { Counter } from '../components/ui/Counter'
import { Reveal } from '../components/ui/Reveal'

export function Stats() {
  const ref = useRef(null)
  const reduced = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const stripY = useTransform(scrollYProgress, [0, 1], ['-18%', '18%'])

  return (
    <section ref={ref} className="relative bg-smoke py-20 md:py-28">
      <div className="edge">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_260px] lg:items-center lg:gap-16">
          <dl className="grid grid-cols-2 gap-y-10 sm:gap-x-8 lg:grid-cols-4">
            {STATS.map((stat, i) => (
              <Reveal key={stat.label} delay={i * 0.08} y={26}>
                <dt className="sr-only">{stat.label}</dt>
                <dd>
                  <span className="display block text-[clamp(44px,6vw,76px)] leading-none">
                    <Counter value={stat.value} suffix={stat.suffix} />
                  </span>
                  <span className="mt-3 block text-[13px] font-medium">{stat.label}</span>
                  <span className="mt-1 block text-[12px] text-ink/45">{stat.sub}</span>
                </dd>
              </Reveal>
            ))}
          </dl>

          {/* Ball detail, drifting against the scroll */}
          <div className="relative hidden h-[220px] overflow-hidden rounded-[26px] bg-ink lg:block">
            <motion.img
              src={img('ballDark', { w: 420, h: 520 })}
              alt=""
              style={{ y: reduced ? 0 : stripY }}
              className="absolute inset-0 h-[135%] w-full object-cover"
            />
            <div className="absolute inset-0 flex items-end p-5">
              <p className="text-[12px] leading-snug text-white/80">
                Every ball pressure-checked
                <br />
                before it reaches a court.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
