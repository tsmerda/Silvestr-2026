import { budget } from '../data'
import { Section } from './ui/Section'

export function Budget() {
  return (
    <Section
      id="rozpocet"
      eyebrow="Kolik to dá"
      title="Rozpočet na osobu"
      subtitle="Orientačně, ať víš, do čeho jdeš. Nic drahého, nic šíleného."
    >
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {budget.map((b, i) => (
          <div
            key={b.label}
            className={`rounded-2xl border p-6 transition hover:-translate-y-1 ${
              i === budget.length - 1
                ? 'border-sun/40 bg-gradient-to-br from-sun/15 to-transparent'
                : 'border-white/10 bg-white/5 hover:border-water/40'
            }`}
          >
            <div className="text-3xl">{b.emoji}</div>
            <div className="mt-3 text-sm text-slate-300">{b.label}</div>
            <div
              className={`mt-1 text-2xl font-black ${
                i === budget.length - 1 ? 'text-sun' : 'text-white'
              }`}
            >
              {b.value}
            </div>
          </div>
        ))}
      </div>

      <p className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-5 text-slate-300">
        💡 <span className="font-semibold text-white">Tip:</span> Čím dřív vezmeme
        apartmán pro 5, tím větší šance na dobrou cenu a lokalitu u vody.
      </p>
    </Section>
  )
}
