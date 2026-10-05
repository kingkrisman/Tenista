/** Module-level handle on the Lenis instance so anything can drive the page. */
let instance = null

export function setLenis(l) {
  instance = l
}

export function getLenis() {
  return instance
}

export function scrollTo(target, options = {}) {
  if (instance) {
    instance.scrollTo(target, { duration: 1.4, ...options })
    return
  }
  // Lenis not mounted (reduced motion / touch) — fall back to the platform.
  const el = typeof target === 'string' ? document.querySelector(target) : target
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

export function stopScroll() {
  instance?.stop()
}

export function startScroll() {
  instance?.start()
}
