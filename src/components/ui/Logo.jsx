export function Flower({ className = '' }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M12 1.8c1.66 0 3 1.34 3 3 0 .5-.12.96-.33 1.38.42-.21.89-.33 1.38-.33 1.66 0 3 1.34 3 3s-1.34 3-3 3c-.49 0-.96-.12-1.38-.33.21.42.33.89.33 1.38 0 1.66-1.34 3-3 3s-3-1.34-3-3c0-.49.12-.96.33-1.38-.42.21-.89.33-1.38.33-1.66 0-3-1.34-3-3s1.34-3 3-3c.49 0 .96.12 1.38.33A2.98 2.98 0 0 1 9 4.8c0-1.66 1.34-3 3-3z" />
      <circle cx="12" cy="8.8" r="1.5" fill="none" />
      <path d="M11.1 14.6h1.8l.5 7.6h-2.8l.5-7.6z" />
    </svg>
  )
}

export function Logo({ className = '', mark = 'h-5 w-5' }) {
  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <Flower className={mark} />
      <span className="font-display text-[15px] font-semibold tracking-[0.18em]">TENISTA</span>
    </span>
  )
}
