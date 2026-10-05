/**
 * Every Unsplash id below was fetched and eyeballed before it landed here —
 * they are all genuine tennis frames, not lucky 200s.
 */
const PHOTOS = {
  clayServe: 'photo-1554068865-24cecd4e34b8', // aerial clay court, player serving, long shadow
  ballDark: 'photo-1587280501635-68a0e82cd5ff', // yellow ball on black, water spray
  forehand: 'photo-1622279457486-62dcc4a431d6', // player mid-forehand, orange kit
  blueRacket: 'photo-1560012057-4372e14c5085', // racket + ball on blue hard court
  greenCourt: 'photo-1542144582-1ba00456b5e3', // racket on teal court, white line
  bluePlayer: 'photo-1595435934249-5df7ed86e1c0', // player seated on blue court, yellow cap
  throughNet: 'photo-1530915365347-e35b749a0381', // shot through the net, feet + racket
}

/** Build a sized Unsplash URL. */
export function img(key, { w = 1200, h, q = 78, crop = 'entropy' } = {}) {
  const id = PHOTOS[key] ?? key
  const parts = ['auto=format', 'fit=crop', `q=${q}`, `w=${w}`, `crop=${crop}`]
  if (h) parts.push(`h=${h}`)
  return `https://images.unsplash.com/${id}?${parts.join('&')}`
}

/** Deterministic portrait faces for avatar clusters and quote cards. */
export const face = (gender, n) => `https://randomuser.me/api/portraits/${gender}/${n}.jpg`

export { PHOTOS }
