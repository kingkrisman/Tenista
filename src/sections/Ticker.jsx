import { Marquee } from '../components/ui/Marquee'
import { Flower } from '../components/ui/Logo'

const ITEMS = [
  'Private Coaching',
  'Clay & Hard Courts',
  'Junior Academy',
  'Serve Lab',
  'Match Play League',
  'Open 06:00 — 23:00',
]

export function Ticker() {
  return (
    <div className="relative z-10 -mt-px border-y border-ink/10 bg-ink py-5 text-smoke">
      <Marquee
        baseVelocity={3}
        itemClassName="flex items-center gap-8 whitespace-nowrap px-8 font-display text-[clamp(20px,3vw,38px)] font-medium tracking-tight"
      >
        {ITEMS.map((item) => (
          <>
            {item}
            <Flower className="h-5 w-5 shrink-0 text-ball" />
          </>
        ))}
      </Marquee>
    </div>
  )
}
