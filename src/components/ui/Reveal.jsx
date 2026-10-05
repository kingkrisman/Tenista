import { motion, useReducedMotion } from 'framer-motion'

const EASE = [0.16, 1, 0.3, 1]

/** Generic on-scroll entrance: rises, settles, never repeats. */
export function Reveal({
  children,
  delay = 0,
  y = 34,
  duration = 0.9,
  className = '',
  once = true,
  amount = 0.35,
  ...rest
}) {
  const reduced = useReducedMotion()

  return (
    <motion.div
      className={className}
      initial={reduced ? false : { opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, amount }}
      transition={{ duration, delay, ease: EASE }}
      {...rest}
    >
      {children}
    </motion.div>
  )
}

/** Wipes a clipping mask off an image while the image itself un-zooms. */
export function ImageReveal({ src, alt, className = '', imgClassName = '', delay = 0 }) {
  const reduced = useReducedMotion()

  return (
    <motion.div
      className={`overflow-hidden ${className}`}
      initial={reduced ? false : { clipPath: 'inset(100% 0% 0% 0%)' }}
      whileInView={{ clipPath: 'inset(0% 0% 0% 0%)' }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 1.25, delay, ease: EASE }}
    >
      <motion.img
        src={src}
        alt={alt}
        loading="lazy"
        className={`h-full w-full object-cover ${imgClassName}`}
        initial={reduced ? false : { scale: 1.35 }}
        whileInView={{ scale: 1 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 1.6, delay, ease: EASE }}
      />
    </motion.div>
  )
}
