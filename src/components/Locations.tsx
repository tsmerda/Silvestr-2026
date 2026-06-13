import { locations, scoreLabels } from '../data'
import { Section } from './ui/Section'
import { ScoreBar } from './ui/ScoreBar'
import { SmartImage } from './ui/SmartImage'

export function Locations() {
  return (
    <Section
      id="lokality"
      eyebrow="Kam přesně"
      title="Čtyři jezera, jeden vítěz"
      subtitle="Každé má trochu jiný vibe. Vyber si, podle čeho jdeš – voda, kolo, nebo večer."
    >
      <div className="grid gap-5 sm:grid-cols-2">
        {locations.map((loc) => (
          <article
            key={loc.id}
            className="group flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-white/5 transition hover:-translate-y-1 hover:border-water/40 hover:shadow-xl hover:shadow-water/5"
          >
            <div className="relative h-44 overflow-hidden">
              <SmartImage
                src={loc.image}
                alt={loc.name}
                fallback="bg-gradient-to-br from-teal-800 via-slate-800 to-slate-900"
                className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/20 to-transparent" />
              <h3 className="absolute bottom-3 left-5 text-2xl font-black tracking-tight drop-shadow">
                {loc.name}
              </h3>
            </div>

            <div className="flex flex-1 flex-col p-6 pt-5">
              <p className="text-slate-200">{loc.vibe}</p>
              <p className="mt-1 text-sm text-slate-400">
                <span className="font-semibold text-nature">Pro koho:</span>{' '}
                {loc.forWho}
              </p>

              <div className="mt-5 space-y-2.5 border-t border-white/10 pt-5">
                {scoreLabels.map((s) => (
                  <ScoreBar
                    key={s.key}
                    emoji={s.emoji}
                    label={s.label}
                    value={loc.scores[s.key]}
                  />
                ))}
              </div>
            </div>
          </article>
        ))}
      </div>
    </Section>
  )
}
