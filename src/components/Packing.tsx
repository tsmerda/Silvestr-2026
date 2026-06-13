import { packing } from '../data'
import { Section } from './ui/Section'

export function Packing() {
  return (
    <Section
      id="vybaveni"
      eyebrow="Ať na nic nezapomeneš"
      title="Co si vzít"
      subtitle="Tři hromádky. Naházej do tašky a hotovo."
    >
      <div className="grid gap-5 md:grid-cols-3">
        {packing.map((col) => (
          <div
            key={col.title}
            className="rounded-2xl border border-white/10 bg-white/5 p-6 transition hover:border-water/40"
          >
            <h3 className="flex items-center gap-2 text-xl font-bold">
              <span className="text-2xl">{col.emoji}</span> {col.title}
            </h3>
            <ul className="mt-4 space-y-2">
              {col.items.map((item) => (
                <li key={item} className="flex items-center gap-3 text-slate-300">
                  <span className="text-water">✓</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </Section>
  )
}
