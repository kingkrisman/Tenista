import { useEffect, useState } from 'react'
import { AnimatePresence, motion, useMotionValue, useSpring } from 'framer-motion'
import { useHasPointer } from '../hooks/useMediaQuery'

/**
 * Two-part cursor: a hard dot that tracks 1:1 and a soft ring that lags behind.
 * Any element can restyle it with data-cursor="link|view|drag" and data-cursor-label.
 */
export function Cursor() {
  const hasPointer = useHasPointer()
  const [variant, setVariant] = useState('default')
  const [label, setLabel] = useState('')
  const [visible, setVisible] = useState(false)
  const [down, setDown] = useState(false)

  const x = useMotionValue(-100)
  const y = useMotionValue(-100)
  const ringX = useSpring(x, { stiffness: 320, damping: 28, mass: 0.6 })
  const ringY = useSpring(y, { stiffness: 320, damping: 28, mass: 0.6 })

  useEffect(() => {
    if (!hasPointer) return undefined

    document.body.classList.add('has-cursor')

    // Mirrors of the state, so the handlers can bail out without React work
    // and without having to sit in this effect's dependency list (which used
    // to tear down and re-bind every listener on the first pointer move).
    const seen = { visible: false, variant: 'default', label: '' }

    const onMove = (e) => {
      x.set(e.clientX)
      y.set(e.clientY)
      if (!seen.visible) {
        seen.visible = true
        setVisible(true)
      }
    }

    const onOver = (e) => {
      let nextVariant = 'default'
      let nextLabel = ''

      if (e.target instanceof Element) {
        const tagged = e.target.closest('[data-cursor]')
        if (tagged) {
          nextVariant = tagged.getAttribute('data-cursor') || 'link'
          nextLabel = tagged.getAttribute('data-cursor-label') || ''
        } else if (e.target.closest('a, button, input, [role="button"]')) {
          nextVariant = 'link'
        }
      }

      // Only re-render when the cursor actually changes character.
      if (nextVariant !== seen.variant) {
        seen.variant = nextVariant
        setVariant(nextVariant)
      }
      if (nextLabel !== seen.label) {
        seen.label = nextLabel
        setLabel(nextLabel)
      }
    }

    const onLeave = () => {
      seen.visible = false
      setVisible(false)
    }
    const onEnter = () => {
      seen.visible = true
      setVisible(true)
    }
    const onDown = () => setDown(true)
    const onUp = () => setDown(false)

    window.addEventListener('mousemove', onMove, { passive: true })
    window.addEventListener('mouseover', onOver, { passive: true })
    document.addEventListener('mouseleave', onLeave)
    document.addEventListener('mouseenter', onEnter)
    window.addEventListener('mousedown', onDown)
    window.addEventListener('mouseup', onUp)

    return () => {
      document.body.classList.remove('has-cursor')
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseover', onOver)
      document.removeEventListener('mouseleave', onLeave)
      document.removeEventListener('mouseenter', onEnter)
      window.removeEventListener('mousedown', onDown)
      window.removeEventListener('mouseup', onUp)
    }
  }, [hasPointer, x, y])

  if (!hasPointer) return null

  const isBig = variant === 'view' || variant === 'drag'
  const ringSize = isBig ? 86 : variant === 'link' ? 52 : 34

  return (
    <div className="pointer-events-none fixed inset-0 z-[90]" aria-hidden="true">
      <motion.div
        className="fixed left-0 top-0 rounded-full"
        style={{ x: ringX, y: ringY, translateX: '-50%', translateY: '-50%' }}
        animate={{
          width: ringSize,
          height: ringSize,
          opacity: visible ? 1 : 0,
          backgroundColor: isBig ? 'rgba(216,242,75,0.95)' : 'rgba(216,242,75,0)',
          borderColor: isBig ? 'rgba(216,242,75,0)' : 'rgba(255,255,255,0.75)',
          scale: down ? 0.82 : 1,
        }}
        transition={{ type: 'spring', stiffness: 320, damping: 26 }}
      >
        <div className="flex h-full w-full items-center justify-center rounded-full border-[1.2px] border-[inherit] mix-blend-difference" />
        <AnimatePresence>
          {isBig && label && (
            <motion.span
              key={label}
              initial={{ opacity: 0, scale: 0.7 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.7 }}
              className="absolute inset-0 flex items-center justify-center text-[10px] font-semibold uppercase tracking-[0.14em] text-ink"
            >
              {label}
            </motion.span>
          )}
        </AnimatePresence>
      </motion.div>

      <motion.div
        className="fixed left-0 top-0 h-[6px] w-[6px] rounded-full bg-white mix-blend-difference"
        style={{ x, y, translateX: '-50%', translateY: '-50%' }}
        animate={{ opacity: visible && !isBig ? 1 : 0, scale: down ? 1.6 : 1 }}
        transition={{ duration: 0.18 }}
      />
    </div>
  )
}
