import { useCallback, useState } from 'react'
import { motion, useScroll, useSpring } from 'framer-motion'
import { useSmoothScroll } from './hooks/useSmoothScroll'
import { Preloader } from './components/Preloader'
import { Cursor } from './components/Cursor'
import { Nav } from './components/Nav'
import { MenuOverlay } from './components/MenuOverlay'
import { Hero } from './sections/Hero'
import { Ticker } from './sections/Ticker'
import { Trust } from './sections/Trust'
import { Coaches } from './sections/Coaches'
import { Facilities } from './sections/Facilities'
import { Programs } from './sections/Programs'
import { Stats } from './sections/Stats'
import { Testimonials } from './sections/Testimonials'
import { Membership } from './sections/Membership'
import { Contact } from './sections/Contact'

export default function App() {
  useSmoothScroll()
  const [ready, setReady] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  const handleDone = useCallback(() => setReady(true), [])

  return (
    <>
      {/* Unmounted once the curtain has finished. It used to stay in the tree
          forever as a full-screen fixed layer clipped to nothing. */}
      {!ready && <Preloader onDone={handleDone} />}
      <Cursor />
      <div className="grain" aria-hidden="true" />
      <ScrollProgress />

      <Nav onOpenMenu={() => setMenuOpen((v) => !v)} menuOpen={menuOpen} />
      <MenuOverlay open={menuOpen} onClose={() => setMenuOpen(false)} />

      <main>
        <Hero ready={ready} />
        <Ticker />
        <Trust />
        <Coaches />
        <Facilities />
        <Programs />
        <Stats />
        <Testimonials />
        <Membership />
      </main>

      <Contact />
    </>
  )
}

function ScrollProgress() {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, { stiffness: 220, damping: 40, restDelta: 0.001 })

  return (
    <motion.div
      style={{ scaleX }}
      className="fixed inset-x-0 top-0 z-[80] h-[2px] origin-left bg-ball"
      aria-hidden="true"
    />
  )
}
