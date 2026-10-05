# Tenista — tennis club landing page

An animated single-page site built from the supplied design reference, in React + Vite,
Tailwind CSS and Framer Motion, with Lenis for inertial scrolling.

```bash
npm install
npm run dev      # http://localhost:5173
npm run build
npm run preview
```

## Structure

```
src/
  App.jsx                  page composition + scroll progress bar
  lib/
    media.js               Unsplash ids and URL builder
    content.js             all copy and data for the page
    scroll.js              module-level Lenis handle (scrollTo / stop / start)
  hooks/
    useSmoothScroll.js     mounts Lenis, disabled under reduced motion
    useMediaQuery.js       useMediaQuery + useHasPointer
  components/
    Preloader.jsx          counter, bouncing ball, curtain wipe
    Cursor.jsx             dot + lagging ring, restyled per element
    Nav.jsx                retracts on scroll down, returns on scroll up
    MenuOverlay.jsx        full-screen menu with cursor-tracked previews
    ui/                    SplitText, Reveal, Magnetic, TiltCard,
                           Marquee, Counter, HighlightText, Logo
  sections/
    Hero, Ticker, Trust, Coaches, Facilities,
    Programs, Stats, Testimonials, Membership, Contact
```

## The animation work

| Where | What happens |
| --- | --- |
| Preloader | Counter to 100, ball bouncing across with a word cycle, then a clip-path curtain lifts |
| Cursor | Hard dot tracks 1:1, ring springs behind it; `data-cursor="view\|drag\|link"` and `data-cursor-label` restyle it per element |
| Hero | Per-letter masked reveal, image un-blurs from 26px, scroll-scrubbed parallax, corner radius and inset grow as you scroll, pointer parallax on the floating cards, looping speed streaks |
| Hero depth | A second copy of the photo is drawn over the headline through a radial mask centred on the player, so she stands *in front of* the type — the same figure/ground trick as the reference |
| Ticker | Seamless marquee that reads scroll velocity and reverses direction when you scroll back up |
| Trust | Rotating `textPath` seal, count-up numbers, and a paragraph that inks in word by word as it passes through the viewport |
| Coaches | Draggable card deck with spring physics, swipe/arrow-key/dot navigation, kinetic headlines sliding opposite ways on scroll |
| Facilities | Section pins and the court track scrolls horizontally, driven by vertical scroll, with a progress bar |
| Programs | Rows dim except the hovered one, title slides right, and a preview image follows the cursor *behind* the text |
| Membership | 3D tilt cards with a specular sheen tracking the pointer |
| Throughout | Magnetic buttons, masked text reveals, count-ups, a live Lagos clock |

Everything respects `prefers-reduced-motion`: Lenis and the pinned horizontal scroll are
skipped, and transforms collapse to their resting state.

## Images

The seven tennis photographs are hot-linked from Unsplash. Each id in `src/lib/media.js`
was fetched and visually checked before use, so none of them are placeholder or
off-subject shots. Avatars come from `randomuser.me`. Both are external services — if you
need the page to work offline or want to guarantee the assets, download them into
`public/` and point `img()` at the local paths.

## Performance

Measure before changing anything — `npm run build`, `npm run preview -- --port 4174`,
then `npm run perf`. The probe drives real wheel input and samples frame deltas.
Headless Chromium rasterises in software, so treat the numbers as a before/after
signal rather than the frame rate a visitor sees.

The first cut of this page scrolled at a median of **50ms per frame with 80% of frames
over 32ms**. It now sits at **16.7ms median, 10.8% over 32ms**. What was wrong, in
order of how much it cost:

1. **An animated full-screen grain overlay.** It was `500% x 500%` — a ~32 megapixel
   compositor layer running a stepped transform forever. Ablation put this at roughly
   half of all frame time on its own: animated 33.3ms vs 16.8ms static. It is now
   viewport-sized and still. A static grain measured the same as deleting it outright,
   so the texture costs nothing and the animation was the entire bill.
