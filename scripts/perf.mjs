/**
 * Scroll performance probe.
 *
 *   npm run build
 *   npm run preview -- --port 4174
 *   npm run perf                      # or: node scripts/perf.mjs <url>
 *
 * Drives real wheel input (so Lenis handles it the way a user would) and
 * samples frame deltas with an independent rAF loop. Absolute numbers are
 * pessimistic — headless Chromium rasterises in software — so read this as a
 * before/after signal on your own changes, not as the frame rate a visitor
 * gets. The style counts underneath are the useful part: they are the things
 * that actually cost money when they multiply.
 */
// Playwright is intentionally NOT a dependency of this project — it is only
// needed to run this probe, and keeping it out of package.json keeps the
// Vercel install lean. Install it on demand: npm i -D playwright
let chromium
try {
  ;({ chromium } = await import('playwright'))
} catch {
  console.error('This probe needs Playwright:\n\n  npm i -D playwright\n  npx playwright install chromium\n')
  process.exit(1)
}

const URL = process.argv[2] || 'http://localhost:4174/'

const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } })

const errors = []
page.on('pageerror', (e) => errors.push(String(e.message)))

await page.goto(URL, { waitUntil: 'networkidle', timeout: 60000 })
await page.waitForTimeout(4200) // let the preloader finish

const audit = await page.evaluate(() => {
  let backdrop = 0
  let blend = 0
  let willChange = 0
  for (const el of document.querySelectorAll('*')) {
    const s = getComputedStyle(el)
    if ((s.backdropFilter || s.webkitBackdropFilter || 'none') !== 'none') backdrop++
    if (s.mixBlendMode && s.mixBlendMode !== 'normal') blend++
    if (s.willChange && s.willChange !== 'auto') willChange++
  }
  const grain = document.querySelector('.grain')
  const r = grain?.getBoundingClientRect()
  return {
    backdropFilterEls: backdrop,
    blendModeEls: blend,
    willChangeEls: willChange,
    grainLayerMPx: r ? +((r.width * r.height) / 1e6).toFixed(1) : 0,
    animatedGrain: grain ? getComputedStyle(grain).animationName !== 'none' : false,
  }
})

await page.evaluate(() => {
  window.__frames = []
  window.__sampling = true
  let last = performance.now()
  const tick = (now) => {
    window.__frames.push(now - last)
    last = now
    if (window.__sampling) requestAnimationFrame(tick)
  }
  requestAnimationFrame(tick)
})

await page.mouse.move(720, 450)
for (let i = 0; i < 60; i++) {
  await page.mouse.wheel(0, 120)
  await page.waitForTimeout(40)
}

const frames = await page.evaluate(() => {
  window.__sampling = false
  const f = window.__frames.slice(5)
  const sorted = [...f].sort((a, b) => a - b)
  const long = f.filter((v) => v > 32).length
  return {
    samples: f.length,
    medianMs: +sorted[Math.floor(sorted.length / 2)].toFixed(1),
    p95Ms: +sorted[Math.floor(sorted.length * 0.95)].toFixed(1),
    worstMs: +sorted[sorted.length - 1].toFixed(1),
    pctFramesOver32ms: +((long / f.length) * 100).toFixed(1),
  }
})

console.log(JSON.stringify({ url: URL, ...audit, ...frames, errors }, null, 2))
await browser.close()
