import { PLANS } from '../lib/content'
import { SplitText } from '../components/ui/SplitText'
import { Reveal } from '../components/ui/Reveal'
import { TiltCard } from '../components/ui/TiltCard'
import { Magnetic } from '../components/ui/Magnetic'
import { Counter } from '../components/ui/Counter'
import { scrollTo } from '../lib/scroll'

export function Membership() {
  return (
    <section id="membership" className="bg-smoke pb-24 md:pb-32">
      <div className="edge">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <Reveal y={16}>
              <span className="eyebrow text-ink/40">Membership</span>
            </Reveal>
            <SplitText
              as="h2"
              text="Pick The Season You Want"
              className="display mt-3 max-w-[14ch] text-[40px] md:text-[64px]"
              stagger={0.05}
            />
          </div>
          <Reveal delay={0.15} y={18}>
            <p className="max-w-[32ch] text-[14px] leading-relaxed text-ink/55">
              No joining fee, no tie-in. Move between tiers whenever your schedule changes.
            </p>
          </Reveal>
        </div>

        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {PLANS.map((plan, i) => (
            <Reveal key={plan.name} delay={i * 0.1} y={40} amount={0.2}>
              <TiltCard
                max={7}
                className={`flex h-full flex-col rounded-[26px] p-7 transition-shadow duration-500 ${
                  plan.featured
                    ? 'bg-ink text-smoke shadow-[0_40px_80px_-40px_rgba(11,11,13,0.6)]'
                    : 'bg-white text-ink shadow-[0_24px_60px_-44px_rgba(11,11,13,0.45)]'
                }`}
              >
                {plan.featured && (
                  <span className="mb-4 inline-flex w-fit rounded-full bg-ball px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-ink">
                    Most chosen
                  </span>
                )}

                <h3 className="font-display text-[20px] font-semibold tracking-tight">
                  {plan.name}
                </h3>

                <p
                  className={`mt-1 text-[13px] leading-snug ${
                    plan.featured ? 'text-white/55' : 'text-ink/50'
                  }`}
                >
                  {plan.copy}
                </p>

                <p className="mt-7 flex items-baseline gap-1.5">
                  <span className="display text-[52px] leading-none">
                    $<Counter value={Number(plan.price)} />
                  </span>
                  <span
                    className={`text-[12px] ${plan.featured ? 'text-white/50' : 'text-ink/45'}`}
                  >
                    {plan.cadence}
                  </span>
                </p>

                <ul
                  className={`mt-7 space-y-3 border-t pt-6 text-[13px] ${
                    plan.featured ? 'border-white/15' : 'border-ink/10'
                  }`}
                >
                  {plan.perks.map((perk) => (
                    <li key={perk} className="flex items-start gap-2.5">
                      <span
                        className={`mt-[6px] h-[6px] w-[6px] shrink-0 rounded-full ${
                          plan.featured ? 'bg-ball' : 'bg-court-600'
                        }`}
                      />
                      <span className={plan.featured ? 'text-white/75' : 'text-ink/70'}>
                        {perk}
                      </span>
                    </li>
                  ))}
                </ul>

                <div className="mt-auto pt-8">
                  <Magnetic strength={0.25}>
                    <button
                      type="button"
                      onClick={() => scrollTo('#contact')}
                      data-cursor="link"
                      className={`w-full rounded-full py-3.5 text-[13px] font-medium transition-colors duration-300 ${
                        plan.featured
                          ? 'bg-ball text-ink hover:bg-white'
                          : 'bg-ink text-smoke hover:bg-court-600'
                      }`}
                    >
                      Choose {plan.name}
                    </button>
                  </Magnetic>
                </div>
              </TiltCard>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
