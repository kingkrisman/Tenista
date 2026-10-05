import { img, face } from './media'

export const NAV = [
  { label: 'Coach And Schedule', href: '#coaches' },
  { label: 'Partner & Events', href: '#facilities' },
]

export const MENU = [
  { label: 'Home', href: '#top', meta: '01', image: img('bluePlayer', { w: 520, h: 670 }) },
  { label: 'Coaching', href: '#coaches', meta: '02', image: img('forehand', { w: 520, h: 670 }) },
  { label: 'Facilities', href: '#facilities', meta: '03', image: img('clayServe', { w: 520, h: 670 }) },
  { label: 'Programs', href: '#programs', meta: '04', image: img('throughNet', { w: 520, h: 670 }) },
  { label: 'Membership', href: '#membership', meta: '05', image: img('greenCourt', { w: 520, h: 670 }) },
  { label: 'Contact', href: '#contact', meta: '06', image: img('ballDark', { w: 520, h: 670 }) },
]

export const HERO_NAMES = [
  { name: 'Mark', surname: 'Louis' },
  { name: 'Smith', surname: 'Alex' },
  { name: 'Elson', surname: 'Dekosta' },
]

export const COLLECTIONS = [
  {
    brand: 'Wilson x Minion',
    title: 'Featured Collections',
    copy: 'Play with the frame the tour plays with, fitted and strung in-house.',
    image: img('blueRacket', { w: 170, h: 170 }),
  },
  {
    brand: 'Babolat Pure',
    title: 'Season Drop 04',
    copy: 'A stiffer layup for flatter hitters. Demo any frame for a week.',
    image: img('ballDark', { w: 170, h: 170 }),
  },
  {
    brand: 'Head Speed',
    title: 'Members Only',
    copy: 'Club pricing on every restring, same day, by the people who coach you.',
    image: img('greenCourt', { w: 170, h: 170 }),
  },
]

export const COACHES = [
  {
    name: 'Kristin Watson',
    role: 'Personal Trainer',
    years: '12 yrs',
    spec: 'Serve mechanics',
    image: img('bluePlayer', { w: 720, h: 960, crop: "faces" }),
  },
  {
    name: 'Marcus Rowe',
    role: 'Head Of Performance',
    years: '18 yrs',
    spec: 'Match craft',
    image: img('forehand', { w: 720, h: 960 }),
  },
  {
    name: 'Adaeze Okoro',
    role: 'Clay Specialist',
    years: '9 yrs',
    spec: 'Movement and slide',
    image: img('clayServe', { w: 720, h: 960 }),
  },
  {
    name: 'Tomas Ilic',
    role: 'Junior Academy Lead',
    years: '14 yrs',
    spec: 'Development',
    image: img('throughNet', { w: 720, h: 960 }),
  },
]

export const COURTS = [
  {
    name: 'Grand Ace Court',
    copy: 'A modern hard court built for high-tempo drilling, with tour-grade lighting after dark.',
    surface: 'Clay',
    image: img('clayServe', { w: 680, h: 880 }),
  },
  {
    name: 'Serena Arena',
    copy: 'An open-air clay court designed for long rallies, footwork sessions and slide work.',
    surface: 'Hard',
    image: img('bluePlayer', { w: 680, h: 880 }),
  },
  {
    name: 'Baseline Hall',
    copy: 'Six indoor cushioned bays, climate held at 21 degrees, so the season never stops.',
    surface: 'Indoor',
    image: img('blueRacket', { w: 680, h: 880 }),
  },
  {
    name: 'The Net Room',
    copy: 'Video-tracked practice wall with ball machines that learn the pattern you keep missing.',
    surface: 'Lab',
    image: img('throughNet', { w: 680, h: 880 }),
  },
  {
    name: 'Greenside Lawn',
    copy: 'Two grass courts kept at 8mm through summer. The members ballot opens every April.',
    surface: 'Grass',
    image: img('greenCourt', { w: 680, h: 880 }),
  },
]

export const PROGRAMS = [
  {
    id: '01',
    title: 'Private Coaching',
    copy: 'One-to-one blocks with a dedicated coach, video review after every third session.',
    price: 'from $90 / hr',
    image: img('forehand', { w: 520, h: 620 }),
  },
  {
    id: '02',
    title: 'Squad Drilling',
    copy: 'Four players, ninety minutes, live-ball patterns at match intensity. Ranked by level.',
    price: 'from $34 / session',
    image: img('clayServe', { w: 520, h: 620 }),
  },
  {
    id: '03',
    title: 'Junior Academy',
    copy: 'Ages 7 to 17 on a year-round pathway, from red ball through to national tournaments.',
    price: 'from $260 / term',
    image: img('throughNet', { w: 520, h: 620 }),
  },
  {
    id: '04',
    title: 'Serve Lab',
    copy: 'High-speed capture, force plates and a rebuild of your motion over six weeks.',
    price: 'from $420 / block',
    image: img('ballDark', { w: 520, h: 620 }),
  },
  {
    id: '05',
    title: 'Match Play League',
    copy: 'A club ladder with monthly fixtures, umpired finals and a table nobody takes lightly.',
    price: 'included',
    image: img('greenCourt', { w: 520, h: 620 }),
  },
]

export const STATS = [
  { value: 18, suffix: 'K+', label: 'Members on court', sub: 'across nine clubs' },
  { value: 42, suffix: '', label: 'Coaches accredited', sub: 'LTA and PTR certified' },
  { value: 96, suffix: '%', label: 'Renew each season', sub: 'measured over five years' },
  { value: 24, suffix: '/7', label: 'Court access', sub: 'for full members' },
]

export const TESTIMONIALS = [
  {
    quote:
      'Six weeks in the serve lab did what four years of lessons never managed. I finally understand what my own arm is doing.',
    name: 'Priya Raman',
    role: 'Member since 2021',
    avatar: face('women', 44),
  },
  {
    quote:
      'The squads are ruthless in the best way. You get put with people slightly better than you, and you quietly improve.',
    name: 'Daniel Okafor',
    role: 'Club ladder #3',
    avatar: face('men', 32),
  },
  {
    quote:
      'My daughter joined the junior academy at nine. She is fourteen now and travels for tournaments. They built that.',
    name: 'Helena Brandt',
    role: 'Parent, junior academy',
    avatar: face('women', 68),
  },
]

export const PLANS = [
  {
    name: 'Off-Peak',
    price: '48',
    cadence: '/ month',
    copy: 'Courts before 4pm on weekdays. Ideal if your schedule is your own.',
    perks: ['Weekday court booking', 'Two squad sessions', 'Restring at club rate'],
    featured: false,
  },
  {
    name: 'Full Court',
    price: '96',
    cadence: '/ month',
    copy: 'Everything, all hours, plus a coach who actually tracks your season.',
    perks: [
      'Unlimited 24/7 access',
      'Unlimited squad drilling',
      'Quarterly performance review',
      'Guest passes each month',
    ],
    featured: true,
  },
  {
    name: 'Performance',
    price: '180',
    cadence: '/ month',
    copy: 'For players with a calendar of fixtures and something to prove.',
    perks: [
      'All Full Court benefits',
      'Weekly private coaching',
      'Serve lab and video capture',
      'Tournament travel support',
    ],
    featured: false,
  },
]

export const AVATARS = [face('men', 12), face('women', 26), face('men', 55), face('women', 9)]