2. **`backdrop-filter` on things that move.** Nine elements had it, including all five
   court cards sliding through the pinned gallery. Blur is the most expensive common
   CSS effect and it recomputes whenever its backdrop shifts. `.glass` is now a plain
   gradient, `.glass-scrim` a dark scrim for captions over photos, and `.glass-blur` is
   opt-in — one element on the page uses it, and the nav only frosts once it has a
   background to frost.
3. **`will-change: transform` left on permanently.** Every word of every split heading
   was promoted to its own layer: 79 of them. Framer Motion promotes during animation
   by itself, so the hint only burned GPU memory. Down to one.
4. **`getBoundingClientRect()` on every `mousemove`.** The hero measured itself on
   pointer movement across the whole first screen, and `Magnetic`/`TiltCard` measured
   the very element they were transforming — a forced layout per event, plus a feedback
   loop that quietly damped both effects. Rects are now read on enter, or not at all.
5. **A second full-viewport `mix-blend-color` layer** in the hero, inside a
   scroll-transformed container, and **images fetched at up to 3.4x their display size**.
6. **The preloader never unmounted** — it stayed as a full-screen fixed layer clipped to
   nothing for the life of the page.

Two knobs if it still feels heavy on your machine: Lenis `duration` in
`src/hooks/useSmoothScroll.js` (now 0.9 — inertia reads as input lag even at a solid
60fps, and dropping `smoothWheel` gives you native scrolling), and the `.grain` rule,
which you can delete outright for a little more headroom.

Judge speed from `npm run preview`, not `npm run dev`: StrictMode double-renders every
component in development and Vite serves Framer Motion unminified.

## Node version

**This project needs Node 20.19+ or 22.12+.** Not a style preference — Vite 8 builds
through rolldown, which ships as a native binary per platform, and every one of those
binaries declares `engines: ^20.19.0 || >=22.12.0`. npm installs them as optional
dependencies, and it *skips optional dependencies whose engine check fails, silently*.
On Node 22.11 you therefore get a successful `npm install` and then:

```
Error: Cannot find native binding.
```

The message blames an npm bug and tells you to wipe `node_modules`. That is a red
herring here — reinstalling changes nothing, because the binary is being filtered out
on purpose. Upgrade Node and it resolves. `engines.node` in `package.json` pins the
same floor for Vercel.

This machine runs Node through [fnm](https://github.com/Schniz/fnm), installed per-user
with no admin rights. `.node-version` in this folder pins the major, and the PowerShell
profile at `Documents\WindowsPowerShell\Microsoft.PowerShell_profile.ps1` switches to it
on `cd`:

```powershell
fnm env --use-on-cd --shell power-shell | Out-String | Invoke-Expression
```

```
fnm list              # what is installed
fnm install 24        # add a version
fnm use 24            # switch this shell
fnm default 24        # switch new shells
```

The old Node 22.11 MSI is still in `C:\Program Files\nodejs` and is harmless — fnm comes
first on PATH. Uninstall it from Add/Remove Programs whenever you like.

Do not work around this by adding a `@rolldown/binding-*` package to `dependencies` by
hand. It forces the binary past the engine gate, so it looks like a fix, but the
package is platform-locked (`os: ["win32"]`) and a hard dependency with a mismatched
`os` fails the whole install with `EBADPLATFORM` — which means it builds on your
machine and breaks every Linux CI and deploy. Fix the Node version instead.

## Deploying

Vercel auto-detects Vite, but `vercel.json` states it anyway so the project settings
cannot drift: framework `vite`, build `npm run build`, output `dist`, install `npm ci`,
plus a long cache header on the fingerprinted `/assets` files. `engines.node` decides
the build image's Node version, and it has to stay at or above the floor in the section
above or the build dies on a missing native binding.

Nothing platform-specific belongs in `package.json`. The lockfile already carries every
rolldown and lightningcss binary for every platform as an optional dependency, so npm
picks the right one on whatever machine runs the install.

## Notes

- Verified with headless Chromium at 1440 / 1280 / 834 / 390 px and in reduced-motion
  mode: no console errors, no horizontal overflow, no broken images.
- `scripts/perf.mjs` needs Playwright, which is deliberately *not* a dependency — it
  would only slow the deploy install down. The script tells you how to add it.
