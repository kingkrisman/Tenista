import { motion, useReducedMotion } from 'framer-motion'

const EASE = [0.16, 1, 0.3, 1]

/**
 * Masked type reveal. Each unit sits in its own clipping box and slides up
 * from below the line, so the text appears to be uncovered rather than faded.
 */
export function SplitText({
  text,
  as: Tag = 'span',
  mode = 'word',
  stagger = 0.045,
  delay = 0,
  duration = 0.95,
  once = true,
  amount = 0.6,
  className = '',
  unitClassName = '',
}) {
  const reduced = useReducedMotion()
  const units = mode === 'char' ? Array.from(text) : text.split(' ')

  if (reduced) {
    return <Tag className={className}>{text}</Tag>
  }

  const MotionTag = motion.create ? motion.create(Tag) : motion[Tag]

  return (
    <MotionTag
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once, amount }}
      variants={{
        hidden: {},
        show: { transition: { staggerChildren: stagger, delayChildren: delay } },
      }}
      aria-label={text}
    >
      {units.map((unit, i) => (
        <span
          key={`${unit}-${i}`}
          aria-hidden="true"
          className="inline-block overflow-hidden align-bottom pb-[0.14em] -mb-[0.14em]"
        >
          <motion.span
            className={`inline-block ${unitClassName}`}
            variants={{
              hidden: { y: '115%', opacity: 0 },
              show: {
                y: '0%',
                opacity: 1,
                transition: { duration, ease: EASE },
              },
            }}
          >
            {unit === ' ' ? ' ' : unit}
            {mode === 'word' && i < units.length - 1 ? ' ' : ''}
          </motion.span>
        </span>
      ))}
    </MotionTag>
  )
}

/** Same reveal, but driven by a parent variant instead of its own viewport. */
export function SplitTextControlled({ text, mode = 'word', className = '', unitClassName = '' }) {
  const reduced = useReducedMotion()
  const units = mode === 'char' ? Array.from(text) : text.split(' ')

  if (reduced) return <span className={className}>{text}</span>

  return (
    <span className={className} aria-label={text}>
      {units.map((unit, i) => (
        <span
          key={`${unit}-${i}`}
          aria-hidden="true"
          className="inline-block overflow-hidden align-bottom pb-[0.14em] -mb-[0.14em]"
        >
          <motion.span
            className={`inline-block ${unitClassName}`}
            variants={{
              hidden: { y: '115%', opacity: 0 },
              show: { y: '0%', opacity: 1, transition: { duration: 1.05, ease: EASE } },
            }}
          >
            {unit === ' ' ? ' ' : unit}
            {mode === 'word' && i < units.length - 1 ? ' ' : ''}
          </motion.span>
        </span>
      ))}
    </span>
  )
}
