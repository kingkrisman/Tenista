import { useState } from 'react'
import { motion, useMotionValueEvent, useScroll } from 'framer-motion'
import { Logo } from './ui/Logo'
import { Magnetic } from './ui/Magnetic'
import { NAV } from '../lib/content'
import { scrollTo } from '../lib/scroll'

/** Sticky header that retracts on the way down and returns on the way up. */
export function Nav({ onOpenMenu, menuOpen }) {
  const { scrollY } = useScroll()
  const [hidden, setHidden] = useState(false)
  const [solid, setSolid] = useState(false)

  useMotionValueEvent(scrollY, 'change', (y) => {
    const prev = scrollY.getPrevious() ?? 0
    setHidden(y > prev && y > 420 && !menuOpen)
    setSolid(y > window.innerHeight * 0.88)
  })

  const tone = solid && !menuOpen ? 'text-ink' : 'text-white'

  const go = (e, href) => {
    e.preventDefault()
    scrollTo(href)
  }

  return (
    <motion.header
      initial={{ y: -120 }}
      animate={{ y: hidden ? -120 : 0 }}
      transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
      className="fixed inset-x-0 top-0 z-50"
    >
      <motion.div
        animate={{
          backgroundColor: solid && !menuOpen ? 'rgba(242,242,240,0.82)' : 'rgba(242,242,240,0)',
          borderColor: solid && !menuOpen ? 'rgba(11,11,13,0.08)' : 'rgba(11,11,13,0)',
        }}
        transition={{ duration: 0.4 }}
        // Only frost the bar once it actually has a background. Over the hero
        // the bar is transparent, so the blur would cost a full-width
        // backdrop-filter pass for no visible benefit.
        className={`border-b ${solid && !menuOpen ? 'backdrop-blur-lg' : ''}`}
      >
        <nav className={`edge flex h-[68px] items-center justify-between ${tone} transition-colors duration-300`}>
          {/* Left — section links */}
          <div className="hidden flex-1 items-center gap-8 md:flex">
            {NAV.map((item) => (
              <a
                key={item.label}
                href={item.href}
                onClick={(e) => go(e, item.href)}
                className="group max-w-[7.5rem] text-[12px] leading-tight opacity-80 transition-opacity hover:opacity-100"
              >
                <span className="bg-[linear-gradient(currentColor,currentColor)] bg-[length:0%_1px] bg-left-bottom bg-no-repeat pb-[2px] transition-[background-size] duration-500 ease-swift group-hover:bg-[length:100%_1px]">
                  {item.label}
                </span>
              </a>
            ))}
          </div>

          {/* Center — wordmark */}
          <a
            href="#top"
            onClick={(e) => go(e, '#top')}
            className="flex-1 md:flex md:justify-center"
            aria-label="Tenista home"
          >
            <Logo />
          </a>

          {/* Right — CTA + menu toggle */}
          <div className="flex flex-1 items-center justify-end gap-4">
            <a
              href="#contact"
              onClick={(e) => go(e, '#contact')}
              className="hidden text-[12px] underline decoration-1 underline-offset-4 opacity-80 transition-opacity hover:opacity-100 sm:block"
            >
              LET&apos;S TALK
            </a>
            <Magnetic strength={0.4}>
              <button
                type="button"
                onClick={onOpenMenu}
                aria-label={menuOpen ? 'Close menu' : 'Open menu'}
                aria-expanded={menuOpen}
                data-cursor="link"
                className={`relative flex h-11 w-11 items-center justify-center rounded-full border transition-colors duration-300 ${
                  solid && !menuOpen
                    ? 'border-ink/15 bg-ink text-smoke'
                    : 'border-white/25 bg-white/12 text-white backdrop-blur-md'
                }`}
              >
                <span className="flex h-3 w-4 flex-col justify-between">
                  <motion.span
                    animate={{ rotate: menuOpen ? 45 : 0, y: menuOpen ? 5 : 0 }}
                    className="block h-[1.5px] w-full bg-current"
                  />
                  <motion.span
                    animate={{ opacity: menuOpen ? 0 : 1 }}
                    className="block h-[1.5px] w-full bg-current"
                  />
                  <motion.span
                    animate={{ rotate: menuOpen ? -45 : 0, y: menuOpen ? -5 : 0 }}
                    className="block h-[1.5px] w-full bg-current"
                  />
                </span>
              </button>
            </Magnetic>
          </div>
        </nav>
      </motion.div>
    </motion.header>
  )
}
