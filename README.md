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

## Notes

- Verified with headless Chromium at 1440 / 1280 / 834 / 390 px and in reduced-motion
  mode: no console errors, no horizontal overflow, no broken images.
- `playwright` is in `devDependencies` purely for `scripts/perf.mjs`. Nothing in the
  site needs it — `npm remove playwright playwright-core` if you want it gone.
- `@rolldown/binding-win32-x64-msvc` is pinned in `devDependencies`. Vite 8 needs that
  native binary and npm did not pull it in on its own on this machine; if you move the
  project to macOS or Linux, delete it and reinstall so the right binding is fetched.
- Node 22.11 is installed here and Vite prints a warning asking for 22.12+. Builds and
  dev both work, but upgrading Node clears the warning.
