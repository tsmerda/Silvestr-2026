import { locations, scoreLabels } from '../data'
import { Section } from './ui/Section'
import { ScoreBar } from './ui/ScoreBar'

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
            className="flex flex-col rounded-2xl border border-white/10 bg-white/5 p-6 transition hover:-translate-y-1 hover:border-water/40 hover:shadow-xl hover:shadow-water/5"
          >
            <h3 className="text-2xl font-black tracking-tight">{loc.name}</h3>
            <p className="mt-2 text-slate-200">{loc.vibe}</p>
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
          </article>
        ))}
      </div>
    </Section>
  )
}
