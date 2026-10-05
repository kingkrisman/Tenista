import { useRef } from 'react'
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion'

/**
 * Paragraph that inks itself in word by word as the section scrolls through
 * the viewport — muted grey ahead of the playhead, full contrast behind it.
 */
export function HighlightText({ text, className = '', muted = 'text-ink/25' }) {
  const ref = useRef(null)
  const reduced = useReducedMotion()
  const words = text.split(' ')

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start 0.9', 'end 0.55'],
  })

  if (reduced) {
    return (
      <p ref={ref} className={className}>
        {text}
      </p>
    )
  }

  return (
    <p ref={ref} className={className}>
      {words.map((word, i) => (
        <Word
          key={`${word}-${i}`}
          progress={scrollYProgress}
          range={[i / words.length, (i + 1.6) / words.length]}
          muted={muted}
        >
          {word}
        </Word>
      ))}
    </p>
  )
}

function Word({ children, progress, range, muted }) {
  const opacity = useTransform(progress, range, [0, 1])
  return (
    <span className="relative mr-[0.28em] inline-block">
      <span className={muted}>{children}</span>
      <motion.span style={{ opacity }} className="absolute left-0 top-0 text-ink">
        {children}
      </motion.span>
    </span>
  )
}
